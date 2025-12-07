import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authLogin, authLogout, LoginCredentials, LoginResponse, Admin } from '../services/api-client';

interface AuthState {
  admin: Admin | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean; // Flag pour savoir si le store est hydraté
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
        set({ _hasHydrated: state });
      },

      checkAuth: () => {
        const state = get();
        
        // Attendre que l'hydratation soit complète
        if (!state._hasHydrated) {
          console.log('⏳ En attente de l\'hydratation du store...');
          return false;
        }
        
        const { admin, token } = state;
        const isAuth = !!(admin && token);
        
        console.log('🔍 Vérification auth:', { 
          hasAdmin: !!admin, 
          hasToken: !!token, 
          isAuthenticated: isAuth 
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
          console.log('🔐 Login attempt to:', `${import.meta.env.VITE_API_BASE_URL || 'https://detailed-odette-freelence-76d5d470.koyeb.app/api'}/login`);
          
          const response: LoginResponse = await authLogin(credentials);
          
          console.log('✅ Login response:', { user: response.user, token: response.token });
          
          // Validation de la réponse
          if (!response.user || !response.token) {
            throw new Error('Réponse invalide du serveur');
          }

          console.log('✅ Connexion réussie:', response.user.email);
          
          // Mise à jour de l'état avec toutes les données
          set({
            admin: response.user,
            token: response.token,
            isLoading: false,
            error: null,
            isAuthenticated: true,
          });
          
          console.log('💾 Session sauvegardée dans localStorage');
          
          // Forcer la persistence immédiate
          await new Promise(resolve => setTimeout(resolve, 50));
          
        } catch (error: any) {
          console.error('❌ Erreur de connexion:', error);
          
          let errorMessage = 'Erreur de connexion. Veuillez réessayer.';
          
          // Gestion des codes d'erreur HTTP
          if (error.status === 401) {
            errorMessage = 'Email ou mot de passe incorrect';
          } else if (error.status === 403) {
            errorMessage = 'Accès non autorisé. Vous n\'avez pas les permissions requises.';
          } else if (error.status === 429) {
            errorMessage = 'Trop de tentatives. Veuillez patienter quelques minutes.';
          } else if (error.status >= 500) {
            errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
          } else if (error.message) {
            errorMessage = error.message;
          } else if (error.networkError) {
            errorMessage = 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.';
          } else if (error.timeout) {
            errorMessage = 'La connexion a pris trop de temps. Veuillez réessayer.';
          }
          
          // Réinitialiser l'état en cas d'erreur
          set({
            admin: null,
            token: null,
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
          });
          
          // Propager l'erreur pour que le composant puisse la gérer
          throw new Error(errorMessage);
        }
      },

      logout: async () => {
        const { token } = get();
        
        console.log('🚪 Déconnexion en cours...');
        
        // Réinitialiser l'état immédiatement
        set({
          admin: null,
          token: null,
          error: null,
          isLoading: false,
          isAuthenticated: false,
        });
        
        console.log('✅ State réinitialisé');
        
        // Nettoyer le localStorage
        try {
          localStorage.removeItem('auth-store');
          console.log('🧹 LocalStorage nettoyé');
        } catch (e) {
          console.error('Erreur lors du nettoyage du localStorage:', e);
        }
        
        // Appel API de déconnexion (non bloquant)
        if (token) {
          authLogout(token)
            .then(() => console.log('✅ Déconnexion serveur réussie'))
            .catch((err) => console.warn('⚠️ Erreur logout serveur (non critique):', err));
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
        console.log('💧 Début de l\'hydratation du store...');
        
        return (state, error) => {
          if (error) {
            console.error('❌ Erreur d\'hydratation:', error);
            return;
          }
          
          if (state) {
            const hydrationState = {
              hasAdmin: !!state.admin,
              hasToken: !!state.token,
              timestamp: new Date().toISOString()
            };
            
            console.log('✅ Store hydraté avec succès:', hydrationState);
            
            // Vérifier la cohérence des données
            if (state.admin && state.token) {
              state.isAuthenticated = true;
              console.log('✅ Session active détectée');
            } else {
              state.isAuthenticated = false;
              console.log('📭 Aucune session active');
            }
            
            // Marquer l'hydratation comme complète
            state._hasHydrated = true;
          }
        };
      },
    }
  )
);
