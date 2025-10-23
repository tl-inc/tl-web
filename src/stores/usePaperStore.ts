/**
 * Papers Store - Zustand (Backward Compatibility Layer)
 *
 * ⚠️ DEPRECATED: This file is kept for backward compatibility only.
 * Please use the new modular stores from '@/stores/paper' instead:
 *
 * - usePaperDataStore: Data state (paper, answers, mode)
 * - usePaperUIStore: UI state (loading, error)
 * - usePaperCardViewStore: Card view state
 * - usePaperActions: Business logic (loadPaper, submitAnswer, etc.)
 * - usePaper: Unified hook combining all stores
 *
 * This layer will be removed in a future version.
 */

import type { usePaper } from './paper';
import { usePaperDataStore } from './paper/usePaperDataStore';
import { usePaperUIStore } from './paper/usePaperUIStore';
import { usePaperCardViewStore } from './paper/usePaperCardViewStore';
import { usePaperActions } from './paper/usePaperActions';

// Selector type for backward compatibility
type Selector<T> = (state: ReturnType<typeof usePaper>) => T;

// Create a wrapper function that supports both hook mode and selector mode
function usePaperStoreCompat(): ReturnType<typeof usePaper>;
function usePaperStoreCompat<T>(selector: Selector<T>): T;
function usePaperStoreCompat<T>(selector?: Selector<T>) {
  // Get state from all four stores
  const dataState = usePaperDataStore();
  const uiState = usePaperUIStore();
  const cardViewState = usePaperCardViewStore();
  const actions = usePaperActions();

  // Wrap navigation methods to auto-provide maxIndex (matching usePaper implementation)
  const nextExercise = () => {
    const paper = usePaperDataStore.getState().paper;
    const maxIndex = paper ? paper.exercises.length - 1 : 999;
    cardViewState.nextExercise(maxIndex);
  };

  const previousExercise = () => {
    cardViewState.previousExercise();
  };

  const jumpToExercise = (index: number) => {
    const paper = usePaperDataStore.getState().paper;
    const maxIndex = paper ? paper.exercises.length - 1 : 999;
    cardViewState.jumpToExercise(index, maxIndex);
  };

  // Combine into a single state object, with mock functions taking precedence
  const combinedState = {
    ...dataState,
    ...uiState,
    ...cardViewState,
    ...actions,
    // Override with wrapped navigation functions
    nextExercise,
    previousExercise,
    jumpToExercise,
    ...mockFunctions, // Mock functions override real ones for testing
  } as ReturnType<typeof usePaper>;

  // If selector provided, apply it; otherwise return full state
  if (selector) {
    return selector(combinedState);
  }

  return combinedState;
}

// Store for mocked functions (for testing)
const mockFunctions: Record<string, unknown> = {};

// Add setState and getState static methods
usePaperStoreCompat.setState = (partialState: Partial<ReturnType<typeof usePaper>>) => {
  const dataState = usePaperDataStore.getState();
  const uiState = usePaperUIStore.getState();
  const cardViewState = usePaperCardViewStore.getState();

  // Update each store independently
  if ('paper' in partialState) {
    if (partialState.paper) {
      dataState.setPaper(partialState.paper);
    } else {
      // Clear mock functions when resetting state
      Object.keys(mockFunctions).forEach((key) => delete mockFunctions[key]);
    }
  }
  if ('userPapers' in partialState) dataState.setUserPapers(partialState.userPapers || []);
  if ('activeUserPaper' in partialState)
    dataState.setActiveUserPaper(partialState.activeUserPaper || null);
  if ('mode' in partialState) dataState.setMode(partialState.mode!);
  if ('answers' in partialState) dataState.setAnswers(partialState.answers || new Map());

  if ('isLoading' in partialState) uiState.setIsLoading(partialState.isLoading!);
  if ('error' in partialState) uiState.setError(partialState.error || null);
  if ('isSubmitting' in partialState) uiState.setIsSubmitting(partialState.isSubmitting!);

  if ('viewMode' in partialState) cardViewState.setViewMode(partialState.viewMode!);
  if ('currentExerciseIndex' in partialState)
    cardViewState.setCurrentExerciseIndex(partialState.currentExerciseIndex!);
  if ('markedExercises' in partialState)
    cardViewState.markedExercises = partialState.markedExercises || new Set();
  if ('isNavigationPanelOpen' in partialState)
    cardViewState.isNavigationPanelOpen = partialState.isNavigationPanelOpen!;
  if ('navigationDirection' in partialState)
    cardViewState.navigationDirection = partialState.navigationDirection!;

  // Store mock functions for testing
  if ('jumpToExercise' in partialState && typeof partialState.jumpToExercise === 'function') {
    mockFunctions.jumpToExercise = partialState.jumpToExercise;
  }
  if (
    'toggleNavigationPanel' in partialState &&
    typeof partialState.toggleNavigationPanel === 'function'
  ) {
    mockFunctions.toggleNavigationPanel = partialState.toggleNavigationPanel;
  }
  if ('toggleMarkExercise' in partialState && typeof partialState.toggleMarkExercise === 'function') {
    mockFunctions.toggleMarkExercise = partialState.toggleMarkExercise;
  }
};

usePaperStoreCompat.getState = (): ReturnType<typeof usePaper> => {
  return {
    ...usePaperDataStore.getState(),
    ...usePaperUIStore.getState(),
    ...usePaperCardViewStore.getState(),
  } as ReturnType<typeof usePaper>;
};

// Re-export everything for backward compatibility
export { usePaperStoreCompat as usePaperStore };
export type { PageMode, ViewMode } from './paper';
