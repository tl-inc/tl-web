/**
 * ExerciseSessionStats Component
 *
 * 顯示刷題練習的統計資訊
 */

import type { SessionStats } from '@/types/exerciseSession';

interface ExerciseSessionStatsProps {
  stats: SessionStats;
}

export function ExerciseSessionStats({
  stats,
}: ExerciseSessionStatsProps) {
  const { total_questions, correct_count, current_streak } = stats;
  const incorrectCount = total_questions - correct_count;

  return (
    <div className="flex items-center gap-3 text-sm">
      {/* 已完成數量 */}
      <div className="flex items-center gap-1">
        <span className="text-gray-600 dark:text-gray-400">已完成：</span>
        <span className="font-semibold text-gray-900 dark:text-gray-100">
          {total_questions}
        </span>
      </div>

      {/* 正確數量 */}
      <div className="flex items-center gap-1">
        <span className="text-green-600 dark:text-green-400">Ｏ：</span>
        <span className="font-semibold text-green-600 dark:text-green-400">
          {correct_count}
        </span>
      </div>

      {/* 錯誤數量 */}
      <div className="flex items-center gap-1">
        <span className="text-red-600 dark:text-red-400">Ｘ：</span>
        <span className="font-semibold text-red-600 dark:text-red-400">
          {incorrectCount}
        </span>
      </div>

      {/* 連勝 Badge - 只在連勝 >= 2 時顯示 */}
      {current_streak >= 2 && (
        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
          <span className="text-xs font-bold">🔥</span>
          <span className="font-bold">{current_streak}</span>
          <span className="text-xs font-bold">連勝</span>
        </div>
      )}
    </div>
  );
}
