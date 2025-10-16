'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, AlertCircle, Clock, Play, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { PaperData, UserPaperResponse, UserPaperStatus, Exercise } from '@/types/paper';
import toast, { Toaster } from 'react-hot-toast';
import { paperService } from '@/lib/api/paper';
import { ClozeExercise } from '@/components/papers/exercises/ClozeExercise';
import { MCQExercise } from '@/components/papers/exercises/MCQExercise';
import { ItemSetExercise } from '@/components/papers/exercises/ItemSetExercise';

// 四種模式
type PageMode = 'pending' | 'in_progress' | 'completed' | 'abandoned';

export default function PaperDetailPage() {
  const params = useParams();
  const router = useRouter();
  const paper_id = params.paper_id as string;

  // Data states
  const [paper, setPaper] = useState<PaperData | null>(null);
  const [userPapers, setUserPapers] = useState<UserPaperResponse[]>([]);
  const [activeUserPaper, setActiveUserPaper] = useState<UserPaperResponse | null>(null);
  const [mode, setMode] = useState<PageMode>('pending');

  // UI states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Answer state: Map<exercise_item_id, answer_index>
  const [answers, setAnswers] = useState<Map<number, number>>(new Map());

  // 計算分數統計
  const calculateStats = () => {
    if (!paper) return { correctCount: 0, totalCount: 0, score: 0 };

    let correctCount = 0;
    let totalCount = 0;

    paper.exercises.forEach(exercise => {
      exercise.exercise_items.forEach(item => {
        totalCount++;
        const userAnswer = answers.get(item.id);
        if (userAnswer !== undefined) {
          const selectedOption = item.options[userAnswer];
          if (selectedOption && selectedOption.is_correct) {
            correctCount++;
          }
        }
      });
    });

    const score = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
    return { correctCount, totalCount, score };
  };

  // 選擇要顯示的 user_paper
  // 優先順序: in_progress > pending > 最新的 completed/abandoned
  const selectActiveUserPaper = (userPapers: UserPaperResponse[]): UserPaperResponse | null => {
    if (userPapers.length === 0) return null;

    const inProgress = userPapers.find(up => up.status === 'in_progress');
    if (inProgress) return inProgress;

    const pending = userPapers.find(up => up.status === 'pending');
    if (pending) return pending;

    // 最新的 completed/abandoned
    const sorted = [...userPapers].sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return sorted[0];
  };

  // 載入試卷和 user_papers
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. 載入試卷資料
        const paperData = await paperService.getPaperDetail(Number(paper_id));

        // Parse asset_json if it's a string
        if (paperData.exercises) {
          paperData.exercises.forEach((exercise) => {
            if (exercise.asset_json && typeof exercise.asset_json === 'string') {
              try {
                exercise.asset_json = JSON.parse(exercise.asset_json);
              } catch (e) {
                // Failed to parse asset_json, skip
              }
            }
          });
        }

        setPaper(paperData);

        // 2. 載入該 paper 的所有 user_papers
        const userPapersData = await paperService.getUserPapersByPaper(Number(paper_id));
        setUserPapers(userPapersData);

        // 3. 選擇要顯示的 user_paper
        const active = selectActiveUserPaper(userPapersData);
        setActiveUserPaper(active);

        // 4. 根據 status 決定模式
        if (active) {
          setMode(active.status as PageMode);

          // 5. 如果是 in_progress，載入已答題目
          if (active.status === 'in_progress') {
            const savedAnswers: Array<{ exercise_item_id: number; answer_index: number }> =
              await paperService.getUserPaperAnswers(active.id);
            const answerMap = new Map(savedAnswers.map(a => [a.exercise_item_id, a.answer_index]));
            setAnswers(answerMap);
          }
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : '未知錯誤');
      } finally {
        setIsLoading(false);
      }
    };

    if (paper_id) {
      fetchData();
    }
  }, [paper_id]);

  // 開始作答
  const handleStart = async () => {
    if (!activeUserPaper) return;

    setIsSubmitting(true);
    try {
      const data = await paperService.startUserPaper(activeUserPaper.id);
      setActiveUserPaper({ ...activeUserPaper, status: 'in_progress', started_at: data.started_at });
      setMode('in_progress');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '開始作答失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 答題（即時送出）
  const handleAnswerChange = async (exerciseId: number, exerciseItemId: number, answerIndex: number) => {
    if (!activeUserPaper) return;

    // 如果是 pending 狀態，自動開始考試
    if (mode === 'pending') {
      await handleStart();
      // 開始考試後，立即記錄並送出答案
      setAnswers(prev => new Map(prev).set(exerciseItemId, answerIndex));

      // 送出答案到後端
      try {
        await paperService.submitAnswer(activeUserPaper.id, {
          exercise_id: exerciseId,
          exercise_item_id: exerciseItemId,
          answer_content: { selected_option: answerIndex },
          time_spent: 0,
        });
      } catch (error) {
        // Submit failed silently in review mode
      }
      return;
    }

    // 只有 in_progress 才能答題
    if (mode !== 'in_progress') return;

    // 1. 更新 local state (立即反應)
    setAnswers(prev => new Map(prev).set(exerciseItemId, answerIndex));

    // 2. 立即送出到 backend (背景執行)
    try {
      await paperService.submitAnswer(activeUserPaper.id, {
        exercise_id: exerciseId,
        exercise_item_id: exerciseItemId,
        answer_content: { selected_option: answerIndex },
        time_spent: 0,
      });
    } catch (error) {
      // Submit failed, but don't block user interaction
    }
  };

  // 完成作答
  const handleComplete = async () => {
    if (!activeUserPaper) return;

    if (!confirm('確定要完成作答嗎?完成後將無法修改答案。')) return;

    setIsSubmitting(true);
    try {
      const data = await paperService.completePaper(activeUserPaper.id);
      setActiveUserPaper({ ...activeUserPaper, status: 'completed', finished_at: data.finished_at });
      setMode('completed');

      // 立即跳到頂部
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '完成作答失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 放棄作答
  const handleAbandon = async () => {
    if (!activeUserPaper) return;

    if (!confirm('確定要放棄作答嗎?')) return;

    setIsSubmitting(true);
    try {
      const data = await paperService.abandonPaper(activeUserPaper.id);
      setActiveUserPaper({ ...activeUserPaper, status: 'abandoned', finished_at: data.finished_at });
      setMode('abandoned');

      // 立即跳到頂部
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '放棄作答失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 重新作答
  const handleRenew = async () => {
    if (!activeUserPaper) return;

    setIsSubmitting(true);
    try {
      const data = await paperService.renewPaper(activeUserPaper.id);

      // 建立新的 user_paper
      const newUserPaper: UserPaperResponse = {
        id: data.user_paper_id,
        user_id: activeUserPaper.user_id,
        paper_id: data.paper_id,
        status: data.status,
        started_at: null,
        finished_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setActiveUserPaper(newUserPaper);
      setMode('in_progress');
      setAnswers(new Map()); // 清空答案
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '重新作答失敗');
    } finally {
      setIsSubmitting(false);
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

  // Loading state
  if (isLoading) {
    return (
      <ProtectedRoute>
        <SidebarLayout>
          <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        </SidebarLayout>
      </ProtectedRoute>
    );
  }

  // Error state
  if (error || !paper) {
    return (
      <ProtectedRoute>
        <SidebarLayout>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-gray-900 dark:text-gray-100">{error || '無法載入試卷'}</p>
            </div>
          </div>
        </SidebarLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <SidebarLayout>
        <Toaster position="top-center" />
        <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
          <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8 p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 dark:border-gray-700/50">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-3">
                試卷 #{paper.id}
              </h1>
              <div className="flex items-center gap-4 text-sm flex-wrap">
                <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium">
                  總題數: {paper.total_items}
                </span>
                {activeUserPaper && (
                  <span className={`px-3 py-1 rounded-full font-semibold ${
                    mode === 'pending' ? 'bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-800 dark:to-slate-800 text-gray-700 dark:text-gray-300' :
                    mode === 'in_progress' ? 'bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-700 dark:text-blue-300' :
                    mode === 'completed' ? 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300' :
                    'bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30 text-red-700 dark:text-red-300'
                  }`}>
                    {mode === 'pending' && '📋 未開始'}
                    {mode === 'in_progress' && '✍️ 作答中'}
                    {mode === 'completed' && '✅ 已完成'}
                    {mode === 'abandoned' && '❌ 已放棄'}
                  </span>
                )}
              </div>
            </div>

            {/* Completed mode: show stats at top */}
            {mode === 'completed' && (() => {
              const { correctCount, totalCount, score } = calculateStats();
              return (
                <div className="mt-6 p-8 bg-gradient-to-br from-green-50/90 to-emerald-50/90 dark:from-green-900/20 dark:to-emerald-900/20 backdrop-blur-sm border-2 border-green-300 dark:border-green-700 rounded-2xl shadow-lg">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full mb-4">
                      <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent mb-4">
                      作答完成！
                    </div>

                    {/* 分數統計 */}
                    <div className="mt-6 grid grid-cols-3 gap-4 max-w-md mx-auto">
                      <div className="p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{score}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">分數</div>
                      </div>
                      <div className="p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400">{correctCount}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">答對數</div>
                      </div>
                      <div className="p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl">
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{totalCount}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">總題數</div>
                      </div>
                    </div>

                    <div className="mt-4 text-gray-600 dark:text-gray-400 font-medium">
                      已顯示正確答案與解析
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Mode-specific header buttons */}
            <div className="mb-8">
              {mode === 'pending' && (
                <button
                  onClick={handleStart}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl transition-all font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Play className="w-6 h-6" />
                  開始作答
                </button>
              )}

              {mode === 'abandoned' && (
                <div className="p-5 bg-gradient-to-r from-amber-50/90 to-yellow-50/90 dark:from-amber-900/20 dark:to-yellow-900/20 backdrop-blur-sm border-2 border-amber-300 dark:border-amber-700 rounded-xl shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-amber-800 dark:text-amber-200">
                      <AlertCircle className="w-6 h-6" />
                      <span className="font-bold text-lg">此試卷已放棄</span>
                    </div>
                    <button
                      onClick={handleRenew}
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <RotateCcw className="w-4 h-4" />
                      重新作答
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Exercises */}
            <div className="space-y-6">
              {paper.exercises.map((exercise, index) => renderExercise(exercise, index))}
            </div>

            {/* Bottom action buttons */}
            {mode === 'in_progress' && (
              <div className="mt-8 flex gap-4 justify-center">
                <button
                  onClick={handleComplete}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl transition-all font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <CheckCircle className="w-6 h-6" />
                  完成作答
                </button>
                <button
                  onClick={handleAbandon}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-400 to-rose-400 hover:from-red-500 hover:to-rose-500 text-white rounded-xl transition-all font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <XCircle className="w-6 h-6" />
                  放棄作答
                </button>
              </div>
            )}
          </div>
        </div>
      </SidebarLayout>
    </ProtectedRoute>
  );
}
