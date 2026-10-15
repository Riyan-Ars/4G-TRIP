import React, { useState } from 'react';
import { 
  Search, Share2, MessageSquarePlus, 
  Menu, Database, Check 
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
  const { members } = useTrip();
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
    <header className="h-15 border-b border-border/70 bg-background/90 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30 shrink-0">
      {/* Left: Mobile trigger & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-surface border border-border text-text-secondary hover:text-text-primary transition-colors"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-4.5 h-4.5" />
        </button>

        <div className="relative w-full max-w-xs md:max-w-sm">
          <Search className="w-3.5 h-3.5 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search activities, expenses, places..."
            className="w-full bg-surface hover:bg-surface-secondary/70 focus:bg-surface-secondary border border-border focus:border-brand-blue/50 rounded-full py-1.5 pl-9 pr-4 text-xs text-text-primary placeholder:text-text-muted outline-none transition-colors"
          />
        </div>
      </div>

      {/* Right Controls: Presence Avatars, Database Tag, Add Notes & Share */}
      <div className="flex items-center gap-2.5">
        {/* Supabase / Local Mode status badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface border border-border text-[11px] font-medium text-text-secondary">
          <Database className={`w-3.5 h-3.5 ${isSupabaseConnected ? 'text-brand-teal' : 'text-brand-blue'}`} />
          <span>{isSupabaseConnected ? 'Supabase Live' : 'Local Storage'}</span>
        </div>

        {/* Member Avatars Stack */}
        <div className="flex items-center -space-x-2 pl-1">
          {members.slice(0, 3).map((m, idx) => (
            <div key={m.id} className="relative group" style={{ zIndex: 30 - idx }}>
              <img
                src={m.profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={m.profile?.display_name || 'Member'}
                className="w-7 h-7 rounded-full border-2 border-background object-cover ring-1 ring-border"
              />
              <span className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full bg-brand-teal ring-1 ring-background" />
              {/* Tooltip */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-2 py-0.5 rounded-md bg-surface-elevated border border-border text-[10px] text-text-primary opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-elevated z-50">
                {m.profile?.display_name} ({m.role})
              </div>
            </div>
          ))}

          {members.length > 3 && (
            <div className="w-7 h-7 rounded-full bg-surface border-2 border-background flex items-center justify-center text-[10px] font-semibold text-text-muted ring-1 ring-border">
              +{members.length - 3}
            </div>
          )}
        </div>

        {/* Add Note Button */}
        <button
          onClick={onOpenAddNote}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface hover:bg-surface-secondary border border-border text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          <MessageSquarePlus className="w-3.5 h-3.5 text-brand-blue" />
          <span>Note</span>
        </button>

        {/* Share / Invite Button */}
        <button
          onClick={handleQuickShare}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-accent/15 hover:bg-brand-accent/25 border border-brand-accent/30 text-brand-accent text-xs font-semibold transition-all active:scale-95"
        >
          {copiedLink ? <Check className="w-3.5 h-3.5 text-brand-teal" /> : <Share2 className="w-3.5 h-3.5 text-brand-accent" />}
          <span>{copiedLink ? 'Copied' : 'Share'}</span>
        </button>
      </div>
    </header>
  );
};
