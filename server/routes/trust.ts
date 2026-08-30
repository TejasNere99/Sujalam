import express from 'express';
import { runTruthGuardPipeline } from '../trust/truthOrchestrator';
import { extractClaim } from '../trust/claimExtractor';

const router = express.Router();

// Real verification endpoint
router.post('/verify', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    const result = await runTruthGuardPipeline(message);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Demo verification endpoint with forced scenarios
router.post('/demo', async (req, res) => {
  try {
    const { scenario } = req.body;
    let message = '';
    
    // We map scenario to a specific message that our deterministic evidence service recognizes.
    if (scenario === 'CASE_A') {
      message = "Government scheme PM-KISAN is fake and has been cancelled.";
    } else if (scenario === 'CASE_B') {
      message = "Mix chemical X with chemical Y and spray twice daily. It completely cures onion disease.";
    } else if (scenario === 'CASE_C') {
      message = "The government advisory says monsoon is delayed and sowing should wait.";
    } else if (scenario === 'CASE_E') {
      message = "Use Chemical X at 20ml/L for onion disease.";
    } else {
      message = "Random unknown claim about alien farming."; // CASE F
    }

    // For Hackathon Demo Step 2 (Coordinated burst), we can artificially insert dummy records to trigger high propagation.
    if (scenario === 'CASE_A' || scenario === 'CASE_D') {
        const claim = await extractClaim(message);
        const { TrustClaim } = require('../models/TrustClaim');
        // Insert 27 fake claims to trigger propagation logic
        const fakeClaims = [];
        for (let i = 0; i < 27; i++) {
            fakeClaims.push({
                claim_type: claim.claim_type,
                subject: claim.subject,
                predicate: claim.predicate,
                value: claim.value,
                raw_text: message + " (demo burst " + i + ")",
                normalized_claim: claim.normalized_claim,
                claim_fingerprint: claim.claim_fingerprint,
                claim_cluster_id: claim.claim_fingerprint,
                created_at: new Date()
            });
        }
        try {
            await TrustClaim.insertMany(fakeClaims);
        } catch(e) {
            // ignore duplicates if already inserted
        }
    }

    const result = await runTruthGuardPipeline(message);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
