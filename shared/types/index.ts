export type Farm = {
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

export type FarmCrop = {
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

export type SoilReading = {
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

export type WeatherSnapshot = {
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

export type CropHealth = {
  id: string;
  farm_id: string;
  crop_id: string | null;
  image_url: string | null;
  crop_name: string | null;
  disease_name: string | null;
  disease_probability: number | null;
  health_status:
    | "healthy"
    | "needs_attention"
    | "high_risk"
    | "unknown";
  recommended_action: string | null;
  source: string;
  created_at: string;
};

export type MarketPrice = {
  id: string;
  crop_name: string;
  market_name: string | null;
  price_per_quintal: number | null;
  trend_7d_percent: number | null;
  recorded_at: string;
  source: string;
};

export type Scheme = {
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

export type FarmAdvisory = {
  id: string;
  farm_id: string;
  generated_at: string;

  overall_status: "normal" | "attention" | "urgent";

  irrigation: {
    decision: "IRRIGATE" | "WAIT" | "SKIP";
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

  ai_metadata?: {
    provider: string;
    model?: string;
    agents_used: string[];
    fallback: boolean;
    latency_ms?: number;
    generated_at?: string;
  };
};

export interface FPO {
  id: string;
  name: string;
  registration_number?: string;
  description?: string;
  district?: string;
  state?: string;
  block?: string;
  village?: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  distance_km?: number | null;
  member_count?: number | null;
  contact_person?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  services?: string[];
  crops_supported?: string[];
  
  source_name: string;
  source_url: string;
  source_document?: string;
  source_record_reference?: string;
  
  verified: boolean;
  active: boolean;
}

export * from './trust';
