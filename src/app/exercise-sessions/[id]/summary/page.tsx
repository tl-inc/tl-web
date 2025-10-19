/**
 * Exercise Session Summary Page
 *
 * 刷題結算頁面
 */
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { exerciseSessionService } from '@/lib/api/exerciseSession';
import { ExerciseSessionSummary } from '@/components/exercise-sessions/ExerciseSessionSummary';
import { useExerciseSessionStore } from '@/stores/useExerciseSessionStore';

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
    return (
      <div className="container max-w-3xl mx-auto py-8">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container max-w-3xl mx-auto py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">找不到結算資料</h2>
          <p className="text-muted-foreground mb-6">
            可能是 Session 不存在或尚未完成
          </p>
          <button
            onClick={handleBackHome}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            返回首頁
          </button>
        </div>
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
