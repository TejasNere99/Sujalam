import React from 'react';
import { Users, Phone, MapPin, CheckCircle2, Navigation, MessageCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { FPO } from '../../services/types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useLanguage } from '../../context/LanguageContext';

export interface FPOCardProps {
  fpo: FPO;
}

export const FPOCard: React.FC<FPOCardProps> = ({ fpo }) => {
  const { t } = useLanguage();
  const locationText = [fpo.village, fpo.district, fpo.state].filter(Boolean).join(', ');

  return (
    <Card variant="default" padding="lg" className="space-y-4 hover:shadow-elevated transition-shadow relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-ivory-300">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            {fpo.member_count !== null && fpo.member_count !== undefined && (
              <Badge variant="forest" size="sm">
                <Users className="w-3 h-3 mr-1" />
                {fpo.member_count} {t.schemes.members || 'Farmers'}
              </Badge>
            )}
            {fpo.distance_km !== null && fpo.distance_km !== undefined ? (
              <span className="text-xs text-forest-800 font-bold">
                {fpo.distance_km} km away
              </span>
            ) : (
              <span className="text-xs text-charcoal-500 font-bold">
                Distance unavailable
              </span>
            )}
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-charcoal-950">
            {fpo.name}
          </h3>
          <p className="text-xs text-charcoal-600 flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 text-forest-700 shrink-0" />
            <span>{locationText}</span>
          </p>
          {fpo.registration_number && (
            <p className="text-[10px] text-charcoal-500 font-mono mt-1 uppercase tracking-wider">
              REG: {fpo.registration_number}
            </p>
          )}
        </div>
      </div>

      {/* Services provided */}
      {fpo.services && fpo.services.length > 0 && (
        <div>
          <span className="text-xs font-bold text-charcoal-700 uppercase block mb-1.5">
            FPO Services & Farmer Benefits
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {fpo.services.map((srv, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-charcoal-800 bg-ivory-100 p-2 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                <span className="font-medium">{srv}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-ivory-200">
        {fpo.phone && (
          <a
            href={`tel:${fpo.phone}`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-forest-900 text-white hover:bg-forest-800 font-bold text-xs shadow-sm"
          >
            <Phone className="w-3.5 h-3.5 text-gold-300" />
            <span>Call</span>
          </a>
        )}
        
        {fpo.whatsapp && (
          <a
            href={`https://wa.me/${fpo.whatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-xs shadow-sm"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        )}

        {fpo.latitude !== null && fpo.longitude !== null && (
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${fpo.latitude},${fpo.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-ivory-200 text-charcoal-900 hover:bg-ivory-300 font-bold text-xs shadow-sm"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Directions</span>
          </a>
        )}

        {fpo.website && (
          <a
            href={fpo.website.startsWith('http') ? fpo.website : `https://${fpo.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-ivory-200 text-charcoal-900 hover:bg-ivory-300 font-bold text-xs shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Website</span>
          </a>
        )}
      </div>
      
      {/* Contact Person Details */}
      {fpo.contact_person && (
        <div className="pt-2 text-xs text-charcoal-600 flex items-center justify-between">
          <span>Representative: <strong>{fpo.contact_person}</strong></span>
        </div>
      )}

      {/* Official Data Provenance */}
      <div className="mt-4 p-2.5 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">Verified Official Source</span>
            <span className="text-xs text-blue-600">{fpo.source_name}</span>
          </div>
        </div>
        <a 
          href={fpo.source_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs font-bold text-blue-700 hover:text-blue-800 underline underline-offset-2 shrink-0"
        >
          View source
        </a>
      </div>
    </Card>
  );
};
