/**
 * Paper Stores - Unified Export
 * 提供統一的匯出點，方便元件使用
 */
import { usePaperDataStore } from './usePaperDataStore';
import { usePaperUIStore } from './usePaperUIStore';
import { usePaperCardViewStore } from './usePaperCardViewStore';
import { usePaperActions } from './usePaperActions';

export { usePaperDataStore } from './usePaperDataStore';
export { usePaperUIStore } from './usePaperUIStore';
export { usePaperCardViewStore } from './usePaperCardViewStore';
export { usePaperActions } from './usePaperActions';

export type { PageMode } from './usePaperDataStore';
export type { ViewMode } from './usePaperCardViewStore';

// Unified hook that combines all paper-related stores
export const usePaper = () => {
  const data = usePaperDataStore();
  const ui = usePaperUIStore();
  const cardView = usePaperCardViewStore();
  const actions = usePaperActions();

  // Wrap navigation methods to auto-provide maxIndex
  // Read paper dynamically from store each time
  const nextExercise = () => {
    const paper = usePaperDataStore.getState().paper;
    const maxIndex = paper ? paper.exercises.length - 1 : 999;
    cardView.nextExercise(maxIndex);
  };

  const previousExercise = () => {
    cardView.previousExercise();
  };

  const jumpToExercise = (index: number) => {
    const paper = usePaperDataStore.getState().paper;
    const maxIndex = paper ? paper.exercises.length - 1 : 999;
    cardView.jumpToExercise(index, maxIndex);
  };

  return {
    // Data
    ...data,
    // UI
    ...ui,
    // Card View (override navigation methods)
    ...cardView,
    nextExercise,
    previousExercise,
    jumpToExercise,
    // Actions
    ...actions,
  };
};
