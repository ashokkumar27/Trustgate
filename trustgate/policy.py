from __future__ import annotations

from copy import deepcopy

DEFAULT_POLICY: dict = {
    "require_exact_pin": True,
    "require_hashes_in_requirements": True,
    "require_internal_mirror": True,
    "approved_package_hosts": ["pypi.company.internal", "artifacts.company.internal"],
    "approved_image_registries": ["registry.company.internal"],
    "allow_public_fallback_for_analysis_only": True,
    "block_release_age_lt_hours": 24,
    "sandbox_release_age_lt_hours": 168,
    "block_on_yanked": True,
    "block_on_startup_hooks": True,
    "block_on_suspicious_patterns_score_gte": 12,
    "sandbox_on_native_binaries": True,
    "sandbox_on_osv_findings": True,
    "sandbox_on_weak_scorecard": True,
    "weak_scorecard_threshold": 7.5,
    "require_sigstore_for_artifacts": True,
    "require_sigstore_for_images": True,
    "required_signer_identities": [],
    "required_oidc_issuers": [],
    "require_slsa_provenance": True,
    "required_slsa_builder_identities": [],
    "block_total_risk_gte": 70,
    "sandbox_total_risk_gte": 30,
    "sandbox_network_mode": "none",
    "sandbox_readonly_rootfs": True,
    "critical_packages": [],
}

def merge_policy(base: dict, override: dict) -> dict:
    out = deepcopy(base)
    for k, v in (override or {}).items():
        out[k] = v
    return out
