import { describe, it, expect, beforeEach, vi } from 'vitest';
import { analyticsService } from '../analytics';
import { apiClient } from '@/lib/api';

// Mock apiClient
vi.mock('@/lib/api', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe('analyticsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getMyAnalytics', () => {
    it('should fetch current user analytics', async () => {
      const mockAnalytics = {
        total_papers: 10,
        completed_papers: 8,
        average_score: 85,
      };

      vi.mocked(apiClient.get).mockResolvedValue({ data: mockAnalytics });

      const result = await analyticsService.getMyAnalytics();

      expect(apiClient.get).toHaveBeenCalledWith('/analytics/me');
      expect(result).toEqual(mockAnalytics);
    });
  });
});
