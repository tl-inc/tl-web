/**
 * Exercise Session API Service
 *
 * 對應後端 API endpoints (tl-public-api/app/api/v1/endpoints/exercise_sessions.py)
 */
import type {
  CompleteSessionResponse,
  CreateSessionRequest,
  CreateSessionResponse,
  ExerciseContent,
  ExerciseSessionDetail,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
} from '@/types/exerciseSession';
import { apiClient } from '../api';

export const exerciseSessionService = {
  /**
   * 建立新的刷題 Session
   *
   * POST /api/v1/exercise-sessions
   */
  createSession: async (
    data: CreateSessionRequest
  ): Promise<CreateSessionResponse> => {
    const response = await apiClient.post<CreateSessionResponse>(
      '/exercise-sessions',
      data
    );
    return response.data;
  },

  /**
   * 提交答案
   *
   * POST /api/v1/exercise-sessions/:id/submit-answer
   */
  submitAnswer: async (
    sessionId: number,
    data: SubmitAnswerRequest
  ): Promise<SubmitAnswerResponse> => {
    const response = await apiClient.post<SubmitAnswerResponse>(
      `/exercise-sessions/${sessionId}/submit-answer`,
      data
    );
    return response.data;
  },

  /**
   * 取得下一題
   *
   * GET /api/v1/exercise-sessions/:id/next-exercise
   */
  getNextExercise: async (sessionId: number): Promise<ExerciseContent> => {
    const response = await apiClient.get<ExerciseContent>(
      `/exercise-sessions/${sessionId}/next-exercise`
    );
    return response.data;
  },

  /**
   * 結束 Session
   *
   * POST /api/v1/exercise-sessions/:id/complete
   */
  completeSession: async (
    sessionId: number
  ): Promise<CompleteSessionResponse> => {
    const response = await apiClient.post<CompleteSessionResponse>(
      `/exercise-sessions/${sessionId}/complete`
    );
    return response.data;
  },

  /**
   * 取得 Session 詳情
   *
   * GET /api/v1/exercise-sessions/:id
   */
  getSession: async (sessionId: number): Promise<ExerciseSessionDetail> => {
    const response = await apiClient.get<ExerciseSessionDetail>(
      `/exercise-sessions/${sessionId}`
    );
    return response.data;
  },
};
