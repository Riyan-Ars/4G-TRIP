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
    <div className="workspace-card p-5 bg-card flex flex-col justify-between relative group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted">
          Group Chatter
        </span>
        <button
          onClick={onAddNote}
          className="w-5 h-5 rounded-full bg-card-secondary hover:bg-card-border flex items-center justify-center text-text-secondary hover:text-white transition-colors"
          title="Add Note"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      <div className="my-auto py-2">
        <Quote className="w-5 h-5 text-brand-mint/40 mb-2" />
        <p className="text-sm font-medium text-white/95 leading-relaxed italic">
          "{activeNote ? activeNote.content : "Loving the vibe of this Malaysia trip plan. Let's goooow!"}"
        </p>
      </div>

      <div className="pt-2 border-t border-card-border/60 flex items-center justify-between text-xs">
        <span className="text-text-secondary font-medium">
          {activeNote?.author_profile?.display_name || 'Reina Ariel'}
        </span>
        <span className="text-[10px] text-text-muted">Traveler Note</span>
      </div>
    </div>
  );
};
