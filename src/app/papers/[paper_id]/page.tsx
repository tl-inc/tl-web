'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, AlertCircle, Clock, Play, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import type { Exercise } from '@/types/paper';
import toast, { Toaster } from 'react-hot-toast';
import { ClozeExercise } from '@/components/papers/exercises/ClozeExercise';
import { MCQExercise } from '@/components/papers/exercises/MCQExercise';
import { ItemSetExercise } from '@/components/papers/exercises/ItemSetExercise';
import { ScoreCard } from '@/components/papers/ScoreCard';
import { usePaperStore } from '@/stores/usePaperStore';
import ViewModeToggle from '@/components/papers/CardView/ViewModeToggle';
import CardViewContainer from '@/components/papers/CardView/CardViewContainer';
import { Button } from '@/components/ui/button';

export default function PaperDetailPage() {
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

  // 載入試卷和 user_papers
  useEffect(() => {
    if (paper_id) {
      loadPaper(Number(paper_id));
    }

    // Cleanup on unmount
    return () => reset();
  }, [paper_id, loadPaper, reset]);

  // 卡片模式下禁止 body 捲動
  useEffect(() => {
    if (viewMode === 'card') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup
    return () => {
      document.body.style.overflow = '';
    };
  }, [viewMode]);

  // 開始作答
  const handleStart = async () => {
    try {
      await startPaper();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '開始作答失敗');
    }
  };

  // 答題（即時送出）
  const handleAnswerChange = async (exerciseId: number, exerciseItemId: number, answerIndex: number) => {
    try {
      await submitAnswer(exerciseId, exerciseItemId, answerIndex);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '送出答案失敗');
    }
  };

  // 完成作答
  const handleComplete = async () => {
    if (!confirm('確定要完成作答嗎?完成後將無法修改答案。')) return;

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
    if (!confirm('確定要放棄作答嗎?')) return;

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

  // 渲染 Exercise
  const renderExercise = (exercise: Exercise, index: number) => {
    const exerciseTypeId = exercise.exercise_type_id;
    const exerciseTypeName = exercise.exercise_type.name;

    let exerciseComponent;

    // 克漏字
    if (exerciseTypeId === 4) {
      exerciseComponent = <ClozeExercise exercise={exercise} answers={answers} onAnswerChange={handleAnswerChange} mode={mode} />;
    }
    // 單選題 (1, 2, 3)
    else if ([1, 2, 3].includes(exerciseTypeId)) {
      exerciseComponent = <MCQExercise exercise={exercise} answers={answers} onAnswerChange={handleAnswerChange} mode={mode} />;
    }
    // 題組 (5-12)
    else if (exerciseTypeId >= 5 && exerciseTypeId <= 12) {
      exerciseComponent = <ItemSetExercise exercise={exercise} answers={answers} onAnswerChange={handleAnswerChange} mode={mode} />;
    }

    return (
      <div key={exercise.id} className="p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-orange-50/80 to-amber-50/80 dark:from-orange-950/30 dark:to-amber-950/30 border-orange-200/50 dark:border-orange-700/50">
        <div className="mb-4">
          <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm text-gray-700 dark:text-gray-300">
            題目 {index + 1} - {exerciseTypeName}
          </span>
        </div>
        {exerciseComponent}
      </div>
    );
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <SidebarLayout>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600 dark:text-blue-400" />
              <p className="text-gray-600 dark:text-gray-400">載入中...</p>
            </div>
          </div>
        </SidebarLayout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <SidebarLayout>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center max-w-md">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">載入失敗</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
              <Button onClick={() => router.back()}>
                返回
              </Button>
            </div>
          </div>
        </SidebarLayout>
      </ProtectedRoute>
    );
  }

  if (!paper) {
    return (
      <ProtectedRoute>
        <SidebarLayout>
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-gray-600 dark:text-gray-400">找不到試卷</p>
          </div>
        </SidebarLayout>
      </ProtectedRoute>
    );
  }

  const stats = calculateStats();

  return (
    <ProtectedRoute>
      <SidebarLayout>
        <Toaster position="top-center" />
        {viewMode === 'scroll' ? (
          // 整頁模式 - 固定 header，可捲動內容
          <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
            <div className="flex-shrink-0 bg-gray-50 dark:bg-gray-900 py-8 shadow-lg dark:shadow-gray-950/50 relative z-10">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 mb-6">
                  {/* 第一列：標題 + ViewModeToggle */}
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      試卷 #{paper.id}
                    </h1>
                    <ViewModeToggle />
                  </div>

                  {/* 第二列：狀態資訊 */}
                  <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>題數: {paper.total_items}</span>
                    </div>
                    {mode === 'completed' && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-green-600 dark:text-green-400 font-semibold">已完成</span>
                      </div>
                    )}
                    {mode === 'abandoned' && (
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="text-red-600 dark:text-red-400 font-semibold">已放棄</span>
                      </div>
                    )}
                    {mode === 'in_progress' && (
                      <div className="flex items-center gap-2">
                        <Play className="w-4 h-4 text-blue-500" />
                        <span className="text-blue-600 dark:text-blue-400 font-semibold">
                          作答中 ({stats.correctCount}/{stats.totalCount})
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 第三列：操作按鈕 */}
                  <div className="flex flex-wrap gap-2">
                    {mode === 'pending' && (
                      <Button
                        onClick={handleStart}
                        disabled={isSubmitting}
                        className="flex-1 min-w-[120px] sm:flex-initial bg-green-600 hover:bg-green-700"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                        <span>開始作答</span>
                      </Button>
                    )}

                    {mode === 'in_progress' && (
                      <>
                        <Button
                          onClick={handleComplete}
                          disabled={isSubmitting}
                          className="flex-1 min-w-[120px] sm:flex-initial bg-green-600 hover:bg-green-700"
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
                          variant="destructive"
                          className="flex-1 min-w-[120px] sm:flex-initial"
                        >
                          {isSubmitting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                          <span>放棄作答</span>
                        </Button>
                      </>
                    )}

                    {(mode === 'completed' || mode === 'abandoned') && (
                      <Button
                        onClick={handleRenew}
                        disabled={isSubmitting}
                        className="flex-1 min-w-[120px] sm:flex-initial bg-purple-600 hover:bg-purple-700"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <RotateCcw className="w-4 h-4" />
                        )}
                        <span>重新作答</span>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Score Card - 只在已完成時顯示 */}
                {mode === 'completed' && (
                  <div className="mb-6">
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
              {/* 頂部漸層淡入效果 */}
              <div className="sticky top-0 h-8 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-transparent pointer-events-none z-10"></div>

              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 -mt-8">
                <div className="space-y-6">
                  {paper.exercises.map((exercise, index) => renderExercise(exercise, index))}
                </div>

                {/* Bottom Actions */}
                {mode === 'in_progress' && (
                  <div className="mt-8 flex justify-center gap-4">
                    <Button
                      onClick={handleComplete}
                      disabled={isSubmitting}
                      size="lg"
                      className="text-lg font-semibold bg-green-600 hover:bg-green-700"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <CheckCircle className="w-5 h-5" />
                      )}
                      完成作答
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // 卡片模式
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md" style={{ height: 'calc(100vh - 8rem)' }}>
                <CardViewContainer />
              </div>
            </div>
          </div>
        )}
      </SidebarLayout>
    </ProtectedRoute>
  );
}
