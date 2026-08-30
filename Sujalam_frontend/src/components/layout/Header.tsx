import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sprout,
  MapPin,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  Menu,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFarm } from '../../context/FarmContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Badge } from '../ui/Badge';

export interface HeaderProps {
  onToggleSidebar?: () => void;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, title }) => {
  const { user, logout } = useAuth();
  const { currentFarm, currentCrop } = useFarm();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  // Build farm context string from real data
  const farmContextString = currentFarm
    ? [
        currentCrop?.crop_name,
        currentFarm.area_acres ? `${currentFarm.area_acres} ac` : null,
        currentFarm.location_name,
      ]
        .filter(Boolean)
        .join(' • ')
    : 'No farm set up';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-ivory-300 px-4 sm:px-6 py-3 flex items-center justify-between shadow-subtle">
      {/* Left Area */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
          className="md:hidden p-2 rounded-xl text-charcoal-700 hover:bg-ivory-200 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-forest-950 truncate">
              {title || t.brandName}
            </h1>
            <Badge variant="gold" size="sm" className="hidden sm:inline-flex">
              <Sparkles className="w-3 h-3 mr-1 text-gold-700" />
              Decision Engine v2
            </Badge>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-charcoal-600 truncate mt-0.5">
            <MapPin className="w-3 h-3 text-forest-600 shrink-0" />
            <span className="truncate font-medium">{farmContextString}</span>
          </div>
        </div>
      </div>

      {/* Right Area */}
      <div className="flex items-center gap-2 sm:gap-3">
        <LanguageSwitcher />

        {user ? (
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              aria-label="User profile menu"
              aria-expanded={profileOpen}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-ivory-300 bg-ivory-100 hover:bg-ivory-200 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-forest-900 text-ivory-100 flex items-center justify-center font-bold text-xs">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-xs font-bold text-charcoal-900 leading-tight">{user.name}</p>
                <p className="text-[10px] text-charcoal-500">{user.email}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-charcoal-500 hidden sm:block" />
            </button>

            {profileOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-elevated border border-ivory-300 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setProfileOpen(false)}
              >
                <div className="px-4 py-2 border-b border-ivory-200">
                  <p className="text-sm font-bold text-charcoal-900">{user.name}</p>
                  <p className="text-xs text-charcoal-500">{user.email}</p>
                </div>

                <div className="py-1">
                  <Link
                    to="/farm"
                    className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm text-charcoal-800 hover:bg-ivory-100 font-medium"
                  >
                    <Sprout className="w-4 h-4 text-forest-700" />
                    <span>{t.nav.myFarm}</span>
                  </Link>
                  <Link
                    to="/onboarding"
                    className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm text-charcoal-800 hover:bg-ivory-100 font-medium"
                  >
                    <Sparkles className="w-4 h-4 text-gold-600" />
                    <span>Add New Farm</span>
                  </Link>
                </div>

                <div className="pt-1 border-t border-ivory-200">
                  <button
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs sm:text-sm text-red-700 hover:bg-red-50 font-semibold text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t.nav.logout}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="px-3 py-1.5 rounded-xl bg-forest-900 text-white text-xs sm:text-sm font-bold hover:bg-forest-800"
          >
            {t.nav.login}
          </Link>
        )}
      </div>
    </header>
  );
};
