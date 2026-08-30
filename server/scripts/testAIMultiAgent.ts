import dotenv from 'dotenv';
dotenv.config();

import { generateAdvisoryData } from '../decision/decisionEngine';

async function runTests() {
  console.log("=== STARTING MULTI-AGENT AI TESTS ===");
  console.log(`Using Provider: ${process.env.AI_PROVIDER || 'mock'}\n`);

  const mockSoil = { moisture_percent: 29 };
  const mockWeatherRain = { temperature: 28, rain_probability_percent: 86 };
  const mockWeatherClear = { temperature: 30, rain_probability_percent: 10 };
  const mockCropHealth = { health_status: 'Sick', disease_probability: 90 };
  const mockMarket = { trend_7d_percent: 5 };

  console.log("TEST 1: Low Soil Moisture + High Rain Probability (Conflict Resolution)");
  const res1 = await generateAdvisoryData('test-farm-1', mockSoil, mockWeatherRain, null, null);
  console.log(`Irrigation Decision: ${res1.irrigation.decision}`);
  console.log(`Reason: ${res1.irrigation.reason}`);
  if (res1.irrigation.decision !== 'WAIT') {
    console.error("❌ FAILED: Expected WAIT due to rain probability > 60%.");
  } else {
    console.log("✅ PASSED: Safety override prevented over-irrigation.");
  }
  console.log(`Top Actions: ${JSON.stringify(res1.top_actions)}\n`);

  console.log("TEST 2: Low Soil Moisture + Low Rain (Normal Irrigation)");
  const res2 = await generateAdvisoryData('test-farm-2', mockSoil, mockWeatherClear, null, null);
  console.log(`Irrigation Decision: ${res2.irrigation.decision}`);
  console.log(`Reason: ${res2.irrigation.reason}`);
  if (res2.irrigation.decision !== 'IRRIGATE') {
    console.error("❌ FAILED: Expected IRRIGATE. Mock Provider logic might need adjustment if it doesn't match.");
  } else {
    console.log("✅ PASSED: Recommended irrigation normally.");
  }
  console.log();

  console.log("TEST 3: Missing Weather Data (Graceful Degradation & Confidence Capping)");
  const res3 = await generateAdvisoryData('test-farm-3', mockSoil, null, null, null);
  console.log(`Irrigation Confidence: ${res3.irrigation.confidence}`);
  if (res3.irrigation.confidence > 50) {
    console.error(`❌ FAILED: Expected confidence <= 50, got ${res3.irrigation.confidence}`);
  } else {
    console.log("✅ PASSED: Confidence was capped correctly due to missing data.");
  }
  console.log(`AI Metadata fallback flag: ${res3.ai_metadata?.fallback}\n`);

  console.log("=== TESTS COMPLETED ===");
}

runTests().then(() => process.exit(0)).catch(e => {
  console.error(e);
  process.exit(1);
});
