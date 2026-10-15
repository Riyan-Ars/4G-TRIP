import React, { useState } from 'react';
import { 
  MapPin, Plus, Heart, Bookmark, 
  Calendar, DollarSign, Compass, Check 
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { formatRupiah } from '../lib/financial';

export const DestinationsPage: React.FC = () => {
  const { destinations, toggleSaveDestination, addDestinationToItinerary } = useTrip();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDestForDay, setSelectedDestForDay] = useState<string | null>(null);
  const [dayToAddTo, setDayToAddTo] = useState(2);
  const [addedSuccessId, setAddedSuccessId] = useState<string | null>(null);

  const categories = [
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
      <div className="workspace-card p-5 md:p-6 bg-surface flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="pill-badge bg-surface-secondary text-brand-blue border border-border">
              Discovery Guide
            </span>
            <span className="text-xs text-text-muted">
              Kuala Lumpur & Vicinity
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-bold text-text-primary tracking-tight">
            Curated Destinations ({destinations.length})
          </h1>

          <p className="text-xs text-text-secondary mt-1">
            Carefully selected attractions, cultural monuments, and street food corridors. Push directly into your trip itinerary.
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
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium shrink-0 transition-colors ${
                isSelected
                  ? 'bg-brand-accent text-background font-bold shadow-sm'
                  : 'bg-surface hover:bg-surface-secondary border border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Destination Editorial Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDestinations.map((dest) => (
          <div
            key={dest.id}
            className="workspace-card overflow-hidden bg-surface flex flex-col justify-between group hover:border-border/80 transition-colors"
          >
            {/* Card Image */}
            <div className="relative h-44 w-full overflow-hidden bg-surface-secondary">
              <img
                src={dest.image_url}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-background/20" />

              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-0.5 rounded-full bg-background/80 backdrop-blur-md text-brand-teal border border-white/10 text-[10px] font-semibold uppercase tracking-wider">
                  {dest.category}
                </span>
              </div>

              <button
                onClick={() => toggleSaveDestination(dest.id)}
                className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-md border border-white/10 transition-colors ${
                  dest.is_saved
                    ? 'bg-brand-rose/20 text-brand-rose border-brand-rose/30'
                    : 'bg-background/60 text-text-secondary hover:text-text-primary'
                }`}
                title={dest.is_saved ? 'Remove Bookmark' : 'Save Place'}
              >
                <Bookmark className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>

            {/* Card Body */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-text-primary tracking-tight">
                  {dest.name}
                </h3>

                <p className="text-xs text-text-secondary line-clamp-2 mt-1 leading-relaxed">
                  {dest.description}
                </p>

                <div className="flex items-center gap-1.5 text-[11px] text-text-muted mt-2">
                  <MapPin className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                  <span className="truncate">{dest.location}</span>
                </div>
              </div>

              {/* Bottom Metadata & Action */}
              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-text-muted block">Estimated Cost:</span>
                  <span className="font-mono font-semibold text-text-primary">
                    {dest.estimated_cost === 0 ? 'Free Entry' : formatRupiah(dest.estimated_cost)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {addedSuccessId === dest.id ? (
                    <span className="text-[11px] font-semibold text-brand-teal flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Added!</span>
                    </span>
                  ) : selectedDestForDay === dest.id ? (
                    <div className="flex items-center gap-1">
                      <select
                        value={dayToAddTo}
                        onChange={(e) => setDayToAddTo(Number(e.target.value))}
                        className="bg-surface-secondary text-text-primary border border-border text-[11px] rounded-lg px-2 py-1 outline-none"
                      >
                        <option value={1}>Day 1</option>
                        <option value={2}>Day 2</option>
                        <option value={3}>Day 3</option>
                        <option value={4}>Day 4</option>
                      </select>
                      <button
                        onClick={() => handleAddToDay(dest.id)}
                        className="px-2.5 py-1 rounded-full bg-brand-accent text-background font-bold text-[11px]"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedDestForDay(dest.id)}
                      className="px-3 py-1 rounded-full bg-surface-secondary hover:bg-surface-elevated border border-border text-text-secondary hover:text-text-primary text-[11px] font-medium transition-colors"
                    >
                      + Add to Plan
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
