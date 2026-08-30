export type AgentType = 'orchestrator' | 'weather' | 'crop' | 'crop_health' | 'market' | 'decision' | 'resource';

export interface AIContext {
  farmer: {
    id: string;
    language?: string;
  };
  farm: {
    id: string;
    name: string;
    acres?: number;
  };
  crop: {
    name: string;
    growth_stage?: string;
    age_days?: number;
  } | null;
  soil: {
    moisture_percent?: number;
    ph?: number;
    nitrogen?: number;
    phosphorus?: number;
    potassium?: number;
  } | null;
  weather: {
    temperature?: number;
    humidity?: number;
    rain_probability_percent?: number;
    rainfall_mm?: number;
  } | null;
  crop_health: {
    health_status?: string;
    disease_probability?: number;
    diagnosis?: string;
  } | null;
  market: {
    commodity?: string;
    current_price?: number;
    trend_7d_percent?: number;
  } | null;
  schemes: any[];
  fpos: any[];
  trust_context?: {
    verdict: string;
    truth_score: number;
    human_review_required: boolean;
  };
  resource_context?: {
    requested_operation: string;
    requiredDate: string;
    labour_matches: any[];
    machinery_matches: any[];
  };
}

export interface OrchestratorResult {
  intent: string;
  required_agents: AgentType[];
  reason: string;
}

export interface WeatherAgentResult {
  agent: 'weather';
  rain_risk: 'LOW' | 'MEDIUM' | 'HIGH';
  heat_stress: 'LOW' | 'MEDIUM' | 'HIGH';
  irrigation_impact: 'IRRIGATE' | 'DELAY' | 'NEUTRAL';
  reason: string;
  confidence: number;
}

export interface CropAgentResult {
  agent: 'crop';
  water_stress: 'LOW' | 'MEDIUM' | 'HIGH';
  irrigation_need: 'LOW' | 'MEDIUM' | 'HIGH';
  reason: string;
  confidence: number;
}

export interface CropHealthAgentResult {
  agent: 'crop_health';
  disease_risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN';
  action: 'ACT' | 'INSPECT' | 'MONITOR' | 'INSUFFICIENT_DATA';
  reason: string;
  confidence: number;
}

export interface MarketAgentResult {
  agent: 'market';
  trend: 'INCREASING' | 'DECREASING' | 'STABLE' | 'UNKNOWN';
  recommendation: 'SELL' | 'HOLD' | 'INSUFFICIENT_DATA';
  reason: string;
  confidence: number;
}

export interface ResourceAgentResult {
  agent: 'resource';
  recommended_option: {
    resource_ids: string[];
    reason: string;
    estimated_cost: number;
    estimated_distance_km: number;
  } | null;
  action: 'BOOK' | 'WAIT' | 'NO_MATCH' | 'INSUFFICIENT_DATA';
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  confidence: number;
}

export interface DecisionAgentResult {
  agent: 'decision';
  overall_status: 'normal' | 'attention' | 'urgent';
  irrigation_decision: 'IRRIGATE' | 'WAIT' | 'SKIP';
  irrigation_reason: string;
  top_actions: string[];
  conflicts: { between: string[]; description: string }[];
  confidence: number;
}

export interface RawAgentResult {
  status: 'success' | 'unavailable';
  data?: any;
  reason?: string;
  error?: string;
}

export interface AIProvider {
  generateOrchestration(context: AIContext): Promise<OrchestratorResult>;
  generateWeatherAnalysis(context: AIContext): Promise<RawAgentResult>;
  generateCropAnalysis(context: AIContext): Promise<RawAgentResult>;
  generateHealthAnalysis(context: AIContext): Promise<RawAgentResult>;
  generateMarketAnalysis(context: AIContext): Promise<RawAgentResult>;
  generateResourceAnalysis(context: AIContext): Promise<RawAgentResult>;
  generateFinalDecision(
    context: AIContext,
    agentResults: Record<string, RawAgentResult>
  ): Promise<DecisionAgentResult>;
  generateStructuredResponse(systemPrompt: string, userPrompt: string, schema: any): Promise<{ data: any, error?: string }>;
}
