from __future__ import annotations
import ast
import json
from urllib.error import HTTPError, URLError
import os
import re
import shutil
import tarfile
import tempfile
import zipfile
from pathlib import Path
from urllib.request import Request, urlopen

from .models import Signal
from .utils import USER_AGENT, hostname, http_get_json, http_post_json, iso_to_datetime, run_command, sha256_file, which

PYPI_VERSION_URL = "https://pypi.org/pypi/{name}/{version}/json"
OSV_QUERY_URL = "https://api.osv.dev/v1/query"
SCORECARD_API_BASE = "https://api.scorecard.dev"
SCORECARD_PROJECT_URL = SCORECARD_API_BASE + "/projects/{repo}"

SUSPICIOUS_STRING_PATTERNS = {
    "subprocess_exec": re.compile(r"\b(subprocess\.(run|Popen|call)|os\.system|pty\.spawn)\b"),
    "base64_decode": re.compile(r"\bbase64\.b64decode\b"),
    "marshal_exec": re.compile(r"\bmarshal\.loads\b"),
    "eval_exec": re.compile(r"\b(exec\(|eval\()"),
    "env_secret_access": re.compile(r"\b(os\.environ|getenv\(|\.env|AWS_|GCP_|AZURE_|OPENAI_API_KEY|ANTHROPIC_API_KEY)"),
    "credential_paths": re.compile(r"(\.ssh|id_rsa|known_hosts|\.kube|kubeconfig|docker\.json|\.npmrc|\.pypirc|netrc)"),
    "network_calls": re.compile(r"\b(requests\.|urllib\.|httpx\.|socket\.|aiohttp\.|websocket)"),
    "suspicious_shell": re.compile(r"\b(curl\s|wget\s|bash\s+-c|sh\s+-c|powershell\b)"),
}

IMPORTANT_SCORECARD_CHECKS = {
    "Binary-Artifacts",
    "Branch-Protection",
    "Code-Review",
    "Dangerous-Workflow",
    "Maintained",
    "Pinned-Dependencies",
    "Security-Policy",
    "Token-Permissions",
    "Vulnerabilities",
}

NETWORK_LIBS = {
    "requests", "httpx", "urllib3", "aiohttp", "websocket-client", "boto3", "botocore",
}

CLI_LIBS = {
    "click", "typer", "rich-click", "argcomplete",
}

PATTERN_WEIGHTS = {
    "subprocess_exec": 4,
    "base64_decode": 2,
    "marshal_exec": 10,
    "eval_exec": 10,
    "base64_exec_chain": 12,
    "env_secret_access": 2,
    "credential_paths": 4,
    "network_calls": 2,
    "startup_hooks": 15,
    "suspicious_shell": 10,
}

def _benign_patterns_for_package(package_name: str) -> set[str]:
    pkg = (package_name or "").lower()
    benign = set()
    if pkg in NETWORK_LIBS:
        benign.add("network_calls")
    if pkg in CLI_LIBS:
        benign.update({"env_secret_access", "subprocess_exec", "suspicious_shell"})
    if pkg in NETWORK_LIBS:
        benign.update({"env_secret_access", "credential_paths"})
    return benign

def _effective_matches(package_name: str, matches: list[str]) -> list[str]:
    benign = _benign_patterns_for_package(package_name)
    return [m for m in matches if m not in benign]

def fetch_pypi_metadata(name: str, version: str) -> dict:
    return http_get_json(PYPI_VERSION_URL.format(name=name, version=version))

def extract_repo_slug(metadata: dict) -> str | None:
    info = metadata.get("info", {})
    urls = list((info.get("project_urls") or {}).values())
    urls += [info.get("home_page") or "", info.get("project_url") or ""]
    for url in urls:
        if not url or "github.com/" not in url:
            continue
        repo = url.split("github.com/", 1)[1].strip("/")
        parts = repo.split("/")
        if len(parts) >= 2:
            return f"github.com/{parts[0]}/{parts[1]}"
    return None

