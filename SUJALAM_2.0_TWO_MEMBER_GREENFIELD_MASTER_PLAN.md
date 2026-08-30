# SUJALAM 2.0 --- TWO-MEMBER GREENFIELD HACKATHON MASTER PLAN

## 0. Purpose

This is the single execution contract for a **new, greenfield
implementation** of Sujalam 2.0.

The previous Sujalam project established the product direction, farmer
workflows, Web/WhatsApp concept, decision-intelligence architecture, and
hackathon story. This version is intentionally being rebuilt from
scratch with only two engineering members:

-   **Member 1 --- Backend, Data, AI/Decision Intelligence, Integrations
    & WhatsApp Backend**
-   **Member 2 --- Frontend, Farmer UX & Web Client**

The goal is not to build two independent projects and merge them at the
end.

The goal is to build **one integrated farmer decision-intelligence
platform** where:

``` text
                         FARMER
                            |
              +-------------+-------------+
              |                           |
           WEB APP                    WHATSAPP
              |                           |
              +-------------+-------------+
                            |
                     SHARED BACKEND
                            |
                 FARM PROFILE + CONTEXT
                            |
        +-------------------+-------------------+
        |                   |                   |
      WEATHER              SOIL            CROP HEALTH
        |                   |                   |
        +-------------------+-------------------+
                            |
                          MARKET
                            |
                       SCHEMES / FPO
                            |
                     DECISION ENGINE
                            |
          +-----------------+-----------------+
          |                 |                 |
       IRRIGATION       CROP HEALTH       SELL / HOLD
          |                 |                 |
          +-----------------+-----------------+
                            |
                     FARM ADVISORY
                            |
              +-------------+-------------+
              |                           |
             WEB                       WHATSAPP
```

The platform must convert fragmented information into a **specific,
localized, explainable and actionable next decision**.

------------------------------------------------------------------------

# 1. PROBLEM STATEMENT

Design and build a single farmer-facing platform that unifies at least
three relevant data streams, including:

-   weather/climate risk
-   soil and groundwater status
-   crop/pest health
-   market prices
-   farm labour/machinery availability
-   government schemes/FPO/livestock data

The platform must translate raw and fragmented data into a
recommendation a farmer can realistically use in the next decision
cycle:

-   what to plant
-   when to irrigate
-   when to inspect/spray
-   when to sell
-   which scheme to use
-   which resource or service to access

The platform should support:

-   low-literacy users
-   low-connectivity environments
-   multilingual users
-   voice where feasible
-   offline-friendly Web UX

The solution must show a clear **before/after**:

``` text
Without Sujalam:
Guess → Decision → Risk

With Sujalam:
Data → Intelligence → Explainable Action
```

------------------------------------------------------------------------

# 2. PRODUCT VISION

## Product Statement

> **Sujalam converts fragmented farm data into one localized,
> explainable and actionable recommendation and delivers that
> recommendation through both Web and WhatsApp.**

The product is not a collection of dashboards.

Bad:

``` text
Temperature: 28°C
Rain: 82%
Soil moisture: 67%
Disease: 81%
Market: ₹7,100
```

Good:

``` text
💧 WAIT 24 HOURS
🌱 INSPECT CROP TODAY
💰 HOLD PRODUCE
🌧️ RAIN EXPECTED
```

with:

``` text
WHY?

Rain probability: 82%
Soil moisture: 67%
Crop stage: Flowering
Disease probability: 81%
Market trend: +4.2%

Confidence: 87%
```

------------------------------------------------------------------------

# 3. CORE DATA-TO-DECISION PIPELINE

``` text
Farmer Profile
      +
Crop Context
      +
Weather
      +
Soil/Groundwater
      +
Crop Health
      +
Market
      +
Schemes/FPO
      ↓
Decision Engine
      ↓
Farm Advisory
      ↓
Actionable Recommendations
      ↓
Web + WhatsApp
```

The key product question is:

> **"What should I do next?"**

------------------------------------------------------------------------

# 4. TEAM OWNERSHIP

## MEMBER 1 --- BACKEND + DATA + DECISION INTELLIGENCE + WHATSAPP BACKEND

Member 1 owns the **source of truth for farmer intelligence**.

### Responsibilities

-   Supabase/Postgres database
-   shared data model
-   database migrations
-   authentication backend integration
-   Farm Service
-   Crop Service
-   Soil/Groundwater Service
-   Weather Service
-   Crop Health Service
-   Market Service
-   Schemes/FPO Service
-   Decision Engine
-   Farm Advisory generation
-   Advisory persistence/history
-   API/service contracts
-   backend validation/security
-   external API integrations
-   caching/fallbacks
-   WhatsApp webhook
-   WhatsApp phone-to-farmer mapping
-   WhatsApp onboarding
-   WhatsApp menu
-   natural-language intent routing
-   WhatsApp image flow
-   WhatsApp advisory formatting/delivery
-   WhatsApp notifications where feasible
-   backend tests
-   seeded/demo data
-   integration support

Member 1 owns:

``` text
DATABASE
SERVICES
EXTERNAL DATA
DECISION ENGINE
FARM ADVISORY
API
WHATSAPP BACKEND
```

------------------------------------------------------------------------

## MEMBER 2 --- FRONTEND + FARMER UX

Member 2 owns the **source of truth for Web presentation and farmer
experience**.

### Responsibilities

-   React Web application
-   app shell
-   landing page
-   authentication UI
-   farmer onboarding UI
-   navigation
-   dashboard
-   Today's Farm Plan
-   Farm Profile UI
-   Crop Health UI
-   Weather/Soil UI
-   Market UI
-   Schemes/FPO UI
-   Advisory History
-   explainability UI
-   confidence/signal visualization
-   multilingual Web UI
-   offline-friendly Web UX
-   mobile responsiveness
-   accessibility
-   loading/error/empty states
-   Web API integration
-   before/after impact UI
-   hackathon visual polish

