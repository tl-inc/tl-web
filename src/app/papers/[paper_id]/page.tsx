'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, AlertCircle, Clock, Play, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { PaperData, UserPaperResponse, UserPaperStatus, Exercise } from '@/types/paper';

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

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

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
        const paperResponse = await fetch(`${apiUrl}/papers/${paper_id}/detail`);
        if (!paperResponse.ok) throw new Error('無法載入試卷資料');
        const paperData: PaperData = await paperResponse.json();

        // Parse asset_json if it's a string
        if (paperData.exercises) {
          paperData.exercises.forEach((exercise) => {
            if (exercise.asset_json && typeof exercise.asset_json === 'string') {
              try {
                exercise.asset_json = JSON.parse(exercise.asset_json);
              } catch (e) {
                console.error('Failed to parse asset_json:', e);
              }
            }
          });
        }

        setPaper(paperData);

        // 2. 載入該 paper 的所有 user_papers
        const token = localStorage.getItem('access_token');
        const userPapersResponse = await fetch(`${apiUrl}/user-papers/by-paper/${paper_id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (userPapersResponse.ok) {
          const userPapersData: UserPaperResponse[] = await userPapersResponse.json();
          setUserPapers(userPapersData);

          // 3. 選擇要顯示的 user_paper
          const active = selectActiveUserPaper(userPapersData);
          setActiveUserPaper(active);

          // 4. 根據 status 決定模式
          if (active) {
            setMode(active.status as PageMode);

            // 5. 如果是 in_progress，載入已答題目
            if (active.status === 'in_progress') {
              const answersResponse = await fetch(`${apiUrl}/user-papers/${active.id}/answers`, {
                headers: { 'Authorization': `Bearer ${token}` }
              });
              if (answersResponse.ok) {
                const savedAnswers: Array<{ exercise_item_id: number; answer_index: number }> = await answersResponse.json();
                const answerMap = new Map(savedAnswers.map(a => [a.exercise_item_id, a.answer_index]));
                setAnswers(answerMap);
              }
            }
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
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${apiUrl}/user-papers/${activeUserPaper.id}/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('無法開始作答');

      const data = await response.json();
      setActiveUserPaper({ ...activeUserPaper, status: 'in_progress', started_at: data.started_at });
      setMode('in_progress');
    } catch (err) {
      alert(err instanceof Error ? err.message : '開始作答失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 答題（即時送出）
  const handleAnswerChange = async (exerciseId: number, exerciseItemId: number, answerIndex: number) => {
    if (!activeUserPaper || mode !== 'in_progress') return;

    // 1. 更新 local state (立即反應)
    setAnswers(prev => new Map(prev).set(exerciseItemId, answerIndex));

    // 2. 立即送出到 backend (背景執行)
    try {
      const token = localStorage.getItem('access_token');
      await fetch(`${apiUrl}/user-papers/${activeUserPaper.id}/answer`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          exercise_id: exerciseId,
          exercise_item_id: exerciseItemId,
          answer_content: { selected_option: answerIndex }
        })
      });
    } catch (error) {
      console.error('答案送出失敗:', error);
      // 不阻斷操作，但可以顯示提示
    }
  };

  // 完成作答
  const handleComplete = async () => {
    if (!activeUserPaper) return;

    if (!confirm('確定要完成作答嗎？完成後將無法修改答案。')) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${apiUrl}/user-papers/${activeUserPaper.id}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ submit: true })
      });

      if (!response.ok) throw new Error('無法完成作答');

      const data = await response.json();
      setActiveUserPaper({ ...activeUserPaper, status: 'completed', finished_at: data.finished_at });
      setMode('completed');
    } catch (err) {
      alert(err instanceof Error ? err.message : '完成作答失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 放棄作答
  const handleAbandon = async () => {
    if (!activeUserPaper) return;

    if (!confirm('確定要放棄作答嗎？')) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${apiUrl}/user-papers/${activeUserPaper.id}/abandon`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('無法放棄作答');

      const data = await response.json();
      setActiveUserPaper({ ...activeUserPaper, status: 'abandoned', finished_at: data.finished_at });
      setMode('abandoned');
    } catch (err) {
      alert(err instanceof Error ? err.message : '放棄作答失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 重新作答
  const handleRenew = async () => {
    if (!activeUserPaper) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${apiUrl}/user-papers/${activeUserPaper.id}/renew`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('無法重新作答');

      const data = await response.json();

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
      alert(err instanceof Error ? err.message : '重新作答失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 渲染 Exercise
  const renderExercise = (exercise: Exercise, index: number) => {
    const exerciseTypeId = exercise.exercise_type_id;
    const exerciseTypeName = exercise.exercise_type.name;

    // 根據題型渲染
    // V3 exercise_type_id:
    // 1: 單字題, 2: 片語題, 3: 文法題 (MCQ)
    // 4: 克漏字 (Cloze)
    // 5-12: 各種題組 (閱讀、聽力、圖片理解等)

    return (
      <div key={exercise.id} className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="mb-4">
          <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
            題目 {index + 1} - {exerciseTypeName}
          </span>
        </div>

        {/* 克漏字 */}
        {exerciseTypeId === 4 && renderCloze(exercise)}

        {/* 單選題 (1, 2, 3) */}
        {[1, 2, 3].includes(exerciseTypeId) && renderMCQ(exercise)}

        {/* 題組 (5-12) */}
        {exerciseTypeId >= 5 && exerciseTypeId <= 12 && renderItemSet(exercise)}
      </div>
    );
  };

  // 渲染克漏字
  const renderCloze = (exercise: Exercise) => {
    // 克漏字的文章可能在 passage 或 asset_json.passage 中
    const passageText = exercise.passage || exercise.asset_json?.passage;
    if (!passageText) return null;

    let parts: React.ReactNode[] = [];
    let text = passageText;

    // 按照 sequence 排序
    const sortedItems = [...exercise.exercise_items].sort((a, b) => a.sequence - b.sequence);

    sortedItems.forEach((item, idx) => {
      const placeholder = `{{blank_${item.sequence}}}`;
      const placeholderIndex = text.indexOf(placeholder);

      if (placeholderIndex !== -1) {
        // 加入空格前的文字
        if (placeholderIndex > 0) {
          parts.push(text.substring(0, placeholderIndex));
        }

        // 加入下拉選單
        parts.push(
          <select
            key={item.id}
            value={answers.get(item.id) ?? -1}
            onChange={(e) => handleAnswerChange(exercise.id, item.id, Number(e.target.value))}
            disabled={mode !== 'in_progress'}
            className="mx-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value={-1}>請選擇</option>
            {item.options.map((opt, optIdx) => (
              <option key={optIdx} value={optIdx}>
                {opt.text}
              </option>
            ))}
          </select>
        );

        // 更新剩餘文字
        text = text.substring(placeholderIndex + placeholder.length);
      }
    });

    // 加入剩餘文字
    if (text) {
      parts.push(text);
    }

    return (
      <div className="space-y-4">
        <div className="text-gray-900 dark:text-gray-100 leading-relaxed">
          {parts}
        </div>

        {/* 在 completed 模式顯示解答 */}
        {mode === 'completed' && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
            <div className="font-semibold text-blue-900 dark:text-blue-100 mb-2">正確答案：</div>
            {sortedItems.map((item, idx) => {
              const correctIdx = item.options.findIndex(opt => opt.is_correct);
              const userAnswer = answers.get(item.id);
              const isCorrect = userAnswer === correctIdx;

              return (
                <div key={item.id} className="mb-2">
                  <span className="font-medium">空格 {item.sequence}:</span>{' '}
                  <span className={isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                    {item.options[correctIdx]?.text}
                    {!isCorrect && userAnswer !== undefined && userAnswer !== -1 && (
                      <span className="ml-2 text-gray-600 dark:text-gray-400">
                        (你的答案: {item.options[userAnswer]?.text})
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // 渲染單選題
  const renderMCQ = (exercise: Exercise) => {
    // 單選題只有一個 exercise_item
    const item = exercise.exercise_items[0];
    if (!item) return null;

    const userAnswer = answers.get(item.id);

    // 將 {{blank}} 或 {{blank_N}} 替換成底線
    const displayQuestion = item.question?.replace(/\{\{blank(_\d+)?\}\}/g, '____') || '';

    return (
      <div className="space-y-4">
        {item.question && (
          <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {displayQuestion}
          </div>
        )}

        <div className="space-y-2">
          {item.options.map((option, idx) => {
            const isSelected = userAnswer === idx;
            const isCorrect = option.is_correct;
            const showCorrect = mode === 'completed';

            return (
              <label
                key={idx}
                className={`
                  flex items-center p-3 rounded-lg border cursor-pointer transition-colors
                  ${mode !== 'in_progress' ? 'cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}
                  ${isSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'}
                  ${showCorrect && isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : ''}
                  ${showCorrect && isSelected && !isCorrect ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}
                `}
              >
                <input
                  type="radio"
                  name={`exercise-${exercise.id}`}
                  value={idx}
                  checked={isSelected}
                  onChange={() => handleAnswerChange(exercise.id, item.id, idx)}
                  disabled={mode !== 'in_progress'}
                  className="mr-3"
                />
                <span className="flex-1 text-gray-900 dark:text-gray-100">{option.text}</span>
                {showCorrect && isCorrect && (
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 ml-2" />
                )}
                {showCorrect && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 ml-2" />
                )}
              </label>
            );
          })}
        </div>

        {/* 在 completed 模式顯示解析 */}
        {mode === 'completed' && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
            {item.options.map((option, idx) => {
              if (option.is_correct && option.why_correct) {
                return (
                  <div key={idx}>
                    <div className="font-semibold text-blue-900 dark:text-blue-100 mb-1">正確答案解析：</div>
                    <div className="text-gray-700 dark:text-gray-300">{option.why_correct}</div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>
    );
  };

  // 渲染題組
  const renderItemSet = (exercise: Exercise) => {
    // TODO: 根據不同的 exercise_type_id 使用對應的組件
    // 目前先簡單顯示

    // 題組的文章可能在 passage 或 asset_json.passage 中
    const passageText = exercise.passage || exercise.asset_json?.passage;

    return (
      <div className="space-y-4">
        {/* 顯示 passage/audio/image */}
        {passageText && (
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
            <div className="whitespace-pre-wrap text-gray-900 dark:text-gray-100">
              {passageText}
            </div>
          </div>
        )}

        {exercise.audio_url && (
          <audio controls className="w-full">
            <source src={exercise.audio_url} type="audio/mpeg" />
          </audio>
        )}

        {exercise.image_url && (
          <img src={exercise.image_url} alt="Exercise" className="max-w-full rounded" />
        )}

        {/* 顯示各個子題 */}
        <div className="space-y-6">
          {exercise.exercise_items.map((item, itemIdx) => {
            const userAnswer = answers.get(item.id);
            // 將 {{blank}} 或 {{blank_N}} 替換成底線
            const displayQuestion = item.question?.replace(/\{\{blank(_\d+)?\}\}/g, '____') || '';

            return (
              <div key={item.id} className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="text-base font-medium text-gray-900 dark:text-gray-100 mb-3">
                  {itemIdx + 1}. {displayQuestion}
                </div>

                <div className="space-y-2">
                  {item.options.map((option, optIdx) => {
                    const isSelected = userAnswer === optIdx;
                    const isCorrect = option.is_correct;
                    const showCorrect = mode === 'completed';

                    return (
                      <label
                        key={optIdx}
                        className={`
                          flex items-center p-3 rounded-lg border cursor-pointer transition-colors
                          ${mode !== 'in_progress' ? 'cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}
                          ${isSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'}
                          ${showCorrect && isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : ''}
                          ${showCorrect && isSelected && !isCorrect ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}
                        `}
                      >
                        <input
                          type="radio"
                          name={`item-${item.id}`}
                          value={optIdx}
                          checked={isSelected}
                          onChange={() => handleAnswerChange(exercise.id, item.id, optIdx)}
                          disabled={mode !== 'in_progress'}
                          className="mr-3"
                        />
                        <span className="flex-1 text-gray-900 dark:text-gray-100">{option.text}</span>
                        {showCorrect && isCorrect && (
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 ml-2" />
                        )}
                        {showCorrect && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 ml-2" />
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
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
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              試卷 #{paper.id}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>總題數: {paper.total_items}</span>
              {activeUserPaper && (
                <>
                  <span>•</span>
                  <span className={`font-semibold ${
                    mode === 'pending' ? 'text-gray-600' :
                    mode === 'in_progress' ? 'text-blue-600' :
                    mode === 'completed' ? 'text-green-600' :
                    'text-red-600'
                  }`}>
                    {mode === 'pending' && '未開始'}
                    {mode === 'in_progress' && '作答中'}
                    {mode === 'completed' && '已完成'}
                    {mode === 'abandoned' && '已放棄'}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Mode-specific header buttons */}
          <div className="mb-6">
            {mode === 'pending' && (
              <button
                onClick={handleStart}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-5 h-5" />
                開始作答
              </button>
            )}

            {mode === 'abandoned' && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-semibold">此試卷已放棄</span>
                  </div>
                  <button
                    onClick={handleRenew}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-5 h-5" />
                完成作答
              </button>
              <button
                onClick={handleAbandon}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <XCircle className="w-5 h-5" />
                放棄作答
              </button>
            </div>
          )}

          {/* Completed mode: show stats */}
          {mode === 'completed' && (
            <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2">
                  作答完成！
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  已顯示正確答案與解析
                </div>
              </div>
            </div>
          )}
        </div>
      </SidebarLayout>
    </ProtectedRoute>
  );
}
