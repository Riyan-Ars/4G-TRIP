import React from 'react';
import { 
  PiggyBank, ArrowUpRight, Plane, Building2, 
  UtensilsCrossed, Sparkles, Plus, Wallet, ShieldCheck 
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { formatRupiah, formatRupiahCompact } from '../../lib/financial';
import { useNavigate } from 'react-router-dom';

interface SavingsFinancialCardProps {
  onAddContribution: () => void;
  onEditBudget: () => void;
}

export const SavingsFinancialCard: React.FC<SavingsFinancialCardProps> = ({
  onAddContribution,
  onEditBudget,
}) => {
  const { financialSummary, categoryBreakdown, budget } = useTrip();
  const navigate = useNavigate();

  // Top categories for compact visual representation
  const topCategories = categoryBreakdown.slice(0, 4);

  const colors = [
    { bar: 'bg-brand-mint', text: 'text-brand-mint', icon: Plane },
    { bar: 'bg-brand-blue', text: 'text-brand-blue', icon: Building2 },
    { bar: 'bg-brand-violet', text: 'text-brand-violet', icon: UtensilsCrossed },
    { bar: 'bg-brand-orange', text: 'text-brand-orange', icon: Sparkles },
  ];

  return (
    <div className="workspace-card p-5 bg-card flex flex-col justify-between">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-mint/10 border border-brand-mint/30 flex items-center justify-center text-brand-mint">
            <PiggyBank className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Group Savings & Budget</h3>
            <span className="text-[10px] text-text-muted">Target: {formatRupiah(budget.target_amount)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onAddContribution}
            className="px-2.5 py-1 rounded-full bg-brand-mint hover:bg-emerald-400 text-black text-[11px] font-bold flex items-center gap-1 transition-all shadow-glow-mint active:scale-95"
          >
            <Plus className="w-3 h-3" />
            <span>Deposit</span>
          </button>
        </div>
      </div>

      {/* Main Split: Left Big Amount & Details button, Right Horizontal Bars (matches ref image!) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Left Column: Big Total */}
        <div className="md:col-span-5 flex flex-col justify-between p-4 rounded-2xl bg-card-secondary/70 border border-card-border">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-text-muted block font-semibold">
              Verified Savings
            </span>
            <div className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight mt-1">
              {formatRupiah(financialSummary.total_verified_contributions)}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-[10px] text-brand-mint font-semibold">
                {financialSummary.savings_progress_percentage}% of target
              </span>
              <span className="text-[10px] text-text-muted">• Bal: {formatRupiah(financialSummary.available_balance)}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-card-border/60 flex items-center justify-between">
            <button
              onClick={() => navigate('/savings')}
              className="px-3 py-1 rounded-lg bg-card border border-card-border hover:bg-card-border text-white text-[11px] font-semibold transition-colors flex items-center gap-1"
            >
              <span>Details</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
            <button
              onClick={onEditBudget}
              className="text-[10px] text-text-secondary hover:text-white transition-colors"
            >
              Adjust Target
            </button>
          </div>
        </div>

        {/* Right Column: Category Allocation & Expense Progress Rows */}
        <div className="md:col-span-7 space-y-2.5">
          {topCategories.map((item, index) => {
            const style = colors[index % colors.length];
            const Icon = style.icon;
            const percentageOfTotal = budget.target_amount > 0 
              ? Math.round((item.allocated / budget.target_amount) * 100) 
              : 0;

            return (
              <div key={item.category.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 truncate">
                    <Icon className={`w-3.5 h-3.5 ${style.text}`} />
                    <span className="text-text-primary text-[11px] truncate font-medium">
                      {item.category.name}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono shrink-0 ml-2">
                    <span className="text-white font-semibold">{formatRupiahCompact(item.allocated)}</span>
                    <span className="text-text-muted text-[10px] ml-1">({percentageOfTotal}%)</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-card-secondary overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${style.bar}`}
                    style={{ width: `${Math.min(percentageOfTotal * 2.2, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Status */}
      <div className="mt-4 pt-3 border-t border-card-border/60 flex items-center justify-between text-[11px] text-text-muted">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-mint" />
          <span>Expenses: {formatRupiah(financialSummary.total_expenses)}</span>
        </div>
        <button
          onClick={() => navigate('/budget')}
          className="text-brand-mint hover:underline font-semibold"
        >
          View Full Budget Breakdown →
        </button>
      </div>
    </div>
  );
};
