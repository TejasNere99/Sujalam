import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = 'http://localhost:3000';
let tokenA = '';
let tokenB = '';
let farmIdA = '';
let farmIdB = '';
let cropIdA = '';

async function runTests() {
  console.log('--- STARTING E2E TESTS ---');

  // 1. REGISTER USER A
  console.log('1. Registering User A...');
  let res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'User A', email: `a_${Date.now()}@test.com`, password: 'password' })
  });
  let json = await res.json();
  if (!json.success) throw new Error('Register User A failed: ' + JSON.stringify(json));
  
  res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: json.data.email, password: 'password' })
  });
  json = await res.json();
  tokenA = json.data.token;
  console.log('User A registered and logged in.');

  // 2. REGISTER USER B
  console.log('2. Registering User B...');
  res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'User B', email: `b_${Date.now()}@test.com`, password: 'password' })
  });
  let jsonB = await res.json();
  res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: jsonB.data.email, password: 'password' })
  });
  jsonB = await res.json();
  tokenB = jsonB.data.token;
  console.log('User B registered and logged in.');

  // 3. CREATE FARM A
  console.log('3. Creating Farm A...');
  res = await fetch(`${BASE_URL}/api/farms`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
    body: JSON.stringify({ name: 'Farm A', area_acres: 2.5 })
  });
  json = await res.json();
  farmIdA = json.data.id;
  console.log(`Farm A created: ${farmIdA}`);

  // 4. CREATE FARM B
  console.log('4. Creating Farm B...');
  res = await fetch(`${BASE_URL}/api/farms`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenB}` },
    body: JSON.stringify({ name: 'Farm B', area_acres: 5 })
  });
  json = await res.json();
  farmIdB = json.data.id;
  console.log(`Farm B created: ${farmIdB}`);

  // 5. SECURITY ISOLATION TEST (USER A tries to access FARM B)
  console.log('5. Testing User A -> Farm B (Isolation Test)...');
  res = await fetch(`${BASE_URL}/api/farms/${farmIdB}`, {
    headers: { 'Authorization': `Bearer ${tokenA}` }
  });
  if (res.status === 403) {
    console.log('✅ Isolation test passed (403 Forbidden).');
  } else {
    throw new Error(`Isolation test failed! Expected 403, got ${res.status}`);
  }

  // 6. CREATE CROP A
  console.log('6. Creating Crop A...');
  res = await fetch(`${BASE_URL}/api/farms/${farmIdA}/crop`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
    body: JSON.stringify({ crop_name: 'Cotton', growth_stage: 'Flowering' })
  });
  json = await res.json();
  cropIdA = json.data.id;
  console.log(`Crop A created: ${cropIdA}`);

  // 7. CREATE SOIL READING
  console.log('7. Creating Soil Reading A...');
  await fetch(`${BASE_URL}/api/farms/${farmIdA}/soil`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
    body: JSON.stringify({ moisture_percent: 30, source: 'sensor' })
  });

  // 8. GENERATE ADVISORY
  console.log('8. Generating Advisory for Farm A...');
  res = await fetch(`${BASE_URL}/api/farms/${farmIdA}/advisory/refresh`, {
    method: 'POST', headers: { 'Authorization': `Bearer ${tokenA}` }
  });
  json = await res.json();
  console.log('Advisory Generated:\n', JSON.stringify(json.data, null, 2));

  // 9. WHATSAPP WEBHOOK TEST
  console.log('9. Testing WhatsApp Webhook Mock Flow...');
  const waBody = {
    object: 'whatsapp_business_account',
    entry: [{
      changes: [{
        value: {
          messages: [{
            from: '+918888888888',
            type: 'text',
            text: { body: 'LINK' }
          }]
        }
      }]
    }]
  };
  res = await fetch(`${BASE_URL}/api/whatsapp/webhook`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(waBody)
  });
  console.log(`WhatsApp Link status: ${res.status}`);

  waBody.entry[0].changes[0].value.messages[0].text.body = 'Aaj kya karna hai?';
  res = await fetch(`${BASE_URL}/api/whatsapp/webhook`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(waBody)
  });
  console.log(`WhatsApp Today Plan status: ${res.status}`);

  console.log('--- ALL TESTS COMPLETED SUCCESSFULLY ---');
}

runTests().catch(console.error);
