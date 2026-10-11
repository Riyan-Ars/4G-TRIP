import React, { useState } from 'react';
import { X, CheckSquare, Plus } from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { PackingCategory } from '../../types';

interface AddPackingItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddPackingItemModal: React.FC<AddPackingItemModalProps> = ({ isOpen, onClose }) => {
  const { addPackingItem, members } = useTrip();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PackingCategory>('documents');
  const [assignedTo, setAssignedTo] = useState(members[0]?.user_id || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addPackingItem(title.trim(), category, assignedTo);
    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-card border border-card-border rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-text-secondary hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-10 h-10 rounded-xl bg-brand-mint/15 border border-brand-mint/30 flex items-center justify-center text-brand-mint">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Add Packing Item</h3>
            <p className="text-xs text-text-secondary">Keep essential gear and documents organized</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">
              Item Name / Description
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g. Travel adapter (Type G), E-Visa copy, Sunscreen"
              className="w-full bg-card-secondary border border-card-border focus:border-brand-mint rounded-xl py-2 px-3 text-xs text-white placeholder:text-text-muted outline-none"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PackingCategory)}
                className="w-full bg-card-secondary border border-card-border focus:border-brand-mint rounded-xl py-2 px-3 text-xs text-white outline-none cursor-pointer"
              >
                <option value="documents">Travel Documents</option>
                <option value="clothing">Clothing & Wear</option>
                <option value="gear">Gear & Gadgets</option>
                <option value="health">Health & Care</option>
                <option value="finance">Money & Cards</option>
                <option value="other">Other Items</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Assignee
              </label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full bg-card-secondary border border-card-border focus:border-brand-mint rounded-xl py-2 px-3 text-xs text-white outline-none cursor-pointer"
              >
                {members.map((m) => (
                  <option key={m.user_id} value={m.user_id}>
                    {m.profile?.display_name || m.user_id}
                  </option>
                ))}
              </select>
            </div>
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
              disabled={!title.trim()}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-mint text-black hover:bg-emerald-400 disabled:opacity-40 transition-all flex items-center gap-1.5 shadow-glow-mint"
            >
              <Plus className="w-4 h-4" />
              <span>Add Checklist Item</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
