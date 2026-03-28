from __future__ import annotations

from pathlib import Path

from .analyzers import (
    download_distribution,
    fetch_pypi_metadata,
    inspect_distribution,
    metadata_signals,
    query_osv,
    query_scorecard,
    verify_cosign_image,
    verify_sigstore_artifact,
    verify_slsa_provenance,
)
from .models import AnalysisResult, Signal
from .policy import DEFAULT_POLICY, merge_policy
from .utils import SEVERITY_ORDER, load_json_file, parse_package_spec, parse_requirements_file


BLOCKING_SIGNAL_NAMES = {
    "yanked_release",
    "startup_hooks",
    "sigstore_verify_failed",
    "image_sigstore_verify_failed",
    "slsa_missing",
    "slsa_parse_failed",
    "slsa_builder_mismatch",
    "slsa_structure_missing",
}

SANDBOX_SIGNAL_NAMES = {
    "recent_release",
    "osv_findings",
    "native_binaries_present",
    "suspicious_code_patterns",
    "credential_harvest_patterns",
    "shell_exfil_patterns",
}

def decide(signals: list[Signal], policy: dict) -> tuple[int, str]:
    total_risk = sum(s.score for s in signals)
    trust_score = max(0, 100 - min(100, total_risk))

    signal_names = {s.name for s in signals}

    if signal_names & BLOCKING_SIGNAL_NAMES:
        return trust_score, "block"
    if total_risk >= policy["block_total_risk_gte"]:
        return trust_score, "block"

    if signal_names & SANDBOX_SIGNAL_NAMES:
        return trust_score, "sandbox"
    if total_risk >= policy["sandbox_total_risk_gte"]:
        return trust_score, "sandbox"

    return trust_score, "allow"


def _finalize(subject: str, signals: list[Signal], metadata: dict, policy: dict) -> AnalysisResult:
    signals = sorted(signals, key=lambda s: (SEVERITY_ORDER[s.severity], s.score), reverse=True)
    trust_score, decision = decide(signals, policy)
    top = "; ".join(f"{s.name}: {s.message}" for s in signals[:3]) if signals else "No major red flags found."
    summary = f"Decision: {decision}. {top}"
    return AnalysisResult(subject, trust_score, decision, summary, signals, metadata)


def analyze_package(spec: str, policy_override: dict | None = None) -> AnalysisResult:
    policy = merge_policy(DEFAULT_POLICY, policy_override or {})
    name, version = parse_package_spec(spec)
    signals: list[Signal] = []
    metadata_out: dict = {"policy": policy, "type": "python-package"}

    if not version:
        severity = "critical" if policy["require_exact_pin"] else "high"
        score = 50 if policy["require_exact_pin"] else 25
        message = "Exact version pin is required. Use name==version." if policy["require_exact_pin"] else "Version is not pinned. Provide name==version for deterministic and auditable analysis."
        signals.append(Signal("unpinned_version", severity, score, message))
        return _finalize(spec, signals, metadata_out, policy)
    if policy.get("critical_packages") and name in policy["critical_packages"]:
        metadata_out["critical_package"] = True

    try:
        pypi = fetch_pypi_metadata(name, version)
    except Exception as exc:
        signals.append(
            Signal(
                "metadata_fetch_failed",
                "high",
                35,
                "Package metadata could not be fetched from upstream index.",
                [f"{type(exc).__name__}: {exc}"][:1],
            )
        )
        return _finalize(f"{name}=={version}", signals, metadata_out, policy)

    meta_signals, meta_info = metadata_signals(pypi, version, policy)
    signals.extend(meta_signals)
    metadata_out.update(meta_info)

    dist = download_distribution(pypi)
    if dist:
        archive_path, archive_meta = dist
        archive_signals, archive_obs = inspect_distribution(archive_path, policy, package_name=name)
        signals.extend(archive_signals)
        metadata_out["distribution"] = archive_meta
        metadata_out["archive_observations"] = archive_obs
    else:
        signals.append(Signal("distribution_download_failed", "high", 20, "Could not download package distribution for inspection."))

    osv_signals, osv_meta = query_osv(name, version, policy)
    signals.extend(osv_signals)
    metadata_out.update(osv_meta)

    score_signals, score_meta = query_scorecard(metadata_out.get("repo"), policy)
    signals.extend(score_signals)
    metadata_out.update(score_meta)

    return _finalize(f"{name}=={version}", signals, metadata_out, policy)


def analyze_requirements(path: str, policy_override: dict | None = None) -> AnalysisResult:
    policy = merge_policy(DEFAULT_POLICY, policy_override or {})
    entries = parse_requirements_file(path)
    signals: list[Signal] = []
    metadata = {"policy": policy, "type": "requirements", "path": path, "entries": entries}

    invalid = [e["raw"] for e in entries if e["valid"] != "true"]
    if invalid:
        signals.append(Signal("invalid_requirement_lines", "critical", 40, "Requirements file contains invalid or unpinned lines.", invalid[:10]))

    if policy["require_hashes_in_requirements"]:
        unhashed = [e["raw"] for e in entries if e["valid"] == "true" and not e["hash"]]
        if unhashed:
            signals.append(Signal("missing_hash_pins", "critical", 45, "Requirements file must use --hash for every dependency.", unhashed[:10]))

    return _finalize(Path(path).name, signals, metadata, policy)


def verify_artifact(artifact_path: str, bundle_path: str | None, certificate_path: str | None, provenance_path: str | None, policy_override: dict | None = None) -> AnalysisResult:
    policy = merge_policy(DEFAULT_POLICY, policy_override or {})
    signals: list[Signal] = []
    metadata = {"policy": policy, "type": "artifact", "artifact_path": artifact_path}

    sig_signals, sig_meta = verify_sigstore_artifact(artifact_path, bundle_path, certificate_path, policy)
    signals.extend(sig_signals)
    metadata.update(sig_meta)

    slsa_signals, slsa_meta = verify_slsa_provenance(provenance_path, policy)
    signals.extend(slsa_signals)
    metadata.update(slsa_meta)

    return _finalize(Path(artifact_path).name, signals, metadata, policy)


def verify_image(image_ref: str, provenance_path: str | None, policy_override: dict | None = None) -> AnalysisResult:
    policy = merge_policy(DEFAULT_POLICY, policy_override or {})
    signals: list[Signal] = []
    metadata = {"policy": policy, "type": "image", "image": image_ref}

    approved = policy.get("approved_image_registries") or []
    registry = image_ref.split("/", 1)[0] if "/" in image_ref else image_ref
    if policy.get("approved_image_registries") and registry not in approved:
        signals.append(Signal("unapproved_registry", "critical", 45, "Container image registry is not approved.", [registry]))

    sig_signals, sig_meta = verify_cosign_image(image_ref, policy)
    signals.extend(sig_signals)
    metadata.update(sig_meta)

    slsa_signals, slsa_meta = verify_slsa_provenance(provenance_path, policy)
    signals.extend(slsa_signals)
    metadata.update(slsa_meta)

    return _finalize(image_ref, signals, metadata, policy)
