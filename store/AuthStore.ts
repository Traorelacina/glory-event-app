import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LoginCredentials, LoginResponse, authApi } from '../services/api';

export interface Admin {
  id: number;
  name: string;
  email: string;
  role: string;
  role_label: string;
}

interface AuthState {
  admin: Admin | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  setAdmin: (admin: Admin | null) => void;
  setToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      admin: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const response: LoginResponse = await authApi.login(credentials);
          set({
            admin: response.user,
            token: response.token,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Erreur de connexion',
          });
          throw error;
        }
      },

      logout: async () => {
        const state = (useAuthStore as any).getState();
        if (state.token) {
          try {
            await authApi.logout(state.token);
          } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
          }
        }
        set({
          admin: null,
          token: null,
          error: null,
          isLoading: false,
        });
      },

      clearError: () => set({ error: null }),

      setAdmin: (admin: Admin | null) => set({ admin }),

      setToken: (token: string | null) => set({ token }),
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        admin: state.admin,
        token: state.token,
      }),
    }
  )
);
