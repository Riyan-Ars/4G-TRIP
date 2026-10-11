import React, { useState } from 'react';
import { 
  CalendarDays, Plus, Clock, MapPin, CheckCircle2, 
  Circle, Trash2, Edit3, User, DollarSign, Filter, Sparkles 
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

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Top Header & Trip Banner */}
      <div className="workspace-card p-6 bg-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="pill-badge bg-brand-mint/15 text-brand-mint border border-brand-mint/30 uppercase text-[10px] font-bold">
              Itinerary Workspace
            </span>
            <span className="text-xs text-text-secondary">
              {trip.origin} ✈ {trip.destination}
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Trip Planner: {trip.name}
          </h1>

          <p className="text-xs text-text-secondary mt-1">
            {trip.departure_date ? `${trip.departure_date} to ${trip.return_date || 'TBD'}` : 'Dates: Proposal stage (4 Days, 3 Nights)'} • Synchronized collaborative timeline
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsEditTripOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-card-secondary hover:bg-card-border border border-card-border text-xs font-semibold text-white transition-colors"
          >
            Edit Trip Dates
          </button>
          <button
            onClick={() => handleOpenAdd(typeof selectedDay === 'number' ? selectedDay : 1)}
            className="px-4 py-2 rounded-xl bg-brand-mint hover:bg-emerald-400 text-black text-xs font-bold transition-all flex items-center gap-1.5 shadow-glow-mint active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Activity</span>
          </button>
        </div>
      </div>

      {/* Day Selector Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedDay('all')}
          className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all ${
            selectedDay === 'all'
              ? 'bg-white text-black font-bold shadow-sm'
              : 'bg-card hover:bg-card-secondary border border-card-border text-text-secondary hover:text-white'
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
              className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-brand-mint text-black font-bold shadow-glow-mint'
                  : 'bg-card hover:bg-card-secondary border border-card-border text-text-secondary hover:text-white'
              }`}
            >
              <span>{d.title}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-black/20 text-black' : 'bg-card-secondary text-text-muted'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Timeline Section */}
      <div className="space-y-6">
        {(selectedDay === 'all' ? [1, 2, 3, 4] : [selectedDay]).map((dayNum) => {
          const itemsForDay = itinerary.filter((i) => i.day_number === dayNum);
          const dayInfo = days.find((d) => d.number === dayNum);

          return (
            <div key={dayNum} className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-brand-mint/15 text-brand-mint flex items-center justify-center font-bold text-xs">
                    {dayNum}
                  </div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    {dayInfo?.title}
                  </h3>
                </div>

                <button
                  onClick={() => handleOpenAdd(dayNum)}
                  className="text-xs text-brand-mint hover:underline font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Day {dayNum}</span>
                </button>
              </div>

              {itemsForDay.length === 0 ? (
                <div className="workspace-card p-6 bg-card text-center space-y-2 border-dashed">
                  <p className="text-xs text-text-muted">No activities scheduled for this day yet.</p>
                  <button
                    onClick={() => handleOpenAdd(dayNum)}
                    className="px-3 py-1.5 rounded-lg bg-card-secondary text-xs text-brand-mint font-semibold hover:bg-card-border transition-colors"
                  >
                    + Schedule First Experience
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {itemsForDay.map((item) => (
                    <div
                      key={item.id}
                      className="workspace-card p-4 bg-card hover:border-card-hover border-card-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all group"
                    >
                      <div className="flex items-start gap-3.5 flex-1 min-w-0">
                        {/* Status Toggle Circle */}
                        <button
                          onClick={() => handleToggleStatus(item.id, item.status)}
                          className="mt-0.5 shrink-0 transition-transform active:scale-90"
                          title={`Click to mark as ${item.status === 'completed' ? 'suggested' : 'completed'}`}
                        >
                          {item.status === 'completed' ? (
                            <CheckCircle2 className="w-5 h-5 text-brand-mint" />
                          ) : item.status === 'confirmed' ? (
                            <div className="w-5 h-5 rounded-full border-2 border-brand-blue flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-brand-blue" />
                            </div>
                          ) : (
                            <Circle className="w-5 h-5 text-text-muted hover:text-white" />
                          )}
                        </button>

                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className={`text-sm font-bold text-white truncate ${item.status === 'completed' ? 'line-through text-text-muted' : ''}`}>
                              {item.title}
                            </h4>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                              item.status === 'completed'
                                ? 'bg-brand-mint/15 text-brand-mint'
                                : item.status === 'confirmed'
                                ? 'bg-brand-blue/15 text-brand-blue'
                                : 'bg-card-secondary text-text-muted'
                            }`}>
                              {item.status}
                            </span>
                          </div>

                          {item.description && (
                            <p className="text-xs text-text-secondary leading-relaxed">
                              {item.description}
                            </p>
                          )}

                          <div className="flex items-center gap-3 text-[11px] text-text-muted pt-1 flex-wrap">
                            {item.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-text-secondary" />
                                <span>{item.location}</span>
                              </span>
                            )}

                            {item.start_time && (
                              <span className="flex items-center gap-1 font-mono">
                                <Clock className="w-3 h-3 text-text-secondary" />
                                <span>{item.start_time} {item.end_time ? `- ${item.end_time}` : ''}</span>
                              </span>
                            )}

                            {item.estimated_cost > 0 && (
                              <span className="flex items-center gap-1 font-mono text-brand-mint font-semibold">
                                <DollarSign className="w-3 h-3" />
                                <span>Est. {formatRupiah(item.estimated_cost)}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right metadata & delete */}
                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                        {item.assigned_profile && (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card-secondary border border-card-border text-[11px] text-text-secondary">
                            <User className="w-3 h-3 text-brand-mint" />
                            <span>{item.assigned_profile.display_name.split(' ')[0]}</span>
                          </div>
                        )}

                        <button
                          onClick={() => deleteItineraryItem(item.id)}
                          className="p-1.5 rounded-lg text-text-muted hover:text-rose-400 hover:bg-card-secondary transition-colors"
                          title="Delete activity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
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
