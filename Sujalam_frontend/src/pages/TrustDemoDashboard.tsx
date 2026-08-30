import React, { useState } from 'react';
import axios from 'axios';

const TrustDemoDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeCase, setActiveCase] = useState('');

  const runScenario = async (scenarioId: string, label: string) => {
    setLoading(true);
    setResult(null);
    setActiveCase(label);
    
    try {
      const response = await axios.post('/api/trust/demo', { scenario: scenarioId });
      setResult(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case 'VERIFIED': return 'bg-green-100 text-green-800 border-green-300';
      case 'LIKELY_TRUE': return 'bg-green-50 text-green-700 border-green-200';
      case 'UNCERTAIN': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'DISPUTED': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'FALSE_OR_HIGH_RISK': return 'bg-red-100 text-red-800 border-red-300';
      case 'POTENTIALLY_DANGEROUS': return 'bg-red-600 text-white border-red-800 animate-pulse';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-ivory-200 min-h-screen font-sans animate-fade-in">
      <div className="glass shadow-elevated rounded-2xl p-6 mb-8 border-t-4 border-forest-600 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-forest-500/10 rounded-full blur-2xl"></div>
        <h1 className="text-3xl font-display font-bold text-charcoal-900 flex items-center gap-3">
          <span>🛡️</span> TruthGuard Demo Console
        </h1>
        <p className="text-charcoal-500 mt-2 font-medium">Hackathon Evaluation Interface for Information Integrity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="col-span-1 space-y-3">
          <h2 className="font-semibold text-gray-700 uppercase tracking-wider text-sm mb-4">Run Scenarios</h2>
          
          <button onClick={() => runScenario('CASE_A', 'False Scheme Rumor')} className="w-full text-left px-4 py-3 bg-white/70 backdrop-blur border border-ivory-300 rounded-xl shadow-subtle hover:border-red-400 hover:shadow-card hover:-translate-y-0.5 transition-all group">
            <div className="font-semibold text-red-700">Case A: False Rumor</div>
            <div className="text-xs text-charcoal-500">Government scheme cancellation rumor</div>
          </button>
          
          <button onClick={() => runScenario('CASE_B', 'Dangerous Treatment')} className="w-full text-left px-4 py-3 bg-white/70 backdrop-blur border border-ivory-300 rounded-xl shadow-subtle hover:border-red-400 hover:shadow-card hover:-translate-y-0.5 transition-all group">
            <div className="font-semibold text-red-700">Case B: Dangerous Treatment</div>
            <div className="text-xs text-charcoal-500">Unsupported chemical dosage recommendation</div>
          </button>
          
          <button onClick={() => runScenario('CASE_C', 'Verified Claim')} className="w-full text-left px-4 py-3 bg-white/70 backdrop-blur border border-ivory-300 rounded-xl shadow-subtle hover:border-forest-500 hover:shadow-card hover:-translate-y-0.5 transition-all group">
            <div className="font-semibold text-forest-700">Case C: Verified Claim</div>
            <div className="text-xs text-charcoal-500">Actual government agricultural advisory</div>
          </button>
          
          <button onClick={() => runScenario('CASE_D', 'High Propagation but True')} className="w-full text-left px-4 py-3 bg-white/70 backdrop-blur border border-ivory-300 rounded-xl shadow-subtle hover:border-blue-500 hover:shadow-card hover:-translate-y-0.5 transition-all group">
            <div className="font-semibold text-blue-700">Case D: High Propagation</div>
            <div className="text-xs text-charcoal-500">Viral verified message (Integrity Check)</div>
          </button>

          <button onClick={() => runScenario('CASE_E', 'Conflicting Sources')} className="w-full text-left px-4 py-3 bg-white/70 backdrop-blur border border-ivory-300 rounded-xl shadow-subtle hover:border-orange-400 hover:shadow-card hover:-translate-y-0.5 transition-all group">
            <div className="font-semibold text-orange-600">Case E: Conflicting Sources</div>
            <div className="text-xs text-charcoal-500">Authoritative sources disagree</div>
          </button>

          <button onClick={() => runScenario('CASE_F', 'No Evidence')} className="w-full text-left px-4 py-3 bg-white/70 backdrop-blur border border-ivory-300 rounded-xl shadow-subtle hover:border-yellow-500 hover:shadow-card hover:-translate-y-0.5 transition-all group">
            <div className="font-semibold text-yellow-600">Case F: No Evidence</div>
            <div className="text-xs text-charcoal-500">Claim cannot be verified</div>
          </button>
        </div>

        <div className="col-span-2">
          {loading && (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-indigo-600 font-medium animate-pulse">Running TruthGuard Pipeline...</p>
              <div className="mt-2 text-xs text-gray-400">Extracting Claim → Retrieving Evidence → Analyzing Contradictions</div>
            </div>
          )}

          {!loading && result && (
            <div className="glass shadow-elevated rounded-3xl p-6 border border-ivory-300 animate-fade-in-up">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-display font-bold text-charcoal-900">{activeCase} Results</h2>
                <div className="text-xs px-3 py-1 bg-ivory-300/50 rounded-full font-mono text-charcoal-600">Latency: {result.ai_metadata?.latency_ms}ms</div>
              </div>
              
              <div className={`p-6 rounded-2xl border flex items-center justify-between mb-8 shadow-sm ${getVerdictBadge(result.verdict)}`}>
                <div>
                  <div className="text-sm font-semibold opacity-75 mb-1 tracking-wider uppercase">VERDICT</div>
                  <h3 className="text-3xl font-display font-black tracking-tight">{result.verdict.replace(/_/g, ' ')}</h3>
                  <p className="mt-2 font-medium opacity-90">{result.reasons[0]}</p>
                </div>
                {result.human_review_required && (
                  <div className="text-5xl animate-pulse">⚠️</div>
                )}
              </div>

              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="p-4 bg-white/60 backdrop-blur rounded-xl border border-ivory-300 text-center shadow-subtle hover:-translate-y-1 transition-transform">
                  <div className="text-xs text-charcoal-500 uppercase font-semibold mb-1">Truth Score</div>
                  <div className="text-2xl font-display font-bold text-charcoal-900">{result.truth_score}</div>
                </div>
                <div className="p-4 bg-white/60 backdrop-blur rounded-xl border border-ivory-300 text-center shadow-subtle hover:-translate-y-1 transition-transform">
                  <div className="text-xs text-charcoal-500 uppercase font-semibold mb-1">Propagation</div>
                  <div className="text-2xl font-display font-bold text-charcoal-900">{result.propagation_risk}</div>
                </div>
                <div className="p-4 bg-white/60 backdrop-blur rounded-xl border border-ivory-300 text-center shadow-subtle hover:-translate-y-1 transition-transform">
                  <div className="text-xs text-charcoal-500 uppercase font-semibold mb-1">Coordination</div>
                  <div className="text-2xl font-display font-bold text-charcoal-900">{result.coordination_risk}</div>
                </div>
                <div className="p-4 bg-white/60 backdrop-blur rounded-xl border border-ivory-300 text-center shadow-subtle hover:-translate-y-1 transition-transform">
                  <div className="text-xs text-charcoal-500 uppercase font-semibold mb-1">Safety Risk</div>
                  <div className="text-2xl font-display font-bold text-charcoal-900">{result.safety_risk}</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <h4 className="font-bold text-sm text-gray-700 uppercase mb-3">Evidence Processed</h4>
                {result.evidence.length === 0 ? (
                  <p className="text-gray-500 text-sm">No evidence available for analysis.</p>
                ) : (
                  <div className="space-y-3">
                    {result.evidence.map((ev: any, i: number) => (
                      <div key={i} className="bg-white p-3 rounded shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-indigo-700 text-sm">{ev.source_name}</span>
                          <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded">{ev.authority_level}</span>
                        </div>
                        <p className="text-xs text-gray-600 italic mb-2">"{ev.evidence_excerpt}"</p>
                        <div>
                          {ev.supports_claim && <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-1 rounded">SUPPORTS</span>}
                          {ev.contradicts_claim && <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-1 rounded ml-2">CONTRADICTS</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {!loading && !result && (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow-sm border border-gray-200 text-gray-400">
              Select a scenario to run TruthGuard
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrustDemoDashboard;
