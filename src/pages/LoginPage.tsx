import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Compass, Mail, Lock, LogIn, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login, switchDemoUser, availableDemoUsers, isSupabaseConnected } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Invalid credentials');
    }
  };

  const handleQuickDemoLogin = (userId: string) => {
    switchDemoUser(userId);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-brand-mint/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-mint/20 to-brand-blue/20 border border-brand-mint/40 text-brand-mint shadow-glow-mint mb-2">
            <Compass className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Sign In to 4G Trip
          </h1>
          <p className="text-xs text-text-secondary">
            Save Together, Explore Together. Group travel workspace.
          </p>
        </div>

        {/* Login Box */}
        <div className="workspace-card p-6 bg-card border-card-border shadow-2xl space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full bg-card-secondary border border-card-border focus:border-brand-mint rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder:text-text-muted outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-card-secondary border border-card-border focus:border-brand-mint rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder:text-text-muted outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-brand-mint hover:bg-emerald-400 text-black font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-glow-mint active:scale-95 disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="pt-4 border-t border-card-border/80 space-y-2.5">
            <div className="text-[10px] uppercase font-bold text-text-muted text-center tracking-wider">
              One-Click Instant Demo Login
            </div>
            <div className="grid grid-cols-3 gap-2">
              {availableDemoUsers.map((user) => {
                const role = user.id === 'user-alfikri' ? 'Owner' : user.id === 'user-adrian' ? 'Admin' : 'Member';
                return (
                  <button
                    key={user.id}
                    onClick={() => handleQuickDemoLogin(user.id)}
                    className="p-2 rounded-xl bg-card-secondary hover:bg-card-border border border-card-border text-center transition-all group"
                  >
                    <img
                      src={user.avatar_url}
                      alt=""
                      className="w-7 h-7 rounded-full mx-auto object-cover border border-card-border group-hover:scale-105 transition-transform"
                    />
                    <span className="text-[11px] font-semibold text-white block mt-1 truncate">
                      {user.display_name.split(' ')[0]}
                    </span>
                    <span className="text-[9px] text-brand-mint uppercase tracking-wider font-bold">
                      {role}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Switch to Register */}
        <div className="text-center text-xs text-text-secondary">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-mint hover:underline font-semibold">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
