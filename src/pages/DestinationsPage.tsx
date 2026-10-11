import React, { useState } from 'react';
import { 
  MapPin, Plus, Heart, Bookmark, Sparkles, 
  Calendar, DollarSign, Filter, Compass, Check 
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { DestinationCategory } from '../types';
import { formatRupiah } from '../lib/financial';

export const DestinationsPage: React.FC = () => {
  const { destinations, toggleSaveDestination, addDestinationToItinerary, addCustomDestination } = useTrip();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDestForDay, setSelectedDestForDay] = useState<string | null>(null);
  const [dayToAddTo, setDayToAddTo] = useState(2);
  const [addedSuccessId, setAddedSuccessId] = useState<string | null>(null);

  const categories: Array<{ id: string; label: string }> = [
    { id: 'all', label: 'All Places' },
    { id: 'culture', label: 'Culture & Heritage' },
    { id: 'nature', label: 'Nature & Parks' },
    { id: 'food', label: 'Food & Dining' },
    { id: 'shopping', label: 'Shopping & Bazaars' },
    { id: 'photography', label: 'Photography Spots' },
  ];

  const filteredDestinations = selectedCategory === 'all'
    ? destinations
    : destinations.filter((d) => d.category === selectedCategory);

  const handleAddToDay = (destId: string) => {
    addDestinationToItinerary(destId, dayToAddTo);
    setSelectedDestForDay(null);
    setAddedSuccessId(destId);
    setTimeout(() => setAddedSuccessId(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="workspace-card p-6 bg-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="pill-badge bg-brand-blue/15 text-brand-blue border border-brand-blue/30 uppercase text-[10px] font-bold">
              Discovery Guide
            </span>
            <span className="text-xs text-text-secondary">
              Kuala Lumpur & Surroundings
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Explore Destinations
          </h1>

          <p className="text-xs text-text-secondary mt-1">
            Curated attractions and culinary stops. Save favorites or push directly into your group itinerary.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all ${
                isSelected
                  ? 'bg-brand-mint text-black font-bold shadow-glow-mint'
                  : 'bg-card hover:bg-card-secondary border border-card-border text-text-secondary hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Destination Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDestinations.map((dest) => (
          <div
            key={dest.id}
            className="workspace-card overflow-hidden bg-card flex flex-col justify-between group hover:border-card-hover transition-all"
          >
            {/* Card Image */}
            <div className="relative h-48 w-full overflow-hidden bg-card-secondary">
              <img
                src={dest.image_url}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-brand-mint border border-white/10 text-[10px] font-bold uppercase tracking-wider">
                  {dest.category}
                </span>
              </div>

              <button
                onClick={() => toggleSaveDestination(dest.id)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:text-rose-400 transition-colors"
                title="Bookmark place"
              >
                <Heart className={`w-4 h-4 ${dest.is_saved ? 'text-rose-500 fill-current' : 'text-white'}`} />
              </button>

              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-white">
                <span className="font-semibold drop-shadow">{dest.location}</span>
                {dest.estimated_cost > 0 ? (
                  <span className="text-[11px] font-mono text-brand-mint font-bold drop-shadow">
                    Est. {formatRupiah(dest.estimated_cost)}
                  </span>
                ) : (
                  <span className="text-[11px] text-emerald-400 font-bold drop-shadow">
                    Free Entry
                  </span>
                )}
              </div>
            </div>

            {/* Content & Actions */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight mb-1.5">
                  {dest.name}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                  {dest.description}
                </p>
              </div>

              {/* Add to Day Selector or Button */}
              <div className="mt-4 pt-3 border-t border-card-border/60">
                {selectedDestForDay === dest.id ? (
                  <div className="flex items-center gap-2 animate-fade-in">
                    <select
                      value={dayToAddTo}
                      onChange={(e) => setDayToAddTo(parseInt(e.target.value, 10))}
                      className="bg-card-secondary border border-card-border rounded-xl text-xs py-1.5 px-2.5 text-white outline-none flex-1"
                    >
                      <option value={1}>Day 1 (Arrival)</option>
                      <option value={2}>Day 2 (Landmarks)</option>
                      <option value={3}>Day 3 (Culture)</option>
                      <option value={4}>Day 4 (Departure)</option>
                    </select>
                    <button
                      onClick={() => handleAddToDay(dest.id)}
                      className="px-3 py-1.5 rounded-xl bg-brand-mint text-black font-bold text-xs hover:bg-emerald-400"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setSelectedDestForDay(null)}
                      className="px-2 py-1.5 text-text-muted hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ) : addedSuccessId === dest.id ? (
                  <div className="w-full py-1.5 rounded-xl bg-brand-mint/20 border border-brand-mint/40 text-brand-mint text-xs font-bold text-center flex items-center justify-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>Added to Day {dayToAddTo}!</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedDestForDay(dest.id)}
                    className="w-full py-1.5 rounded-xl bg-card-secondary hover:bg-card-border border border-card-border text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors group-hover:border-brand-mint/40 group-hover:text-brand-mint"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Itinerary Day</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
