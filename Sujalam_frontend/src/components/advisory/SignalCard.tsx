import React from 'react';
import { CloudRain, Droplets, AlertTriangle, TrendingUp, Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';

export interface SignalCardProps {
  type: 'rain' | 'soil' | 'disease' | 'market' | 'confidence';
  title: string;
  value: string | number;
  unit?: string;
  statusText: string;
  level: 'optimal' | 'moderate' | 'high' | 'critical';
  subtitle?: string;
}

export const SignalCard: React.FC<SignalCardProps> = ({
  type,
  title,
  value,
  unit,
  statusText,
  level,
  subtitle,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'rain':
        return <CloudRain className="w-5 h-5 text-blue-700" />;
      case 'soil':
        return <Droplets className="w-5 h-5 text-forest-700" />;
      case 'disease':
        return <AlertTriangle className="w-5 h-5 text-amber-700" />;
      case 'market':
        return <TrendingUp className="w-5 h-5 text-emerald-700" />;
      case 'confidence':
        return <Sparkles className="w-5 h-5 text-gold-600" />;
    }
  };

  const getBadgeVariant = () => {
    switch (level) {
      case 'optimal':
        return 'success' as const;
      case 'moderate':
        return 'info' as const;
      case 'high':
        return 'warning' as const;
      case 'critical':
        return 'danger' as const;
    }
  };

  const getProgressWidth = () => {
    if (typeof value === 'number') return `${Math.min(100, Math.max(0, value))}%`;
    const num = parseFloat(String(value));
    if (!isNaN(num)) return `${Math.min(100, Math.max(0, num))}%`;
    return '75%';
  };

  return (
    <Card variant="default" padding="sm" className="flex flex-col justify-between hover:border-forest-400 transition-colors">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-ivory-100 border border-ivory-300">
              {getIcon()}
            </div>
            <span className="text-xs font-bold text-charcoal-700">{title}</span>
          </div>
          <Badge variant={getBadgeVariant()} size="sm">
            {statusText}
          </Badge>
        </div>

        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-2xl sm:text-3xl font-extrabold text-charcoal-950 font-sans">
            {value}
          </span>
          {unit && <span className="text-xs font-semibold text-charcoal-600">{unit}</span>}
        </div>

        {subtitle && (
          <p className="text-[11px] text-charcoal-600 mt-1 line-clamp-1">
            {subtitle}
          </p>
        )}
      </div>

      {/* Progress meter bar */}
      <div className="w-full bg-ivory-300 h-1.5 rounded-full overflow-hidden mt-3">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            level === 'optimal' && 'bg-emerald-600',
            level === 'moderate' && 'bg-blue-600',
            level === 'high' && 'bg-amber-600',
            level === 'critical' && 'bg-red-600'
          )}
          style={{ width: getProgressWidth() }}
        />
      </div>
    </Card>
  );
};
