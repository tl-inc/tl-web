/**
 * Paper API client
 */
import { apiClient } from '@/lib/api';
import type {
  StartPaperRequest,
  StartPaperResponse,
  PaperData,
  UserPaperResponse,
  UserPaperWithAnswersResponse,
} from '@/types/paper';

export interface UserPaperAnswer {
  id: number;
  user_paper_id: number;
  exercise_id: number;
  exercise_item_id: number;
  answer_content: Record<string, unknown>;
  is_correct: boolean;
  time_spent: number;
  created_at: string;
}

export const paperService = {
  /**
   * Create a new paper
   */
  async startPaper(data: StartPaperRequest): Promise<StartPaperResponse> {
    const response = await apiClient.post<StartPaperResponse>('/user-papers/new', data);
    return response.data;
  },

  /**
   * Get paper detail
   */
  async getPaperDetail(paperId: number): Promise<PaperData> {
    const response = await apiClient.get<PaperData>(`/papers/${paperId}/detail`);
    return response.data;
  },

  /**
   * Get all user papers for a specific paper (with answers for in_progress/completed)
   */
  async getUserPapersByPaper(paperId: number): Promise<UserPaperWithAnswersResponse[]> {
    const response = await apiClient.get<UserPaperWithAnswersResponse[]>(`/user-papers/by-paper/${paperId}`);
    return response.data;
  },

  /**
   * Get answers for a user paper
   */
  async getUserPaperAnswers(userPaperId: number): Promise<UserPaperAnswer[]> {
    const response = await apiClient.get<UserPaperAnswer[]>(`/user-papers/${userPaperId}/answers`);
    return response.data;
  },

  /**
   * Start a user paper (change status from pending to in_progress)
   */
  async startUserPaper(userPaperId: number): Promise<UserPaperResponse> {
    const response = await apiClient.post<UserPaperResponse>(`/user-papers/${userPaperId}/start`);
    return response.data;
  },

  /**
   * Submit an answer for an exercise item
   */
  async submitAnswer(
    userPaperId: number,
    data: {
      exercise_id: number;
      exercise_item_id: number;
      answer_content: Record<string, unknown>;
      time_spent: number;
    }
  ): Promise<{ is_correct: boolean }> {
    const response = await apiClient.post(`/user-papers/${userPaperId}/answer`, data);
    return response.data;
  },

  /**
   * Complete a paper
   */
  async completePaper(userPaperId: number): Promise<UserPaperResponse> {
    const response = await apiClient.post<UserPaperResponse>(`/user-papers/${userPaperId}/complete`);
    return response.data;
  },

  /**
   * Abandon a paper
   */
  async abandonPaper(userPaperId: number): Promise<UserPaperResponse> {
    const response = await apiClient.post<UserPaperResponse>(`/user-papers/${userPaperId}/abandon`);
    return response.data;
  },

  /**
   * Renew a paper (create a new attempt)
   */
  async renewPaper(userPaperId: number): Promise<UserPaperResponse> {
    const response = await apiClient.post<UserPaperResponse>(`/user-papers/${userPaperId}/renew`);
    return response.data;
  },
};
