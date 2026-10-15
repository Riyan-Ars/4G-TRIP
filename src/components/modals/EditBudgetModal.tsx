import React, { useState } from 'react';
import { X, PieChart, ShieldAlert, Check } from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { formatRupiah, parseRupiahInput } from '../../lib/financial';

interface EditBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditBudgetModal: React.FC<EditBudgetModalProps> = ({ isOpen, onClose }) => {
  const { budget, updateBudgetTarget } = useTrip();
  const [displayAmount, setDisplayAmount] = useState(budget.target_amount.toString());
  const [revisionNote, setRevisionNote] = useState('');

  if (!isOpen) return null;

  const rawAmount = parseRupiahInput(displayAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rawAmount <= 0) return;

    updateBudgetTarget(
      rawAmount,
      revisionNote.trim() || `Target revised from ${formatRupiah(budget.target_amount)} to ${formatRupiah(rawAmount)}`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-card border border-card-border rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-text-secondary hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-10 h-10 rounded-xl bg-brand-violet/15 border border-brand-violet/30 flex items-center justify-center text-brand-violet">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Adjust Group Savings Target</h3>
            <p className="text-xs text-text-secondary">Flexible budget target for Malaysia Getaway</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">
              Total Savings Target (IDR)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-violet font-bold text-sm">Rp</span>
              <input
                type="text"
                required
                value={rawAmount > 0 ? rawAmount.toLocaleString('id-ID') : ''}
                onChange={(e) => setDisplayAmount(e.target.value)}
                placeholder="15.000.000"
                className="w-full bg-card-secondary border border-card-border focus:border-brand-violet rounded-xl py-2.5 pl-11 pr-4 text-sm font-bold text-white outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {[12000000, 15000000, 18000000, 20000000].map((quick) => (
                <button
                  key={quick}
                  type="button"
                  onClick={() => setDisplayAmount(quick.toString())}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-card-secondary hover:bg-card-border border border-card-border text-text-secondary hover:text-white transition-colors"
                >
                  {formatRupiah(quick)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">
              Revision Reason / Changelog Note
            </label>
            <input
              type="text"
              value={revisionNote}
              onChange={(e) => setRevisionNote(e.target.value)}
              placeholder="E.g. Adjusted for additional flight baggage & villa upgrade"
              className="w-full bg-card-secondary border border-card-border focus:border-brand-violet rounded-xl py-2 px-3 text-xs text-white placeholder:text-text-muted outline-none"
            />
          </div>

          <div className="p-3 rounded-xl bg-card-secondary border border-card-border text-[11px] text-text-muted flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-brand-mint shrink-0 mt-0.5" />
            <span>
              Modifying the target budget recalculates progress percentages immediately without altering existing verified contributions or expenses.
            </span>
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:text-white hover:bg-surface-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={rawAmount <= 0}
              className="px-5 py-2.5 rounded-full text-xs font-bold bg-brand-accent text-background hover:bg-blue-400 disabled:opacity-40 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Save Budget Target</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
