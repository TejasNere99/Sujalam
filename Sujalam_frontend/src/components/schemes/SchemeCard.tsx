import React from 'react';
import { Building2, CheckCircle2, ArrowRight, ExternalLink, HelpCircle, Gift } from 'lucide-react';
import { Scheme } from '../../services/types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useLanguage } from '../../context/LanguageContext';

export interface SchemeCardProps {
  scheme: any;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({ scheme }) => {
  const { t } = useLanguage();

  return (
    <Card variant="default" padding="lg" className="space-y-4 hover:shadow-elevated transition-shadow">
      {/* Header Category & Scheme Name */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-ivory-300">
        <div>
          <Badge variant="forest" size="sm" className="mb-2">
            {scheme.category}
          </Badge>
          <h3 className="text-base sm:text-lg font-extrabold text-charcoal-950 leading-snug">
            {scheme.name}
          </h3>
        </div>
      </div>

      {/* Structured Content: What is it? • Why Relevant? • Key Benefit */}
      <div className="space-y-3 text-xs sm:text-sm">
        {/* Description */}
        <p className="text-charcoal-700 leading-relaxed">
          {scheme.description}
        </p>

        {/* Why Relevant */}
        <div className="p-3 rounded-xl bg-ivory-100 border border-ivory-300">
          <div className="flex items-center gap-1.5 font-bold text-forest-900 mb-0.5">
            <HelpCircle className="w-4 h-4 text-forest-700" />
            <span>{t.schemes.whyRelevant}</span>
          </div>
          <p className="text-charcoal-800 font-medium">
            {scheme.eligibility}
          </p>
        </div>

        {/* Benefit */}
        <div className="p-3 rounded-xl bg-forest-50 border border-forest-200">
          <div className="flex items-center gap-1.5 font-bold text-forest-900 mb-0.5">
            <Gift className="w-4 h-4 text-forest-700" />
            <span>{t.schemes.benefit}</span>
          </div>
          <p className="text-forest-950 font-bold">
            {scheme.benefit}
          </p>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="pt-2 flex items-center justify-between">
        <span className="text-xs text-charcoal-500 font-medium">
          Region: {scheme.region}
        </span>

        <a
          href={scheme.action_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs sm:text-sm transition-colors"
        >
          <span>{t.schemes.applyNow}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </Card>
  );
};
