// src/services/statisticsService.ts

// Configuration dynamique selon l'environnement
const getApiBaseUrl = () => {
  // Priorité 1: Variable d'environnement (Netlify, Vercel, etc.)
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  // Priorité 2: Environnement de production
  if (process.env.NODE_ENV === 'production') {
    return 'https://detailed-odette-freelence-76d5d470.koyeb.app/api';
  }
  // Développement local
  return 'http://localhost:8000/api';
};

const API_BASE_URL = getApiBaseUrl();

console.log('📊 Statistics Service - API URL:', API_BASE_URL); // Debug log

// Fonction fetch avec timeout et gestion d'erreurs
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
      throw new Error('Timeout: La requête a pris trop de temps');
    }
    throw new Error(`Erreur réseau: ${error.message}`);
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
}

export const statisticsService = {
  async trackView(pageName: string): Promise<TrackViewResponse | void> {
    try {
      console.log('📈 Tracking view for page:', pageName);
      
      const response = await fetchWithTimeout(`${API_BASE_URL}/track-view`, {
        method: 'POST',
        body: JSON.stringify({ 
          page_name: pageName,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent,
          referrer: document.referrer || 'direct'
        }),
      });
      
      if (!response.ok) {
        console.warn(`⚠️ Track view HTTP error: ${response.status} ${response.statusText}`);
        // En production, on ne bloque pas l'utilisateur pour une erreur de tracking
        return {
          success: false,
          message: `Erreur serveur: ${response.status}`
        };
      }
      
      const result: TrackViewResponse = await response.json();
      console.log('✅ Track view response:', result);
      return result;
      
    } catch (error: any) {
      console.error('❌ Error tracking view:', error.message);
      // En production, on log l'erreur mais on ne bloque pas l'expérience utilisateur
      if (process.env.NODE_ENV === 'production') {
        // Optionnel: Envoyer l'erreur à un service de monitoring (Sentry, LogRocket, etc.)
        // captureException(error);
      }
      return {
        success: false,
        message: error.message || 'Erreur de connexion'
      };
    }
  },

  async getStatistics(token: string): Promise<StatisticsResponse> {
    try {
      console.log('📊 Fetching statistics...');
      
      const response = await fetchWithTimeout(`${API_BASE_URL}/statistics`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }, 15000); // Timeout plus long pour les statistiques
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }
        if (response.status === 403) {
          throw new Error('Accès non autorisé.');
        }
        throw new Error(`Erreur serveur: ${response.status} ${response.statusText}`);
      }
      
      const data: StatisticsResponse = await response.json();
      console.log('✅ Statistics fetched successfully');
      return data;
      
    } catch (error: any) {
      console.error('❌ Error fetching statistics:', error.message);
      
      // En production, on peut fournir des données par défaut
      if (process.env.NODE_ENV === 'production') {
        // Retourner des données par défaut au lieu de casser l'interface
        return {
          total_views: 0,
          page_stats: [],
          time_period: 'today',
          error: error.message // Ajouter l'erreur dans la réponse pour debug
        };
      }
      
      throw error; // En développement, on propage l'erreur
    }
  },

  // Nouvelle méthode: Vérifier si le service de tracking est disponible
  async checkServiceHealth(): Promise<{ available: boolean; message: string }> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/health`, {}, 5000);
      const data = await response.json();
      return {
        available: true,
        message: 'Service de statistiques disponible'
      };
    } catch (error: any) {
      return {
        available: false,
        message: `Service indisponible: ${error.message}`
      };
    }
  },

  // Nouvelle méthode: Track avec retry en cas d'échec
  async trackViewWithRetry(pageName: string, maxRetries = 2): Promise<void> {
    let retries = 0;
    
    while (retries <= maxRetries) {
      try {
        const result = await this.trackView(pageName);
        if (result?.success) {
          return;
        }
        retries++;
        if (retries <= maxRetries) {
          console.log(`🔄 Retry ${retries}/${maxRetries} for page: ${pageName}`);
          await new Promise(resolve => setTimeout(resolve, 1000 * retries)); // Backoff exponentiel
        }
      } catch (error) {
        retries++;
        console.error(`❌ Retry ${retries}/${maxRetries} failed:`, error);
      }
    }
    
    console.warn(`⚠️ Failed to track view for ${pageName} after ${maxRetries} retries`);
  }
};
