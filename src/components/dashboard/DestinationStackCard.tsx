import React from 'react';
import { MapPin, Plus, ArrowRight } from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { useNavigate } from 'react-router-dom';

export const DestinationStackCard: React.FC = () => {
  const { destinations } = useTrip();
  const navigate = useNavigate();

  // Top 3 destinations for overlapping stack
  const stackItems = destinations.slice(0, 3);

  return (
    <div className="workspace-card p-5 bg-surface flex flex-col justify-between overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-brand-blue" />
          <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
            Curated Highlights
          </h3>
        </div>
        <button
          onClick={() => navigate('/destinations')}
          className="text-[11px] text-brand-blue hover:underline font-medium"
        >
          View All ({destinations.length})
        </button>
      </div>

      {/* Overlapping Cards Stack with refined subtle elevations */}
      <div className="relative h-40 my-2 flex items-center justify-center">
        {stackItems.map((dest, index) => {
          const configs = [
            { translate: '-translate-x-12 rotate-[-4deg]', zIndex: 10, scale: 'scale-95' },
            { translate: 'translate-x-0 rotate-0', zIndex: 20, scale: 'scale-100' },
            { translate: 'translate-x-12 rotate-[4deg]', zIndex: 15, scale: 'scale-95' },
          ];
          const cfg = configs[index] || configs[1];

          return (
            <div
              key={dest.id}
              onClick={() => navigate('/destinations')}
              className={`absolute w-36 sm:w-40 h-36 rounded-xl overflow-hidden border border-border shadow-elevated transition-transform duration-300 hover:scale-105 hover:z-30 cursor-pointer group ${cfg.translate} ${cfg.scale}`}
              style={{ zIndex: cfg.zIndex }}
            >
              <img
                src={dest.image_url}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent flex flex-col justify-end p-2.5">
                <span className="text-[11px] font-semibold text-text-primary truncate">
                  {dest.name}
                </span>
                <span className="text-[9px] text-brand-blue font-medium capitalize mt-0.5">
                  {dest.category}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="pt-2 flex items-center justify-between border-t border-border/60 text-xs">
        <span className="text-[11px] text-text-muted">Kuala Lumpur Landmarks</span>
        <button
          onClick={() => navigate('/destinations')}
          className="text-[11px] font-medium text-brand-blue hover:underline flex items-center gap-1 transition-colors"
        >
          <span>Explore</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
