import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  RotateCcw, 
  ShieldCheck, 
  Droplet,
  FileText,
  ShieldAlert
} from 'lucide-react';
import { CropHealth } from '../../services/types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ConfidenceBadge } from '../advisory/ConfidenceBadge';
import { useLanguage } from '../../context/LanguageContext';

export interface AnalysisResultProps {
  diagnosis: any;
  onReset: () => void;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ diagnosis, onReset }) => {
  const { t } = useLanguage();

  const isHealthy = diagnosis.health_status === 'HEALTHY';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner Card */}
      <Card
        variant="default"
        padding="lg"
        className="border-amber-400/40 bg-gradient-to-br from-white to-amber-50/20"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-ivory-300">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-100 border border-amber-300 text-amber-900 shrink-0">
              <AlertTriangle className="w-7 h-7 text-amber-700" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900">
                {t.cropHealth.analysisComplete}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-charcoal-950 mt-0.5">
                {diagnosis.crop_name} • {diagnosis.disease_name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="danger" size="md">
              HIGH RISK
            </Badge>
            <ConfidenceBadge score={diagnosis.disease_probability} size="md" />
          </div>
        </div>

        {/* Core Diagnosis Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-5">
          {/* Leaf Photo Preview */}
          <div className="rounded-2xl overflow-hidden border border-ivory-300 bg-charcoal-900 max-h-72 flex items-center justify-center">
            <img
              src={diagnosis.image_url}
              alt="Analyzed Crop Leaf"
              className="w-full h-full object-cover max-h-72"
            />
          </div>

          {/* Actionable Recommendations */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950">
              <span className="text-xs font-bold text-amber-900 uppercase block mb-1">
                {t.cropHealth.recommendedAction}
              </span>
              <p className="text-sm sm:text-base font-bold text-charcoal-900 leading-relaxed">
                {diagnosis.recommended_action}
              </p>
            </div>

            {/* Observed Symptoms */}
            {diagnosis.symptoms && (
              <div>
                <span className="text-xs font-bold text-charcoal-700 uppercase block mb-1.5">
                  {t.cropHealth.symptoms}
                </span>
                <ul className="space-y-1.5 text-xs sm:text-sm text-charcoal-800">
                  {diagnosis.symptoms.map((sym: any, idx: any) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                      <span>{sym}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Treatment Protocol */}
            {diagnosis.treatment && (
              <div className="pt-2">
                <span className="text-xs font-bold text-forest-900 uppercase block mb-1.5">
                  {t.cropHealth.treatment}
                </span>
                <ul className="space-y-1.5 text-xs sm:text-sm text-charcoal-800">
                  {diagnosis.treatment.map((tr: any, idx: any) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
                      <span>{tr}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Footer & Reset Action */}
        <div className="mt-6 pt-4 border-t border-ivory-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-charcoal-500">
          <p>
            Diagnosed via {diagnosis.source}
          </p>

          <Button
            variant="secondary"
            size="md"
            onClick={onReset}
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            {t.cropHealth.scanAnother}
          </Button>
        </div>
      </Card>
    </div>
  );
};