Member 2 owns:

``` text
WEB UI
FARMER EXPERIENCE
CLIENT STATE
VISUALIZATION
WEB/API INTEGRATION
```

------------------------------------------------------------------------

# 5. GOLDEN INTEGRATION RULE

There must be **one source of truth**.

Do not independently implement:

-   irrigation calculation
-   disease-risk calculation
-   market recommendation
-   scheme matching
-   farmer profile storage
-   advisory wording logic

in the frontend.

Correct:

``` text
Web
  ↓
Backend API
  ↓
Decision Engine
  ↓
FarmAdvisory
```

and:

``` text
WhatsApp
  ↓
Backend
  ↓
Decision Engine
  ↓
FarmAdvisory
```

Web and WhatsApp may format the same advisory differently, but the
underlying decision must be the same.

------------------------------------------------------------------------

# 6. SHARED CONTRACTS --- FREEZE BEFORE PARALLEL WORK

The two members must agree on shared types and API response shapes
before major parallel development.

## Farm

``` ts
type Farm = {
  id: string;
  user_id: string;
  name: string | null;
  latitude: number | null;
  longitude: number | null;
  location_name: string | null;
  area_acres: number | null;
  soil_type: string | null;
  irrigation_type: string | null;
  created_at: string;
  updated_at: string;
};
```

## Farm Crop

``` ts
type FarmCrop = {
  id: string;
  farm_id: string;
  crop_name: string;
  variety: string | null;
  sowing_date: string | null;
  growth_stage: string | null;
  crop_history: string | null;
  created_at: string;
  updated_at: string;
};
```

## Soil Reading

``` ts
type SoilReading = {
  id: string;
  farm_id: string;
  moisture_percent: number | null;
  ph: number | null;
  nitrogen: number | null;
  phosphorus: number | null;
  potassium: number | null;
  groundwater_level: number | null;
  source: "manual" | "sensor" | "simulated";
  recorded_at: string;
};
```

## Weather Snapshot

``` ts
type WeatherSnapshot = {
  id: string;
  farm_id: string;
  temperature_c: number | null;
  rainfall_mm: number | null;
  rain_probability_percent: number | null;
  humidity_percent: number | null;
  wind_kmh: number | null;
  forecast_time: string;
  source: string;
  recorded_at: string;
};
```

## Crop Health

``` ts
type CropHealth = {
  id: string;
  farm_id: string;
  crop_id: string | null;
  image_url: string | null;
  crop_name: string | null;
  disease_name: string | null;
  disease_probability: number | null;
  health_status: "healthy" | "needs_attention" | "high_risk" | "unknown";
  recommended_action: string | null;
  source: string;
  created_at: string;
};
```

## Market Price

``` ts
type MarketPrice = {
  id: string;
  crop_name: string;
  market_name: string | null;
  price_per_quintal: number | null;
  trend_7d_percent: number | null;
  recorded_at: string;
  source: string;
};
```

## Scheme

``` ts
type Scheme = {
  id: string;
  name: string;
  description: string;
  eligibility: string | null;
  benefit: string | null;
  action_url: string | null;
  region: string | null;
  crop_types: string[] | null;
  created_at: string;
};
```

## Farm Advisory

``` ts
type FarmAdvisory = {
  id: string;
  farm_id: string;
  generated_at: string;

  overall_status: "normal" | "attention" | "urgent";

  irrigation: {
    decision: "IRRIGATE" | "WAIT";
    timing: string;
    reason: string;
    confidence: number;
  };

  crop_health: {
    decision: "MONITOR" | "INSPECT" | "ACT";
    reason: string;
    confidence: number;
  };

  market: {
    decision: "SELL" | "HOLD";
    timing: string;
    reason: string;
    confidence: number;
  };

  weather: {
    risk: "LOW" | "MEDIUM" | "HIGH";
    summary: string;
  };

  top_actions: string[];

  supporting_signals: {
    rain_probability_percent: number | null;
    soil_moisture_percent: number | null;
    disease_probability_percent: number | null;
    market_trend_percent: number | null;
  };
};
```

If the team changes this contract, both members must be informed before
merging.

------------------------------------------------------------------------

# 7. RECOMMENDED PROJECT STRUCTURE

``` text
sujalam-2.0/
│
├── src/
│   ├── components/
│   │   ├── advisory/
│   │   ├── auth/
│   │   ├── farm/
│   │   ├── crop/
│   │   ├── weather/
│   │   ├── market/
│   │   ├── schemes/
│   │   └── layout/
│   │
│   ├── pages/
│   ├── services/
│   │   ├── farmApi.ts
│   │   ├── advisoryApi.ts
│   │   ├── weatherApi.ts
│   │   ├── cropHealthApi.ts
│   │   ├── marketApi.ts
│   │   └── schemeApi.ts
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── cache/
│   │   └── i18n/
│   ├── types/
│   └── styles/
│
├── server/
│   ├── index.ts
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── decision/
│   ├── integrations/
│   │   ├── weather/
│   │   ├── crop-health/
│   │   ├── market/
│   │   └── whatsapp/
│   └── types/
│
├── supabase/
│   └── migrations/
│
├── docs/
├── .env.example
├── package.json
└── README.md
```

Do not create separate Web and WhatsApp versions of core services.

------------------------------------------------------------------------

# 8. MEMBER 1 --- DATABASE IMPLEMENTATION

Create tables for:

