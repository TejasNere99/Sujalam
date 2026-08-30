import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'gold' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.99]';

  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs sm:text-sm font-medium gap-1.5 min-h-[36px]',
    md: 'px-4.5 py-2.5 text-sm sm:text-base font-semibold gap-2 min-h-[44px]',
    lg: 'px-6 py-3.5 text-base sm:text-lg font-bold gap-2.5 min-h-[52px]', // Farmer primary touch target
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-forest-800 to-forest-900 text-white hover:from-forest-700 hover:to-forest-800 active:scale-95 border border-forest-700 shadow-md hover:shadow-lg',
    secondary: 'bg-white/80 backdrop-blur text-charcoal-900 hover:bg-white border border-ivory-300 shadow-subtle hover:shadow-card active:scale-95',
    ghost: 'bg-transparent text-charcoal-800 hover:bg-forest-50/50 hover:text-forest-900 active:scale-95',
    gold: 'bg-gradient-to-r from-gold-400 to-gold-500 text-forest-950 font-bold hover:from-gold-300 hover:to-gold-400 active:scale-95 border border-gold-400 shadow-md',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 active:scale-95 border border-red-700 shadow-md',
    outline: 'bg-transparent text-forest-900 hover:bg-forest-50 border border-forest-800/40 hover:border-forest-700 active:scale-95',
  };

  return (
    <button
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
