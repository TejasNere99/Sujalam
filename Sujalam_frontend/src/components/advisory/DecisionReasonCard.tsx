import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Droplets,
  CloudRain,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

import { ConfidenceBadge } from './ConfidenceBadge';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';

export interface DecisionReasonCardProps {
  category: 'Irrigation' | 'Crop Health' | 'Market' | 'Weather';
  decision: any;
  initiallyExpanded?: boolean;
}

export const DecisionReasonCard: React.FC<DecisionReasonCardProps> = ({
  category,
  decision,
  initiallyExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);

  const getCategoryIcon = () => {
    switch (category) {
      case 'Irrigation':
        return <Droplets className="w-5 h-5 text-forest-700" />;
      case 'Crop Health':
        return <AlertTriangle className="w-5 h-5 text-amber-700" />;
      case 'Market':
        return <TrendingUp className="w-5 h-5 text-emerald-700" />;
      case 'Weather':
        return <CloudRain className="w-5 h-5 text-blue-700" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-ivory-300 shadow-card overflow-hidden transition-all duration-200">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 bg-ivory-100/70 border-b border-ivory-300 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white border border-ivory-300 shadow-subtle">
            {getCategoryIcon()}
          </div>
          <div>
            <span className="text-xs font-bold text-forest-900 uppercase tracking-wider block">
              {category} ADVISORY
            </span>
            <h4 className="text-base sm:text-lg font-extrabold text-charcoal-950 mt-0.5">
              {decision.decision}
            </h4>
          </div>
        </div>

        <ConfidenceBadge score={decision.confidence} size="md" />
      </div>

      {/* Structured Explainability: WHAT • WHEN • WHY */}
      <div className="p-4 sm:p-6 space-y-4">
        {/* WHEN Section */}
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-forest-50 text-forest-800 shrink-0 mt-0.5">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold text-charcoal-500 uppercase tracking-wider block">
              RECOMMENDED TIMING
            </span>
            <p className="text-sm sm:text-base font-bold text-charcoal-900 mt-0.5">
              {decision.timing}
            </p>
          </div>
        </div>

        {/* WHY Section */}
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-gold-50 text-gold-900 shrink-0 mt-0.5 border border-gold-200">
            <HelpCircle className="w-4 h-4 text-gold-700" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold text-charcoal-500 uppercase tracking-wider block">
              WHY SUJALAM RECOMMENDS THIS
            </span>
            <p className="text-sm sm:text-base text-charcoal-800 font-medium leading-relaxed mt-0.5">
              {decision.reason}
            </p>
          </div>
        </div>

        {/* IMPACT Section */}
        {decision.impact_summary && (
          <div className="p-3 sm:p-4 rounded-xl bg-forest-50 border border-forest-200/80 text-forest-950 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 font-bold mb-1 text-forest-900">
              <Sparkles className="w-4 h-4 text-forest-700" />
              <span>Projected Farm Impact:</span>
            </div>
            <p className="text-forest-800">{decision.impact_summary}</p>
          </div>
        )}

        {/* Progressive Disclosure: Contributing Signals Toggle */}
        {decision.signals && decision.signals.length > 0 && (
          <div className="pt-2 border-t border-ivory-200">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              className="w-full flex items-center justify-between py-2 text-xs sm:text-sm font-bold text-forest-900 hover:text-forest-950 transition-colors"
            >
              <span>{isExpanded ? 'Hide Supporting Signals' : 'View Supporting Signals & Model Inputs'}</span>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isExpanded && (
              <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-3 gap-2.5 animate-in fade-in duration-150">
                {decision.signals.map((sig: any, idx: any) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-ivory-100 border border-ivory-300 flex flex-col justify-between"
                  >
                    <span className="text-[11px] text-charcoal-600 font-semibold">{sig.name}</span>
                    <span className="text-sm font-bold text-charcoal-900 mt-1">{sig.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
