import { AIContext, RawAgentResult, AIProvider } from '../integrations/ai/types';

export async function runCropAgent(context: AIContext, provider: AIProvider): Promise<RawAgentResult> {
  if (!context.crop && !context.soil) {
    return { status: 'unavailable', reason: 'No crop or soil context available' };
  }
  try {
    return await provider.generateCropAnalysis(context);
  } catch (error) {
    console.error('[AI] Crop Agent failed', error);
    return { status: 'unavailable', reason: 'Crop agent failed' };
  }
}
