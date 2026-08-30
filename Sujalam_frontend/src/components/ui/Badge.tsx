import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'gold' | 'forest';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'neutral',
  size = 'sm',
  icon,
  ...props
}) => {
  const variantStyles = {
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold',
    warning: 'bg-amber-50 text-amber-900 border border-amber-300 font-semibold',
    danger: 'bg-red-50 text-red-800 border border-red-300 font-semibold',
    info: 'bg-blue-50 text-blue-800 border border-blue-300 font-semibold',
    neutral: 'bg-ivory-100 text-charcoal-800 border border-ivory-300 font-medium',
    gold: 'bg-gold-50 text-gold-900 border border-gold-300 font-bold',
    forest: 'bg-forest-50 text-forest-900 border border-forest-200 font-bold',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5 rounded-lg gap-1',
    md: 'text-sm px-3 py-1 rounded-xl gap-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center tracking-tight leading-none shrink-0',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
