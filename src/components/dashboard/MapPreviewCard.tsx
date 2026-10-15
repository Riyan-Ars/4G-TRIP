import React from 'react';
import { Maximize2, MapPin, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTrip } from '../../context/TripContext';

export const MapPreviewCard: React.FC = () => {
  const navigate = useNavigate();
  const { trip } = useTrip();

  return (
    <div 
      onClick={() => navigate('/destinations')}
      className="workspace-card p-0 relative overflow-hidden group cursor-pointer h-full min-h-[140px] bg-surface border-border"
    >
      {/* Map visual background */}
      <img
        src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&auto=format&fit=crop&q=80"
        alt="Kuala Lumpur destination map"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-75 contrast-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-background/20" />

      {/* Floating map marker */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-elevated/90 text-text-primary font-medium text-[11px] shadow-subtle border border-white/10 backdrop-blur-md">
        <MapPin className="w-3.5 h-3.5 text-brand-blue" />
        <span>{trip.destination} Hub</span>
      </div>

      {/* Controls */}
      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-text-primary">
        <span className="font-medium drop-shadow text-text-secondary">Bukit Bintang Corridor</span>
        <button 
          className="w-6 h-6 rounded-full bg-surface-elevated/80 backdrop-blur-sm border border-white/10 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
          title="Explore Destinations"
        >
          <Maximize2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
