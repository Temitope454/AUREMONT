import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  language: string;
  providerRole?: 'agent' | 'landlord' | null;
  providerVerificationStatus?: 'not_started' | 'information_required' | 'submitted' | 'under_review' | 'verified' | 'needs_attention' | 'rejected';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
  register: (data: Partial<User>) => Promise<void>;
  loginAsProvider: (role: 'agent' | 'landlord') => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  switchRole: (role: 'agent' | 'landlord' | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Simple mock session restoration
    const saved = localStorage.getItem('auremont_auth');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const login = async (email: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
          id: 'usr_123',
          firstName: 'Guest',
          lastName: 'User',
          email: email,
          language: 'en'
        };
        setUser(mockUser);
        localStorage.setItem('auremont_auth', JSON.stringify(mockUser));
        resolve();
      }, 600); // Simulate network delay
    });
  };

  const register = async (data: Partial<User>) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
          id: 'usr_' + Date.now(),
          firstName: data.firstName || 'New',
          lastName: data.lastName || 'User',
          email: data.email || 'guest@example.com',
          language: 'en'
        };
        setUser(mockUser);
        localStorage.setItem('auremont_auth', JSON.stringify(mockUser));
        resolve();
      }, 800);
    });
  };

  const loginAsProvider = async (role: 'agent' | 'landlord') => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const mockProviderUser: User = {
          id: 'prov_' + Date.now(),
          firstName: role === 'agent' ? 'Sarah' : 'Marcus',
          lastName: role === 'agent' ? 'Jenkins' : 'Alvarez',
          email: `${role}@auremont.demo`,
          language: 'en',
          providerRole: role,
          providerVerificationStatus: 'under_review' // Default to under_review for realistic auditing
        };
        setUser(mockProviderUser);
        localStorage.setItem('auremont_auth', JSON.stringify(mockProviderUser));
        resolve();
      }, 600);
    });
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      localStorage.setItem('auremont_auth', JSON.stringify(updated));
      return updated;
    });
  };

  const switchRole = (role: 'agent' | 'landlord' | null) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { 
        ...prev, 
        providerRole: role,
        providerVerificationStatus: role ? (prev.providerVerificationStatus || 'under_review') : undefined
      };
      localStorage.setItem('auremont_auth', JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auremont_auth');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      logout, 
      register, 
      loginAsProvider,
      updateUser,
      switchRole
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
