import React, { useState } from 'react';
import { 
  PieChart, Plus, Edit3, Trash2, ShieldCheck, 
  History, DollarSign, AlertCircle, TrendingUp 
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { formatRupiah, formatRupiahCompact } from '../lib/financial';
import { EditBudgetModal } from '../components/modals/EditBudgetModal';

export const BudgetPage: React.FC = () => {
  const { 
    budget, categories, categoryBreakdown, 
    financialSummary, addBudgetCategory, 
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
    addBudgetCategory(newCatName.trim(), amount, newCatType as any);
    setNewCatName('');
    setNewCatAmount('1000000');
    setIsNewCategoryOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="workspace-card p-5 md:p-6 bg-surface flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="pill-badge bg-surface-secondary text-brand-blue border border-border">
              Allocation Architecture
            </span>
            <span className="text-xs text-text-muted">
              Flexible Target & Spending Limits
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-bold text-text-primary tracking-tight">
            Budget Allocation & Expense Control
          </h1>

          <p className="text-xs text-text-secondary mt-1">
            Compare categorical budget caps with actual spent amounts, monitor burn rates, and adjust targets.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {canManage && (
            <>
              <button
                onClick={() => setIsNewCategoryOpen(true)}
                className="px-3.5 py-1.5 rounded-full bg-surface-secondary hover:bg-surface-elevated border border-border text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                + New Category
              </button>
              <button
                onClick={() => setIsEditTargetOpen(true)}
                className="px-4 py-1.5 rounded-full bg-brand-accent hover:bg-blue-400 text-background text-xs font-bold transition-all shadow-sm active:scale-95"
              >
                Adjust Target
              </button>
            </>
          )}
        </div>
      </div>

      {/* Distinction Banner: Savings Progress VS Spending Consumption */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Metric 1: Savings Target Progress */}
        <div className="workspace-card p-5 bg-surface border-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-brand-teal mb-1">
              <span>Savings Target Progress</span>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-xl md:text-2xl font-bold text-text-primary mt-2 font-mono">
              {financialSummary.savings_progress_percentage}%
            </div>
            <p className="text-xs text-text-secondary mt-1">
              {formatRupiah(financialSummary.total_verified_contributions)} verified out of {formatRupiah(financialSummary.target_amount)} total goal.
            </p>
          </div>

          <div className="w-full h-2 rounded-full bg-surface-elevated mt-4 overflow-hidden">
            <div
              className="h-full bg-brand-teal rounded-full transition-all duration-500"
              style={{ width: `${Math.min(financialSummary.savings_progress_percentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Spending Consumption */}
        <div className="workspace-card p-5 bg-surface border-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-brand-orange mb-1">
              <span>Total Spending Burn</span>
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="text-xl md:text-2xl font-bold text-text-primary mt-2 font-mono">
              {financialSummary.spending_budget_consumption_percentage}%
            </div>
            <p className="text-xs text-text-secondary mt-1">
              {formatRupiah(financialSummary.total_expenses)} spent of {formatRupiah(financialSummary.total_allocated_budget || financialSummary.target_amount)} allocated budget.
            </p>
          </div>

          <div className="w-full h-2 rounded-full bg-surface-elevated mt-4 overflow-hidden">
            <div
              className="h-full bg-brand-orange rounded-full transition-all duration-500"
              style={{ width: `${Math.min(financialSummary.spending_budget_consumption_percentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* New Category Drawer / Inline Form */}
      {isNewCategoryOpen && (
        <form
          onSubmit={handleCreateCategory}
          className="workspace-card p-4 bg-surface-secondary border-border space-y-3 animate-slide-up"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Create Budget Category
            </h4>
            <button
              type="button"
              onClick={() => setIsNewCategoryOpen(false)}
              className="text-xs text-text-muted hover:text-text-primary"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-text-muted uppercase font-medium block mb-1">Name</label>
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Souvenirs & Gifts"
                required
                className="w-full bg-surface border border-border rounded-xl px-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted outline-none focus:border-brand-blue"
              />
            </div>
            <div>
              <label className="text-[10px] text-text-muted uppercase font-medium block mb-1">Allocated Amount (IDR)</label>
              <input
                type="text"
                value={newCatAmount}
                onChange={(e) => setNewCatAmount(e.target.value)}
                placeholder="1000000"
                required
                className="w-full bg-surface border border-border rounded-xl px-3 py-1.5 text-xs text-text-primary font-mono outline-none focus:border-brand-blue"
              />
            </div>
            <div>
              <label className="text-[10px] text-text-muted uppercase font-medium block mb-1">Category Type</label>
              <select
                value={newCatType}
                onChange={(e) => setNewCatType(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl px-3 py-1.5 text-xs text-text-primary outline-none focus:border-brand-blue"
              >
                <option value="flights">Flights & Airfare</option>
                <option value="accommodation">Accommodation</option>
                <option value="food">Food & Dining</option>
                <option value="transport">Local Transport</option>
                <option value="attractions">Attractions & Entry</option>
                <option value="internet_sim">SIM & Data</option>
                <option value="emergency">Emergency Reserve</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="submit"
              className="px-4 py-1.5 rounded-full bg-brand-accent text-background font-bold text-xs shadow-sm"
            >
              Save Category
            </button>
          </div>
        </form>
      )}

      {/* Categorical Breakdown Rows */}
      <div className="workspace-card p-5 bg-surface border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
            Category Spending vs Cap ({categories.length})
          </h3>
          <span className="text-[11px] text-text-muted">
            Total Allocated: {formatRupiah(financialSummary.total_allocated_budget)}
          </span>
        </div>

        <div className="divide-y divide-border/60">
          {categoryBreakdown.map((item) => (
            <div key={item.category.id} className="py-3.5 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-text-primary">
                    {item.category.name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-secondary text-text-muted uppercase">
                    {item.category.category_type}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-text-muted">Spent: <strong className="text-text-primary">{formatRupiah(item.spent)}</strong></span>
                  <span className="text-text-muted">/</span>
                  <span className="text-text-muted">Cap: <strong className="text-text-primary">{formatRupiah(item.allocated)}</strong></span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    item.isOverBudget 
                      ? 'bg-brand-rose/20 text-brand-rose' 
                      : 'bg-brand-teal/15 text-brand-teal'
                  }`}>
                    {item.percentageUsed}%
                  </span>
                  {canManage && (
                    <button
                      onClick={() => deleteBudgetCategory(item.category.id)}
                      className="text-text-muted hover:text-brand-rose transition-colors ml-1"
                      title="Delete category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-surface-elevated overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.isOverBudget ? 'bg-brand-rose' : 'bg-brand-teal'
                  }`}
                  style={{ width: `${Math.min(item.percentageUsed, 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-text-muted pt-0.5">
                <span>Remaining in category:</span>
                <span className={`font-mono ${item.remaining < 0 ? 'text-brand-rose font-bold' : 'text-text-secondary'}`}>
                  {formatRupiah(item.remaining)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Budget Target Modal */}
      <EditBudgetModal
        isOpen={isEditTargetOpen}
        onClose={() => setIsEditTargetOpen(false)}
      />
    </div>
  );
};
