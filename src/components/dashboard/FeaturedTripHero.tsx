import React from 'react';
import { Calendar, Users, Compass, Maximize2, Sparkles, Edit3, ArrowRight } from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { useNavigate } from 'react-router-dom';

interface FeaturedTripHeroProps {
  onEditTrip: () => void;
}

export const FeaturedTripHero: React.FC<FeaturedTripHeroProps> = ({ onEditTrip }) => {
  const { trip, members } = useTrip();
  const navigate = useNavigate();

  return (
    <div className="workspace-card overflow-hidden relative group flex flex-col justify-between min-h-[340px] md:min-h-[380px] p-6 border-card-border bg-card">
      {/* Background panoramic image with deep gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={trip.cover_image_url || '/images/malaysia-hero.jpg'}
          alt={trip.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-[0.78] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/90 via-transparent to-transparent" />
      </div>

      {/* Top Floating Badge & Action */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-white/90 flex items-center gap-1.5 shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-mint animate-pulse" />
          <span>4 / 16 Activities</span>
        </div>

        <button
          onClick={onEditTrip}
          className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/10 text-white flex items-center justify-center transition-all hover:scale-105"
          title="Edit Trip Header"
        >
          <Maximize2 className="w-3.5 h-3.5 text-white/80" />
        </button>
      </div>

      {/* Bottom Content & Editorial Typography */}
      <div className="relative z-10 mt-auto pt-16">
        <div className="flex items-center gap-2 mb-2">
          <span className="pill-badge bg-brand-mint/20 text-brand-mint border border-brand-mint/30 uppercase tracking-widest text-[10px] font-bold">
            Flagship Itinerary
          </span>
          <span className="text-[11px] text-text-secondary">
            {trip.origin} ✈ {trip.destination}
          </span>
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight mb-2">
          {trip.name}
        </h2>

        <p className="text-xs md:text-sm text-text-secondary max-w-xl leading-relaxed mb-5 line-clamp-2">
          A 4D3N curated journey from {trip.origin} to {trip.destination} — sunrise views at KLCC, limestone cliffs at Batu Caves, bustling night markets, and authentic culinary adventures.
        </p>

        {/* Bottom Tags & Primary Action Pill Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="pill-badge bg-black/60 backdrop-blur-md text-white/90 border border-white/10 text-xs">
              <Calendar className="w-3.5 h-3.5 text-brand-blue" />
              <span>4D3N Proposal</span>
            </span>

            <span className="pill-badge bg-black/60 backdrop-blur-md text-white/90 border border-white/10 text-xs">
              <Users className="w-3.5 h-3.5 text-brand-mint" />
              <span>{members.length} Travelers</span>
            </span>

            <span className="pill-badge bg-black/60 backdrop-blur-md text-brand-mint border border-brand-mint/40 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-mint" />
              <span>On Track</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/trip-planner')}
              className="px-4 py-2 rounded-full bg-white hover:bg-slate-100 text-black text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg active:scale-95"
            >
              <span>Explore Trip</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onEditTrip}
              className="px-3 py-2 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/10 text-white text-xs font-medium transition-all"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
