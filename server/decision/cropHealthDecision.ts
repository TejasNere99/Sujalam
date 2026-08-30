export const calculateCropHealthDecision = (cropHealth: any) => {
  const result: any = {
    decision: 'MONITOR',
    reason: 'Crop health data unavailable.',
    confidence: 0
  };

  if (!cropHealth || typeof cropHealth.disease_probability !== 'number') {
    return result;
  }

  const prob = cropHealth.disease_probability;
  const status = cropHealth.health_status;

  if (prob >= 70 || status === 'high_risk') {
    result.decision = 'ACT';
    result.reason = cropHealth.recommended_action || 'High disease probability detected. Immediate action required.';
    result.confidence = 85;
  } else if (prob >= 40 || status === 'needs_attention') {
    result.decision = 'INSPECT';
    result.reason = 'Moderate disease probability. Inspect crop for early symptoms.';
    result.confidence = 70;
  } else {
    result.decision = 'MONITOR';
    result.reason = 'Crop appears healthy based on current signals.';
    result.confidence = 90;
  }

  return result;
};
