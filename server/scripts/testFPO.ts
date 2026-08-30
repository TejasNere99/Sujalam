import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { handleIncomingMessage } from '../services/whatsappService';
import { getNearbyFPOs } from '../services/fpoService';
import { Farm } from '../models/Farm';
import { WhatsAppUser } from '../models/WhatsAppUser';
import { User } from '../models/User';

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sujalam';

async function runTests() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB for testing...');

  try {
    const farm = await Farm.findOne();
    if (!farm) {
      console.log('No Farm found to test with.');
      return;
    }

    const userId = farm.user_id.toString();
    const farmId = (farm as any)._id.toString();
    const phone = '+919999999999';

    console.log(`\n--- TEST 1: Direct fpoService.getNearbyFPOs() ---`);
    const fpoRes = await getNearbyFPOs(userId, farmId);
    console.log(JSON.stringify(fpoRes, null, 2));

    console.log(`\n--- TEST 2: WhatsApp Intent ---`);
    await handleIncomingMessage(phone, "LINK", null); // Mock link
    const reply = await handleIncomingMessage(phone, "fpo kaha hai", null);
    console.log(`Reply:\n${reply}`);

    console.log(`\n--- TEST 3: Security / IDOR ---`);
    try {
      // Pass a fake/unowned farm ID
      const fakeFarmId = new mongoose.Types.ObjectId().toString();
      await getNearbyFPOs(userId, fakeFarmId);
      console.log('FAIL: IDOR check failed to throw!');
    } catch (e: any) {
      console.log(`PASS: Caught expected IDOR error: ${e.message}`);
    }

  } finally {
    await mongoose.disconnect();
  }
}

runTests();