def _normalize_scorecard_checks(data: dict) -> dict[str, float]:
    checks: dict[str, float] = {}
    for item in data.get("checks", []) or []:
        name = item.get("name")
        score = item.get("score")
        if name and isinstance(score, (int, float)):
            checks[name] = float(score)
    return checks

def _lowest_important_checks(checks: dict[str, float], limit: int = 5) -> list[str]:
    weak = [
        (name, score)
        for name, score in checks.items()
        if name in IMPORTANT_SCORECARD_CHECKS
    ]
    weak.sort(key=lambda x: x[1])
    return [f"{name}={score:.1f}" for name, score in weak[:limit]]

def _should_skip_pattern_scan(path: str) -> bool:
    lower = path.lower()
    if ".dist-info/" in lower or ".egg-info/" in lower:
        return True
    if lower.endswith(("metadata", "pkg-info", "record")):
        return True
    return False

def metadata_signals(metadata: dict, version: str, policy: dict) -> tuple[list[Signal], dict]:
    signals: list[Signal] = []
    info = metadata.get("info", {})
    urls = metadata.get("urls", [])
    release_times = [iso_to_datetime(u.get("upload_time_iso_8601")) for u in urls if u.get("upload_time_iso_8601")]
    release_time = min([x for x in release_times if x is not None], default=None)
    out = {
        "package": info.get("name"),
        "version": version,
        "summary": info.get("summary"),
        "author": info.get("author"),
        "requires_python": info.get("requires_python"),
        "license": info.get("license"),
        "repo": extract_repo_slug(metadata),
        "release_time": release_time.isoformat() if release_time else None,
    }

    if release_time:
        import datetime as dt
        age_hours = (dt.datetime.now(dt.timezone.utc) - release_time).total_seconds() / 3600
        out["release_age_hours"] = round(age_hours, 2)
        if age_hours < policy["block_release_age_lt_hours"]:
            signals.append(Signal("very_recent_release", "high", 30, "Release published within block window.", [f"age_hours={age_hours:.2f}"]))
        elif age_hours < policy["sandbox_release_age_lt_hours"]:
            signals.append(Signal("recent_release", "medium", 12, "Release published within sandbox window.", [f"age_hours={age_hours:.2f}"]))

    if info.get("yanked") and policy["block_on_yanked"]:
        signals.append(Signal("yanked_release", "critical", 35, "Release is yanked on PyPI."))

    if not info.get("requires_python"):
        signals.append(Signal("missing_requires_python", "low", 3, "Package metadata does not declare requires_python."))

    if not urls:
        signals.append(Signal("no_distribution_files", "high", 20, "No distribution files found."))

    if policy.get("require_internal_mirror"):
        public_hosts = sorted({hostname(u.get("url", "")) for u in urls if u.get("url")})
        if public_hosts:
            signals.append(
                Signal(
                    "public_registry_source",
                    "critical",
                    45,
                    "Package metadata resolves to public distribution hosts. Use internal mirror artifacts for install/build.",
                    public_hosts[:10],
                )
            )
            out["public_distribution_hosts"] = public_hosts[:10]

    return signals, out

def download_distribution(metadata: dict) -> tuple[Path, dict] | None:
    urls = metadata.get("urls", [])
    if not urls:
        return None
    chosen = next((u for u in urls if u.get("packagetype") == "bdist_wheel"), None) or next((u for u in urls if u.get("packagetype") == "sdist"), None)
    if not chosen:
        return None
    td = tempfile.mkdtemp(prefix="trustgate-archive-")
    path = Path(td) / chosen["filename"]
    req = Request(chosen["url"], headers={"User-Agent": USER_AGENT})
    with urlopen(req, timeout=60) as resp, path.open("wb") as f:
        shutil.copyfileobj(resp, f)
    meta = {"filename": chosen["filename"], "url": chosen["url"], "sha256": sha256_file(path), "size": path.stat().st_size}
    return path, meta

