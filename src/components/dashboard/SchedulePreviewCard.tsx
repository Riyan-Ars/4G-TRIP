import React from 'react';
import { Calendar, Clock, MapPin, ChevronRight, Plus } from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { useNavigate } from 'react-router-dom';

interface SchedulePreviewCardProps {
  onAddActivity: () => void;
}

export const SchedulePreviewCard: React.FC<SchedulePreviewCardProps> = ({ onAddActivity }) => {
  const { itinerary, trip } = useTrip();
  const navigate = useNavigate();

  // Pick Day 1 activities
  const day1Items = itinerary.filter((i) => i.day_number === 1).slice(1, 3);

  return (
    <div className="workspace-card p-5 bg-card flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-medium text-text-secondary">Arrival in Kuala Lumpur</span>
          <button 
            onClick={onAddActivity}
            className="w-5 h-5 rounded-full bg-card-secondary hover:bg-card-border flex items-center justify-center text-text-secondary hover:text-white transition-colors"
            title="Add Activity"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight mb-4">
          Day 1 Itinerary
        </h3>

        {/* Schedule Blocks (reproducing purple & mint pill badges in reference image) */}
        <div className="space-y-2.5">
          <div 
            onClick={() => navigate('/trip-planner')}
            className="p-3 rounded-2xl bg-brand-violet/15 border border-brand-violet/30 hover:border-brand-violet/60 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white group-hover:text-brand-violet transition-colors">
                Check in accommodation
              </span>
              <span className="text-[10px] font-mono text-brand-violet/90 font-medium">
                14.00 - 15.30
              </span>
            </div>
            <div className="text-[11px] text-text-secondary mt-0.5 truncate">
              Bukit Bintang Suite • Drop luggage
            </div>
          </div>

          <div 
            onClick={() => navigate('/trip-planner')}
            className="p-3 rounded-2xl bg-brand-mint/15 border border-brand-mint/30 hover:border-brand-mint/60 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white group-hover:text-brand-mint transition-colors">
                Sunset Walk at KLCC Park
              </span>
              <span className="text-[10px] font-mono text-brand-mint/90 font-medium">
                16.30 - 18.30
              </span>
            </div>
            <div className="text-[11px] text-text-secondary mt-0.5 truncate">
              Lake Symphony fountain & twilight photos
            </div>
          </div>
        </div>
      </div>

      <div className="pt-3 mt-3 border-t border-card-border/60 flex items-center justify-between text-xs">
        <span className="text-[11px] text-text-muted">4 scheduled for Day 1</span>
        <button
          onClick={() => navigate('/trip-planner')}
          className="text-[11px] font-semibold text-brand-mint hover:text-emerald-300 flex items-center gap-1 transition-colors"
        >
          <span>View Day Plan</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
