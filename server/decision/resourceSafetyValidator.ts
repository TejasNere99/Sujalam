import { AIContext, RawAgentResult } from '../integrations/ai/types';

export function validateResourceRecommendation(
  context: AIContext,
  resourceResult: RawAgentResult | undefined
): any {
  if (!resourceResult || resourceResult.status !== 'success' || !resourceResult.data || !context.resource_context) {
    return null;
  }

  const { data } = resourceResult;
  let action = data.action;
  let resource_ids = data.recommended_option?.resource_ids || [];
  let reason = data.recommended_option?.reason || 'No specific resource recommendation.';
  let estimated_cost = data.recommended_option?.estimated_cost || 0;

  // SAFETY RULE 1: Never invent resources
  const availableResourceIds = [
    ...(context.resource_context.labour_matches?.map(r => r.resource_id) || []),
    ...(context.resource_context.machinery_matches?.map(r => r.resource_id) || [])
  ];

  const validIds = resource_ids.filter((id: string) => availableResourceIds.includes(id));
  
  if (resource_ids.length > 0 && validIds.length === 0) {
    console.warn('[SAFETY] AI Hallucinated resource IDs blocked:', resource_ids);
    action = 'NO_MATCH';
    reason = 'Safety Override: AI attempted to recommend an unavailable or fictitious resource.';
    resource_ids = [];
    estimated_cost = 0;
  } else if (validIds.length < resource_ids.length) {
    console.warn('[SAFETY] AI Partially Hallucinated resource IDs blocked');
    resource_ids = validIds;
    reason += ' (Note: Some invalid resources were removed for safety).';
  }

  // SAFETY RULE 2: If we need a resource but none are matched by deterministic engine, action MUST be NO_MATCH
  if (availableResourceIds.length === 0 && action === 'BOOK') {
    action = 'NO_MATCH';
    reason = 'Safety Override: Booking recommended but no verified deterministic resources are available.';
    resource_ids = [];
  }

  return {
    action,
    resource_ids,
    reason,
    estimated_cost
  };
}