-   profiles/user linkage
-   farms
-   farm_crops
-   soil_readings
-   weather_snapshots
-   crop_health
-   market_prices
-   schemes
-   advisories
-   advisory_signals
-   whatsapp_users
-   optional notification preferences

Requirements:

-   UUID primary keys
-   timestamps
-   foreign keys
-   useful indexes
-   appropriate RLS
-   user/farm authorization

WhatsApp-specific state can be stored separately, but farm intelligence
must remain shared.

------------------------------------------------------------------------

# 9. MEMBER 1 --- AUTHENTICATION

Use real Supabase authentication.

Support:

``` text
Signup
Login
Logout
Session persistence
Protected farmer data
```

Browser may use:

``` text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Never expose:

``` text
SUPABASE_SERVICE_ROLE_KEY
```

or any private API key to the frontend.

------------------------------------------------------------------------

# 10. MEMBER 1 --- FARM SERVICE

Implement shared functions such as:

``` ts
getFarmByUserId(userId)
getFarm(farmId)
createFarm(input)
updateFarm(farmId, input)

getActiveCrop(farmId)
createCrop(input)
updateCrop(cropId)
```

The same service/API must serve:

``` text
Web
WhatsApp
Decision Engine
```

------------------------------------------------------------------------

# 11. MEMBER 1 --- WEATHER SERVICE

The Weather Service should:

1.  accept farm coordinates
2.  call the weather provider
3.  normalize provider output
4.  persist a snapshot
5.  return structured data
6.  handle failures
7.  support latest/cached data

Normalize:

``` text
temperature
rainfall
rain probability
humidity
wind
forecast window
```

The Decision Engine consumes normalized weather data, not
provider-specific JSON.

------------------------------------------------------------------------

# 12. MEMBER 1 --- SOIL/GROUNDWATER SERVICE

Support:

-   manual data
-   simulated demo data
-   future sensor data

Every record must identify:

``` text
manual
sensor
simulated
```

Example demo:

``` text
Soil moisture: 67%
pH: 6.8
N: Medium
P: High
K: Medium
Groundwater: Normal
```

The Soil Service reports facts.

The Decision Engine makes decisions.

------------------------------------------------------------------------

# 13. MEMBER 1 --- CROP HEALTH SERVICE

Use Kindwise/Plant.id or the selected crop-health provider.

Flow:

``` text
Crop image
   ↓
Crop Health Service
   ↓
Plant.id
   ↓
Normalized CropHealth
   ↓
Persist
   ↓
Decision Engine
   ↓
FarmAdvisory
```

Handle:

-   invalid images
-   timeout
-   provider failure
-   low confidence
-   unavailable provider

Never fabricate a diagnosis.

------------------------------------------------------------------------

# 14. MEMBER 1 --- MARKET SERVICE

Market data can be:

-   live
-   historical
-   seeded
-   simulated

depending on reliable availability.

Every record must carry source/provenance.

Implement:

``` ts
getLatestMarketPrice(cropName, location)
getMarketTrend(cropName)
```

The Market Service returns facts.

The Decision Engine decides:

``` text
SELL
or
HOLD
```

------------------------------------------------------------------------

# 15. MEMBER 1 --- SCHEME/FPO SERVICE

Maintain a normalized catalog for:

-   government schemes
-   crop insurance
-   micro-irrigation
-   FPO support
-   collective selling
-   input/resource support
-   machinery/resource opportunities where feasible

Implement:

``` ts
getRelevantSchemes(farmId)
```

Do not invent eligibility.

------------------------------------------------------------------------

# 16. MEMBER 1 --- DECISION ENGINE

This is the heart of Sujalam.

Input:

``` text
Farm
Crop
Weather
Soil
Crop Health
Market
Schemes/FPO
```

Output:

``` text
FarmAdvisory
```

Architecture:

``` text
Farm Context
     +
Weather
     +
Soil
     +
Crop Health
     +
Market
     +
Schemes
     ↓
Decision Engine
     ↓
Irrigation Decision
Crop Health Decision
Market Decision
Weather Risk
     ↓
FarmAdvisory
```

------------------------------------------------------------------------

# 17. IRRIGATION DECISION

Consider:

-   soil moisture
-   rain probability
-   expected rainfall
-   crop stage
-   irrigation type
-   recent weather
-   farm context

Demo scenario:

``` text
Soil moisture = 67%
Rain probability = 82%
Crop stage = Flowering
```

Output:

``` text
WAIT 24 HOURS
```

Reason:

``` text
Soil moisture is sufficient and
rain is likely within the next 24 hours.
```

This logic exists ONLY in the backend.

------------------------------------------------------------------------

# 18. CROP HEALTH DECISION

Consider:

-   disease probability
-   health status
-   crop stage
-   humidity/recent weather
-   previous observations

Output:

``` text
MONITOR
INSPECT
ACT
```

Example:

``` text
Disease probability = 81%

Decision:
INSPECT CROP TODAY
```

------------------------------------------------------------------------

# 19. MARKET DECISION

Consider:

-   current price
-   7-day trend
-   crop
-   location
-   storage availability if available
-   confidence

Demo:

``` text
Price = ₹7,100/quintal
Trend = +4.2%
```

Output:

``` text
HOLD
```

Reason:

``` text
Short-term price trend is positive.
If storage is available, consider waiting.
```

------------------------------------------------------------------------

# 20. FARM ADVISORY GENERATION

Implement:

``` ts
generateFarmAdvisory(farmId)
```

Flow:

``` text
farmId
 ↓
Farm
 ↓
Active Crop
 ↓
Latest Soil
 ↓
Latest Weather
 ↓
Latest Crop Health
 ↓
Latest Market
 ↓
Relevant Schemes/FPO
 ↓
