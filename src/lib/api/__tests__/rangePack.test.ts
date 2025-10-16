import { describe, it, expect, beforeEach, vi } from 'vitest';
import { rangePackService } from '../rangePack';
import { apiClient } from '@/lib/api';

// Mock apiClient
vi.mock('@/lib/api', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe('rangePackService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAvailableSubjects', () => {
    it('should fetch available subjects by grade', async () => {
      const mockSubjects = [
        { id: 1, name: 'Math', code: 'MATH' },
        { id: 2, name: 'English', code: 'ENG' },
      ];

      vi.mocked(apiClient.get).mockResolvedValue({ data: mockSubjects });

      const result = await rangePackService.getAvailableSubjects(7);

      expect(apiClient.get).toHaveBeenCalledWith('/range-packs/available_subjects', {
        params: { grade: 7 },
      });
      expect(result).toEqual(mockSubjects);
    });
  });

  describe('getRangePacks', () => {
    it('should fetch range packs by subject and grade', async () => {
      const mockRangePacks = [
        { id: 1, name: 'Chapter 1', range_type: 'chapter' },
        { id: 2, name: 'Chapter 2', range_type: 'chapter' },
      ];

      vi.mocked(apiClient.get).mockResolvedValue({ data: mockRangePacks });

      const result = await rangePackService.getRangePacks(1, 7);

      expect(apiClient.get).toHaveBeenCalledWith('/range-packs', {
        params: { subject_id: 1, grade: 7 },
      });
      expect(result).toEqual(mockRangePacks);
    });
  });
});
