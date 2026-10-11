import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

export const PlanTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'A' | 'B'>('A');

  return (
    <div className="flex items-center gap-2 pt-2">
      {/* Plan A (Active) */}
      <div
        onClick={() => setActiveTab('A')}
        className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
          activeTab === 'A'
            ? 'bg-card border border-white/20 text-white shadow-sm'
            : 'bg-card-secondary/60 text-text-secondary hover:text-white'
        }`}
      >
        <span>Plan A (Kuala Lumpur 4D3N)</span>
        <button
          type="button"
          className="text-text-muted hover:text-white transition-colors"
          title="Active plan"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      {/* Plan B */}
      <div
        onClick={() => setActiveTab('B')}
        className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-all ${
          activeTab === 'B'
            ? 'bg-card border border-white/20 text-white shadow-sm'
            : 'bg-card-secondary/40 text-text-secondary hover:text-white'
        }`}
      >
        <span>Plan B (Penang Food Tour)</span>
      </div>

      {/* Add Plan Tab */}
      <button
        type="button"
        className="w-7 h-7 rounded-full bg-card hover:bg-card-secondary border border-card-border flex items-center justify-center text-text-secondary hover:text-white transition-colors"
        title="Add Variant Plan"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
