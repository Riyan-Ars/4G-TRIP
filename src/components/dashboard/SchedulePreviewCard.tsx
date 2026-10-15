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

  // Pick upcoming activities from Day 1 or Day 2
  const day1Items = itinerary.filter((i) => i.day_number === 1);
  const displayItems = day1Items.length > 0 ? day1Items.slice(0, 2) : itinerary.slice(0, 2);

  return (
    <div className="workspace-card p-5 bg-surface flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-medium text-text-secondary">
            {trip.destination} • Upcoming Schedule
          </span>
          <button 
            onClick={onAddActivity}
            className="w-5 h-5 rounded-full bg-surface-secondary hover:bg-surface-elevated flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
            title="Add Activity"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        <h3 className="text-lg font-bold text-text-primary tracking-tight mb-3">
          Day 1 Timeline
        </h3>

        {/* Schedule Blocks (reading real itinerary) */}
        {displayItems.length === 0 ? (
          <div className="p-4 rounded-xl bg-surface-secondary/50 border border-border text-center text-xs text-text-muted">
            No activities scheduled yet.
          </div>
        ) : (
          <div className="space-y-2">
            {displayItems.map((item, idx) => {
              const isFirst = idx === 0;
              return (
                <div 
                  key={item.id}
                  onClick={() => navigate('/trip-planner')}
                  className={`p-3 rounded-xl border transition-all cursor-pointer group ${
                    isFirst 
                      ? 'bg-surface-secondary/80 border-brand-blue/30 hover:border-brand-blue/60'
                      : 'bg-surface-secondary/50 border-brand-teal/30 hover:border-brand-teal/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-text-primary group-hover:text-white transition-colors truncate">
                      {item.title}
                    </span>
                    <span className="text-[10px] font-mono text-text-muted shrink-0 ml-2">
                      {item.start_time && item.end_time ? `${item.start_time} - ${item.end_time}` : item.start_time || 'Scheduled'}
                    </span>
                  </div>
                  <div className="text-[11px] text-text-secondary mt-0.5 truncate flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-text-muted shrink-0" />
                    <span>{item.location || 'Kuala Lumpur'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="pt-3 mt-3 border-t border-border/60 flex items-center justify-between text-xs">
        <span className="text-[11px] text-text-muted">{day1Items.length} activities scheduled</span>
        <button
          onClick={() => navigate('/trip-planner')}
          className="text-[11px] font-medium text-brand-blue hover:underline flex items-center gap-1 transition-colors"
        >
          <span>Full Itinerary</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