Decision Engine
 ↓
FarmAdvisory
 ↓
Persist Advisory
 ↓
Return Advisory
```

This is the central shared intelligence function.

------------------------------------------------------------------------

# 21. ADVISORY HISTORY

Persist:

-   advisory ID
-   farm ID
-   generated timestamp
-   decisions
-   reasons
-   confidence
-   supporting signals
-   source data references where useful

Frontend can display:

``` text
Today
Yesterday
3 days ago
Last week
```

------------------------------------------------------------------------

# 22. API LAYER

Suggested endpoints:

``` text
GET    /api/farms
GET    /api/farms/:id
POST   /api/farms
PATCH  /api/farms/:id

GET    /api/farms/:id/crop
POST   /api/farms/:id/crop
PATCH  /api/crops/:id

GET    /api/farms/:id/weather
GET    /api/farms/:id/soil

POST   /api/farms/:id/crop-health/analyze

GET    /api/farms/:id/market
GET    /api/farms/:id/schemes

GET    /api/farms/:id/advisory
POST   /api/farms/:id/advisory/refresh

GET    /api/farms/:id/advisories
```

Keep response contracts stable.

------------------------------------------------------------------------

# 23. MEMBER 1 --- WHATSAPP BACKEND

WhatsApp is a channel, not a separate intelligence system.

Architecture:

``` text
Farmer
  ↓
WhatsApp
  ↓
Webhook
  ↓
Message Parser
  ↓
Intent Router
  ↓
Shared Services
  ↓
Decision Engine
  ↓
FarmAdvisory
  ↓
WhatsApp Formatter
  ↓
Farmer
```

Use server-side secrets only.

------------------------------------------------------------------------

# 24. WHATSAPP USER MAPPING

Recommended:

``` text
WhatsApp phone number
        ↓
user_id
        ↓
farm_id
```

Suggested table:

``` text
whatsapp_users
---------------
id
phone_number
user_id
farm_id
language
onboarding_state
created_at
updated_at
```

Never trust a user-supplied farm ID.

------------------------------------------------------------------------

# 25. WHATSAPP ONBOARDING

Flow:

``` text
Hi
 ↓
Welcome
 ↓
Choose language
 ↓
Location
 ↓
Farm size
 ↓
Crop
 ↓
Sowing date
 ↓
Soil type
 ↓
Irrigation type
 ↓
Farm created
 ↓
Main menu
```

Use the same Farm Service/API as Web.

------------------------------------------------------------------------

# 26. WHATSAPP MENU

``` text
🌾 SUJALAM

What would you like to know?

1️⃣ Today's Farm Plan
2️⃣ Crop Health
3️⃣ Weather
4️⃣ Irrigation
5️⃣ Mandi Price
6️⃣ Schemes
7️⃣ My Farm
8️⃣ Ask Sujalam
```

Replies should be concise.

------------------------------------------------------------------------

# 27. WHATSAPP NATURAL LANGUAGE

Support:

``` text
Aaj kya karna hai?
Aaj paani dena hai?
Kal baarish hogi?
Kapus ka bhav kya hai?
Mere crop ko kya hua?
Kaunsi scheme milegi?
Mera farm dikhao
```

Normalize to:

``` text
TODAY_PLAN
IRRIGATION
WEATHER
MARKET
CROP_HEALTH
SCHEMES
FARM_PROFILE
```

Each intent calls the shared backend.

------------------------------------------------------------------------

# 28. WHATSAPP IMAGE FLOW

``` text
Photo
 ↓
Download media
 ↓
Crop Health Service
 ↓
Plant.id
 ↓
CropHealth
 ↓
Decision Engine
 ↓
FarmAdvisory
 ↓
WhatsApp result
```

Example:

``` text
🌱 CROP HEALTH

Crop: Cotton

Possible issue:
Leaf Spot

Confidence:
81%

Action:
Inspect affected leaves today.
```

------------------------------------------------------------------------

# 29. WHATSAPP NOTIFICATIONS

Optional P1.

Example:

``` text
⚠️ WEATHER ALERT

Heavy rain is expected within
the next 24 hours.

Recommendation:
Do not irrigate today.
```

Do not spam users.

------------------------------------------------------------------------

# 30. VOICE

P2 only.

If feasible:

``` text
Voice
 ↓
Speech-to-text
 ↓
Intent detection
 ↓
Decision Engine
 ↓
Text/audio response
```

If voice threatens reliability, do not implement it.

Stable text + image is more valuable.

------------------------------------------------------------------------

# 31. MEMBER 2 --- WEB APPLICATION

The Web application should contain:

``` text
Landing
Login
Dashboard
My Farm
Crop Health
Weather & Soil
Market
Schemes / FPO
Advisory History
```

Use lightweight routing.

Do not add heavy infrastructure without need.

------------------------------------------------------------------------

# 32. WEB LANDING PAGE

Communicate the product immediately:

``` text
🌾 SUJALAM

Farmer Decision Intelligence

Weather + Soil + Crop Health + Market
→ One Actionable Farm Plan
```

Primary CTA:

``` text
Get Started
```

------------------------------------------------------------------------

# 33. AUTH UI

Support:

-   signup
-   login
-   logout
-   session persistence
-   validation
-   loading
-   error handling

Use real Supabase Auth.

Do not replace authentication with a fake local mock.

------------------------------------------------------------------------

# 34. FARM ONBOARDING UI

Flow:

``` text
Welcome
 ↓
Location
 ↓
Farm size
 ↓
Crop
 ↓
Sowing date
 ↓
Soil
 ↓
Irrigation
 ↓
Save
 ↓