def inspect_distribution(archive_path: Path, policy: dict, package_name: str = "") -> tuple[list[Signal], dict]:
    signals: list[Signal] = []
    obs: dict = {"startup_hook_files": [], "suspicious_examples": [], "native_binaries": []}
    suspicious_score = 0

    def process_member(path: str, raw: bytes) -> None:
        nonlocal suspicious_score
        lower = path.lower()
        if _should_skip_pattern_scan(path):
            return
        
        if any(part in lower for part in ("/tests/", "/test/", "/docs/", "/examples/")):
            return
            
        base = os.path.basename(lower)
        if base.endswith(".pth") or base in {"sitecustomize.py", "usercustomize.py"}:
            obs["startup_hook_files"].append(path)
        if lower.endswith((".so", ".dll", ".dylib", ".exe")):
            obs["native_binaries"].append(path)
        if b"\x00" in raw[:2048]:
            return
        text = raw.decode("utf-8", errors="ignore")
        matched = []
        for label, pat in SUSPICIOUS_STRING_PATTERNS.items():
            if pat.search(text):
                matched.append(label)

        if lower.endswith(".py"):
            try:
                tree = ast.parse(text)
                for node in ast.walk(tree):
                    if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id in {"exec", "eval", "compile", "__import__"}:
                        if "base64_exec" not in matched:
                            matched.append("base64_exec")
            except Exception:
                pass

        effective = sorted(set(_effective_matches(package_name, matched)))
        if "suspicious_shell" in effective and "subprocess_exec" not in effective:
            effective = [m for m in effective if m != "suspicious_shell"]
        if "base64_decode" in effective and ("eval_exec" in effective or "marshal_exec" in effective):
            effective.append("base64_exec_chain")

        effective = sorted(set(m for m in effective if m != "base64_decode"))
        if effective:
            suspicious_score += sum(PATTERN_WEIGHTS.get(m, 3) for m in effective)
            if len(obs["suspicious_examples"]) < 12:
                obs["suspicious_examples"].append(f"{path}: {', '.join(effective)}")

    name = archive_path.name.lower()
    if name.endswith(".whl") or name.endswith(".zip"):
        with zipfile.ZipFile(archive_path, "r") as zf:
            for info in zf.infolist():
                if info.is_dir() or info.file_size > 2_000_000:
                    continue
                process_member(info.filename, zf.read(info.filename))
    else:
        with tarfile.open(archive_path, "r:*") as tf:
            for member in tf.getmembers():
                if not member.isfile() or member.size > 2_000_000:
                    continue
                f = tf.extractfile(member)
                if f:
                    process_member(member.name, f.read())

    if obs["startup_hook_files"] and policy["block_on_startup_hooks"]:
        signals.append(Signal("startup_hooks", "critical", 40, "Startup hook files detected.", obs["startup_hook_files"][:10]))

    if suspicious_score >= policy["block_on_suspicious_patterns_score_gte"]:
        signals.append(
            Signal(
                "suspicious_code_patterns",
                "high",
                min(35, suspicious_score),
                "Suspicious patterns exceeded threshold.",
                obs["suspicious_examples"][:10],
            )
        )
    elif suspicious_score >= 8:
        signals.append(
            Signal(
                "minor_suspicious_patterns",
                "medium",
                min(15, suspicious_score),
                "Suspicious patterns detected.",
                obs["suspicious_examples"][:10],
            )
        )
    if obs["native_binaries"] and policy["sandbox_on_native_binaries"]:
        signals.append(Signal("native_binaries_present", "medium", 8, "Package contains native binaries.", obs["native_binaries"][:10]))

    return signals, obs

