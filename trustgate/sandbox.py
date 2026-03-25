from __future__ import annotations

import shlex
import subprocess

def build_sandbox_command(package_spec: str, index_url: str | None = None, network_mode: str = "none") -> str:
    image = "python:3.11-slim"
    install = "pip install --upgrade pip setuptools wheel && "
    if index_url:
        install += f"pip install --index-url {shlex.quote(index_url)} {shlex.quote(package_spec)} && "
    else:
        install += f"pip install {shlex.quote(package_spec)} && "
    shell = (
        "python -m venv /tmp/venv && "
        "export PATH=/tmp/venv/bin:$PATH && "
        + install +
        "python - <<'PY'\n"
        "import pkgutil\n"
        "print('sandbox install ok')\n"
        "print(sorted([m.name for m in pkgutil.iter_modules()])[:20])\n"
        "PY"
    )
    cmd = [
        "docker", "run", "--rm",
        "--user", "10001:10001",
        "--read-only",
        "--tmpfs", "/tmp:rw,noexec,nosuid,size=512m",
        "--cap-drop", "ALL",
        "--security-opt", "no-new-privileges",
        "--pids-limit", "256",
        "--memory", "1024m",
        "--cpus", "1.0",
        "--network", network_mode,
        image,
        "sh", "-lc", shell,
    ]
    return " ".join(shlex.quote(x) for x in cmd)

def run_sandbox(package_spec: str, index_url: str | None = None, network_mode: str = "none") -> int:
    cmd = build_sandbox_command(package_spec, index_url=index_url, network_mode=network_mode)
    return subprocess.call(cmd, shell=True)
