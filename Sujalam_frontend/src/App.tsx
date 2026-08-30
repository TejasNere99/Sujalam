import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FarmProvider } from './context/FarmContext';
import { LanguageProvider } from './context/LanguageContext';
import { OfflineProvider } from './context/OfflineContext';
import { ResilienceProvider } from './context/ResilienceContext';
import { AppShell } from './components/layout/AppShell';
import { ResilienceBanner } from './components/ResilienceBanner';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { MyFarmPage } from './pages/MyFarmPage';
import { CropHealthPage } from './pages/CropHealthPage';
import { WeatherSoilPage } from './pages/WeatherSoilPage';
import { MarketPage } from './pages/MarketPage';
import { SchemesPage } from './pages/SchemesPage';
import { AdvisoryHistoryPage } from './pages/AdvisoryHistoryPage';
import { ResilienceDemoPage } from './pages/ResilienceDemoPage';
import TrustCenter from './pages/TrustCenter';
import TrustDemoDashboard from './pages/TrustDemoDashboard';
import ResourceDecisionDemo from './pages/ResourceDecisionDemo';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivory-200 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-forest-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-forest-900">Loading Sujalam...</p>
        </div>
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const AppContent: React.FC = () => {
  return (
    <BrowserRouter>
      <ResilienceBanner />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Demo specific route (Hackathon) */}
        <Route path="/resilience" element={<ResilienceDemoPage />} />

        {/* Onboarding (protected but before farm setup) */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />

        {/* Authenticated Farm Dashboard Routes (Wrapped in AppShell + FarmProvider) */}
        <Route
          element={
            <ProtectedRoute>
              <FarmProvider>
                <AppShell />
              </FarmProvider>
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/farm" element={<MyFarmPage />} />
          <Route path="/crop-health" element={<CropHealthPage />} />
          <Route path="/weather" element={<WeatherSoilPage />} />
          <Route path="/market" element={<MarketPage />} />
          <Route path="/schemes" element={<SchemesPage />} />
          <Route path="/advisories" element={<AdvisoryHistoryPage />} />
          <Route path="/trust" element={<TrustCenter />} />
        </Route>
        
        {/* Hackathon Judge Demo Console */}
        <Route path="/trust-demo" element={<TrustDemoDashboard />} />
        <Route path="/resource-demo" element={<ResourceDecisionDemo />} />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <OfflineProvider>
        <ResilienceProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ResilienceProvider>
      </OfflineProvider>
    </LanguageProvider>
  );
}