Today's Farm Plan
```

Design for mobile and low digital literacy.

------------------------------------------------------------------------

# 35. DASHBOARD --- PRIMARY SCREEN

The dashboard must answer:

> **"What should I do today?"**

First viewport:

``` text
Good morning 👋

Cotton • 2.5 acres • Flowering
📍 Maharashtra

────────────────────────

🌾 TODAY'S FARM PLAN

💧 WAIT 24 HOURS
🌱 INSPECT CROP TODAY
💰 HOLD PRODUCE
🌧️ RAIN EXPECTED
```

Then:

``` text
WHY THESE DECISIONS?

Rain          82%
Soil moisture 67%
Disease       81%
Market trend  +4.2%
```

------------------------------------------------------------------------

# 36. TODAY'S FARM PLAN COMPONENT

Create:

``` text
TodaysFarmPlan
```

It consumes:

``` ts
FarmAdvisory
```

It renders:

-   irrigation
-   crop health
-   market
-   weather
-   top actions

It must never calculate decisions.

------------------------------------------------------------------------

# 37. EXPLAINABILITY UI

Create reusable:

``` text
DecisionReasonCard
```

It answers:

``` text
WHAT?
WHEN?
WHY?
CONFIDENCE?
```

Example:

``` text
💧 WAIT 24 HOURS

When:
Today

Why:
Rain is expected and soil moisture
is already sufficient.

Signals:
Rain 82%
Soil 67%

Confidence:
87%
```

------------------------------------------------------------------------

# 38. FARM PROFILE UI

Show:

``` text
FARM
Location
Area

CROP
Crop
Variety
Sowing date
Growth stage

FIELD CONDITIONS
Soil
Irrigation
```

Support edit/save through the backend.

------------------------------------------------------------------------

# 39. CROP HEALTH UI

Flow:

``` text
Upload / Take Photo
        ↓
Analyzing
        ↓
Crop identified
        ↓
Health status
        ↓
Risk
        ↓
Recommended action
```

Example:

``` text
🌱 Cotton

Health:
Needs attention

Possible issue:
Leaf Spot

Risk:
HIGH

Recommended:
Inspect affected leaves today.
```

Do not show raw provider JSON.

------------------------------------------------------------------------

# 40. WEATHER + SOIL UI

Impact first:

``` text
🌧️ RAIN RISK
HIGH

Rain expected within 24 hours.

Farm action:
Do not irrigate today.
```

Then:

``` text
28°C
82% rain probability
84% humidity

67% soil moisture
pH 6.8
```

The page should support farm decisions, not just display weather.

------------------------------------------------------------------------

# 41. MARKET UI

First question:

``` text
SHOULD I SELL?
```

Example:

``` text
COTTON

₹7,100 / quintal

↗ +4.2% this week

SHOULD I SELL?

🟢 HOLD

Why?
Prices show a positive short-term trend.

Suggested:
3–5 days if storage is available.
```

Recommendation comes from backend.

------------------------------------------------------------------------

# 42. SCHEMES / FPO UI

Every scheme should answer:

``` text
What is it?
Why is it relevant?
What benefit can I get?
What should I do next?
```

Example:

``` text
MICRO-IRRIGATION SUPPORT

Why relevant:
Your farm profile matches the criteria.

Benefit:
Support for irrigation infrastructure.

[View Details]
```

------------------------------------------------------------------------

# 43. ADVISORY HISTORY UI

Display:

``` text
Today
Yesterday
3 days ago
Last week
```

Each advisory:

``` text
Decision
Reason
Confidence
Signals
Generated time
```

------------------------------------------------------------------------

# 44. MULTILINGUAL WEB

Minimum:

``` text
English
Hindi
Marathi
```

Use centralized translations:

``` text
src/lib/i18n/
  en.ts
  hi.ts
  mr.ts
  index.ts
```

Do not scatter translated strings across components.

------------------------------------------------------------------------

# 45. OFFLINE-FRIENDLY WEB

Cache:

``` text
last farm profile
last advisory
last weather snapshot
last market snapshot
last crop-health result
```

Offline state:

``` text
📴 You're offline

Showing your latest available information.

Last updated:
2 hours ago
```

Never claim cached information is live.

------------------------------------------------------------------------

# 46. LOW-LITERACY UX

Use:

-   large action text
-   clear icons
-   short sentences
-   local language
-   predictable navigation
-   clear status labels
-   large touch targets

Prefer:

``` text
Rain is likely.
Do not irrigate today.
```

over:

``` text
Precipitation probability exceeds threshold.
```

------------------------------------------------------------------------

# 47. WEB DESIGN SYSTEM

The visual style should feel:

-   agricultural
-   trustworthy
-   premium
-   calm
-   practical
-   modern

Use restrained:

-   deep green
-   natural green
-   warm off-white
-   neutral gray
-   subtle yellow/gold

Avoid:

-   excessive purple
-   excessive gradients
-   excessive shadows
-   giant floating cards
-   excessive rounded containers
-   random emojis everywhere
-   unnecessary animations

The dashboard should look like a real agricultural product, not an
AI-generated template.

------------------------------------------------------------------------

# 48. BUTTON CONTRAST

Global rules:

### Primary

``` text
Dark green background
White text
```

### Secondary

``` text
Light background
Dark text
Visible border
```

### Ghost

``` text
Transparent
Dark readable text
```

Never:

``` text
White background + white text
```

Audit:

-   login
-   signup
-   CTA
-   navigation
-   forms
-   cards
-   modals
-   mobile buttons

------------------------------------------------------------------------

# 49. RESPONSIVE WEB

Test:

``` text
360px
390px
412px
768px
1024px
1440px
```

Mobile is the primary farmer experience.

Ensure:

-   no horizontal scrolling
-   no clipped text
-   no overlapping
-   adequate tap targets
-   compact navigation
-   readable cards

------------------------------------------------------------------------

# 50. ACCESSIBILITY

Ensure:

-   sufficient contrast
-   keyboard focus
-   labels
-   aria labels for icon buttons
-   visible focus states
-   readable font sizes
-   text labels in addition to colors

Never communicate HIGH/MEDIUM/LOW using color alone.

------------------------------------------------------------------------

# 51. BEFORE / AFTER IMPACT UI

Create:

## WITHOUT SUJALAM

``` text
Guess weather
     ↓
