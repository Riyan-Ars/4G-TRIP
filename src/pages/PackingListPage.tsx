import React, { useState } from 'react';
import { 
  CheckSquare, Plus, CheckCircle2, Circle, 
  Trash2, FileText, Shirt, Glasses, HeartPulse, Wallet, Tag 
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
    { id: 'documents', label: 'Documents' },
    { id: 'clothing', label: 'Clothing & Wear' },
    { id: 'gear', label: 'Gear & Electronics' },
    { id: 'health', label: 'Health & Pharmacy' },
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
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="workspace-card p-5 md:p-6 bg-surface flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="pill-badge bg-surface-secondary text-brand-teal border border-border">
              Travel Readiness
            </span>
            <span className="text-xs text-text-muted">
              Pre-departure Checklist
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-bold text-text-primary tracking-tight">
            Mandatory Packing Checklist
          </h1>

          <p className="text-xs text-text-secondary mt-1">
            Ensure essential passports, universal adapters, emergency cash, and medications are packed before departure.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-1.5 rounded-full bg-brand-accent hover:bg-blue-400 text-background text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Progress Bar Card */}
      <div className="workspace-card p-4 bg-surface border-border flex items-center justify-between gap-4">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-text-primary">Packing Readiness</span>
            <span className="font-mono text-brand-teal font-semibold">
              {completedCount} of {packing.length} items packed ({progressPercentage}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-elevated overflow-hidden">
            <div
              className="h-full bg-brand-teal rounded-full transition-all duration-500"
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
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium shrink-0 transition-colors flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-brand-accent text-background font-bold shadow-sm'
                  : 'bg-surface hover:bg-surface-secondary border border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              <span>{c.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isSelected ? 'bg-black/20 text-black' : 'bg-surface-secondary text-text-muted'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Checklist Rows */}
      <div className="workspace-card overflow-hidden bg-surface border-border">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center text-xs text-text-muted">
            No packing items found in this category.
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {filteredItems.map((item) => {
              const Icon = getCategoryIcon(item.category);
              const isAssignedToCurrentUser = item.assigned_to === currentUser.id;

              return (
                <div
                  key={item.id}
                  onClick={() => togglePackingItem(item.id)}
                  className="p-3.5 md:p-4 hover:bg-surface-secondary/40 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      className="shrink-0 text-text-muted group-hover:text-text-primary transition-colors min-w-[24px] min-h-[24px] flex items-center justify-center"
                      aria-label="Toggle completed"
                    >
                      {item.is_completed ? (
                        <CheckCircle2 className="w-4.5 h-4.5 text-brand-teal" />
                      ) : (
                        <Circle className="w-4.5 h-4.5 text-text-muted" />
                      )}
                    </button>

                    <div className="w-7 h-7 rounded-lg bg-surface-elevated border border-border flex items-center justify-center shrink-0 text-text-muted group-hover:text-brand-blue">
                      <Icon className="w-3.5 h-3.5" />
                    </div>

                    <div className="min-w-0">
                      <span className={`text-xs md:text-sm block truncate ${
                        item.is_completed ? 'line-through text-text-muted' : 'text-text-primary font-medium'
                      }`}>
                        {item.title}
                      </span>
                      <span className="text-[10px] text-text-muted capitalize">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    {isAssignedToCurrentUser ? (
                      <span className="px-2 py-0.5 rounded-full bg-brand-accent/20 border border-brand-accent/30 text-brand-accent font-semibold text-[9px] uppercase tracking-wider">
                        You
                      </span>
                    ) : item.assigned_profile ? (
                      <span className="px-2 py-0.5 rounded-full bg-surface-elevated border border-border text-text-muted text-[10px]">
                        {item.assigned_profile.display_name.split(' ')[0]}
                      </span>
                    ) : null}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePackingItem(item.id);
                      }}
                      className="p-1.5 text-text-muted hover:text-brand-rose transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      <AddPackingItemModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
      />
    </div>
  );
};
