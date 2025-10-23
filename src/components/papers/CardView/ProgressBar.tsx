'use client';

import { useState } from 'react';
import { usePaperStore } from '@/stores/usePaperStore';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { CheckCircle, Loader2, XCircle, RotateCcw, Play, Target } from 'lucide-react';
import toast from 'react-hot-toast';
import ViewModeToggle from './ViewModeToggle';

/**
 * ProgressBar 組件
 * 顯示當前進度
 */
export default function ProgressBar() {
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showAbandonDialog, setShowAbandonDialog] = useState(false);

  const paper = usePaperStore((state) => state.paper);
  const currentExerciseIndex = usePaperStore((state) => state.currentExerciseIndex);
  const mode = usePaperStore((state) => state.mode);
  const isSubmitting = usePaperStore((state) => state.isSubmitting);
  const startPaper = usePaperStore((state) => state.startPaper);
  const completePaper = usePaperStore((state) => state.completePaper);
  const abandonPaper = usePaperStore((state) => state.abandonPaper);
  const retryPaper = usePaperStore((state) => state.retryPaper);
  const calculateStats = usePaperStore((state) => state.calculateStats);
  const toggleNavigationPanel = usePaperStore((state) => state.toggleNavigationPanel);

  if (!paper) return null;

  const totalExercises = paper.exercises.length;
  const currentNumber = currentExerciseIndex + 1;
  const progress = (currentNumber / totalExercises) * 100;
  const stats = calculateStats();

  // 根據分數決定顏色
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-blue-600 dark:text-blue-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  // 開始作答
  const handleStart = async () => {
    try {
      await startPaper();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '開始作答失敗');
    }
  };

  // 完成作答
  const handleCompleteClick = () => {
    setShowCompleteDialog(true);
  };

  const handleCompleteConfirm = async () => {
    try {
      await completePaper();
      // 立即跳到頂部
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '完成作答失敗');
    }
  };

  // 放棄作答
  const handleAbandonClick = () => {
    setShowAbandonDialog(true);
  };

  const handleAbandonConfirm = async () => {
    try {
      await abandonPaper();
      // 立即跳到頂部
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '放棄作答失敗');
    }
  };

  // 重新作答
  const handleRenew = async () => {
    try {
      await retryPaper();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '重新作答失敗');
    }
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4">
      {/* 進度資訊和按鈕 */}
      <div className="mb-2 flex items-center justify-between gap-2 text-sm">
        {/* 左側：進度資訊或分數統計 */}
        {mode === 'completed' || mode === 'abandoned' ? (
          // 結算時顯示分數
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Target className={`w-5 h-5 ${getScoreColor(stats.score)}`} />
              <span className={`text-2xl font-bold ${getScoreColor(stats.score)}`}>
                {stats.score}
              </span>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">分</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                {stats.correctCount}
              </span>
              <span className="flex items-center gap-1">
                <XCircle className="w-3 h-3 text-red-600 dark:text-red-400" />
                {stats.totalCount - stats.correctCount}
              </span>
            </div>
          </div>
        ) : (
          // 進行中顯示進度（可點擊開啟目錄）
          <div
            className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors rounded px-2 py-1 -ml-2"
            onClick={toggleNavigationPanel}
          >
            <span className="font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
              題目 {currentNumber} / {totalExercises}
            </span>
          </div>
        )}

        {/* 右側：操作按鈕 */}
        <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
          {mode === 'pending' && (
            <Button
              onClick={handleStart}
              disabled={isSubmitting}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span>開始</span>
            </Button>
          )}
          {mode === 'in_progress' && (
            <>
              <Button
                onClick={handleCompleteClick}
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
                onClick={handleAbandonClick}
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
          {(mode === 'completed' || mode === 'abandoned') && (
            <Button
              onClick={handleRenew}
              disabled={isSubmitting}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RotateCcw className="w-4 h-4" />
              )}
              <span>重新</span>
            </Button>
          )}
          <ViewModeToggle />
        </div>
      </div>

      {/* 進度條 - 只在非結算狀態顯示 */}
      {mode !== 'completed' && mode !== 'abandoned' && (
        <div
          className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 cursor-pointer"
          onClick={toggleNavigationPanel}
        >
          <div
            className="h-full rounded-full bg-blue-500 dark:bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* 確認對話框 */}
      <ConfirmDialog
        open={showCompleteDialog}
        onOpenChange={setShowCompleteDialog}
        onConfirm={handleCompleteConfirm}
        title="完成作答"
        description="確定要完成作答嗎？完成後將無法修改答案。"
      />
      <ConfirmDialog
        open={showAbandonDialog}
        onOpenChange={setShowAbandonDialog}
        onConfirm={handleAbandonConfirm}
        title="放棄作答"
        description="確定要放棄作答嗎？"
      />
    </div>
  );
}
