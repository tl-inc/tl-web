/**
 * Exercise Session Summary Page
 *
 * 刷題結算頁面
 */
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { exerciseSessionService } from '@/lib/api/exerciseSession';
import { ExerciseSessionSummary } from '@/components/exercise-sessions/ExerciseSessionSummary';
import { useExerciseSessionStore } from '@/stores/useExerciseSessionStore';
import { PageLoading } from '@/components/common/PageLoading';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';

export default function ExerciseSessionSummaryPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = parseInt(params.id as string);

  // 重置 store
  const reset = useExerciseSessionStore((state) => state.reset);

  // 取得 Session 詳情 (包含 summary)
  const { data: session, isLoading } = useQuery({
    queryKey: ['exercise-session', sessionId],
    queryFn: () => exerciseSessionService.getSession(sessionId),
  });

  // 再來一輪
  const handleRestart = () => {
    reset();
    router.push('/exercise-session-configuration');
  };

  // 返回首頁
  const handleBackHome = () => {
    reset();
    router.push('/dashboard');
  };

  if (isLoading) {
    return <PageLoading fullScreen={false} />;
  }

  if (!session) {
    return (
      <div className="container max-w-3xl mx-auto py-8">
        <EmptyState
          message="找不到結算資料"
          description="可能是 Session 不存在或尚未完成"
          size="lg"
          action={
            <Button onClick={handleBackHome} className="px-4 py-2">
              返回首頁
            </Button>
          }
        />
      </div>
    );
  }

  // 建立 summary 資料結構
  // 注意: 實際的 summary 應該從 API 回傳,這裡暫時從 session 資料建構
  const summary = {
    basic_stats: {
      total_questions: session.total_questions,
      correct_count: session.correct_count,
      accuracy: session.total_questions > 0
        ? session.correct_count / session.total_questions
        : 0,
      current_streak: 0, // Session 結束後沒有當前連勝
      max_streak: session.max_streak,
    },
    skill_performance: [], // TODO: 從 API 取得
    level_changes: [], // TODO: 從 API 取得
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container max-w-3xl mx-auto px-4 py-4 sm:py-8">
        <ExerciseSessionSummary
          summary={summary}
          onRestart={handleRestart}
          onBackHome={handleBackHome}
        />
      </div>
    </div>
  );
}
