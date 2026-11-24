"use client";
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { apiFetch, setCsrfToken } from "@/lib/api";

export type UserRole = "HOMEOWNER" | "PROVIDER" | "ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string | null;
  isEmailVerified: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  registerHomeowner: (data: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  registerProvider: (data: { name: string; email: string; password: string; phone?: string; specialty: string; city: string; experienceYears: number; bio?: string; rateRange?: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await apiFetch<{ user: AuthUser | null; csrfToken: string | null }>("/auth/me");
      setUser(data.user);
      setCsrfToken(data.csrfToken);
    } catch {
      setUser(null);
      setCsrfToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const login = async (email: string, password: string) => {
    const data = await apiFetch<{ user: AuthUser; csrfToken: string }>("/auth/login", {
      method: "POST", body: JSON.stringify({ email, password }),
    });
    setUser(data.user);
    setCsrfToken(data.csrfToken);
  };

  const registerHomeowner = async (payload: { name: string; email: string; password: string; phone?: string }) => {
    const data = await apiFetch<{ user: AuthUser; csrfToken: string }>("/auth/register", {
      method: "POST", body: JSON.stringify(payload),
    });
    setUser(data.user);
    setCsrfToken(data.csrfToken);
  };

  const registerProvider = async (payload: { name: string; email: string; password: string; phone?: string; specialty: string; city: string; experienceYears: number; bio?: string; rateRange?: string }) => {
    const data = await apiFetch<{ user: AuthUser; csrfToken: string }>("/auth/register-provider", {
      method: "POST", body: JSON.stringify(payload),
    });
    setUser(data.user);
    setCsrfToken(data.csrfToken);
  };

  const logout = async () => {
    try { await apiFetch("/auth/logout", { method: "POST" }); } catch {}
    setUser(null);
    setCsrfToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, isLoading, refresh, login, registerHomeowner, registerProvider, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
