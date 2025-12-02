// src/services/statisticsService.ts

// src/services/statisticsService.ts

// URL API ABSOLUE - TOUJOURS utiliser l'URL de production
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://detailed-odette-freelence-76d5d470.koyeb.app/api';

console.log('📊 Statistics Service - API URL:', API_BASE_URL); // Debug log

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
        'Accept': 'application/json',
        ...options.headers,
      },
      mode: 'cors', // Important pour les requêtes cross-origin
    });
    
    clearTimeout(id);
    return response;
    
  } catch (error: any) {
    clearTimeout(id);
    
    // Gestion spécifique des types d'erreurs
    if (error.name === 'AbortError') {
      throw new Error('Timeout: La requête a pris trop de temps (10s)');
    }
    
    if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
      throw new Error('Impossible de se connecter au serveur. Vérifiez votre connexion internet.');
    }
    
    throw new Error(`Erreur réseau: ${error.message || 'Erreur inconnue'}`);
  }
};

// Types pour TypeScript
interface TrackViewResponse {
  success: boolean;
  message: string;
  data?: any;
}

interface StatisticsResponse {
  total_views: number;
  page_stats: Array<{
    page_name: string;
    view_count: number;
    last_viewed: string;
  }>;
  time_period: string;
  error?: string;
}

export const statisticsService = {
  async trackView(pageName: string): Promise<TrackViewResponse | void> {
    try {
      console.log('📈 Tracking view for page:', pageName, 'to:', `${API_BASE_URL}/track-view`);
      
      const response = await fetchWithTimeout(`${API_BASE_URL}/track-view`, {
        method: 'POST',
        body: JSON.stringify({ 
          page_name: pageName,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent,
          referrer: document.referrer || 'direct',
          url: window.location.href,
          path: window.location.pathname
        }),
      }, 8000); // Timeout plus court pour le tracking
      
      // Vérifier si la réponse est du JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.warn('⚠️ Response is not JSON:', await response.text());
        return {
          success: false,
          message: 'Réponse invalide du serveur'
        };
      }
      
      if (!response.ok) {
        console.warn(`⚠️ Track view HTTP error: ${response.status} ${response.statusText}`);
        
        try {
          const errorData = await response.json();
          return {
            success: false,
            message: errorData.message || `Erreur serveur: ${response.status}`
          };
        } catch {
          return {
            success: false,
            message: `Erreur serveur: ${response.status} ${response.statusText}`
          };
        }
      }
      
      const result: TrackViewResponse = await response.json();
      console.log('✅ Track view response:', result);
      return result;
      
    } catch (error: any) {
      console.error('❌ Error tracking view:', error.message);
      
      // En production, on log l'erreur mais on ne bloque pas l'expérience utilisateur
      return {
        success: false,
        message: error.message || 'Erreur de connexion'
      };
    }
  },

  async getStatistics(token: string): Promise<StatisticsResponse> {
    try {
      console.log('📊 Fetching statistics from:', `${API_BASE_URL}/statistics`);
      
      const response = await fetchWithTimeout(`${API_BASE_URL}/statistics`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }, 15000); // Timeout plus long pour les statistiques
      
      if (!response.ok) {
        // Vérifier le type de réponse
        const contentType = response.headers.get('content-type');
        let errorMessage = `Erreur ${response.status}`;
        
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch {
            // Ignorer si pas JSON lisible
          }
        }
        
        if (response.status === 401) {
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }
        if (response.status === 403) {
          throw new Error('Accès non autorisé.');
        }
        if (response.status === 404) {
          throw new Error('Endpoint de statistiques non trouvé.');
        }
        
        throw new Error(errorMessage);
      }
      
      const data: StatisticsResponse = await response.json();
      console.log('✅ Statistics fetched successfully');
      return data;
      
    } catch (error: any) {
      console.error('❌ Error fetching statistics:', error.message);
      
      // Retourner des données par défaut au lieu de casser l'interface
      return {
        total_views: 0,
        page_stats: [],
        time_period: 'today',
        error: error.message // Ajouter l'erreur dans la réponse pour debug
      };
    }
  },

  // Vérifier si le service de tracking est disponible
  async checkServiceHealth(): Promise<{ available: boolean; message: string; url: string }> {
    try {
      console.log('🏥 Checking service health at:', `${API_BASE_URL}/health`);
      
      const response = await fetchWithTimeout(`${API_BASE_URL}/health`, {}, 5000);
      
      if (!response.ok) {
        return {
          available: false,
          message: `Service health check failed: ${response.status} ${response.statusText}`,
          url: API_BASE_URL
        };
      }
      
      const data = await response.json();
      return {
        available: true,
        message: data.message || 'Service de statistiques disponible',
        url: API_BASE_URL
      };
      
    } catch (error: any) {
      console.error('❌ Service health check failed:', error.message);
      return {
        available: false,
        message: `Service indisponible: ${error.message}`,
        url: API_BASE_URL
      };
    }
  },

  // Track avec retry en cas d'échec
  async trackViewWithRetry(pageName: string, maxRetries = 2): Promise<void> {
    let retries = 0;
    
    while (retries <= maxRetries) {
      try {
        const result = await this.trackView(pageName);
        if (result?.success) {
          console.log(`✅ View tracked successfully for ${pageName} (attempt ${retries + 1})`);
          return;
        }
        
        retries++;
        if (retries <= maxRetries) {
          const delay = 1000 * retries; // Backoff linéaire: 1s, 2s, etc.
          console.log(`🔄 Retry ${retries}/${maxRetries} for page ${pageName} in ${delay}ms`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } catch (error) {
        retries++;
        console.error(`❌ Retry ${retries}/${maxRetries} failed:`, error);
      }
    }
    
    console.warn(`⚠️ Failed to track view for ${pageName} after ${maxRetries} retries`);
  },

  // Nouvelle méthode: Vérifier si l'API est accessible (simple ping)
  async pingApi(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'HEAD',
        mode: 'cors'
      });
      return response.ok;
    } catch {
      return false;
    }
  },

  // Nouvelle méthode: Obtenir les statistiques générales (sans auth pour les stats publiques)
  async getPublicStats(): Promise<StatisticsResponse | null> {
    try {
      console.log('📊 Fetching public statistics');
      
      const response = await fetchWithTimeout(`${API_BASE_URL}/public-stats`, {}, 8000);
      
      if (!response.ok) {
        return null;
      }
      
      return await response.json();
    } catch {
      return null;
    }
  }
};

// Export de l'URL pour debug
export { API_BASE_URL };

// Fonction utilitaire pour vérifier la configuration
export const checkApiConfig = () => {
  console.log('🔧 API Configuration Check:');
  console.log('   - API_BASE_URL:', API_BASE_URL);
  console.log('   - NODE_ENV:', process.env.NODE_ENV);
  console.log('   - REACT_APP_API_URL:', process.env.REACT_APP_API_URL || 'Not set');
  
  // Vérifier que l'URL ne contient pas localhost
  if (API_BASE_URL.includes('localhost') || API_BASE_URL.includes('127.0.0.1')) {
    console.error('❌ ERREUR: API_BASE_URL contient localhost!');
    console.error('   URL actuelle:', API_BASE_URL);
    console.error('   Solution: Définir REACT_APP_API_URL dans Netlify');
  } else {
    console.log('✅ API_BASE_URL semble correcte (pas de localhost)');
  }
};

// Exécuter la vérification au chargement (seulement en développement)
if (process.env.NODE_ENV !== 'production') {
  checkApiConfig();
}
