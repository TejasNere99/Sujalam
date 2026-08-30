export const calculateWeatherRisk = (weather: any) => {
  const result: any = {
    risk: 'LOW',
    summary: 'Weather data unavailable. Assuming normal conditions.'
  };

  if (!weather || typeof weather.rain_probability_percent !== 'number') {
    return result;
  }

  const rainProb = weather.rain_probability_percent;

  if (rainProb > 70) {
    result.risk = 'HIGH';
    result.summary = 'Rain is highly likely within the next 24 hours. Take necessary precautions.';
  } else if (rainProb > 30) {
    result.risk = 'MEDIUM';
    result.summary = 'Moderate chance of rain. Stay updated.';
  } else {
    result.risk = 'LOW';
    result.summary = 'Clear weather expected.';
  }

  return result;
};
