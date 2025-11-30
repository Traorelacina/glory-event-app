// src/services/statisticsService.ts

const API_BASE_URL = 'http://localhost:8000/api';

export const statisticsService = {
  async trackView(pageName: string) {
    try {
      console.log('Tracking view for page:', pageName); // Debug log
      
      const response = await fetch(`${API_BASE_URL}/track-view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ page_name: pageName }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Track view response:', result); // Debug log
      return result;
      
    } catch (error) {
      console.error('Error tracking view:', error);
      // Ne pas throw pour ne pas bloquer l'expérience utilisateur
    }
  },

  async getStatistics(token: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/statistics`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  }
};