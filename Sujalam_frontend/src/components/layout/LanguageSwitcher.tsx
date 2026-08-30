import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { languages, LanguageCode } from '../../lib/i18n';
import { cn } from '../../lib/utils';

export const LanguageSwitcher: React.FC<{ variant?: 'header' | 'compact' | 'landing' }> = ({
  variant = 'header',
}) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Select language"
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border',
          variant === 'landing'
            ? 'bg-white/90 backdrop-blur-sm text-charcoal-900 border-ivory-400 hover:bg-white shadow-subtle'
            : 'bg-ivory-100 text-charcoal-800 border-ivory-300 hover:bg-ivory-300 active:bg-ivory-400'
        )}
      >
        <Globe className="w-3.5 h-3.5 text-forest-700 shrink-0" />
        <span className="font-bold">{currentLang.nativeLabel}</span>
        <ChevronDown className={cn('w-3 h-3 text-charcoal-500 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-40 bg-white rounded-xl shadow-elevated border border-ivory-300 py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
          {languages.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code as LanguageCode);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm text-left transition-colors',
                  isSelected
                    ? 'bg-forest-50 text-forest-900 font-bold'
                    : 'text-charcoal-800 hover:bg-ivory-100 font-medium'
                )}
              >
                <span>{lang.nativeLabel} <span className="text-xs text-charcoal-500 font-normal">({lang.label})</span></span>
                {isSelected && <Check className="w-3.5 h-3.5 text-forest-700 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
