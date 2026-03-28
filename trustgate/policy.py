from __future__ import annotations

from copy import deepcopy
from numbers import Real

DEFAULT_POLICY: dict = {
    "policy_version": 1,
    "scorecard_enabled": True,
    "scorecard_require_public_data": False,
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

POLICY_FIELD_TYPES: dict[str, tuple[type, ...]] = {
    "policy_version": (int,),
    "scorecard_enabled": (bool,),
    "scorecard_require_public_data": (bool,),
    "require_exact_pin": (bool,),
    "require_hashes_in_requirements": (bool,),
    "require_internal_mirror": (bool,),
    "approved_package_hosts": (list,),
    "approved_image_registries": (list,),
    "allow_public_fallback_for_analysis_only": (bool,),
    "block_release_age_lt_hours": (Real,),
    "sandbox_release_age_lt_hours": (Real,),
    "block_on_yanked": (bool,),
    "block_on_startup_hooks": (bool,),
    "block_on_suspicious_patterns_score_gte": (Real,),
    "sandbox_on_native_binaries": (bool,),
    "sandbox_on_osv_findings": (bool,),
    "sandbox_on_weak_scorecard": (bool,),
    "weak_scorecard_threshold": (Real,),
    "require_sigstore_for_artifacts": (bool,),
    "require_sigstore_for_images": (bool,),
    "required_signer_identities": (list,),
    "required_oidc_issuers": (list,),
    "require_slsa_provenance": (bool,),
    "required_slsa_builder_identities": (list,),
    "block_total_risk_gte": (Real,),
    "sandbox_total_risk_gte": (Real,),
    "sandbox_network_mode": (str,),
    "sandbox_readonly_rootfs": (bool,),
    "critical_packages": (list,),
}


def validate_policy(policy: dict) -> dict:
    unknown = sorted(k for k in policy if k not in POLICY_FIELD_TYPES)
    if unknown:
        raise ValueError(f"Unknown policy fields: {', '.join(unknown)}")

    for key, expected_types in POLICY_FIELD_TYPES.items():
        if key not in policy:
            raise ValueError(f"Missing required policy field: {key}")
        value = policy[key]
        if not isinstance(value, expected_types):
            expected = ", ".join(t.__name__ for t in expected_types)
            raise ValueError(f"Policy field {key!r} must be of type: {expected}")

    if policy["policy_version"] < 1:
        raise ValueError("policy_version must be >= 1")
    if policy["sandbox_total_risk_gte"] > policy["block_total_risk_gte"]:
        raise ValueError("sandbox_total_risk_gte cannot be greater than block_total_risk_gte")
    if policy["sandbox_release_age_lt_hours"] < policy["block_release_age_lt_hours"]:
        raise ValueError("sandbox_release_age_lt_hours cannot be lower than block_release_age_lt_hours")

    return policy


def merge_policy(base: dict, override: dict) -> dict:
    out = deepcopy(base)
    for k, v in (override or {}).items():
        out[k] = v
    return validate_policy(out)
