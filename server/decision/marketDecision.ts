export const calculateMarketDecision = (market: any) => {
  const result: any = {
    decision: 'HOLD',
    timing: 'Unknown',
    reason: 'Market data unavailable.',
    confidence: 0
  };

  if (!market || typeof market.trend_7d_percent !== 'number') {
    return result;
  }

  const trend = market.trend_7d_percent;

  if (trend > 2.0) {
    result.decision = 'HOLD';
    result.timing = '3 days';
    result.reason = 'Short-term market trend is positive. If storage is available, consider waiting.';
    result.confidence = 78;
  } else if (trend < -2.0) {
    result.decision = 'SELL';
    result.timing = 'Today';
    result.reason = 'Market trend is negative. Consider selling to avoid further loss.';
    result.confidence = 80;
  } else {
    result.decision = 'HOLD';
    result.timing = 'Monitor';
    result.reason = 'Market is stable. Hold unless immediate cash is needed.';
    result.confidence = 60;
  }

  return result;
};
