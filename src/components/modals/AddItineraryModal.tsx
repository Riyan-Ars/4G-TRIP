import React, { useState } from 'react';
import { X, Calendar, MapPin, Clock, Tag, DollarSign, Plus } from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { formatRupiah, parseRupiahInput } from '../../lib/financial';

interface AddItineraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDay?: number;
}

export const AddItineraryModal: React.FC<AddItineraryModalProps> = ({
  isOpen,
  onClose,
  defaultDay = 1
}) => {
  const { addItineraryItem, members } = useTrip();
  const [dayNumber, setDayNumber] = useState(defaultDay);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('12:00');
  const [displayCost, setDisplayCost] = useState('0');
  const [assignedTo, setAssignedTo] = useState(members[0]?.user_id || '');

  if (!isOpen) return null;

  const rawCost = parseRupiahInput(displayCost);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addItineraryItem(
      dayNumber,
      title.trim(),
      description.trim(),
      location.trim(),
      startTime,
      endTime,
      rawCost,
      assignedTo
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-card border border-card-border rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-text-secondary hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-10 h-10 rounded-xl bg-brand-mint/15 border border-brand-mint/30 flex items-center justify-center text-brand-mint">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Add Day Activity</h3>
            <p className="text-xs text-text-secondary">Schedule an experience for your Malaysia trip</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Trip Day
              </label>
              <select
                value={dayNumber}
                onChange={(e) => setDayNumber(parseInt(e.target.value, 10))}
                className="w-full bg-card-secondary border border-card-border focus:border-brand-mint rounded-xl py-2 px-3 text-xs text-white outline-none cursor-pointer"
              >
                <option value={1}>Day 1 — Arrival</option>
                <option value={2}>Day 2 — Iconic KL</option>
                <option value={3}>Day 3 — Culture & City</option>
                <option value={4}>Day 4 — Departure</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-card-secondary border border-card-border focus:border-brand-mint rounded-xl py-2 px-3 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-card-secondary border border-card-border focus:border-brand-mint rounded-xl py-2 px-3 text-xs text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">
              Activity Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g. Visit Petronas Skybridge or Jalan Alor Satay Feast"
              className="w-full bg-card-secondary border border-card-border focus:border-brand-mint rounded-xl py-2 px-3 text-xs text-white placeholder:text-text-muted outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">
              Location / Landmark
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="E.g. Kuala Lumpur City Centre (KLCC)"
              className="w-full bg-card-secondary border border-card-border focus:border-brand-mint rounded-xl py-2 px-3 text-xs text-white placeholder:text-text-muted outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">
              Description / Tips
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g. Buy online tickets in advance; dress code for temples..."
              className="w-full bg-card-secondary border border-card-border focus:border-brand-mint rounded-xl p-2.5 text-xs text-white placeholder:text-text-muted outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Estimated Cost (IDR)
              </label>
              <input
                type="text"
                value={rawCost > 0 ? rawCost.toLocaleString('id-ID') : '0'}
                onChange={(e) => setDisplayCost(e.target.value)}
                placeholder="0"
                className="w-full bg-card-secondary border border-card-border focus:border-brand-mint rounded-xl py-2 px-3 text-xs text-white outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Assigned Traveler
              </label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full bg-card-secondary border border-card-border focus:border-brand-mint rounded-xl py-2 px-3 text-xs text-white outline-none cursor-pointer"
              >
                {members.map((m) => (
                  <option key={m.user_id} value={m.user_id}>
                    {m.profile?.display_name || m.user_id}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:text-white hover:bg-card-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-mint text-black hover:bg-emerald-400 disabled:opacity-40 transition-all flex items-center gap-1.5 shadow-glow-mint"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Itinerary</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
