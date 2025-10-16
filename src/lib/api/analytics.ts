/**
 * Analytics API client
 */
import { apiClient } from '@/lib/api';
import type { ExerciseTypeGroupsResponse } from '@/types/analytics';

export const analyticsService = {
  /**
   * Get exercise type groups with user statistics
   *
   * @param subjectId - Subject ID to filter by
   * @returns Exercise type groups with user level and statistics
   */
  async getExerciseTypeGroups(
    subjectId: number
  ): Promise<ExerciseTypeGroupsResponse> {
    const response = await apiClient.get<ExerciseTypeGroupsResponse>(
      `/analytics/exercise-type-groups?subject_id=${subjectId}`
    );
    return response.data;
  },
};
