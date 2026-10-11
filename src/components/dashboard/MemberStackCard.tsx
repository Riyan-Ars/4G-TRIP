import React from 'react';
import { UserPlus, Shield, ChevronRight } from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { formatRupiah } from '../../lib/financial';
import { useNavigate } from 'react-router-dom';

interface MemberStackCardProps {
  onInviteMember: () => void;
}

export const MemberStackCard: React.FC<MemberStackCardProps> = ({ onInviteMember }) => {
  const { members, memberFinancials } = useTrip();
  const navigate = useNavigate();

  const leader = members.find((m) => m.role === 'owner') || members[0];
  const leaderFin = memberFinancials.find((mf) => mf.member.user_id === leader?.user_id);

  return (
    <div className="workspace-card p-5 bg-card flex flex-col justify-between relative overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          Travel Squad
        </h3>
        <button
          onClick={onInviteMember}
          className="text-[10px] text-brand-mint hover:underline font-semibold flex items-center gap-1"
        >
          <UserPlus className="w-3 h-3" />
          <span>Invite</span>
        </button>
      </div>

      {/* Playing card style member stack (reproduces reference visual tilt) */}
      <div className="relative h-40 my-2 flex items-center justify-center">
        {/* Background tilted card 2 */}
        <div className="absolute w-28 h-36 rounded-2xl bg-card-secondary border border-card-border rotate-[12deg] translate-x-3 translate-y-1 shadow-lg opacity-40" />

        {/* Background tilted card 1 */}
        <div className="absolute w-28 h-36 rounded-2xl bg-card-secondary border border-card-border rotate-[-8deg] -translate-x-3 translate-y-1 shadow-lg opacity-70" />

        {/* Foreground leader card */}
        <div 
          onClick={() => navigate('/members')}
          className="relative w-32 h-36 rounded-2xl bg-[#1c1c1c] border border-white/20 p-2.5 flex flex-col items-center justify-center text-center shadow-2xl z-10 cursor-pointer group hover:scale-105 transition-all"
        >
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-brand-mint/60 shadow-glow-mint mb-2">
            <img
              src={leader?.profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={leader?.profile?.display_name || 'Leader'}
              className="w-full h-full object-cover"
            />
          </div>

          <span className="text-xs font-bold text-white truncate max-w-full block leading-tight">
            {leader?.profile?.display_name || 'Alfikri Djati'}
          </span>

          <span className="text-[10px] uppercase tracking-wider text-brand-mint font-semibold mt-0.5">
            Leader
          </span>
        </div>
      </div>

      {/* Bottom stats summary */}
      <div className="pt-2 border-t border-card-border/60 flex items-center justify-between text-xs">
        <span className="text-[11px] text-text-muted">{members.length} Active Travelers</span>
        <button
          onClick={() => navigate('/members')}
          className="text-[11px] text-text-secondary hover:text-white flex items-center gap-0.5 transition-colors font-medium"
        >
          <span>Directory</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
