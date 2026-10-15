import React, { useState } from 'react';
import { X, PiggyBank, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { PaymentMethod } from '../../types';
import { formatRupiah, parseRupiahInput } from '../../lib/financial';

interface AddContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddContributionModal: React.FC<AddContributionModalProps> = ({ isOpen, onClose }) => {
  const { submitContribution } = useTrip();
  const [displayAmount, setDisplayAmount] = useState('1000000');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank_transfer');
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [receiptUrl, setReceiptUrl] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const rawAmount = parseRupiahInput(displayAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rawAmount <= 0) return;

    submitContribution(
      rawAmount,
      paymentMethod,
      paymentDate,
      referenceNumber.trim() || undefined,
      notes.trim() || undefined,
      receiptUrl.trim() || undefined
    );

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1500);
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
          <div className="w-10 h-10 rounded-xl bg-brand-mint/15 border border-brand-mint/30 flex items-center justify-center text-brand-mint shadow-glow-mint">
            <PiggyBank className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Record Group Contribution</h3>
            <p className="text-xs text-text-secondary">Submit proof of savings transfer for admin verification</p>
          </div>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-brand-mint mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-white">Contribution Submitted!</h4>
            <p className="text-xs text-text-secondary max-w-sm mx-auto">
              Saved as <span className="text-amber-400 font-semibold">Pending</span>. It will count towards the official group balance once verified by a group admin.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Amount Input */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Contribution Amount (IDR)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-mint font-bold text-sm">Rp</span>
                <input
                  type="text"
                  required
                  value={rawAmount > 0 ? rawAmount.toLocaleString('id-ID') : ''}
                  onChange={(e) => setDisplayAmount(e.target.value)}
                  placeholder="1.000.000"
                  className="w-full bg-card-secondary border border-card-border focus:border-brand-mint rounded-xl py-2.5 pl-11 pr-4 text-sm font-bold text-white placeholder:text-text-muted outline-none"
                />
              </div>
              <div className="flex gap-2 mt-2">
                {[500000, 1000000, 1500000, 2000000].map((quick) => (
                  <button
                    key={quick}
                    type="button"
                    onClick={() => setDisplayAmount(quick.toString())}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-card-secondary hover:bg-card-border border border-card-border text-text-secondary hover:text-white transition-colors"
                  >
                    + {formatRupiah(quick)}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full bg-card-secondary border border-card-border focus:border-brand-mint rounded-xl py-2 px-3 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="bank_transfer">Bank Transfer (BCA/Mandiri/BSI)</option>
                  <option value="qris">QRIS Digital</option>
                  <option value="gopay">GoPay</option>
                  <option value="ovo">OVO</option>
                  <option value="dana">DANA</option>
                  <option value="cash">Cash / Tunai</option>
                  <option value="other">Other Payment</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Transfer Date
                </label>
                <input
                  type="date"
                  required
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full bg-card-secondary border border-card-border focus:border-brand-mint rounded-xl py-2 px-3 text-xs text-white outline-none"
                />
              </div>
            </div>

            {/* Reference Number */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Transaction Reference / Transfer Code
              </label>
              <input
                type="text"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="E.g. BCA-894721 or 20261011009"
                className="w-full bg-card-secondary border border-card-border focus:border-brand-mint rounded-xl py-2 px-3 text-xs text-white placeholder:text-text-muted outline-none"
              />
            </div>

            {/* Receipt URL / proof */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Receipt / Transfer Screenshot URL (Optional)
              </label>
              <input
                type="text"
                value={receiptUrl}
                onChange={(e) => setReceiptUrl(e.target.value)}
                placeholder="https://... or receipt image link"
                className="w-full bg-card-secondary border border-card-border focus:border-brand-mint rounded-xl py-2 px-3 text-xs text-white placeholder:text-text-muted outline-none"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Notes / Purpose
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="E.g. October group savings installment"
                className="w-full bg-card-secondary border border-card-border focus:border-brand-mint rounded-xl py-2 px-3 text-xs text-white placeholder:text-text-muted outline-none"
              />
            </div>

            {/* Transparency Note */}
            <div className="p-3 rounded-xl bg-card-secondary border border-card-border text-[11px] text-text-muted flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                4G Trip tracks peer financial records transparently. Actual funds are held in the member bank account, not in-app custodial wallets.
              </span>
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
                disabled={rawAmount <= 0}
                className="px-5 py-2.5 rounded-full text-xs font-bold bg-brand-teal text-background hover:bg-emerald-400 disabled:opacity-40 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <PiggyBank className="w-4 h-4" />
                <span>Submit {rawAmount > 0 ? formatRupiah(rawAmount) : 'Contribution'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
