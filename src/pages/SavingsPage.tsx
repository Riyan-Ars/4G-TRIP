import React, { useState } from 'react';
import { 
  PiggyBank, Plus, CheckCircle2, XCircle, Clock, 
  ShieldCheck, AlertCircle, TrendingUp, Users, ArrowUpRight, FileText, Check 
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { formatRupiah } from '../lib/financial';
import { AddContributionModal } from '../components/modals/AddContributionModal';
import { EditBudgetModal } from '../components/modals/EditBudgetModal';

export const SavingsPage: React.FC = () => {
  const { 
    budget, financialSummary, memberFinancials, 
    contributions, verifyContribution 
  } = useTrip();
  const { currentRole } = useAuth();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditBudgetOpen, setIsEditBudgetOpen] = useState(false);

  const canVerify = currentRole === 'owner' || currentRole === 'admin';

  const pendingContributions = contributions.filter((c) => c.status === 'pending');
  const verifiedContributions = contributions.filter((c) => c.status === 'verified');

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="workspace-card p-6 bg-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="pill-badge bg-brand-mint/15 text-brand-mint border border-brand-mint/30 uppercase text-[10px] font-bold">
              Shared Treasury
            </span>
            <span className="text-xs text-text-secondary">
              IDR Exact Integer Calculations
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Group Savings & Contributions
          </h1>

          <p className="text-xs text-text-secondary mt-1">
            Track transparent peer savings for Malaysia Getaway. Only verified receipts increment the group treasury.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsEditBudgetOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-card-secondary hover:bg-card-border border border-card-border text-xs font-semibold text-white transition-colors"
          >
            Adjust Target
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2 rounded-xl bg-brand-mint hover:bg-emerald-400 text-black text-xs font-bold transition-all flex items-center gap-1.5 shadow-glow-mint active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Contribution</span>
          </button>
        </div>
      </div>

      {/* 4 Core Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="workspace-card p-4 bg-card border-card-border">
          <div className="text-[10px] uppercase font-bold text-text-muted tracking-wider">
            Savings Target
          </div>
          <div className="text-xl font-extrabold text-white mt-1">
            {formatRupiah(financialSummary.target_amount)}
          </div>
          <div className="text-[11px] text-text-secondary mt-1">
            Group agreed goal
          </div>
        </div>

        <div className="workspace-card p-4 bg-card border-brand-mint/30 shadow-glow-mint">
          <div className="text-[10px] uppercase font-bold text-brand-mint tracking-wider flex items-center justify-between">
            <span>Verified Savings</span>
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-xl font-extrabold text-white mt-1">
            {formatRupiah(financialSummary.total_verified_contributions)}
          </div>
          <div className="text-[11px] text-brand-mint font-semibold mt-1">
            {financialSummary.savings_progress_percentage}% achieved
          </div>
        </div>

        <div className="workspace-card p-4 bg-card border-card-border">
          <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider flex items-center justify-between">
            <span>Pending Approvals</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-xl font-extrabold text-white mt-1">
            {formatRupiah(financialSummary.total_pending_contributions)}
          </div>
          <div className="text-[11px] text-text-muted mt-1">
            {pendingContributions.length} transfers in review
          </div>
        </div>

        <div className="workspace-card p-4 bg-card border-card-border">
          <div className="text-[10px] uppercase font-bold text-brand-blue tracking-wider flex items-center justify-between">
            <span>Available Balance</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-xl font-extrabold text-white mt-1">
            {formatRupiah(financialSummary.available_balance)}
          </div>
          <div className="text-[11px] text-text-secondary mt-1">
            After {formatRupiah(financialSummary.total_expenses)} expenses
          </div>
        </div>
      </div>

      {/* Verification Queue (For Admins / Owners) */}
      <div className="workspace-card p-5 bg-card border-card-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Verification Queue ({pendingContributions.length})
            </h3>
          </div>
          <span className="text-[11px] text-text-muted">
            {canVerify ? 'You have administrative verification rights' : 'Requires Admin / Owner role'}
          </span>
        </div>

        {pendingContributions.length === 0 ? (
          <div className="p-4 rounded-xl bg-card-secondary/40 border border-card-border/60 text-center text-xs text-text-muted">
            All submitted contributions are verified. No pending transactions.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingContributions.map((c) => (
              <div
                key={c.id}
                className="p-3.5 rounded-xl bg-card-secondary border border-card-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={c.member_profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt=""
                    className="w-9 h-9 rounded-full object-cover border border-card-border"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{c.member_profile?.display_name || 'Member'}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 font-semibold uppercase">
                        Pending
                      </span>
                    </div>
                    <div className="text-[11px] text-text-secondary mt-0.5">
                      {formatRupiah(c.amount)} • {c.payment_method.replace('_', ' ')} • Ref: {c.reference_number || 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {canVerify ? (
                    <>
                      <button
                        onClick={() => verifyContribution(c.id, 'rejected', 'Invalid proof')}
                        className="px-3 py-1.5 rounded-xl bg-card hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 border border-card-border text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => verifyContribution(c.id, 'verified')}
                        className="px-4 py-1.5 rounded-xl bg-brand-mint text-black font-bold text-xs hover:bg-emerald-400 flex items-center gap-1 transition-colors shadow-glow-mint"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Verify & Add to Balance</span>
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
      <div className="workspace-card p-5 bg-card border-card-border">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
          Travel Squad Savings Progress
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {memberFinancials.map((mf) => (
            <div
              key={mf.member.id}
              className="p-4 rounded-xl bg-card-secondary border border-card-border space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={mf.member.profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {mf.member.profile?.display_name}
                    </span>
                    <span className="text-[10px] text-text-muted uppercase tracking-wider">
                      {mf.member.role}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-extrabold text-brand-mint">
                  {mf.progressPercentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-card overflow-hidden">
                <div
                  className="h-full bg-brand-mint rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(mf.progressPercentage, 100)}%` }}
                />
              </div>

              <div className="pt-2 border-t border-card-border/60 flex items-center justify-between text-[11px]">
                <span className="text-text-muted">Verified:</span>
                <span className="text-white font-semibold">{formatRupiah(mf.verifiedAmount)}</span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-text-muted">Individual Target:</span>
                <span className="text-text-secondary">{formatRupiah(mf.targetAmount)}</span>
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