def query_osv(name: str, version: str, policy: dict) -> tuple[list[Signal], dict]:
    try:
        data = http_post_json(OSV_QUERY_URL, {"package": {"name": name, "ecosystem": "PyPI"}, "version": version}, timeout=20)
    except Exception as e:
        return [Signal("osv_query_failed", "low", 2, "OSV query failed.", [str(e)])], {"osv_vulns": []}
    vulns = data.get("vulns") or []
    aliases = []
    for v in vulns[:10]:
        aliases.extend(v.get("aliases") or [v.get("id", "unknown")])
    signals = []
    if aliases and policy["sandbox_on_osv_findings"]:
        signals.append(Signal("osv_findings", "medium", 12, "Known advisories found in OSV.", aliases[:10]))
    return signals, {"osv_vulns": aliases[:10]}

def query_scorecard(repo: str | None, policy: dict) -> tuple[list[Signal], dict]:
    if not policy.get("scorecard_enabled", True):
        return [], {
            "scorecard": None,
            "scorecard_repo": repo,
            "scorecard_checks": {},
            "scorecard_api_url": None,
            "scorecard_lowest_checks": [],
        }

    if not repo:
        return [Signal("missing_repo_for_scorecard", "low", 1, "No GitHub repository found for Scorecard analysis.")], {
            "scorecard": None,
            "scorecard_repo": None,
            "scorecard_checks": {},
            "scorecard_api_url": None,
            "scorecard_lowest_checks": [],
        }

    url = SCORECARD_PROJECT_URL.format(repo=repo)

    try:
        data = http_get_json(url, timeout=20)
    except HTTPError as e:
        if e.code == 404:
            severity = "info" if not policy.get("scorecard_require_public_data", False) else "low"
            score = 0 if severity == "info" else 2
            return [Signal("scorecard_unavailable", severity, score, "Public Scorecard data is not available for this repository.", [repo])], {
                "scorecard": None,
                "scorecard_repo": repo,
                "scorecard_checks": {},
                "scorecard_api_url": url,
                "scorecard_lowest_checks": [],
            }
        return [Signal("scorecard_query_failed", "low", 1, "Scorecard query failed.", [f"http_{e.code}", repo])], {
            "scorecard": None,
            "scorecard_repo": repo,
            "scorecard_checks": {},
            "scorecard_api_url": url,
            "scorecard_lowest_checks": [],
        }
    except (URLError, TimeoutError, ValueError) as e:
        return [Signal("scorecard_query_failed", "low", 1, "Scorecard query failed.", [str(e)[:200], repo])], {
            "scorecard": None,
            "scorecard_repo": repo,
            "scorecard_checks": {},
            "scorecard_api_url": url,
            "scorecard_lowest_checks": [],
        }

    score = data.get("score")
    checks = _normalize_scorecard_checks(data)
    lowest_checks = _lowest_important_checks(checks)

    signals = []
    meta = {
        "scorecard": score,
        "scorecard_repo": repo,
        "scorecard_checks": checks,
        "scorecard_api_url": url,
        "scorecard_lowest_checks": lowest_checks,
    }

    if score is None:
        signals.append(Signal("scorecard_missing", "info", 0, "Scorecard data was returned without an overall score.", [repo]))
        return signals, meta

    if score < policy["weak_scorecard_threshold"] and policy["sandbox_on_weak_scorecard"]:
        evidence = [f"score={score:.1f}"]
        evidence.extend(lowest_checks)
        signals.append(
            Signal(
                "weak_scorecard",
                "medium",
                8,
                "OpenSSF Scorecard is below threshold.",
                evidence[:6],
            )
        )

    critical_weak = []
    for name in ("Dangerous-Workflow", "Token-Permissions", "Branch-Protection", "Code-Review"):
        val = checks.get(name)
        if val is not None and val < 5:
            critical_weak.append(f"{name}={val:.1f}")

    if critical_weak:
        signals.append(
            Signal(
                "scorecard_critical_checks_weak",
                "low",
                4,
                "Important Scorecard checks are weak.",
                critical_weak[:4],
            )
        )

    return signals, meta

