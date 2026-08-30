import { WhatsAppUser } from '../models/WhatsAppUser';
import { getLatestAdvisory, refreshFarmAdvisory } from './advisoryService';
import { formatAdvisoryForWhatsApp } from '../integrations/whatsapp/formatter';
import { analyzeCropImage } from './cropHealthService';
import { getNearbyFPOs } from './fpoService';

export const handleIncomingMessage = async (phoneNumber: string, text: string | null, mediaId: string | null) => {
  // Find user
  let waUser = await WhatsAppUser.findOne({ phone_number: phoneNumber });
  if (!waUser) {
    waUser = new WhatsAppUser({ phone_number: phoneNumber, onboarding_state: 'INIT' });
    await waUser.save();
    return "Hi! Welcome to Sujalam. Your profile is not linked to a farm yet. (Onboarding mock: Reply 'LINK' to simulate link).";
  }

  // Handle Mock Onboarding Link
  if (text?.toUpperCase() === 'LINK') {
    // We would look up a demo farm or ask for user credentials.
    // For demo purposes, link to the first farm found in DB if none exists.
    const { Farm } = require('../models/Farm');
    const demoFarm = await Farm.findOne();
    if (demoFarm) {
      waUser.farm_id = demoFarm._id;
      waUser.user_id = demoFarm.user_id;
      waUser.onboarding_state = 'COMPLETE';
      await waUser.save();
      return "✅ Your WhatsApp is now linked to your Farm profile.\n\nSend '1' or 'Aaj kya karna hai?' to get your Today's Farm Plan.";
    }
    return "No farm available to link. Please create a farm on the Web first.";
  }

  if (!waUser.farm_id || !waUser.user_id) {
    return "Please link your farm first by replying 'LINK'.";
  }

  const userId = waUser.user_id.toString();
  const farmId = waUser.farm_id.toString();

  // Handle Image
  if (mediaId) {
    // In a real scenario, we'd download from WhatsApp API.
    const mockImageUrl = `https://mock-whatsapp-media.com/${mediaId}.jpg`;
    await analyzeCropImage(userId, farmId, null, mockImageUrl);
    const newAdv = await refreshFarmAdvisory(userId, farmId);
    return `📷 Image received & analyzed!\n\n${formatAdvisoryForWhatsApp(newAdv)}`;
  }

  // Handle Text Intent
  const intent = detectIntent(text || '');

  switch (intent) {
    case 'VERIFY_CLAIM':
      try {
        const { runTruthGuardPipeline } = require('../trust/truthOrchestrator');
        const verification = await runTruthGuardPipeline(text!);
        
        const badge = verification.verdict === 'VERIFIED' ? '🟢' 
                    : verification.verdict === 'LIKELY_TRUE' ? '🟡' 
                    : (verification.verdict === 'UNCERTAIN' || verification.verdict === 'DISPUTED') ? '⚠️' 
                    : '🔴';
                    
        let reply = `🔎 TRUTHGUARD RESULT\n\n`;
        reply += `Claim: ${verification.claim?.normalized_claim || "Unknown"}\n\n`;
        reply += `${badge} ${verification.verdict.replace(/_/g, ' ')}\n\n`;
        reply += `${verification.reasons[0]}\n\n`;
        reply += `Evidence checked: ${verification.evidence.length}\n`;
        reply += `Contradictions: ${verification.contradictions.length}\n\n`;
        if (verification.human_review_required) {
            reply += `🚨 Please verify with an agricultural expert before taking action.\n`;
        }
        return reply.trim();
      } catch (e) {
        return "Sorry, TruthGuard verification is temporarily unavailable.";
      }
    case 'TODAY_PLAN':
      const newAdv = await refreshFarmAdvisory(userId, farmId);
      return formatAdvisoryForWhatsApp(newAdv);
    case 'WEATHER':
      return "Fetching latest weather... (Mock response: High rain risk tomorrow)";
    case 'MARKET':
      return "Fetching mandi prices... (Mock response: Cotton is at ₹7100, trend is positive)";
    case 'FPO':
      try {
        const response = await getNearbyFPOs(userId, farmId);
        
        if (response.data_status === 'official_data_unavailable' || response.fpos.length === 0) {
          return "No verified FPOs found for your location.";
        }
        
        let reply = '📍 Nearby verified FPOs\n\n';
        response.fpos.slice(0, 3).forEach((fpo, i) => {
          reply += `${i + 1}. ${fpo.name}\n`;
          reply += `   ${fpo.district || fpo.state}\n`;
          if (fpo.distance_km !== null) {
            reply += `   ${fpo.distance_km} km away\n`;
          }
          if (fpo.phone) {
            reply += `   📞 ${fpo.phone}\n`;
          }
          reply += `\n`;
        });
        
        reply += `Source:\n${response.fpos[0].source_name}\n\nMore details:\n${response.fpos[0].source_url}`;
        return reply.trim();
      } catch (e) {
        return "Sorry, I couldn't find FPO details right now.";
      }
    case 'RESOURCE_SEARCH':
      try {
        const { resourceMatchingService } = require('./resourceMatchingService');
        // Simple mock parse
        const isLabour = text?.toLowerCase().includes('labour') || text?.toLowerCase().includes('aadmi');
        const matches = await resourceMatchingService.findMatches({
          longitude: 77.1025, // Mock coordinates
          latitude: 28.7041,
          operation: isLabour ? 'GENERAL' : 'IRRIGATION',
          requiredDate: new Date(),
        });

        const list = isLabour ? matches.labour : matches.machinery;
        if (!list || list.length === 0) {
          return `No ${isLabour ? 'labour' : 'machinery'} available nearby at the moment.`;
        }

        let reply = `🌾 ${isLabour ? 'Labour' : 'Machinery'} available:\n\n`;
        list.slice(0, 2).forEach((item: any, i: number) => {
          reply += `${i + 1}️⃣ ${item.name} — ₹${item.rate}/${item.rate_type.toLowerCase()} — ${item.distance_km} km\n`;
          if (!isLabour && item.operator_available) {
             reply += `   Operator included\n`;
          }
        });
        reply += `\nReply with a number to book. (Demo only)`;
        return reply.trim();
      } catch (e) {
        return "Sorry, resource search is temporarily unavailable.";
      }
    default:
      return `🌾 SUJALAM MENU\n\n1️⃣ Today's Farm Plan\n2️⃣ Crop Health\n3️⃣ Weather\n4️⃣ Mandi Price\n5️⃣ Nearby FPOs\n6️⃣ Verify Information (TruthGuard)\n7️⃣ Find Labour/Machinery\n\nReply with a number or ask a question!`;
  }
};

const detectIntent = (text: string) => {
  const t = text.toLowerCase();
  if (t.includes('aaj kya karna hai') || t === '1') return 'TODAY_PLAN';
  if (t.includes('baarish') || t === '3') return 'WEATHER';
  if (t.includes('bhav') || t === '4') return 'MARKET';
  if (['fpo', 'nearby fpo', 'fpo kaha hai', 'mere paas fpo', 'fpo contact', 'fpo dikhao', '5'].some(keyword => t.includes(keyword))) return 'FPO';
  if (t.includes('fake') || t.includes('sach') || t.includes('true') || t.includes('verify') || t.includes('forwarded') || t === '6') return 'VERIFY_CLAIM';
  if (['labour', 'machine', 'tractor', 'pump', 'harvester', 'sprayer', 'book', '7'].some(keyword => t.includes(keyword))) return 'RESOURCE_SEARCH';
  return 'UNKNOWN';
};
