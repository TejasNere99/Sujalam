import { calculateIrrigationDecision } from '../decision/irrigationDecision';
import { calculateWeatherRisk } from '../decision/weatherRisk';
import { calculateCropHealthDecision } from '../decision/cropHealthDecision';
import { calculateMarketDecision } from '../decision/marketDecision';
import { generateAdvisoryData } from '../decision/decisionEngine';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function run() {
  console.log('--- RUNNING DECISION ENGINE TESTS ---\n');

  // CASE 1: Low soil + low rain → IRRIGATE
  {
    const soil = { moisture_percent: 20 };
    const weather = { rain_probability_percent: 10 };
    const dec = calculateIrrigationDecision(soil, weather);
    assert(dec.decision === 'IRRIGATE', 'CASE 1: Should IRRIGATE when dry and no rain');
    console.log('✅ CASE 1: Low soil + low rain → IRRIGATE');
  }

  // CASE 2: Low soil + high rain → WAIT/SKIP
  {
    const soil = { moisture_percent: 20 };
    const weather = { rain_probability_percent: 90 };
    const dec = calculateIrrigationDecision(soil, weather);
    assert(dec.decision === 'WAIT' || dec.decision === 'SKIP', 'CASE 2: Should WAIT/SKIP when dry but heavy rain expected');
    console.log('✅ CASE 2: Low soil + high rain → WAIT/SKIP');
  }

  // CASE 3: Medium soil + high rain → WAIT
  {
    const soil = { moisture_percent: 45 };
    const weather = { rain_probability_percent: 85 };
    const dec = calculateIrrigationDecision(soil, weather);
    assert(dec.decision === 'WAIT', 'CASE 3: Should WAIT when medium soil and rain expected');
    console.log('✅ CASE 3: Medium soil + high rain → WAIT');
  }

  // CASE 4: High soil + low rain → SKIP
  {
    const soil = { moisture_percent: 85 };
    const weather = { rain_probability_percent: 10 };
    const dec = calculateIrrigationDecision(soil, weather);
    assert(dec.decision === 'SKIP', 'CASE 4: Should SKIP when soil is very wet');
    console.log('✅ CASE 4: High soil + low rain → SKIP');
  }

  // CASE 5: Missing soil → safe WAIT + low confidence
  {
    const soil = null;
    const weather = { rain_probability_percent: 20 };
    const dec = calculateIrrigationDecision(soil, weather);
    assert(dec.decision === 'WAIT', 'CASE 5: Should default to WAIT when soil missing');
    assert(dec.confidence < 50, 'CASE 5: Confidence must be low when soil missing');
    console.log('✅ CASE 5: Missing soil → safe WAIT + low confidence');
  }

  // CASE 6: Missing weather → safe decision + confidence reduced
  {
    const soil = { moisture_percent: 20 };
    const weather = null;
    const dec = calculateIrrigationDecision(soil, weather);
    assert(dec.decision === 'IRRIGATE' || dec.decision === 'WAIT', 'CASE 6: Decision should be safe without weather');
    assert(dec.confidence <= 50, 'CASE 6: Confidence must be reduced without weather');
    console.log('✅ CASE 6: Missing weather → safe decision + confidence reduced');
  }

  // CASE 7: Missing soil + missing weather → WAIT + confidence 0
  {
    const dec = calculateIrrigationDecision(null, null);
    assert(dec.decision === 'WAIT', 'CASE 7: Missing both should fallback to WAIT');
    assert(dec.confidence === 0, 'CASE 7: Missing both should have 0 confidence');
    console.log('✅ CASE 7: Missing both → WAIT + confidence 0');
  }

  // CASE 8: High crop disease probability → ACT
  {
    const cropHealth = { health_status: 'high_risk', disease_probability: 85 };
    const dec = calculateCropHealthDecision(cropHealth);
    assert(dec.decision === 'ACT', 'CASE 8: Should ACT on high disease probability');
    console.log('✅ CASE 8: High disease → ACT');
  }

  // CASE 9: Moderate/uncertain crop health → INSPECT
  {
    const cropHealth = { health_status: 'needs_attention', disease_probability: 50 };
    const dec = calculateCropHealthDecision(cropHealth);
    assert(dec.decision === 'INSPECT', 'CASE 9: Should INSPECT on moderate disease probability');
    console.log('✅ CASE 9: Moderate disease → INSPECT');
  }

  // CASE 10: Healthy crop → MONITOR
  {
    const cropHealth = { health_status: 'healthy', disease_probability: 10 };
    const dec = calculateCropHealthDecision(cropHealth);
    assert(dec.decision === 'MONITOR', 'CASE 10: Should MONITOR healthy crop');
    console.log('✅ CASE 10: Healthy crop → MONITOR');
  }

  // CASE 11: Strong positive market trend → HOLD
  {
    const market = { trend_7d_percent: 5.5 };
    const dec = calculateMarketDecision(market);
    assert(dec.decision === 'HOLD', 'CASE 11: Should HOLD on strong positive trend');
    console.log('✅ CASE 11: Strong positive trend → HOLD');
  }

  // CASE 12: Negative market trend → SELL
  {
    const market = { trend_7d_percent: -4.0 };
    const dec = calculateMarketDecision(market);
    assert(dec.decision === 'SELL', 'CASE 12: Should SELL on negative trend');
    console.log('✅ CASE 12: Negative market trend → SELL');
  }

  // CASE 13: High rain probability → HIGH weather risk
  {
    const weather = { rain_probability_percent: 95 };
    const risk = calculateWeatherRisk(weather);
    assert(risk.risk === 'HIGH', 'CASE 13: Should report HIGH weather risk on heavy rain');
    console.log('✅ CASE 13: High rain probability → HIGH weather risk');
  }

  // CASE 14: Missing market/crop/weather inputs → safe fallback without crash
  {
    const adv = await generateAdvisoryData('farm1', null, null, null, null);
    assert(adv.overall_status === 'attention', 'CASE 14: Overall status should be attention on null inputs');
    assert(adv.irrigation.decision === 'WAIT', 'CASE 14: Irrigation should fallback to WAIT (since rain 0 <= 60 is SKIP usually but mock is wait)');
    assert(adv.market.decision === 'HOLD', 'CASE 14: Market should fallback to HOLD');
    assert(adv.top_actions.length > 0, 'CASE 14: Should generate safe top actions');
    console.log('✅ CASE 14: Null safety passed without crash');
  }

  console.log('\n--- ALL TESTS PASSED ---');
}

run().catch(console.error);
