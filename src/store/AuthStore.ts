import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { LoginCredentials, LoginResponse, authApi } from '../../services/api';

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
    (set, get) => ({
      admin: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const response: LoginResponse = await authApi.login(credentials);
          
          // Mise à jour ATOMIQUE du state - les deux en même temps
          set({
            admin: response.user,
            token: response.token,
            isLoading: false,
            error: null,
          });
          
          // Le middleware persist va automatiquement sauvegarder
          // Pas besoin d'attendre, c'est synchrone avec localStorage
          
        } catch (error: any) {
          set({
            admin: null,
            token: null,
            isLoading: false,
            error: error.message || 'Erreur de connexion',
          });
          throw error;
        }
      },

      logout: async () => {
        const { token } = get();
        
        if (token) {
          try {
            await authApi.logout(token);
          } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
          }
        }
        
        // Réinitialisation complète
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
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        admin: state.admin,
        token: state.token,
      }),
    }
  )
);
