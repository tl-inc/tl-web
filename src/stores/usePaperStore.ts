/**
 * Papers Store - Zustand
 * 管理試卷相關的狀態
 */
import { create } from 'zustand';
import type { PaperData, UserPaperResponse } from '@/types/paper';
import { paperService } from '@/lib/api/paper';

export type PageMode = 'pending' | 'in_progress' | 'completed' | 'abandoned';

interface PaperState {
  // Data
  paper: PaperData | null;
  userPapers: UserPaperResponse[];
  activeUserPaper: UserPaperResponse | null;
  mode: PageMode;
  answers: Map<number, number>;  // exercise_item_id -> answer_index

  // UI states
  isLoading: boolean;
  error: string | null;
  isSubmitting: boolean;

  // Actions
  setPaper: (paper: PaperData) => void;
  setUserPapers: (userPapers: UserPaperResponse[]) => void;
  setActiveUserPaper: (userPaper: UserPaperResponse | null) => void;
  setMode: (mode: PageMode) => void;
  setAnswers: (answers: Map<number, number>) => void;
  setAnswer: (itemId: number, answerIndex: number) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setIsSubmitting: (submitting: boolean) => void;

  // Complex actions
  loadPaper: (paperId: number) => Promise<void>;
  startPaper: () => Promise<void>;
  submitAnswer: (exerciseId: number, exerciseItemId: number, answerIndex: number) => Promise<void>;
  completePaper: () => Promise<void>;
  abandonPaper: () => Promise<void>;
  retryPaper: () => Promise<void>;

  // Utils
  calculateStats: () => { correctCount: number; totalCount: number; score: number };
  reset: () => void;
}

const selectActiveUserPaper = (userPapers: UserPaperResponse[]): UserPaperResponse | null => {
  if (userPapers.length === 0) return null;

  const inProgress = userPapers.find(up => up.status === 'in_progress');
  if (inProgress) return inProgress;

  const pending = userPapers.find(up => up.status === 'pending');
  if (pending) return pending;

  // 最新的 completed/abandoned
  const sorted = [...userPapers].sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  return sorted[0];
};

