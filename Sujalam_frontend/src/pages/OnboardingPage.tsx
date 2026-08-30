import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  MapPin, 
  Layers, 
  Droplets, 
  Calendar, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { farmApi } from '../services/farmApi';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { LanguageSwitcher } from '../components/layout/LanguageSwitcher';

export const OnboardingPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Wizard state: 1 to 8
  const [step, setStep] = useState(1);
  const totalSteps = 8;

  const [farmData, setFarmData] = useState({
    state: 'Maharashtra',
    district: 'Yavatmal',
    location_name: 'Yavatmal, Vidarbha, Maharashtra',
    latitude: '20.3888',
    longitude: '78.1204',
    area_acres: 2.5,
    crop_name: 'Cotton',
    variety: 'Bt Cotton (RCH-659)',
    sowing_date: '2026-06-18',
    growth_stage: 'Flowering & Boll Formation',
    soil_type: 'Medium to Deep Black Cotton Soil (Regur)',
    irrigation_type: 'Borewell with Micro-Drip System',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const handleFetchCoordinates = async () => {
    setIsFetchingLocation(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${farmData.district},${farmData.state}`);
      const data = await response.json();
      if (data && data.length > 0) {
        setFarmData(prev => ({
          ...prev,
          latitude: parseFloat(data[0].lat).toFixed(4),
          longitude: parseFloat(data[0].lon).toFixed(4),
        }));
      } else {
        alert("Could not find exact coordinates for this district. Please enter manually.");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    } finally {
      setIsFetchingLocation(false);
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = async () => {
    setIsGenerating(true);
    try {
      const newFarm = await farmApi.createFarm({
        name: 'My Farm',
        location_name: farmData.location_name,
        latitude: parseFloat(farmData.latitude),
        longitude: parseFloat(farmData.longitude),
        area_acres: Number(farmData.area_acres),
        soil_type: farmData.soil_type,
        irrigation_type: farmData.irrigation_type,
      });

      const farmId = newFarm.id || (newFarm as any)._id;

      await farmApi.createCrop(farmId, {
        crop_name: farmData.crop_name,
        variety: farmData.variety,
        sowing_date: farmData.sowing_date,
        growth_stage: farmData.growth_stage,
      });
      navigate('/dashboard');
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory-200 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header with step progress */}
      <div className="max-w-3xl mx-auto w-full flex items-center justify-between pb-4 border-b border-ivory-300">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-forest-900 text-white flex items-center justify-center font-bold">
            <Sprout className="w-5 h-5 text-gold-400" />
          </div>
          <span className="font-extrabold text-lg text-forest-950">{t.brandName}</span>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Badge variant="forest" size="sm">
            Step {step} of {totalSteps}
          </Badge>
        </div>
      </div>

      {/* Main Wizard Container */}
      <div className="flex-1 flex items-center justify-center my-6">
        <div className="bg-white rounded-3xl border border-ivory-300 shadow-elevated p-6 sm:p-10 max-w-2xl w-full">
          {/* Progress Bar */}
          <div className="w-full bg-ivory-300 h-1.5 rounded-full overflow-hidden mb-8">
            <div
              className="bg-forest-900 h-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>

          {/* STEP 1: WELCOME */}
          {step === 1 && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-forest-50 border border-forest-200 text-forest-900 mx-auto flex items-center justify-center shadow-subtle">
                <Sprout className="w-8 h-8 text-forest-800" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-950">
                  {t.onboarding.welcomeTitle}
                </h2>
                <p className="text-sm sm:text-base text-charcoal-600 max-w-md mx-auto">
                  {t.onboarding.welcomeSub}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-forest-50 border border-forest-200 text-left text-xs sm:text-sm text-forest-900">
                <p className="font-bold mb-1">We will ask 6 simple questions:</p>
                <p className="text-forest-800 font-medium">Location • Farm Size • Crop • Sowing Date • Soil Type • Irrigation Source</p>
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-forest-800 uppercase tracking-wider block">Question 1</span>
                <h2 className="text-2xl font-extrabold text-charcoal-950 mt-1">{t.onboarding.stepLocationTitle}</h2>
                <p className="text-xs sm:text-sm text-charcoal-600 mt-1">{t.onboarding.stepLocationDesc}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 uppercase mb-1.5">{t.onboarding.stateLabel}</label>
                  <select
                    value={farmData.state}
                    onChange={(e) => setFarmData({ ...farmData, state: e.target.value })}
                    className="w-full p-3 rounded-xl border border-ivory-400 bg-ivory-50 text-sm font-bold text-charcoal-900 focus:bg-white"
                  >
                    <option value="Maharashtra">Maharashtra (महाराष्ट्र)</option>
                    <option value="Madhya Pradesh">Madhya Pradesh (मध्य प्रदेश)</option>
                    <option value="Gujarat">Gujarat (ગુજરાત)</option>
                    <option value="Telangana">Telangana (తెలంగాణ)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 uppercase mb-1.5">{t.onboarding.districtLabel}</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={farmData.district}
                      onChange={(e) =>
                        setFarmData({
                          ...farmData,
                          district: e.target.value,
                          location_name: `${e.target.value}, ${farmData.state}`,
                        })
                      }
                      placeholder="e.g. Yavatmal / Darwha"
                      className="w-full p-3 rounded-xl border border-ivory-400 bg-ivory-50 text-sm font-bold text-charcoal-900 focus:bg-white"
                    />
                    <Button 
                      type="button" 
                      variant="secondary" 
                      onClick={handleFetchCoordinates}
                      isLoading={isFetchingLocation}
                      className="whitespace-nowrap"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Auto-detect
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-charcoal-700 uppercase mb-1.5">Latitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={farmData.latitude}
                      onChange={(e) => setFarmData({ ...farmData, latitude: e.target.value })}
                      placeholder="e.g. 20.3888"
                      className="w-full p-3 rounded-xl border border-ivory-400 bg-ivory-50 text-sm font-bold text-charcoal-900 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-charcoal-700 uppercase mb-1.5">Longitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={farmData.longitude}
                      onChange={(e) => setFarmData({ ...farmData, longitude: e.target.value })}
                      placeholder="e.g. 78.1204"
                      className="w-full p-3 rounded-xl border border-ivory-400 bg-ivory-50 text-sm font-bold text-charcoal-900 focus:bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: FARM SIZE */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-forest-800 uppercase tracking-wider block">Question 2</span>
                <h2 className="text-2xl font-extrabold text-charcoal-950 mt-1">{t.onboarding.stepSizeTitle}</h2>
                <p className="text-xs sm:text-sm text-charcoal-600 mt-1">{t.onboarding.stepSizeDesc}</p>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  {[1.0, 2.5, 5.0].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setFarmData({ ...farmData, area_acres: size })}
                      className={`p-4 rounded-2xl border text-center font-bold transition-all ${
                        farmData.area_acres === size
                          ? 'border-forest-900 bg-forest-50 text-forest-900 ring-2 ring-forest-900/20'
                          : 'border-ivory-400 bg-ivory-50 text-charcoal-800 hover:bg-white'
                      }`}
                    >
                      <span className="text-xl block">{size}</span>
                      <span className="text-xs text-charcoal-500 font-medium">Acres</span>
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-bold text-charcoal-700 uppercase mb-1.5">Or enter exact acres:</label>
                  <input
                    type="number"
                    step="0.1"
                    value={farmData.area_acres}
                    onChange={(e) => setFarmData({ ...farmData, area_acres: Number(e.target.value) })}
                    className="w-full p-3 rounded-xl border border-ivory-400 bg-ivory-50 text-sm font-bold text-charcoal-900 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: CROP */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-forest-800 uppercase tracking-wider block">Question 3</span>
                <h2 className="text-2xl font-extrabold text-charcoal-950 mt-1">{t.onboarding.stepCropTitle}</h2>
                <p className="text-xs sm:text-sm text-charcoal-600 mt-1">{t.onboarding.stepCropDesc}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Cotton', sub: 'कपास / कापूस' },
                  { name: 'Soybean', sub: 'सोयाबीन' },
                  { name: 'Pigeon Pea (Tur)', sub: 'अरहर / तूर' },
                  { name: 'Wheat / Gram', sub: 'गेहूं / चना' },
                ].map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setFarmData({ ...farmData, crop_name: c.name })}
                    className={`p-4 rounded-2xl border text-left font-bold transition-all ${
                      farmData.crop_name === c.name
                        ? 'border-forest-900 bg-forest-50 text-forest-900 ring-2 ring-forest-900/20'
                        : 'border-ivory-400 bg-ivory-50 text-charcoal-800 hover:bg-white'
                    }`}
                  >
                    <span className="text-base block text-charcoal-950">{c.name}</span>
                    <span className="text-xs text-charcoal-500 font-medium">{c.sub}</span>
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <label className="block text-xs font-bold text-charcoal-700 uppercase mb-1.5">{t.onboarding.cropVarietyLabel}</label>
                <input
                  type="text"
                  value={farmData.variety}
                  onChange={(e) => setFarmData({ ...farmData, variety: e.target.value })}
                  placeholder="e.g. Bt Cotton RCH-659"
                  className="w-full p-3 rounded-xl border border-ivory-400 bg-ivory-50 text-sm font-bold text-charcoal-900 focus:bg-white"
                />
              </div>
            </div>
          )}

          {/* STEP 5: SOWING DATE & STAGE */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-forest-800 uppercase tracking-wider block">Question 4</span>
                <h2 className="text-2xl font-extrabold text-charcoal-950 mt-1">{t.onboarding.stepSowingTitle}</h2>
                <p className="text-xs sm:text-sm text-charcoal-600 mt-1">{t.onboarding.stepSowingDesc}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 uppercase mb-1.5">{t.onboarding.sowingDateLabel}</label>
                  <input
                    type="date"
                    value={farmData.sowing_date}
                    onChange={(e) => setFarmData({ ...farmData, sowing_date: e.target.value })}
                    className="w-full p-3 rounded-xl border border-ivory-400 bg-ivory-50 text-sm font-bold text-charcoal-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 uppercase mb-1.5">{t.onboarding.growthStageLabel}</label>
                  <select
                    value={farmData.growth_stage}
                    onChange={(e) => setFarmData({ ...farmData, growth_stage: e.target.value })}
                    className="w-full p-3 rounded-xl border border-ivory-400 bg-ivory-50 text-sm font-bold text-charcoal-900 focus:bg-white"
                  >
                    <option value="Flowering & Boll Formation">Flowering & Boll Formation (फूल व बोंड धारणा)</option>
                    <option value="Vegetative Stage">Vegetative Stage (वाढ अवस्था)</option>
                    <option value="Seedling / Germination">Seedling / Germination (उगवण अवस्था)</option>
                    <option value="Maturity & Boll Bursting">Maturity & Boll Bursting (परिपक्वता अवस्था)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: SOIL */}
          {step === 6 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-forest-800 uppercase tracking-wider block">Question 5</span>
                <h2 className="text-2xl font-extrabold text-charcoal-950 mt-1">{t.onboarding.stepSoilTitle}</h2>
                <p className="text-xs sm:text-sm text-charcoal-600 mt-1">{t.onboarding.stepSoilDesc}</p>
              </div>

              <div className="space-y-2.5">
                {[
                  { name: 'Medium to Deep Black Cotton Soil (Regur)', desc: 'High water retention, ideal for cotton' },
                  { name: 'Red Sandy Loam Soil', desc: 'Fast draining, needs regular moisture' },
                  { name: 'Alluvial River Basin Soil', desc: 'Rich in organic nutrients' },
                  { name: 'Laterite / Clay Loam', desc: 'Moderate retention' },
                ].map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => setFarmData({ ...farmData, soil_type: s.name })}
                    className={`w-full p-3.5 rounded-2xl border text-left font-bold transition-all ${
                      farmData.soil_type === s.name
                        ? 'border-forest-900 bg-forest-50 text-forest-900 ring-2 ring-forest-900/20'
                        : 'border-ivory-400 bg-ivory-50 text-charcoal-800 hover:bg-white'
                    }`}
                  >
                    <span className="text-sm block text-charcoal-950">{s.name}</span>
                    <span className="text-xs text-charcoal-500 font-normal">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 7: IRRIGATION */}
          {step === 7 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-forest-800 uppercase tracking-wider block">Question 6</span>
                <h2 className="text-2xl font-extrabold text-charcoal-950 mt-1">{t.onboarding.stepIrrigationTitle}</h2>
                <p className="text-xs sm:text-sm text-charcoal-600 mt-1">{t.onboarding.stepIrrigationDesc}</p>
              </div>

              <div className="space-y-2.5">
                {[
                  { name: 'Borewell with Micro-Drip System', desc: 'Precise root-zone application' },
                  { name: 'Open Well with Sprinkler', desc: 'Surface spraying' },
                  { name: 'Canal Flood Irrigation', desc: 'Periodic gravitational flow' },
                  { name: 'Rainfed (Monsoon Dependent)', desc: 'Dependent on seasonal rainfall' },
                ].map((irr) => (
                  <button
                    key={irr.name}
                    type="button"
                    onClick={() => setFarmData({ ...farmData, irrigation_type: irr.name })}
                    className={`w-full p-3.5 rounded-2xl border text-left font-bold transition-all ${
                      farmData.irrigation_type === irr.name
                        ? 'border-forest-900 bg-forest-50 text-forest-900 ring-2 ring-forest-900/20'
                        : 'border-ivory-400 bg-ivory-50 text-charcoal-800 hover:bg-white'
                    }`}
                  >
                    <span className="text-sm block text-charcoal-950">{irr.name}</span>
                    <span className="text-xs text-charcoal-500 font-normal">{irr.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 8: REVIEW & GENERATE PLAN */}
          {step === 8 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-forest-800 uppercase tracking-wider block">Final Step</span>
                <h2 className="text-2xl font-extrabold text-charcoal-950 mt-1">{t.onboarding.stepReviewTitle}</h2>
                <p className="text-xs sm:text-sm text-charcoal-600 mt-1">{t.onboarding.stepReviewDesc}</p>
              </div>

              <div className="p-4 rounded-2xl bg-ivory-100 border border-ivory-300 space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between py-1 border-b border-ivory-200">
                  <span className="text-charcoal-600">Location:</span>
                  <span className="font-bold text-charcoal-900">{farmData.location_name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-ivory-200">
                  <span className="text-charcoal-600">Farm Area:</span>
                  <span className="font-bold text-charcoal-900">{farmData.area_acres} Acres</span>
                </div>
                <div className="flex justify-between py-1 border-b border-ivory-200">
                  <span className="text-charcoal-600">Crop & Stage:</span>
                  <span className="font-bold text-forest-900">{farmData.crop_name} ({farmData.growth_stage})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-ivory-200">
                  <span className="text-charcoal-600">Soil:</span>
                  <span className="font-bold text-charcoal-900">{farmData.soil_type}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-charcoal-600">Irrigation:</span>
                  <span className="font-bold text-charcoal-900">{farmData.irrigation_type}</span>
                </div>
              </div>
            </div>
          )}

          {/* Wizard Navigation Controls */}
          <div className="mt-8 pt-6 border-t border-ivory-300 flex items-center justify-between">
            {step > 1 ? (
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={handleBack}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                {t.onboarding.backBtn}
              </Button>
            ) : (
              <div />
            )}

            <Button
              type="button"
              variant={step === totalSteps ? 'gold' : 'primary'}
              size="lg"
              onClick={handleNext}
              isLoading={isGenerating}
              rightIcon={step === totalSteps ? <Sparkles className="w-5 h-5" /> : <ArrowRight className="w-4 h-4" />}
            >
              {step === totalSteps ? t.onboarding.generatePlanBtn : t.onboarding.nextBtn}
            </Button>
          </div>
        </div>
      </div>

      <footer className="max-w-3xl mx-auto w-full text-center text-xs text-charcoal-500 pt-2">
        Sujalam 2.0 • Farmer Decision Intelligence
      </footer>
    </div>
  );
};
