import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Delete } from 'lucide-react';

// ─── Users config ────────────────────────────────────────────────────────────
const USERS = [
  {
    id: 'user-riyan',
    name: 'RIYAN ARYA SYAHPUTRA',
    shortName: 'Riyan',
    role: 'Admin',
    photo: '/images/riyan.jpg',
    isAdmin: true,
    gradient: 'from-amber-400 to-orange-500',
    glow: 'shadow-[0_0_35px_rgba(251,191,36,0.4)]',
    borderActive: 'border-amber-400/60',
    ringColor: '#FBBF24',
    badgeBg: 'bg-amber-400/20',
    badgeText: 'text-amber-300',
    badgeBorder: 'border-amber-400/40',
  },
  {
    id: 'user-fathun',
    name: 'FATHUN MUNAJAN',
    shortName: 'Fathun',
    role: 'Member',
    photo: '/images/fathun.jpg',
    isAdmin: false,
    gradient: 'from-emerald-400 to-teal-500',
    glow: 'shadow-[0_0_35px_rgba(52,211,153,0.4)]',
    borderActive: 'border-emerald-400/60',
    ringColor: '#34D399',
    badgeBg: 'bg-emerald-400/20',
    badgeText: 'text-emerald-300',
    badgeBorder: 'border-emerald-400/40',
  },
  {
    id: 'user-bintang',
    name: 'BINTANG FAJAR',
    shortName: 'Bintang',
    role: 'Member',
    photo: '/images/bintang.jpg',
    isAdmin: false,
    gradient: 'from-blue-400 to-indigo-500',
    glow: 'shadow-[0_0_35px_rgba(96,165,250,0.4)]',
    borderActive: 'border-blue-400/60',
    ringColor: '#60A5FA',
    badgeBg: 'bg-blue-400/20',
    badgeText: 'text-blue-300',
    badgeBorder: 'border-blue-400/40',
  },
];

// ─── Passcode Dot Component ──────────────────────────────────────────────────
const PasscodeDot: React.FC<{ filled: boolean; color: string }> = ({ filled, color }) => (
  <div
    className="w-4 h-4 rounded-full border-2 transition-all duration-200"
    style={{
      backgroundColor: filled ? color : 'transparent',
      borderColor: filled ? color : 'rgba(255,255,255,0.3)',
      transform: filled ? 'scale(1.15)' : 'scale(1)',
    }}
  />
);

