// services/api-client.ts
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

export interface DashboardStats {
  total_services: number;
  total_produits: number;
  total_commandes: number;
  commandes_en_attente: number;
  total_contacts: number;
  total_portfolio: number;
}

export interface RecentOrder {
  id: number;
  order_number: string;
  customer_name: string;
  total: number;
  status: string;
  created_at: string;
}

export interface RecentContact {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export interface ViewTrackingData {
  page_name: string;
  url?: string;
  timestamp?: string;
}

export interface HealthCheckResponse {
  status: string;
  message: string;
}

export interface ApiConnectionTest {
  success: boolean;
  url: string;
  status?: number;
  data?: any;
  error?: string;
}

export interface ViewTrackResponse {
  success: boolean;
  message: string;
}

const API_BASE_URL = 'https://detailed-odette-freelence-76d5d470.koyeb.app/api';

console.log('API Base URL:', API_BASE_URL);

// ==============================
// FONCTIONS UTILITAIRES
// ==============================

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

// ==============================
// AUTHENTIFICATION
// ==============================

export const authLogin = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  console.log('🔐 Login attempt to:', `${API_BASE_URL}/login`);
  
  const response = await fetchWithTimeout(`${API_BASE_URL}/login`, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  const data = await handleResponse(response);
  console.log('✅ Login response:', data);
  return data;
};

export const authLogout = async (token: string): Promise<{ message: string }> => {
  console.log('🚪 Logout attempt');
  
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return await handleResponse(response);
  } catch (error: any) {
    console.error('Logout error:', error);
    // Ne pas jeter l'erreur pour logout
    return { message: 'Déconnexion locale effectuée' };
  }
};

export const checkHealth = async (): Promise<HealthCheckResponse> => {
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
};

// ==============================
// ADMIN API
// ==============================

export const adminApi = {
  getDashboard: async (token: string): Promise<{ data: DashboardStats }> => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/admin/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await handleResponse(response);
    return { data };
  },

  getRecentOrders: async (token: string): Promise<{ data: RecentOrder[] }> => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/admin/recent-orders`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await handleResponse(response);
    return { data };
  },

  getRecentContacts: async (token: string): Promise<{ data: RecentContact[] }> => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/admin/recent-contacts`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await handleResponse(response);
    return { data };
  },
};

// ==============================
// VIEW TRACKING
// ==============================

export const viewApi = {
  trackView: async (pageName: string): Promise<ViewTrackResponse> => {
    console.log('Tracking view for page:', pageName);
    
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/track-view`, {
        method: 'POST',
        body: JSON.stringify({ 
          page_name: pageName,
          url: window.location.href,
          timestamp: new Date().toISOString()
        }),
      }, 8000);
      
      return await handleResponse(response);
    } catch (error: any) {
      console.warn('View tracking failed (non-critical):', error.message);
      // Ne pas jeter l'erreur pour ne pas interrompre l'expérience utilisateur
      return { success: false, message: 'View not tracked (non-critical error)' };
    }
  },
  
  trackViewSimple: async (pageName: string): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/track-view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ page_name: pageName }),
      });
    } catch (error) {
      // Silencieux en cas d'erreur
    }
  }
};

// ==============================
// UTILITAIRES
// ==============================

export const testApiConnection = async (): Promise<ApiConnectionTest> => {
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

// Export des autres fonctions pour compatibilité
export const authApi = {
  login: authLogin,
  logout: authLogout,
  checkHealth: checkHealth,
};

// Export unique de l'URL de base
export { API_BASE_URL };
