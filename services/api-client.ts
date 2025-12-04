// services/api-client.ts
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface Admin {
  id: number;
  name: string;
  email: string;
  role: string;
  role_label: string;
}

export interface LoginResponse {
  user: Admin;
  token: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
  timeout?: boolean;
  networkError?: boolean;
}

const API_BASE_URL = 'https://detailed-odette-freelence-76d5d470.koyeb.app/api';

export const authLogin = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  console.log('🔐 Login attempt to:', `${API_BASE_URL}/login`);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(credentials),
      signal: controller.signal,
      mode: 'cors',
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `Erreur ${response.status}: ${response.statusText}`;
      
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          errorMessage = data.message || errorMessage;
        }
      } catch (e) {
        // Ignorer si pas JSON
      }
      
      const error: ApiError = { 
        message: errorMessage, 
        status: response.status 
      };
      throw error;
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('✅ Login response:', data);
      return data;
    }
    
    throw { message: 'Réponse non-JSON reçue' } as ApiError;
    
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw {
        message: 'Timeout: La requête a pris trop de temps (>15s)',
        timeout: true
      } as ApiError;
    }
    
    if (error.message?.includes('Failed to fetch')) {
      throw {
        message: 'Impossible de se connecter au serveur API. Vérifiez votre connexion internet.',
        networkError: true
      } as ApiError;
    }
    
    // Si c'est déjà un ApiError, le relancer
    if (error.message && error.status) {
      throw error;
    }
    
    throw {
      message: `Erreur: ${error.message || 'Erreur inconnue'}`,
      networkError: true
    } as ApiError;
  }
};

export const authLogout = async (token: string): Promise<{ message: string }> => {
  console.log('🚪 Logout attempt');
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      mode: 'cors',
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `Erreur ${response.status}: ${response.statusText}`;
      
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          errorMessage = data.message || errorMessage;
        }
      } catch (e) {
        // Ignorer si pas JSON
      }
      
      throw { message: errorMessage, status: response.status } as ApiError;
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return { message: 'Déconnexion réussie' };
    
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error('Logout error:', error);
    // Ne pas jeter l'erreur pour logout
    return { message: 'Déconnexion locale effectuée' };
  }
};
