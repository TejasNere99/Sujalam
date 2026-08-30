import { AIProvider } from './types';
import { OpenRouterProvider } from './openRouterProvider';
import { MockAIProvider } from './mockAIProvider';

export function getAIProvider(): AIProvider {
  const providerName = process.env.AI_PROVIDER || 'mock';
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (providerName === 'openrouter' && apiKey) {
    console.log('[AI] Initializing OpenRouter Provider');
    return new OpenRouterProvider();
  }

  console.log('[AI] Initializing Mock Provider (Fallback/Dev Mode)');
  return new MockAIProvider();
}
