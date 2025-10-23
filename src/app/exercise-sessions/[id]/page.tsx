/**
 * Exercise Session Practice Page
 *
 * 刷題練習頁面
 */
'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExerciseRenderer } from '@/components/exercise-sessions/ExerciseRenderer';
import { useExerciseSessionStore } from '@/stores/useExerciseSessionStore';
import {
  useSubmitAnswer,
  useGetNextExercise,
  useCompleteSession,
} from '@/hooks/exerciseSession/useExerciseSession';

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

  // 滑動手勢相關
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchEndY = useRef<number>(0);
  const isSwiping = useRef<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // React Query hooks
  const submitAnswer = useSubmitAnswer(sessionId);
  const getNextExerciseQuery = useGetNextExercise(sessionId);
  const completeSession = useCompleteSession(sessionId);

  // 初始化：如果 store 中沒有當前題目，則從後端獲取
  useEffect(() => {
    if (!currentQuestion && !isInitialized) {
      setIsInitialized(true);
      // 獲取下一題（實際上是第一題）
      getNextExerciseQuery.mutate();
    }
  }, [currentQuestion, isInitialized, getNextExerciseQuery]);

  // 開始計時 + 捲動到頂部
  useEffect(() => {
    if (currentQuestion && !showFeedback) {
      startTimer();
      setAnswer({}); // 清空答案
      // 捲動到頁面最頂部
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentQuestion, showFeedback, startTimer]);

  // 處理答案變更（點擊選項時立即提交）
  const handleAnswerChange = (newAnswer: Record<string, unknown>) => {
    // 如果已經有反饋了，不允許再改答案
    if (showFeedback) return;

    // 觸發震動反饋
    if (navigator.vibrate) {
      navigator.vibrate(10); // 10ms 短震動
    }

    setAnswer(newAnswer);

    // 立即提交答案
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

    const formattedAnswer = {
      selected_option: answerIndex,
    };

    submitAnswer.mutate({
      exercise_id: currentQuestion.exercise_id,
      exercise_item_id: currentQuestion.exercise_item_id,
      answer_content: formattedAnswer,
      time_spent: 0,
    });
  };

  // 下一題
  const handleNext = () => {
    getNextExerciseQuery.mutate();
  };

  // 結束練習
  const handleComplete = () => {
    completeSession.mutate();
  };

  // 返回首頁
  const handleBack = () => {
    router.push('/dashboard');
  };

  // 滑動手勢處理
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
    isSwiping.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;

    // 檢查是否有明顯的滑動動作（移動距離超過 10px）
    const deltaX = Math.abs(touchEndX.current - touchStartX.current);
    const deltaY = Math.abs(touchEndY.current - touchStartY.current);

    if (deltaX > 10 || deltaY > 10) {
      isSwiping.current = true;
    }
  };

  const handleTouchEnd = () => {
    // 只在顯示反饋時才允許滑動換題
    if (!showFeedback) return;

    // 如果沒有滑動動作（只是點擊），不處理
    if (!isSwiping.current) return;

    const swipeDistanceX = touchStartX.current - touchEndX.current;
    const swipeDistanceY = Math.abs(touchStartY.current - touchEndY.current);
    const minSwipeDistance = 80; // 增加最小滑動距離到 80px，更不容易誤觸

    // 確保是水平滑動而不是垂直滑動（水平距離要大於垂直距離）
    if (Math.abs(swipeDistanceX) <= swipeDistanceY) return;

    // 向左滑動（換下一題）
    if (swipeDistanceX > minSwipeDistance) {
      handleNext();
    }

    // 重置狀態
    isSwiping.current = false;
  };

  // Loading 狀態
  if (!currentQuestion && !showFeedback) {
    return (
      <div className="container max-w-3xl mx-auto py-8">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 頂部導航列 - 簡化版 */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="container max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">返回</span>
          </Button>

          {/* 精簡統計資訊 */}
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-gray-600 dark:text-gray-400">已完成：</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {stats?.total_questions || 0}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-green-600 dark:text-green-400">Ｏ：</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {stats?.correct_count || 0}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-red-600 dark:text-red-400">Ｘ：</span>
              <span className="font-semibold text-red-600 dark:text-red-400">
                {stats ? (stats.total_questions || 0) - (stats.correct_count || 0) : 0}
              </span>
            </div>
            {(stats?.current_streak || 0) >= 2 && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
                <span className="text-xs font-bold">🔥</span>
                <span className="font-bold">{stats.current_streak}</span>
                <span className="text-xs font-bold">連勝</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 題目區域 */}
      <div className="container max-w-3xl mx-auto px-4 py-4 sm:py-6">
        {currentQuestion ? (
          <Card
            ref={cardRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="shadow-lg"
          >
          <CardHeader>
            <CardTitle>
              第 {currentQuestion.sequence} 題 - {currentQuestion.exercise_type.display_name || currentQuestion.exercise_type.name}
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

            {/* 即時反饋（嵌入在題目下方） */}
            {showFeedback && feedback && (
              <div className="mt-6 space-y-4">
                {/* Skill 資訊 */}
                {feedback.skills && feedback.skills.length > 0 && (
                  <div className="space-y-3">
                    {feedback.skills.map((skill) => (
                      <div
                        key={skill.skill_id}
                        className="p-4 rounded-lg border bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800"
                      >
                        <div className="mb-3">
                          <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                            {skill.name}
                          </span>
                        </div>

                        {/* Skill metadata 內容 */}
                        {skill.metadata && typeof skill.metadata === 'object' && (
                          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                            {(() => {
                              const metadata = skill.metadata as Record<string, unknown>;
                              return (
                                <>
                            {/* 詞性 (POS) */}
                            {metadata.pos && (
                              <div>
                                <span className="font-semibold">詞性：</span>
                                <span>{(() => {
                                  const posMap: Record<string, string> = {
                                    'noun': '名詞',
                                    'verb': '動詞',
                                    'adjective': '形容詞',
                                    'adverb': '副詞',
                                    'pronoun': '代名詞',
                                    'preposition': '介系詞',
                                    'conjunction': '連接詞',
                                    'auxiliary': '助動詞',
                                    'int': '感嘆詞',
                                  };
                                  return posMap[metadata.pos as string] || (metadata.pos as string);
                                })() as string}</span>
                              </div>
                            )}

                            {/* 意思 (Meaning) */}
                            {metadata.meaning && (
                              <div>
                                <span className="font-semibold">意思：</span>
                                <span>{metadata.meaning as string}</span>
                              </div>
                            )}

                            {/* 可數性 (Countability) */}
                            {metadata.countability && (
                              <div>
                                <span className="font-semibold">可數性：</span>
                                <span>{metadata.countability as string}</span>
                              </div>
                            )}

                            {/* 詞形變化 (Inflections) */}
                            {metadata.inflections && typeof metadata.inflections === 'object' && (
                              <div>
                                <span className="font-semibold">詞形變化：</span>
                                <div className="ml-4 mt-1 space-y-0.5 text-xs">
                                  {Object.entries(metadata.inflections as Record<string, unknown>).map(([form, value]) => {
                                    if (value) {
                                      const formLabels: Record<string, string> = {
                                        plural: '複數',
                                        past_tense: '過去式',
                                        past_participle: '過去分詞',
                                        present_participle: '現在分詞',
                                        third_person_singular: '第三人稱單數',
                                        comparative: '比較級',
                                        superlative: '最高級',
                                      };
                                      return (
                                        <div key={form}>
                                          <span className="text-gray-600 dark:text-gray-400">{formLabels[form] || form}：</span>
                                          <span className="ml-1">{String(value)}</span>
                                        </div>
                                      );
                                    }
                                    return null;
                                  })}
                                </div>
                              </div>
                            )}

                            {/* 例句 (Example Sentences) */}
                            {metadata.example_sentences && Array.isArray(metadata.example_sentences) && (
                              <div>
                                <span className="font-semibold">例句：</span>
                                <div className="ml-4 mt-1 space-y-2">
                                  {(metadata.example_sentences as Array<{content: string; translation: string}>).map((example, idx) => (
                                    <div key={idx} className="text-xs">
                                      <div className="italic text-gray-800 dark:text-gray-200">{example.content}</div>
                                      <div className="text-gray-600 dark:text-gray-400">{example.translation}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                                </>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* 操作按鈕 - 移動裝置優化 */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleNext}
                    disabled={getNextExerciseQuery.isPending}
                    className="flex-1"
                    size="lg"
                  >
                    {getNextExerciseQuery.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        載入中...
                      </>
                    ) : (
                      <>
                        下一題
                        <span className="ml-2 text-xs text-gray-400 hidden sm:inline">(或向左滑)</span>
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleComplete}
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
        ) : null}
      </div>
    </div>
  );
}
