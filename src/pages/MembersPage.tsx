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
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="workspace-card p-6 bg-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="pill-badge bg-brand-mint/15 text-brand-mint border border-brand-mint/30 uppercase text-[10px] font-bold">
              Travel Squad
            </span>
            <span className="text-xs text-text-secondary">
              Role-Based Access Control
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Group Members ({members.length})
          </h1>

          <p className="text-xs text-text-secondary mt-1">
            Manage trip contributors, assign administrative permissions, and track individual savings progress.
          </p>
        </div>

        <button
          onClick={() => setIsInviteOpen(true)}
          className="px-4 py-2 rounded-xl bg-brand-mint hover:bg-emerald-400 text-black text-xs font-bold transition-all flex items-center gap-1.5 shadow-glow-mint active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite New Traveler</span>
        </button>
      </div>

      {/* Role Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-card border border-card-border space-y-1">
          <div className="text-xs font-bold text-brand-orange uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Owner (Leader)</span>
          </div>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            Full trip control: manage budget targets, change member roles, delete trip or verify contributions.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-card border border-card-border space-y-1">
          <div className="text-xs font-bold text-brand-blue uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </div>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            Operational manager: verify savings transfers, record expenses, edit day itinerary activities.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-card border border-card-border space-y-1">
          <div className="text-xs font-bold text-brand-mint uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>Member</span>
          </div>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            Submit savings receipts, toggle checklist items, contribute notes, view transparent financial ledger.
          </p>
        </div>
      </div>

      {/* Member Directory List */}
      <div className="workspace-card overflow-hidden bg-card border-card-border">
        <div className="p-4 border-b border-card-border/60 flex items-center justify-between text-xs font-bold text-text-muted uppercase tracking-wider">
          <span>Traveler</span>
          <span>Role & Savings Progress</span>
        </div>

        <div className="divide-y divide-card-border/60">
          {members.map((member) => {
            const fin = memberFinancials.find((mf) => mf.member.user_id === member.user_id);
            const isCurrentUser = member.user_id === currentUser.id;

            return (
              <div
                key={member.id}
                className="p-4 hover:bg-card-secondary/40 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <img
                      src={member.profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt=""
                      className="w-11 h-11 rounded-full object-cover border-2 border-card-border"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-card" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{member.profile?.display_name}</span>
                      {isCurrentUser && (
                        <span className="px-2 py-0.5 rounded-full bg-brand-orange text-black font-extrabold text-[9px] uppercase">
                          You
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-text-secondary mt-0.5">
                      {member.profile?.email || 'traveler@4gtrip.com'} • Joined {new Date(member.joined_at).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                </div>

                {/* Right: Role selection & Savings */}
                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-xs font-bold text-white block">
                      {formatRupiah(fin?.verifiedAmount || 0)}
                    </span>
                    <span className="text-[10px] text-brand-mint font-semibold">
                      {fin?.progressPercentage || 0}% of target
                    </span>
                  </div>

                  {/* Role Dropdown (Editable by Owner) */}
                  {isOwner && member.role !== 'owner' ? (
                    <select
                      value={member.role}
                      onChange={(e) => updateMemberRole(member.user_id, e.target.value as UserRole)}
                      className="bg-card-secondary border border-card-border rounded-xl text-xs py-1.5 px-2.5 text-white outline-none cursor-pointer"
                    >
                      <option value="admin">Admin</option>
                      <option value="member">Member</option>
                    </select>
                  ) : (
                    <span className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      member.role === 'owner'
                        ? 'bg-brand-orange/15 text-brand-orange border border-brand-orange/30'
                        : member.role === 'admin'
                        ? 'bg-brand-blue/15 text-brand-blue border border-brand-blue/30'
                        : 'bg-card-secondary text-text-secondary'
                    }`}>
                      {member.role}
                    </span>
                  )}

                  {isOwner && member.role !== 'owner' && (
                    <button
                      onClick={() => removeMember(member.user_id)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-rose-400 hover:bg-card-secondary transition-colors"
                      title="Remove member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <InviteMemberModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
    </div>
  );
};
