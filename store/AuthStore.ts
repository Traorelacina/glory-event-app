import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
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
  isHydrated: boolean; // Nouveau flag pour savoir si les données sont chargées
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
      isHydrated: false,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const response: LoginResponse = await authApi.login(credentials);
          
          // Mise à jour de l'état
          set({
            admin: response.user,
            token: response.token,
            isLoading: false,
            error: null,
          });

          // Attendre que la persistance soit terminée
          await new Promise(resolve => setTimeout(resolve, 100));

          // Vérifier que les données sont bien sauvegardées
          const savedData = localStorage.getItem('auth-store');
          if (!savedData) {
            throw new Error('Échec de la sauvegarde des données');
          }

          console.log('Login successful, data persisted');
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
        const token = get().token;
        
        if (token) {
          try {
            await authApi.logout(token);
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

        // Nettoyer le localStorage explicitement
        localStorage.removeItem('auth-store');
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
      onRehydrateStorage: () => (state) => {
        // Marquer comme hydraté une fois la restauration terminée
        if (state) {
          state.isHydrated = true;
        }
      },
    }
  )
);
