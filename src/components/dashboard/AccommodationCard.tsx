import React from 'react';
import { ArrowRight, Star, Building2, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AccommodationCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="workspace-card p-3.5 bg-card flex flex-col sm:flex-row items-center gap-4 group hover:border-brand-mint/40 transition-all">
      {/* Photo on left */}
      <div className="w-full sm:w-44 h-32 rounded-xl overflow-hidden shrink-0 relative border border-white/10">
        <img
          src="/images/kl-hotel.jpg"
          alt="Nomad Villa and Hotel"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-amber-400 flex items-center gap-1 border border-white/10">
          <Star className="w-2.5 h-2.5 fill-current" />
          <span>4.9</span>
        </div>
      </div>

      {/* Details on right */}
      <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-1">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] text-text-secondary uppercase tracking-wider mb-1">
            <Building2 className="w-3 h-3 text-brand-mint" />
            <span>Bukit Bintang • Luxury Residence</span>
          </div>

          <h4 className="text-base font-bold text-white tracking-tight truncate">
            Nomad Suite & Skyline Pool
          </h4>

          <p className="text-xs text-text-secondary line-clamp-2 mt-1">
            Exclusive high-rise 3-bedroom suite with infinity pool overlooking the Petronas Towers.
          </p>
        </div>

        <div className="mt-3 pt-2 flex items-center justify-between border-t border-card-border/60">
          <div className="text-xs">
            <span className="text-white font-bold">Rp1.350.000</span>
            <span className="text-[10px] text-text-muted"> / night total</span>
          </div>

          <button
            onClick={() => navigate('/trip-planner')}
            className="px-3.5 py-1.5 rounded-full bg-card-secondary hover:bg-card-border border border-card-border text-white text-xs font-semibold flex items-center gap-1.5 transition-colors group-hover:border-brand-mint/60 group-hover:text-brand-mint"
          >
            <span>Check Availability</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
