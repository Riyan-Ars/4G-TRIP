import React, { useState } from 'react';
import { 
  CheckSquare, Plus, CheckCircle2, Circle, 
  Trash2, FileText, Shirt, Glasses, HeartPulse, Wallet, Tag, User 
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { AddPackingItemModal } from '../components/modals/AddPackingItemModal';

export const PackingListPage: React.FC = () => {
  const { packing, togglePackingItem, deletePackingItem } = useTrip();
  const { currentUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'documents', label: 'Travel Documents' },
    { id: 'clothing', label: 'Clothing & Wear' },
    { id: 'gear', label: 'Gear & Gadgets' },
    { id: 'health', label: 'Health & Care' },
    { id: 'finance', label: 'Finance & Cards' },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'documents': return FileText;
      case 'clothing': return Shirt;
      case 'gear': return Glasses;
      case 'health': return HeartPulse;
      case 'finance': return Wallet;
      default: return Tag;
    }
  };

  const filteredItems = selectedCategory === 'all'
    ? packing
    : packing.filter((p) => p.category === selectedCategory);

  const completedCount = packing.filter((p) => p.is_completed).length;
  const progressPercentage = packing.length > 0 ? Math.round((completedCount / packing.length) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="workspace-card p-6 bg-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="pill-badge bg-brand-mint/15 text-brand-mint border border-brand-mint/30 uppercase text-[10px] font-bold">
              Shared Checklist
            </span>
            <span className="text-xs text-text-secondary">
              Travel Readiness
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Mandatory Packing Checklist
          </h1>

          <p className="text-xs text-text-secondary mt-1">
            Ensure no essential documents, adapters, or medications are left behind in Banda Aceh.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2 rounded-xl bg-brand-mint hover:bg-emerald-400 text-black text-xs font-bold transition-all flex items-center gap-1.5 shadow-glow-mint active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Packing Item</span>
        </button>
      </div>

      {/* Progress Bar Card */}
      <div className="workspace-card p-4 bg-card border-card-border flex items-center justify-between gap-4">
        <div className="space-y-1 flex-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-white">Packing Progress</span>
            <span className="font-mono text-brand-mint font-bold">{completedCount} of {packing.length} items packed ({progressPercentage}%)</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-card-secondary overflow-hidden">
            <div
              className="h-full bg-brand-mint rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((c) => {
          const isSelected = selectedCategory === c.id;
          const count = c.id === 'all' ? packing.length : packing.filter((p) => p.category === c.id).length;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-brand-mint text-black font-bold shadow-glow-mint'
                  : 'bg-card hover:bg-card-secondary border border-card-border text-text-secondary hover:text-white'
              }`}
            >
              <span>{c.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-black/20 text-black' : 'bg-card-secondary text-text-muted'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Items List */}
      <div className="workspace-card overflow-hidden bg-card border-card-border">
        <div className="divide-y divide-card-border/60">
          {filteredItems.map((item) => {
            const Icon = getCategoryIcon(item.category);
            const isAssignedToCurrentUser = item.assigned_to === currentUser.id;

            return (
              <div
                key={item.id}
                className="p-3.5 hover:bg-card-secondary/40 transition-colors flex items-center justify-between gap-3 group"
              >
                <div 
                  onClick={() => togglePackingItem(item.id)}
                  className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                >
                  <button
                    type="button"
                    className="shrink-0 text-text-secondary group-hover:text-white transition-colors"
                  >
                    {item.is_completed ? (
                      <CheckCircle2 className="w-5 h-5 text-brand-mint" />
                    ) : (
                      <Circle className="w-5 h-5 text-text-muted" />
                    )}
                  </button>

                  <div className="w-7 h-7 rounded-lg bg-card-secondary border border-card-border flex items-center justify-center shrink-0 text-text-secondary group-hover:text-brand-mint">
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  <span className={`text-xs block truncate ${
                    item.is_completed ? 'line-through text-text-muted' : 'text-text-primary font-medium'
                  }`}>
                    {item.title}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {isAssignedToCurrentUser ? (
                    <span className="px-2 py-0.5 rounded-full bg-brand-orange text-black font-extrabold text-[9px] uppercase tracking-wider">
                      You
                    </span>
                  ) : item.assigned_profile ? (
                    <div className="flex items-center gap-1 text-[11px] text-text-secondary bg-card-secondary px-2.5 py-0.5 rounded-full border border-card-border">
                      <User className="w-3 h-3 text-brand-mint" />
                      <span>{item.assigned_profile.display_name.split(' ')[0]}</span>
                    </div>
                  ) : null}

                  <button
                    onClick={() => deletePackingItem(item.id)}
                    className="p-1 rounded-lg text-text-muted hover:text-rose-400 hover:bg-card-secondary transition-colors"
                    title="Remove Item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AddPackingItemModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  );
};
