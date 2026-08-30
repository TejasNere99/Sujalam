import { AIContext, RawAgentResult, AIProvider } from '../integrations/ai/types';

export async function runCropHealthAgent(context: AIContext, provider: AIProvider): Promise<RawAgentResult> {
  if (!context.crop_health) {
    return { status: 'unavailable', reason: 'No crop health context available' };
  }
  try {
    return await provider.generateHealthAnalysis(context);
  } catch (error) {
    console.error('[AI] Crop Health Agent failed', error);
    return { status: 'unavailable', reason: 'Crop Health agent failed' };
  }
}
