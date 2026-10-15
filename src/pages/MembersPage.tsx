import React, { useState } from 'react';
import { 
  Users, UserPlus, Shield, ShieldCheck, Mail, 
  Trash2, ChevronDown, Check, AlertCircle 
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { formatRupiah } from '../lib/financial';
import { UserRole } from '../types';
import { InviteMemberModal } from '../components/modals/InviteMemberModal';

export const MembersPage: React.FC = () => {
  const { members, memberFinancials, updateMemberRole, removeMember } = useTrip();
  const { currentRole, currentUser } = useAuth();
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const isOwner = currentRole === 'owner';

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="workspace-card p-5 md:p-6 bg-surface flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="pill-badge bg-surface-secondary text-brand-teal border border-border">
              Travel Squad
            </span>
            <span className="text-xs text-text-muted">
              Role-Based Collaboration
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-bold text-text-primary tracking-tight">
            Group Members ({members.length})
          </h1>

          <p className="text-xs text-text-secondary mt-1">
            Manage trip contributors, assign roles and administrative permissions, and track individual savings.
          </p>
        </div>

        <button
          onClick={() => setIsInviteOpen(true)}
          className="px-4 py-1.5 rounded-full bg-brand-accent hover:bg-blue-400 text-background text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Invite Traveler</span>
        </button>
      </div>

      {/* Role Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1">
          <div className="text-xs font-bold text-brand-orange uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Owner</span>
          </div>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            Full trip control: manage budget targets, assign member roles, and verify group contributions.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1">
          <div className="text-xs font-bold text-brand-blue uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </div>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            Operational manager: verify savings receipts, record group expenses, and edit timeline activities.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1">
          <div className="text-xs font-bold text-brand-teal uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>Member</span>
          </div>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            Submit savings transfers, check off items on packing lists, and view transparent financial ledgers.
          </p>
        </div>
      </div>

      {/* Member Directory List */}
      <div className="workspace-card overflow-hidden bg-surface border-border">
        <div className="p-3.5 md:p-4 border-b border-border/60 flex items-center justify-between text-xs font-semibold text-text-muted uppercase tracking-wider">
          <span>Traveler</span>
          <span>Savings & Role</span>
        </div>

        <div className="divide-y divide-border/60">
          {members.map((member) => {
            const fin = memberFinancials.find((mf) => mf.member.user_id === member.user_id);
            const isCurrentUser = member.user_id === currentUser.id;

            return (
              <div
                key={member.id}
                className="p-3.5 md:p-4 hover:bg-surface-secondary/40 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Traveler profile */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={member.profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt=""
                      className="w-9 h-9 rounded-full object-cover border border-white/10"
                    />
                    {isCurrentUser && (
                      <span className="absolute -bottom-1 -right-1 px-1 py-0.2 bg-brand-accent text-background text-[8px] font-extrabold rounded-full">
                        You
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-text-primary">
                        {member.profile?.display_name || 'Traveler'}
                      </span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider border ${
                        member.role === 'owner'
                          ? 'bg-brand-orange/15 text-brand-orange border-brand-orange/30'
                          : member.role === 'admin'
                          ? 'bg-brand-blue/15 text-brand-blue border-brand-blue/30'
                          : 'bg-brand-teal/15 text-brand-teal border-brand-teal/30'
                      }`}>
                        {member.role}
                      </span>
                    </div>

                    <div className="text-[11px] text-text-muted mt-0.5">
                      Joined {member.joined_at?.split('T')[0] || 'Recently'}
                    </div>
                  </div>
                </div>

                {/* Savings status & Role management */}
                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-text-primary">
                      {formatRupiah(fin?.verifiedAmount || 0)}
                    </div>
                    <div className="text-[10px] text-text-muted">
                      Target: {formatRupiah(fin?.targetAmount || 0)} ({fin?.progressPercentage || 0}%)
                    </div>
                  </div>

                  {isOwner && !isCurrentUser && (
                    <div className="flex items-center gap-2">
                      <select
                        value={member.role}
                        onChange={(e) => updateMemberRole(member.id, e.target.value as UserRole)}
                        className="bg-surface-secondary text-text-secondary border border-border text-[11px] rounded-lg px-2 py-1 outline-none"
                      >
                        <option value="admin">Admin</option>
                        <option value="member">Member</option>
                      </select>

                      <button
                        onClick={() => removeMember(member.id)}
                        className="p-1.5 text-text-muted hover:text-brand-rose transition-colors"
                        title="Remove member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Invite Modal */}
      <InviteMemberModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
      />
    </div>
  );
};
