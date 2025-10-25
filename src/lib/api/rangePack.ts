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

export interface PublisherEdition {
  id: number;
  publisher_id: number;
  publisher_name: string;
  version: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface PublisherEditionsResponse {
  data: PublisherEdition[];
  total: number;
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
   * Get publisher editions by subject
   */
  async getPublisherEditions(subjectId: number): Promise<PublisherEditionsResponse> {
    const response = await apiClient.get<PublisherEditionsResponse>('/publisher-editions', {
      params: { subject_id: subjectId },
    });
    return response.data;
  },

  /**
   * Get range packs by publisher edition, subject, grade and semester
   */
  async getRangePacks(
    publisherEditionId: number,
    subjectId: number,
    grade: number,
    semester: number
  ): Promise<RangePacksResponse> {
    const response = await apiClient.get<RangePacksResponse>('/range-packs', {
      params: {
        publisher_edition_id: publisherEditionId,
        subject_id: subjectId,
        grade,
        semester
      },
    });
    return response.data;
  },
};
