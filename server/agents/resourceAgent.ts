import { AIContext, RawAgentResult, AIProvider } from '../integrations/ai/types';

export async function runResourceAgent(context: AIContext, provider: AIProvider): Promise<RawAgentResult> {
  try {
    return await provider.generateResourceAnalysis(context);
  } catch (error) {
    console.error('[AI] Resource Agent failed, using deterministic fallback', error);
    return {
      status: 'unavailable',
      reason: 'Resource agent analysis failed',
      data: {
        agent: 'resource',
        recommended_option: null,
        action: 'INSUFFICIENT_DATA',
        urgency: 'LOW',
        confidence: 0
      }
    };
  }
}
