import React from 'react';
import { MapPin, Plus, Heart, Eye } from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { useNavigate } from 'react-router-dom';

export const DestinationStackCard: React.FC = () => {
  const { destinations, addDestinationToItinerary } = useTrip();
  const navigate = useNavigate();

  // Top 3 destinations for overlapping stack
  const stackItems = destinations.slice(0, 3);

  return (
    <div className="workspace-card p-5 bg-card flex flex-col justify-between overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-brand-mint" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Curated Highlights
          </h3>
        </div>
        <button
          onClick={() => navigate('/destinations')}
          className="text-[11px] text-brand-mint hover:underline font-semibold"
        >
          View All ({destinations.length})
        </button>
      </div>

      {/* Overlapping Cards Stack (reproduces reference visual aesthetic) */}
      <div className="relative h-44 my-2 flex items-center justify-center">
        {stackItems.map((dest, index) => {
          // Positions and tilts
          const configs = [
            { translate: '-translate-x-16 rotate-[-6deg]', zIndex: 10, scale: 'scale-90' },
            { translate: 'translate-x-0 rotate-0', zIndex: 20, scale: 'scale-100' },
            { translate: 'translate-x-16 rotate-[6deg]', zIndex: 15, scale: 'scale-95' },
          ];
          const cfg = configs[index] || configs[1];

          return (
            <div
              key={dest.id}
              onClick={() => navigate('/destinations')}
              className={`absolute w-36 sm:w-40 h-40 rounded-2xl overflow-hidden border border-white/20 shadow-2xl transition-all duration-300 hover:scale-105 hover:z-30 cursor-pointer group ${cfg.translate} ${cfg.scale}`}
              style={{ zIndex: cfg.zIndex }}
            >
              <img
                src={dest.image_url}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-2.5">
                <span className="text-[11px] font-bold text-white truncate drop-shadow">
                  {dest.name}
                </span>
                <span className="text-[9px] text-brand-mint font-medium capitalize">
                  {dest.category}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="pt-2 flex items-center justify-between border-t border-card-border/60 text-xs">
        <span className="text-[11px] text-text-muted">Click any photo to explore</span>
        <button
          onClick={() => addDestinationToItinerary(destinations[0]?.id || '', 2)}
          className="px-2.5 py-1 rounded-full bg-card-secondary hover:bg-card-border border border-card-border text-white text-[10px] font-semibold flex items-center gap-1 transition-colors"
        >
          <Plus className="w-3 h-3 text-brand-mint" />
          <span>Add to Day 2</span>
        </button>
      </div>
    </div>
  );
};
