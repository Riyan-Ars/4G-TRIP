import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Delete, ShieldCheck, ChevronRight, Lock } from 'lucide-react';

const USERS = [
  {
    id: 'user-riyan',
    name: 'RIYAN ARYA SYAHPUTRA',
    shortName: 'Riyan',
    role: 'Trip Owner',
    photo: '/images/riyan.jpg',
    isAdmin: true,
    ringColor: '#E59866',
    badgeBg: 'bg-brand-orange/15',
    badgeText: 'text-brand-orange',
    badgeBorder: 'border-brand-orange/30',
  },
  {
    id: 'user-fathun',
    name: 'FATHUN MUNAJAN',
    shortName: 'Fathun',
    role: 'Traveler',
    photo: '/images/fathun.jpg',
    isAdmin: false,
    ringColor: '#78C8B0',
    badgeBg: 'bg-brand-teal/15',
    badgeText: 'text-brand-teal',
    badgeBorder: 'border-brand-teal/30',
  },
  {
    id: 'user-bintang',
    name: 'BINTANG FAJAR',
    shortName: 'Bintang',
    role: 'Traveler',
    photo: '/images/bintang.jpg',
    isAdmin: false,
    ringColor: '#7798FF',
    badgeBg: 'bg-brand-blue/15',
    badgeText: 'text-brand-blue',
    badgeBorder: 'border-brand-blue/30',
  },
];

const PasscodeDot: React.FC<{ filled: boolean; color: string }> = ({ filled, color }) => (
  <div
    className="w-3.5 h-3.5 rounded-full border transition-all duration-200"
    style={{
      backgroundColor: filled ? color : 'transparent',
      borderColor: filled ? color : 'rgba(255,255,255,0.2)',
      transform: filled ? 'scale(1.15)' : 'scale(1)',
    }}
  />
);

