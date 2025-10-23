/**
 * Paper Card View Store - Zustand
 * 管理試卷卡片檢視模式的狀態
 */
import { create } from 'zustand';

export type ViewMode = 'scroll' | 'card';

interface PaperCardViewState {
  // Card view states
  viewMode: ViewMode;
  currentExerciseIndex: number;
  markedExercises: Set<number>;
  isNavigationPanelOpen: boolean;
  navigationDirection: 'left' | 'right';

  // Setters
  setViewMode: (mode: ViewMode) => void;
  setCurrentExerciseIndex: (index: number) => void;

  // Navigation actions
  nextExercise: (maxIndex: number) => void;
  previousExercise: () => void;
  jumpToExercise: (index: number, maxIndex: number) => void;

  // Mark actions
  toggleMarkExercise: (exerciseId: number) => void;
  toggleNavigationPanel: () => void;

  // Utils
  reset: () => void;
}

export const usePaperCardViewStore = create<PaperCardViewState>((set, get) => ({
  // Initial state
  viewMode: 'scroll',
  currentExerciseIndex: 0,
  markedExercises: new Set(),
  isNavigationPanelOpen: false,
  navigationDirection: 'right',

  // Setters
  setViewMode: (viewMode) => set({ viewMode }),
  setCurrentExerciseIndex: (currentExerciseIndex) => set({ currentExerciseIndex }),

  // Next exercise
  nextExercise: (maxIndex) => {
    const { currentExerciseIndex } = get();
    if (currentExerciseIndex < maxIndex) {
      set({
        currentExerciseIndex: currentExerciseIndex + 1,
        navigationDirection: 'right',
      });
    }
  },

  // Previous exercise
  previousExercise: () => {
    const { currentExerciseIndex } = get();
    if (currentExerciseIndex > 0) {
      set({
        currentExerciseIndex: currentExerciseIndex - 1,
        navigationDirection: 'left',
      });
    }
  },

  // Jump to exercise
  jumpToExercise: (index, maxIndex) => {
    const { currentExerciseIndex, navigationDirection } = get();
    if (index >= 0 && index <= maxIndex) {
      // Only update direction if jumping to a different exercise
      const newDirection =
        index === currentExerciseIndex
          ? navigationDirection
          : index > currentExerciseIndex
          ? 'right'
          : 'left';

      set({
        currentExerciseIndex: index,
        navigationDirection: newDirection,
      });
    }
  },

  // Toggle mark
  toggleMarkExercise: (exerciseId) => {
    const { markedExercises } = get();
    const newMarked = new Set(markedExercises);
    if (newMarked.has(exerciseId)) {
      newMarked.delete(exerciseId);
    } else {
      newMarked.add(exerciseId);
    }
    set({ markedExercises: newMarked });
  },

  // Toggle navigation panel
  toggleNavigationPanel: () => {
    set({ isNavigationPanelOpen: !get().isNavigationPanelOpen });
  },

  // Reset
  reset: () =>
    set({
      viewMode: 'scroll',
      currentExerciseIndex: 0,
      markedExercises: new Set(),
      isNavigationPanelOpen: false,
      navigationDirection: 'right',
    }),
}));
