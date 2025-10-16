'use client';

import { ChevronLeft, ChevronRight, Menu, Bookmark } from 'lucide-react';
import { usePaperStore } from '@/stores/usePaperStore';

/**
 * NavigationControls 組件
 * 前一題、後一題、目錄、標記按鈕
 */
export default function NavigationControls() {
  const paper = usePaperStore((state) => state.paper);
  const currentExerciseIndex = usePaperStore((state) => state.currentExerciseIndex);
  const previousExercise = usePaperStore((state) => state.previousExercise);
  const nextExercise = usePaperStore((state) => state.nextExercise);
  const toggleNavigationPanel = usePaperStore((state) => state.toggleNavigationPanel);
  const toggleMarkExercise = usePaperStore((state) => state.toggleMarkExercise);
  const markedExercises = usePaperStore((state) => state.markedExercises);

  if (!paper) return null;

  const currentExercise = paper.exercises[currentExerciseIndex];
  const isMarked = markedExercises.has(currentExercise.id);
  const isFirstExercise = currentExerciseIndex === 0;
  const isLastExercise = currentExerciseIndex === paper.exercises.length - 1;

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 md:px-6 md:py-4">
      <div className="flex items-center justify-between gap-2">
        {/* 左側：前一題按鈕 */}
        <button
          onClick={previousExercise}
          disabled={isFirstExercise}
          className={`flex items-center gap-1 rounded-lg px-3 py-2 font-medium transition-colors md:gap-2 md:px-4 ${
            isFirstExercise
              ? 'cursor-not-allowed bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 active:bg-gray-300 dark:active:bg-gray-500'
          }`}
          aria-label="前一題"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="hidden sm:inline">上一題</span>
        </button>

        {/* 中間：標記 & 目錄按鈕 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleMarkExercise(currentExercise.id)}
            className={`rounded-lg p-2 transition-colors active:scale-95 ${
              isMarked
                ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/70'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            aria-label={isMarked ? '取消標記' : '標記此題'}
          >
            <Bookmark className={`h-5 w-5 ${isMarked ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={toggleNavigationPanel}
            className="rounded-lg bg-gray-100 dark:bg-gray-700 p-2 text-gray-600 dark:text-gray-300 transition-colors hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95"
            aria-label="開啟目錄"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* 右側：下一題按鈕 */}
        <button
          onClick={nextExercise}
          disabled={isLastExercise}
          className={`flex items-center gap-1 rounded-lg px-3 py-2 font-medium transition-colors md:gap-2 md:px-4 ${
            isLastExercise
              ? 'cursor-not-allowed bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
              : 'bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700 active:bg-blue-700 dark:active:bg-blue-800'
          }`}
          aria-label="下一題"
        >
          <span className="hidden sm:inline">下一題</span>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