def verify_sigstore_artifact(artifact_path: str, bundle_path: str | None, certificate_path: str | None, policy: dict) -> tuple[list[Signal], dict]:
    signals: list[Signal] = []
    meta: dict = {"sigstore_verified": False}
    if not policy.get("require_sigstore_for_artifacts"):
        return signals, meta

    cosign = which("cosign")
    if not cosign:
        return [Signal("cosign_missing", "critical", 35, "cosign is required for artifact verification but is not installed.")], meta

    cmd = [cosign, "verify-blob", artifact_path]
    if bundle_path:
        cmd.extend(["--bundle", bundle_path])
    if certificate_path:
        cmd.extend(["--certificate", certificate_path])
    for ident in policy.get("required_signer_identities", []):
        cmd.extend(["--certificate-identity", ident])
    for issuer in policy.get("required_oidc_issuers", []):
        cmd.extend(["--certificate-oidc-issuer", issuer])

    rc, out, err = run_command(cmd, timeout=60)
    meta["sigstore_command"] = cmd
    meta["sigstore_stdout"] = out[-4000:]
    meta["sigstore_stderr"] = err[-4000:]
    if rc != 0:
        signals.append(Signal("sigstore_verify_failed", "critical", 45, "Sigstore artifact verification failed.", [err.strip()[:500] or out.strip()[:500]]))
        return signals, meta
    meta["sigstore_verified"] = True
    return signals, meta

def verify_cosign_image(image_ref: str, policy: dict) -> tuple[list[Signal], dict]:
    signals: list[Signal] = []
    meta: dict = {"sigstore_verified": False, "image": image_ref}
    if not policy.get("require_sigstore_for_images"):
        return signals, meta
    cosign = which("cosign")
    if not cosign:
        return [Signal("cosign_missing", "critical", 35, "cosign is required for image verification but is not installed.")], meta

    cmd = [cosign, "verify", image_ref]
    for ident in policy.get("required_signer_identities", []):
        cmd.extend(["--certificate-identity", ident])
    for issuer in policy.get("required_oidc_issuers", []):
        cmd.extend(["--certificate-oidc-issuer", issuer])

    rc, out, err = run_command(cmd, timeout=90)
    meta["cosign_command"] = cmd
    meta["cosign_stdout"] = out[-4000:]
    meta["cosign_stderr"] = err[-4000:]
    if rc != 0:
        signals.append(Signal("image_sigstore_verify_failed", "critical", 45, "Sigstore image verification failed.", [err.strip()[:500] or out.strip()[:500]]))
        return signals, meta
    meta["sigstore_verified"] = True
    return signals, meta

def verify_slsa_provenance(attestation_path: str | None, policy: dict) -> tuple[list[Signal], dict]:
    signals: list[Signal] = []
    meta: dict = {"slsa_verified": False}
    if not policy.get("require_slsa_provenance"):
        return signals, meta
    if not attestation_path:
        return [Signal("slsa_missing", "critical", 40, "SLSA provenance is required but no attestation path was provided.")], meta

    p = Path(attestation_path)
    if not p.exists():
        return [Signal("slsa_missing", "critical", 40, "SLSA provenance file does not exist.", [attestation_path])], meta

    try:
        doc = json.loads(p.read_text(encoding="utf-8"))
    except Exception as e:
        return [Signal("slsa_parse_failed", "critical", 35, "Could not parse SLSA provenance JSON.", [str(e)])], meta

    build_def = doc.get("buildDefinition") or doc.get("predicate", {}).get("buildDefinition") or {}
    run_details = doc.get("runDetails") or doc.get("predicate", {}).get("runDetails") or {}
    builder = (run_details.get("builder") or {}).get("id") or ""
    meta["slsa_builder_id"] = builder
    if policy.get("required_slsa_builder_identities"):
        if builder not in policy["required_slsa_builder_identities"]:
            signals.append(Signal("slsa_builder_mismatch", "critical", 40, "SLSA builder identity is not approved.", [builder]))
            return signals, meta
    if not build_def and not run_details:
        signals.append(Signal("slsa_structure_missing", "critical", 35, "SLSA provenance is missing expected build fields."))
        return signals, meta

    meta["slsa_verified"] = True
    return signals, meta
