// src/hooks/usePageTracking.ts

import { useEffect } from 'react';
import { statisticsService } from '../services/statisticsService';

export const usePageTracking = (pageName: string) => {
  useEffect(() => {
    // Track page view when component mounts
    statisticsService.trackView(pageName);
  }, [pageName]);
};