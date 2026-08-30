import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../lib/api/client';

interface VerificationResult {
  success: boolean;
  verdict: string;
  truth_score: number;
  integrity_risk: number;
  propagation_risk: number;
  coordination_risk: number;
  safety_risk: number;
  reasons: string[];
  evidence: any[];
  contradictions: any[];
  human_review_required: boolean;
}

const TrustCenter: React.FC = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/trust/verify`, { message });
      if (response.data.success) {
        setResult(response.data);
      } else {
        setError(response.data.error || 'Verification failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred during verification');
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
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
          🛡️ TruthGuard
        </h1>
        <p className="text-lg text-gray-600">Agricultural Information Integrity Center</p>
      </div>

      <div className="glass shadow-elevated p-8 rounded-3xl transition-all duration-300 hover:shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        <h2 className="text-xl font-display font-semibold mb-6 text-charcoal-900">Check a Forwarded Message</h2>
        <textarea 
          className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Paste WhatsApp message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button 
          onClick={handleVerify}
          disabled={loading || !message.trim()}
          className="mt-4 w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg disabled:opacity-50 transition-all transform hover:-translate-y-0.5"
        >
          {loading ? 'Checking Sources...' : 'CHECK INFORMATION'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
          {error}
        </div>
      )}

      {result && (
        <div className="glass shadow-elevated p-8 rounded-3xl space-y-8 animate-fade-in-up">
          <div className={`p-6 rounded-xl border-2 flex items-center justify-between ${getVerdictBadge(result.verdict)}`}>
            <div>
              <h3 className="text-2xl font-bold tracking-wide">
                {result.verdict.replace(/_/g, ' ')}
              </h3>
              <p className="mt-2 font-medium opacity-90">{result.reasons[0]}</p>
            </div>
            {result.human_review_required && (
              <div className="flex flex-col items-center p-3 bg-white bg-opacity-30 rounded-lg">
                <span className="text-3xl">⚠️</span>
                <span className="text-xs font-bold mt-1 text-center uppercase tracking-wider">Expert<br/>Review</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 bg-white/60 backdrop-blur rounded-2xl border border-ivory-300 shadow-subtle hover:-translate-y-1 transition-transform duration-300">
              <div className="text-sm font-semibold text-charcoal-500 mb-1 uppercase tracking-wider">Truth Score</div>
              <div className="text-3xl font-display font-bold text-charcoal-900">{result.truth_score}<span className="text-lg text-charcoal-400">/100</span></div>
            </div>
            <div className="p-5 bg-white/60 backdrop-blur rounded-2xl border border-ivory-300 shadow-subtle hover:-translate-y-1 transition-transform duration-300">
              <div className="text-sm font-semibold text-charcoal-500 mb-1 uppercase tracking-wider">Integrity Risk</div>
              <div className="text-3xl font-display font-bold text-charcoal-900">{result.integrity_risk}<span className="text-lg text-charcoal-400">%</span></div>
            </div>
            <div className="p-5 bg-white/60 backdrop-blur rounded-2xl border border-ivory-300 shadow-subtle hover:-translate-y-1 transition-transform duration-300">
              <div className="text-sm font-semibold text-charcoal-500 mb-1 uppercase tracking-wider">Propagation</div>
              <div className="text-3xl font-display font-bold text-charcoal-900">{result.propagation_risk}<span className="text-lg text-charcoal-400">%</span></div>
            </div>
            <div className="p-5 bg-white/60 backdrop-blur rounded-2xl border border-ivory-300 shadow-subtle hover:-translate-y-1 transition-transform duration-300">
              <div className="text-sm font-semibold text-charcoal-500 mb-1 uppercase tracking-wider">Safety Risk</div>
              <div className="text-3xl font-display font-bold text-charcoal-900">{result.safety_risk}<span className="text-lg text-charcoal-400">%</span></div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-lg border-b pb-2">Evidence Graph</h4>
            {result.evidence.length === 0 ? (
              <p className="text-gray-500 italic">No verifiable evidence found.</p>
            ) : (
              <div className="space-y-3">
                {result.evidence.map((ev, i) => (
                  <div key={i} className="p-4 bg-gray-50 border-l-4 border-blue-500 rounded-r-xl">
                    <div className="flex justify-between items-start">
                      <div className="font-medium text-blue-900">{ev.source_name}</div>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{ev.authority_level.replace('_', ' ')}</span>
                    </div>
                    <a href={ev.source_url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline">{ev.source_url}</a>
                    <p className="mt-2 text-sm text-gray-700 italic">"{ev.evidence_excerpt}"</p>
                    <div className="mt-2 flex gap-2">
                      {ev.supports_claim && <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">SUPPORTS CLAIM</span>}
                      {ev.contradicts_claim && <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">CONTRADICTS CLAIM</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrustCenter;
