from __future__ import annotations

from dataclasses import dataclass, field, asdict
from typing import Any


@dataclass
class Signal:
    name: str
    severity: str
    score: int
    message: str
    evidence: list[str] = field(default_factory=list)


@dataclass
class AnalysisResult:
    subject: str
    trust_score: int
    decision: str
    summary: str
    signals: list[Signal]
    metadata: dict[str, Any]

    def to_dict(self) -> dict[str, Any]:
        return {
            "subject": self.subject,
            "trust_score": self.trust_score,
            "decision": self.decision,
            "summary": self.summary,
            "signals": [asdict(s) for s in self.signals],
            "metadata": self.metadata,
        }
