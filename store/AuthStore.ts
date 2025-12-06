// store/AuthStore.ts
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
  isAuthenticated: () => boolean;
  reset: () => void;
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

      isAuthenticated: () => {
        const { token, admin, _hasHydrated } = get();
        return !!(token && admin && _hasHydrated);
      },

      reset: () => {
        set({
          admin: null,
          token: null,
          error: null,
          isLoading: false,
        });
      },

      login: async (credentials: LoginCredentials) => {
        const { isLoading } = get();
        if (isLoading) {
          console.warn('Connexion déjà en cours');
          return;
        }

        set({ isLoading: true, error: null });
        
        try {
          console.log('🔐 Tentative de connexion...', credentials.email);
          
          // Ajouter un timeout pour éviter les blocages
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout: La connexion a pris trop de temps')), 15000)
          );

          const loginPromise = authLogin(credentials);
          
          const response: LoginResponse = await Promise.race([loginPromise, timeoutPromise]) as LoginResponse;
          
          if (!response.user || !response.token) {
            throw new Error('Réponse invalide du serveur: données manquantes');
          }

          console.log('✅ Connexion réussie:', response.user.email);
          
          set({
            admin: response.user,
            token: response.token,
            isLoading: false,
            error: null,
          });
          
          // Force une mise à jour du localStorage
          await new Promise(resolve => setTimeout(resolve, 50));
          
        } catch (error: any) {
          console.error('❌ Erreur de connexion:', error);
          
          let errorMessage = 'Erreur de connexion. Veuillez réessayer.';
          
          if (error.message?.includes('Timeout')) {
            errorMessage = 'La connexion a pris trop de temps. Vérifiez votre réseau.';
          } else if (error.status === 401) {
            errorMessage = 'Email ou mot de passe incorrect';
          } else if (error.status === 403) {
            errorMessage = 'Accès non autorisé à l\'administration';
          } else if (error.status === 429) {
            errorMessage = 'Trop de tentatives. Veuillez patienter quelques minutes.';
          } else if (error.status >= 500) {
            errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
          } else if (error.message) {
            errorMessage = error.message;
          } else if (!navigator.onLine) {
            errorMessage = 'Pas de connexion Internet. Vérifiez votre connexion.';
          }
          
          set({
            admin: null,
            token: null,
            isLoading: false,
            error: errorMessage,
          });
          
          throw new Error(errorMessage);
        }
      },

      logout: async () => {
        const { token } = get();
        
        console.log('🚪 Déconnexion en cours...');
        
        // Réinitialiser immédiatement l'état local
        set({
          admin: null,
          token: null,
          error: null,
          isLoading: false,
        });
        
        try {
          // Nettoyer le localStorage
          localStorage.removeItem('auth-store');
          console.log('🗑️ Session nettoyée du localStorage');
        } catch (e) {
          console.error('❌ Erreur nettoyage localStorage:', e);
        }
        
        // Appeler le logout serveur en arrière-plan (sans bloquer)
        if (token) {
          setTimeout(() => {
            authLogout(token)
              .then(() => console.log('✅ Déconnexion serveur réussie'))
              .catch((err) => console.warn('⚠️ Erreur logout serveur:', err.message || err));
          }, 100);
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => {
        try {
          return localStorage;
        } catch (e) {
          console.error('❌ localStorage non disponible:', e);
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {}
          };
        }
      }),
      
      partialize: (state) => ({
        admin: state.admin,
        token: state.token,
        _hasHydrated: false, // Toujours réinitialiser l'hydratation
      }),
      
      onRehydrateStorage: () => {
        console.log('🌀 Début de l\'hydratation du store...');
        
        return (state, error) => {
          if (error) {
            console.error('❌ Erreur hydratation:', error);
            // Forcer l'hydratation même en cas d'erreur
            setTimeout(() => {
              if (state) {
                state.setHasHydrated(true);
              }
            }, 100);
          } else if (state) {
            console.log('📊 Store hydraté:', {
              hasAdmin: !!state.admin,
              hasToken: !!state.token,
              adminEmail: state.admin?.email || 'Aucun'
            });
            
            // Délai pour éviter les conflits de rendu
            setTimeout(() => {
              state.setHasHydrated(true);
              console.log('✅ Hydratation terminée');
            }, 200);
          }
        };
      },
      
      // Version pour les migrations futures
      version: 1,
    }
  )
);
