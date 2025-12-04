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
  isInitialized: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  setAdmin: (admin: Admin | null) => void;
  setToken: (token: string | null) => void;
  checkAuth: () => boolean;
  checkAuthAsync: () => Promise<boolean>;
  resetAuth: () => void;
  getAuthState: () => { admin: Admin | null; token: string | null };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      admin: null,
      token: null,
      isLoading: false,
      error: null,
      isInitialized: false,

      login: async (credentials: LoginCredentials) => {
        const { isLoading } = get();
        if (isLoading) {
          console.warn('⚠️ Tentative de connexion déjà en cours');
          return;
        }

        set({ isLoading: true, error: null });
        
        try {
          console.log('🔐 Tentative de connexion...');
          
          const response: LoginResponse = await authApi.login(credentials);
          
          if (!response.user || !response.token) {
            throw new Error('Réponse invalide du serveur');
          }

          console.log('✅ Connexion réussie:', response.user.email);
          
          // Mise à jour SYNCHRONE et ATOMIQUE
          set({
            admin: response.user,
            token: response.token,
            isLoading: false,
            error: null,
            isInitialized: true,
          }, true); // Le "true" force une mise à jour synchrone
          
          console.log('💾 Session sauvegardée');
          
          // Forcer l'écriture dans localStorage
          await new Promise(resolve => setTimeout(resolve, 0));
          
        } catch (error: any) {
          console.error('❌ Erreur de connexion:', error);
          
          let errorMessage = 'Erreur de connexion. Veuillez réessayer.';
          
          if (error.response?.status === 401) {
            errorMessage = 'Email ou mot de passe incorrect';
          } else if (error.response?.status === 403) {
            errorMessage = 'Accès non autorisé';
          } else if (error.response?.status === 429) {
            errorMessage = 'Trop de tentatives. Veuillez patienter.';
          } else if (error.response?.status >= 500) {
            errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
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
            isInitialized: true,
          }, true);
          
          throw error;
        }
      },

      logout: async () => {
        const { token } = get();
        
        console.log('🚪 Déconnexion en cours...');
        
        // Réinitialisation IMMÉDIATE et SYNCHRONE
        set({
          admin: null,
          token: null,
          error: null,
          isLoading: false,
          isInitialized: true,
        }, true); // Force la mise à jour synchrone
        
        // Nettoyer le localStorage IMMÉDIATEMENT
        try {
          localStorage.removeItem('auth-store');
          console.log('🧹 LocalStorage nettoyé');
        } catch (e) {
          console.error('Erreur nettoyage localStorage:', e);
        }
        
        console.log('✅ State réinitialisé');
        
        // Appel API en arrière-plan
        if (token) {
          authApi.logout(token)
            .then(() => console.log('✅ Déconnexion serveur réussie'))
            .catch((error) => console.error('⚠️ Erreur logout serveur:', error));
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setAdmin: (admin: Admin | null) => {
        set({ admin });
      },

      setToken: (token: string | null) => {
        set({ token });
      },

      checkAuth: (): boolean => {
        const { admin, token } = get();
        const isAuthenticated = !!(admin && token);
        
        console.log('🔍 Vérification auth:', { 
          hasAdmin: !!admin, 
          hasToken: !!token,
          isAuthenticated 
        });
        
        return isAuthenticated;
      },

      checkAuthAsync: async (): Promise<boolean> => {
        return new Promise((resolve) => {
          // Vérifier immédiatement
          const { admin, token } = get();
          const isAuthenticated = !!(admin && token);
          
          console.log('🔍 Vérification auth async:', { 
            hasAdmin: !!admin, 
            hasToken: !!token,
            isAuthenticated 
          });
          
          resolve(isAuthenticated);
        });
      },

      getAuthState: () => {
        const { admin, token } = get();
        return { admin, token };
      },

      resetAuth: () => {
        console.log('🔄 Réinitialisation complète du store');
        
        set({
          admin: null,
          token: null,
          isLoading: false,
          error: null,
          isInitialized: true,
        }, true);
        
        try {
          localStorage.removeItem('auth-store');
        } catch (e) {
          console.error('Erreur lors du nettoyage:', e);
        }
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
        console.log('💧 Début de l\'hydratation du store...');
        
        return (state, error) => {
          if (error) {
            console.error('❌ Erreur d\'hydratation:', error);
            if (state) {
              state.resetAuth();
            }
          } else if (state) {
            console.log('✅ Store hydraté avec succès:', {
              hasAdmin: !!state.admin,
              hasToken: !!state.token,
              timestamp: new Date().toISOString()
            });
            
            // Forcer l'initialisation
            state.isInitialized = true;
            
            if (state.admin && state.token) {
              console.log('👤 Session restaurée:', state.admin.email);
            } else {
              console.log('📭 Aucune session active');
            }
          }
        };
      },
      
      version: 1,
      
      migrate: (persistedState: any, version: number) => {
        console.log(`🔄 Migration du store v${version}`);
        
        if (version === 0) {
          return {
            ...persistedState,
            isInitialized: true,
          };
        }
        
        return persistedState;
      },
    }
  )
);
