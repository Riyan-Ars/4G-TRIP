import React from 'react';
import { 
  CheckSquare, Plus, CheckCircle2, Circle, 
  FileText, Shirt, Glasses, HeartPulse, Wallet, Tag 
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface PackingMiniCardProps {
  onAddPackingItem: () => void;
}

export const PackingMiniCard: React.FC<PackingMiniCardProps> = ({ onAddPackingItem }) => {
  const { packing, togglePackingItem } = useTrip();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Show top 4 items
  const displayItems = packing.slice(0, 4);

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

  return (
    <div className="workspace-card p-5 bg-surface flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
          Packing Readiness
        </h3>
        <button
          onClick={onAddPackingItem}
          className="text-[11px] text-brand-blue hover:underline font-medium flex items-center gap-1"
        >
          <Plus className="w-3 h-3" />
          <span>Add</span>
        </button>
      </div>

      {/* Checklist items */}
      <div className="space-y-2 my-1">
        {displayItems.map((item) => {
          const Icon = getCategoryIcon(item.category);
          const isAssignedToCurrentUser = item.assigned_to === currentUser.id;

          return (
            <div
              key={item.id}
              onClick={() => togglePackingItem(item.id)}
              className="p-2 rounded-xl bg-surface-secondary/60 hover:bg-surface-secondary border border-border flex items-center justify-between gap-3 cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  type="button"
                  className="shrink-0 text-text-muted group-hover:text-text-primary transition-colors"
                  aria-label="Toggle completed"
                >
                  {item.is_completed ? (
                    <CheckCircle2 className="w-4 h-4 text-brand-teal" />
                  ) : (
                    <Circle className="w-4 h-4 text-text-muted" />
                  )}
                </button>

                <div className="w-6 h-6 rounded-lg bg-surface-elevated border border-border flex items-center justify-center shrink-0 text-text-muted group-hover:text-brand-blue">
                  <Icon className="w-3 h-3" />
                </div>

                <div className="min-w-0">
                  <span className={`text-xs block truncate ${
                    item.is_completed ? 'line-through text-text-muted' : 'text-text-primary font-medium'
                  }`}>
                    {item.title}
                  </span>
                </div>
              </div>

              {/* Assignee chip */}
              {isAssignedToCurrentUser ? (
                <span className="shrink-0 px-2 py-0.5 rounded-full bg-brand-accent/20 border border-brand-accent/30 text-brand-accent font-semibold text-[9px] uppercase tracking-wider">
                  You
                </span>
              ) : item.assigned_profile ? (
                <span className="shrink-0 px-2 py-0.5 rounded-full bg-surface-elevated border border-border text-text-muted text-[9px] truncate max-w-[70px]">
                  {item.assigned_profile.display_name.split(' ')[0]}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
        <span className="text-[11px] text-text-muted">
          {packing.filter((p) => p.is_completed).length} of {packing.length} packed
        </span>
        <button
          onClick={() => navigate('/packing-list')}
          className="text-[11px] text-brand-blue hover:underline font-medium"
        >
          Full Checklist →
        </button>
      </div>
    </div>
  );
};
