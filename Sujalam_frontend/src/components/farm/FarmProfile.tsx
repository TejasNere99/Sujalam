import React, { useState } from 'react';
import { Farm, FarmCrop } from '../../services/types';
import { FarmSummary } from './FarmSummary';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useLanguage } from '../../context/LanguageContext';
import { Calendar, Sprout, Layers, Droplets, MapPin, CheckCircle2 } from 'lucide-react';

export interface FarmProfileProps {
  farm: any;
  crop: any;
  onSave: (farm: Partial<Farm>, crop: Partial<FarmCrop>) => Promise<void>;
}

export const FarmProfile: React.FC<FarmProfileProps> = ({ farm, crop, onSave }) => {
  const { t } = useLanguage();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form edit states
  const [formData, setFormData] = useState({
    name: farm.name,
    location_name: farm.location_name,
    area_acres: farm.area_acres,
    soil_type: farm.soil_type,
    irrigation_type: farm.irrigation_type,
    crop_name: crop.crop_name,
    variety: crop.variety,
    sowing_date: crop.sowing_date,
    growth_stage: crop.growth_stage,
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave(
      {
        name: formData.name,
        location_name: formData.location_name,
        area_acres: Number(formData.area_acres),
        soil_type: formData.soil_type,
        irrigation_type: formData.irrigation_type,
      },
      {
        crop_name: formData.crop_name,
        variety: formData.variety,
        sowing_date: formData.sowing_date,
        growth_stage: formData.growth_stage,
      }
    );
    setIsSaving(false);
    setIsEditOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Farm Summary Card */}
      <FarmSummary farm={farm} crop={crop} onEditClick={() => setIsEditOpen(true)} />

      {/* Two-Column Deep Profile Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Farm Infrastructure */}
        <Card variant="default" padding="md" className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-ivory-300">
            <Layers className="w-5 h-5 text-forest-800" />
            <h3 className="text-base font-bold text-charcoal-900">{t.farm.farmDetails}</h3>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-1.5 border-b border-ivory-200">
              <span className="text-charcoal-600 font-medium">Farm Name</span>
              <span className="font-bold text-charcoal-900">{farm.name}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-ivory-200">
              <span className="text-charcoal-600 font-medium">{t.farm.landArea}</span>
              <span className="font-bold text-charcoal-900">{farm.area_acres} Acres</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-ivory-200">
              <span className="text-charcoal-600 font-medium">{t.farm.soilType}</span>
              <span className="font-bold text-charcoal-900 text-right">{farm.soil_type}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-ivory-200">
              <span className="text-charcoal-600 font-medium">{t.farm.irrigationSource}</span>
              <span className="font-bold text-charcoal-900 text-right">{farm.irrigation_type}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-charcoal-600 font-medium">Coordinates</span>
              <span className="font-mono text-xs text-charcoal-700">{farm.latitude}°N, {farm.longitude}°E</span>
            </div>
          </div>
        </Card>

        {/* Active Crop Cycle */}
        <Card variant="default" padding="md" className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-ivory-300">
            <Sprout className="w-5 h-5 text-forest-800" />
            <h3 className="text-base font-bold text-charcoal-900">{t.farm.cropDetails}</h3>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-1.5 border-b border-ivory-200">
              <span className="text-charcoal-600 font-medium">Active Commodity</span>
              <span className="font-bold text-forest-900">{crop.crop_name}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-ivory-200">
              <span className="text-charcoal-600 font-medium">{t.farm.variety}</span>
              <span className="font-bold text-charcoal-900">{crop.variety}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-ivory-200">
              <span className="text-charcoal-600 font-medium">{t.farm.sowingDate}</span>
              <span className="font-bold text-charcoal-900">{crop.sowing_date}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-ivory-200">
              <span className="text-charcoal-600 font-medium">{t.farm.growthStage}</span>
              <span className="font-bold text-forest-900 text-right">{crop.growth_stage}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-charcoal-600 font-medium">Crop Rotation History</span>
              <span className="text-xs text-charcoal-700 text-right max-w-[200px] truncate">{crop.crop_history}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Edit Farm Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title={t.farm.editFarm}
        subtitle="Update farm acreage, crop variety, or soil parameters"
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase mb-1">
                Farm Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-400 bg-ivory-50 text-sm font-semibold focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase mb-1">
                {t.onboarding.acresLabel}
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.area_acres}
                onChange={(e) => setFormData({ ...formData, area_acres: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-400 bg-ivory-50 text-sm font-semibold focus:bg-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase mb-1">
                Primary Crop
              </label>
              <input
                type="text"
                value={formData.crop_name}
                onChange={(e) => setFormData({ ...formData, crop_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-400 bg-ivory-50 text-sm font-semibold focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase mb-1">
                {t.farm.variety}
              </label>
              <input
                type="text"
                value={formData.variety}
                onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-400 bg-ivory-50 text-sm font-semibold focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase mb-1">
                {t.farm.soilType}
              </label>
              <select
                value={formData.soil_type}
                onChange={(e) => setFormData({ ...formData, soil_type: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-400 bg-ivory-50 text-sm font-semibold focus:bg-white"
              >
                <option value="Medium to Deep Black Cotton Soil (Regur)">Black Cotton Soil (Regur)</option>
                <option value="Red Sandy Loam Soil">Red Sandy Loam Soil</option>
                <option value="Alluvial Soil">Alluvial Soil</option>
                <option value="Laterite Soil">Laterite Soil</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase mb-1">
                {t.farm.irrigationSource}
              </label>
              <select
                value={formData.irrigation_type}
                onChange={(e) => setFormData({ ...formData, irrigation_type: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-400 bg-ivory-50 text-sm font-semibold focus:bg-white"
              >
                <option value="Borewell with Micro-Drip System">Borewell + Drip</option>
                <option value="Canal Water Flow">Canal Water Flow</option>
                <option value="Open Well & Sprinkler">Open Well + Sprinkler</option>
                <option value="Rainfed (Monsoon Only)">Rainfed (Monsoon Only)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-ivory-300 flex justify-end gap-2.5">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => setIsEditOpen(false)}
            >
              {t.farm.cancel}
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSaving}
            >
              {t.farm.saveChanges}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
