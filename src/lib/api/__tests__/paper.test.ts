import { describe, it, expect, beforeEach, vi } from 'vitest';
import { paperService } from '../paper';
import { apiClient } from '@/lib/api';

// Mock apiClient
vi.mock('@/lib/api', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('paperService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('startPaper', () => {
    it('should create a new paper', async () => {
      const mockRequest = {
        range_pack_id: 1,
        subject_id: 1,
      };
      const mockResponse = {
        id: 123,
        status: 'pending',
      };

      vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse });

      const result = await paperService.startPaper(mockRequest);

      expect(apiClient.post).toHaveBeenCalledWith('/user-papers/new', mockRequest);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getPaperDetail', () => {
    it('should fetch paper detail', async () => {
      const mockPaper = {
        id: 1,
        title: 'Test Paper',
        exercises: [],
      };

      vi.mocked(apiClient.get).mockResolvedValue({ data: mockPaper });

      const result = await paperService.getPaperDetail(1);

      expect(apiClient.get).toHaveBeenCalledWith('/papers/1/detail');
      expect(result).toEqual(mockPaper);
    });
  });

  describe('getUserPapersByPaper', () => {
    it('should fetch user papers for a paper', async () => {
      const mockUserPapers = [
        { id: 1, status: 'in_progress' },
        { id: 2, status: 'completed' },
      ];

      vi.mocked(apiClient.get).mockResolvedValue({ data: mockUserPapers });

      const result = await paperService.getUserPapersByPaper(123);

      expect(apiClient.get).toHaveBeenCalledWith('/user-papers/by-paper/123');
      expect(result).toEqual(mockUserPapers);
    });
  });

  describe('getUserPaperAnswers', () => {
    it('should fetch answers for a user paper', async () => {
      const mockAnswers = [
        { exercise_item_id: 1, selected_option_index: 2 },
      ];

      vi.mocked(apiClient.get).mockResolvedValue({ data: mockAnswers });

      const result = await paperService.getUserPaperAnswers(456);

      expect(apiClient.get).toHaveBeenCalledWith('/user-papers/456/answers');
      expect(result).toEqual(mockAnswers);
    });
  });

  describe('startUserPaper', () => {
    it('should start a user paper', async () => {
      const mockResponse = {
        id: 789,
        status: 'in_progress',
        started_at: '2024-01-01T00:00:00Z',
      };

      vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse });

      const result = await paperService.startUserPaper(789);

      expect(apiClient.post).toHaveBeenCalledWith('/user-papers/789/start');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('submitAnswer', () => {
    it('should submit an answer', async () => {
      const answerData = {
        exercise_id: 1,
        exercise_item_id: 2,
        answer_content: { selected_index: 1 },
        time_spent: 30,
      };

      const mockResponse = { is_correct: true };

      vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse });

      const result = await paperService.submitAnswer(789, answerData);

      expect(apiClient.post).toHaveBeenCalledWith('/user-papers/789/answer', answerData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('completePaper', () => {
    it('should complete a paper', async () => {
      const mockResponse = {
        id: 789,
        status: 'completed',
        completed_at: '2024-01-01T01:00:00Z',
      };

      vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse });

      const result = await paperService.completePaper(789);

      expect(apiClient.post).toHaveBeenCalledWith('/user-papers/789/complete');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('abandonPaper', () => {
    it('should abandon a paper', async () => {
      const mockResponse = {
        id: 789,
        status: 'abandoned',
      };

      vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse });

      const result = await paperService.abandonPaper(789);

      expect(apiClient.post).toHaveBeenCalledWith('/user-papers/789/abandon');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('renewPaper', () => {
    it('should renew a paper', async () => {
      const mockResponse = {
        id: 999,
        status: 'pending',
      };

      vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse });

      const result = await paperService.renewPaper(789);

      expect(apiClient.post).toHaveBeenCalledWith('/user-papers/789/renew');
      expect(result).toEqual(mockResponse);
    });
  });
});
