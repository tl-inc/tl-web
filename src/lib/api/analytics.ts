/**
 * Analytics API client
 */
import { apiClient } from '@/lib/api';

export const analyticsService = {
  /**
   * Get analytics for the current user
   */
  async getMyAnalytics(): Promise<any> {
    const response = await apiClient.get('/analytics/me');
    return response.data;
  },
};
