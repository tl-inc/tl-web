/**
 * Exercise Session Practice Page
 *
 * 刷題練習頁面（重構版）
 */
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/common/BackButton';
import { LoadingButton } from '@/components/common/LoadingButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExerciseRenderer } from '@/components/exercise-sessions/ExerciseRenderer';
import { ExerciseSessionStats } from '@/components/exercise-sessions/ExerciseSessionStats';
import { SkillFeedbackCard } from '@/components/exercise-sessions/SkillFeedbackCard';
import { useExerciseSessionStore } from '@/stores/useExerciseSessionStore';
import {
  useSubmitAnswer,
  useGetNextExercise,
  useCompleteSession,
} from '@/hooks/exerciseSession/useExerciseSession';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import { PageLoading } from '@/components/common/PageLoading';

export default function ExerciseSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = parseInt(params.id as string);

  // Zustand store
  const currentQuestion = useExerciseSessionStore((state) => state.currentQuestion);
  const stats = useExerciseSessionStore((state) => state.stats);
  const showFeedback = useExerciseSessionStore((state) => state.showFeedback);
  const feedback = useExerciseSessionStore((state) => state.feedback);
  const startTimer = useExerciseSessionStore((state) => state.startTimer);

  // 本地答案狀態
  const [answer, setAnswer] = useState<Record<string, unknown>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // React Query hooks
  const submitAnswer = useSubmitAnswer(sessionId);
  const getNextExerciseQuery = useGetNextExercise(sessionId);
  const completeSession = useCompleteSession(sessionId);

  // 滑動手勢 Hook
  const { cardRef, handlers } = useSwipeGesture({
    onSwipeLeft: () => getNextExerciseQuery.mutate(),
    enabled: showFeedback,
    minSwipeDistance: 80,
  });

  // 初始化：如果 store 中沒有當前題目，則從後端獲取
  useEffect(() => {
    if (!currentQuestion && !isInitialized) {
      setIsInitialized(true);
      getNextExerciseQuery.mutate();
    }
  }, [currentQuestion, isInitialized, getNextExerciseQuery]);

  // 開始計時 + 捲動到頂部
  useEffect(() => {
    if (currentQuestion && !showFeedback) {
      startTimer();
      setAnswer({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentQuestion, showFeedback, startTimer]);

  // 處理答案變更（點擊選項時立即提交）
  const handleAnswerChange = (newAnswer: Record<string, unknown>) => {
    if (showFeedback) return;

    // 觸發震動反饋
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }

    setAnswer(newAnswer);

    if (!currentQuestion) return;

    // 轉換答案格式
    let itemId: number;
    if (currentQuestion.exercise_item_id) {
      itemId = currentQuestion.exercise_item_id;
    } else {
      const keys = Object.keys(newAnswer);
      itemId = keys.length > 0 ? Number(keys[0]) : currentQuestion.exercise_id;
    }

    const answerIndex = newAnswer[itemId];

    submitAnswer.mutate({
      exercise_id: currentQuestion.exercise_id,
      exercise_item_id: currentQuestion.exercise_item_id,
      answer_content: { selected_option: answerIndex },
      time_spent: 0,
    });
  };

  // Loading 狀態
  if (!currentQuestion && !showFeedback) {
    return <PageLoading fullScreen={false} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 頂部導航列 */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="container max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <BackButton
            onClick={() => router.push('/dashboard')}
            size="sm"
            hideTextOnSmall={true}
            className="mb-0"
          />

          {/* 統計資訊元件 */}
          <ExerciseSessionStats
            stats={
              stats || {
                total_questions: 0,
                correct_count: 0,
                accuracy: 0,
                current_streak: 0,
                max_streak: 0,
              }
            }
          />
        </div>
      </div>

      {/* 題目區域 */}
      <div className="container max-w-3xl mx-auto px-4 py-4 sm:py-6">
        {currentQuestion && (
          <Card ref={cardRef} {...handlers} className="shadow-lg">
            <CardHeader>
              <CardTitle>
                第 {currentQuestion.sequence} 題 -{' '}
                {currentQuestion.exercise_type.display_name ||
                  currentQuestion.exercise_type.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* 題目渲染 */}
              <ExerciseRenderer
                question={currentQuestion}
                answer={answer}
                onAnswerChange={handleAnswerChange}
                disabled={showFeedback}
              />

              {/* 即時反饋 */}
              {showFeedback && feedback && (
                <div className="mt-6 space-y-4">
                  {/* 技能反饋卡片元件 */}
                  {feedback.skills && feedback.skills.length > 0 && (
                    <SkillFeedbackCard skills={feedback.skills} />
                  )}

                  {/* 操作按鈕 */}
                  <div className="flex gap-3">
                    <LoadingButton
                      onClick={() => getNextExerciseQuery.mutate()}
                      isLoading={getNextExerciseQuery.isPending}
                      loadingText="載入中..."
                      className="flex-1"
                      size="lg"
                    >
                      下一題
                      <span className="ml-2 text-xs text-gray-400 hidden sm:inline">
                        (或向左滑)
                      </span>
                    </LoadingButton>
                    <Button
                      onClick={() => completeSession.mutate()}
                      disabled={completeSession.isPending}
                      variant="outline"
                      size="lg"
                      className="whitespace-nowrap"
                    >
                      結束
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
