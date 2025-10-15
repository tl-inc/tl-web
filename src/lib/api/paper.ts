/**
 * Paper API client
 */
import { apiClient } from '@/lib/api';
import type { StartPaperRequest, StartPaperResponse } from '@/types/paper';

export const paperService = {
  /**
   * Create a new paper
   */
  async startPaper(data: StartPaperRequest): Promise<StartPaperResponse> {
    const response = await apiClient.post<StartPaperResponse>('/user-papers/new', data);
    return response.data;
  },
};
