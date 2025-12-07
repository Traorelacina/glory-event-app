import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authLogin, authLogout, LoginCredentials, LoginResponse, Admin } from '../services/api-client';

interface AuthState {
  admin: Admin | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
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

      checkAuth: () => {
        const { admin, token } = get();
        const isAuth = !!(admin && token);
        
        // Mettre à jour isAuthenticated si nécessaire
        if (get().isAuthenticated !== isAuth) {
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
      // Ajouter un hydratation listener pour vérifier l'état au chargement
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log('🔄 Store hydraté:', {
            hasAdmin: !!state.admin,
            hasToken: !!state.token,
            isAuthenticated: state.isAuthenticated
          });
          
          // Vérifier la cohérence des données
          if (state.admin && state.token && !state.isAuthenticated) {
            state.isAuthenticated = true;
          } else if ((!state.admin || !state.token) && state.isAuthenticated) {
            state.isAuthenticated = false;
          }
        }
      },
    }
  )
);
