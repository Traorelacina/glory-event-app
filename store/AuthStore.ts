import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authLogin, authLogout, LoginCredentials, LoginResponse, Admin } from '../services/api-client';

interface AuthState {
  admin: Admin | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      admin: null,
      token: null,
      isLoading: false,
      error: null,
      _hasHydrated: false,

      setHasHydrated: (state: boolean) => {
        set({ _hasHydrated: state });
      },

      login: async (credentials: LoginCredentials) => {
        const { isLoading } = get();
        if (isLoading) {
          console.warn('Connexion deja en cours');
          return;
        }

        set({ isLoading: true, error: null });
        
        try {
          console.log('Connexion en cours...');
          
          const response: LoginResponse = await authLogin(credentials);
          
          if (!response.user || !response.token) {
            throw new Error('Reponse invalide du serveur');
          }

          console.log('Connexion reussie:', response.user.email);
          
          set({
            admin: response.user,
            token: response.token,
            isLoading: false,
            error: null,
          });
          
          console.log('Session sauvegardee');
          
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (error: any) {
          console.error('Erreur de connexion:', error);
          
          let errorMessage = 'Erreur de connexion. Veuillez reessayer.';
          
          if (error.status === 401) {
            errorMessage = 'Email ou mot de passe incorrect';
          } else if (error.status === 403) {
            errorMessage = 'Acces non autorise';
          } else if (error.status === 429) {
            errorMessage = 'Trop de tentatives. Veuillez patienter.';
          } else if (error.status >= 500) {
            errorMessage = 'Erreur serveur. Veuillez reessayer plus tard.';
          } else if (error.message) {
            errorMessage = error.message;
          } else if (!navigator.onLine) {
            errorMessage = 'Pas de connexion Internet';
          }
          
          set({
            admin: null,
            token: null,
            isLoading: false,
            error: errorMessage,
          });
          
          throw error;
        }
      },

      logout: async () => {
        const { token } = get();
        
        console.log('Deconnexion...');
        
        set({
          admin: null,
          token: null,
          error: null,
          isLoading: false,
        });
        
        try {
          localStorage.removeItem('auth-store');
          console.log('Session nettoyee');
        } catch (e) {
          console.error('Erreur nettoyage:', e);
        }
        
        if (token) {
          authLogout(token)
            .then(() => console.log('Deconnexion serveur OK'))
            .catch((err) => console.error('Erreur logout serveur:', err));
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => localStorage),
      
      partialize: (state) => ({
        admin: state.admin,
        token: state.token,
      }),
      
      onRehydrateStorage: () => {
        console.log('Debut de hydratation du store...');
        
        return (state, error) => {
          if (error) {
            console.error('Erreur hydratation:', error);
            state?.setHasHydrated(true);
          } else if (state) {
            console.log('Store hydrate avec succes:', {
              hasAdmin: !!state.admin,
              hasToken: !!state.token
            });
            
            if (state.admin && state.token) {
              console.log('Session active:', state.admin.email);
            } else {
              console.log('Aucune session active');
            }
            
            state.setHasHydrated(true);
          }
        };
      },
    }
  )
);
