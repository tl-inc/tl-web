'use client';

import { usePaperStore } from '@/stores/usePaperStore';

/**
 * ProgressBar 組件
 * 顯示當前進度
 */
export default function ProgressBar() {
  const paper = usePaperStore((state) => state.paper);
  const currentExerciseIndex = usePaperStore((state) => state.currentExerciseIndex);

  if (!paper) return null;

  const totalExercises = paper.exercises.length;
  const currentNumber = currentExerciseIndex + 1;
  const progress = (currentNumber / totalExercises) * 100;

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700 dark:text-gray-200">
          題目 {currentNumber} / {totalExercises}
        </span>
        <span className="text-gray-500 dark:text-gray-400">{Math.round(progress)}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="h-full rounded-full bg-blue-500 dark:bg-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