export const usePaperStore = create<PaperState>((set, get) => ({
  // Initial state
  paper: null,
  userPapers: [],
  activeUserPaper: null,
  mode: 'pending',
  answers: new Map(),
  isLoading: true,
  error: null,
  isSubmitting: false,

  // Simple setters
  setPaper: (paper) => set({ paper }),
  setUserPapers: (userPapers) => set({ userPapers }),
  setActiveUserPaper: (activeUserPaper) => set({ activeUserPaper }),
  setMode: (mode) => set({ mode }),
  setAnswers: (answers) => set({ answers }),
  setAnswer: (itemId, answerIndex) => {
    const currentAnswers = get().answers;
    const newAnswers = new Map(currentAnswers);
    newAnswers.set(itemId, answerIndex);
    set({ answers: newAnswers });
  },
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),

  // Load paper and user papers
  loadPaper: async (paperId: number) => {
    set({ isLoading: true, error: null });
    try {
      // 1. 載入試卷資料
      const paperData = await paperService.getPaperDetail(paperId);

      // Parse asset_json if it's a string
      if (paperData.exercises) {
        paperData.exercises.forEach((exercise) => {
          if (exercise.asset_json && typeof exercise.asset_json === 'string') {
            try {
              exercise.asset_json = JSON.parse(exercise.asset_json);
            } catch (e) {
              // Failed to parse asset_json, skip
            }
          }
        });
      }

      // 2. 載入該 paper 的所有 user_papers
      const userPapersData = await paperService.getUserPapersByPaper(paperId);

      // 3. 選擇要顯示的 user_paper
      const active = selectActiveUserPaper(userPapersData);

      // 4. 根據 status 決定模式
      let mode: PageMode = 'pending';
      let answers = new Map<number, number>();

      if (active) {
        mode = active.status as PageMode;

        // 5. 如果是 in_progress，載入已答題目
        if (active.status === 'in_progress') {
          const savedAnswers: Array<{ exercise_item_id: number; answer_index: number }> =
            await paperService.getUserPaperAnswers(active.id);
          answers = new Map(savedAnswers.map(a => [a.exercise_item_id, a.answer_index]));
        }
      }

      set({
        paper: paperData,
        userPapers: userPapersData,
        activeUserPaper: active,
        mode,
        answers,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : '未知錯誤',
        isLoading: false,
      });
    }
  },

  // Start paper
  startPaper: async () => {
    const { activeUserPaper } = get();
    if (!activeUserPaper) return;

    set({ isSubmitting: true });
    try {
      const data = await paperService.startUserPaper(activeUserPaper.id);
      set({
        activeUserPaper: { ...activeUserPaper, status: 'in_progress', started_at: data.started_at },
        mode: 'in_progress',
        isSubmitting: false,
      });
    } catch (err) {
      set({ isSubmitting: false });
      throw err;
    }
  },

  // Submit answer
  submitAnswer: async (exerciseId: number, exerciseItemId: number, answerIndex: number) => {
    const { activeUserPaper, mode } = get();
    if (!activeUserPaper) return;

    // 如果是 pending 狀態，自動開始考試
    if (mode === 'pending') {
      await get().startPaper();
    }

    // 只有 in_progress 才能答題
    if (get().mode !== 'in_progress') return;

    // 1. 更新 local state (立即反應)
    get().setAnswer(exerciseItemId, answerIndex);

    // 2. 立即送出到 backend (背景執行)
    try {
      await paperService.submitAnswer(activeUserPaper.id, {
        exercise_id: exerciseId,
        exercise_item_id: exerciseItemId,
        answer_content: { selected_option: answerIndex },
        time_spent: 0,
      });
    } catch (error) {
      // Submit failed, but don't block user interaction
    }
  },

  // Complete paper
  completePaper: async () => {
    const { activeUserPaper } = get();
    if (!activeUserPaper) return;

    set({ isSubmitting: true });
    try {
      const data = await paperService.completePaper(activeUserPaper.id);
      set({
        activeUserPaper: { ...activeUserPaper, status: 'completed', finished_at: data.finished_at },
        mode: 'completed',
        isSubmitting: false,
      });
    } catch (err) {
      set({ isSubmitting: false });
      throw err;
    }
  },

  // Abandon paper
  abandonPaper: async () => {
    const { activeUserPaper } = get();
    if (!activeUserPaper) return;

    set({ isSubmitting: true });
    try {
      await paperService.abandonPaper(activeUserPaper.id);
      const abandonedPaper = { ...activeUserPaper, status: 'abandoned' as const };
      set({
        activeUserPaper: abandonedPaper,
        mode: 'abandoned',
        isSubmitting: false,
      });
    } catch (err) {
      set({ isSubmitting: false });
      throw err;
    }
  },

  // Retry paper (create new user_paper)
  retryPaper: async () => {
    const { paper, activeUserPaper } = get();
    if (!paper || !activeUserPaper) return;

    set({ isSubmitting: true });
    try {
      await paperService.renewPaper(activeUserPaper.id);

      // Reload the page data
      await get().loadPaper(paper.id);

      set({ isSubmitting: false });
    } catch (err) {
      set({ isSubmitting: false });
      throw err;
    }
  },

  // Calculate stats
  calculateStats: () => {
    const { paper, answers } = get();
    if (!paper) return { correctCount: 0, totalCount: 0, score: 0 };

    let correctCount = 0;
    let totalCount = 0;

    paper.exercises.forEach(exercise => {
      exercise.exercise_items.forEach(item => {
        totalCount++;
        const userAnswer = answers.get(item.id);
        if (userAnswer !== undefined) {
          const selectedOption = item.options[userAnswer];
          if (selectedOption && selectedOption.is_correct) {
            correctCount++;
          }
        }
      });
    });

    const score = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
    return { correctCount, totalCount, score };
  },

  // Reset store
  reset: () => set({
    paper: null,
    userPapers: [],
    activeUserPaper: null,
    mode: 'pending',
    answers: new Map(),
    isLoading: true,
    error: null,
    isSubmitting: false,
  }),
}));