Irrigate
     ↓
Rain arrives
     ↓
Potential water waste
```

## WITH SUJALAM

``` text
Weather
+
Soil
+
Crop Stage
     ↓
Decision Engine
     ↓
Wait 24 hours
     ↓
Rain arrives
     ↓
Potential water saving
```

Potential metrics:

-   potential water saving
-   reduced unnecessary input use
-   faster decisions
-   better market timing
-   easier scheme access

Any demo numbers must be labeled:

``` text
Estimated demo impact
```

------------------------------------------------------------------------

# 52. WEB ↔ WHATSAPP SYNCHRONIZATION

This is P0.

## Web changes crop

``` text
Web
 ↓
Backend
 ↓
Database
 ↓
WhatsApp My Farm
```

## WhatsApp changes crop

``` text
WhatsApp
 ↓
Backend
 ↓
Database
 ↓
Web refresh
```

## Advisory

``` text
Web → generateFarmAdvisory()
WhatsApp → generateFarmAdvisory()
```

Both use the same intelligence.

------------------------------------------------------------------------

# 53. MOCK DATA DURING DEVELOPMENT

Mocks are allowed while the backend is incomplete.

Rules:

-   isolate mocks
-   match shared contracts
-   use deterministic demo data
-   do not create a second production architecture
-   do not create separate business logic
-   make replacement easy

Target:

``` text
UI
 ↓
Service Interface
 ↓
Mock
```

Later:

``` text
UI
 ↓
Service Interface
 ↓
Real API
```

WhatsApp should follow the same principle.

------------------------------------------------------------------------

# 54. REAL DATA VS SIMULATED DATA

Every data stream must have provenance.

Examples:

``` text
Weather
Source: Open-Meteo
Updated: 10 minutes ago
```

or:

``` text
Soil
Source: Simulated demo sensor
```

or:

``` text
Market
Source: Demo market dataset
```

Never present simulated data as real.

Never invent a live source.

------------------------------------------------------------------------

# 55. TESTING --- DO NOT TRUST AGENT CLAIMS

AI coding-agent completion reports are not proof.

A feature is complete only after actual execution.

## Level 1 --- Build

``` bash
npm run build
```

## Level 2 --- Backend

Test:

-   database operations
-   service functions
-   decision engine
-   API routes
-   authorization
-   failure handling

## Level 3 --- Browser

Actually run the Web app.

Check:

``` text
Landing
Login
Signup
Farm onboarding
Dashboard
My Farm
Crop Health
Weather & Soil
Market
Schemes
Advisory History
Logout
```

## Level 4 --- WhatsApp

Test:

``` text
Hi
Onboarding
Menu
Today's Plan
Weather
Irrigation
Market
Schemes
My Farm
Natural language
Image
Unknown message
```

## Level 5 --- End-to-end

``` text
Web
 ↓
API
 ↓
Database
 ↓
Decision Engine
 ↓
Web
```

and:

``` text
WhatsApp
 ↓
API
 ↓
Database
 ↓
Decision Engine
 ↓
WhatsApp
```

------------------------------------------------------------------------

# 56. FAILURE TESTING

Test:

### Weather failure

Show latest available data and timestamp.

### Market failure

Show unavailable state.

### Plant.id failure

Show retry.

### Decision engine failure

Show last advisory if available.

### Database failure

Show clear error.

### Offline

Show cached data.

Never fabricate.

------------------------------------------------------------------------

# 57. SECURITY

Backend must:

-   validate input
-   authorize farm ownership
-   protect service credentials
-   protect WhatsApp secrets
-   use RLS
-   validate webhook requests
-   rate-limit where appropriate
-   sanitize external responses

Frontend must never contain:

``` text
Supabase service-role key
WhatsApp access token
Private API keys
```

------------------------------------------------------------------------

# 58. ENVIRONMENT VARIABLES

Create:

``` text
.env.example
```

Possible variables:

``` text
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

PLANT_ID_API_KEY=
WEATHER_API_KEY=

WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_VERIFY_TOKEN=
WHATSAPP_APP_SECRET=
```

Only include variables required by the actual implementation.

All server-only secrets stay server-side.

------------------------------------------------------------------------

# 59. DEPLOYMENT

The final system needs:

``` text
Production Web URL
Production API URL
HTTPS
Supabase project
WhatsApp webhook URL
Environment configuration
```

Choose simple deployment.

Do not over-engineer infrastructure.

------------------------------------------------------------------------

# 60. HERO DEMO DATA

Use one deterministic demo scenario:

``` text
Location:
Maharashtra

Farm:
2.5 acres

Crop:
Cotton

Growth stage:
Flowering

Soil:
Black soil

Irrigation:
Borewell

Soil moisture:
67%

Rain probability:
82%

Humidity:
84%

Disease probability:
81%

Market:
₹7,100/quintal

