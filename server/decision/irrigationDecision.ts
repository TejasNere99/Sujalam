import { getLatestSoilReading } from '../services/soilService';
import { getLatestWeather } from '../services/weatherService';

export const calculateIrrigationDecision = (soil: any, weather: any) => {
  // Safe default for complete missing data
  const result: any = {
    decision: 'WAIT',
    timing: 'Unknown',
    reason: 'Insufficient data for irrigation decision.',
    confidence: 0
  };

  if (!soil && !weather) return result;

  const hasSoil = soil && typeof soil.moisture_percent === 'number';
  const hasWeather = weather && typeof weather.rain_probability_percent === 'number';

  const moisture = hasSoil ? soil.moisture_percent : null;
  const rainProb = hasWeather ? weather.rain_probability_percent : null;

  // Confidence Calculation
  if (hasSoil && hasWeather) {
    result.confidence = 90; // High confidence when both signals exist
  } else if (hasSoil && !hasWeather) {
    result.confidence = 45; // Slashed by 50% without weather context
  } else if (!hasSoil && hasWeather) {
    result.confidence = 30; // Very low confidence without soil ground-truth
  }

  // Conflict Resolution & Matrices
  
  if (hasSoil && hasWeather) {
    if (moisture > 60) {
      result.decision = 'SKIP';
      result.timing = 'N/A';
      result.reason = 'Soil moisture is sufficient.';
    } else if (moisture < 40) {
      if (rainProb > 50) {
        result.decision = 'WAIT';
        result.timing = '24 hours';
        result.reason = `Rain probability is high (${rainProb}%), delay irrigation despite low soil moisture.`;
      } else {
        result.decision = 'IRRIGATE';
        result.timing = 'Today';
        result.reason = 'Soil moisture is low and significant rain is unlikely.';
      }
    } else {
      // Medium soil (40-60)
      if (rainProb > 50) {
        result.decision = 'WAIT';
        result.timing = '24 hours';
        result.reason = `Rain probability is high (${rainProb}%), delay irrigation.`;
      } else {
        result.decision = 'WAIT';
        result.timing = 'Monitor';
        result.reason = 'Soil moisture is adequate and no immediate rain expected. Monitor.';
      }
    }
  } else if (hasSoil && !hasWeather) {
    if (moisture > 60) {
      result.decision = 'SKIP';
      result.timing = 'N/A';
      result.reason = 'Soil moisture is sufficient (Weather unknown).';
    } else if (moisture < 40) {
      result.decision = 'IRRIGATE';
      result.timing = 'Today';
      result.reason = 'Soil moisture is low (Weather unknown, proceed with caution).';
    } else {
      result.decision = 'WAIT';
      result.timing = 'Monitor';
      result.reason = 'Soil moisture is adequate (Weather unknown).';
    }
  } else if (!hasSoil && hasWeather) {
    // Only have weather
    if (rainProb > 50) {
      result.decision = 'WAIT';
      result.timing = '24 hours';
      result.reason = `Rain probability is high (${rainProb}%), wait before irrigating. (Soil unknown).`;
    } else {
      result.decision = 'WAIT';
      result.timing = 'Unknown';
      result.reason = 'Cannot recommend irrigation without soil moisture data.';
    }
  }

  return result;
};
