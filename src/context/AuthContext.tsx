import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  role?: 'user' | 'admin' | 'superadmin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loginLocal: (user: User, token?: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  // API helpers
  loginWithCredentials: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  requestOtpForSignup: (payload: { name: string; email: string; phone: string; password: string }) => Promise<{ ok: boolean; error?: string }>
  verifyOtpAndCreateAccount: (email: string, otp: string) => Promise<{ ok: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const API_URL = (typeof (import.meta) !== 'undefined' ? (import.meta as any).env?.VITE_API_URL : undefined) || ''

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Load from localStorage on first render
  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed.user || null);
        setToken(parsed.token || null);
      } catch (e) {}
    }
  }, []);

  const persist = (u: User | null, t: string | null) => {
    setUser(u);
    setToken(t);
    localStorage.setItem('auth', JSON.stringify({ user: u, token: t }))
  }

  const loginLocal = (userData: User, jwtToken?: string) => {
    persist(userData, jwtToken || null)
  };

  const logout = () => {
    persist(null, null)
  };

  const updateUser = (updatedData: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updatedData };
      persist(newUser, token);
    }
  };

  // API helpers
  const loginWithCredentials = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) return { ok: false, error: data.error || 'Login failed' }
      const u: User = { id: data.user.id, name: data.user.name, email: data.user.email, role: data.user.role }
      loginLocal(u, data.token)
      return { ok: true }
    } catch (err: any) {
      console.error(err)
      return { ok: false, error: 'Network error' }
    }
  }

  const requestOtpForSignup = async (payload: { name: string; email: string; phone: string; password: string }) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) return { ok: false, error: data.error || 'Failed to request OTP' }
      return { ok: true }
    } catch (err: any) {
      console.error(err)
      return { ok: false, error: 'Network error' }
    }
  }

  const verifyOtpAndCreateAccount = async (email: string, otp: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      })
      const data = await res.json()
      if (!res.ok) return { ok: false, error: data.error || 'OTP verify failed' }
      const u: User = { id: data.user.id, name: data.user.name, email: data.user.email, role: data.user.role }
      loginLocal(u, data.token)
      return { ok: true }
    } catch (err: any) {
      console.error(err)
      return { ok: false, error: 'Network error' }
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, loginLocal, logout, updateUser, loginWithCredentials, requestOtpForSignup, verifyOtpAndCreateAccount }}>
      {children}
    </AuthContext.Provider>
  );
};
