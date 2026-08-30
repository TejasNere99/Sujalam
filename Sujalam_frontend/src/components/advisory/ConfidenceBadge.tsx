import React from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ConfidenceBadgeProps {
  score: number; // 0 - 100
  className?: string;
  size?: 'sm' | 'md';
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ score, className, size = 'sm' }) => {
  const isHigh = score >= 80;
  const isModerate = score >= 60 && score < 80;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-bold tracking-tight',
        isHigh
          ? 'bg-forest-100 text-forest-900 border border-forest-300'
          : isModerate
          ? 'bg-amber-100 text-amber-900 border border-amber-300'
          : 'bg-red-100 text-red-900 border border-red-300',
        size === 'md' ? 'text-xs sm:text-sm px-3 py-1' : 'text-[11px]',
        className
      )}
    >
      {isHigh ? (
        <ShieldCheck className={size === 'md' ? 'w-4 h-4 text-forest-700' : 'w-3.5 h-3.5 text-forest-700'} />
      ) : (
        <ShieldAlert className={size === 'md' ? 'w-4 h-4 text-amber-700' : 'w-3.5 h-3.5 text-amber-700'} />
      )}
      <span>{score}% Confidence</span>
    </div>
  );
};
