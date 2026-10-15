import React, { useState } from 'react';
import { 
  Settings, Database, Shield, RefreshCw, 
  Check, Copy, Terminal, ExternalLink, AlertCircle 
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';

export const SettingsPage: React.FC = () => {
  const { trip, updateTripDetails, resetAllData } = useTrip();
  const { currentUser, isSupabaseConnected } = useAuth();
  const [name, setName] = useState(trip.name);
  const [origin, setOrigin] = useState(trip.origin);
  const [destination, setDestination] = useState(trip.destination);
  const [departureDate, setDepartureDate] = useState(trip.departure_date || '');
  const [returnDate, setReturnDate] = useState(trip.return_date || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  const handleSaveTrip = (e: React.FormEvent) => {
    e.preventDefault();
    updateTripDetails({
      name,
      origin,
      destination,
      departure_date: departureDate || null,
      return_date: returnDate || null,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleReset = () => {
    resetAllData();
    setResetConfirm(false);
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="workspace-card p-5 md:p-6 bg-surface flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="pill-badge bg-surface-secondary text-brand-blue border border-border">
              Configuration
            </span>
            <span className="text-xs text-text-muted">
              Workspace Settings
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-bold text-text-primary tracking-tight">
            Settings & Workspace Preferences
          </h1>

          <p className="text-xs text-text-secondary mt-1">
            Configure trip destination details, departure schedules, and cloud database persistence.
          </p>
        </div>
      </div>

      {/* 1. Trip Metadata Form */}
      <form onSubmit={handleSaveTrip} className="workspace-card p-5 bg-surface border-border space-y-4">
        <div className="border-b border-border/60 pb-3">
          <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
            Trip Parameters
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">
            Basic details shared across all members of this travel group.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-text-secondary block mb-1">Trip Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface-secondary border border-border focus:border-brand-blue rounded-xl px-3 py-2 text-xs text-text-primary outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-text-secondary block mb-1">Origin City</label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full bg-surface-secondary border border-border focus:border-brand-blue rounded-xl px-3 py-2 text-xs text-text-primary outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-text-secondary block mb-1">Destination</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-surface-secondary border border-border focus:border-brand-blue rounded-xl px-3 py-2 text-xs text-text-primary outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-text-secondary block mb-1">Departure Date</label>
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="w-full bg-surface-secondary border border-border focus:border-brand-blue rounded-xl px-3 py-2 text-xs text-text-primary outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-text-secondary block mb-1">Return Date</label>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full bg-surface-secondary border border-border focus:border-brand-blue rounded-xl px-3 py-2 text-xs text-text-primary outline-none transition-colors"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-border/60 flex items-center justify-between">
          {savedSuccess ? (
            <span className="text-xs font-medium text-brand-teal flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>Trip settings updated!</span>
            </span>
          ) : <span />}

          <button
            type="submit"
            className="px-4 py-1.5 rounded-full bg-brand-accent hover:bg-blue-400 text-background font-bold text-xs transition-all shadow-sm active:scale-95"
          >
            Save Changes
          </button>
        </div>
      </form>

      {/* 2. Supabase Backend Connection Status */}
      <div className="workspace-card p-5 bg-surface border-border space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
              isSupabaseConnected 
                ? 'bg-brand-teal/15 border-brand-teal/30 text-brand-teal' 
                : 'bg-brand-blue/15 border-brand-blue/30 text-brand-blue'
            }`}>
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-text-primary">
                Backend Status: {isSupabaseConnected ? 'Connected to Supabase' : 'Local Storage Mode'}
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                {isSupabaseConnected 
                  ? 'Real-time PostgreSQL database active with RLS policies.' 
                  : 'Operating locally with resilient browser persistence and demo personas.'}
              </p>
            </div>
          </div>

          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
            isSupabaseConnected 
              ? 'bg-brand-teal/15 text-brand-teal border-brand-teal/30' 
              : 'bg-brand-blue/15 text-brand-blue border-brand-blue/30'
          }`}>
            {isSupabaseConnected ? 'Live' : 'Active Local'}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-secondary border border-border text-xs space-y-2">
          <div className="font-semibold text-text-primary flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-brand-blue" />
            <span>Connecting your own Supabase project:</span>
          </div>
          <ol className="list-decimal list-inside text-text-secondary space-y-1 pl-1 text-[11px] leading-relaxed">
            <li>Run migration scripts in <code className="text-brand-blue">supabase/migrations/</code> in Supabase SQL Editor.</li>
            <li>Copy <code className="text-brand-blue">.env.example</code> to <code className="text-brand-blue">.env</code> in project root.</li>
            <li>Fill in <code className="text-brand-blue">VITE_SUPABASE_URL</code> and <code className="text-brand-blue">VITE_SUPABASE_ANON_KEY</code>.</li>
          </ol>
        </div>
      </div>

      {/* 3. Reset Workspace Data */}
      <div className="workspace-card p-5 bg-surface border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Data Management & Reset
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Re-initialize demo state back to default 4G Trip dataset (Riyan, Fathun, Bintang).
            </p>
          </div>

          {resetConfirm ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setResetConfirm(false)}
                className="px-3 py-1.5 rounded-full bg-surface-secondary text-xs text-text-secondary hover:text-text-primary"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-3.5 py-1.5 rounded-full bg-brand-rose text-background font-bold text-xs hover:bg-rose-400 shadow-sm"
              >
                Confirm Reset
              </button>
            </div>
          ) : (
            <button
              onClick={() => setResetConfirm(true)}
              className="px-3.5 py-1.5 rounded-full bg-surface-elevated hover:bg-rose-950/40 text-brand-rose border border-border text-xs font-medium transition-colors"
            >
              Reset to Defaults
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
