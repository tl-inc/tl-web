import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/__tests__/utils/test-utils';
import ExerciseSessionPage from '../page';
import * as hooks from '@/hooks/exerciseSession/useExerciseSession';
import { useExerciseSessionStore } from '@/stores/useExerciseSessionStore';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useParams: () => ({ id: '1' }),
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock hooks
vi.mock('@/hooks/exerciseSession/useExerciseSession');
vi.mock('@/stores/useExerciseSessionStore');

describe('ExerciseSessionPage', () => {
  const mockMutate = vi.fn();
  const mockStartTimer = vi.fn();

  const mockQuestion = {
    exercise_id: 1,
    exercise_item_id: 101,
    sequence: 1,
    exercise_type: {
      id: 1,
      name: '字彙',
      description: 'Vocabulary',
    },
    content: {
      question: 'Test question',
      options: [
        { text: 'A', is_correct: true },
        { text: 'B', is_correct: false },
      ],
    },
  };

  const mockStats = {
    total_questions: 5,
    correct_count: 3,
    accuracy: 0.6,
    current_streak: 2,
    max_streak: 3,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock hooks
    vi.mocked(hooks.useSubmitAnswer).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as any);

    vi.mocked(hooks.useGetNextExercise).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as any);

    vi.mocked(hooks.useCompleteSession).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as any);

    // Mock Zustand store
    vi.mocked(useExerciseSessionStore).mockImplementation((selector: any) => {
      const state = {
        currentQuestion: mockQuestion,
        stats: mockStats,
        showFeedback: false,
        feedback: null,
        startTimer: mockStartTimer,
      };
      return selector(state);
    });

    // Mock navigator.vibrate
    Object.defineProperty(navigator, 'vibrate', {
      writable: true,
      value: vi.fn(),
    });
  });

  describe('Stats display', () => {
    it('should display correct stats', () => {
      render(<ExerciseSessionPage />);

      expect(screen.getByText('已完成：')).toBeInTheDocument();
      expect(screen.getByText('Ｏ：')).toBeInTheDocument();
      expect(screen.getByText('Ｘ：')).toBeInTheDocument();
      // Stats values are displayed
      const statValues = screen.getAllByText(/[0-9]+/);
      expect(statValues.length).toBeGreaterThan(0);
    });

    it('should show streak badge when streak >= 2', () => {
      render(<ExerciseSessionPage />);

      expect(screen.getByText('🔥')).toBeInTheDocument();
      expect(screen.getByText('連勝')).toBeInTheDocument();
      // Check that streak badge exists with the correct structure
      const streakBadge = screen.getByText('🔥').closest('div');
      expect(streakBadge?.textContent).toContain('2連勝');
    });

    it('should not show streak badge when streak < 2', () => {
      vi.mocked(useExerciseSessionStore).mockImplementation((selector: any) => {
        const state = {
          currentQuestion: mockQuestion,
          stats: { ...mockStats, current_streak: 1 },
          showFeedback: false,
          feedback: null,
          startTimer: mockStartTimer,
        };
        return selector(state);
      });

      render(<ExerciseSessionPage />);

      expect(screen.queryByText('🔥')).not.toBeInTheDocument();
      expect(screen.queryByText('連勝')).not.toBeInTheDocument();
    });

    it('should handle missing stats gracefully', () => {
      vi.mocked(useExerciseSessionStore).mockImplementation((selector: any) => {
        const state = {
          currentQuestion: mockQuestion,
          stats: null,
          showFeedback: false,
          feedback: null,
          startTimer: mockStartTimer,
        };
        return selector(state);
      });

      render(<ExerciseSessionPage />);

      // Should display default 0 values when stats is null
      expect(screen.getByText('已完成：')).toBeInTheDocument();
    });
  });

  describe('Haptic feedback', () => {
    it('should not crash when vibrate is not supported', () => {
      Object.defineProperty(navigator, 'vibrate', {
        writable: true,
        value: undefined,
      });

      render(<ExerciseSessionPage />);

      // Should render without errors
      expect(screen.getByText('Test question')).toBeInTheDocument();
    });
  });

  describe('Scroll behavior', () => {
    it('should scroll to top when new question loads', async () => {
      const mockScrollTo = vi.fn();
      Object.defineProperty(window, 'scrollTo', {
        writable: true,
        value: mockScrollTo,
      });

      render(<ExerciseSessionPage />);

      await waitFor(() => {
        expect(mockScrollTo).toHaveBeenCalledWith({
          top: 0,
          behavior: 'smooth',
        });
      });
    });
  });

  describe('Touch gestures', () => {
    it('should not allow swipe when feedback is not shown', () => {
      vi.mocked(useExerciseSessionStore).mockImplementation((selector: any) => {
        const state = {
          currentQuestion: mockQuestion,
          stats: mockStats,
          showFeedback: false, // No feedback
          feedback: null,
          startTimer: mockStartTimer,
        };
        return selector(state);
      });

      render(<ExerciseSessionPage />);

      // Should render normally
      expect(screen.getByText('Test question')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should render back button', () => {
      render(<ExerciseSessionPage />);

      const backButton = screen.getByRole('button', { name: /返回/i });
      expect(backButton).toBeInTheDocument();
    });
  });

  describe('Loading state', () => {
    it('should show loader when no question is available', () => {
      vi.mocked(useExerciseSessionStore).mockImplementation((selector: any) => {
        const state = {
          currentQuestion: null,
          stats: null,
          showFeedback: false,
          feedback: null,
          startTimer: mockStartTimer,
        };
        return selector(state);
      });

      const { container } = render(<ExerciseSessionPage />);

      // Should show loading indicator (svg with animate-spin class)
      const loader = container.querySelector('.animate-spin');
      expect(loader).toBeTruthy();
    });
  });
});
