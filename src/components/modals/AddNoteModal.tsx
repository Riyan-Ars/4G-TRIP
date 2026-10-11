import React, { useState } from 'react';
import { X, MessageSquare, Send } from 'lucide-react';
import { useTrip } from '../../context/TripContext';

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddNoteModal: React.FC<AddNoteModalProps> = ({ isOpen, onClose }) => {
  const { addGroupNote } = useTrip();
  const [content, setContent] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    addGroupNote(content.trim());
    setContent('');
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

        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-brand-mint/10 border border-brand-mint/30 flex items-center justify-center text-brand-mint">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Add Shared Trip Note</h3>
            <p className="text-xs text-text-secondary">Visible to all travelers in Malaysia Getaway</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="E.g., Reminder to prepare currency exchange at Bandara SIM before boarding..."
              className="w-full bg-card-secondary border border-card-border focus:border-brand-mint/60 rounded-xl p-3 text-sm text-white placeholder:text-text-muted outline-none resize-none transition-colors"
              autoFocus
            />
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
              disabled={!content.trim()}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-mint text-black hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-glow-mint"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post Note</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
