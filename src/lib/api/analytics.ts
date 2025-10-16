/**
 * Analytics API client
 */
import { apiClient } from '@/lib/api';

export interface UserAnalytics {
  total_papers: number;
  completed_papers: number;
  accuracy_rate: number;
  [key: string]: unknown;  // Allow additional fields
}

export const analyticsService = {
  /**
   * Get analytics for the current user
   */
  async getMyAnalytics(): Promise<UserAnalytics> {
    const response = await apiClient.get<UserAnalytics>('/analytics/me');
    return response.data;
  },
};
