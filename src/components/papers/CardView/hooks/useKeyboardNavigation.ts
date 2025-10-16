import { useEffect } from 'react';
import { usePaperStore } from '@/stores/usePaperStore';

/**
 * useKeyboardNavigation Hook
 *
 * 鍵盤快捷鍵：
 * - ← (ArrowLeft): 上一題
 * - → (ArrowRight): 下一題
 * - M: 標記/取消標記當前題目
 * - N: 開啟/關閉導航面板
 * - Home: 跳到第一題
 * - End: 跳到最後一題
 * - 數字鍵 1-9: 快速跳到指定題號
 */
export function useKeyboardNavigation() {
  const paper = usePaperStore((state) => state.paper);
  const viewMode = usePaperStore((state) => state.viewMode);
  const currentExerciseIndex = usePaperStore((state) => state.currentExerciseIndex);
  const previousExercise = usePaperStore((state) => state.previousExercise);
  const nextExercise = usePaperStore((state) => state.nextExercise);
  const jumpToExercise = usePaperStore((state) => state.jumpToExercise);
  const toggleMarkExercise = usePaperStore((state) => state.toggleMarkExercise);
  const toggleNavigationPanel = usePaperStore((state) => state.toggleNavigationPanel);

  useEffect(() => {
    // 只在卡片模式下啟用鍵盤快捷鍵
    if (viewMode !== 'card' || !paper) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // 如果正在輸入框中，不觸發快捷鍵
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      const currentExercise = paper.exercises[currentExerciseIndex];

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          previousExercise();
          break;

        case 'ArrowRight':
          e.preventDefault();
          nextExercise();
          break;

        case 'm':
        case 'M':
          e.preventDefault();
          if (currentExercise) {
            toggleMarkExercise(currentExercise.id);
          }
          break;

        case 'n':
        case 'N':
          e.preventDefault();
          toggleNavigationPanel();
          break;

        case 'Home':
          e.preventDefault();
          jumpToExercise(0);
          break;

        case 'End':
          e.preventDefault();
          jumpToExercise(paper.exercises.length - 1);
          break;

        // 數字鍵 1-9
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          e.preventDefault();
          const targetIndex = parseInt(e.key) - 1;
          if (targetIndex < paper.exercises.length) {
            jumpToExercise(targetIndex);
          }
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    viewMode,
    paper,
    currentExerciseIndex,
    previousExercise,
    nextExercise,
    jumpToExercise,
    toggleMarkExercise,
    toggleNavigationPanel,
  ]);
}
