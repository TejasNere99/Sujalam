import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Phone, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/Button';
import { LanguageSwitcher } from '../components/layout/LanguageSwitcher';

export const LoginPage: React.FC = () => {
  const { login, loginAsDemo, isLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (e: any) {
      setError(e.message || 'Login failed');
    }
  };

  const handleDemo = async () => {
    await loginAsDemo();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-ivory-200 flex flex-col justify-between">
      {/* Header */}
      <div className="p-4 sm:p-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-forest-900 text-white flex items-center justify-center font-bold">
            <Sprout className="w-5 h-5 text-gold-400" />
          </div>
          <span className="font-extrabold text-xl text-forest-950">{t.brandName}</span>
        </Link>
        <LanguageSwitcher />
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl border border-ivory-300 shadow-elevated overflow-hidden w-full">
          {/* Left: Agricultural Visual & Value Prop */}
          <div className="bg-forest-950 text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">
                Farmer Decision Intelligence
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans leading-tight">
                One farm. Four signals. One clear decision.
              </h2>
              <p className="text-xs sm:text-sm text-forest-200 leading-relaxed">
                Connect your farm to receive daily synchronized decisions on irrigation, crop health, and market timing.
              </p>
            </div>
            <div className="relative z-10 pt-8 border-t border-forest-900 mt-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-forest-800 flex items-center justify-center text-gold-400 font-bold text-sm">
                  🌾
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Smart Farm Advisory</p>
                  <p className="text-[11px] text-forest-300">Powered by Sujalam Decision Engine</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Login Form */}
          <div className="p-8 sm:p-12 flex flex-col justify-center">
            <div className="mb-6">
              <h3 className="text-xl sm:text-2xl font-extrabold text-charcoal-950">
                {t.nav.login}
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
                Enter your credentials to access your daily farm plan.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="demo@sujalam.com"
                  className="w-full px-4 py-3 rounded-xl border border-ivory-400 bg-ivory-50 text-sm font-bold text-charcoal-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-700"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-ivory-400 bg-ivory-50 text-sm font-bold text-charcoal-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-700"
                  required
                />
              </div>
              {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Continue to Dashboard
              </Button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleDemo}
                  className="w-full py-2.5 px-4 rounded-xl bg-gold-50 border border-gold-300 text-gold-900 font-bold text-xs sm:text-sm hover:bg-gold-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-gold-700" />
                  <span>Instant 1-Click Demo Login</span>
                </button>
              </div>
            </form>

            <div className="mt-6 pt-4 border-t border-ivory-200 text-center text-xs text-charcoal-600">
              New to Sujalam?{' '}
              <Link to="/signup" className="text-forest-900 font-bold hover:underline">
                Register here
              </Link>
            </div>
          </div>
        </div>
      </div>
      <footer className="p-4 text-center text-xs text-charcoal-500">
        Sujalam Agricultural Intelligence Platform
      </footer>
    </div>
  );
};