export const LoginPage: React.FC = () => {
  const { loginAsUser } = useAuth();
  const navigate = useNavigate();

  const [selectedUser, setSelectedUser] = useState<typeof USERS[0] | null>(null);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<'select' | 'passcode'>('select');

  const ADMIN_PASSWORD = '123456';

  const handleSelectUser = async (user: typeof USERS[0]) => {
    if (loading) return;
    setError('');
    setSelectedUser(user);

    if (user.isAdmin) {
      setPhase('passcode');
      setPasscode('');
      return;
    }

    setLoading(true);
    const res = await loginAsUser(user.id);
    setLoading(false);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Login gagal');
    }
  };

  const handleKeyPress = async (key: string) => {
    if (shake) return;

    if (key === 'del') {
      setPasscode((p) => p.slice(0, -1));
      setError('');
      return;
    }

    const next = passcode + key;
    setPasscode(next);

    if (next.length === 6) {
      if (next === ADMIN_PASSWORD) {
        setLoading(true);
        const res = await loginAsUser(selectedUser!.id, next);
        setLoading(false);
        if (res.success) {
          navigate('/dashboard');
        } else {
          triggerShake();
        }
      } else {
        triggerShake();
      }
    }
  };

  const triggerShake = () => {
    setShake(true);
    setError('Password salah (Gunakan 123456)');
    setTimeout(() => {
      setShake(false);
      setPasscode('');
    }, 600);
  };

  const handleBack = () => {
    setPhase('select');
    setSelectedUser(null);
    setPasscode('');
    setError('');
  };

  const keypadRows = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', 'del'],
  ];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-text-primary px-4 py-12">
      <div className="w-full max-w-sm mx-auto flex flex-col items-center">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-surface-elevated border border-white/10 mb-3 text-brand-blue shadow-subtle">
            <Compass className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">
            4G TRIP
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Banda Aceh ✈ Kuala Lumpur • Malaysia 2026
          </p>
        </div>

        {/* PHASE: SELECT */}
        {phase === 'select' && (
          <div className="w-full space-y-4">
            <p className="text-center text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">
              Select Profile
            </p>

            <div className="space-y-2.5">
              {USERS.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  disabled={loading}
                  className="w-full p-3.5 rounded-xl bg-surface hover:bg-surface-secondary border border-border flex items-center justify-between gap-3 text-left transition-colors active:scale-[0.99] group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={user.photo}
                        alt={user.shortName}
                        className="w-11 h-11 rounded-full object-cover border border-white/10"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${user.shortName}&background=151D2E&color=fff&size=80`;
                        }}
                      />
                      {user.isAdmin && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-surface-elevated border border-brand-orange/50 flex items-center justify-center text-brand-orange">
                          <ShieldCheck className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-text-primary truncate">
                          {user.shortName}
                        </span>
                        <span className={`text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${user.badgeBg} ${user.badgeText} ${user.badgeBorder}`}>
                          {user.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-text-muted truncate mt-0.5">
                        {user.isAdmin ? 'Admin password required (123456)' : 'Tap to sign in'}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-primary transition-colors shrink-0" />
                </button>
              ))}
            </div>

            {loading && (
              <div className="pt-4 text-center">
                <div className="inline-flex items-center gap-2 text-xs text-text-muted">
                  <div className="w-3.5 h-3.5 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              </div>
            )}

            {error && (
              <p className="pt-2 text-center text-xs text-brand-rose">{error}</p>
            )}
          </div>
        )}

        {/* PHASE: PASSCODE */}
        {phase === 'passcode' && selectedUser && (
          <div className="w-full flex flex-col items-center">
            <div className="mb-6 text-center">
              <div className="relative inline-block mb-2">
                <img
                  src={selectedUser.photo}
                  alt={selectedUser.shortName}
                  className="w-16 h-16 rounded-full object-cover mx-auto border-2 border-brand-orange/40"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${selectedUser.shortName}&background=151D2E&color=fff&size=80`;
                  }}
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-surface-elevated border border-brand-orange/50 flex items-center justify-center text-brand-orange">
                  <Lock className="w-3 h-3" />
                </div>
              </div>
              <h2 className="text-sm font-bold text-text-primary">
                {selectedUser.name}
              </h2>
              <p className="text-xs text-text-muted mt-0.5">Enter Admin PIN</p>
            </div>

            {/* Passcode dots */}
            <div className={`flex items-center gap-3.5 mb-8 ${shake ? 'animate-bounce' : ''}`}>
              {Array.from({ length: 6 }).map((_, i) => (
                <PasscodeDot
                  key={i}
                  filled={i < passcode.length}
                  color={selectedUser.ringColor}
                />
              ))}
            </div>

            {error && (
              <p className="text-xs text-brand-rose mb-4 -mt-4">{error}</p>
            )}

            {/* Keypad */}
            <div className="w-full max-w-[240px] space-y-2">
              {keypadRows.map((row, ri) => (
                <div key={ri} className="grid grid-cols-3 gap-2">
                  {row.map((key, ki) => {
                    if (key === '') return <div key={ki} />;
                    return (
                      <button
                        key={ki}
                        onClick={() => handleKeyPress(key)}
                        disabled={key !== 'del' && passcode.length >= 6}
                        className="h-12 rounded-xl bg-surface hover:bg-surface-secondary border border-border flex items-center justify-center transition-colors active:scale-95 text-text-primary"
                      >
                        {key === 'del' ? (
                          <Delete className="w-4 h-4 text-text-muted" />
                        ) : (
                          <span className="text-lg font-mono font-medium">
                            {key}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <button
              onClick={handleBack}
              className="mt-6 text-xs text-text-muted hover:text-text-primary transition-colors font-medium"
            >
              ← Switch Profile
            </button>
          </div>
        )}

        <div className="mt-12 text-center text-[10px] text-text-muted">
          Group Treasury & Travel Companion
        </div>
      </div>
    </div>
  );
};
