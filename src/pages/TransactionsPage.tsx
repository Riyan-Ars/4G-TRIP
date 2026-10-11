import React, { useState } from 'react';
import { 
  Receipt, Plus, Search, Filter, ArrowDownLeft, 
  ArrowUpRight, Clock, CheckCircle2, XCircle, ShieldCheck, Download 
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { formatRupiah } from '../lib/financial';
import { AddContributionModal } from '../components/modals/AddContributionModal';
import { AddExpenseModal } from '../components/modals/AddExpenseModal';

export const TransactionsPage: React.FC = () => {
  const { contributions, expenses } = useTrip();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'contribution' | 'expense'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending' | 'rejected'>('all');
  const [isContributionOpen, setIsContributionOpen] = useState(false);
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);

  // Combine into unified chronological ledger
  const unifiedLedger = [
    ...contributions.map((c) => ({
      id: c.id,
      date: c.payment_date,
      type: 'contribution' as const,
      description: c.notes || `Group savings via ${c.payment_method.replace('_', ' ')}`,
      amount: c.amount,
      member: c.member_profile?.display_name || 'Member',
      status: c.status,
      refNumber: c.reference_number || 'N/A',
      receiptUrl: c.receipt_url,
      timestamp: new Date(c.created_at).getTime()
    })),
    ...expenses.map((e) => ({
      id: e.id,
      date: e.expense_date,
      type: 'expense' as const,
      description: e.description,
      amount: e.amount,
      member: e.responsible_profile?.display_name || 'Group',
      status: 'verified' as const,
      refNumber: e.category?.name || 'General Expense',
      receiptUrl: e.receipt_url,
      timestamp: new Date(e.created_at).getTime()
    }))
  ].sort((a, b) => b.timestamp - a.timestamp);

  const filteredLedger = unifiedLedger.filter((item) => {
    const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.member.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.refNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const exportCSV = () => {
    const headers = ['Date', 'Type', 'Description', 'Amount', 'Member', 'Status', 'Reference'];
    const rows = filteredLedger.map((row) => [
      row.date,
      row.type.toUpperCase(),
      `"${row.description.replace(/"/g, '""')}"`,
      row.amount,
      `"${row.member}"`,
      row.status,
      `"${row.refNumber}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `4G_Trip_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="workspace-card p-6 bg-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="pill-badge bg-brand-orange/15 text-brand-orange border border-brand-orange/30 uppercase text-[10px] font-bold">
              Auditable Ledger
            </span>
            <span className="text-xs text-text-secondary">
              Immutable Records & Reconciliation
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Financial Ledger & Transactions
          </h1>

          <p className="text-xs text-text-secondary mt-1">
            Complete transaction history for contributions, payments, and trip expenditures.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportCSV}
            className="px-3.5 py-2 rounded-xl bg-card-secondary hover:bg-card-border border border-card-border text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsExpenseOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-brand-orange hover:bg-amber-400 text-black text-xs font-bold transition-all shadow-sm"
          >
            + Record Expense
          </button>
          <button
            onClick={() => setIsContributionOpen(true)}
            className="px-4 py-2 rounded-xl bg-brand-mint hover:bg-emerald-400 text-black text-xs font-bold transition-all shadow-glow-mint"
          >
            + Add Contribution
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="workspace-card p-4 bg-card border-card-border flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search transactions, members, ref..."
            className="w-full bg-card-secondary border border-card-border focus:border-brand-mint rounded-xl py-1.5 pl-9 pr-3 text-xs text-white placeholder:text-text-muted outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {/* Type Filter */}
          <div className="flex items-center gap-1 bg-card-secondary p-1 rounded-xl border border-card-border shrink-0">
            {(['all', 'contribution', 'expense'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                  typeFilter === t ? 'bg-card text-white font-bold' : 'text-text-secondary hover:text-white'
                }`}
              >
                {t === 'all' ? 'All Types' : t}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-card-secondary p-1 rounded-xl border border-card-border shrink-0">
            {(['all', 'verified', 'pending'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                  statusFilter === s ? 'bg-card text-white font-bold' : 'text-text-secondary hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ledger Table / Mobile Cards */}
      <div className="workspace-card overflow-hidden bg-card border-card-border">
        {filteredLedger.length === 0 ? (
          <div className="p-8 text-center text-xs text-text-muted">
            No transactions match the selected filters.
          </div>
        ) : (
          <div className="divide-y divide-card-border/60">
            {filteredLedger.map((row) => (
              <div
                key={row.id}
                className="p-4 hover:bg-card-secondary/40 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    row.type === 'contribution' 
                      ? 'bg-brand-mint/10 border-brand-mint/30 text-brand-mint' 
                      : 'bg-brand-orange/10 border-brand-orange/30 text-brand-orange'
                  }`}>
                    {row.type === 'contribution' ? (
                      <ArrowDownLeft className="w-5 h-5" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{row.description}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                        row.status === 'verified'
                          ? 'bg-brand-mint/15 text-brand-mint'
                          : row.status === 'pending'
                          ? 'bg-amber-400/15 text-amber-400'
                          : 'bg-rose-400/15 text-rose-400'
                      }`}>
                        {row.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-text-muted mt-0.5">
                      {row.date} • By {row.member} • Ref: {row.refNumber}
                    </div>
                  </div>
                </div>

                <div className="text-right self-end sm:self-center">
                  <div className={`text-sm font-extrabold font-mono ${
                    row.type === 'contribution' ? 'text-brand-mint' : 'text-brand-orange'
                  }`}>
                    {row.type === 'contribution' ? '+' : '-'}{formatRupiah(row.amount)}
                  </div>
                  <div className="text-[10px] text-text-muted uppercase tracking-wider">
                    {row.type}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddContributionModal isOpen={isContributionOpen} onClose={() => setIsContributionOpen(false)} />
      <AddExpenseModal isOpen={isExpenseOpen} onClose={() => setIsExpenseOpen(false)} />
    </div>
  );
};
