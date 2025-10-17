'use client';

import { usePaperStore } from '@/stores/usePaperStore';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

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
      <div className="mb-2 flex items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <span className="font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
            題目 {currentNumber} / {totalExercises}
          </span>
          <span className="text-gray-500 dark:text-gray-400">{Math.round(progress)}%</span>
        </div>
        {mode === 'in_progress' && (
          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={handleComplete}
              disabled={isSubmitting}
              size="sm"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              <span>完成作答</span>
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
              <span>放棄作答</span>
            </Button>
          </div>
        )}
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
