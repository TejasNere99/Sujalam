import { AIContext, RawAgentResult } from '../integrations/ai/types';
import { getAIProvider } from '../integrations/ai/aiFactory';
import { runOrchestrator } from '../agents/orchestratorAgent';
import { runWeatherAgent } from '../agents/weatherAgent';
import { runCropAgent } from '../agents/cropAgent';
import { runCropHealthAgent } from '../agents/cropHealthAgent';
import { runMarketAgent } from '../agents/marketAgent';
import { runDecisionAgent } from '../agents/decisionAgent';
import { runResourceAgent } from '../agents/resourceAgent';
import { validateAndSanitizeDecision } from './aiSafetyValidator';

export const generateAdvisoryData = async (
  farmId: string,
  soil: any,
  weather: any,
  cropHealth: any,
  market: any,
  resourceMatches?: { labour: any[], machinery: any[], requested_operation: string, requiredDate: string }
) => {
  const context: AIContext = {
    farmer: { id: 'farmer-placeholder' },
    farm: { id: farmId, name: 'Farm' },
    crop: { name: 'Crop', growth_stage: 'Vegetative' }, // Basic mock crop context for now
    soil: soil ? { moisture_percent: soil.moisture_percent } : null,
    weather: weather ? {
      temperature: weather.temperature,
      rain_probability_percent: weather.rain_probability_percent,
    } : null,
    crop_health: cropHealth ? {
      health_status: cropHealth.health_status,
      disease_probability: cropHealth.disease_probability
    } : null,
    market: market ? {
      trend_7d_percent: market.trend_7d_percent
    } : null,
    resource_context: resourceMatches ? {
      requested_operation: resourceMatches.requested_operation,
      requiredDate: resourceMatches.requiredDate,
      labour_matches: resourceMatches.labour,
      machinery_matches: resourceMatches.machinery
    } : undefined,
    schemes: [],
    fpos: []
  };

  const provider = getAIProvider();
  const startTime = Date.now();

  try {
    // 1. Orchestrator decides which agents to run
    const orchestratorResult = await runOrchestrator(context, provider);

    // 2. Run selected agents in parallel using allSettled
    const agentsToRun = orchestratorResult.required_agents;
    const promises: Promise<any>[] = [];
    const agentMap: string[] = [];

    if (agentsToRun.includes('weather')) { promises.push(runWeatherAgent(context, provider)); agentMap.push('weather'); }
    if (agentsToRun.includes('crop')) { promises.push(runCropAgent(context, provider)); agentMap.push('crop'); }
    if (agentsToRun.includes('crop_health')) { promises.push(runCropHealthAgent(context, provider)); agentMap.push('crop_health'); }
    if (agentsToRun.includes('market')) { promises.push(runMarketAgent(context, provider)); agentMap.push('market'); }
    if (agentsToRun.includes('resource') && context.resource_context) { promises.push(runResourceAgent(context, provider)); agentMap.push('resource'); }

    const results = await Promise.allSettled(promises);
    
    // 3. Collect outputs
    const agentResults: Record<string, RawAgentResult> = {};
    results.forEach((res, index) => {
      const agentName = agentMap[index];
      if (res.status === 'fulfilled') {
        agentResults[agentName] = res.value;
      } else {
        console.error(`[AI] Agent ${agentName} Promise rejected:`, res.reason);
        agentResults[agentName] = { status: 'unavailable', reason: 'Agent promise rejected' };
      }
    });

    // 4. Run Decision Agent
    const decision = await runDecisionAgent(context, agentResults, provider);

    // 5. Deterministic Safety Validation
    const validatedAdvisory = validateAndSanitizeDecision(decision, context, agentResults);

    // 6. Return Final Validated Advisory
    return {
      farm_id: farmId,
      generated_at: new Date(),
      ...validatedAdvisory,
      ai_metadata: {
        provider: process.env.AI_PROVIDER || 'mock',
        agents_used: agentsToRun,
        fallback: (process.env.AI_PROVIDER || 'mock') === 'mock',
        latency_ms: Date.now() - startTime
      }
    };
  } catch (error) {
    console.error('[AI] Pipeline failed critically. Using completely deterministic fallback.', error);
    // Completely Deterministic Fallback if the whole AI pipeline crashes
    return generateDeterministicFallback(farmId, context);
  }
};

function generateDeterministicFallback(farmId: string, context: AIContext) {
  return {
    farm_id: farmId,
    generated_at: new Date(),
    overall_status: 'attention',
    irrigation: {
      decision: (context.weather?.rain_probability_percent ?? 0) > 60 ? 'WAIT' : 'SKIP',
      timing: 'Monitor',
      reason: 'AI service unavailable. Defaulting to safe irrigation rules.',
      confidence: 30
    },
    crop_health: { decision: 'MONITOR', reason: 'Service degraded.', confidence: 0 },
    market: { decision: 'HOLD', timing: 'Monitor', reason: 'Service degraded.', confidence: 0 },
    weather: { risk: 'MEDIUM', summary: 'Check local weather manually.' },
    top_actions: ['AI Decision Engine is temporarily offline. Monitor farm manually.'],
    supporting_signals: {
      rain_probability_percent: context.weather?.rain_probability_percent ?? null,
      soil_moisture_percent: context.soil?.moisture_percent ?? null,
      disease_probability_percent: context.crop_health?.disease_probability ?? null,
      market_trend_percent: context.market?.trend_7d_percent ?? null,
    },
    ai_metadata: { provider: 'mock_fallback', agents_used: [], fallback: true }
  };
}
