/**
 * Exercise Session Zustand Store
 *
 * 管理刷題模式的狀態
 */
import { create } from 'zustand';
import type {
  ExerciseContent,
  SessionStats,
  SessionStatus,
  SkillInfo,
} from '@/types/exerciseSession';

interface Feedback {
  isCorrect: boolean;
  yourAnswer: Record<string, unknown>;
  correctAnswer: Record<string, unknown>;
  explanation?: string;
  skills: SkillInfo[];
}

interface ExerciseSessionState {
  // Session 基本資訊
  sessionId: number | null;
  status: SessionStatus | null;

  // 當前題目
  currentQuestion: ExerciseContent | null;

  // Session 統計
  stats: SessionStats;

  // 即時反饋狀態
  showFeedback: boolean;
  feedback: Feedback | null;

  // 計時器
  startTime: number | null; // timestamp (ms)

  // Actions
  setSession: (sessionId: number, status: SessionStatus) => void;
  setCurrentQuestion: (question: ExerciseContent) => void;
  setFeedback: (feedback: Feedback, stats: SessionStats) => void;
  clearFeedback: () => void;
  updateStats: (stats: SessionStats) => void;
  startTimer: () => void;
  stopTimer: () => number; // 返回花費時間（秒）
  reset: () => void;
}

const initialStats: SessionStats = {
  total_questions: 0,
  correct_count: 0,
  accuracy: 0,
  current_streak: 0,
  max_streak: 0,
};

export const useExerciseSessionStore = create<ExerciseSessionState>(
  (set, get) => ({
    // Initial state
    sessionId: null,
    status: null,
    currentQuestion: null,
    stats: initialStats,
    showFeedback: false,
    feedback: null,
    startTime: null,

    // Actions
    setSession: (sessionId, status) =>
      set({
        sessionId,
        status,
        stats: initialStats,
        showFeedback: false,
        feedback: null,
      }),

    setCurrentQuestion: (question) =>
      set({
        currentQuestion: question,
        showFeedback: false,
        feedback: null,
      }),

    setFeedback: (feedback, stats) =>
      set({
        showFeedback: true,
        feedback,
        stats,
      }),

    clearFeedback: () =>
      set({
        showFeedback: false,
        feedback: null,
      }),

    updateStats: (stats) => set({ stats }),

    startTimer: () => set({ startTime: Date.now() }),

    stopTimer: () => {
      const { startTime } = get();
      if (!startTime) return 0;

      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      set({ startTime: null });
      return timeSpent;
    },

    reset: () =>
      set({
        sessionId: null,
        status: null,
        currentQuestion: null,
        stats: initialStats,
        showFeedback: false,
        feedback: null,
        startTime: null,
      }),
  })
);
