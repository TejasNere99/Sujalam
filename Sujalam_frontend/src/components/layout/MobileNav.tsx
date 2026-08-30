import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Sprout, 
  Scan, 
  TrendingUp, 
  Menu,
  CloudSun,
  Building2,
  History,
  X
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';

export const MobileNav: React.FC = () => {
  const { t } = useLanguage();
  const [moreOpen, setMoreOpen] = useState(false);

  const mainItems = [
    { to: '/dashboard', label: t.nav.home, icon: Home },
    { to: '/farm', label: t.nav.farm, icon: Sprout },
    { to: '/crop-health', label: t.nav.health, icon: Scan },
    { to: '/market', label: t.nav.marketShort, icon: TrendingUp },
  ];

  const moreItems = [
    { to: '/weather', label: t.nav.weatherSoil, icon: CloudSun, desc: 'Rain probability & root-zone soil telemetry' },
    { to: '/schemes', label: t.nav.schemes, icon: Building2, desc: 'Government subsidies & local FPOs' },
    { to: '/advisories', label: t.nav.advisoryHistory, icon: History, desc: 'Timeline of past farm plans and outcomes' },
  ];

  return (
    <>
      {/* "More" Drawer for Mobile */}
      {moreOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-150">
          <div 
            className="fixed inset-0 bg-charcoal-950/60 backdrop-blur-xs" 
            onClick={() => setMoreOpen(false)} 
          />
          <div className="absolute bottom-0 inset-x-0 bg-white rounded-t-3xl p-5 shadow-elevated border-t border-ivory-300 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
              <h3 className="text-base font-bold text-forest-950">Additional Farm Services</h3>
              <button 
                onClick={() => setMoreOpen(false)}
                className="p-1.5 rounded-lg text-charcoal-500 hover:bg-ivory-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-3 space-y-2">
              {moreItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMoreOpen(false)}
                    className="flex items-start gap-3.5 p-3 rounded-2xl bg-ivory-100 hover:bg-ivory-200 border border-ivory-300"
                  >
                    <div className="p-2 rounded-xl bg-forest-900 text-white shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-charcoal-900">{item.label}</p>
                      <p className="text-xs text-charcoal-600 mt-0.5">{item.desc}</p>
                    </div>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Fixed Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-ivory-300 px-2 py-1.5 shadow-lg"
      >
        <div className="flex items-center justify-around">
          {mainItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all min-w-[60px]',
                    isActive
                      ? 'text-forest-900 font-extrabold'
                      : 'text-charcoal-500 hover:text-forest-800 font-medium'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={cn(
                        'p-1 rounded-lg transition-colors',
                        isActive && 'bg-forest-100 text-forest-900'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] mt-0.5 tracking-tight">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setMoreOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-charcoal-500 hover:text-forest-800 font-medium min-w-[60px]"
          >
            <div className="p-1 rounded-lg">
              <Menu className="w-5 h-5" />
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight">{t.nav.more}</span>
          </button>
        </div>
      </nav>
    </>
  );
};
