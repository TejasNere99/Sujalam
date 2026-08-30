import { AIContext, OrchestratorResult, AIProvider } from '../integrations/ai/types';

export async function runOrchestrator(context: AIContext, provider: AIProvider): Promise<OrchestratorResult> {
  try {
    const result = await provider.generateOrchestration(context);
    return result;
  } catch (error) {
    console.error('[AI] Orchestrator failed, using deterministic fallback', error);
    // Fallback: Default to all agents if Orchestrator fails
    return {
      intent: 'GENERAL_FARM_ADVISORY',
      required_agents: ['weather', 'crop', 'crop_health', 'market', 'decision', 'resource'],
      reason: 'Orchestrator unavailable, using fallback full advisory.'
    };
  }
}
