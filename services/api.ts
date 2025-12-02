// Configuration API - TOUJOURS utiliser l'URL de production
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://detailed-odette-freelence-76d5d470.koyeb.app/api';

console.log('API Base URL:', API_BASE_URL); // Pour debug
console.log('Node Environment:', process.env.NODE_ENV); // Pour debug

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    role_label: string;
  };
  token: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

async function handleResponse(response: Response) {
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
  
  return {};
}

const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 15000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      mode: 'cors',
    });
    
    clearTimeout(id);
    return response;
  } catch (error: any) {
    clearTimeout(id);
    
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
    
    throw {
      message: `Erreur: ${error.message || 'Erreur inconnue'}`,
      networkError: true
    } as ApiError;
  }
};

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    console.log('Login attempt to:', `${API_BASE_URL}/login`);
    
    const response = await fetchWithTimeout(`${API_BASE_URL}/login`, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    return handleResponse(response);
  },

  logout: async (token: string): Promise<{ message: string }> => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  },
  
  checkHealth: async (): Promise<{ status: string; message: string }> => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/health`, {}, 8000);
      const data = await response.json();
      return { status: 'success', message: data.message || 'API is healthy' };
    } catch (error: any) {
      return { 
        status: 'error', 
        message: error.message || 'API health check failed' 
      };
    }
  }
};

export const adminApi = {
  getDashboard: async (token: string) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/admin/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  },

  getRecentOrders: async (token: string) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/admin/recent-orders`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  },

  getRecentContacts: async (token: string) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/admin/recent-contacts`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  },
};

export const viewApi = {
  trackView: async (pageName: string) => {
    console.log('Tracking view for page:', pageName);
    
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/track-view`, {
        method: 'POST',
        body: JSON.stringify({ page_name: pageName }),
      }, 8000);
      
      return handleResponse(response);
    } catch (error: any) {
      console.warn('View tracking failed (non-critical):', error.message);
      // Ne pas jeter l'erreur pour ne pas interrompre l'expérience utilisateur
      return { success: false, message: 'View not tracked (non-critical error)' };
    }
  },
};

// Fonction utilitaire pour tester la connexion
export const testApiConnection = async () => {
  console.log('🔄 Testing connection to:', API_BASE_URL);
  
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/health`, {}, 5000);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Connection successful:', data);
      return { 
        success: true, 
        url: API_BASE_URL,
        status: response.status,
        data 
      };
    } else {
      console.log('⚠️ API responded with status:', response.status);
      return { 
        success: false, 
        url: API_BASE_URL,
        status: response.status 
      };
    }
  } catch (error: any) {
    console.error('❌ API Connection failed to', API_BASE_URL, ':', error.message);
    return { 
      success: false, 
      url: API_BASE_URL,
      error: error.message 
    };
  }
};

// Export unique de l'URL de base
export { API_BASE_URL };
