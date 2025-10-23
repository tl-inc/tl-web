'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import toast, { Toaster } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { ScoreCard } from '@/components/papers/ScoreCard';
import { PaperHeader } from '@/components/papers/PaperHeader';
import { PaperActionButtons } from '@/components/papers/PaperActionButtons';
import { ExerciseCard } from '@/components/papers/ExerciseCard';
import CardViewContainer from '@/components/papers/CardView/CardViewContainer';
import { usePaperStore } from '@/stores/usePaperStore';
import { PageLoading } from '@/components/common/PageLoading';
import { EmptyState } from '@/components/common/EmptyState';

export default function PaperDetailPage() {
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showAbandonDialog, setShowAbandonDialog] = useState(false);

  const params = useParams();
  const router = useRouter();
  const paper_id = params.paper_id as string;

  // Zustand store
  const {
    paper,
    mode,
    answers,
    viewMode,
    isLoading,
    error,
    isSubmitting,
    loadPaper,
    startPaper,
    submitAnswer,
    completePaper,
    abandonPaper,
    retryPaper,
    calculateStats,
    reset,
  } = usePaperStore();

  // 載入試卷
  useEffect(() => {
    if (paper_id) {
      loadPaper(Number(paper_id));
    }
    return () => reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paper_id]);

  // 禁止 body 捲動
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // 處理函數
  const handleStart = async () => {
    try {
      await startPaper();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '開始作答失敗');
    }
  };

  const handleAnswerChange = async (
    exerciseId: number,
    exerciseItemId: number,
    answerIndex: number
  ) => {
    try {
      await submitAnswer(exerciseId, exerciseItemId, answerIndex);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '送出答案失敗');
    }
  };

  const handleCompleteClick = () => {
    setShowCompleteDialog(true);
  };

  const handleCompleteConfirm = async () => {
    try {
      await completePaper();
      if (viewMode === 'scroll') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '完成作答失敗');
    }
  };

  const handleAbandonClick = () => {
    setShowAbandonDialog(true);
  };

  const handleAbandonConfirm = async () => {
    try {
      await abandonPaper();
      if (viewMode === 'scroll') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '放棄作答失敗');
    }
  };

  const handleRenew = async () => {
    try {
      await retryPaper();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '重新作答失敗');
    }
  };

  // Loading 狀態
  if (isLoading) {
    return (
      <ProtectedRoute>
        <SidebarLayout>
          <PageLoading size="lg" />
        </SidebarLayout>
      </ProtectedRoute>
    );
  }

  // Error 狀態
  if (error) {
    return (
      <ProtectedRoute>
        <SidebarLayout>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center max-w-md">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                載入失敗
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
              <Button onClick={() => router.back()}>返回</Button>
            </div>
          </div>
        </SidebarLayout>
      </ProtectedRoute>
    );
  }

  // 沒有試卷
  if (!paper) {
    return (
      <ProtectedRoute>
        <SidebarLayout>
          <div className="flex items-center justify-center min-h-screen">
            <EmptyState message="找不到試卷" />
          </div>
        </SidebarLayout>
      </ProtectedRoute>
    );
  }

  const stats = calculateStats();

  return (
    <ProtectedRoute>
      <SidebarLayout lockScroll={true}>
        <Toaster position="top-center" />

        {viewMode === 'scroll' ? (
          // 整頁模式
          <div className="flex flex-col h-[100dvh] bg-gray-50 dark:bg-gray-900 overflow-hidden">
            {/* Header */}
            <div className="flex-shrink-0 bg-gray-50 dark:bg-gray-900 pt-8 pb-4 shadow-lg dark:shadow-gray-950/50 relative z-10">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Card */}
                <PaperHeader
                  paperId={paper.id}
                  totalItems={paper.total_items}
                  mode={mode}
                  correctCount={stats.correctCount}
                  totalCount={stats.totalCount}
                />

                {/* Action Buttons */}
                <div className="mb-3">
                  <PaperActionButtons
                    mode={mode}
                    isSubmitting={isSubmitting}
                    onStart={handleStart}
                    onComplete={handleCompleteClick}
                    onAbandon={handleAbandonClick}
                    onRenew={handleRenew}
                  />
                </div>

                {/* Score Card - 只在已完成時顯示 */}
                {mode === 'completed' && (
                  <div className="mb-3">
                    <ScoreCard
                      score={stats.score}
                      correctCount={stats.correctCount}
                      totalCount={stats.totalCount}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 可捲動的題目區域 */}
            <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 relative">
              <div className="sticky top-0 h-8 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-transparent pointer-events-none z-10"></div>

              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-6">
                <div className="space-y-6">
                  {paper.exercises.map((exercise, index) => (
                    <ExerciseCard
                      key={exercise.id}
                      exercise={exercise}
                      index={index}
                      answers={answers}
                      mode={mode}
                      onAnswerChange={handleAnswerChange}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // 卡片模式
          <div className="min-h-[100dvh] bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div
                className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md"
                style={{ height: 'calc(100dvh - 8rem)' }}
              >
                <CardViewContainer />
              </div>
            </div>
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
      </SidebarLayout>
    </ProtectedRoute>
  );
}
