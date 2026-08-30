import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { OfflineIndicator } from './OfflineIndicator';
import { useLanguage } from '../../context/LanguageContext';

export interface AppShellProps {
  children?: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useLanguage();
  const location = useLocation();

  // Determine current page title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return t.nav.dashboard;
    if (path.includes('/farm')) return t.nav.myFarm;
    if (path.includes('/crop-health')) return t.nav.cropHealth;
    if (path.includes('/weather')) return t.nav.weatherSoil;
    if (path.includes('/market')) return t.nav.market;
    if (path.includes('/schemes')) return t.nav.schemes;
    if (path.includes('/advisories')) return t.nav.advisoryHistory;
    return t.brandName;
  };

  return (
    <div className="min-h-screen bg-ivory-200 flex flex-col font-sans text-charcoal-900 selection:bg-forest-100 selection:text-forest-900">
      {/* Offline banner */}
      <OfflineIndicator />

      <div className="flex-1 flex min-h-0">
        {/* Responsive Desktop Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
          <Header
            title={getPageTitle()}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-8">
            {children || <Outlet />}
          </main>

          <footer className="hidden md:block border-t border-ivory-300 py-4 px-6 text-center text-xs text-charcoal-500 bg-white/50">
            <p>
              {t.brandName} • {t.tagline} • {t.common.demoNotice}
            </p>
          </footer>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
};
