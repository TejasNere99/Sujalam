import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/Button';
import { LanguageSwitcher } from '../components/layout/LanguageSwitcher';

export const SignupPage: React.FC = () => {
  const { signup, isLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill all fields');
      return;
    }
    setError('');
    try {
      await signup(name, email, password);
      navigate('/dashboard');
    } catch (e: any) {
      setError(e.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen bg-ivory-200 flex flex-col justify-between">
      <div className="p-4 sm:p-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-forest-900 text-white flex items-center justify-center font-bold">
            <Sprout className="w-5 h-5 text-gold-400" />
          </div>
          <span className="font-extrabold text-xl text-forest-950">{t.brandName}</span>
        </Link>
        <LanguageSwitcher />
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 max-w-xl mx-auto w-full">
        <div className="bg-white rounded-3xl border border-ivory-300 shadow-elevated overflow-hidden w-full p-8 sm:p-12">
          <div className="mb-6">
            <h3 className="text-xl sm:text-2xl font-extrabold text-charcoal-950">
              Create your account
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
              Join Sujalam to get actionable farm intelligence.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ananda Rao Patil"
                className="w-full px-4 py-3 rounded-xl border border-ivory-400 bg-ivory-50 text-sm font-bold text-charcoal-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-700"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ananda@example.com"
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
              Sign Up
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-ivory-200 text-center text-xs text-charcoal-600">
            Already have an account?{' '}
            <Link to="/login" className="text-forest-900 font-bold hover:underline">
              Log in here
            </Link>
          </div>
        </div>
      </div>
      <footer className="p-4 text-center text-xs text-charcoal-500">
        Sujalam Agricultural Intelligence Platform
      </footer>
    </div>
  );
};
