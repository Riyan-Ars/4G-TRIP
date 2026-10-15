import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

export const PlanTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'A' | 'B'>('A');

  return (
    <div className="flex items-center gap-2 pt-1">
      {/* Plan A (Active) */}
      <div
        onClick={() => setActiveTab('A')}
        className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 cursor-pointer transition-colors ${
          activeTab === 'A'
            ? 'bg-surface-secondary border border-border text-text-primary shadow-subtle'
            : 'bg-surface text-text-muted hover:text-text-primary'
        }`}
      >
        <span>Plan A (Kuala Lumpur 4D3N)</span>
        <button
          type="button"
          className="text-text-muted hover:text-text-primary transition-colors"
          title="Active plan"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      {/* Plan B */}
      <div
        onClick={() => setActiveTab('B')}
        className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors ${
          activeTab === 'B'
            ? 'bg-surface-secondary border border-border text-text-primary shadow-subtle'
            : 'bg-surface text-text-muted hover:text-text-primary'
        }`}
      >
        <span>Plan B (Penang Route)</span>
      </div>

      {/* Add Plan Tab */}
      <button
        type="button"
        className="w-7 h-7 rounded-full bg-surface hover:bg-surface-secondary border border-border flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
        title="Add Variant Plan"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
