import { AIContext, RawAgentResult, DecisionAgentResult, AIProvider } from '../integrations/ai/types';

export async function runDecisionAgent(
  context: AIContext,
  agentResults: Record<string, RawAgentResult>,
  provider: AIProvider
): Promise<DecisionAgentResult> {
  try {
    return await provider.generateFinalDecision(context, agentResults);
  } catch (error) {
    console.error('[AI] Decision Agent failed', error);
    // Deterministic fallback if the decision agent itself fails
    return {
      agent: 'decision',
      overall_status: 'normal',
      irrigation_decision: 'SKIP',
      irrigation_reason: 'Decision agent unavailable. Consult local deterministic rules if needed.',
      top_actions: ['AI services are temporarily degraded.'],
      conflicts: [],
      confidence: 0
    };
  }
}