7-day trend:
+4.2%
```

Expected:

``` text
💧 WAIT 24 HOURS
🌱 INSPECT CROP TODAY
💰 HOLD PRODUCE
🌧️ RAIN EXPECTED
```

This same scenario should be available to Web and WhatsApp for a
deterministic demo.

------------------------------------------------------------------------

# 61. HACKATHON DEMO --- 3 MINUTES

## 0:00--0:20 --- Problem

Show:

``` text
Weather → separate source
Mandi → separate source
Soil → guess
Disease → visual guess
Schemes → difficult
```

Say:

> Farmers don't need more data. They need one decision.

## 0:20--0:50 --- Web

Open Sujalam.

Show:

``` text
Today's Farm Plan
```

Immediately:

``` text
WAIT irrigation
INSPECT crop
HOLD produce
```

## 0:50--1:20 --- Explain

Tap:

``` text
Why?
```

Show:

``` text
Rain 82%
Soil moisture 67%
Humidity 84%
Disease probability 81%
Market trend +4.2%
```

Say:

> The platform converts fragmented signals into one explainable action.

## 1:20--2:00 --- WhatsApp

Send:

``` text
Hi
```

Then:

``` text
1
```

Receive Today's Farm Plan.

Ask:

``` text
Aaj paani dena hai?
```

Receive:

``` text
Nahi.
24 ghante wait karein...
```

Send crop image and receive crop-health advisory.

## 2:00--2:30 --- Synchronization

Change crop/farm information through WhatsApp.

Refresh Web.

Then change Web and show WhatsApp retrieving the updated information.

Say:

> WhatsApp is not a separate chatbot. It is another interface to the
> same farmer intelligence platform.

## 2:30--3:00 --- Impact

Show:

``` text
WITHOUT SUJALAM
Guess → Decision → Risk

WITH SUJALAM
Data → Intelligence → Explainable Action
```

Then:

``` text
Potential water saving
Reduced unnecessary input use
Faster decisions
Better market timing
Easier scheme access
```

Clearly label estimates.

------------------------------------------------------------------------

# 62. DEVELOPMENT PHASES

## Phase 0 --- Contract Freeze

### Both members

Agree on:

-   database names
-   shared types
-   FarmAdvisory
-   API contracts
-   folder structure
-   environment variables
-   Git branches

------------------------------------------------------------------------

## Phase 1 --- Foundation

### Member 1

-   Supabase project
-   migrations
-   auth/backend foundation
-   Farm Service
-   Crop Service
-   shared API contracts

### Member 2

-   Web app shell
-   landing
-   auth UI
-   navigation
-   dashboard skeleton
-   farm profile skeleton

------------------------------------------------------------------------

## Phase 2 --- Data

### Member 1

-   weather
-   soil
-   crop health
-   market
-   schemes/FPO

### Member 2

-   weather/soil UI
-   crop health UI
-   market UI
-   schemes UI

------------------------------------------------------------------------

## Phase 3 --- Intelligence

### Member 1

-   Decision Engine
-   irrigation
-   crop-health decision
-   market recommendation
-   advisory generation
-   advisory persistence

### Member 2

-   Today's Farm Plan
-   explainability
-   confidence
-   supporting signals
-   advisory history

------------------------------------------------------------------------

## Phase 4 --- WhatsApp

### Member 1

-   webhook
-   phone mapping
-   onboarding
-   menu
-   natural-language routing
-   image flow
-   advisory delivery
-   notifications

### Member 2

-   ensure Web consumes the same farm/advisory API
-   synchronization UI
-   demo support

------------------------------------------------------------------------

## Phase 5 --- Integration

### Both

``` text
Web ↔ Backend ↔ WhatsApp
```

Verify:

-   same farm
-   same crop
-   same advisory
-   same decision
-   same source data
-   same user identity

------------------------------------------------------------------------

## Phase 6 --- Farmer UX

### Member 1

-   reliability
-   caching
-   API fallback
-   security
-   error handling

### Member 2

-   Hindi
-   Marathi
-   mobile
-   accessibility
-   offline
-   UI polish

------------------------------------------------------------------------

## Phase 7 --- Demo Freeze

No major new features.

Only:

-   bug fixes
-   performance
-   UI polish
-   reliability
-   demo data
-   presentation
-   deployment fixes

------------------------------------------------------------------------

# 63. PRIORITY SYSTEM

## P0 --- MUST HAVE

1.  Farm profile
2.  Weather
3.  Soil
4.  Crop health
5.  Market
6.  Decision Engine
7.  Today's Farm Plan
8.  Explainability
9.  Web/API integration
10. WhatsApp integration
11. Web/WhatsApp synchronization
12. Mobile Web
13. One complete end-to-end demo

## P1 --- HIGH VALUE

14. Hindi
15. Marathi
16. Offline cache
17. Before/after impact
18. Scheme matching
19. FPO
20. WhatsApp image diagnosis
21. Notifications

## P2 --- WOW FEATURES

22. Voice input
23. Voice response
24. Advanced market prediction
25. Sensor integration
26. Advanced agronomic models

Rule:

``` text
P0 > P1 > P2
```

------------------------------------------------------------------------

# 64. DAILY TEAM PROCESS

Morning:

``` text
What did I finish?
What am I building today?
What contract do I need?
Any blocker?
```

Evening:

``` text
git pull
npm install if needed
npm run build
run feature
test shared contract
```

Never silently change shared contracts.

Do not wait until the final day to integrate.

------------------------------------------------------------------------

# 65. GIT STRATEGY

Suggested:

``` text
main
├── feature/backend
└── feature/frontend
```

Member 1:

``` text
feature/backend
```

Member 2:

``` text
feature/frontend
```

Keep commits small and descriptive.

Examples:

``` text
feat(db): add farm and crop schema
feat(api): add farm service
feat(decision): add irrigation recommendation
feat(web): add farmer dashboard
feat(web): add today's farm plan
feat(whatsapp): add webhook
feat(whatsapp): add onboarding
fix(api): handle weather failure
fix(web): improve offline fallback
```

------------------------------------------------------------------------

# 66. INTEGRATION CHECKPOINTS

## Checkpoint 1 --- Farm

``` text
Web creates farm
 ↓
