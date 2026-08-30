import { 
  AIProvider, 
  AIContext, 
  OrchestratorResult, 
  RawAgentResult, 
  DecisionAgentResult 
} from './types';

export class MockAIProvider implements AIProvider {
  async generateOrchestration(context: AIContext): Promise<OrchestratorResult> {
    return {
      intent: 'GENERAL_FARM_ADVISORY',
      required_agents: ['weather', 'crop', 'crop_health', 'market', 'decision', 'resource'],
      reason: 'Mock orchestrator default selection.'
    };
  }

  async generateWeatherAnalysis(context: AIContext): Promise<RawAgentResult> {
    if (!context.weather) return { status: 'unavailable', reason: 'Weather data not provided' };
    
    let risk: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    let impact: 'IRRIGATE' | 'DELAY' | 'NEUTRAL' = 'NEUTRAL';
    
    if ((context.weather.rain_probability_percent ?? 0) > 60) {
      risk = 'HIGH';
      impact = 'DELAY';
    }

    return {
      status: 'success',
      data: {
        agent: 'weather',
        rain_risk: risk,
        heat_stress: 'LOW',
        irrigation_impact: impact,
        reason: 'Mock weather analysis',
        confidence: 0.9
      }
    };
  }

  async generateCropAnalysis(context: AIContext): Promise<RawAgentResult> {
    if (!context.crop && !context.soil) return { status: 'unavailable', reason: 'Crop/Soil data not provided' };
    
    let need: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if ((context.soil?.moisture_percent ?? 100) < 40) {
      need = 'HIGH';
    }

    return {
      status: 'success',
      data: {
        agent: 'crop',
        water_stress: need === 'HIGH' ? 'HIGH' : 'LOW',
        irrigation_need: need,
        reason: 'Mock crop analysis',
        confidence: 0.85
      }
    };
  }

  async generateHealthAnalysis(context: AIContext): Promise<RawAgentResult> {
    if (!context.crop_health) return { status: 'unavailable', reason: 'Crop health data not provided' };
    
    let action: 'ACT' | 'INSPECT' | 'MONITOR' | 'INSUFFICIENT_DATA' = 'MONITOR';
    if ((context.crop_health.disease_probability ?? 0) > 60) action = 'ACT';

    return {
      status: 'success',
      data: {
        agent: 'crop_health',
        disease_risk: action === 'ACT' ? 'HIGH' : 'LOW',
        action,
        reason: 'Mock health analysis',
        confidence: 0.8
      }
    };
  }

  async generateMarketAnalysis(context: AIContext): Promise<RawAgentResult> {
    if (!context.market) return { status: 'unavailable', reason: 'Market data not provided' };
    
    return {
      status: 'success',
      data: {
        agent: 'market',
        trend: (context.market.trend_7d_percent ?? 0) > 0 ? 'INCREASING' : 'DECREASING',
        recommendation: (context.market.trend_7d_percent ?? 0) > 0 ? 'HOLD' : 'SELL',
        reason: 'Mock market analysis',
        confidence: 0.75
      }
    };
  }

  async generateResourceAnalysis(context: AIContext): Promise<RawAgentResult> {
    if (!context.resource_context) return { status: 'unavailable', reason: 'Resource context not provided' };
    
    return {
      status: 'success',
      data: {
        agent: 'resource',
        recommended_option: context.resource_context?.machinery_matches?.length ? {
          resource_ids: [context.resource_context.machinery_matches[0].resource_id],
          reason: 'Mock machinery match found',
          estimated_cost: context.resource_context.machinery_matches[0].rate || 1000,
          estimated_distance_km: context.resource_context.machinery_matches[0].distance_km || 5
        } : null,
        action: context.resource_context?.machinery_matches?.length ? 'BOOK' : 'NO_MATCH',
        urgency: 'MEDIUM',
        confidence: 0.9
      }
    };
  }

  async generateFinalDecision(context: AIContext, agentResults: Record<string, RawAgentResult>): Promise<DecisionAgentResult> {
    const weather = agentResults.weather?.data;
    const crop = agentResults.crop?.data;

    let decision: 'IRRIGATE' | 'WAIT' | 'SKIP' = 'SKIP';
    let conflicts: any[] = [];

    if (crop?.irrigation_need === 'HIGH') {
      if (weather?.irrigation_impact === 'DELAY') {
        decision = 'WAIT';
        conflicts.push({
          between: ['crop', 'weather'],
          description: 'Crop needs water, but rain is expected.'
        });
      } else {
        decision = 'IRRIGATE';
      }
    }

    return {
      agent: 'decision',
      overall_status: conflicts.length > 0 ? 'attention' : 'normal',
      irrigation_decision: decision,
      irrigation_reason: 'Mock decision based on agent synthesis.',
      top_actions: ['Monitor crop', 'Check market'],
      conflicts,
      confidence: 0.88
    };
  }

  async generateStructuredResponse(systemPrompt: string, userPrompt: string, schema: any): Promise<{ data: any, error?: string }> {
    // For TruthGuard Mocking
    if (systemPrompt.includes('expert agricultural claim extraction')) {
      return {
        data: {
          claim_type: 'SCHEME',
          subject: 'Unknown',
          predicate: 'is unknown',
          value: 'true',
          normalized_claim: 'A mocked generic claim.'
        }
      };
    }
    
    if (systemPrompt.includes('Evidence Contradiction Analyst')) {
      return {
        data: {
          evidence_excerpt: 'Mocked evidence excerpt.',
          supports_claim: true,
          contradicts_claim: false,
          evidence_status: 'SUPPORTS',
          reasoning: 'Mocked reasoning.'
        }
      };
    }
    
    return { error: 'Not implemented in mock provider' as any, data: null };
  }
}
