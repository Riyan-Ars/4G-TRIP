import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Compass, ShieldCheck, Lock, ArrowRight, 
  AlertCircle, Sparkles, CheckCircle2, Eye, EyeOff, User,
  Mail, LogIn
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { loginAsUser, login, availableDemoUsers } = useAuth();
  const navigate = useNavigate();

  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Manual fallback login state
  const [showManualLogin, setShowManualLogin] = useState(false);
  const [manualEmail, setManualEmail] = useState('');
  const [manualPassword, setManualPassword] = useState('');

  // Handle clicking a user card
  const handleSelectUser = async (userId: string) => {
    setError('');

    // If Admin (RIYAN ARYA SYAHPUTRA), require password prompt
    if (userId === 'user-riyan') {
      setSelectedUser('user-riyan');
      setAdminPassword('');
      return;
    }

    // Members (FATHUN MUNAJAN, BINTANG FAJAR) log in immediately!
    setLoading(true);
    const res = await loginAsUser(userId);
    setLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Gagal masuk.');
    }
  };

  // Submit Admin Password for RIYAN ARYA SYAHPUTRA
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!adminPassword) {
      setError('Masukkan password admin (123456)');
      return;
    }

    setLoading(true);
    const res = await loginAsUser('user-riyan', adminPassword);
    setLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Password salah! Silakan coba lagi.');
    }
  };

  // Manual email/password login
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await login(manualEmail, manualPassword);
    setLoading(false);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Login gagal.');
    }
  };

  const adminProfile = availableDemoUsers.find((u) => u.id === 'user-riyan');

  return (
    <div className="min-h-screen bg-[#0b0f17] text-white flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Decorative ambient glowing backdrops */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-amber-500/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="w-full max-w-lg space-y-6 relative z-10">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-400/20 via-teal-500/20 to-blue-500/20 border border-emerald-400/30 text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.25)] mb-1">
            <Compass className="w-8 h-8 animate-pulse" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            4G TRIP WORKSPACE
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Collaborative travel planner & tabungan bersama Malaysia Getaway
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Modal / Card for Admin Password */}
        {selectedUser === 'user-riyan' ? (
          <div className="workspace-card p-6 bg-slate-900/90 backdrop-blur-xl border border-amber-500/30 rounded-2xl shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-800">
              <div className="relative">
                <img
                  src={adminProfile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt="Admin"
                  className="w-13 h-13 rounded-2xl object-cover border-2 border-amber-400 shadow-lg"
                />
                <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-amber-500 text-slate-950">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Admin / Owner
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white truncate mt-1">
                  {adminProfile?.display_name || 'RIYAN ARYA SYAHPUTRA'}
                </h3>
                <p className="text-[11px] text-slate-400">
                  Wajib verifikasi password admin
                </p>
              </div>
            </div>

            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password Admin
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoFocus
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Masukkan 123456"
                    className="w-full bg-slate-800/80 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl py-2.5 pl-10 pr-10 text-xs text-white placeholder:text-slate-500 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[11px] text-slate-400">
                    Kunci Admin: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 font-mono">123456</code>
                  </span>
                  <button
                    type="button"
                    onClick={() => setAdminPassword('123456')}
                    className="text-[11px] text-amber-400 hover:underline font-medium"
                  >
                    Gunakan 123456
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUser(null);
                    setError('');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-95 disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{loading ? 'Memverifikasi...' : 'Masuk sebagai Admin'}</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Main User Selector Grid */
          <div className="workspace-card p-6 bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Pilih Pengguna
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Klik nama Anda di bawah ini untuk langsung mengakses perjalanan
                </p>
              </div>
            </div>

            {/* List of 3 Users */}
            <div className="space-y-3">
              {availableDemoUsers.map((user) => {
                const isAdmin = user.id === 'user-riyan';

                return (
                  <button
                    key={user.id}
                    onClick={() => handleSelectUser(user.id)}
                    disabled={loading}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between group relative overflow-hidden ${
                      isAdmin
                        ? 'bg-gradient-to-r from-amber-500/10 via-slate-800/60 to-slate-800/40 border-amber-500/30 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                        : 'bg-slate-800/50 hover:bg-slate-800/80 border-slate-700/60 hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.12)]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="relative">
                        <img
                          src={user.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                          alt={user.display_name}
                          className={`w-11 h-11 rounded-xl object-cover transition-transform group-hover:scale-105 ${
                            isAdmin ? 'border-2 border-amber-400' : 'border border-slate-600'
                          }`}
                        />
                        {isAdmin && (
                          <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-amber-400 text-slate-950 shadow">
                            <ShieldCheck className="w-3 h-3" />
                          </span>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                            {user.display_name}
                          </span>
                          <span
                            className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                              isAdmin
                                ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                                : 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30'
                            }`}
                          >
                            {isAdmin ? 'Admin' : 'Member'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                          {isAdmin ? (
                            <span className="flex items-center gap-1 text-amber-300/90 font-medium">
                              <Lock className="w-3 h-3 text-amber-400" /> Perlu Password (123456)
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-emerald-400 font-medium">
                              <CheckCircle2 className="w-3 h-3" /> Langsung Masuk (Tanpa Password)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-white transition-colors pr-1">
                      {isAdmin ? (
                        <div className="p-2 rounded-xl bg-amber-400/10 text-amber-300 border border-amber-400/20 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                          <Lock className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="p-2 rounded-xl bg-slate-700/50 text-slate-300 group-hover:bg-emerald-400 group-hover:text-slate-950 transition-colors">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Toggle Manual Login */}
            <div className="pt-3 border-t border-slate-800/80 text-center">
              <button
                type="button"
                onClick={() => setShowManualLogin(!showManualLogin)}
                className="text-[11px] text-slate-400 hover:text-emerald-400 transition-colors font-medium inline-flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                {showManualLogin ? 'Sembunyikan Form Manual' : 'Atau Masuk dengan Email Manual'}
              </button>
            </div>

            {/* Manual Email/Password Section */}
            {showManualLogin && (
              <form onSubmit={handleManualSubmit} className="pt-2 space-y-3 border-t border-slate-800">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    placeholder="riyan@4gtrip.com"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder:text-slate-500 outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Password (123456 untuk Riyan)
                  </label>
                  <input
                    type="password"
                    value={manualPassword}
                    onChange={(e) => setManualPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder:text-slate-500 outline-none focus:border-emerald-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Masuk</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-500">
          4G Trip • Banda Aceh ⇄ Kuala Lumpur 2026
        </div>
      </div>
    </div>
  );
};
