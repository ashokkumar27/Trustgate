from __future__ import annotations

import unittest
from unittest.mock import patch

from trustgate.engine import analyze_package, analyze_requirements, decide
from trustgate.models import Signal
from trustgate.sandbox import build_sandbox_command
from trustgate.utils import parse_package_spec, parse_requirements_file


class TestUtils(unittest.TestCase):
    def test_parse_package_spec_with_version(self) -> None:
        name, version = parse_package_spec("requests==2.32.3")
        self.assertEqual(name, "requests")
        self.assertEqual(version, "2.32.3")

    def test_parse_package_spec_without_version(self) -> None:
        name, version = parse_package_spec("requests")
        self.assertEqual(name, "requests")
        self.assertIsNone(version)


class TestDecisionEngine(unittest.TestCase):
    def test_unpinned_package_when_exact_pin_required_blocks(self) -> None:
        result = analyze_package("requests")
        self.assertEqual(result.decision, "sandbox")
        self.assertEqual(result.signals[0].name, "unpinned_version")
        self.assertEqual(result.signals[0].severity, "critical")

    def test_unpinned_package_when_exact_pin_disabled_allows_with_signal(self) -> None:
        result = analyze_package("requests", {"require_exact_pin": False})
        self.assertEqual(result.decision, "allow")
        self.assertEqual(result.signals[0].name, "unpinned_version")
        self.assertEqual(result.signals[0].severity, "high")

    def test_decide_blocking_signal_always_blocks(self) -> None:
        score, decision = decide(
            [Signal("yanked_release", "critical", 1, "x")],
            {"block_total_risk_gte": 100, "sandbox_total_risk_gte": 50},
        )
        self.assertEqual(decision, "block")
        self.assertEqual(score, 99)


class TestRequirements(unittest.TestCase):
    def test_parse_requirements_file_flags_invalid_lines(self) -> None:
        with patch("pathlib.Path.read_text", return_value="requests==2.32.3\nnot valid\n"):
            parsed = parse_requirements_file("requirements.txt")
        self.assertEqual(len(parsed), 2)
        self.assertEqual(parsed[1]["valid"], "false")

    def test_analyze_requirements_with_missing_hashes_blocks(self) -> None:
        with patch("pathlib.Path.read_text", return_value="requests==2.32.3\n"):
            result = analyze_requirements("requirements.txt")
        self.assertEqual(result.decision, "sandbox")
        self.assertTrue(any(s.name == "missing_hash_pins" for s in result.signals))


class TestSandbox(unittest.TestCase):
    def test_sandbox_command_contains_hardening_flags(self) -> None:
        cmd = build_sandbox_command("requests==2.32.3")
        self.assertIn("--read-only", cmd)
        self.assertIn("--cap-drop", cmd)
        self.assertIn("--network", cmd)


if __name__ == "__main__":
    unittest.main()
