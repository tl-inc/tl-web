/**
 * Range Pack API client
 */
import { apiClient } from '@/lib/api';

export const rangePackService = {
  /**
   * Get available subjects by grade
   */
  async getAvailableSubjects(grade: number): Promise<any[]> {
    const response = await apiClient.get('/range-packs/available_subjects', {
      params: { grade },
    });
    return response.data;
  },

  /**
   * Get range packs by subject and grade
   */
  async getRangePacks(subjectId: number, grade: number): Promise<any[]> {
    const response = await apiClient.get('/range-packs', {
      params: { subject_id: subjectId, grade },
    });
    return response.data;
  },
};
