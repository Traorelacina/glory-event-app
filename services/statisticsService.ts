// src/services/statisticsService.ts

// src/services/statisticsService.ts

// URL API ABSOLUE - TOUJOURS l'URL de production (Koyeb)
const API_BASE_URL = 'https://detailed-odette-freelence-76d5d470.koyeb.app/api';

console.log('📊 Statistics Service - API URL:', API_BASE_URL);

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
        'Accept': 'application/json',
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

// Types
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
  async trackView(pageName: string): Promise<TrackViewResponse> {
    try {
      console.log('📈 Tracking view for page:', pageName);
      
      const response = await fetchWithTimeout(`${API_BASE_URL}/track-view`, {
        method: 'POST',
        body: JSON.stringify({ 
          page_name: pageName,
          timestamp: new Date().toISOString()
        }),
      });
      
      if (!response.ok) {
        console.warn(`⚠️ Track view HTTP error: ${response.status}`);
        return {
          success: false,
          message: `Erreur serveur: ${response.status}`
        };
      }
      
      const result: TrackViewResponse = await response.json();
      return result;
      
    } catch (error: any) {
      console.error('❌ Error tracking view:', error.message);
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
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expirée');
        }
        throw new Error(`Erreur serveur: ${response.status}`);
      }
      
      const data: StatisticsResponse = await response.json();
      return data;
      
    } catch (error: any) {
      console.error('❌ Error fetching statistics:', error.message);
      
      return {
        total_views: 0,
        page_stats: [],
        time_period: 'today',
        error: error.message
      };
    }
  },

  // Vérifier si le service est disponible
  async checkServiceHealth(): Promise<{ available: boolean; message: string }> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/health`, {}, 5000);
      
      if (response.ok) {
        return {
          available: true,
          message: 'Service disponible'
        };
      }
      
      return {
        available: false,
        message: `Service répond avec erreur: ${response.status}`
      };
      
    } catch (error: any) {
      return {
        available: false,
        message: `Service indisponible: ${error.message}`
      };
    }
  }
};

// Export de l'URL
export { API_BASE_URL };
