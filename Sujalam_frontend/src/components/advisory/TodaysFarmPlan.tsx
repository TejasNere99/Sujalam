import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  ShieldCheck,
} from 'lucide-react';
import { FarmAdvisory } from '../../services/types';
import { useLanguage } from '../../context/LanguageContext';
import { DecisionCard } from './DecisionCard';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export interface TodaysFarmPlanProps {
  advisory: FarmAdvisory;
  farmerName?: string;
  cropContext?: string;
  locationContext?: string;
}

export const TodaysFarmPlan: React.FC<TodaysFarmPlanProps> = ({
  advisory,
  farmerName = 'Farmer',
  cropContext = 'Farm',
  locationContext = 'India',
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [selectedDecision, setSelectedDecision] = useState<{
    category: string;
    decision: string;
    reason: string;
    confidence?: number;
  } | null>(null);

  const handleOpenWhy = (
    category: string,
    decision: string,
    reason: string,
    confidence?: number
  ) => {
    setSelectedDecision({ category, decision, reason, confidence });
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-forest-900 to-forest-950 text-white rounded-3xl p-5 sm:p-7 shadow-elevated border border-forest-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gold-300">
                  {t.dashboard.todaysFarmPlan}
                </span>
                <span className="text-forest-400">•</span>
                <span className="text-xs text-forest-200 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Generated {new Date(advisory.generated_at).toLocaleTimeString()}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-1 tracking-tight font-sans">
                {t.dashboard.greeting}, {farmerName} 👋
              </h2>
              <p className="text-xs sm:text-sm text-forest-200 mt-1 flex items-center gap-2 font-medium">
                <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span>{cropContext} • {locationContext}</span>
              </p>
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-forest-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-gold-400 text-forest-950 font-bold shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <p className="text-sm sm:text-base font-bold text-ivory-100">
                {t.dashboard.whatShouldIDo}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-forest-300 font-medium italic">Powered by Sujalam Intelligence</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decisions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DecisionCard
          category="Irrigation"
          categoryLabel="Water Management"
          decision={advisory.irrigation.decision}
          reason={advisory.irrigation.reason}
          timing={advisory.irrigation.timing}
          confidence={advisory.irrigation.confidence}
          statusType={advisory.irrigation.decision === 'IRRIGATE' ? 'IRRIGATE' : 'WAIT'}
          onWhyClick={() => handleOpenWhy('Irrigation', advisory.irrigation.decision, advisory.irrigation.reason, advisory.irrigation.confidence)}
          onActionClick={() => navigate('/weather')}
          actionLabel="View Soil Details"
          featured
        />
        <DecisionCard
          category="Crop Health"
          categoryLabel="Plant Health"
          decision={advisory.crop_health.decision}
          reason={advisory.crop_health.reason}
          confidence={advisory.crop_health.confidence}
          statusType={advisory.crop_health.decision === 'MONITOR' ? 'WAIT' : 'INSPECT'}
          onWhyClick={() => handleOpenWhy('Crop Health', advisory.crop_health.decision, advisory.crop_health.reason, advisory.crop_health.confidence)}
          onActionClick={() => navigate('/crop-health')}
          actionLabel="Run New Scan"
        />
        <DecisionCard
          category="Market"
          categoryLabel="Market Timing"
          decision={advisory.market.decision}
          reason={advisory.market.reason}
          timing={advisory.market.timing}
          confidence={advisory.market.confidence}
          statusType={advisory.market.decision === 'SELL' ? 'SELL' : 'HOLD'}
          onWhyClick={() => handleOpenWhy('Market', advisory.market.decision, advisory.market.reason, advisory.market.confidence)}
          onActionClick={() => navigate('/market')}
          actionLabel="View Trends"
        />
        <DecisionCard
          category="Weather"
          categoryLabel="Weather Risk"
          decision={advisory.weather.risk + ' RISK'}
          reason={advisory.weather.summary}
          confidence={100}
          statusType={advisory.weather.risk === 'HIGH' ? 'ALERT' : 'WAIT'}
          onWhyClick={() => handleOpenWhy('Weather', advisory.weather.risk, advisory.weather.summary, 100)}
          onActionClick={() => navigate('/weather')}
          actionLabel="View Forecast"
        />
      </div>

      {/* Top Actions */}
      <div className="bg-white rounded-2xl border border-ivory-300 p-5 sm:p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-forest-50 text-forest-800">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-charcoal-900">
                Recommended Actions
              </h3>
              <p className="text-xs text-charcoal-600">
                Summary of today's key tasks.
              </p>
            </div>
          </div>
          <Badge variant="forest" size="sm">
            {advisory.top_actions.length} Actions
          </Badge>
        </div>

        <div className="space-y-3">
          {advisory.top_actions.map((act, index) => (
            <div key={index} className="flex items-start gap-3.5 p-3.5 rounded-xl bg-ivory-100/70 border border-ivory-300/80">
              <div className="w-7 h-7 rounded-full bg-forest-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0 flex items-center mt-1">
                <p className="text-sm font-bold text-charcoal-900 leading-relaxed">{act}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedDecision && (
        <Modal
          isOpen={!!selectedDecision}
          onClose={() => setSelectedDecision(null)}
          title={`Explainable Decision Intelligence`}
          subtitle="Transparent reasoning from the Sujalam Decision Engine"
          maxWidth="lg"
        >
          <div className="bg-ivory-50 p-4 rounded-xl border border-ivory-200">
            <h4 className="text-lg font-bold text-forest-900 mb-2">{selectedDecision.category}: {selectedDecision.decision}</h4>
            <p className="text-charcoal-800 font-medium mb-4">{selectedDecision.reason}</p>
            {selectedDecision.confidence && (
              <Badge variant="info">Confidence: {selectedDecision.confidence}%</Badge>
            )}
          </div>
          <div className="mt-5 flex justify-end">
            <Button variant="primary" size="md" onClick={() => setSelectedDecision(null)}>
              I Understand
            </Button>
          </div>
        </Modal>
      )}
    </section>
  );
};
