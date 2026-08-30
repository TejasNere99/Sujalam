import { AIContext, RawAgentResult, AIProvider } from '../integrations/ai/types';

export async function runWeatherAgent(context: AIContext, provider: AIProvider): Promise<RawAgentResult> {
  if (!context.weather) {
    return { status: 'unavailable', reason: 'No weather context available' };
  }
  try {
    return await provider.generateWeatherAnalysis(context);
  } catch (error) {
    console.error('[AI] Weather Agent failed', error);
    return { status: 'unavailable', reason: 'Weather agent failed' };
  }
}
