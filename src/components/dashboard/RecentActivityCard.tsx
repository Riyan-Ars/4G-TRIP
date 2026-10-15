import React from 'react';
import { Clock, ArrowDownLeft, ArrowUpRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { formatRupiah } from '../../lib/financial';
import { useNavigate } from 'react-router-dom';

export const RecentActivityCard: React.FC = () => {
  const { contributions, expenses } = useTrip();
  const navigate = useNavigate();

  // Combine real contributions and expenses into chronological stream
  const activities = [
    ...contributions.map((c) => ({
      id: `c-${c.id}`,
      type: 'contribution' as const,
      title: c.notes || `Savings transfer via ${c.payment_method.replace('_', ' ')}`,
      actor: c.member_profile?.display_name || 'Group Member',
      avatar: c.member_profile?.avatar_url,
      amount: c.amount,
      status: c.status,
      date: c.payment_date,
      timestamp: new Date(c.created_at || c.payment_date).getTime(),
    })),
    ...expenses.map((e) => ({
      id: `e-${e.id}`,
      type: 'expense' as const,
      title: e.description,
      actor: e.responsible_profile?.display_name || 'Group Expense',
      avatar: e.responsible_profile?.avatar_url,
      amount: e.amount,
      status: 'verified' as const,
      date: e.expense_date,
      timestamp: new Date(e.created_at || e.expense_date).getTime(),
    })),
  ]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 4);

  return (
    <div className="workspace-card p-5 bg-surface flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-brand-blue">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                Recent Activity
              </h3>
              <span className="text-[10px] text-text-muted">Real-time group ledger audit</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/transactions')}
            className="text-[11px] text-brand-blue hover:underline font-medium"
          >
            Ledger →
          </button>
        </div>

        {activities.length === 0 ? (
          <div className="py-6 text-center text-xs text-text-muted">
            No transactions recorded yet.
          </div>
        ) : (
          <div className="space-y-2.5">
            {activities.map((act) => {
              const isIncome = act.type === 'contribution';
              return (
                <div
                  key={act.id}
                  className="p-2.5 rounded-xl bg-surface-secondary/70 border border-border flex items-center justify-between gap-3 transition-colors hover:bg-surface-secondary"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                        isIncome
                          ? 'bg-brand-teal/10 border-brand-teal/30 text-brand-teal'
                          : 'bg-brand-orange/10 border-brand-orange/30 text-brand-orange'
                      }`}
                    >
                      {isIncome ? (
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium text-text-primary truncate block leading-tight">
                          {act.title}
                        </span>
                      </div>
                      <div className="text-[10px] text-text-muted mt-0.5 truncate">
                        {act.actor} • {act.date}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div
                      className={`text-xs font-semibold font-mono ${
                        isIncome ? 'text-brand-teal' : 'text-text-primary'
                      }`}
                    >
                      {isIncome ? '+' : '-'}{formatRupiah(act.amount)}
                    </div>
                    <span
                      className={`text-[9px] uppercase tracking-wider font-semibold block ${
                        act.status === 'verified'
                          ? 'text-brand-teal'
                          : act.status === 'pending'
                          ? 'text-brand-amber'
                          : 'text-brand-rose'
                      }`}
                    >
                      {act.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-text-muted">
        <span>Transparent records</span>
        <button
          onClick={() => navigate('/savings')}
          className="text-text-secondary hover:text-text-primary transition-colors font-medium"
        >
          View Savings Queue →
        </button>
      </div>
    </div>
  );
};
