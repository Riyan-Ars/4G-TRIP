import React, { useState } from 'react';
import { X, Plane, Calendar, MapPin, Check } from 'lucide-react';
import { useTrip } from '../../context/TripContext';

interface EditTripModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditTripModal: React.FC<EditTripModalProps> = ({ isOpen, onClose }) => {
  const { trip, updateTripDetails } = useTrip();
  const [name, setName] = useState(trip.name);
  const [origin, setOrigin] = useState(trip.origin);
  const [destination, setDestination] = useState(trip.destination);
  const [departureDate, setDepartureDate] = useState(trip.departure_date || '');
  const [returnDate, setReturnDate] = useState(trip.return_date || '');
  const [status, setStatus] = useState(trip.status);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTripDetails({
      name: name.trim(),
      origin: origin.trim(),
      destination: destination.trim(),
      departure_date: departureDate || null,
      return_date: returnDate || null,
      status
    });
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
          <div className="w-10 h-10 rounded-xl bg-brand-blue/15 border border-brand-blue/30 flex items-center justify-center text-brand-blue">
            <Plane className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Edit Trip Information</h3>
            <p className="text-xs text-text-secondary">Update schedule, destination, and planning stage</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">
              Trip Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="E.g. Malaysia Getaway"
              className="w-full bg-card-secondary border border-card-border focus:border-brand-blue rounded-xl py-2 px-3 text-xs text-white outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Origin City
              </label>
              <input
                type="text"
                required
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Banda Aceh"
                className="w-full bg-card-secondary border border-card-border focus:border-brand-blue rounded-xl py-2 px-3 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Destination City / Country
              </label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Kuala Lumpur"
                className="w-full bg-card-secondary border border-card-border focus:border-brand-blue rounded-xl py-2 px-3 text-xs text-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Departure Date (Optional)
              </label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full bg-card-secondary border border-card-border focus:border-brand-blue rounded-xl py-2 px-3 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Return Date (Optional)
              </label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full bg-card-secondary border border-card-border focus:border-brand-blue rounded-xl py-2 px-3 text-xs text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">
              Trip Planning Stage
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full bg-card-secondary border border-card-border focus:border-brand-blue rounded-xl py-2 px-3 text-xs text-white outline-none cursor-pointer"
            >
              <option value="planning">Planning & Savings</option>
              <option value="confirmed">Bookings Confirmed</option>
              <option value="ongoing">Trip Ongoing</option>
              <option value="completed">Completed</option>
            </select>
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
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-blue text-white hover:bg-blue-600 transition-all flex items-center gap-1.5 shadow-glow-blue"
            >
              <Check className="w-4 h-4" />
              <span>Update Trip Details</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
