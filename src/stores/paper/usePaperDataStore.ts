/**
 * Paper Data Store - Zustand
 * 管理試卷資料狀態（純資料，不含 UI 狀態）
 */
import { create } from 'zustand';
import type { PaperData, UserPaperWithAnswersResponse } from '@/types/paper';

export type PageMode = 'pending' | 'in_progress' | 'completed' | 'abandoned';

interface PaperDataState {
  // Data
  paper: PaperData | null;
  userPapers: UserPaperWithAnswersResponse[];
  activeUserPaper: UserPaperWithAnswersResponse | null;
  mode: PageMode;
  answers: Map<number, number>; // exercise_item_id -> answer_index

  // Setters
  setPaper: (paper: PaperData) => void;
  setUserPapers: (userPapers: UserPaperWithAnswersResponse[]) => void;
  setActiveUserPaper: (userPaper: UserPaperWithAnswersResponse | null) => void;
  setMode: (mode: PageMode) => void;
  setAnswers: (answers: Map<number, number>) => void;
  setAnswer: (itemId: number, answerIndex: number) => void;

  // Utils
  calculateStats: () => { correctCount: number; totalCount: number; score: number };
  reset: () => void;
}

export const usePaperDataStore = create<PaperDataState>((set, get) => ({
  // Initial state
  paper: null,
  userPapers: [],
  activeUserPaper: null,
  mode: 'pending',
  answers: new Map(),

  // Setters
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

  // Calculate stats
  calculateStats: () => {
    const { paper, answers } = get();
    if (!paper) return { correctCount: 0, totalCount: 0, score: 0 };

    let correctCount = 0;
    let totalCount = 0;

    paper.exercises.forEach((exercise) => {
      exercise.exercise_items.forEach((item) => {
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

  // Reset
  reset: () =>
    set({
      paper: null,
      userPapers: [],
      activeUserPaper: null,
      mode: 'pending',
      answers: new Map(),
    }),
}));
