// store/AuthStore.ts - VERSION SANS PERSISTANCE
import { create } from 'zustand';
import { authLogin, authLogout, LoginCredentials, LoginResponse, Admin } from '../services/api-client';

interface AuthState {
  admin: Admin | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  admin: null,
  token: null,
  isLoading: false,
  error: null,

  login: async (credentials: LoginCredentials) => {
    // Empêcher les doubles connexions
    if (get().isLoading) {
      console.warn('Connexion déjà en cours');
      return;
    }

    console.log('🔐 Début de la connexion...');
    set({ isLoading: true, error: null });
    
    try {
      // Appel API direct
      const response: LoginResponse = await authLogin(credentials);
      
      if (!response.user || !response.token) {
        throw new Error('Réponse invalide du serveur');
      }

      console.log('✅ Connexion réussie:', response.user.email);
      
      // Mettre à jour l'état IMMÉDIATEMENT
      set({
        admin: response.user,
        token: response.token,
        isLoading: false,
        error: null,
      });
      
    } catch (error: any) {
      console.error('❌ Erreur de connexion:', error);
      
      let errorMessage = 'Erreur de connexion. Veuillez réessayer.';
      
      if (error.status === 401) {
        errorMessage = 'Email ou mot de passe incorrect';
      } else if (error.status === 403) {
        errorMessage = 'Accès non autorisé';
      } else if (error.message) {
        errorMessage = error.message;
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
    
    // Reset immédiat
    set({
      admin: null,
      token: null,
      error: null,
      isLoading: false,
    });
    
    // Déconnexion serveur en arrière-plan
    if (token) {
      try {
        await authLogout(token);
        console.log('✅ Déconnexion serveur réussie');
      } catch (err) {
        console.warn('⚠️ Erreur lors de la déconnexion serveur:', err);
        // On ignore l'erreur, l'utilisateur est déjà déconnecté localement
      }
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
