import React from 'react';
import { Maximize2, MapPin, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MapPreviewCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate('/destinations')}
      className="workspace-card p-0 relative overflow-hidden group cursor-pointer h-full min-h-[160px] bg-card border-card-border"
    >
      {/* Map visual background */}
      <img
        src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&auto=format&fit=crop&q=80"
        alt="Kuala Lumpur destination map"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-75 contrast-125"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

      {/* Floating map marker with live traveler badge (Matches "Adrian" in ref) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-blue text-black font-bold text-[10px] shadow-lg animate-pulse">
        <Navigation className="w-3 h-3 fill-current" />
        <span>Adrian (KLCC)</span>
      </div>

      {/* Controls */}
      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white">
        <span className="font-semibold drop-shadow">Bukit Bintang Area</span>
        <button 
          className="w-6 h-6 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/90 hover:text-white"
          title="Explore Destinations"
        >
          <Maximize2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
