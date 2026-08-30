import OpenAI from 'openai';
import { 
  AIProvider, 
  AIContext, 
  OrchestratorResult, 
  RawAgentResult, 
  DecisionAgentResult 
} from './types';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';

export class OpenRouterProvider implements AIProvider {
  private openai: OpenAI | null = null;
  private model: string = 'openai/gpt-4o-mini';

  constructor() {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (apiKey) {
      this.openai = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: apiKey,
        defaultHeaders: {
          'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:3000',
          'X-Title': process.env.OPENROUTER_APP_NAME || 'Sujalam 2.0',
        }
      });
      this.model = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';
    }
  }

  private async callLLM<T>(systemPrompt: string, userPrompt: string, schema: z.ZodType<T>, schemaName: string): Promise<T> {
    if (!this.openai) {
      throw new Error("OpenRouter API key is missing.");
    }
    
    // Fallback to manual json parsing if structured outputs aren't strictly supported by all OpenRouter models yet
    // But we will try to use the OpenAI JSON structure.
    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt + ' Please respond in JSON.' },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1,
      }, { timeout: Number(process.env.AI_TIMEOUT_MS) || 15000 });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error("Empty response from AI");

      const parsed = JSON.parse(content);
      return schema.parse(parsed);
    } catch (error) {
      console.error(`[AI ERROR] OpenRouter call failed for ${schemaName}:`, error);
      throw error;
    }
  }

  async generateOrchestration(context: AIContext): Promise<OrchestratorResult> {
    const systemPrompt = `You are an Orchestrator Agent for an agricultural app. Determine the farmer's intent and required agents. 
    Return strictly JSON: { "intent": string, "required_agents": ("weather"|"crop"|"crop_health"|"market"|"decision"|"resource")[], "reason": string }`;
    
    const schema = z.object({
      intent: z.string(),
      required_agents: z.array(z.enum(['weather', 'crop', 'crop_health', 'market', 'decision', 'resource'])),
      reason: z.string()
    });

    return this.callLLM<OrchestratorResult>(
      systemPrompt, 
      `Context: ${JSON.stringify(context)}`,
      schema,
      'OrchestratorResult'
    );
  }

  async generateWeatherAnalysis(context: AIContext): Promise<RawAgentResult> {
    if (!context.weather) return { status: 'unavailable', reason: 'Weather data not provided' };
    
    const systemPrompt = `You are a Weather Agent. Analyze the weather data. DO NOT invent measurements. 
    Return strictly JSON: { "agent": "weather", "rain_risk": "LOW"|"MEDIUM"|"HIGH", "heat_stress": "LOW"|"MEDIUM"|"HIGH", "irrigation_impact": "IRRIGATE"|"DELAY"|"NEUTRAL", "reason": string, "confidence": number (0-1) }`;
    
    const schema = z.object({
      agent: z.literal('weather'),
      rain_risk: z.enum(['LOW', 'MEDIUM', 'HIGH']),
      heat_stress: z.enum(['LOW', 'MEDIUM', 'HIGH']),
      irrigation_impact: z.enum(['IRRIGATE', 'DELAY', 'NEUTRAL']),
      reason: z.string(),
      confidence: z.number().min(0).max(1)
    });

    try {
      const data = await this.callLLM(systemPrompt, `Weather Data: ${JSON.stringify(context.weather)}`, schema, 'WeatherAgentResult');
      return { status: 'success', data };
    } catch (e: any) {
      return { status: 'unavailable', reason: e.message };
    }
  }

  async generateCropAnalysis(context: AIContext): Promise<RawAgentResult> {
    if (!context.crop && !context.soil) return { status: 'unavailable', reason: 'Crop/Soil data not provided' };
    
    const systemPrompt = `You are a Crop/Soil Agent. Analyze moisture and crop stage. DO NOT invent measurements.
    Return strictly JSON: { "agent": "crop", "water_stress": "LOW"|"MEDIUM"|"HIGH", "irrigation_need": "LOW"|"MEDIUM"|"HIGH", "reason": string, "confidence": number (0-1) }`;
    
    const schema = z.object({
      agent: z.literal('crop'),
      water_stress: z.enum(['LOW', 'MEDIUM', 'HIGH']),
      irrigation_need: z.enum(['LOW', 'MEDIUM', 'HIGH']),
      reason: z.string(),
      confidence: z.number().min(0).max(1)
    });

    try {
      const data = await this.callLLM(systemPrompt, `Crop/Soil Data: ${JSON.stringify({ crop: context.crop, soil: context.soil })}`, schema, 'CropAgentResult');
      return { status: 'success', data };
    } catch (e: any) {
      return { status: 'unavailable', reason: e.message };
    }
  }

  async generateHealthAnalysis(context: AIContext): Promise<RawAgentResult> {
    if (!context.crop_health) return { status: 'unavailable', reason: 'Crop health data not provided' };
    
    const systemPrompt = `You are a Crop Health Agent. Analyze existing health data. DO NOT invent diseases.
    Return strictly JSON: { "agent": "crop_health", "disease_risk": "LOW"|"MEDIUM"|"HIGH"|"UNKNOWN", "action": "ACT"|"INSPECT"|"MONITOR"|"INSUFFICIENT_DATA", "reason": string, "confidence": number (0-1) }`;
    
    const schema = z.object({
      agent: z.literal('crop_health'),
      disease_risk: z.enum(['LOW', 'MEDIUM', 'HIGH', 'UNKNOWN']),
      action: z.enum(['ACT', 'INSPECT', 'MONITOR', 'INSUFFICIENT_DATA']),
      reason: z.string(),
      confidence: z.number().min(0).max(1)
    });

    try {
      const data = await this.callLLM(systemPrompt, `Health Data: ${JSON.stringify(context.crop_health)}`, schema, 'CropHealthAgentResult');
      return { status: 'success', data };
    } catch (e: any) {
      return { status: 'unavailable', reason: e.message };
    }
  }

  async generateMarketAnalysis(context: AIContext): Promise<RawAgentResult> {
    if (!context.market) return { status: 'unavailable', reason: 'Market data not provided' };
    
    const systemPrompt = `You are a Market Agent. Interpret price trends. DO NOT calculate percentages yourself.
    Return strictly JSON: { "agent": "market", "trend": "INCREASING"|"DECREASING"|"STABLE"|"UNKNOWN", "recommendation": "SELL"|"HOLD"|"INSUFFICIENT_DATA", "reason": string, "confidence": number (0-1) }`;
    
    const schema = z.object({
      agent: z.literal('market'),
      trend: z.enum(['INCREASING', 'DECREASING', 'STABLE', 'UNKNOWN']),
      recommendation: z.enum(['SELL', 'HOLD', 'INSUFFICIENT_DATA']),
      reason: z.string(),
      confidence: z.number().min(0).max(1)
    });

    try {
      const data = await this.callLLM(systemPrompt, `Market Data: ${JSON.stringify(context.market)}`, schema, 'MarketAgentResult');
      return { status: 'success', data };
    } catch (e: any) {
      return { status: 'unavailable', reason: e.message };
    }
  }

  async generateResourceAnalysis(context: AIContext): Promise<RawAgentResult> {
    if (!context.resource_context) return { status: 'unavailable', reason: 'Resource data not provided' };
    
    const systemPrompt = `You are a Resource Agent. Evaluate factual resource candidates. DO NOT invent candidates or facts.
    Return strictly JSON: { "agent": "resource", "recommended_option": { "resource_ids": string[], "reason": string, "estimated_cost": number, "estimated_distance_km": number } | null, "action": "BOOK"|"WAIT"|"NO_MATCH"|"INSUFFICIENT_DATA", "urgency": "HIGH"|"MEDIUM"|"LOW", "confidence": number (0-1) }`;
    
    const schema = z.object({
      agent: z.literal('resource'),
      recommended_option: z.object({
        resource_ids: z.array(z.string()),
        reason: z.string(),
        estimated_cost: z.number(),
        estimated_distance_km: z.number()
      }).nullable(),
      action: z.enum(['BOOK', 'WAIT', 'NO_MATCH', 'INSUFFICIENT_DATA']),
      urgency: z.enum(['HIGH', 'MEDIUM', 'LOW']),
      confidence: z.number().min(0).max(1)
    });

    try {
      const data = await this.callLLM(systemPrompt, `Resource Context: ${JSON.stringify(context.resource_context)}`, schema, 'ResourceAgentResult');
      return { status: 'success', data };
    } catch (e: any) {
      return { status: 'unavailable', reason: e.message };
    }
  }

  async generateFinalDecision(context: AIContext, agentResults: Record<string, RawAgentResult>): Promise<DecisionAgentResult> {
    const systemPrompt = `You are the Decision Agent resolving recommendations from specialized agents.
    You must identify conflicts. You must prioritize safety (e.g. wait for rain before irrigating).
    Generate 2-3 top_actions max. Return strictly JSON.
    Format:
    {
      "agent": "decision",
      "overall_status": "normal" | "attention" | "urgent",
      "irrigation_decision": "IRRIGATE" | "WAIT" | "SKIP",
      "irrigation_reason": "string",
      "top_actions": ["action1", "action2"],
      "conflicts": [{"between": ["agent1", "agent2"], "description": "str"}],
      "confidence": number (0-1)
    }`;

    const schema = z.object({
      agent: z.literal('decision'),
      overall_status: z.enum(['normal', 'attention', 'urgent']),
      irrigation_decision: z.enum(['IRRIGATE', 'WAIT', 'SKIP']),
      irrigation_reason: z.string(),
      top_actions: z.array(z.string()).max(3),
      conflicts: z.array(z.object({
        between: z.array(z.string()),
        description: z.string()
      })),
      confidence: z.number().min(0).max(1)
    });

    const combinedInput = {
      context,
      agent_results: agentResults
    };

    return this.callLLM(systemPrompt, `Data: ${JSON.stringify(combinedInput)}`, schema, 'DecisionAgentResult');
  }

  async generateStructuredResponse(systemPrompt: string, userPrompt: string, schema: any): Promise<{ data: any, error?: string }> {
    try {
      const data = await this.callLLM(systemPrompt, userPrompt, schema, 'GenericStructuredResponse');
      return { data };
    } catch (e: any) {
      return { data: null, error: e.message };
    }
  }
}
