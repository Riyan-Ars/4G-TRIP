import React, { useState } from 'react';
import { X, UserPlus, Copy, Check, Mail, Shield, AlertCircle } from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { UserRole } from '../../types';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ isOpen, onClose }) => {
  const { inviteMember, trip, members } = useTrip();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('member');
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;

    const res = inviteMember(email.trim(), role);
    setInviteLink(res.inviteLink);
    setSuccessMsg(true);
  };

  const handleCopy = () => {
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center text-brand-blue">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Invite Group Member</h3>
            <p className="text-xs text-text-secondary">Add friends to "{trip.name}" group workspace</p>
          </div>
        </div>

        {!successMsg ? (
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                Friend's Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="friend@travelers.com"
                  className="w-full bg-card-secondary border border-card-border focus:border-brand-blue rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder:text-text-muted outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                Trip Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('member')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    role === 'member'
                      ? 'border-brand-mint bg-brand-mint/10 text-white'
                      : 'border-card-border bg-card-secondary text-text-secondary hover:text-white'
                  }`}
                >
                  <div className="font-semibold text-xs text-white">Member</div>
                  <div className="text-[10px] text-text-secondary mt-0.5">Submit savings & view records</div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    role === 'admin'
                      ? 'border-brand-blue bg-brand-blue/10 text-white'
                      : 'border-card-border bg-card-secondary text-text-secondary hover:text-white'
                  }`}
                >
                  <div className="font-semibold text-xs text-white">Admin</div>
                  <div className="text-[10px] text-text-secondary mt-0.5">Verify funds & manage budget</div>
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-card-secondary/70 border border-card-border text-[11px] text-text-secondary flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-brand-mint shrink-0 mt-0.5" />
              <span>
                Invited members receive access strictly after accepting. Group target will recalculate proportional targets smoothly.
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
                className="px-5 py-2.5 rounded-full text-xs font-bold bg-brand-accent text-background hover:bg-blue-400 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Send Invitation</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-brand-teal/10 border border-brand-teal/30 text-brand-teal text-xs">
              ✓ Member <span className="font-semibold text-text-primary">{email}</span> added successfully to "{trip.name}"! Share the invitation link below:
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Unique Invitation Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={inviteLink}
                  className="flex-1 bg-surface-secondary border border-border rounded-xl px-3 py-2 text-xs text-text-primary select-all font-mono"
                />
                <button
                  onClick={handleCopy}
                  className="px-3.5 py-2 rounded-full bg-brand-teal text-background font-bold text-xs hover:bg-emerald-400 flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  setSuccessMsg(false);
                  setEmail('');
                  onClose();
                }}
                className="px-5 py-2 rounded-full text-xs font-bold bg-surface-secondary hover:bg-surface-elevated text-text-primary transition-colors border border-border"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
