'use client';

import { usePaperStore } from '@/stores/usePaperStore';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import ViewModeToggle from './ViewModeToggle';

/**
 * ProgressBar 組件
 * 顯示當前進度
 */
export default function ProgressBar() {
  const paper = usePaperStore((state) => state.paper);
  const currentExerciseIndex = usePaperStore((state) => state.currentExerciseIndex);
  const mode = usePaperStore((state) => state.mode);
  const isSubmitting = usePaperStore((state) => state.isSubmitting);
  const completePaper = usePaperStore((state) => state.completePaper);
  const abandonPaper = usePaperStore((state) => state.abandonPaper);
  const toggleNavigationPanel = usePaperStore((state) => state.toggleNavigationPanel);

  if (!paper) return null;

  const totalExercises = paper.exercises.length;
  const currentNumber = currentExerciseIndex + 1;
  const progress = (currentNumber / totalExercises) * 100;

  // 完成作答
  const handleComplete = async () => {
    if (!confirm('確定要完成作答嗎？完成後將無法修改答案。')) return;

    try {
      await completePaper();
      // 立即跳到頂部
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '完成作答失敗');
    }
  };

  // 放棄作答
  const handleAbandon = async () => {
    if (!confirm('確定要放棄作答嗎？')) return;

    try {
      await abandonPaper();
      // 立即跳到頂部
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '放棄作答失敗');
    }
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4">
      {/* 進度資訊和按鈕 */}
      <div className="mb-2 flex items-center justify-between gap-2 text-sm">
        {/* 左側：進度資訊（可點擊開啟目錄） */}
        <div
          className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors rounded px-2 py-1 -ml-2"
          onClick={toggleNavigationPanel}
        >
          <span className="font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
            題目 {currentNumber} / {totalExercises}
          </span>
          <span className="text-gray-500 dark:text-gray-400">{Math.round(progress)}%</span>
        </div>

        {/* 右側：操作按鈕 */}
        <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
          {mode === 'in_progress' && (
            <>
              <Button
                onClick={handleComplete}
                disabled={isSubmitting}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                <span>完成</span>
              </Button>
              <Button
                onClick={handleAbandon}
                disabled={isSubmitting}
                size="sm"
                variant="destructive"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                <span>放棄</span>
              </Button>
            </>
          )}
          <ViewModeToggle />
        </div>
      </div>

      {/* 進度條 */}
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 cursor-pointer"
        onClick={toggleNavigationPanel}
      >
        <div
          className="h-full rounded-full bg-blue-500 dark:bg-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
