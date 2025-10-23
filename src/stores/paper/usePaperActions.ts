/**
 * Paper Actions - Custom Hook
 * 管理試卷的業務邏輯（使用其他 stores）
 */
import { usePaperDataStore } from './usePaperDataStore';
import { usePaperUIStore } from './usePaperUIStore';
import { usePaperCardViewStore } from './usePaperCardViewStore';
import { paperService } from '@/lib/api/paper';
import type { UserPaperWithAnswersResponse, PaperData } from '@/types/paper';
import type { ViewMode } from './usePaperCardViewStore';

// Helper function to select active user paper
const selectActiveUserPaper = (
  userPapers: UserPaperWithAnswersResponse[]
): UserPaperWithAnswersResponse | null => {
  if (userPapers.length === 0) return null;

  const inProgress = userPapers.find((up) => up.status === 'in_progress');
  if (inProgress) return inProgress;

  const pending = userPapers.find((up) => up.status === 'pending');
  if (pending) return pending;

  // 最新的 completed/abandoned
  const sorted = [...userPapers].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  return sorted[0];
};

export const usePaperActions = () => {
  // Data store
  const {
    setPaper,
    setUserPapers,
    setActiveUserPaper,
    setMode,
    setAnswers,
    setAnswer,
    paper,
    activeUserPaper,
    mode,
    answers,
  } = usePaperDataStore();

  // UI store
  const { setIsLoading, setError, setIsSubmitting } = usePaperUIStore();

  // Card view store
  const { viewMode, currentExerciseIndex, setViewMode, nextExercise: cardNextExercise } =
    usePaperCardViewStore();

  // Load paper
  const loadPaper = async (paperId: number) => {
    setIsLoading(true);
    setError(null);

    // Default viewMode based on screen size
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
    const savedViewMode: ViewMode = isMobile ? 'card' : 'scroll';

    try {
      // 1. Load paper data
      const paperData = await paperService.getPaperDetail(paperId);

      // Parse asset_json if it's a string
      if (paperData.exercises) {
        paperData.exercises.forEach((exercise) => {
          if (exercise.asset_json && typeof exercise.asset_json === 'string') {
            try {
              exercise.asset_json = JSON.parse(exercise.asset_json);
            } catch {
              // Failed to parse, skip
            }
          }
        });
      }

      // 2. Load user_papers
      const userPapersData = await paperService.getUserPapersByPaper(paperId);

      // 3. Select active user_paper
      const active = selectActiveUserPaper(userPapersData);

      // 4. Determine mode and answers
      let newMode: 'pending' | 'in_progress' | 'completed' | 'abandoned' = 'pending';
      let newAnswers = new Map<number, number>();

      if (active) {
        newMode = active.status as typeof newMode;

        // Load answers if in_progress or completed
        if (active.status === 'in_progress' || active.status === 'completed') {
          if (active.answers && active.answers.length > 0) {
            newAnswers = new Map(
              active.answers
                .filter((a) => a.exercise_item_id !== null)
                .map((a) => [a.exercise_item_id!, a.answer_index])
            );
          }
        }
      }

      setPaper(paperData);
      setUserPapers(userPapersData);
      setActiveUserPaper(active);
      setMode(newMode);
      setAnswers(newAnswers);
      setViewMode(savedViewMode);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知錯誤');
      setIsLoading(false);
    }
  };

  // Start paper
  const startPaper = async () => {
    if (!activeUserPaper) return;

    setIsSubmitting(true);
    try {
      const data = await paperService.startUserPaper(activeUserPaper.id);
      setActiveUserPaper({
        ...activeUserPaper,
        status: 'in_progress',
        started_at: data.started_at,
      });
      setMode('in_progress');
      setIsSubmitting(false);
    } catch (err) {
      setIsSubmitting(false);
      throw err;
    }
  };

  // Submit answer
  const submitAnswer = async (
    exerciseId: number,
    exerciseItemId: number,
    answerIndex: number
  ) => {
    if (!activeUserPaper) return;

    // Auto-start if pending
    if (mode === 'pending') {
      await startPaper();
    }

    // Only submit if in_progress
    if (usePaperDataStore.getState().mode !== 'in_progress') return;

    // 1. Update local state immediately
    setAnswer(exerciseItemId, answerIndex);

    // 2. Submit to backend (background)
    try {
      await paperService.submitAnswer(activeUserPaper.id, {
        exercise_id: exerciseId,
        exercise_item_id: exerciseItemId,
        answer_content: { selected_option: answerIndex },
        time_spent: 0,
      });
    } catch {
      // Submit failed, but don't block user interaction
    }

    // 3. Card mode: auto-advance if all items answered
    if (viewMode === 'card' && paper) {
      const currentExercise = paper.exercises[currentExerciseIndex];
      if (currentExercise) {
        const allItems = currentExercise.exercise_items;
        const currentAnswers = usePaperDataStore.getState().answers;
        const answeredItems = allItems.filter((item) => currentAnswers.has(item.id));

        // Auto-advance if all items answered and not last exercise
        if (
          answeredItems.length === allItems.length &&
          currentExerciseIndex < paper.exercises.length - 1
        ) {
          setTimeout(() => {
            cardNextExercise(paper.exercises.length - 1);
          }, 500);
        }
      }
    }
  };

  // Complete paper
  const completePaper = async () => {
    if (!activeUserPaper) return;

    setIsSubmitting(true);
    try {
      const data = await paperService.completePaper(activeUserPaper.id);
      setActiveUserPaper({
        ...activeUserPaper,
        status: 'completed',
        finished_at: data.finished_at,
      });
      setMode('completed');
      setIsSubmitting(false);

      // Card mode: jump to first exercise
      if (viewMode === 'card') {
        usePaperCardViewStore.getState().setCurrentExerciseIndex(0);
      }
    } catch (err) {
      setIsSubmitting(false);
      throw err;
    }
  };

  // Abandon paper
  const abandonPaper = async () => {
    if (!activeUserPaper) return;

    setIsSubmitting(true);
    try {
      await paperService.abandonPaper(activeUserPaper.id);
      setActiveUserPaper({ ...activeUserPaper, status: 'abandoned' });
      setMode('abandoned');
      setIsSubmitting(false);

      // Card mode: jump to first exercise
      if (viewMode === 'card') {
        usePaperCardViewStore.getState().setCurrentExerciseIndex(0);
      }
    } catch (err) {
      setIsSubmitting(false);
      throw err;
    }
  };

  // Retry paper
  const retryPaper = async () => {
    if (!paper || !activeUserPaper) return;

    setIsSubmitting(true);
    try {
      await paperService.renewPaper(activeUserPaper.id);
      await loadPaper(paper.id);
      setIsSubmitting(false);
    } catch (err) {
      setIsSubmitting(false);
      throw err;
    }
  };

  // Reset all stores
  const reset = () => {
    usePaperDataStore.getState().reset();
    usePaperUIStore.getState().reset();
    usePaperCardViewStore.getState().reset();
  };

  return {
    loadPaper,
    startPaper,
    submitAnswer,
    completePaper,
    abandonPaper,
    retryPaper,
    reset,
  };
};
