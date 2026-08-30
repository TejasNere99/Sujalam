import { AIContext, DecisionAgentResult, RawAgentResult } from '../integrations/ai/types';
import { z } from 'zod';
import { validateResourceRecommendation } from './resourceSafetyValidator';

const AdvisorySchema = z.object({
  overall_status: z.enum(['normal', 'attention', 'urgent']),
  irrigation: z.object({
    decision: z.enum(['IRRIGATE', 'WAIT', 'SKIP']),
    timing: z.string(),
    reason: z.string(),
    confidence: z.number().min(0).max(100)
  }),
  crop_health: z.object({
    decision: z.enum(['ACT', 'INSPECT', 'MONITOR']),
    reason: z.string(),
    confidence: z.number().min(0).max(100)
  }),
  market: z.object({
    decision: z.enum(['SELL', 'HOLD']),
    timing: z.string(),
    reason: z.string(),
    confidence: z.number().min(0).max(100)
  }),
  weather: z.object({
    risk: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    summary: z.string()
  }),
  top_actions: z.array(z.string()).max(3)
});

export function validateAndSanitizeDecision(
  decision: DecisionAgentResult,
  context: AIContext,
  agentResults: Record<string, RawAgentResult>
): any {
  // Base constructed object from AI
  const advisory: any = {
    overall_status: decision.overall_status,
    irrigation: {
      decision: decision.irrigation_decision,
      timing: decision.irrigation_decision === 'IRRIGATE' ? 'Today' : 'Monitor',
      reason: decision.irrigation_reason,
      confidence: Math.round(decision.confidence * 100)
    },
    crop_health: {
      decision: agentResults.crop_health?.data?.action || 'MONITOR',
      reason: agentResults.crop_health?.data?.reason || 'No specific health issues flagged.',
      confidence: Math.round((agentResults.crop_health?.data?.confidence || 0) * 100)
    },
    market: {
      decision: agentResults.market?.data?.recommendation === 'SELL' ? 'SELL' : 'HOLD',
      timing: agentResults.market?.data?.recommendation === 'SELL' ? 'Today' : 'Monitor',
      reason: agentResults.market?.data?.reason || 'Hold produce if possible.',
      confidence: Math.round((agentResults.market?.data?.confidence || 0) * 100)
    },
    weather: {
      risk: agentResults.weather?.data?.rain_risk || 'LOW',
      summary: agentResults.weather?.data?.reason || 'Normal weather conditions.'
    },
    top_actions: decision.top_actions || [],
    supporting_signals: {
      rain_probability_percent: context.weather?.rain_probability_percent ?? null,
      soil_moisture_percent: context.soil?.moisture_percent ?? null,
      disease_probability_percent: context.crop_health?.disease_probability ?? null,
      market_trend_percent: context.market?.trend_7d_percent ?? null,
    },
    resource_recommendation: validateResourceRecommendation(context, agentResults.resource)
  };

  // SAFETY RULE 1: Over-irrigation prevention (Flood protection)
  if (context.soil && (context.soil.moisture_percent ?? 0) > 60) {
    if (advisory.irrigation.decision === 'IRRIGATE') {
      advisory.irrigation.decision = 'SKIP';
      advisory.irrigation.reason = 'Safety Override: Soil is already sufficiently moist (>60%). Do not irrigate to prevent root rot and water waste.';
      advisory.irrigation.confidence = 100;
      advisory.overall_status = 'normal';
    }
  }

  // SAFETY RULE 2: Imminent rain irrigation prevention
  if (context.weather && (context.weather.rain_probability_percent ?? 0) > 60) {
    if (advisory.irrigation.decision === 'IRRIGATE') {
      advisory.irrigation.decision = 'WAIT';
      advisory.irrigation.reason = 'Safety Override: High probability of rain detected. Delay irrigation to conserve water.';
      advisory.irrigation.confidence = 90;
    }
  }

  // SAFETY RULE 3: Missing Weather Data capping
  if (!context.weather) {
    advisory.irrigation.confidence = Math.min(advisory.irrigation.confidence, 50);
    advisory.weather.risk = 'MEDIUM'; // fallback safe
    advisory.weather.summary = 'Weather data unavailable. Monitor local conditions.';
  }

  // SAFETY RULE 4: Missing Crop Health Data capping
  if (!context.crop_health) {
    advisory.crop_health.decision = 'MONITOR';
    advisory.crop_health.reason = 'Crop health data unavailable.';
    advisory.crop_health.confidence = 0;
  }

  // SAFETY RULE 5: Missing Market Data capping
  if (!context.market) {
    advisory.market.decision = 'HOLD';
    advisory.market.reason = 'Market data unavailable.';
    advisory.market.confidence = 0;
  }

  // Final Zod validation against our strict contract
  try {
    // Only pass the properties Zod checks, rest (like supporting_signals) get appended later safely
    const parsed = AdvisorySchema.parse(advisory);
    return { ...advisory, ...parsed }; // Ensure types match
  } catch (error) {
    console.error('[AI SAFETY] Malformed AI Advisory rejected by Zod', error);
    throw new Error('AI output failed strict safety contract validation.');
  }
}
