import { describe, it, expect, beforeEach, vi } from 'vitest';
import { analyticsService } from '../analytics';
import type { ExerciseTypeGroupsResponse } from '@/types/analytics';

// Create a proper mock for apiClient
const mockGet = vi.fn();

vi.mock('@/lib/api', () => ({
  apiClient: {
    get: (...args: unknown[]) => mockGet(...args),
  },
}));

describe('analyticsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGet.mockClear();
  });

  describe('getExerciseTypeGroups', () => {
    it('should fetch exercise type groups for a subject', async () => {
      const mockResponse: { data: ExerciseTypeGroupsResponse } = {
        data: {
          groups: [
            {
              id: 1,
              name: '基礎題型',
              display_order: 1,
              exercise_types: [
                {
                  id: 1,
                  name: '單字題',
                  level: 8,
                  max_level: 10,
                  recent_attempts: 10,
                  recent_correct_rate: 0.9,
                },
                {
                  id: 2,
                  name: '片語題',
                  level: 7,
                  max_level: 10,
                  recent_attempts: 8,
                  recent_correct_rate: 0.85,
                },
              ],
            },
          ],
        },
      };

      mockGet.mockResolvedValue(mockResponse);

      const result = await analyticsService.getExerciseTypeGroups(1);

      expect(mockGet).toHaveBeenCalledWith(
        '/analytics/exercise-type-groups?subject_id=1'
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle empty groups', async () => {
      const mockResponse: { data: ExerciseTypeGroupsResponse } = {
        data: {
          groups: [],
        },
      };

      mockGet.mockResolvedValue(mockResponse);

      const result = await analyticsService.getExerciseTypeGroups(1);

      expect(mockGet).toHaveBeenCalledWith(
        '/analytics/exercise-type-groups?subject_id=1'
      );
      expect(result).toEqual(mockResponse.data);
      expect(result.groups).toHaveLength(0);
    });

    it('should handle multiple groups', async () => {
      const mockResponse: { data: ExerciseTypeGroupsResponse } = {
        data: {
          groups: [
            {
              id: 1,
              name: '基礎題型',
              display_order: 1,
              exercise_types: [
                {
                  id: 1,
                  name: '單字題',
                  level: 8,
                  max_level: 10,
                  recent_attempts: 10,
                  recent_correct_rate: 0.9,
                },
              ],
            },
            {
              id: 2,
              name: '敘事題型',
              display_order: 2,
              exercise_types: [
                {
                  id: 5,
                  name: '閱讀',
                  level: 6,
                  max_level: 8,
                  recent_attempts: 5,
                  recent_correct_rate: 0.8,
                },
              ],
            },
            {
              id: 3,
              name: '資訊題型',
              display_order: 3,
              exercise_types: [
                {
                  id: 9,
                  name: '菜單',
                  level: 7,
                  max_level: 10,
                  recent_attempts: 7,
                  recent_correct_rate: 0.857,
                },
              ],
            },
          ],
        },
      };

      mockGet.mockResolvedValue(mockResponse);

      const result = await analyticsService.getExerciseTypeGroups(1);

      expect(result.groups).toHaveLength(3);
      expect(result.groups[0].name).toBe('基礎題型');
      expect(result.groups[1].name).toBe('敘事題型');
      expect(result.groups[2].name).toBe('資訊題型');
    });

    it('should handle different subject IDs', async () => {
      const mockResponse: { data: ExerciseTypeGroupsResponse } = {
        data: {
          groups: [],
        },
      };

      mockGet.mockResolvedValue(mockResponse);

      await analyticsService.getExerciseTypeGroups(2);
      expect(mockGet).toHaveBeenCalledWith(
        '/analytics/exercise-type-groups?subject_id=2'
      );

      await analyticsService.getExerciseTypeGroups(999);
      expect(mockGet).toHaveBeenCalledWith(
        '/analytics/exercise-type-groups?subject_id=999'
      );
    });

    it('should handle API errors', async () => {
      const mockError = new Error('Network error');
      mockGet.mockRejectedValue(mockError);

      await expect(analyticsService.getExerciseTypeGroups(1)).rejects.toThrow(
        'Network error'
      );
    });

    it('should handle unauthorized errors', async () => {
      const mockError = {
        response: {
          status: 401,
          data: { detail: 'Unauthorized' },
        },
      };
      mockGet.mockRejectedValue(mockError);

      await expect(
        analyticsService.getExerciseTypeGroups(1)
      ).rejects.toMatchObject(mockError);
    });

    it('should handle zero level exercise types', async () => {
      const mockResponse: { data: ExerciseTypeGroupsResponse } = {
        data: {
          groups: [
            {
              id: 1,
              name: '新手題型',
              display_order: 1,
              exercise_types: [
                {
                  id: 1,
                  name: '單字題',
                  level: 0,
                  max_level: 5,
                  recent_attempts: 0,
                  recent_correct_rate: 0.0,
                },
              ],
            },
          ],
        },
      };

      mockGet.mockResolvedValue(mockResponse);

      const result = await analyticsService.getExerciseTypeGroups(1);

      expect(result.groups[0].exercise_types[0].level).toBe(0);
      expect(result.groups[0].exercise_types[0].recent_attempts).toBe(0);
      expect(result.groups[0].exercise_types[0].recent_correct_rate).toBe(0.0);
    });

    it('should handle max level exercise types', async () => {
      const mockResponse: { data: ExerciseTypeGroupsResponse } = {
        data: {
          groups: [
            {
              id: 1,
              name: '精通題型',
              display_order: 1,
              exercise_types: [
                {
                  id: 1,
                  name: '單字題',
                  level: 10,
                  max_level: 10,
                  recent_attempts: 10,
                  recent_correct_rate: 1.0,
                },
              ],
            },
          ],
        },
      };

      mockGet.mockResolvedValue(mockResponse);

      const result = await analyticsService.getExerciseTypeGroups(1);

      expect(result.groups[0].exercise_types[0].level).toBe(10);
      expect(result.groups[0].exercise_types[0].recent_correct_rate).toBe(1.0);
    });

    it('should handle decimal correct rates', async () => {
      const mockResponse: { data: ExerciseTypeGroupsResponse } = {
        data: {
          groups: [
            {
              id: 1,
              name: '基礎題型',
              display_order: 1,
              exercise_types: [
                {
                  id: 1,
                  name: '單字題',
                  level: 5,
                  max_level: 10,
                  recent_attempts: 3,
                  recent_correct_rate: 0.667, // 2/3
                },
                {
                  id: 2,
                  name: '片語題',
                  level: 6,
                  max_level: 10,
                  recent_attempts: 9,
                  recent_correct_rate: 0.778, // 7/9
                },
              ],
            },
          ],
        },
      };

      mockGet.mockResolvedValue(mockResponse);

      const result = await analyticsService.getExerciseTypeGroups(1);

      expect(result.groups[0].exercise_types[0].recent_correct_rate).toBe(
        0.667
      );
      expect(result.groups[0].exercise_types[1].recent_correct_rate).toBe(
        0.778
      );
    });
  });
});
