import React from 'react';
import { TrendingUp, Clock, HelpCircle, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { MarketPrice } from '../../services/types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatINR } from '../../lib/utils';
import { useLanguage } from '../../context/LanguageContext';

export interface SellHoldCardProps {
  market: any;
  recommendation: string;
  reason: string;
}

export const SellHoldCard: React.FC<SellHoldCardProps> = ({
  market,
  recommendation,
  reason,
}) => {
  const { t } = useLanguage();

  return (
    <Card
      variant="default"
      padding="lg"
      className="border-emerald-700/20 bg-gradient-to-br from-white to-emerald-50/20 space-y-5"
    >
      {/* Header Recommendation Tag */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-ivory-300">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800">
            {t.market.shouldISellTitle}
          </span>
          <div className="flex items-center gap-3 mt-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-950">
              {recommendation === 'HOLD' ? t.market.holdRecommendation : 'SELL PRODUCE'}
            </h2>
            <Badge variant="success" size="md">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              +{market.trend_7d_percent}% This Week
            </Badge>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-xs text-charcoal-500 font-bold uppercase block">
            {t.market.currentRate}
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-forest-900 font-sans">
            {formatINR(market.price_per_quintal)}
          </span>
          <span className="text-xs text-charcoal-500 block">/ quintal ({market.market_name})</span>
        </div>
      </div>

      {/* Rationale & Holding Window */}
      <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-emerald-950 space-y-2">
        <div className="flex items-start gap-2.5">
          <HelpCircle className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-extrabold text-emerald-900 uppercase">
              Why Hold Produce?
            </span>
            <p className="text-sm sm:text-base font-medium text-charcoal-900 mt-0.5 leading-relaxed">
              {reason}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-emerald-200/60 text-xs font-bold text-emerald-900">
          <Clock className="w-4 h-4 text-emerald-700" />
          <span>{t.market.suggestedWindow}</span>
        </div>
      </div>

      {/* Provenance */}
      <div className="flex items-center justify-between text-[11px] text-charcoal-500 pt-1">
        <span>Source: {market.source}</span>
        <span>Updated: Today 06:00 AM</span>
      </div>
    </Card>
  );
};
