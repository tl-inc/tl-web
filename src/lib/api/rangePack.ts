/**
 * Range Pack API client
 */
import { apiClient } from '@/lib/api';

export interface Subject {
  id: number;
  name: string;
  [key: string]: unknown;
}

export interface AvailableSubjectsResponse {
  subjects: Subject[];
}

export interface RangePack {
  id: number;
  name: string;
  subject_id: number;
  grade: number;
  [key: string]: unknown;
}

export interface RangePacksResponse {
  data: RangePack[];
}

export const rangePackService = {
  /**
   * Get available subjects by grade
   */
  async getAvailableSubjects(grade: number): Promise<AvailableSubjectsResponse> {
    const response = await apiClient.get<AvailableSubjectsResponse>('/range-packs/available_subjects', {
      params: { grade },
    });
    return response.data;
  },

  /**
   * Get range packs by subject and grade
   */
  async getRangePacks(subjectId: number, grade: number): Promise<RangePacksResponse> {
    const response = await apiClient.get<RangePacksResponse>('/range-packs', {
      params: { subject_id: subjectId, grade },
    });
    return response.data;
  },
};
