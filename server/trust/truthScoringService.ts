import { ProcessedEvidence } from './contradictionService';

export interface TruthScoreResult {
  truth_score: number;
  safety_risk: number;
}

export const calculateTruthScore = (
  evidenceList: ProcessedEvidence[],
  claimType: string
): TruthScoreResult => {
  if (evidenceList.length === 0) {
    return { truth_score: 0, safety_risk: claimType === 'TREATMENT' ? 100 : 0 };
  }

  let base_score = 50;
  let supports_weight = 0;
  let contradicts_weight = 0;
  
  evidenceList.forEach(ev => {
    // Authority multiplier
    let authority_multiplier = 1;
    if (ev.authority_level === 'LEVEL_1') authority_multiplier = 3;
    else if (ev.authority_level === 'LEVEL_2') authority_multiplier = 2.5;
    else if (ev.authority_level === 'LEVEL_3') authority_multiplier = 1.5;
    else if (ev.authority_level === 'LEVEL_4') authority_multiplier = 0.5;
    else authority_multiplier = 0.1;

    if (ev.supports_claim) {
      supports_weight += 20 * authority_multiplier;
    }
    
    if (ev.contradicts_claim) {
      contradicts_weight += 25 * authority_multiplier; // Contradictions are weighed heavier
    }
  });

  base_score = base_score + supports_weight - contradicts_weight;
  
  // Cap between 0 and 100
  let truth_score = Math.max(0, Math.min(100, Math.round(base_score)));

  // Safety risk logic
  let safety_risk = 0;
  if (claimType === 'TREATMENT') {
    // If it's a treatment and we have strong contradiction, safety risk is max
    if (contradicts_weight > 0) safety_risk = 100;
    // If it's a treatment and we have NO supporting authoritative evidence, safety risk is high
    else if (supports_weight < 15) safety_risk = 85;
    else safety_risk = 10;
  }

  return { truth_score, safety_risk };
};
