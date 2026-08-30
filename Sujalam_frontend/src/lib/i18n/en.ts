export const en = {
  // Navigation & Brand
  brandName: 'SUJALAM',
  tagline: 'Farmer Decision Intelligence',
  nav: {
    dashboard: 'Today\'s Plan',
    myFarm: 'My Farm',
    cropHealth: 'Crop Health',
    weatherSoil: 'Weather & Soil',
    market: 'Market & Mandi',
    schemes: 'Schemes & FPO',
    advisoryHistory: 'Advisory History',
    home: 'Home',
    farm: 'Farm',
    health: 'Health',
    marketShort: 'Market',
    more: 'More',
    login: 'Login',
    signup: 'Create Account',
    logout: 'Logout',
    getStarted: 'Get Started',
    demoMode: 'Demo Farm (Maharashtra)',
  },

  // Landing Page
  landing: {
    heroBadge: 'SUJALAM 2.0 • DECISION INTELLIGENCE',
    headline: 'Know your farm. Know your next decision.',
    subheadline: 'Sujalam brings weather, soil, crop health, and market signals together into one clear, explainable farm plan. Made for Indian farmers.',
    ctaPrimary: 'Get Today\'s Farm Plan',
    ctaSecondary: 'See How It Works',
    keyStat1Title: 'One Actionable Decision',
    keyStat1Sub: 'No confusing charts or raw data',
    keyStat2Title: '35% Water Saved',
    keyStat2Sub: 'By synchronizing rain & irrigation',
    keyStat3Title: 'Multi-lingual & Voice Ready',
    keyStat3Sub: 'English, हिन्दी, मराठी',
    
    // Core philosophy
    philosophyTitle: '"Farmers don\'t need more data. They need one decision."',
    philosophyBody: 'Fragmented apps give you disconnected rain alerts, mandi charts, and soil readings. Sujalam unifies these signals and tells you precisely what to do before stepping into the field.',

    // Problem vs Solution
    withoutSujalam: 'WITHOUT SUJALAM',
    withoutPoints: [
      'Weather → Separate forecast app',
      'Mandi → Unofficial mandi phone calls',
      'Soil Moisture → Guesswork by stepping on soil',
      'Crop Disease → Visual guess until damage spreads',
      'Government Schemes → Missed due to paperwork complexity'
    ],
    withSujalam: 'WITH SUJALAM',
    withPoints: [
      'Weather + Soil → Synchronized irrigation timing',
      'Crop Health → Early visual leaf diagnosis via phone',
      'Mandi Intelligence → Clear Hold vs Sell recommendations',
      'Decision Engine → One explainable farm plan every morning',
      'Matched Schemes → Instant eligibility & local FPO support'
    ],

    // How it works
    howItWorksTitle: 'How Sujalam Works',
    howItWorksSub: 'Four signals feed into our explainable Decision Engine to produce your daily plan.',
    step1Title: '1. Connect Your Farm',
    step1Desc: 'Enter your village, soil type, and current crop stage in under 2 minutes.',
    step2Title: '2. Unified Signal Ingestion',
    step2Desc: 'Satellite weather, local soil sensors, and mandi arrivals are tracked continuously.',
    step3Title: '3. Explainable Decision',
    step3Desc: 'Receive clear decisions with transparent reasoning and confidence scores.',

    // Before After Impact
    impactTitle: 'Estimated Farm Impact',
    impactSubtitle: 'Simulated impact based on seasonal field data across Maharashtra & MP cotton belts.',
    impactWaterSaved: 'Potential Water Saving',
    impactWaterSavedValue: '28-35%',
    impactCostSaved: 'Input Cost Reduction',
    impactCostSavedValue: '₹4,500/acre',
    impactDecisionTime: 'Decision Speed',
    impactDecisionTimeValue: '< 30 seconds',
    impactDisclaimer: '* Estimated demo impact. Actual field benefits vary by crop variety and local weather.',

    // CTA
    ctaBannerTitle: 'Ready to simplify your daily farm decisions?',
    ctaBannerSubtitle: 'Join thousands of farmers making confident, data-backed agronomic decisions.',
    startFree: 'Start Free Today',
    browseDemo: 'Explore Demo Dashboard',
  },

  // Dashboard — Core Screen
  dashboard: {
    greeting: 'Good morning',
    farmSubtitle: 'Cotton • 2.5 acres • Flowering & Boll Formation',
    location: 'Yavatmal, Maharashtra',
    todaysFarmPlan: 'TODAY\'S FARM PLAN',
    todaysFarmPlanSub: 'Synthesized daily decision from weather, soil, crop vision & market data.',
    whatShouldIDo: 'What should I do today?',
    generatedAt: 'Advisory updated today at 06:30 AM',
    
    // Primary Decisions
    irrigationDecision: 'WAIT 24 HOURS',
    irrigationWhy: 'Rain is expected (82% prob) and soil moisture is already sufficient (67%).',
    irrigationActionLabel: 'IRRIGATION',
    
    cropHealthDecision: 'INSPECT CROP TODAY',
    cropHealthWhy: 'Possible crop health concern (Alternaria Leaf Spot) detected.',
    cropHealthActionLabel: 'CROP HEALTH',

    marketDecision: 'HOLD PRODUCE',
    marketWhy: 'Short-term mandi trend is positive (+4.2% this week).',
    marketActionLabel: 'MARKET ADVISORY',

    weatherDecision: 'RAIN EXPECTED',
    weatherWhy: 'Heavy rainfall (24.5mm) likely within the next 24 hours.',
    weatherActionLabel: 'WEATHER ALERT',

    // Decision Explainability
    whyButton: 'Why this decision?',
    viewDetails: 'View Details',
    confidenceScore: 'Confidence',
    signalsUsed: 'Key Signals Considered',
    whatHeader: 'WHAT TO DO',
    whenHeader: 'WHEN',
    whyHeader: 'WHY',
    confidenceHeader: 'ENGINE CONFIDENCE',

    // Supporting signals overview
    supportingSignalsTitle: 'Supporting Signals Today',
    rainProbability: 'Rain Probability',
    soilMoisture: 'Soil Moisture',
    diseaseRisk: 'Disease Risk',
    marketTrend: '7-Day Price Trend',

    // Provenance
    dataProvenance: 'Data Sources & Provenance',
    weatherSource: 'Weather: Open-Meteo API',
    soilSource: 'Soil: Simulated demo sensor (Borewell Plot #2)',
    marketSource: 'Market: Yavatmal APMC Agmarknet Feed',
    visionSource: 'Vision: Sujalam Agri-Vision AI v2',
    lastSync: 'Synced 12 mins ago',
  },

  // Onboarding Wizard
  onboarding: {
    title: 'Farm Setup',
    stepOf: 'Step {current} of {total}',
    welcomeTitle: 'Welcome to Sujalam',
    welcomeSub: 'Let\'s set up your farm in simple steps to start receiving localized daily decisions.',
    
    stepLocationTitle: 'Where is your farm located?',
    stepLocationDesc: 'This helps us connect to the nearest weather station and local APMC mandi.',
    stateLabel: 'State',
    districtLabel: 'District / Village',
    
    stepSizeTitle: 'What is your total cultivated area?',
    stepSizeDesc: 'Specify farm size in acres.',
    acresLabel: 'Total Acres',

    stepCropTitle: 'What are you growing this season?',
    stepCropDesc: 'Select your primary crop.',
    cropVarietyLabel: 'Seed Variety (Optional)',

    stepSowingTitle: 'When did you sow this crop?',
    stepSowingDesc: 'This determines the current growth and nutrient stage.',
    sowingDateLabel: 'Approximate Sowing Date',
    growthStageLabel: 'Current Growth Stage',

    stepSoilTitle: 'What type of soil does your farm have?',
    stepSoilDesc: 'Soil type determines water retention and nutrient absorption.',

    stepIrrigationTitle: 'How do you irrigate your farm?',
    stepIrrigationDesc: 'Select your primary source of irrigation.',

    stepReviewTitle: 'Review Your Farm Profile',
    stepReviewDesc: 'Verify details before generating your personalized decision intelligence plan.',
    
    generatePlanBtn: 'Generate Today\'s Farm Plan',
    nextBtn: 'Next Step',
    backBtn: 'Back',
    skipBtn: 'Skip for now',
  },

  // Crop Health
  cropHealth: {
    pageTitle: 'Crop Health Scanner',
    pageSubtitle: 'Upload or take a photo of any leaf showing spots, yellowing, or pests.',
    uploadPrompt: 'Take a photo of your crop or leaf',
    uploadSubprompt: 'Supports JPG, PNG photos up to 10MB',
    uploadBtn: 'Choose File from Device',
    samplePhotos: 'Or test with sample field photos:',
    sampleCottonSpot: 'Cotton (Leaf Spot)',
    sampleCottonHealthy: 'Cotton (Healthy)',
    sampleSoybeanRust: 'Soybean (Rust)',
    analyzingText: 'Analyzing leaf symptoms with Sujalam Vision AI...',
    analysisComplete: 'Crop Health Diagnosis',
    cropIdentified: 'Crop Identified',
    healthStatus: 'Health Status',
    severity: 'Risk Severity',
    possibleIssue: 'Detected Issue',
    recommendedAction: 'Recommended Immediate Action',
    symptoms: 'Observed Symptoms',
    treatment: 'Recommended Organic & Chemical Treatment',
    scanAnother: 'Scan Another Leaf',
    accuracyNote: 'Diagnosed with 81% confidence based on localized agricultural pathology database.',
  },

  // Weather & Soil
  weatherSoil: {
    pageTitle: 'Weather & Soil Diagnostics',
    pageSubtitle: 'Impact-first agricultural meteorology and root-zone soil telemetry.',
    impactHeader: 'FARM WEATHER IMPACT',
    rainRiskHigh: 'HIGH RAIN RISK',
    rainRiskDesc: 'Heavy showers expected within 24-36 hours. Delay fertilizer application and avoid irrigation.',
    tempNow: 'Current Temperature',
    rainfallExpected: 'Expected Rain',
    humidity: 'Atmospheric Humidity',
    windSpeed: 'Wind Velocity',
    soilTelemetry: 'Root-Zone Soil Telemetry',
    soilMoistureStatus: 'Soil Moisture',
    soilMoistureStatusLabel: 'Optimal (67%)',
    soilPh: 'Soil pH',
    nitrogen: 'Available Nitrogen (N)',
    phosphorus: 'Phosphorus (P)',
    potassium: 'Potassium (K)',
    groundwater: 'Groundwater Depth',
    forecast7Day: '7-Day Agricultural Weather Forecast',
  },

  // Market & Mandi
  market: {
    pageTitle: 'Mandi Price & Market Advisory',
    pageSubtitle: 'Real-time APMC mandi rates and intelligent Sell vs Hold guidance.',
    shouldISellTitle: 'SHOULD I SELL TODAY?',
    holdRecommendation: 'HOLD PRODUCE',
    holdReason: 'Cotton arrivals are steady and mill procurement demand is up. Prices rose +4.2% this week.',
    suggestedWindow: 'Suggested holding window: 3 to 5 days (if dry storage is available).',
    currentRate: 'Current Modal Price',
    perQuintal: 'per quintal',
    trend7Day: '7-day trend',
    nearestMandi: 'Yavatmal APMC Mandi',
    priceHistory7Day: 'Cotton Price Trend (Last 7 Days)',
    nearbyMandis: 'Nearby Mandi Comparisons',
    otherCrops: 'Other Major Commodity Rates',
  },

  // Schemes & FPO
  schemes: {
    pageTitle: 'Government Schemes & FPO Support',
    pageSubtitle: 'Direct subsidies, financial assistance, and local Farmer Producer Organizations.',
    tabSchemes: 'Eligible Schemes',
    tabFPO: 'Nearby FPOs & Cooperatives',
    whyRelevant: 'Why this is relevant to you:',
    benefit: 'Key Benefit:',
    applyNow: 'Check Application Process',
    distance: 'away',
    members: 'Farmer Members',
    contactFPO: 'Call Representative',
  },

  // Advisory History
  advisoryHistory: {
    pageTitle: 'Advisory History & Outcomes',
    pageSubtitle: 'Review past daily decisions, weather conditions, and resulting farm impact.',
    today: 'Today, 06:30 AM',
    yesterday: 'Yesterday, 06:30 AM',
    daysAgo3: '3 Days Ago',
    lastWeek: 'Last Week (Aug 22)',
    viewWhy: 'View Full Decision Reasoning',
  },

  // My Farm
  farm: {
    pageTitle: 'Farm & Crop Profile',
    pageSubtitle: 'Manage land coordinates, soil classification, irrigation infrastructure, and active crop cycles.',
    farmDetails: 'Farm Land Details',
    cropDetails: 'Active Crop Details',
    editFarm: 'Edit Farm Profile',
    editCrop: 'Update Crop Cycle',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    landArea: 'Total Cultivated Land',
    soilType: 'Soil Classification',
    irrigationSource: 'Primary Irrigation',
    sowingDate: 'Sowing Date',
    growthStage: 'Current Growth Stage',
    variety: 'Crop Variety',
  },

  // Common UI
  common: {
    loading: 'Loading...',
    refresh: 'Refresh Data',
    offlineTitle: 'You are offline',
    offlineDesc: 'Showing your latest cached advisory from {time}. Actions will sync automatically when reconnected.',
    demoNotice: 'Demo Environment — Simulated sensor & APMC data for Maharashtra Cotton scenario.',
    allRightsReserved: 'Sujalam Agricultural Intelligence Platform.',
  }
};
