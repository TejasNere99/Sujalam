import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  ArrowRight, 
  ShieldCheck, 
  Droplets, 
  CloudRain, 
  TrendingUp, 
  Scan, 
  Sparkles, 
  Check, 
  X as XIcon, 
  CheckCircle2, 
  Globe, 
  PlayCircle,
  Clock,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { LanguageSwitcher } from '../components/layout/LanguageSwitcher';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ConfidenceBadge } from '../components/advisory/ConfidenceBadge';

export const LandingPage: React.FC = () => {
  const { t } = useLanguage();
  const { loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const handleDemoClick = () => {
    loginAsDemo();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-ivory-200 text-charcoal-900 selection:bg-forest-100 selection:text-forest-900">
      {/* 1. Global Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-ivory-300 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-subtle">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-forest-900 text-ivory-100 flex items-center justify-center font-bold text-lg shadow-sm">
            <Sprout className="w-6 h-6 text-gold-400" />
          </div>
          <div>
            <span className="font-extrabold tracking-wider text-xl text-forest-950 block leading-none font-sans">
              {t.brandName}
            </span>
            <span className="text-[11px] text-charcoal-600 font-medium tracking-tight block mt-0.5">
              {t.tagline}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <LanguageSwitcher variant="landing" />
          <Link
            to="/login"
            className="hidden sm:inline-flex text-xs sm:text-sm font-bold text-forest-900 hover:text-forest-950 px-3 py-2"
          >
            {t.nav.login}
          </Link>
          <Button
            variant="primary"
            size="md"
            onClick={handleDemoClick}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {t.landing.ctaPrimary}
          </Button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <Badge variant="forest" size="md" className="py-1 px-3.5">
            <Sparkles className="w-3.5 h-3.5 text-forest-700 mr-1.5" />
            {t.landing.heroBadge}
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-charcoal-950 tracking-tight leading-[1.1] font-sans">
            {t.landing.headline.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br className="hidden sm:block" />
              </React.Fragment>
            ))}
          </h1>

          <p className="text-base sm:text-xl text-charcoal-700 font-medium max-w-2xl mx-auto leading-relaxed">
            {t.landing.subheadline}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={handleDemoClick}
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="w-full sm:w-auto shadow-elevated"
            >
              {t.landing.ctaPrimary}
            </Button>
            <Link to="/onboarding" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="lg"
                className="w-full"
              >
                {t.landing.ctaSecondary}
              </Button>
            </Link>
          </div>

          {/* Quick Trust Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-8 max-w-2xl mx-auto text-left">
            <div className="p-3.5 rounded-xl bg-white border border-ivory-300 shadow-subtle flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-forest-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-charcoal-900">{t.landing.keyStat1Title}</p>
                <p className="text-[11px] text-charcoal-600">{t.landing.keyStat1Sub}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-ivory-300 shadow-subtle flex items-start gap-2.5">
              <Droplets className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-charcoal-900">{t.landing.keyStat2Title}</p>
                <p className="text-[11px] text-charcoal-600">{t.landing.keyStat2Sub}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-ivory-300 shadow-subtle flex items-start gap-2.5">
              <Globe className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-charcoal-900">{t.landing.keyStat3Title}</p>
                <p className="text-[11px] text-charcoal-600">{t.landing.keyStat3Sub}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Hero Visual Preview: Today's Farm Plan Card Mockup */}
        <div className="mt-14 max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-elevated border-2 border-forest-900/15">
            <div className="flex items-center justify-between pb-5 border-b border-ivory-300">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-forest-900">
                  Live Farm Plan Simulation • Maharashtra Cotton 2.5 Acres
                </span>
              </div>
              <ConfidenceBadge score={87} size="md" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6">
              {/* Irrigation Card */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
                <span className="text-[11px] font-bold text-blue-900 uppercase block">💧 IRRIGATION</span>
                <h4 className="text-lg font-extrabold text-blue-950 mt-1">WAIT 24 HOURS</h4>
                <p className="text-xs text-blue-900 mt-2 font-medium">
                  Rain expected (82%) and soil moisture is 67%.
                </p>
              </div>

              {/* Crop Health Card */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                <span className="text-[11px] font-bold text-amber-900 uppercase block">🌱 CROP HEALTH</span>
                <h4 className="text-lg font-extrabold text-amber-950 mt-1">INSPECT TODAY</h4>
                <p className="text-xs text-amber-900 mt-2 font-medium">
                  Leaf Spot detected (81% risk) under high humidity.
                </p>
              </div>

              {/* Market Card */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <span className="text-[11px] font-bold text-emerald-900 uppercase block">💰 MARKET</span>
                <h4 className="text-lg font-extrabold text-emerald-950 mt-1">HOLD PRODUCE</h4>
                <p className="text-xs text-emerald-900 mt-2 font-medium">
                  Rate ₹7,100/q (+4.2% trend). Hold 3-5 days.
                </p>
              </div>

              {/* Weather Card */}
              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200">
                <span className="text-[11px] font-bold text-sky-900 uppercase block">🌧️ WEATHER</span>
                <h4 className="text-lg font-extrabold text-sky-950 mt-1">RAIN EXPECTED</h4>
                <p className="text-xs text-sky-900 mt-2 font-medium">
                  24.5mm showers arriving this afternoon.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Product Philosophy Banner */}
      <section className="bg-forest-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-y border-forest-900">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-extrabold tracking-widest text-gold-400 uppercase">
            Product Philosophy
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-serif italic">
            {t.landing.philosophyTitle}
          </h2>
          <p className="text-sm sm:text-base text-forest-200 max-w-2xl mx-auto leading-relaxed">
            {t.landing.philosophyBody}
          </p>
        </div>
      </section>

      {/* 5. Before vs After (The Problem & The Solution) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-extrabold tracking-wider text-forest-800 uppercase">
            Comparison
          </span>
          <h2 className="text-3xl font-extrabold text-charcoal-950 mt-1">
            Transforming Fragmented Guesswork into Unified Intelligence
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Without Sujalam */}
          <div className="p-6 sm:p-8 rounded-3xl bg-red-50/50 border border-red-200 space-y-4">
            <div className="flex items-center gap-2 text-red-800 font-extrabold text-sm uppercase tracking-wider">
              <XIcon className="w-5 h-5" />
              <span>{t.landing.withoutSujalam}</span>
            </div>
            <p className="text-xs text-charcoal-600">
              Disconnected sensors, scattered WhatsApp messages, and delayed actions.
            </p>

            <ul className="space-y-3 pt-2">
              {t.landing.withoutPoints.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-charcoal-800">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✕</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* With Sujalam */}
          <div className="p-6 sm:p-8 rounded-3xl bg-forest-900 text-white border border-forest-800 space-y-4 shadow-elevated">
            <div className="flex items-center gap-2 text-gold-300 font-extrabold text-sm uppercase tracking-wider">
              <Check className="w-5 h-5" />
              <span>{t.landing.withSujalam}</span>
            </div>
            <p className="text-xs text-forest-200">
              One synthesized daily plan with explainable decisions before stepping into the field.
            </p>

            <ul className="space-y-3 pt-2">
              {t.landing.withPoints.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-ivory-100 font-medium">
                  <span className="w-5 h-5 rounded-full bg-forest-700 text-gold-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 6. How Sujalam Works */}
      <section className="py-16 bg-white border-y border-ivory-300 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold tracking-wider text-forest-800 uppercase">
              Architecture
            </span>
            <h2 className="text-3xl font-extrabold text-charcoal-950 mt-1">
              {t.landing.howItWorksTitle}
            </h2>
            <p className="text-sm text-charcoal-600 mt-2">
              {t.landing.howItWorksSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-ivory-100 border border-ivory-300 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-forest-900 text-white flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="text-lg font-bold text-charcoal-900">{t.landing.step1Title}</h3>
              <p className="text-xs sm:text-sm text-charcoal-700">{t.landing.step1Desc}</p>
            </div>

            <div className="p-6 rounded-2xl bg-ivory-100 border border-ivory-300 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-forest-900 text-white flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="text-lg font-bold text-charcoal-900">{t.landing.step2Title}</h3>
              <p className="text-xs sm:text-sm text-charcoal-700">{t.landing.step2Desc}</p>
            </div>

            <div className="p-6 rounded-2xl bg-ivory-100 border border-ivory-300 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-forest-900 text-white flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="text-lg font-bold text-charcoal-900">{t.landing.step3Title}</h3>
              <p className="text-xs sm:text-sm text-charcoal-700">{t.landing.step3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Estimated Farm Impact Metrics */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <span className="text-xs font-extrabold tracking-wider text-forest-800 uppercase">
          Field Impact
        </span>
        <h2 className="text-3xl font-extrabold text-charcoal-950 mt-1">
          {t.landing.impactTitle}
        </h2>
        <p className="text-xs sm:text-sm text-charcoal-600 max-w-xl mx-auto mt-2">
          {t.landing.impactSubtitle}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 max-w-4xl mx-auto">
          <div className="p-6 rounded-2xl bg-white border border-ivory-300 shadow-card">
            <span className="text-xs font-bold text-charcoal-500 uppercase">{t.landing.impactWaterSaved}</span>
            <p className="text-3xl sm:text-4xl font-extrabold text-blue-700 mt-2 font-sans">{t.landing.impactWaterSavedValue}</p>
            <p className="text-xs text-charcoal-600 mt-2">By delaying pumps ahead of showers</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-ivory-300 shadow-card">
            <span className="text-xs font-bold text-charcoal-500 uppercase">{t.landing.impactCostSaved}</span>
            <p className="text-3xl sm:text-4xl font-extrabold text-forest-900 mt-2 font-sans">{t.landing.impactCostSavedValue}</p>
            <p className="text-xs text-charcoal-600 mt-2">Preventing washed-out pesticide sprays</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-ivory-300 shadow-card">
            <span className="text-xs font-bold text-charcoal-500 uppercase">{t.landing.impactDecisionTime}</span>
            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-700 mt-2 font-sans">{t.landing.impactDecisionTimeValue}</p>
            <p className="text-xs text-charcoal-600 mt-2">Every morning at 06:30 AM</p>
          </div>
        </div>

        <p className="text-[11px] text-charcoal-500 italic mt-6">
          {t.landing.impactDisclaimer}
        </p>
      </section>

      {/* 8. Call to Action & Footer */}
      <section className="bg-forest-900 text-white py-16 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            {t.landing.ctaBannerTitle}
          </h2>
          <p className="text-sm sm:text-base text-forest-200 max-w-xl mx-auto">
            {t.landing.ctaBannerSubtitle}
          </p>
          <div className="pt-2">
            <Button
              variant="gold"
              size="lg"
              onClick={handleDemoClick}
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="shadow-elevated"
            >
              {t.landing.startFree}
            </Button>
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 text-center text-xs text-charcoal-500 border-t border-ivory-300 bg-ivory-100">
        <p>© 2026 {t.brandName} • {t.tagline} • Built for Indian Agriculture</p>
      </footer>
    </div>
  );
};
