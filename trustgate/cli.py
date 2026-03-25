from __future__ import annotations

import argparse
import json
import sys

from .engine import analyze_package, analyze_requirements, verify_artifact, verify_image
from .policy import DEFAULT_POLICY
from .sandbox import build_sandbox_command, run_sandbox
from .utils import load_json_file


def print_report(result) -> None:
    print(f"Subject     : {result.subject}")
    print(f"Trust score : {result.trust_score}/100")
    print(f"Decision    : {result.decision.upper()}")
    print(f"Summary     : {result.summary}")
    print("\nSignals:")
    if not result.signals:
        print("  - None")
    for s in result.signals:
        print(f"  - [{s.severity.upper()}] {s.name} (+{s.score})")
        print(f"    {s.message}")
        for ev in s.evidence[:5]:
            print(f"    evidence: {ev}")


def emit(result, as_json: bool) -> int:
    if as_json:
        print(json.dumps(result.to_dict(), indent=2))
    else:
        print_report(result)
    return 0 if result.decision == "allow" else 1 if result.decision == "sandbox" else 2


def cmd_analyze(args: argparse.Namespace) -> int:
    policy = load_json_file(args.policy)
    result = analyze_package(args.package, policy_override=policy)
    rc = emit(result, args.json)
    if args.sandbox and result.decision in {"sandbox", "block"}:
        print("\nSandbox command:\n")
        print(build_sandbox_command(args.package, index_url=args.index_url, network_mode=args.network_mode))
        if args.run_sandbox:
            return run_sandbox(args.package, index_url=args.index_url, network_mode=args.network_mode)
    return rc


def cmd_analyze_requirements(args: argparse.Namespace) -> int:
    policy = load_json_file(args.policy)
    result = analyze_requirements(args.path, policy_override=policy)
    return emit(result, args.json)


def cmd_verify_artifact(args: argparse.Namespace) -> int:
    policy = load_json_file(args.policy)
    result = verify_artifact(args.artifact, args.bundle, args.certificate, args.provenance, policy_override=policy)
    return emit(result, args.json)


def cmd_verify_image(args: argparse.Namespace) -> int:
    policy = load_json_file(args.policy)
    result = verify_image(args.image, args.provenance, policy_override=policy)
    return emit(result, args.json)


def cmd_policy_show(args: argparse.Namespace) -> int:
    print(json.dumps(DEFAULT_POLICY, indent=2))
    return 0


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="trustgate", description="Enterprise dependency and artifact gatekeeper")
    sub = p.add_subparsers(dest="command", required=True)

    common = argparse.ArgumentParser(add_help=False)
    common.add_argument("--policy", help="Path to policy JSON")

    a = sub.add_parser("analyze", parents=[common], help="Analyze a pinned Python package")
    a.add_argument("package", help="Package spec, e.g. requests==2.32.3")
    a.add_argument("--json", action="store_true")
    a.add_argument("--sandbox", action="store_true")
    a.add_argument("--run-sandbox", action="store_true")
    a.add_argument("--index-url", help="Internal mirror index URL for sandbox install")
    a.add_argument("--network-mode", default="none", help="Docker network mode for sandbox")
    a.set_defaults(func=cmd_analyze)

    r = sub.add_parser("analyze-requirements", parents=[common], help="Validate requirements.txt pinning and hashes")
    r.add_argument("path")
    r.add_argument("--json", action="store_true")
    r.set_defaults(func=cmd_analyze_requirements)

    v = sub.add_parser("verify-artifact", parents=[common], help="Verify a local artifact with Sigstore and SLSA")
    v.add_argument("--artifact", required=True)
    v.add_argument("--bundle")
    v.add_argument("--certificate")
    v.add_argument("--provenance", required=True)
    v.add_argument("--json", action="store_true")
    v.set_defaults(func=cmd_verify_artifact)

    i = sub.add_parser("verify-image", parents=[common], help="Verify a container image with Cosign and SLSA")
    i.add_argument("--image", required=True)
    i.add_argument("--provenance", required=True)
    i.add_argument("--json", action="store_true")
    i.set_defaults(func=cmd_verify_image)

    s = sub.add_parser("policy-show", help="Show effective default policy")
    s.set_defaults(func=cmd_policy_show)
    return p


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
