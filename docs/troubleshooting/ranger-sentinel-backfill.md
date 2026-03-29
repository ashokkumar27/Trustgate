# Ranger Sentinel backfill: Drift 404 + Pandas Timestamp JSON error

## Symptoms

When running `uv run python main_backfill.py`:

- Drift backfill may warn with a `404` from:
  - `https://data.api.drift.trade/fundingRates?symbol=SOL-PERP`
- DB insert fails with:
  - `TypeError: Object of type Timestamp is not JSON serializable`
  - Raised while inserting into `protocol_snapshots.raw_json`.

## Root causes

1. **Drift endpoint/path or query shape changed**
   A 404 means the URL being queried is not valid for current API routing.

2. **Pandas `Timestamp` leaked into a JSON column payload**
   SQLAlchemy's JSON serializer uses Python's `json.dumps`, which does not handle `pd.Timestamp` by default.

## Practical fixes

### 1) Normalize payloads before DB write

Convert non-JSON-native values (timestamp, datetime, decimal, numpy types) in `raw_json` to JSON-safe values.

```python
import datetime as dt
import decimal
import math
import numpy as np
import pandas as pd


def _json_safe(value):
    if isinstance(value, pd.Timestamp):
        # preserve timezone if present
        return value.isoformat()
    if isinstance(value, (dt.datetime, dt.date)):
        return value.isoformat()
    if isinstance(value, decimal.Decimal):
        return float(value)
    if isinstance(value, (np.integer,)):
        return int(value)
    if isinstance(value, (np.floating,)):
        f = float(value)
        return None if math.isnan(f) else f
    if isinstance(value, dict):
        return {str(k): _json_safe(v) for k, v in value.items()}
    if isinstance(value, (list, tuple, set)):
        return [_json_safe(v) for v in value]
    return value
```

Then before creating ORM rows:

```python
record["raw_json"] = _json_safe(record.get("raw_json"))
record["ts"] = record["ts"].to_pydatetime() if isinstance(record["ts"], pd.Timestamp) else record["ts"]
```

### 2) Keep backfill resilient to 404 on one source

If Drift funding endpoint fails, log and continue with other sources, but avoid emitting malformed rows:

- return an empty DataFrame on Drift fetch failure
- or set `raw_json` to a minimal serializable error object

```python
raw_json = {
    "source": "drift",
    "error": "funding endpoint returned 404",
    "symbol": symbol,
}
```

### 3) Re-check Drift API endpoint

Confirm the latest supported endpoint + parameters and update request URL accordingly. If endpoint changed, map your symbol format as required by current docs.

## Sanity checks

After patching, run:

```bash
uv run python - <<'PY'
import json
import pandas as pd
from datetime import timezone

obj = {"ts": pd.Timestamp.now(tz=timezone.utc)}

# Replace with your project helper
obj["ts"] = obj["ts"].isoformat()
json.dumps(obj)
print("JSON serialization OK")
PY
```

Then rerun backfill and verify no `Timestamp is not JSON serializable` error appears.
