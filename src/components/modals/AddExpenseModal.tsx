import React, { useState } from 'react';
import { X, Receipt, Tag, User, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { formatRupiah, parseRupiahInput } from '../../lib/financial';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose }) => {
  const { categories, members, recordExpense } = useTrip();
  const [displayAmount, setDisplayAmount] = useState('250000');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [description, setDescription] = useState('');
  const [expenseDate, setExpenseDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [responsibleMemberId, setResponsibleMemberId] = useState(members[0]?.user_id || '');
  const [receiptUrl, setReceiptUrl] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const rawAmount = parseRupiahInput(displayAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rawAmount <= 0 || !description.trim()) return;

    recordExpense(
      categoryId,
      rawAmount,
      description.trim(),
      expenseDate,
      responsibleMemberId,
      receiptUrl.trim() || undefined
    );

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-card border border-card-border rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-text-secondary hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-10 h-10 rounded-xl bg-brand-orange/15 border border-brand-orange/30 flex items-center justify-center text-brand-orange">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Record Trip Expense</h3>
            <p className="text-xs text-text-secondary">Track group expenditure against allocated categories</p>
          </div>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-brand-orange mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-white">Expense Recorded!</h4>
            <p className="text-xs text-text-secondary">
              Available group balance and category consumption updated immediately.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Amount */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Expense Amount (IDR)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-orange font-bold text-sm">Rp</span>
                <input
                  type="text"
                  required
                  value={rawAmount > 0 ? rawAmount.toLocaleString('id-ID') : ''}
                  onChange={(e) => setDisplayAmount(e.target.value)}
                  placeholder="250.000"
                  className="w-full bg-card-secondary border border-card-border focus:border-brand-orange rounded-xl py-2.5 pl-11 pr-4 text-sm font-bold text-white placeholder:text-text-muted outline-none"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Description / Item Purchased
              </label>
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="E.g. Grab car from KLIA2 to Bukit Bintang suite"
                className="w-full bg-card-secondary border border-card-border focus:border-brand-orange rounded-xl py-2 px-3 text-xs text-white placeholder:text-text-muted outline-none"
              />
            </div>

            {/* Category and Date */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Budget Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-card-secondary border border-card-border focus:border-brand-orange rounded-xl py-2 px-3 text-xs text-white outline-none cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Expense Date
                </label>
                <input
                  type="date"
                  required
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className="w-full bg-card-secondary border border-card-border focus:border-brand-orange rounded-xl py-2 px-3 text-xs text-white outline-none"
                />
              </div>
            </div>

            {/* Paid By / Responsible Member */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Paid by Member (Payer)
              </label>
              <select
                value={responsibleMemberId}
                onChange={(e) => setResponsibleMemberId(e.target.value)}
                className="w-full bg-card-secondary border border-card-border focus:border-brand-orange rounded-xl py-2 px-3 text-xs text-white outline-none cursor-pointer"
              >
                {members.map((m) => (
                  <option key={m.user_id} value={m.user_id}>
                    {m.profile?.display_name || m.user_id} ({m.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Receipt URL */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Receipt / Bill Image URL (Optional)
              </label>
              <input
                type="text"
                value={receiptUrl}
                onChange={(e) => setReceiptUrl(e.target.value)}
                placeholder="https://... or photo url"
                className="w-full bg-card-secondary border border-card-border focus:border-brand-orange rounded-xl py-2 px-3 text-xs text-white placeholder:text-text-muted outline-none"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:text-white hover:bg-card-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={rawAmount <= 0 || !description.trim()}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-orange text-black hover:bg-amber-400 disabled:opacity-40 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Receipt className="w-4 h-4" />
                <span>Record Expense</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
