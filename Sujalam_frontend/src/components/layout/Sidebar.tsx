import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Sprout,
  Scan,
  CloudSun,
  TrendingUp,
  Building2,
  History,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useFarm } from '../../context/FarmContext';
import { cn } from '../../lib/utils';

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { currentFarm, currentCrop } = useFarm();

  const navItems = [
    { to: '/dashboard', label: t.nav.dashboard, icon: CheckCircle2, badge: 'Today', badgeVariant: 'forest' as const },
    { to: '/farm', label: t.nav.myFarm, icon: Sprout },
    { to: '/crop-health', label: t.nav.cropHealth, icon: Scan, badge: 'AI Scan', badgeVariant: 'gold' as const },
    { to: '/weather', label: t.nav.weatherSoil, icon: CloudSun },
    { to: '/market', label: t.nav.market, icon: TrendingUp },
    { to: '/schemes', label: t.nav.schemes, icon: Building2 },
    { to: '/advisories', label: t.nav.advisoryHistory, icon: History },
    { to: '/trust', label: 'TruthGuard', icon: ShieldCheck, badge: 'Trust', badgeVariant: 'gold' as const },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-charcoal-950/60 z-40 md:hidden backdrop-blur-xs"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed md:static inset-y-0 left-0 z-40 w-64 lg:w-72 bg-gradient-to-b from-forest-950 via-forest-900 to-forest-950 text-ivory-100 flex flex-col border-r border-forest-800/40 transition-all duration-300 ease-in-out md:translate-x-0 shrink-0 shadow-2xl md:shadow-none',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Logo & Tagline */}
        <div className="p-5 sm:p-6 border-b border-forest-800/50 flex items-center justify-between bg-forest-950/30 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-forest-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          <Link to="/dashboard" className="flex items-center gap-3 group relative z-10" onClick={onClose}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forest-700 to-forest-900 border border-forest-600/50 flex items-center justify-center text-gold-400 group-hover:scale-110 group-hover:shadow-glow transition-all duration-300">
              <Sprout className="w-6 h-6 text-gold-300 group-hover:text-gold-200 transition-colors" />
            </div>
            <div>
              <span className="font-display font-extrabold tracking-wider text-xl text-white block leading-none">
                {t.brandName}
              </span>
              <span className="text-[11px] text-forest-300 font-medium tracking-tight block mt-1">
                {t.tagline}
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3.5 py-6 space-y-2 overflow-y-auto no-scrollbar" aria-label="Main Navigation">
          <div className="px-3 pb-3 text-[10px] font-bold uppercase tracking-widest text-forest-400/80">
            Farm Intelligence
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group relative overflow-hidden',
                    isActive
                      ? 'text-white shadow-lg shadow-forest-950/20'
                      : 'text-forest-200 hover:text-white hover:bg-forest-800/30 hover:shadow-subtle'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-forest-800/80 to-forest-800/40 border border-forest-700/50 rounded-xl" />
                    )}
                    <div className="flex items-center gap-3 min-w-0 relative z-10">
                      <Icon
                        className={cn(
                          'w-5 h-5 shrink-0 transition-all duration-300',
                          isActive ? 'text-gold-400 scale-110' : 'text-forest-400 group-hover:text-gold-300/70 group-hover:scale-110'
                        )}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={cn(
                          'text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide shrink-0',
                          item.badgeVariant === 'gold' && 'bg-gold-400 text-forest-950',
                          item.badgeVariant === 'forest' && 'bg-forest-800 text-forest-200'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Active Farm Context Footer — REAL data from FarmContext */}
        <div className="p-4 m-3 bg-forest-900/80 rounded-2xl border border-forest-800 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-gold-300 uppercase tracking-wider">
              Active Farm
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          {currentFarm ? (
            <>
              <p className="font-semibold text-white truncate">{currentFarm.name}</p>
              <p className="text-forest-300 text-[11px] truncate">
                {currentCrop?.crop_name
                  ? `${currentCrop.crop_name}${currentFarm.area_acres ? ` • ${currentFarm.area_acres} ac` : ''}`
                  : currentFarm.location_name || 'No crop registered'}
              </p>
            </>
          ) : (
            <p className="text-forest-400 text-[11px]">No farm set up yet</p>
          )}

          <Link
            to="/farm"
            onClick={onClose}
            className="mt-2.5 flex items-center justify-between text-[11px] text-ivory-300 hover:text-white font-medium group"
          >
            <span>{t.farm.editFarm}</span>
            <ChevronRight className="w-3.5 h-3.5 text-forest-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </aside>
    </>
  );
};
