import React from 'react';
import { 
  Droplets, 
  AlertTriangle, 
  TrendingUp, 
  CloudRain, 
  ChevronRight, 
  HelpCircle,
  ArrowUpRight
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ConfidenceBadge } from './ConfidenceBadge';
import { cn } from '../../lib/utils';

export interface DecisionCardProps {
  category: 'Irrigation' | 'Crop Health' | 'Market' | 'Weather';
  categoryLabel: string;
  decision: string;
  reason: string;
  timing?: string;
  confidence: number;
  onWhyClick: () => void;
  onActionClick?: () => void;
  actionLabel?: string;
  statusType?: 'WAIT' | 'INSPECT' | 'HOLD' | 'ALERT' | 'SELL' | 'IRRIGATE'|'WAIT' | 'INSPECT' | 'HOLD' | 'ALERT' | 'SELL' | 'IRRIGATE'|'WAIT' | 'INSPECT' | 'HOLD' | 'ALERT' | 'SELL' | 'IRRIGATE'|'WAIT' | 'INSPECT' | 'HOLD' | 'ALERT' | 'SELL' | 'IRRIGATE'|'WAIT' | 'INSPECT' | 'HOLD' | 'ALERT' | 'SELL' | 'IRRIGATE';
  featured?: boolean;
}

export const DecisionCard: React.FC<DecisionCardProps> = ({
  category,
  categoryLabel,
  decision,
  reason,
  timing,
  confidence,
  onWhyClick,
  onActionClick,
  actionLabel = 'View Details',
  statusType = 'WAIT',
  featured = false,
}) => {
  const getCategoryConfig = () => {
    switch (category) {
      case 'Irrigation':
        return {
          icon: Droplets,
          iconBg: 'bg-blue-50 text-blue-800 border-blue-200',
          badgeVariant: 'info' as const,
          borderColor: 'border-blue-900/20',
          accentColor: 'text-blue-900',
        };
      case 'Crop Health':
        return {
          icon: AlertTriangle,
          iconBg: 'bg-amber-50 text-amber-900 border-amber-200',
          badgeVariant: 'warning' as const,
          borderColor: 'border-amber-900/20',
          accentColor: 'text-amber-900',
        };
      case 'Market':
        return {
          icon: TrendingUp,
          iconBg: 'bg-emerald-50 text-emerald-900 border-emerald-200',
          badgeVariant: 'success' as const,
          borderColor: 'border-emerald-900/20',
          accentColor: 'text-emerald-900',
        };
      case 'Weather':
        return {
          icon: CloudRain,
          iconBg: 'bg-sky-50 text-sky-900 border-sky-200',
          badgeVariant: 'info' as const,
          borderColor: 'border-sky-900/20',
          accentColor: 'text-sky-900',
        };
    }
  };

  const config = getCategoryConfig();
  const Icon = config.icon;

  return (
    <Card
      variant="default"
      padding="md"
      className={cn(
        'relative flex flex-col justify-between transition-all hover:shadow-elevated',
        featured && 'ring-2 ring-forest-800/20 bg-gradient-to-b from-white to-ivory-100'
      )}
    >
      <div>
        {/* Card Header: Category & Confidence */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className={cn('p-2 rounded-xl border shrink-0', config.iconBg)}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-xs font-extrabold tracking-wider uppercase text-charcoal-700">
              {categoryLabel}
            </span>
          </div>

          <ConfidenceBadge score={confidence} />
        </div>

        {/* Primary Decision Headline */}
        <div className="mt-1">
          <h3 className="text-lg sm:text-xl font-extrabold text-charcoal-950 tracking-tight leading-tight">
            {decision}
          </h3>
          {timing && (
            <p className="text-xs font-bold text-forest-800 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-forest-600 inline-block" />
              {timing}
            </p>
          )}
        </div>

        {/* Explainable plain language reason */}
        <p className="text-xs sm:text-sm text-charcoal-700 mt-2.5 line-clamp-3 font-medium leading-relaxed">
          {reason}
        </p>
      </div>

      {/* Card Actions: [Why?] + [View Details] */}
      <div className="pt-4 mt-4 border-t border-ivory-300 flex items-center justify-between gap-2">
        <button
          onClick={onWhyClick}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-forest-900 hover:text-forest-950 py-1 px-2 rounded-lg hover:bg-forest-50 transition-colors"
        >
          <HelpCircle className="w-4 h-4 text-forest-700" />
          <span>Why this decision?</span>
        </button>

        {onActionClick && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onActionClick}
            className="text-xs font-bold"
            rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
};
