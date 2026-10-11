import React, { useState } from 'react';
import { 
  Search, Share2, Plus, Sparkles, MessageSquarePlus, 
  Menu, ShieldCheck, Database, Check, Copy, UserPlus 
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { useAuth } from '../../context/AuthContext';

interface TopBarProps {
  onOpenMobileMenu?: () => void;
  onOpenAddNote?: () => void;
  onOpenInvite?: () => void;
  onSearchChange?: (term: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenMobileMenu,
  onOpenAddNote,
  onOpenInvite,
  onSearchChange
}) => {
  const { members, trip } = useTrip();
  const { isSupabaseConnected } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (onSearchChange) onSearchChange(e.target.value);
  };

  const handleQuickShare = () => {
    if (onOpenInvite) {
      onOpenInvite();
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <header className="h-16 border-b border-card-border/80 bg-background/90 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile trigger & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-card border border-card-border text-text-secondary hover:text-white"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search activities, expenses, destinations..."
            className="w-full bg-card hover:bg-card-secondary/70 focus:bg-card-secondary border border-card-border focus:border-brand-mint/60 rounded-full py-1.5 pl-9 pr-4 text-xs text-text-primary placeholder:text-text-muted outline-none transition-all"
          />
        </div>
      </div>

      {/* Right Controls: Presence Avatars, Database Tag, Add Notes & Share */}
      <div className="flex items-center gap-3">
        {/* Supabase / Local Mode status badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-card-border text-[11px] font-medium text-text-secondary">
          <Database className={`w-3.5 h-3.5 ${isSupabaseConnected ? 'text-brand-mint' : 'text-brand-blue'}`} />
          <span>{isSupabaseConnected ? 'Supabase Live' : 'Local Storage Mode'}</span>
        </div>

        {/* Member Avatars Stack with presence tag (Matches reference top bar) */}
        <div className="flex items-center -space-x-2 pl-2">
          {members.slice(0, 3).map((m, idx) => (
            <div key={m.id} className="relative group" style={{ zIndex: 30 - idx }}>
              <img
                src={m.profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={m.profile?.display_name || 'Member'}
                className="w-8 h-8 rounded-full border-2 border-background object-cover ring-1 ring-card-border"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-brand-mint ring-2 ring-background" />
              {/* Tooltip */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 rounded bg-card border border-card-border text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-50">
                {m.profile?.display_name} ({m.role})
              </div>
            </div>
          ))}

          {members.length > 3 && (
            <div className="w-8 h-8 rounded-full bg-card border-2 border-background flex items-center justify-center text-[10px] font-bold text-text-secondary ring-1 ring-card-border">
              +{members.length - 3}
            </div>
          )}
        </div>

        {/* Add Note Button */}
        <button
          onClick={onOpenAddNote}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-card hover:bg-card-secondary border border-card-border text-xs font-semibold text-text-primary transition-all duration-200 hover:border-text-secondary"
        >
          <MessageSquarePlus className="w-3.5 h-3.5 text-brand-mint" />
          <span>Add Notes</span>
        </button>

        {/* Share / Invite Button (matches white pill in reference) */}
        <button
          onClick={handleQuickShare}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white hover:bg-slate-100 text-black text-xs font-bold transition-all duration-200 shadow-sm active:scale-95"
        >
          <Share2 className="w-3.5 h-3.5 text-black" />
          <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
        </button>
      </div>
    </header>
  );
};
