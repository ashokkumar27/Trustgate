from __future__ import annotations

import datetime as dt
import hashlib
import json
import os
import re
import subprocess
from pathlib import Path
from typing import Any
from urllib.parse import urlparse
from urllib.request import Request, urlopen

USER_AGENT = "TrustGate-Enterprise/1.0"
PACKAGE_SPEC_RE = re.compile(r"^(?P<name>[A-Za-z0-9_.\-]+?)(?:(==)(?P<version>[A-Za-z0-9_.!+\-]+))?$")
REQ_LINE_RE = re.compile(
    r"^(?P<name>[A-Za-z0-9_.\-]+)==(?P<version>[A-Za-z0-9_.!+\-]+)"
    r"(?:\s+--hash=(?P<hashalg>sha256):(?P<hashval>[A-Fa-f0-9]{64}))?$"
)
SEVERITY_ORDER = {"info": 0, "low": 1, "medium": 2, "high": 3, "critical": 4}


def parse_package_spec(spec: str) -> tuple[str, str | None]:
    m = PACKAGE_SPEC_RE.match(spec.strip())
    if not m:
        raise ValueError(f"Invalid package spec: {spec!r}. Use name==version.")
    return m.group("name"), m.group("version")


def parse_requirements_file(path: str) -> list[dict[str, str | None]]:
    out: list[dict[str, str | None]] = []
    for raw in Path(path).read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        m = REQ_LINE_RE.match(line)
        if not m:
            out.append({"raw": line, "name": None, "version": None, "hash": None, "valid": "false"})
            continue
        out.append(
            {
                "raw": line,
                "name": m.group("name"),
                "version": m.group("version"),
                "hash": m.group("hashval"),
                "valid": "true",
            }
        )
    return out


def http_get_json(url: str, timeout: int = 20) -> dict[str, Any]:
    req = Request(url, headers={"User-Agent": USER_AGENT})
    with urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def http_post_json(url: str, payload: dict[str, Any], timeout: int = 20) -> dict[str, Any]:
    req = Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"User-Agent": USER_AGENT, "Content-Type": "application/json"},
        method="POST",
    )
    with urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def http_head(url: str, timeout: int = 20) -> dict[str, Any]:
    req = Request(url, headers={"User-Agent": USER_AGENT}, method="HEAD")
    with urlopen(req, timeout=timeout) as resp:
        return {"status": getattr(resp, "status", None), "headers": dict(resp.headers)}


def iso_to_datetime(value: str | None) -> dt.datetime | None:
    if not value:
        return None
    try:
        return dt.datetime.fromisoformat(value.replace("Z", "+00:00"))
    except Exception:
        return None


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def which(binary: str) -> str | None:
    import shutil
    return shutil.which(binary)


def run_command(cmd: list[str], timeout: int = 120) -> tuple[int, str, str]:
    proc = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
    return proc.returncode, proc.stdout, proc.stderr


def hostname(url: str) -> str:
    return (urlparse(url).hostname or "").lower()


def load_json_file(path: str | None) -> dict[str, Any]:
    if not path:
        return {}
    p = Path(path)
    if not p.exists():
        raise FileNotFoundError(path)
    return json.loads(p.read_text(encoding="utf-8"))


def getenv_json(name: str) -> dict[str, Any]:
    raw = os.getenv(name, "").strip()
    if not raw:
        return {}
    return json.loads(raw)
