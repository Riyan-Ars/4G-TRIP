import React from 'react';
import { MessageSquare, Quote, Plus } from 'lucide-react';
import { useTrip } from '../../context/TripContext';

interface QuoteNoteCardProps {
  onAddNote: () => void;
}

export const QuoteNoteCard: React.FC<QuoteNoteCardProps> = ({ onAddNote }) => {
  const { notes } = useTrip();

  // Pick pinned note or first note
  const activeNote = notes.find((n) => n.is_pinned) || notes[0];

  return (
    <div className="workspace-card p-5 bg-surface flex flex-col justify-between relative group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase font-semibold tracking-wider text-text-muted">
          Group Memo
        </span>
        <button
          onClick={onAddNote}
          className="w-5 h-5 rounded-full bg-surface-secondary hover:bg-surface-elevated flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
          title="Add Memo"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      <div className="my-auto py-2">
        <Quote className="w-4 h-4 text-brand-blue/50 mb-2" />
        <p className="text-xs sm:text-sm font-medium text-text-primary leading-relaxed">
          {activeNote ? `"${activeNote.content}"` : '"Don\'t forget to convert emergency cash to MYR and ensure passport validity is > 6 months."'}
        </p>
      </div>

      <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
        <span className="text-text-secondary font-medium">
          {activeNote?.author_profile?.display_name || 'Travel Memo'}
        </span>
        <span className="text-[10px] text-text-muted">
          {activeNote ? 'Pinned Note' : 'Travel Tip'}
        </span>
      </div>
    </div>
  );
};
