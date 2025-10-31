/**
 * Skill API client
 *
 * Public API (no authentication required) for SEO purposes.
 */
import { apiClient } from '@/lib/api';
import type { Skill, SkillListResponse, SkillType } from '@/types/skill';

export const skillService = {
  /**
   * Get a single skill by slug
   *
   * Public endpoint for SEO-friendly URLs
   *
   * @param slug - URL-friendly slug (e.g., 'present-continuous')
   * @returns Skill details with metadata
   */
  async getSkillBySlug(slug: string): Promise<Skill> {
    const response = await apiClient.get<Skill>(`/skills/by-slug/${slug}`);
    return response.data;
  },

  /**
   * Get a single skill by ID
   *
   * @param id - Skill ID
   * @returns Skill details with metadata
   */
  async getSkillById(id: number): Promise<Skill> {
    const response = await apiClient.get<Skill>(`/skills/${id}`);
    return response.data;
  },

  /**
   * List skills with optional filters
   *
   * @param options - Filter and pagination options
   * @returns List of skills with total count
   */
  async listSkills(options?: {
    subject_id?: number;
    type?: SkillType;
    limit?: number;
    offset?: number;
  }): Promise<SkillListResponse> {
    const response = await apiClient.get<SkillListResponse>('/skills', {
      params: options,
    });
    return response.data;
  },
};
