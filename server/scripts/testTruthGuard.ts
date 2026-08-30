import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { runTruthGuardPipeline } from '../trust/truthOrchestrator';
import { TrustClaim } from '../models/TrustClaim';
import { TrustEvidence } from '../models/TrustEvidence';
import { TrustAuditLog } from '../models/TrustAuditLog';

dotenv.config();

const testTruthGuard = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sujalam');
    console.log('Connected to MongoDB for TruthGuard Tests\n');

    await mongoose.connection.collection('trustclaims').drop().catch(() => {});
    await TrustClaim.deleteMany({});
    await TrustEvidence.deleteMany({});
    await TrustAuditLog.deleteMany({});

    console.log('============================================');
    console.log('CASE A: False Government Scheme Rumor');
    console.log('============================================');
    const caseA = await runTruthGuardPipeline("Government scheme PM-KISAN is fake and has been cancelled.");
    console.log(`Verdict: ${caseA.verdict}`);
    console.log(`Reason: ${caseA.reasons[0]}`);
    console.log(`Truth Score: ${caseA.truth_score}`);
    console.log(`Integrity Risk: ${caseA.integrity_risk}`);
    console.log(`Evidence: ${caseA.evidence.length} found, ${caseA.contradictions.length} contradictions\n`);
    if (caseA.verdict !== 'FALSE_OR_HIGH_RISK') throw new Error('CASE A Failed');

    console.log('============================================');
    console.log('CASE B: Dangerous Treatment');
    console.log('============================================');
    const caseB = await runTruthGuardPipeline("Mix chemical X with chemical Y and spray twice daily. It completely cures onion disease.");
    console.log(`Verdict: ${caseB.verdict}`);
    console.log(`Safety Risk: ${caseB.safety_risk}`);
    console.log(`Human Review Required: ${caseB.human_review_required}`);
    console.log(`Reason: ${caseB.reasons[0]}\n`);
    if (caseB.verdict !== 'POTENTIALLY_DANGEROUS') throw new Error('CASE B Failed');

    console.log('============================================');
    console.log('CASE C: Verified Claim');
    console.log('============================================');
    const caseC = await runTruthGuardPipeline("The government advisory says monsoon is delayed and sowing should wait.");
    console.log(`Verdict: ${caseC.verdict}`);
    console.log(`Truth Score: ${caseC.truth_score}`);
    console.log(`Reason: ${caseC.reasons[0]}\n`);
    if (caseC.verdict !== 'VERIFIED') throw new Error('CASE C Failed');

    console.log('============================================');
    console.log('CASE E: Conflicting Evidence');
    console.log('============================================');
    const caseE = await runTruthGuardPipeline("Use Chemical X at 20ml/L for onion disease.");
    console.log(`Verdict: ${caseE.verdict}`);
    console.log(`Reason: ${caseE.reasons[0]}\n`);
    if (caseE.verdict !== 'DISPUTED') throw new Error('CASE E Failed');

    console.log('============================================');
    console.log('CASE D: High Propagation (simulated)');
    console.log('============================================');
    // Artificially insert burst records to test behavior analysis
    const caseD_claim = caseC.claim!;
    const fakeClaims = [];
    for (let i = 0; i < 27; i++) {
        fakeClaims.push({
            claim_type: caseD_claim.type,
            subject: caseD_claim.normalized_claim,
            predicate: "dummy",
            value: "dummy",
            raw_text: "Burst dummy",
            normalized_claim: caseD_claim.normalized_claim,
            claim_fingerprint: caseD_claim.claim_fingerprint,
            claim_cluster_id: caseD_claim.claim_fingerprint,
            created_at: new Date()
        });
    }
    await TrustClaim.insertMany(fakeClaims);
    const caseD = await runTruthGuardPipeline("The government advisory says monsoon is delayed and sowing should wait.");
    console.log(`Verdict: ${caseD.verdict}`);
    console.log(`Propagation Risk: ${caseD.propagation_risk}`);
    console.log(`Coordination Risk: ${caseD.coordination_risk}`);
    console.log(`Integrity Risk: ${caseD.integrity_risk}`);
    console.log(`Reason: ${caseD.reasons[0]}\n`);
    if (caseD.verdict !== 'VERIFIED') throw new Error('CASE D Failed - Virality should not affect truth');

    console.log('All core backend tests passed! ✅');

    // Test DB Blackout Mode integration
    console.log('\n============================================');
    console.log('TESTING: Database Blackout Integrity');
    console.log('============================================');
    const { resilienceState } = require('../resilience/resilienceState');
    resilienceState.setSimulatedBlackout(true);
    const blackoutCase = await runTruthGuardPipeline("Government scheme PM-KISAN is fake and has been cancelled.");
    console.log(`Verdict (during blackout): ${blackoutCase.verdict}`);
    console.log(`Audit ID (during blackout): ${blackoutCase.audit_id}`);
    if (blackoutCase.audit_id !== 'pending-recovery') throw new Error('Blackout Audit ID mismatch');
    console.log('Blackout integration passed! ✅');

  } catch (error) {
    console.error('Test Failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

testTruthGuard();
