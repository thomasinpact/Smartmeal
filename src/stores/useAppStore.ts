import { create } from 'zustand';

const STORAGE_KEY = 'smartmeal_session_v1';

interface User {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'weekly' | 'monthly' | 'annual' | null;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppState {
  isAuthenticated: boolean;
  user: User | null;
  toasts: Toast[];
  loginWithProvider: (provider: 'apple' | 'google') => void;
  loginWithEmail: (email: string) => void;
  setPlan: (plan: User['plan']) => void;
  updateUser: (updates: Partial<Pick<User, 'name' | 'email'>>) => void;
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  logout: () => void;
  initSession: () => void;
}

function loadSession(): { isAuthenticated: boolean; user: User | null } {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        isAuthenticated: true,
        user: parsed,
      };
    }
  } catch (error) {
    console.error('Failed to load session:', error);
  }
  return { isAuthenticated: false, user: null };
}

function saveSession(user: User | null) {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.error('Failed to save session:', error);
  }
}

export const useAppStore = create<AppState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  toasts: [],

  loginWithProvider: (provider) => {
    const user: User = {
      id: `${provider}-${Date.now()}`,
      name: provider === 'apple' ? 'Utilisateur Apple' : 'Utilisateur Google',
      email: `user@${provider}.com`,
      plan: null,
    };
    saveSession(user);
    set({ isAuthenticated: true, user });
  },

  loginWithEmail: (email) => {
    const name = email.split('@')[0];
    const user: User = {
      id: `email-${Date.now()}`,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email,
      plan: null,
    };
    saveSession(user);
    set({ isAuthenticated: true, user });
  },

  setPlan: (plan) => {
    const { user } = get();
    if (user) {
      const updatedUser = { ...user, plan };
      saveSession(updatedUser);
      set({ user: updatedUser });
    }
  },

  updateUser: (updates) => {
    const { user } = get();
    if (user) {
      const updatedUser = { ...user, ...updates };
      saveSession(updatedUser);
      set({ user: updatedUser });
    }
  },

  addToast: (message, type = 'info') =>
    set((state) => ({
      toasts: [...state.toasts, { id: Date.now().toString(), message, type }],
    })),

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),

  logout: () => {
    saveSession(null);
    set({ isAuthenticated: false, user: null });
  },

  initSession: () => {
    const session = loadSession();
    set(session);
  },
}));
