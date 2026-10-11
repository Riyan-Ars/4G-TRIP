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
  register: (name: string, email: string, pass: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchDemoUser: (userId: string) => void;
  availableDemoUsers: UserProfile[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default active user is the Owner/Leader: Alfikri Djati
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const savedUserId = localStorage.getItem('4g_active_user_id');
    if (savedUserId && DEFAULT_PROFILES[savedUserId]) {
      return DEFAULT_PROFILES[savedUserId];
    }
    return DEFAULT_PROFILES['user-alfikri'];
  });

  const [currentRole, setCurrentRole] = useState<UserRole>('owner');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // Sync role based on user ID
  useEffect(() => {
    if (currentUser.id === 'user-alfikri') {
      setCurrentRole('owner');
    } else if (currentUser.id === 'user-adrian') {
      setCurrentRole('admin');
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
        setCurrentUser({
          id: session.user.id,
          display_name: session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email,
          avatar_url: session.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          phone: session.user.user_metadata?.phone || '+628120000000'
        });
      } else {
        // Fall back to default local user
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) return { success: false, error: error.message };
        setIsAuthenticated(true);
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
      setCurrentUser(DEFAULT_PROFILES[matchingKey]);
      setIsAuthenticated(true);
      return { success: true };
    }

    // New local user
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      display_name: email.split('@')[0] || 'Explorer',
      email,
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      phone: '+628120000000'
    };
    setCurrentUser(newUser);
    setIsAuthenticated(true);
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
    return { success: true };
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    // Switch to first demo profile for seamless experience
    setCurrentUser(DEFAULT_PROFILES['user-alfikri']);
  };

  const switchDemoUser = (userId: string) => {
    if (DEFAULT_PROFILES[userId]) {
      setCurrentUser(DEFAULT_PROFILES[userId]);
      setIsAuthenticated(true);
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
