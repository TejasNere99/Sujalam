# Sujalam Decision Engine

The **Decision Engine** is the central intelligence layer of Sujalam 2.0. It acts as the single source of truth for all agricultural decisions, ensuring that the Web Dashboard, REST API, and WhatsApp Bot all consume identical, deterministic logic.

## 1. Architecture
- **Location:** `server/decision/`
- **Execution:** Triggered exclusively via `AdvisoryService.refreshFarmAdvisory()`
- **Input:** Normalized signals from Farm, Soil, Weather, Market, and Crop Health services.
- **Output:** A strict, deterministic `FarmAdvisory` object (defined in `shared/types/index.ts`).

No logic is duplicated in the frontend or WhatsApp layers. They are purely presentational.

---

## 2. Decision Logic & Thresholds

### 2.1 Irrigation Decision (`irrigationDecision.ts`)
Calculates water requirement based on current soil moisture and upcoming rain probability.

| Soil Moisture | Rain Probability | Decision | Reasoning |
| :--- | :--- | :--- | :--- |
| **> 60%** (High) | Any | **SKIP** | Soil is already sufficiently wet. |
| **< 40%** (Low) | **< 50%** (Low) | **IRRIGATE** | Soil is dry and significant rain is unlikely. |
| **< 40%** (Low) | **> 50%** (High) | **WAIT** | Conflict Resolution: Despite dry soil, upcoming rain reduces the need for manual irrigation. |
| **40-60%** (Med) | **> 50%** (High) | **WAIT** | Adequate soil, rain expected. |
| **40-60%** (Med) | **< 50%** (Low) | **WAIT** | Borderline conditions, monitor for now. |

### 2.2 Crop Health Decision (`cropHealthDecision.ts`)
| Health Status / Probability | Decision |
| :--- | :--- |
| `high_risk` OR ≥ 70% | **ACT** (Immediate action required) |
| `needs_attention` OR ≥ 40% | **INSPECT** (Check for early symptoms) |
| `healthy` OR < 40% | **MONITOR** (Healthy crop) |

### 2.3 Market Decision (`marketDecision.ts`)
| 7-Day Trend | Decision | Reasoning |
| :--- | :--- | :--- |
| **> 2.0%** | **HOLD** | Short-term trend is positive. |
| **< -2.0%** | **SELL** | Deteriorating trend. Sell to prevent loss. |
| **-2.0% to 2.0%** | **HOLD** | Stable market. |

### 2.4 Weather Risk (`weatherRisk.ts`)
| Rain Probability | Risk Level |
| :--- | :--- |
| **> 70%** | **HIGH** |
| **> 30%** | **MEDIUM** |
| **< 30%** | **LOW** |

---

## 3. Top Actions Priority System
To prevent farmer fatigue, the engine distills all decisions into a maximum of **3 priority actions** for "Today's Farm Plan".

1. **Immediate Weather Threats** (Priority 1) - e.g., High rain risk.
2. **Critical Crop Health** (Priority 2-3) - e.g., High disease probability.
3. **Critical Irrigation** (Priority 4-6) - e.g., Need to irrigate today.
4. **Market Alerts** (Priority 5-7) - e.g., Sell recommendations.
5. **General Monitoring** (Priority 8) - e.g., Monitor crop health.

If no critical actions trigger, the system defaults to: *"Monitor general farm conditions."*

---

## 4. Confidence & Missing Data Safety
The engine is designed to **never crash** or invent data if external services fail.

- **Missing Data:** Safe fallbacks are used. For example, if Market data is unavailable, the decision defaults to **HOLD** with `0%` confidence.
- **Confidence Deductions:** If Soil moisture is known but Weather is missing, the irrigation decision proceeds with caution (confidence is slashed by 50%).
- **No Hallucinations:** The UI and WhatsApp bot conditionally render elements based on confidence. A `0%` confidence explicitly states: *"Data unavailable."*

---

## 5. Security (IDOR)
The Decision Engine sits securely behind `assertFarmOwnership(userId, farmId)` in the `AdvisoryService`. Users cannot compute decisions for farms they do not own.
