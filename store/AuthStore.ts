import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authLogin, authLogout, LoginCredentials, LoginResponse, Admin } from '../services/api-client';

interface AuthState {
  admin: Admin | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  _hasHydrated: boolean; // ✅ Nouveau flag
  setHasHydrated: (state: boolean) => void; // ✅ Setter
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
      _hasHydrated: false, // ✅ État initial

      setHasHydrated: (state: boolean) => {
        set({ _hasHydrated: state });
      },

      login: async (credentials: LoginCredentials) => {
        const { isLoading } = get();
        if (isLoading) {
          console.warn('⚠️ Connexion déjà en cours');
          return;
        }

        set({ isLoading: true, error: null });
        
        try {
          console.log('🔐 Connexion en cours...');
          
          const response: LoginResponse = await authLogin(credentials);
          
          if (!response.user || !response.token) {
            throw new Error('Réponse invalide du serveur');
          }

          console.log('✅ Connexion réussie:', response.user.email);
          
          // Mise à jour synchrone du state
          set({
            admin: response.user,
            token: response.token,
            isLoading: false,
            error: null,
          });
          
          console.log('💾 Session sauvegardée');
          
          // ✅ Attendre que le localStorage soit synchronisé
          await new Promise(resolve => setTimeout(resolve, 100));
          
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
          });
          
          throw error;
        }
      },

      logout: async () => {
        const { token } = get();
        
        console.log('🚪 Déconnexion...');
        
        // Réinitialisation immédiate
        set({
          admin: null,
          token: null,
          error: null,
          isLoading: false,
        });
        
        // Nettoyer le localStorage
        try {
          localStorage.removeItem('auth-store');
          console.log('🧹 Session nettoyée');
        } catch (e) {
          console.error('Erreur nettoyage:', e);
        }
        
        // Appel API en arrière-plan
        if (token) {
          authLogout(token)
            .then(() => console.log('✅ Déconnexion serveur OK'))
            .catch((err) => console.error('⚠️ Erreur logout serveur:', err));
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
        console.log('💧 Début de l'hydratation du store...');
        
        return (state, error) => {
          if (error) {
            console.error('❌ Erreur hydratation:', error);
            state?.setHasHydrated(true);
          } else if (state) {
            console.log('✅ Store hydraté avec succès:', {
              hasAdmin: !!state.admin,
              hasToken: !!state.token
            });
            
            if (state.admin && state.token) {
              console.log('👤 Session active:', state.admin.email);
            } else {
              console.log('📭 Aucune session active');
            }
            
            // ✅ Marquer comme hydraté
            state.setHasHydrated(true);
          }
        };
      },
    }
  )
);
