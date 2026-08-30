import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const ResourceDecisionDemo: React.FC = () => {
  const [step, setStep] = useState<'BEFORE' | 'ANALYZING' | 'AFTER'>('BEFORE');

  const handleGenerate = () => {
    setStep('ANALYZING');
    setTimeout(() => setStep('AFTER'), 2500);
  };

  return (
    <div className="min-h-screen bg-ivory-100 p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-forest-900 font-display">Farm Resource Intelligence</h1>
          <p className="text-forest-700 text-lg">Hackathon Demo: Converting fragmented availability into actionable decisions.</p>
        </header>

        {step === 'BEFORE' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up">
            <Card className="p-6 space-y-4 border-l-4 border-l-red-500">
              <h2 className="text-xl font-bold text-gray-800">Before Sujalam (Fragmented Data)</h2>
              <ul className="space-y-3 text-gray-600">
                <li>🌾 <strong>Crop:</strong> Wheat (Harvest Stage)</li>
                <li>🌧️ <strong>Weather:</strong> High rain risk tomorrow after 2 PM</li>
                <li>🚜 <strong>Tractors:</strong> 5 listed nearby (no context on suitability)</li>
                <li>👥 <strong>Labour:</strong> 12 workers listed (are they free?)</li>
              </ul>
              <div className="pt-4 p-3 bg-red-50 text-red-700 rounded-md">
                <strong>Problem:</strong> Farmer must manually call providers, check weather, assess crop needs, and guess the best combination before the rain hits.
              </div>
            </Card>

            <div className="flex items-center justify-center">
              <Button onClick={handleGenerate} size="lg" className="w-full py-6 text-xl shadow-xl hover:scale-105 transition-all">
                ⚡ GENERATE DECISION INTELLIGENCE
              </Button>
            </div>
          </div>
        )}

        {step === 'ANALYZING' && (
          <div className="flex flex-col items-center justify-center space-y-8 py-20">
            <div className="relative">
              <div className="w-24 h-24 border-8 border-gold-400 border-t-forest-800 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-3xl">🧠</div>
            </div>
            <div className="text-center space-y-2 animate-pulse-slow">
              <p className="text-xl font-semibold text-forest-800">1. Analyzing Weather Constraints (Rain at 2 PM)...</p>
              <p className="text-lg text-forest-700">2. Searching Deterministic Machinery DB...</p>
              <p className="text-lg text-forest-600">3. Validating Operator Availability...</p>
              <p className="text-md text-forest-500">4. Running AI Safety Validator...</p>
            </div>
          </div>
        )}

        {step === 'AFTER' && (
          <div className="space-y-8 animate-fade-in-up">
            <Card className="p-8 border-t-8 border-t-forest-700 bg-gradient-to-br from-white to-green-50 shadow-2xl">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-forest-900 font-display">🌾 TODAY'S FARM PLAN</h2>
                  <p className="text-forest-700 text-lg mt-2">Harvest your wheat tomorrow morning because rain risk increases after 2 PM.</p>
                </div>
                <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full font-bold animate-pulse">
                  URGENT ACTION
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="glass-dark p-6 rounded-xl text-white space-y-3 shadow-inner">
                  <h3 className="text-xl font-bold text-gold-400 flex items-center gap-2">🚜 Best Machinery Match</h3>
                  <p className="text-lg font-semibold">Tractor + Harvester (Mahesh Equipments)</p>
                  <ul className="space-y-2 opacity-90">
                    <li className="flex justify-between"><span>Distance:</span> <strong>4.2 km</strong></li>
                    <li className="flex justify-between"><span>Rate:</span> <strong>₹1,200/hr</strong></li>
                    <li className="flex justify-between"><span>Availability:</span> <strong>Tomorrow 8 AM - 1 PM</strong></li>
                    <li className="flex items-center gap-2 text-green-300 mt-2">✓ Operator Available</li>
                  </ul>
                </div>

                <div className="glass p-6 rounded-xl space-y-3 bg-white/60">
                  <h3 className="text-xl font-bold text-forest-900 flex items-center gap-2">👥 Support Labour</h3>
                  <p className="text-lg font-semibold">Ramesh Group (Harvesting)</p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex justify-between"><span>Count:</span> <strong>3 workers</strong></li>
                    <li className="flex justify-between"><span>Distance:</span> <strong>2.0 km</strong></li>
                    <li className="flex justify-between"><span>Rate:</span> <strong>₹450/day</strong></li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between bg-ivory-300 p-6 rounded-xl border border-ivory-400">
                <div>
                  <p className="text-sm text-gray-600 uppercase font-bold tracking-wider">Estimated Total Cost</p>
                  <p className="text-4xl font-black text-forest-900">₹4,800</p>
                </div>
                <Button size="lg" className="px-10 py-4 text-xl shadow-lg hover:-translate-y-1 transition-transform">
                  BOOK COMBINATION NOW
                </Button>
              </div>
            </Card>
            
            <div className="text-center">
              <Button variant="outline" onClick={() => setStep('BEFORE')}>Run Another Scenario</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceDecisionDemo;
