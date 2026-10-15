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
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="workspace-card p-4 bg-surface flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-text-primary tracking-wide">
          Forecast (Kuala Lumpur)
        </h3>
        <button
          onClick={handleRefresh}
          className="text-[10px] text-text-muted hover:text-text-primary flex items-center gap-1 transition-colors"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-brand-teal' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-5 gap-1.5 pt-1">
        {forecast.map((f, i) => {
          const Icon = f.icon;
          return (
            <div
              key={f.day}
              className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-colors text-center ${
                i === 0 
                  ? 'bg-surface-secondary border-brand-teal/30' 
                  : 'bg-surface-secondary/40 border-border/60 hover:bg-surface-secondary/70'
              }`}
            >
              <span className="text-[10px] font-medium text-text-muted mb-1">{f.day}</span>
              <Icon className={`w-4 h-4 mb-1 ${
                f.type === 'sun' ? 'text-brand-amber' : f.type === 'rain' ? 'text-brand-blue' : 'text-text-secondary'
              }`} />
              <span className="text-[10px] font-mono text-text-muted mb-0.5">{f.rain}</span>
              <span className="text-xs font-semibold text-text-primary">{f.temp}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-between text-[10px] text-text-muted">
        <span>Tropical daylight</span>
        <span className="text-brand-teal font-medium">Warm & Sunny</span>
      </div>
    </div>
  );
};
