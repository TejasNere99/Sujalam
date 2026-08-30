import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle' | 'forest' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  padding = 'md',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white/80 backdrop-blur-xl border border-white/40 shadow-card text-charcoal-900 hover:shadow-elevated hover:-translate-y-1',
    subtle: 'bg-ivory-100/60 backdrop-blur-md border border-ivory-300/50 shadow-subtle text-charcoal-900 hover:bg-white/70',
    forest: 'bg-gradient-to-br from-forest-900 to-forest-950 border border-forest-800/50 text-ivory-100 shadow-elevated relative overflow-hidden',
    bordered: 'bg-white/90 backdrop-blur border border-forest-900/10 shadow-subtle text-charcoal-900 hover:border-forest-900/20 hover:shadow-card',
  };

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3.5 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  return (
    <div
      className={cn('rounded-2xl transition-all duration-150', variantStyles[variant], paddingStyles[padding], className)}
      {...props}
    >
      {children}
    </div>
  );
};
