// Configuration dynamique selon l'environnement
const getApiBaseUrl = () => {
  // Si en production (Netlify) ou si variable d'environnement définie
  if (process.env.NODE_ENV === 'production' || process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL || 'https://detailed-odette-freelence-76d5d470.koyeb.app/api';
  }
  // Sinon, développement local
  return 'http://localhost:8000/api';
};

const API_BASE_URL = getApiBaseUrl();

console.log('API Base URL:', API_BASE_URL); // Pour debug

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
  // Vérifiez d'abord si la réponse est vide
  const contentType = response.headers.get('content-type');
  
  if (!contentType || !contentType.includes('application/json')) {
    throw {
      message: 'Réponse non-JSON du serveur',
      status: response.status,
      statusText: response.statusText
    } as ApiError;
  }

  const data = await response.json();

  if (!response.ok) {
    throw {
      message: data.message || `Erreur ${response.status}: ${response.statusText}`,
      errors: data.errors,
      status: response.status
    } as ApiError;
  }

  return data;
}

// Fonction fetch avec timeout et gestion d'erreurs améliorée
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 10000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    clearTimeout(id);
    return response;
  } catch (error: any) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw {
        message: 'Timeout: La requête a pris trop de temps',
        timeout: true
      } as ApiError;
    }
    throw {
      message: `Erreur réseau: ${error.message}`,
      networkError: true
    } as ApiError;
  }
};

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
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

  // Optionnel: Vérifier si l'API est accessible
  checkConnection: async (): Promise<{ status: string; message: string }> => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/health`, {}, 5000);
      return await response.json();
    } catch (error) {
      throw {
        message: 'Impossible de se connecter au serveur API',
        details: error
      } as ApiError;
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

// Fonction utilitaire pour tester la connexion
export const testApiConnection = async () => {
  console.log('Testing connection to:', API_BASE_URL);
  
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Connection successful:', data);
      return { success: true, data };
    } else {
      console.log('⚠️ API responded with status:', response.status);
      return { success: false, status: response.status };
    }
  } catch (error) {
    console.error('❌ API Connection failed:', error);
    return { success: false, error };
  }
};