// ─── Main Login Page ─────────────────────────────────────────────────────────
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

  // ─── Select user card ───────────────────────────────────────────────────────
  const handleSelectUser = async (user: typeof USERS[0]) => {
    if (loading) return;
    setError('');
    setSelectedUser(user);

    if (user.isAdmin) {
      setPhase('passcode');
      setPasscode('');
      return;
    }

    // Non-admin: instant login
    setLoading(true);
    const res = await loginAsUser(user.id);
    setLoading(false);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Login gagal');
    }
  };

  // ─── Passcode keypad press ──────────────────────────────────────────────────
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
    setError('Password salah');
    setTimeout(() => {
      setShake(false);
      setPasscode('');
    }, 600);
  };

  // ─── Back to user select ────────────────────────────────────────────────────
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
    <div
      className="min-h-screen w-full flex flex-col items-center justify-start overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #1a1a2e 0%, #0a0a0f 60%, #050507 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif',
      }}
    >
      {/* ── Ambient glow orbs ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-10%] left-1/4 w-[300px] h-[300px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.4) 0%, transparent 70%)' }} />
        <div className="absolute top-1/3 right-[-5%] w-[200px] h-[200px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.3) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 w-full max-w-sm mx-auto px-5 pt-16 pb-10 flex flex-col min-h-screen">

        {/* ── App Brand Header ── */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-[22px] mb-5"
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.3) 0%, rgba(16,185,129,0.2) 100%)',
              boxShadow: '0 0 40px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <Compass className="w-8 h-8 text-indigo-300" />
          </div>
          <h1
            className="text-2xl font-bold text-white tracking-tight mb-1"
            style={{ letterSpacing: '-0.03em' }}
          >
            4G Trip
          </h1>
          <p className="text-sm text-white/40 font-medium">
            Malaysia Getaway · Banda Aceh → KL
          </p>
        </div>

        {/* ════════ PHASE: SELECT ════════ */}
        {phase === 'select' && (
          <div className="flex-1 flex flex-col">
            <p className="text-center text-xs font-semibold text-white/40 uppercase tracking-[0.15em] mb-6">
              Pilih Akun
            </p>

            <div className="space-y-3">
              {USERS.map((user, i) => (
                <button
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  disabled={loading}
                  className="w-full text-left active:scale-[0.98] transition-all duration-200"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div
                    className="flex items-center gap-4 p-4 rounded-[20px] relative overflow-hidden"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                    }}
                  >
                    {/* Subtle gradient overlay */}
                    <div
                      className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%)`,
                      }}
                    />

                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <img
                        src={user.photo}
                        alt={user.shortName}
                        className="w-14 h-14 rounded-full object-cover"
                        style={{
                          border: `2.5px solid ${user.ringColor}44`,
                          boxShadow: `0 0 16px ${user.ringColor}30`,
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${user.shortName}&background=1a1a2e&color=fff&size=80`;
                        }}
                      />
                      {user.isAdmin && (
                        <div
                          className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[9px]"
                          style={{
                            background: 'linear-gradient(135deg, #FBBF24, #F59E0B)',
                            boxShadow: '0 0 8px rgba(251,191,36,0.6)',
                          }}
                        >
                          👑
                        </div>
                      )}
                    </div>

                    {/* Name & Info */}
                    <div className="flex-1 min-w-0 relative z-10">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-sm font-semibold text-white truncate"
                          style={{ letterSpacing: '-0.01em' }}
                        >
                          {user.shortName}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${user.badgeBg} ${user.badgeText} ${user.badgeBorder}`}
                        >
                          {user.role}
                        </span>
                      </div>
                      <p className="text-xs text-white/40 truncate">
                        {user.isAdmin ? '🔐 Butuh password (123456)' : '✓ Tap untuk langsung masuk'}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div
                      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center relative z-10`}
                      style={{
                        background: `${user.ringColor}20`,
                        border: `1px solid ${user.ringColor}30`,
                      }}
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                        <path d="M9 18l6-6-6-6" stroke={user.ringColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {loading && (
              <div className="mt-8 text-center">
                <div className="inline-flex items-center gap-2.5 text-sm text-white/50">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
                  Masuk...
                </div>
              </div>
            )}

            {error && (
              <p className="mt-4 text-center text-sm text-rose-400">{error}</p>
            )}

            <div className="mt-auto pt-10 text-center">
              <p className="text-xs text-white/20">
                Banda Aceh ⇄ Kuala Lumpur · 2026
              </p>
            </div>
          </div>
        )}

        {/* ════════ PHASE: PASSCODE ════════ */}
        {phase === 'passcode' && selectedUser && (
          <div className="flex-1 flex flex-col items-center">
            {/* Selected user avatar */}
            <div className="mb-6 text-center">
              <div className="relative inline-block">
                <img
                  src={selectedUser.photo}
                  alt={selectedUser.shortName}
                  className="w-20 h-20 rounded-full object-cover mx-auto"
                  style={{
                    border: `3px solid ${selectedUser.ringColor}`,
                    boxShadow: `0 0 30px ${selectedUser.ringColor}50`,
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${selectedUser.shortName}&background=1a1a2e&color=fff&size=80`;
                  }}
                />
                <div
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs"
                  style={{
                    background: 'linear-gradient(135deg, #FBBF24, #F59E0B)',
                    boxShadow: '0 0 10px rgba(251,191,36,0.7)',
                  }}
                >
                  👑
                </div>
              </div>
              <h2 className="text-base font-semibold text-white mt-3" style={{ letterSpacing: '-0.02em' }}>
                {selectedUser.shortName}
              </h2>
              <p className="text-sm text-white/40 mt-0.5">Masukkan password Admin</p>
            </div>

            {/* Passcode dots */}
            <div
              className={`flex items-center gap-4 mb-10 transition-all ${shake ? 'animate-bounce' : ''}`}
              style={{
                transform: shake ? 'translateX(0)' : undefined,
                animation: shake ? 'shake 0.5s ease-in-out' : undefined,
              }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <PasscodeDot
                  key={i}
                  filled={i < passcode.length}
                  color={selectedUser.ringColor}
                />
              ))}
            </div>

            {error && !shake && (
              <p className="text-sm text-rose-400 mb-6 -mt-4">{error}</p>
            )}

            {/* Keypad */}
            <div className="w-full max-w-[260px] space-y-3">
              {keypadRows.map((row, ri) => (
                <div key={ri} className="grid grid-cols-3 gap-3">
                  {row.map((key, ki) => {
                    if (key === '') return <div key={ki} />;
                    return (
                      <button
                        key={ki}
                        onClick={() => handleKeyPress(key)}
                        disabled={key !== 'del' && passcode.length >= 6}
                        className="h-16 rounded-[18px] flex items-center justify-center transition-all duration-150 active:scale-95"
                        style={{
                          background: key === 'del'
                            ? 'rgba(255,255,255,0.06)'
                            : 'rgba(255,255,255,0.09)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)',
                        }}
                      >
                        {key === 'del' ? (
                          <Delete className="w-5 h-5 text-white/60" />
                        ) : (
                          <span
                            className="text-2xl font-light text-white"
                            style={{ letterSpacing: '-0.02em' }}
                          >
                            {key}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Back button */}
            <button
              onClick={handleBack}
              className="mt-8 text-sm text-white/40 hover:text-white/70 transition-colors font-medium"
            >
              ← Ganti Pengguna
            </button>

            <div className="mt-auto pt-6 text-center">
              <p className="text-xs text-white/20">Hint: password adalah 123456</p>
            </div>
          </div>
        )}
      </div>

      {/* Shake keyframes */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-8px); }
          30% { transform: translateX(8px); }
          45% { transform: translateX(-6px); }
          60% { transform: translateX(6px); }
          75% { transform: translateX(-4px); }
          90% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
};
