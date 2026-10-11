import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DEFAULT_PROFILES } from '../lib/storage';

interface AuthContextType {
  currentUser: UserProfile;
  currentRole: UserRole;
  isAuthenticated: boolean;
  isSupabaseConnected: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginAsUser: (userId: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, pass: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchDemoUser: (userId: string) => void;
  availableDemoUsers: UserProfile[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default active user is RIYAN ARYA SYAHPUTRA (Admin/Leader)
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const savedUserId = localStorage.getItem('4g_active_user_id');
    if (savedUserId && DEFAULT_PROFILES[savedUserId]) {
      return DEFAULT_PROFILES[savedUserId];
    }
    return DEFAULT_PROFILES['user-riyan'] || Object.values(DEFAULT_PROFILES)[0];
  });

  const [currentRole, setCurrentRole] = useState<UserRole>('owner');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('4g_is_authenticated') === 'true';
  });

  // Sync role based on user ID
  useEffect(() => {
    if (currentUser.id === 'user-riyan') {
      setCurrentRole('owner');
    } else {
      setCurrentRole('member');
    }
    localStorage.setItem('4g_active_user_id', currentUser.id);
  }, [currentUser]);

  // Check Supabase session if configured
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setIsAuthenticated(true);
        localStorage.setItem('4g_is_authenticated', 'true');
        setCurrentUser({
          id: session.user.id,
          display_name: session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email,
          avatar_url: session.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          phone: session.user.user_metadata?.phone || '+628120000000'
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsAuthenticated(true);
        localStorage.setItem('4g_is_authenticated', 'true');
        setCurrentUser({
          id: session.user.id,
          display_name: session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email,
          avatar_url: session.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          phone: session.user.user_metadata?.phone || '+628120000000'
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loginAsUser = async (userId: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    const profile = DEFAULT_PROFILES[userId];
    if (!profile) {
      return { success: false, error: 'User tidak ditemukan' };
    }

    // RIYAN ARYA SYAHPUTRA requires password '123456'
    if (userId === 'user-riyan') {
      if (!password || password.trim() !== '123456') {
        return { success: false, error: 'Password Admin salah! Silakan coba lagi.' };
      }
    }

    setCurrentUser(profile);
    setIsAuthenticated(true);
    localStorage.setItem('4g_is_authenticated', 'true');
    localStorage.setItem('4g_active_user_id', profile.id);
    return { success: true };
  };

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) return { success: false, error: error.message };
        setIsAuthenticated(true);
        localStorage.setItem('4g_is_authenticated', 'true');
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'Login failed' };
      }
    }

    // Local / Demo mode login
    const matchingKey = Object.keys(DEFAULT_PROFILES).find(
      (k) => DEFAULT_PROFILES[k].email?.toLowerCase() === email.toLowerCase()
    );

    if (matchingKey) {
      if (matchingKey === 'user-riyan' && pass !== '123456') {
        return { success: false, error: 'Password Admin untuk RIYAN ARYA SYAHPUTRA adalah 123456' };
      }
      setCurrentUser(DEFAULT_PROFILES[matchingKey]);
      setIsAuthenticated(true);
      localStorage.setItem('4g_is_authenticated', 'true');
      localStorage.setItem('4g_active_user_id', matchingKey);
      return { success: true };
    }

    // New custom local user
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      display_name: email.split('@')[0] || 'Explorer',
      email,
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      phone: '+628120000000'
    };
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('4g_is_authenticated', 'true');
    localStorage.setItem('4g_active_user_id', newUser.id);
    return { success: true };
  };

  const register = async (name: string, email: string, pass: string, role: UserRole = 'member'): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signUp({
          email,
          password: pass,
          options: {
            data: { display_name: name, role }
          }
        });
        if (error) return { success: false, error: error.message };
        setIsAuthenticated(true);
        localStorage.setItem('4g_is_authenticated', 'true');
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'Registration failed' };
      }
    }

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      display_name: name,
      email,
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      phone: '+628120000000'
    };
    DEFAULT_PROFILES[newUser.id] = newUser;
    setCurrentUser(newUser);
    setCurrentRole(role);
    setIsAuthenticated(true);
    localStorage.setItem('4g_is_authenticated', 'true');
    localStorage.setItem('4g_active_user_id', newUser.id);
    return { success: true };
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setIsAuthenticated(false);
    localStorage.removeItem('4g_is_authenticated');
  };

  const switchDemoUser = (userId: string) => {
    if (DEFAULT_PROFILES[userId]) {
      setCurrentUser(DEFAULT_PROFILES[userId]);
      setIsAuthenticated(true);
      localStorage.setItem('4g_is_authenticated', 'true');
      localStorage.setItem('4g_active_user_id', userId);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        isAuthenticated,
        isSupabaseConnected: isSupabaseConfigured,
        login,
        loginAsUser,
        register,
        logout,
        switchDemoUser,
        availableDemoUsers: Object.values(DEFAULT_PROFILES)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
