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

  return (
    <div className="workspace-card p-5 bg-surface flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
          Travel Squad ({members.length})
        </h3>
        <button
          onClick={onInviteMember}
          className="text-[11px] text-brand-blue hover:underline font-medium flex items-center gap-1"
        >
          <UserPlus className="w-3 h-3" />
          <span>Invite</span>
        </button>
      </div>

      {/* Member rows using real members */}
      <div className="space-y-2 my-1">
        {members.slice(0, 3).map((m) => {
          const fin = memberFinancials.find((mf) => mf.member.user_id === m.user_id);
          return (
            <div
              key={m.id}
              onClick={() => navigate('/members')}
              className="p-2.5 rounded-xl bg-surface-secondary/70 hover:bg-surface-secondary border border-border flex items-center justify-between gap-2.5 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={m.profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={m.profile?.display_name || 'Member'}
                  className="w-7 h-7 rounded-full object-cover border border-white/10 shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-xs font-medium text-text-primary truncate block leading-tight">
                    {m.profile?.display_name}
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-text-muted">
                    {m.role}
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-[11px] font-mono font-semibold text-text-primary">
                  {formatRupiah(fin?.verifiedAmount || 0)}
                </div>
                <span className="text-[9px] text-brand-teal font-semibold">
                  {fin?.progressPercentage || 0}% target
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom stats summary */}
      <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
        <span className="text-[11px] text-text-muted">{members.length} Active Travelers</span>
        <button
          onClick={() => navigate('/members')}
          className="text-[11px] text-text-secondary hover:text-text-primary flex items-center gap-0.5 transition-colors font-medium"
        >
          <span>All Members</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
