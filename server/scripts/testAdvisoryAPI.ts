import mongoose from 'mongoose';
import { getLatestAdvisory, refreshFarmAdvisory } from '../services/advisoryService';
import { handleIncomingMessage } from '../services/whatsappService';
import dotenv from 'dotenv';
dotenv.config();

async function runTests() {
  console.log('Connecting to MongoDB for API & WhatsApp Testing...');
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sujalam_test');

  try {
    const { Farm } = require('../models/Farm');
    const farm = await Farm.findOne();
    if (!farm) {
      console.log('No farm found in DB. Please seed the DB first.');
      process.exit(1);
    }

    const userId = farm.user_id.toString();
    const farmId = farm._id.toString();

    console.log(`\n--- TEST 1: API / Refresh Farm Advisory ---`);
    console.log(`User ID: ${userId}`);
    console.log(`Farm ID: ${farmId}`);
    
    // Simulate API POST /api/farms/:id/advisory/refresh
    const advisory = await refreshFarmAdvisory(userId, farmId);
    console.log(`\n✅ Generated Advisory:`);
    console.log(JSON.stringify(advisory, null, 2));

    console.log(`\n--- TEST 2: WhatsApp Intent ('Aaj kya karna hai?') ---`);
    // Mock user link
    const phone = '+919999999999';
    await handleIncomingMessage(phone, "LINK", null);
    
    // Fire intent
    const reply = await handleIncomingMessage(phone, "Aaj kya karna hai?", null);
    console.log(`\n✅ WhatsApp Reply:\n${reply}`);

    console.log(`\n--- TEST 3: Security / IDOR ---`);
    const fakeUserId = new mongoose.Types.ObjectId().toString();
    try {
      await refreshFarmAdvisory(fakeUserId, farmId);
      console.log('❌ FAIL: Allowed unauthorized user to access farm.');
    } catch (e: any) {
      if (e.message.includes('FARM_NOT_FOUND') || e.message.includes('FORBIDDEN') || e.message.includes('Forbidden')) {
        console.log(`✅ PASS: Caught expected IDOR error: ${e.message}`);
      } else {
        console.log(`❌ FAIL: Unexpected error message: ${e.message}`);
      }
    }
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB.');
  }
}

runTests();
