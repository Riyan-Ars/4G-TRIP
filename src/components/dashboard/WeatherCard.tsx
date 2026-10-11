import React, { useState } from 'react';
import { Sun, CloudRain, Cloud, CloudSun, RefreshCw } from 'lucide-react';

export const WeatherCard: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const forecast = [
    { day: 'Sun', icon: Sun, temp: '32°C', rain: '20%', type: 'sun' },
    { day: 'Mon', icon: CloudSun, temp: '31°C', rain: '35%', type: 'clouds' },
    { day: 'Tue', icon: CloudRain, temp: '29°C', rain: '70%', type: 'rain' },
    { day: 'Wed', icon: Cloud, temp: '30°C', rain: '45%', type: 'cloud' },
    { day: 'Thu', icon: Sun, temp: '33°C', rain: '15%', type: 'sun' },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="workspace-card p-5 bg-card flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-white tracking-wide">
          5 Days Forecast (Kuala Lumpur)
        </h3>
        <button
          onClick={handleRefresh}
          className="text-[10px] text-text-secondary hover:text-white flex items-center gap-1 transition-colors"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-brand-mint' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-5 gap-1.5 pt-1">
        {forecast.map((f, i) => {
          const Icon = f.icon;
          return (
            <div
              key={f.day}
              className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all text-center ${
                i === 0 
                  ? 'bg-card-secondary border-brand-mint/30 shadow-sm' 
                  : 'bg-card-secondary/40 border-card-border/50 hover:bg-card-secondary/80'
              }`}
            >
              <span className="text-[10px] font-semibold text-text-secondary mb-1.5">{f.day}</span>
              <Icon className={`w-5 h-5 mb-1.5 ${
                f.type === 'sun' ? 'text-amber-400' : f.type === 'rain' ? 'text-brand-blue' : 'text-slate-300'
              }`} />
              <span className="text-[10px] font-mono text-text-muted mb-0.5">{f.rain}</span>
              <span className="text-xs font-bold text-white">{f.temp}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-2 border-t border-card-border/60 flex items-center justify-between text-[10px] text-text-muted">
        <span>Tropical / warm daylight</span>
        <span className="text-brand-mint font-medium">Comfortable</span>
      </div>
    </div>
  );
};