Database
 ↓
Backend retrieves farm
```

## Checkpoint 2 --- Crop Synchronization

``` text
Web changes crop
 ↓
Database
 ↓
WhatsApp My Farm
```

and reverse.

## Checkpoint 3 --- Advisory

``` text
Decision Engine
 ↓
FarmAdvisory
 ↓
Web
```

## Checkpoint 4 --- WhatsApp

``` text
Decision Engine
 ↓
FarmAdvisory
 ↓
WhatsApp
```

## Checkpoint 5 --- Same Decision

``` text
Web:
WAIT 24 HOURS

WhatsApp:
WAIT 24 HOURS
```

------------------------------------------------------------------------

# 67. FINAL ACCEPTANCE TEST

Use this exact sequence:

``` text
1. Farmer signs up.
2. Farmer logs in.
3. Farmer creates farm.
4. Farmer adds Cotton.
5. Backend stores farm/crop.
6. Weather is retrieved.
7. Soil data exists.
8. Crop-health data exists.
9. Market data exists.
10. Decision Engine runs.
11. FarmAdvisory is generated.
12. Web displays Today's Farm Plan.
13. Farmer opens Why.
14. Supporting signals are visible.
15. Farmer opens Market.
16. Farmer opens Crop Health.
17. Farmer goes offline.
18. Last known advisory remains visible.
19. Farmer uses WhatsApp.
20. WhatsApp identifies the same farmer.
21. WhatsApp retrieves the same farm.
22. WhatsApp returns the same Today's Farm Plan.
23. Farmer asks the irrigation question.
24. WhatsApp returns the same irrigation decision.
25. Farmer sends crop image.
26. Crop-health result is processed.
27. Web displays updated crop-health/advisory information.
28. Farmer changes crop on Web.
29. WhatsApp sees updated crop.
30. Farmer changes farm information through WhatsApp.
31. Web sees updated information.
```

If this passes, the core product is integrated.

------------------------------------------------------------------------

# 68. FINAL HACKATHON CHECKLIST

## Product

-   [ ] Clear farmer problem
-   [ ] At least 3 unified data streams
-   [ ] Localized recommendation
-   [ ] Actionable next decision
-   [ ] Explainable decision
-   [ ] Confidence
-   [ ] Before/after story
-   [ ] Estimated/simulated impact labeled

## Backend

-   [ ] Supabase
-   [ ] Authentication
-   [ ] Farm schema
-   [ ] Crop schema
-   [ ] Soil
-   [ ] Weather
-   [ ] Crop Health
-   [ ] Market
-   [ ] Schemes/FPO
-   [ ] Decision Engine
-   [ ] Advisory persistence
-   [ ] API security
-   [ ] Error handling
-   [ ] Caching/fallbacks

## Web

-   [ ] Auth UI
-   [ ] Farmer onboarding
-   [ ] Dashboard
-   [ ] Today's Farm Plan
-   [ ] Farm Profile
-   [ ] Crop Health
-   [ ] Weather/Soil
-   [ ] Market
-   [ ] Schemes/FPO
-   [ ] Advisory history
-   [ ] Hindi
-   [ ] Marathi
-   [ ] Offline
-   [ ] Mobile
-   [ ] Accessibility
-   [ ] Visual polish

## WhatsApp

-   [ ] Webhook
-   [ ] Phone mapping
-   [ ] Onboarding
-   [ ] Menu
-   [ ] Today's Plan
-   [ ] Weather
-   [ ] Irrigation
-   [ ] Market
-   [ ] Schemes
-   [ ] My Farm
-   [ ] Natural language
-   [ ] Image flow
-   [ ] Error handling
-   [ ] Same advisory as Web

## Integration

-   [ ] Web ↔ Backend
-   [ ] WhatsApp ↔ Backend
-   [ ] Web ↔ WhatsApp synchronization
-   [ ] Shared FarmAdvisory
-   [ ] One Decision Engine
-   [ ] One source of truth
-   [ ] End-to-end test

## Demo

-   [ ] Production Web URL
-   [ ] Working authentication
-   [ ] Deterministic demo farmer
-   [ ] Stable advisory
-   [ ] Working WhatsApp flow or reliable simulated webhook
-   [ ] Before/After
-   [ ] Impact
-   [ ] Backup data
-   [ ] No broken buttons
-   [ ] No console errors
-   [ ] No false live-data claims

------------------------------------------------------------------------

# 69. FINAL PITCH

Use:

> **Sujalam is a farmer decision-intelligence platform that unifies
> weather, soil, crop health, market and scheme signals into one
> actionable farm plan. Farmers can access the same intelligence through
> a visual Web application or directly through WhatsApp, so they don't
> need to learn a new application.**

Final line:

> **"We don't give farmers more data. We give them the next decision."**

------------------------------------------------------------------------

# 70. FINAL PRINCIPLE

The two-member team should build:

``` text
                 ONE PRODUCT
                     |
              ONE DATA MODEL
                     |
              ONE DECISION ENGINE
                     |
               ONE FARM ADVISORY
                     |
              TWO ACCESS CHANNELS
                 /         \
               WEB       WHATSAPP
```

Member 1 owns the intelligence and backend.

Member 2 owns the farmer-facing Web experience.

Both members continuously integrate against the same contracts.

The final product succeeds when the farmer experiences **one Sujalam**,
regardless of whether they use the Web application or WhatsApp.
