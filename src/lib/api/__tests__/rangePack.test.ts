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
    it('should fetch range packs by publisher edition, subject, grade and semester', async () => {
      const mockRangePacks = [
        { id: 1, name: 'Unit 1', range_type: 'unit' },
        { id: 2, name: 'Unit 2', range_type: 'unit' },
      ];

      vi.mocked(apiClient.get).mockResolvedValue({ data: mockRangePacks });

      const result = await rangePackService.getRangePacks(1, 1, 7, 1);

      expect(apiClient.get).toHaveBeenCalledWith('/range-packs', {
        params: {
          publisher_edition_id: 1,
          subject_id: 1,
          grade: 7,
          semester: 1
        },
      });
      expect(result).toEqual(mockRangePacks);
    });
  });

  describe('getPublisherEditions', () => {
    it('should fetch publisher editions by subject', async () => {
      const mockEditions = [
        { id: 1, publisher_name: '翰林', version: 'B3' },
        { id: 2, publisher_name: '南一', version: 'A2' },
      ];

      vi.mocked(apiClient.get).mockResolvedValue({ data: mockEditions });

      const result = await rangePackService.getPublisherEditions(1);

      expect(apiClient.get).toHaveBeenCalledWith('/publisher-editions', {
        params: { subject_id: 1 },
      });
      expect(result).toEqual(mockEditions);
    });
  });
});
