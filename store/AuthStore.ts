import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authLogin, authLogout, LoginCredentials, LoginResponse, Admin } from '../services/api-client';

interface AuthState {
  admin: Admin | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      admin: null,
      token: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setHasHydrated: (state: boolean) => {
        console.log('🔧 setHasHydrated appelé avec:', state);
        set({ _hasHydrated: state });
      },

      checkAuth: () => {
        const state = get();
        const { admin, token, _hasHydrated } = state;
        
        // Ne PAS attendre l'hydratation dans checkAuth
        // Juste vérifier si on a les données
        const isAuth = !!(admin && token);
        
        console.log('🔍 checkAuth:', { 
          hasAdmin: !!admin, 
          hasToken: !!token, 
          isAuth,
          hydrated: _hasHydrated
        });
        
        // Mettre à jour isAuthenticated si nécessaire
        if (state.isAuthenticated !== isAuth) {
          set({ isAuthenticated: isAuth });
        }
        
        return isAuth;
      },

      login: async (credentials: LoginCredentials) => {
        const { isLoading } = get();
        
        // Éviter les doubles appels
        if (isLoading) {
          console.warn('⚠️ Connexion déjà en cours');
          return;
        }

        set({ isLoading: true, error: null });
        
        try {
          console.log('🔐 Tentative de connexion...');
          
          const response: LoginResponse = await authLogin(credentials);
          
          console.log('✅ Login response reçue:', { 
            hasUser: !!response.user, 
            hasToken: !!response.token,
            email: response.user?.email 
          });
          
          // Validation de la réponse
          if (!response.user || !response.token) {
            throw new Error('Réponse invalide du serveur');
          }

          console.log('✅ Connexion réussie pour:', response.user.email);
          
          // Mise à jour de l'état avec toutes les données
          set({
            admin: response.user,
            token: response.token,
            isLoading: false,
            error: null,
            isAuthenticated: true,
          });
          
          console.log('💾 Session sauvegardée');
          
          // Attendre un peu pour la persistence
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Vérifier que les données sont bien sauvegardées
          const newState = get();
          console.log('✅ État après login:', {
            hasAdmin: !!newState.admin,
            hasToken: !!newState.token,
            isAuth: newState.isAuthenticated
          });
          
        } catch (error: any) {
          console.error('❌ Erreur de connexion:', error);
          
          let errorMessage = 'Erreur de connexion. Veuillez réessayer.';
          
          if (error.status === 401) {
            errorMessage = 'Email ou mot de passe incorrect';
          } else if (error.status === 403) {
            errorMessage = 'Accès non autorisé';
          } else if (error.status === 429) {
            errorMessage = 'Trop de tentatives. Veuillez patienter.';
          } else if (error.status >= 500) {
            errorMessage = 'Erreur serveur. Réessayez plus tard.';
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          set({
            admin: null,
            token: null,
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
          });
          
          throw new Error(errorMessage);
        }
      },

      logout: async () => {
        const { token } = get();
        
        console.log('🚪 Déconnexion...');
        
        // Réinitialiser l'état
        set({
          admin: null,
          token: null,
          error: null,
          isLoading: false,
          isAuthenticated: false,
        });
        
        // Nettoyer le localStorage
        try {
          localStorage.removeItem('auth-store');
          console.log('🧹 LocalStorage nettoyé');
        } catch (e) {
          console.error('Erreur nettoyage localStorage:', e);
        }
        
        // Appel API déconnexion (non bloquant)
        if (token) {
          authLogout(token).catch(() => {});
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
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => {
        console.log('💧 Début hydratation store...');
        
        return (state, error) => {
          if (error) {
            console.error('❌ Erreur hydratation:', error);
            if (state) {
              state._hasHydrated = true;
              console.log('✅ Flag hydratation forcé malgré erreur');
            }
            return;
          }
          
          if (!state) {
            console.warn('⚠️ State null après hydratation');
            return;
          }
          
          const hasData = !!(state.admin && state.token);
          
          console.log('✅ Store hydraté:', {
            hasAdmin: !!state.admin,
            hasToken: !!state.token,
            email: state.admin?.email,
            timestamp: new Date().toISOString()
          });
          
          // Synchroniser isAuthenticated
          if (hasData) {
            state.isAuthenticated = true;
            console.log('👤 Session active:', state.admin.email);
          } else {
            state.isAuthenticated = false;
            console.log('📭 Aucune session');
          }
          
          // CRITIQUE: Marquer hydratation complète
          state._hasHydrated = true;
          console.log('✅ _hasHydrated = true');
          
          // Vérification finale
          setTimeout(() => {
            const currentState = useAuthStore.getState();
            console.log('🔍 Vérification post-hydratation:', {
              hydrated: currentState._hasHydrated,
              hasAdmin: !!currentState.admin,
              hasToken: !!currentState.token
            });
          }, 50);
        };
      },
    }
  )
);
