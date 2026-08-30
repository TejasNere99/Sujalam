import React from 'react';
import { MapPin, Sprout, Layers, Droplets, Calendar, Edit3, ShieldCheck } from 'lucide-react';
import { Farm, FarmCrop } from '../../services/types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useLanguage } from '../../context/LanguageContext';

export interface FarmSummaryProps {
  farm: any;
  crop: any;
  onEditClick?: () => void;
}

export const FarmSummary: React.FC<FarmSummaryProps> = ({ farm, crop, onEditClick }) => {
  const { t } = useLanguage();

  return (
    <Card variant="default" padding="lg" className="border-forest-900/10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-ivory-300">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-forest-900 text-ivory-100 flex items-center justify-center font-bold text-xl shadow-subtle shrink-0">
            <Sprout className="w-6 h-6 text-gold-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-charcoal-950">
                {farm.name}
              </h2>
              <Badge variant="forest" size="sm">
                Verified
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-charcoal-600 flex items-center gap-1.5 mt-0.5 font-medium">
              <MapPin className="w-4 h-4 text-forest-700 shrink-0" />
              <span>{farm.location_name}</span>
            </p>
          </div>
        </div>

        {onEditClick && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onEditClick}
            leftIcon={<Edit3 className="w-4 h-4" />}
          >
            {t.farm.editFarm}
          </Button>
        )}
      </div>

      {/* Grid of Farm Profile Specs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-5">
        <div className="p-3.5 rounded-xl bg-ivory-100/70 border border-ivory-300/80">
          <span className="text-[11px] font-bold text-charcoal-500 uppercase tracking-wider block">
            {t.farm.landArea}
          </span>
          <p className="text-base sm:text-lg font-extrabold text-charcoal-900 mt-1">
            {farm.area_acres} Acres
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-ivory-100/70 border border-ivory-300/80">
          <span className="text-[11px] font-bold text-charcoal-500 uppercase tracking-wider block">
            Primary Crop
          </span>
          <p className="text-base sm:text-lg font-extrabold text-forest-900 mt-1">
            {crop.crop_name}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-ivory-100/70 border border-ivory-300/80">
          <span className="text-[11px] font-bold text-charcoal-500 uppercase tracking-wider block">
            {t.farm.soilType}
          </span>
          <p className="text-xs sm:text-sm font-bold text-charcoal-900 mt-1 truncate" title={farm.soil_type}>
            {farm.soil_type}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-ivory-100/70 border border-ivory-300/80">
          <span className="text-[11px] font-bold text-charcoal-500 uppercase tracking-wider block">
            {t.farm.irrigationSource}
          </span>
          <p className="text-xs sm:text-sm font-bold text-charcoal-900 mt-1 truncate" title={farm.irrigation_type}>
            {farm.irrigation_type}
          </p>
        </div>
      </div>
    </Card>
  );
};
