"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface ProviderProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  city: string;
  experience: number;
  bio: string;
  rateRange: string;
  workExperience: { role: string; company: string; duration: string; projects: number }[];
  workPhotos: { id: string; name: string; url: string; description: string }[];
  services: string[];
  isVerified: boolean;
  joinedAt: string;
}

interface AuthContextType {
  provider: ProviderProfile | null;
  user: { name: string } | null;
  isLoggedIn: boolean;
  loginAsUser: (name: string) => void;
  logoutUser: () => void;
  login: (email: string, password: string) => boolean;
  register: (data: Omit<ProviderProfile, "id" | "isVerified" | "joinedAt"> & { password: string }) => boolean;
  logout: () => void;
  updateProfile: (data: Partial<ProviderProfile>) => void;
  addWorkPhoto: (photo: { name: string; url: string; description: string }) => void;
  removeWorkPhoto: (id: string) => void;
  addWorkExperience: (exp: { role: string; company: string; duration: string; projects: number }) => void;
  removeWorkExperience: (index: number) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const PROVIDER_STORAGE_KEY = "buildguide-provider";
const USER_STORAGE_KEY = "buildguide-user";
const PROVIDERS_KEY = "buildguide-providers";

function getStoredProviders(): (ProviderProfile & { password: string })[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(PROVIDERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveProviders(providers: (ProviderProfile & { password: string })[]) {
  localStorage.setItem(PROVIDERS_KEY, JSON.stringify(providers));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    try {
      const storedProvider = localStorage.getItem(PROVIDER_STORAGE_KEY);
      if (storedProvider) setProvider(JSON.parse(storedProvider));
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch {}
  }, []);

  const loginAsUser = (name: string) => {
    const userData = { name };
    setUser(userData);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  const login = (email: string, password: string): boolean => {
    const providers = getStoredProviders();
    const found = providers.find((p) => p.email === email && p.password === password);
    if (found) {
      const { password: _, ...profile } = found;
      setProvider(profile);
      localStorage.setItem(PROVIDER_STORAGE_KEY, JSON.stringify(profile));
      return true;
    }
    return false;
  };

  const register = (data: Omit<ProviderProfile, "id" | "isVerified" | "joinedAt"> & { password: string }): boolean => {
    const providers = getStoredProviders();
    if (providers.some((p) => p.email === data.email)) return false;

    const newProvider: ProviderProfile & { password: string } = {
      ...data,
      id: `prov-${Date.now()}`,
      isVerified: false,
      joinedAt: new Date().toISOString(),
    };

    providers.push(newProvider);
    saveProviders(providers);

    const { password: _, ...profile } = newProvider;
    setProvider(profile);
    localStorage.setItem(PROVIDER_STORAGE_KEY, JSON.stringify(profile));
    return true;
  };

  const logout = () => {
    setProvider(null);
    localStorage.removeItem(PROVIDER_STORAGE_KEY);
  };

  const updateProfile = (data: Partial<ProviderProfile>) => {
    if (!provider) return;
    const updated = { ...provider, ...data };
    setProvider(updated);
    localStorage.setItem(PROVIDER_STORAGE_KEY, JSON.stringify(updated));

    const providers = getStoredProviders();
    const idx = providers.findIndex((p) => p.id === provider.id);
    if (idx >= 0) {
      providers[idx] = { ...providers[idx], ...data };
      saveProviders(providers);
    }
  };

  const addWorkPhoto = (photo: { name: string; url: string; description: string }) => {
    if (!provider) return;
    const newPhoto = { id: `photo-${Date.now()}`, ...photo };
    const updated = { ...provider, workPhotos: [...provider.workPhotos, newPhoto] };
    setProvider(updated);
    localStorage.setItem(PROVIDER_STORAGE_KEY, JSON.stringify(updated));

    const providers = getStoredProviders();
    const idx = providers.findIndex((p) => p.id === provider.id);
    if (idx >= 0) {
      providers[idx].workPhotos = [...providers[idx].workPhotos, newPhoto];
      saveProviders(providers);
    }
  };

  const removeWorkPhoto = (id: string) => {
    if (!provider) return;
    const updated = { ...provider, workPhotos: provider.workPhotos.filter((p) => p.id !== id) };
    setProvider(updated);
    localStorage.setItem(PROVIDER_STORAGE_KEY, JSON.stringify(updated));

    const providers = getStoredProviders();
    const idx = providers.findIndex((p) => p.id === provider.id);
    if (idx >= 0) {
      providers[idx].workPhotos = providers[idx].workPhotos.filter((p) => p.id !== id);
      saveProviders(providers);
    }
  };

  const addWorkExperience = (exp: { role: string; company: string; duration: string; projects: number }) => {
    if (!provider) return;
    const updated = { ...provider, workExperience: [...provider.workExperience, exp] };
    setProvider(updated);
    localStorage.setItem(PROVIDER_STORAGE_KEY, JSON.stringify(updated));

    const providers = getStoredProviders();
    const idx = providers.findIndex((p) => p.id === provider.id);
    if (idx >= 0) {
      providers[idx].workExperience = [...providers[idx].workExperience, exp];
      saveProviders(providers);
    }
  };

  const removeWorkExperience = (index: number) => {
    if (!provider) return;
    const updated = { ...provider, workExperience: provider.workExperience.filter((_, i) => i !== index) };
    setProvider(updated);
    localStorage.setItem(PROVIDER_STORAGE_KEY, JSON.stringify(updated));

    const providers = getStoredProviders();
    const idx = providers.findIndex((p) => p.id === provider.id);
    if (idx >= 0) {
      providers[idx].workExperience = providers[idx].workExperience.filter((_, i) => i !== index);
      saveProviders(providers);
    }
  };

  return (
    <AuthContext.Provider value={{
      provider, user, isLoggedIn: !!provider || !!user,
      loginAsUser, logoutUser,
      login, register, logout, updateProfile,
      addWorkPhoto, removeWorkPhoto,
      addWorkExperience, removeWorkExperience,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
