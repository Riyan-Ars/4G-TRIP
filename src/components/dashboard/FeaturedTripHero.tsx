import React from 'react';
import { Calendar, Users, ArrowRight, Settings2, MapPin } from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { useNavigate } from 'react-router-dom';

interface FeaturedTripHeroProps {
  onEditTrip: () => void;
}

export const FeaturedTripHero: React.FC<FeaturedTripHeroProps> = ({ onEditTrip }) => {
  const { trip, members, financialSummary, itinerary } = useTrip();
  const navigate = useNavigate();

  return (
    <div className="workspace-card overflow-hidden relative group flex flex-col justify-between min-h-[260px] md:min-h-[290px] p-5 md:p-6 bg-surface border-border">
      {/* Background panoramic image with deep navy layered gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={trip.cover_image_url || '/images/malaysia-hero.jpg'}
          alt={trip.name}
          className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700 brightness-[0.72] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-surface/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-surface/60 to-transparent" />
      </div>

      {/* Top Floating Badge & Action */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="pill-badge bg-surface-elevated/90 text-brand-teal border border-white/10 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-teal" />
            <span>Active Trip</span>
          </span>
          <span className="text-[11px] text-text-secondary hidden sm:inline-flex items-center gap-1 backdrop-blur-md px-2.5 py-0.5 rounded-full bg-surface/60 border border-white/5">
            <MapPin className="w-3 h-3 text-brand-blue" />
            <span>{trip.origin} → {trip.destination}</span>
          </span>
        </div>

        <button
          onClick={onEditTrip}
          className="w-8 h-8 rounded-full bg-surface-elevated/80 hover:bg-surface-elevated text-text-secondary hover:text-text-primary backdrop-blur-md border border-white/10 flex items-center justify-center transition-colors"
          title="Trip Settings"
        >
          <Settings2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bottom Content & Restrained Typography */}
      <div className="relative z-10 mt-auto pt-8">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-medium text-brand-blue tracking-wide">
            {trip.destination} Expedition
          </span>
          <span className="text-text-muted text-xs">•</span>
          <span className="text-xs text-text-secondary">
            {itinerary.length} Curated Activities
          </span>
        </div>

        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-text-primary tracking-tight leading-snug mb-2">
          {trip.name}
        </h2>

        <p className="text-xs md:text-sm text-text-secondary max-w-xl leading-relaxed mb-4 line-clamp-2">
          A 4D3N shared journey from {trip.origin} exploring Kuala Lumpur skyline, Batu Caves limestone cliffs, Bukit Bintang night markets, and authentic cultural heritage.
        </p>

        {/* Bottom Metadata & Primary Action Pill Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="pill-badge bg-surface-secondary/80 text-text-secondary border border-white/5 text-[11px]">
              <Calendar className="w-3 h-3 text-brand-blue" />
              <span>{trip.departure_date || '4 Days, 3 Nights'}</span>
            </span>

            <span className="pill-badge bg-surface-secondary/80 text-text-secondary border border-white/5 text-[11px]">
              <Users className="w-3 h-3 text-brand-teal" />
              <span>{members.length} Travelers</span>
            </span>

            <span className="pill-badge bg-brand-teal/15 text-brand-teal border border-brand-teal/30 text-[11px]">
              <span>{financialSummary.savings_progress_percentage}% Funded</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/trip-planner')}
              className="px-3.5 py-1.5 rounded-full bg-brand-accent hover:bg-blue-400 text-background text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <span>Explore Itinerary</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onEditTrip}
              className="px-3 py-1.5 rounded-full bg-surface-elevated hover:bg-surface-hover text-text-secondary hover:text-text-primary border border-border text-xs font-medium transition-colors"
            >
              Edit Dates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
