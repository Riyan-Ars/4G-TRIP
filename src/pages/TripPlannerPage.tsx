import React, { useState } from 'react';
import { 
  CalendarDays, Plus, Clock, MapPin, CheckCircle2, 
  Circle, Trash2, Edit3, DollarSign, ChevronRight 
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { formatRupiah } from '../lib/financial';
import { AddItineraryModal } from '../components/modals/AddItineraryModal';
import { EditTripModal } from '../components/modals/EditTripModal';

export const TripPlannerPage: React.FC = () => {
  const { trip, itinerary, updateItineraryItem, deleteItineraryItem } = useTrip();
  const [selectedDay, setSelectedDay] = useState<number | 'all'>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditTripOpen, setIsEditTripOpen] = useState(false);
  const [addDayDefault, setAddDayDefault] = useState(1);

  const days = [
    { number: 1, title: 'Day 1 — Arrival in KL' },
    { number: 2, title: 'Day 2 — Iconic Landmarks' },
    { number: 3, title: 'Day 3 — Culture & Heritage' },
    { number: 4, title: 'Day 4 — Farewell & Departure' },
  ];

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'completed' 
      ? 'suggested' 
      : currentStatus === 'confirmed' 
        ? 'completed' 
        : 'confirmed';
    updateItineraryItem(id, { status: nextStatus as any });
  };

  const handleOpenAdd = (dayNum: number) => {
    setAddDayDefault(dayNum);
    setIsAddOpen(true);
  };

  const filteredItems = selectedDay === 'all'
    ? itinerary
    : itinerary.filter((i) => i.day_number === selectedDay);

  // Group items by day for structured vertical timeline
  const dayGroups = [1, 2, 3, 4]
    .filter((d) => selectedDay === 'all' || selectedDay === d)
    .map((dayNum) => ({
      dayNum,
      title: days.find((d) => d.number === dayNum)?.title || `Day ${dayNum}`,
      items: filteredItems.filter((i) => i.day_number === dayNum).sort((a, b) => a.sort_order - b.sort_order)
    }));

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Top Header & Trip Banner */}
      <div className="workspace-card p-5 md:p-6 bg-surface flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="pill-badge bg-surface-secondary text-brand-blue border border-border">
              Timeline Architecture
            </span>
            <span className="text-xs text-text-muted">
              {trip.origin} ✈ {trip.destination}
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-bold text-text-primary tracking-tight">
            Trip Planner: {trip.name}
          </h1>

          <p className="text-xs text-text-secondary mt-1">
            {trip.departure_date ? `${trip.departure_date} to ${trip.return_date || 'TBD'}` : '4 Days, 3 Nights Proposal'} • Synchronized group itinerary
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsEditTripOpen(true)}
            className="px-3.5 py-1.5 rounded-full bg-surface-secondary hover:bg-surface-elevated border border-border text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            Edit Trip Dates
          </button>
          <button
            onClick={() => handleOpenAdd(typeof selectedDay === 'number' ? selectedDay : 1)}
            className="px-4 py-1.5 rounded-full bg-brand-accent hover:bg-blue-400 text-background text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Activity</span>
          </button>
        </div>
      </div>

      {/* Day Selector Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedDay('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium shrink-0 transition-colors ${
            selectedDay === 'all'
              ? 'bg-brand-accent text-background font-bold shadow-sm'
              : 'bg-surface hover:bg-surface-secondary border border-border text-text-secondary hover:text-text-primary'
          }`}
        >
          All Days ({itinerary.length})
        </button>

        {days.map((d) => {
          const count = itinerary.filter((i) => i.day_number === d.number).length;
          const isSelected = selectedDay === d.number;
          return (
            <button
              key={d.number}
              onClick={() => setSelectedDay(d.number)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium shrink-0 transition-colors flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-brand-accent text-background font-bold shadow-sm'
                  : 'bg-surface hover:bg-surface-secondary border border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              <span>{d.title}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isSelected ? 'bg-black/20 text-black' : 'bg-surface-secondary text-text-muted'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Vertical Timeline Structure */}
      <div className="space-y-6">
        {dayGroups.map((group) => (
          <div key={group.dayNum} className="space-y-3">
            {/* Day Header Row */}
            <div className="flex items-center justify-between pb-1.5 border-b border-border/60">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-blue" />
                <h3 className="text-sm font-bold text-text-primary">
                  {group.title}
                </h3>
                <span className="text-xs text-text-muted">
                  ({group.items.length} items)
                </span>
              </div>

              <button
                onClick={() => handleOpenAdd(group.dayNum)}
                className="text-[11px] text-brand-blue hover:underline font-medium flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Event</span>
              </button>
            </div>

            {/* Timeline Items */}
            {group.items.length === 0 ? (
              <div className="p-4 rounded-xl bg-surface/50 border border-border/50 text-center text-xs text-text-muted">
                No activities planned for this day yet. Click "Add Event" to insert.
              </div>
            ) : (
              <div className="relative pl-6 space-y-3 border-l border-border/70 ml-3">
                {group.items.map((item) => {
                  const isCompleted = item.status === 'completed';
                  return (
                    <div
                      key={item.id}
                      className="relative group p-3.5 rounded-xl bg-surface hover:bg-surface-secondary/70 border border-border transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      {/* Timeline Node Dot */}
                      <span 
                        onClick={() => handleToggleStatus(item.id, item.status)}
                        className={`absolute -left-[31px] top-4 w-3.5 h-3.5 rounded-full border-2 border-background cursor-pointer transition-colors ${
                          isCompleted ? 'bg-brand-teal' : item.status === 'confirmed' ? 'bg-brand-blue' : 'bg-surface-elevated border-text-muted'
                        }`}
                        title="Click to toggle status"
                      />

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-text-primary">
                            {item.title}
                          </span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider border ${
                            isCompleted
                              ? 'bg-brand-teal/15 text-brand-teal border-brand-teal/30'
                              : item.status === 'confirmed'
                              ? 'bg-brand-blue/15 text-brand-blue border-brand-blue/30'
                              : 'bg-surface-secondary text-text-muted border-border'
                          }`}>
                            {item.status}
                          </span>
                        </div>

                        {item.description && (
                          <p className="text-xs text-text-secondary line-clamp-1">
                            {item.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-text-muted pt-0.5">
                          {item.start_time && (
                            <span className="flex items-center gap-1 font-mono">
                              <Clock className="w-3 h-3 text-brand-blue" />
                              <span>{item.start_time}{item.end_time ? ` - ${item.end_time}` : ''}</span>
                            </span>
                          )}
                          {item.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-brand-teal" />
                              <span>{item.location}</span>
                            </span>
                          )}
                          {item.estimated_cost > 0 && (
                            <span className="text-text-secondary font-mono">
                              Est: {formatRupiah(item.estimated_cost)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => handleToggleStatus(item.id, item.status)}
                          className="px-2.5 py-1 rounded-full bg-surface-secondary hover:bg-surface-elevated border border-border text-[11px] text-text-secondary hover:text-text-primary transition-colors"
                        >
                          {isCompleted ? 'Completed' : 'Mark Done'}
                        </button>
                        <button
                          onClick={() => deleteItineraryItem(item.id)}
                          className="p-1 rounded-lg text-text-muted hover:text-brand-rose transition-colors"
                          title="Delete item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modals */}
      <AddItineraryModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        defaultDay={addDayDefault}
      />
      <EditTripModal
        isOpen={isEditTripOpen}
        onClose={() => setIsEditTripOpen(false)}
      />
    </div>
  );
};
