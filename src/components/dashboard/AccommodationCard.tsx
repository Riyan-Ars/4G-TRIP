import React from 'react';
import { ArrowRight, Star, Building2, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AccommodationCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="workspace-card p-4 bg-surface flex flex-col sm:flex-row items-center gap-4 group hover:border-border/80 transition-colors">
      {/* Photo on left */}
      <div className="w-full sm:w-40 h-28 rounded-xl overflow-hidden shrink-0 relative border border-white/10">
        <img
          src="/images/kl-hotel.jpg"
          alt="Nomad Villa and Hotel"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-background/80 backdrop-blur-md text-[10px] font-semibold text-brand-amber flex items-center gap-1 border border-white/10">
          <Star className="w-2.5 h-2.5 fill-current" />
          <span>4.9</span>
        </div>
      </div>

      {/* Details on right */}
      <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] text-text-muted uppercase tracking-wider mb-1">
            <Building2 className="w-3 h-3 text-brand-teal" />
            <span>Bukit Bintang • Group Residence</span>
          </div>

          <h4 className="text-sm font-bold text-text-primary tracking-tight truncate">
            Bukit Bintang Skyline Suite
          </h4>

          <p className="text-xs text-text-secondary line-clamp-2 mt-0.5">
            Centrally located 3-bedroom suite with infinity pool, 5 minutes walk to Pavilion and Jalan Alor.
          </p>
        </div>

        <div className="mt-3 pt-2 flex items-center justify-between border-t border-border/60">
          <div className="text-xs">
            <span className="text-text-primary font-bold">Rp1.350.000</span>
            <span className="text-[10px] text-text-muted"> / night total</span>
          </div>

          <button
            onClick={() => navigate('/trip-planner')}
            className="px-3 py-1 rounded-full bg-surface-secondary hover:bg-surface-elevated border border-border text-text-secondary hover:text-text-primary text-xs font-medium flex items-center gap-1 transition-colors"
          >
            <span>Details</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
