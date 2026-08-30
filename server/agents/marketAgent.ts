import { AIContext, RawAgentResult, AIProvider } from '../integrations/ai/types';

export async function runMarketAgent(context: AIContext, provider: AIProvider): Promise<RawAgentResult> {
  if (!context.market) {
    return { status: 'unavailable', reason: 'No market context available' };
  }
  try {
    return await provider.generateMarketAnalysis(context);
  } catch (error) {
    console.error('[AI] Market Agent failed', error);
    return { status: 'unavailable', reason: 'Market agent failed' };
  }
}
