export const formatAdvisoryForWhatsApp = (advisory: any) => {
  let message = `🌾 TODAY'S FARM PLAN\n\n`;

  // Irrigation
  let waterIcon = advisory.irrigation.decision === 'IRRIGATE' ? '💧' : '⏳';
  message += `${waterIcon} WATER: ${advisory.irrigation.decision}\n${advisory.irrigation.reason}\n\n`;

  // Crop Health
  let healthIcon = advisory.crop_health.decision === 'MONITOR' ? '🌱' : '⚠️';
  message += `${healthIcon} CROP: ${advisory.crop_health.decision}\n${advisory.crop_health.reason}\n\n`;

  // Market
  let marketIcon = advisory.market.decision === 'HOLD' ? '📦' : '💰';
  message += `${marketIcon} MARKET: ${advisory.market.decision}\n${advisory.market.reason}\n\n`;

  // Weather
  let weatherIcon = advisory.weather.risk === 'HIGH' ? '🌧️' : '☀️';
  message += `${weatherIcon} WEATHER: ${advisory.weather.risk} RISK\n${advisory.weather.summary}\n\n`;

  // Top Actions (The Priority Queue output)
  message += `📌 TOP PRIORITIES TODAY:\n`;
  if (advisory.top_actions && advisory.top_actions.length > 0) {
    advisory.top_actions.forEach((action: string, idx: number) => {
      message += `${idx + 1}. ${action}\n`;
    });
  } else {
    message += `1. Monitor general farm conditions.\n`;
  }

  return message;
};
