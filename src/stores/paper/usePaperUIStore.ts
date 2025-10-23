/**
 * Paper UI Store - Zustand
 * 管理試卷 UI 狀態（載入、錯誤、提交中）
 */
import { create } from 'zustand';

interface PaperUIState {
  // UI states
  isLoading: boolean;
  error: string | null;
  isSubmitting: boolean;

  // Setters
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setIsSubmitting: (submitting: boolean) => void;

  // Utils
  reset: () => void;
}

export const usePaperUIStore = create<PaperUIState>((set) => ({
  // Initial state
  isLoading: true,
  error: null,
  isSubmitting: false,

  // Setters
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),

  // Reset
  reset: () =>
    set({
      isLoading: true,
      error: null,
      isSubmitting: false,
    }),
}));
