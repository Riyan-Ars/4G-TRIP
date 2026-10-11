import React, { useState } from 'react';
import { 
  PieChart, Plus, Edit3, Trash2, ShieldCheck, 
  History, DollarSign, AlertCircle, ArrowUpRight, TrendingUp 
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { formatRupiah, formatRupiahCompact } from '../lib/financial';
import { EditBudgetModal } from '../components/modals/EditBudgetModal';

export const BudgetPage: React.FC = () => {
  const { 
    budget, budgetHistory, categories, categoryBreakdown, 
    financialSummary, addBudgetCategory, updateBudgetCategory, 
    deleteBudgetCategory 
  } = useTrip();
  const { currentRole } = useAuth();
  
  const [isEditTargetOpen, setIsEditTargetOpen] = useState(false);
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatAmount, setNewCatAmount] = useState('1000000');
  const [newCatType, setNewCatType] = useState('custom');

  const canManage = currentRole === 'owner' || currentRole === 'admin';

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const amount = parseInt(newCatAmount.replace(/[^0-9]/g, '') || '0', 10);
    addBudgetCategory(newCatName.trim(), amount, newCatType);
    setNewCatName('');
    setNewCatAmount('1000000');
    setIsNewCategoryOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="workspace-card p-6 bg-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="pill-badge bg-brand-violet/15 text-brand-violet border border-brand-violet/30 uppercase text-[10px] font-bold">
              Allocation Architecture
            </span>
            <span className="text-xs text-text-secondary">
              Flexible Target & Spending Limits
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Flexible Budget Planner
          </h1>

          <p className="text-xs text-text-secondary mt-1">
            Manage categorical spending budgets, inspect burn rate, and adjust target savings dynamically.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {canManage && (
            <>
              <button
                onClick={() => setIsNewCategoryOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-card-secondary hover:bg-card-border border border-card-border text-xs font-semibold text-white transition-colors"
              >
                + New Category
              </button>
              <button
                onClick={() => setIsEditTargetOpen(true)}
                className="px-4 py-2 rounded-xl bg-brand-violet hover:bg-purple-300 text-black text-xs font-bold transition-all shadow-glow-violet active:scale-95"
              >
                Adjust Target Budget
              </button>
            </>
          )}
        </div>
      </div>

      {/* Distinction Banner: Savings Progress VS Spending Consumption (Prompt Section 8 requirement) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Metric 1: Savings Target Progress */}
        <div className="workspace-card p-5 bg-card border-brand-mint/40 shadow-glow-mint flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-brand-mint mb-1">
              <span>Savings Target Progress</span>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-2xl font-extrabold text-white mt-2">
              {financialSummary.savings_progress_percentage}%
            </div>
            <p className="text-xs text-text-secondary mt-1">
              {formatRupiah(financialSummary.total_verified_contributions)} verified out of {formatRupiah(financialSummary.target_amount)} total goal.
            </p>
          </div>

          <div className="w-full h-2.5 rounded-full bg-card-secondary mt-4 overflow-hidden">
            <div
              className="h-full bg-brand-mint rounded-full transition-all duration-500"
              style={{ width: `${Math.min(financialSummary.savings_progress_percentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Spending Budget Consumption */}
        <div className="workspace-card p-5 bg-card border-brand-orange/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-brand-orange mb-1">
              <span>Spending Budget Consumption</span>
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="text-2xl font-extrabold text-white mt-2">
              {financialSummary.spending_budget_consumption_percentage}%
            </div>
            <p className="text-xs text-text-secondary mt-1">
              {formatRupiah(financialSummary.total_expenses)} recorded expenses out of {formatRupiah(financialSummary.total_allocated_budget)} allocated categories.
            </p>
          </div>

          <div className="w-full h-2.5 rounded-full bg-card-secondary mt-4 overflow-hidden">
            <div
              className="h-full bg-brand-orange rounded-full transition-all duration-500"
              style={{ width: `${Math.min(financialSummary.spending_budget_consumption_percentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="workspace-card p-5 bg-card border-card-border space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Budget Categories ({categories.length})
          </h3>
          <span className="text-xs text-text-muted">
            Total Allocated: <span className="text-white font-semibold">{formatRupiah(financialSummary.total_allocated_budget)}</span>
          </span>
        </div>

        <div className="divide-y divide-card-border/60">
          {categoryBreakdown.map((item) => (
            <div
              key={item.category.id}
              className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
            >
              <div className="space-y-1 flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white truncate">
                    {item.category.name}
                  </span>
                  {item.isOverBudget && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-bold uppercase">
                      Over Budget
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-card-secondary overflow-hidden max-w-md">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.isOverBudget ? 'bg-rose-500' : 'bg-brand-mint'
                    }`}
                    style={{ width: `${Math.min(item.percentageUsed, 100)}%` }}
                  />
                </div>

                <div className="text-[11px] text-text-muted flex items-center gap-3 pt-0.5">
                  <span>Spent: <span className="text-text-primary font-medium">{formatRupiah(item.spent)}</span></span>
                  <span>•</span>
                  <span>Remaining: <span className={item.remaining < 0 ? 'text-rose-400 font-bold' : 'text-brand-mint'}>{formatRupiah(item.remaining)}</span></span>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 self-end sm:self-center">
                <div className="text-right">
                  <span className="text-sm font-bold text-white block">
                    {formatRupiah(item.allocated)}
                  </span>
                  <span className="text-[10px] text-text-muted">
                    {item.percentageUsed}% consumed
                  </span>
                </div>

                {canManage && (
                  <button
                    onClick={() => deleteBudgetCategory(item.category.id)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-rose-400 hover:bg-card-secondary transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Budget Revision History Log (Section 8 requirement) */}
      <div className="workspace-card p-5 bg-card border-card-border space-y-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-brand-mint" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Budget Revision History
          </h3>
        </div>

        <div className="space-y-2">
          {budgetHistory.map((h, i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-card-secondary/70 border border-card-border flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-white">{formatRupiah(h.amount)}</span>
                <span className="text-text-secondary ml-2">— {h.note}</span>
              </div>
              <span className="text-[11px] text-text-muted">
                {new Date(h.date).toLocaleDateString('id-ID')} by {h.updatedBy}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* New Category Modal */}
      {isNewCategoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-card border border-card-border rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Create Budget Category</h3>
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="E.g. Travel Souvenirs & Gifts"
                  className="w-full bg-card-secondary border border-card-border focus:border-brand-mint rounded-xl py-2 px-3 text-xs text-white outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Allocated Amount (IDR)
                </label>
                <input
                  type="text"
                  required
                  value={newCatAmount}
                  onChange={(e) => setNewCatAmount(e.target.value)}
                  placeholder="1.000.000"
                  className="w-full bg-card-secondary border border-card-border focus:border-brand-mint rounded-xl py-2 px-3 text-xs text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewCategoryOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-mint text-black hover:bg-emerald-400"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Budget Modal */}
      <EditBudgetModal isOpen={isEditTargetOpen} onClose={() => setIsEditTargetOpen(false)} />
    </div>
  );
};
