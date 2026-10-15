import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Compass, User, Mail, Lock, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('member');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await register(name, email, password, role);
    setLoading(false);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      <div className="w-full max-w-sm space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-surface-elevated border border-white/10 text-brand-blue shadow-subtle mb-1">
            <Compass className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">
            Create Profile
          </h1>
          <p className="text-xs text-text-secondary">
            Join 4G Trip treasury and collaborative workspace.
          </p>
        </div>

        <div className="workspace-card p-5 md:p-6 bg-surface border-border shadow-elevated space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full bg-surface-secondary border border-border focus:border-brand-blue rounded-xl py-2 pl-9 pr-3 text-xs text-text-primary placeholder:text-text-muted outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full bg-surface-secondary border border-border focus:border-brand-blue rounded-xl py-2 pl-9 pr-3 text-xs text-text-primary placeholder:text-text-muted outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full bg-surface-secondary border border-border focus:border-brand-blue rounded-xl py-2 pl-9 pr-3 text-xs text-text-primary placeholder:text-text-muted outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Role in Trip
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full bg-surface-secondary border border-border focus:border-brand-blue rounded-xl py-2 px-3 text-xs text-text-primary outline-none cursor-pointer"
              >
                <option value="member">Trip Member</option>
                <option value="admin">Trip Admin</option>
                <option value="owner">Trip Owner / Leader</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-full bg-brand-accent hover:bg-blue-400 text-background font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 disabled:opacity-50 mt-2"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{loading ? 'Creating...' : 'Create Profile'}</span>
            </button>
          </form>
        </div>

        <div className="text-center text-xs text-text-muted">
          Already registered?{' '}
          <Link to="/login" className="text-brand-blue hover:underline font-semibold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
