import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

const MOCK_USER: User = {
  id: 'user-1',
  name: 'Dr. Sarah Chen',
  email: 'sarah.chen@electrabrain.io',
  role: 'Battery Analyst',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: MOCK_USER,
      token: 'mock-jwt-token',
      isAuthenticated: true,
      login: async (email: string, _password: string) => {
        await new Promise((resolve) => setTimeout(resolve, 400));
        set({
          user: { ...MOCK_USER, email },
          token: 'mock-jwt-token',
          isAuthenticated: true,
        });
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
      setUser: (user) => set({ user }),
    }),
    {
      name: 'electrabrain-auth',
    },
  ),
);
