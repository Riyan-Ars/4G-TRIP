import React, { useState } from 'react';
import { 
  PiggyBank, Plus, CheckCircle2, XCircle, Clock, 
  ShieldCheck, TrendingUp, Users, ArrowUpRight, Check, AlertCircle, FileText 
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { formatRupiah } from '../lib/financial';
import { AddContributionModal } from '../components/modals/AddContributionModal';
import { EditBudgetModal } from '../components/modals/EditBudgetModal';

export const SavingsPage: React.FC = () => {
  const { 
    financialSummary, memberFinancials, 
    contributions, verifyContribution 
  } = useTrip();
  const { currentRole } = useAuth();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditBudgetOpen, setIsEditBudgetOpen] = useState(false);

  const canVerify = currentRole === 'owner' || currentRole === 'admin';

  const pendingContributions = contributions.filter((c) => c.status === 'pending');

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="workspace-card p-5 md:p-6 bg-surface flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="pill-badge bg-surface-secondary text-brand-teal border border-border">
              Group Treasury
            </span>
            <span className="text-xs text-text-muted">
              IDR Exact Integer Reconciliation
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-bold text-text-primary tracking-tight">
            Group Savings & Contributions
          </h1>

          <p className="text-xs text-text-secondary mt-1">
            Transparent group savings for Kuala Lumpur expedition. Only verified deposits increase the usable balance.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsEditBudgetOpen(true)}
            className="px-3.5 py-1.5 rounded-full bg-surface-secondary hover:bg-surface-elevated border border-border text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            Adjust Target
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-1.5 rounded-full bg-brand-accent hover:bg-blue-400 text-background text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Contribution</span>
          </button>
        </div>
      </div>

      {/* 4 Core Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Target */}
        <div className="workspace-card p-4 bg-surface border-border">
          <div className="text-[10px] uppercase font-semibold text-text-muted tracking-wider">
            Savings Target
          </div>
          <div className="text-xl font-bold text-text-primary mt-1 font-mono">
            {formatRupiah(financialSummary.target_amount)}
          </div>
          <div className="text-[11px] text-text-secondary mt-1">
            Group agreed goal
          </div>
        </div>

        {/* Metric 2: Verified Savings */}
        <div className="workspace-card p-4 bg-surface border-brand-teal/30">
          <div className="text-[10px] uppercase font-semibold text-brand-teal tracking-wider flex items-center justify-between">
            <span>Verified Savings</span>
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-xl font-bold text-text-primary mt-1 font-mono">
            {formatRupiah(financialSummary.total_verified_contributions)}
          </div>
          <div className="text-[11px] text-brand-teal font-semibold mt-1">
            {financialSummary.savings_progress_percentage}% funded
          </div>
        </div>

        {/* Metric 3: Pending Approvals */}
        <div className="workspace-card p-4 bg-surface border-border">
          <div className="text-[10px] uppercase font-semibold text-brand-amber tracking-wider flex items-center justify-between">
            <span>Pending Approvals</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-xl font-bold text-text-primary mt-1 font-mono">
            {formatRupiah(financialSummary.total_pending_contributions)}
          </div>
          <div className="text-[11px] text-text-muted mt-1">
            {pendingContributions.length} transfers in review
          </div>
        </div>

        {/* Metric 4: Available Balance */}
        <div className="workspace-card p-4 bg-surface border-border">
          <div className="text-[10px] uppercase font-semibold text-brand-blue tracking-wider flex items-center justify-between">
            <span>Available Balance</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-xl font-bold text-text-primary mt-1 font-mono">
            {formatRupiah(financialSummary.available_balance)}
          </div>
          <div className="text-[11px] text-text-secondary mt-1">
            After {formatRupiah(financialSummary.total_expenses)} spent
          </div>
        </div>
      </div>

      {/* Verification Queue (For Admins / Owners) */}
      <div className="workspace-card p-5 bg-surface border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-amber" />
            <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
              Verification Queue ({pendingContributions.length})
            </h3>
          </div>
          <span className="text-[11px] text-text-muted">
            {canVerify ? 'You have administrative rights' : 'Requires Admin or Owner role'}
          </span>
        </div>

        {pendingContributions.length === 0 ? (
          <div className="p-4 rounded-xl bg-surface-secondary/50 border border-border text-center text-xs text-text-muted">
            All submitted contributions are verified. No pending items.
          </div>
        ) : (
          <div className="space-y-2.5">
            {pendingContributions.map((c) => (
              <div
                key={c.id}
                className="p-3.5 rounded-xl bg-surface-secondary border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={c.member_profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover border border-white/10"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-text-primary">{c.member_profile?.display_name || 'Member'}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-amber/15 border border-brand-amber/30 text-brand-amber font-semibold uppercase">
                        Pending Verification
                      </span>
                    </div>
                    <div className="text-[11px] text-text-secondary mt-0.5">
                      {formatRupiah(c.amount)} • Method: {c.payment_method.replace('_', ' ')} • Ref: {c.reference_number || 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {canVerify ? (
                    <>
                      <button
                        onClick={() => verifyContribution(c.id, 'rejected', 'Invalid proof')}
                        className="px-3 py-1.5 rounded-full bg-surface-elevated hover:bg-rose-950/40 text-brand-rose border border-border text-xs font-medium flex items-center gap-1 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => verifyContribution(c.id, 'verified')}
                        className="px-3.5 py-1.5 rounded-full bg-brand-teal text-background font-bold text-xs hover:bg-emerald-400 flex items-center gap-1 transition-colors shadow-glow-mint"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Verify & Add</span>
                      </button>
                    </>
                  ) : (
                    <span className="text-[11px] text-text-muted italic">Awaiting Owner/Admin Review</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Member Savings Breakdown Matrix */}
      <div className="workspace-card p-5 bg-surface border-border">
        <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-4">
          Travel Squad Savings Progress
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {memberFinancials.map((mf) => (
            <div
              key={mf.member.id}
              className="p-4 rounded-xl bg-surface-secondary border border-border space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={mf.member.profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover border border-white/10"
                  />
                  <div>
                    <span className="text-xs font-bold text-text-primary block">
                      {mf.member.profile?.display_name}
                    </span>
                    <span className="text-[10px] text-text-muted uppercase tracking-wider">
                      {mf.member.role}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-bold text-brand-teal">
                  {mf.progressPercentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-surface-elevated overflow-hidden">
                <div
                  className="h-full bg-brand-teal rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(mf.progressPercentage, 100)}%` }}
                />
              </div>

              <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px]">
                <span className="text-text-muted">Verified:</span>
                <span className="text-text-primary font-mono font-semibold">{formatRupiah(mf.verifiedAmount)}</span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-text-muted">Target:</span>
                <span className="text-text-secondary font-mono">{formatRupiah(mf.targetAmount)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contribution History Table */}
      <div className="workspace-card p-5 bg-surface border-border">
        <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-3">
          Contribution History ({contributions.length})
        </h3>

        <div className="divide-y divide-border/60">
          {contributions.map((c) => (
            <div
              key={c.id}
              className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5"
            >
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                  c.status === 'verified'
                    ? 'bg-brand-teal/10 border-brand-teal/30 text-brand-teal'
                    : c.status === 'pending'
                    ? 'bg-brand-amber/10 border-brand-amber/30 text-brand-amber'
                    : 'bg-brand-rose/10 border-brand-rose/30 text-brand-rose'
                }`}>
                  {c.status === 'verified' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : c.status === 'pending' ? (
                    <Clock className="w-3.5 h-3.5" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-text-primary">
                      {c.member_profile?.display_name || 'Member'}
                    </span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider border ${
                      c.status === 'verified'
                        ? 'bg-brand-teal/15 text-brand-teal border-brand-teal/30'
                        : c.status === 'pending'
                        ? 'bg-brand-amber/15 text-brand-amber border-brand-amber/30'
                        : 'bg-brand-rose/15 text-brand-rose border-brand-rose/30'
                    }`}>
                      {c.status === 'verified' ? 'Verified' : c.status === 'pending' ? 'Pending Review' : 'Rejected'}
                    </span>
                  </div>
                  <div className="text-[11px] text-text-muted mt-0.5">
                    {c.payment_date} • {c.payment_method.replace('_', ' ')} • {c.notes || 'Group savings'}
                  </div>
                </div>
              </div>

              <div className="text-right self-end sm:self-center">
                <div className="text-xs font-bold font-mono text-text-primary">
                  +{formatRupiah(c.amount)}
                </div>
                <div className="text-[10px] text-text-muted">
                  Ref: {c.reference_number || 'N/A'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <AddContributionModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <EditBudgetModal isOpen={isEditBudgetOpen} onClose={() => setIsEditBudgetOpen(false)} />
    </div>
  );
};
