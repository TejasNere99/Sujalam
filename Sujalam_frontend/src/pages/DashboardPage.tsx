import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sprout,
  RefreshCw,
  ShieldCheck,
  ChevronRight,
  AlertTriangle,
  Plus,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFarm } from '../context/FarmContext';
import { useLanguage } from '../context/LanguageContext';
import { TodaysFarmPlan } from '../components/advisory/TodaysFarmPlan';
import { SignalCard } from '../components/advisory/SignalCard';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const {
    farms,
    currentFarm,
    currentCrop,
    currentAdvisory,
    isLoadingFarm,
    isLoadingAdvisory,
    isCached,
    refreshAdvisory,
  } = useFarm();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  React.useEffect(() => {
    const onOnline = () => setIsOffline(false);
    const onOffline = () => setIsOffline(true);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  const handleRefreshAdvisory = async () => {
    setIsRefreshing(true);
    try {
      await refreshAdvisory();
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoadingFarm) {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <Skeleton className="h-40 w-full rounded-3xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    );
  }

  if (farms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl border border-ivory-300 shadow-sm text-center mt-8">
        <Sprout className="w-16 h-16 text-forest-300 mb-4" />
        <h2 className="text-xl font-bold text-charcoal-900 mb-2">Welcome to Sujalam</h2>
        <p className="text-sm text-charcoal-600 mb-6 max-w-md">
          You haven't set up your farm yet. Create your farm profile to get personalized advisory and insights.
        </p>
        <Button onClick={() => navigate('/onboarding')} rightIcon={<Plus className="w-4 h-4" />}>
          Create Your First Farm
        </Button>
      </div>
    );
  }

  const farmId = currentFarm ? ((currentFarm as any).id || (currentFarm as any)._id) : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Offline Banner */}
      {isOffline && (
        <div className="bg-amber-50 text-amber-900 px-4 py-3 rounded-2xl border border-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold">You are offline</p>
            <p className="text-xs mt-0.5 opacity-80">
              Showing your latest saved farm plan. Reconnect to get live updates.
            </p>
          </div>
        </div>
      )}

      {/* Cached data notice */}
      {isCached && !isOffline && (
        <div className="bg-blue-50 text-blue-900 px-4 py-3 rounded-2xl border border-blue-200 flex items-center gap-3">
          <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <p className="text-sm">Showing cached data. Pull to refresh.</p>
        </div>
      )}

      {/* Advisory Header + Refresh */}
      <div className="bg-gradient-to-br from-forest-800 via-forest-900 to-forest-950 text-white rounded-[24px] p-6 shadow-elevated overflow-hidden relative border border-forest-700/50">
        <div className="absolute right-0 top-0 w-80 h-80 bg-forest-500/20 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/4 animate-pulse-slow pointer-events-none" />
        <div className="absolute left-0 bottom-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/4 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-forest-200 text-sm mb-1 font-medium tracking-wide">
              Good morning, {user?.name.split(' ')[0]} 👋
            </p>
            <h1 className="text-3xl font-display font-extrabold tracking-tight drop-shadow-md">{currentFarm?.name || 'Your Farm'}</h1>
            <div className="flex items-center gap-2 text-xs text-forest-200 mt-2 font-medium">
              <span>{currentCrop?.crop_name || 'No Crop Registered'}</span>
              {currentFarm?.area_acres && (
                <>
                  <span>•</span>
                  <span>{currentFarm.area_acres} acres</span>
                </>
              )}
              {currentFarm?.location_name && (
                <>
                  <span>•</span>
                  <span>{currentFarm.location_name}</span>
                </>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAdvisory}
            isLoading={isRefreshing || isLoadingAdvisory}
            leftIcon={<RefreshCw className="w-4 h-4" />}
            className="border-forest-600 text-white hover:bg-forest-800 shrink-0"
            disabled={isOffline}
          >
            {isRefreshing ? 'Updating...' : 'Refresh Plan'}
          </Button>
        </div>
      </div>

      {/* Today's Farm Plan */}
      {isLoadingAdvisory ? (
        <Skeleton className="h-80 w-full rounded-3xl" />
      ) : currentAdvisory ? (
        <TodaysFarmPlan
          advisory={currentAdvisory}
          farmerName={user?.name.split(' ')[0] || 'Farmer'}
          cropContext={currentCrop
            ? `${currentCrop.crop_name}${currentCrop.growth_stage ? ` · ${currentCrop.growth_stage}` : ''}`
            : 'No crop registered'}
          locationContext={currentFarm?.location_name || ''}
        />
      ) : (
        <div className="p-6 bg-white rounded-3xl border border-ivory-300 text-center shadow-sm">
          <p className="text-charcoal-500 font-medium text-sm mb-4">
            No advisory available. Generate your first farm plan.
          </p>
          <Button
            onClick={handleRefreshAdvisory}
            isLoading={isRefreshing}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Generate Advisory
          </Button>
        </div>
      )}

      {/* Signal Cards — backend advisory data */}
      {currentAdvisory && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <SignalCard
            type="rain"
            title="Weather"
            value={currentAdvisory.weather.risk}
            statusText={`${currentAdvisory.weather.risk} Risk`}
            level={
              currentAdvisory.weather.risk === 'HIGH'
                ? 'critical'
                : currentAdvisory.weather.risk === 'MEDIUM'
                ? 'high'
                : 'optimal'
            }
            subtitle={currentAdvisory.weather.summary.slice(0, 40)}
          />
          <SignalCard
            type="soil"
            title="Irrigation"
            value={currentAdvisory.irrigation.decision}
            statusText={`${currentAdvisory.irrigation.confidence}% Conf.`}
            level={currentAdvisory.irrigation.decision === 'IRRIGATE' ? 'moderate' : 'optimal'}
            subtitle={currentAdvisory.irrigation.timing || 'See plan'}
          />
          <SignalCard
            type="disease"
            title="Crop Health"
            value={currentAdvisory.crop_health.decision}
            statusText={`${currentAdvisory.crop_health.confidence}% Conf.`}
            level={
              currentAdvisory.crop_health.decision === 'ACT'
                ? 'critical'
                : currentAdvisory.crop_health.decision === 'INSPECT'
                ? 'high'
                : 'optimal'
            }
            subtitle="From advisory engine"
          />
          <SignalCard
            type="market"
            title="Market"
            value={currentAdvisory.market.decision}
            statusText={`${currentAdvisory.market.confidence}% Conf.`}
            level={currentAdvisory.market.decision === 'SELL' ? 'moderate' : 'optimal'}
            subtitle={currentAdvisory.market.timing || 'See market page'}
          />
        </div>
      )}

      {/* Resource Recommendation Card */}
      {currentAdvisory?.resource_recommendation && currentAdvisory.resource_recommendation.action !== 'INSUFFICIENT_DATA' && (
        <div className="bg-white rounded-3xl border border-ivory-300 p-6 shadow-sm animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <h3 className="text-lg font-bold text-charcoal-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">🚜</span> NEXT ACTION / RESOURCES
          </h3>
          
          {currentAdvisory.resource_recommendation.action === 'BOOK' ? (
            <div className="space-y-4">
              <p className="text-forest-800 font-medium">{currentAdvisory.resource_recommendation.reason}</p>
              <div className="bg-ivory-100 p-4 rounded-xl border border-ivory-300">
                <p className="font-bold text-charcoal-900">Recommended Resource</p>
                <div className="mt-2 text-sm text-charcoal-700 flex flex-col gap-1">
                  <span className="flex items-center gap-2"><span className="w-5">📍</span> Matched based on location</span>
                  <span className="flex items-center gap-2"><span className="w-5">💰</span> Est. Total Cost: ₹{currentAdvisory.resource_recommendation.estimated_cost}</span>
                  <span className="flex items-center gap-2"><span className="w-5">✅</span> Availability Verified</span>
                </div>
              </div>
              <Button size="lg" className="w-full">
                BOOK NOW
              </Button>
            </div>
          ) : currentAdvisory.resource_recommendation.action === 'WAIT' ? (
             <div className="space-y-4">
               <p className="text-amber-800 font-medium">⚠️ {currentAdvisory.resource_recommendation.reason}</p>
               <Button variant="outline" size="lg" className="w-full">
                 FIND ALTERNATIVES
               </Button>
             </div>
          ) : (
            <div className="space-y-4">
              <p className="text-charcoal-700 font-medium">No suitable resources found nearby for your current requirements.</p>
              <Button variant="outline" size="lg" className="w-full">
                REQUEST MANUAL ASSISTANCE
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Quick Links */}
      <h3 className="text-sm font-bold text-charcoal-900 uppercase tracking-wider pt-2 px-1">
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <Link
          to="/farm"
          className="flex items-center justify-between p-4 bg-white/80 backdrop-blur border border-ivory-300/60 rounded-2xl hover:border-forest-500 hover:shadow-card hover:-translate-y-0.5 transition-all duration-300 shadow-subtle group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-charcoal-900">Manage Farm &amp; Crop</p>
              <p className="text-xs text-charcoal-500">Update sowing date, area, etc.</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-charcoal-400 group-hover:text-forest-600 transition-colors" />
        </Link>
        <Link
          to="/schemes"
          className="flex items-center justify-between p-4 bg-white/80 backdrop-blur border border-ivory-300/60 rounded-2xl hover:border-forest-500 hover:shadow-card hover:-translate-y-0.5 transition-all duration-300 shadow-subtle group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-50 text-gold-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-charcoal-900">Government Schemes</p>
              <p className="text-xs text-charcoal-500">Find matching benefits</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-charcoal-400 group-hover:text-gold-600 transition-colors" />
        </Link>
      </div>
    </div>
  );
};
