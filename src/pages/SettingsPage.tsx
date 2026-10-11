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
      <div className="workspace-card p-6 bg-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="pill-badge bg-brand-violet/15 text-brand-violet border border-brand-violet/30 uppercase text-[10px] font-bold">
              Configuration
            </span>
            <span className="text-xs text-text-secondary">
              Environment & Workspace
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Settings & Backend Integration
          </h1>

          <p className="text-xs text-text-secondary mt-1">
            Manage trip destination dates, currency rules, and Supabase PostgreSQL credentials.
          </p>
        </div>
      </div>

      {/* 1. Supabase Backend Connection Status (Section 2 & 14 requirement) */}
      <div className="workspace-card p-5 bg-card border-card-border space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
              isSupabaseConnected 
                ? 'bg-brand-mint/15 border-brand-mint/30 text-brand-mint' 
                : 'bg-brand-blue/15 border-brand-blue/30 text-brand-blue'
            }`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Database Status: {isSupabaseConnected ? 'Connected to Supabase' : 'Local Storage Fallback Mode'}
              </h3>
              <p className="text-xs text-text-secondary">
                {isSupabaseConnected 
                  ? 'Real-time PostgreSQL database active with RLS policies enabled.' 
                  : 'Operating locally with resilient browser persistence and demo personas.'}
              </p>
            </div>
          </div>

          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            isSupabaseConnected ? 'bg-brand-mint/20 text-brand-mint' : 'bg-brand-blue/20 text-brand-blue'
          }`}>
            {isSupabaseConnected ? 'Live' : 'Active Local'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-card-secondary border border-card-border text-xs space-y-2">
          <div className="font-semibold text-white flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-brand-mint" />
            <span>Connecting to your own Supabase project:</span>
          </div>
          <ol className="list-decimal list-inside text-text-secondary space-y-1 pl-1 text-[11px] leading-relaxed">
            <li>Run the SQL migration scripts located in <code className="text-brand-mint">supabase/migrations/</code> in your Supabase SQL Editor.</li>
            <li>Copy <code className="text-brand-mint">.env.example</code> to <code className="text-brand-mint">.env</code> in the project root.</li>
            <li>Fill in your project URL: <code className="text-white">VITE_SUPABASE_URL=https://xyz.supabase.co</code></li>
            <li>Fill in your public anon key: <code className="text-white">VITE_SUPABASE_ANON_KEY=eyJ...</code></li>
            <li>Restart the development server. The app will automatically connect live!</li>
          </ol>
        </div>
      </div>

      {/* 2. Trip Metadata Editor */}
      <div className="workspace-card p-5 bg-card border-card-border space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Trip Schedule & Cities
        </h3>

        <form onSubmit={handleSaveTrip} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">
              Trip Title
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-card-secondary border border-card-border focus:border-brand-mint rounded-xl py-2 px-3 text-xs text-white outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Departure City (Origin)
              </label>
              <input
                type="text"
                required
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full bg-card-secondary border border-card-border focus:border-brand-mint rounded-xl py-2 px-3 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Destination City
              </label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-card-secondary border border-card-border focus:border-brand-mint rounded-xl py-2 px-3 text-xs text-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Departure Date
              </label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full bg-card-secondary border border-card-border focus:border-brand-mint rounded-xl py-2 px-3 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Return Date
              </label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full bg-card-secondary border border-card-border focus:border-brand-mint rounded-xl py-2 px-3 text-xs text-white outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-brand-mint text-black font-bold text-xs hover:bg-emerald-400 flex items-center gap-1.5 transition-colors shadow-glow-mint"
            >
              {savedSuccess ? <Check className="w-3.5 h-3.5" /> : null}
              <span>{savedSuccess ? 'Settings Saved!' : 'Save Trip Settings'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. Reset Demo Data */}
      <div className="workspace-card p-5 bg-card border-card-border flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Reset Workspace Seed Data
          </h4>
          <p className="text-[11px] text-text-secondary mt-0.5">
            Restores initial Malaysia Getaway seed records (Alfikri, Adrian, Reina, Rp15M budget, 4D3N plan).
          </p>
        </div>

        {resetConfirm ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setResetConfirm(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-text-secondary hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleReset}
              className="px-3.5 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold"
            >
              Confirm Reset
            </button>
          </div>
        ) : (
          <button
            onClick={() => setResetConfirm(true)}
            className="px-3.5 py-1.5 rounded-xl bg-card-secondary hover:bg-rose-950/40 text-text-secondary hover:text-rose-400 border border-card-border text-xs font-semibold transition-colors flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        )}
      </div>
    </div>
  );
};
