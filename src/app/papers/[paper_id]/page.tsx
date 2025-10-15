'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, AlertCircle, Clock, Play, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { PaperData, UserPaperResponse, UserPaperStatus, Exercise } from '@/types/paper';
import toast, { Toaster } from 'react-hot-toast';

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
      }
      return;
    }

    // 只有 in_progress 才能答題
    if (mode !== 'in_progress') return;

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
      toast.error(err instanceof Error ? err.message : '重新作答失敗');
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
      <div key={exercise.id} className="p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-orange-50/80 to-amber-50/80 dark:from-orange-950/30 dark:to-amber-950/30 border-orange-200/50 dark:border-orange-700/50">
        <div className="mb-4">
          <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm text-gray-700 dark:text-gray-300">
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
            disabled={mode !== 'in_progress' && mode !== 'pending'}
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

    const isUnanswered = userAnswer === undefined;

    return (
      <div className="space-y-4">
        {item.question && (
          <div className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 p-3 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border-l-4 border-blue-400">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                {displayQuestion}
              </div>
              {/* 未作答標記 */}
              {mode === 'completed' && isUnanswered && (
                <span className="px-3 py-1 text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded-full border border-amber-300 dark:border-amber-700 whitespace-nowrap">
                  ⚠️ 未作答
                </span>
              )}
            </div>
            {/* 顯示題目翻譯 */}
            {mode === 'completed' && item.metadata?.translation && (
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 font-normal">
                {item.metadata.translation}
              </div>
            )}
          </div>
        )}

        <div className="space-y-3">
          {item.options.map((option, idx) => {
            const isSelected = userAnswer === idx;
            const isCorrect = option.is_correct;
            const showCorrect = mode === 'completed';

            return (
              <div key={idx}>
                <label
                  className={`
                    flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all
                    ${(mode !== 'in_progress' && mode !== 'pending') ? 'cursor-not-allowed' : 'hover:shadow-md hover:scale-[1.02]'}
                    ${isSelected && !showCorrect ? 'border-blue-400 bg-gradient-to-r from-blue-50/70 to-purple-50/70 dark:from-blue-900/30 dark:to-purple-900/30 shadow-md' : 'border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70'}
                    ${showCorrect && isCorrect && !isUnanswered ? 'border-green-400 bg-gradient-to-r from-green-50/70 to-emerald-50/70 dark:from-green-900/30 dark:to-emerald-900/30 shadow-md' : ''}
                    ${showCorrect && isSelected && !isCorrect ? 'border-red-400 bg-gradient-to-r from-red-50/70 to-rose-50/70 dark:from-red-900/30 dark:to-rose-900/30 shadow-md' : ''}
                    ${showCorrect && isCorrect && isUnanswered ? 'border-green-400 bg-gradient-to-r from-green-50/70 to-emerald-50/70 dark:from-green-900/30 dark:to-emerald-900/30 shadow-md' : ''}
                  `}
                >
                  <input
                    type="radio"
                    name={`exercise-${exercise.id}`}
                    value={idx}
                    checked={isSelected}
                    onChange={() => handleAnswerChange(exercise.id, item.id, idx)}
                    disabled={mode !== 'in_progress' && mode !== 'pending'}
                    className="mr-4 w-5 h-5 accent-blue-500"
                  />
                  <span className="flex-1 text-gray-800 dark:text-gray-200 font-medium">{option.text}</span>
                  {showCorrect && isCorrect && (
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 ml-3 flex-shrink-0" />
                  )}
                  {showCorrect && isSelected && !isCorrect && (
                    <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 ml-3 flex-shrink-0" />
                  )}
                </label>
                {/* 顯示選項解析 */}
                {showCorrect && (option.why_correct || option.why_incorrect) && (
                  <div className="mt-2 ml-4 p-3 bg-gray-50/80 dark:bg-gray-800/80 rounded-lg text-sm">
                    {option.is_correct && option.why_correct && (
                      <div className="text-green-700 dark:text-green-300">
                        <span className="font-semibold">✓ </span>{option.why_correct}
                      </div>
                    )}
                    {!option.is_correct && option.why_incorrect && (
                      <div className="text-gray-600 dark:text-gray-400">
                        <span className="font-semibold">✗ </span>{option.why_incorrect}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 渲染資訊理解題的 asset_json 內容
  const renderInformationAsset = (exercise: Exercise) => {
    const asset = exercise.asset_json;
    if (!asset) return null;

    const typeId = exercise.exercise_type_id;

    // 8: 資訊理解題—菜單
    if (typeId === 8 && asset.menu) {
      return (
        <div className="p-5 bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl border border-amber-200/50 dark:border-amber-800/50">
          <h3 className="text-2xl font-bold text-center mb-5 text-amber-900 dark:text-amber-100">
            {asset.restaurant_name?.content || asset.restaurant_name}
          </h3>
          <div className="space-y-5">
            {asset.menu.beverages && (
              <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-3 text-amber-800 dark:text-amber-200 flex items-center gap-2">
                  <span className="w-1 h-5 bg-amber-500 rounded"></span>
                  Beverages
                </h4>
                {asset.menu.beverages.map((item: any, idx: number) => (
                  <div key={idx} className="ml-4 mb-3 pb-3 border-b border-amber-100 dark:border-amber-900 last:border-0">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <span className="font-medium text-gray-800 dark:text-gray-200">{item.name?.content || item.name}</span>
                        {mode === 'completed' && item.name?.translation && (
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">({item.name.translation})</span>
                        )}
                      </div>
                      <span className="font-semibold text-amber-600 dark:text-amber-400 ml-4">{item.price}</span>
                    </div>
                    {item.description && (
                      <div className="text-sm mt-1">
                        <p className="text-gray-600 dark:text-gray-400">
                          {item.description?.content || item.description}
                        </p>
                        {mode === 'completed' && item.description?.translation && (
                          <p className="text-gray-500 dark:text-gray-500 mt-1">
                            {item.description.translation}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {/* 開胃菜 */}
            {asset.menu.appetizers && (
              <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-3 text-amber-800 dark:text-amber-200 flex items-center gap-2">
                  <span className="w-1 h-5 bg-amber-500 rounded"></span>
                  Appetizers
                </h4>
                {asset.menu.appetizers.map((item: any, idx: number) => (
                  <div key={idx} className="ml-4 mb-3 pb-3 border-b border-amber-100 dark:border-amber-900 last:border-0">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <span className="font-medium text-gray-800 dark:text-gray-200">{item.name?.content || item.name}</span>
                        {mode === 'completed' && item.name?.translation && (
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">({item.name.translation})</span>
                        )}
                      </div>
                      <span className="font-semibold text-amber-600 dark:text-amber-400 ml-4">{item.price}</span>
                    </div>
                    {item.description && (
                      <div className="text-sm mt-1">
                        <p className="text-gray-600 dark:text-gray-400">
                          {item.description?.content || item.description}
                        </p>
                        {mode === 'completed' && item.description?.translation && (
                          <p className="text-gray-500 dark:text-gray-500 mt-1">
                            {item.description.translation}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {asset.menu.main_courses && (
              <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-3 text-amber-800 dark:text-amber-200 flex items-center gap-2">
                  <span className="w-1 h-5 bg-amber-500 rounded"></span>
                  Main Courses
                </h4>
                {asset.menu.main_courses.map((item: any, idx: number) => (
                  <div key={idx} className="ml-4 mb-3 pb-3 border-b border-amber-100 dark:border-amber-900 last:border-0">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <span className="font-medium text-gray-800 dark:text-gray-200">{item.name?.content || item.name}</span>
                        {mode === 'completed' && item.name?.translation && (
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">({item.name.translation})</span>
                        )}
                      </div>
                      <span className="font-semibold text-amber-600 dark:text-amber-400 ml-4">{item.price}</span>
                    </div>
                    {item.description && (
                      <div className="text-sm mt-1">
                        <p className="text-gray-600 dark:text-gray-400">
                          {item.description?.content || item.description}
                        </p>
                        {mode === 'completed' && item.description?.translation && (
                          <p className="text-gray-500 dark:text-gray-500 mt-1">
                            {item.description.translation}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {/* 甜點 */}
            {asset.menu.desserts && (
              <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-3 text-amber-800 dark:text-amber-200 flex items-center gap-2">
                  <span className="w-1 h-5 bg-amber-500 rounded"></span>
                  Desserts
                </h4>
                {asset.menu.desserts.map((item: any, idx: number) => (
                  <div key={idx} className="ml-4 mb-3 pb-3 border-b border-amber-100 dark:border-amber-900 last:border-0">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <span className="font-medium text-gray-800 dark:text-gray-200">{item.name?.content || item.name}</span>
                        {mode === 'completed' && item.name?.translation && (
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">({item.name.translation})</span>
                        )}
                      </div>
                      <span className="font-semibold text-amber-600 dark:text-amber-400 ml-4">{item.price}</span>
                    </div>
                    {item.description && (
                      <div className="text-sm mt-1">
                        <p className="text-gray-600 dark:text-gray-400">
                          {item.description?.content || item.description}
                        </p>
                        {mode === 'completed' && item.description?.translation && (
                          <p className="text-gray-500 dark:text-gray-500 mt-1">
                            {item.description.translation}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {/* 套餐組合 */}
            {asset.menu.set_meals && (
              <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-3 text-amber-800 dark:text-amber-200 flex items-center gap-2">
                  <span className="w-1 h-5 bg-amber-500 rounded"></span>
                  Set Meals
                </h4>
                {asset.menu.set_meals.map((meal: any, idx: number) => (
                  <div key={idx} className="ml-4 mb-3 pb-3 border-b border-amber-100 dark:border-amber-900 last:border-0">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <span className="font-medium text-gray-800 dark:text-gray-200">{meal.name?.content || meal.name}</span>
                        {mode === 'completed' && meal.name?.translation && (
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">({meal.name.translation})</span>
                        )}
                      </div>
                      <span className="font-semibold text-amber-600 dark:text-amber-400 ml-4">{meal.price}</span>
                    </div>
                    {meal.items && (
                      <div className="mt-2 ml-2">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {meal.items.map((item: any, itemIdx: number) => (
                            <div key={itemIdx}>
                              • {item?.content || item}
                              {mode === 'completed' && item?.translation && (
                                <span className="text-gray-500 dark:text-gray-500 ml-1">({item.translation})</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {/* 優惠方案 */}
            {asset.menu.promotions && (
              <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg border-2 border-amber-400 dark:border-amber-600">
                <h4 className="font-semibold text-lg mb-3 text-amber-800 dark:text-amber-200 flex items-center gap-2">
                  <span className="text-xl">🎉</span>
                  Promotions
                </h4>
                {asset.menu.promotions.map((promo: any, idx: number) => (
                  <div key={idx} className="ml-4 mb-2 last:mb-0">
                    <p className="text-gray-700 dark:text-gray-300">
                      {promo.description?.content || promo.description}
                    </p>
                    {mode === 'completed' && promo.description?.translation && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {promo.description.translation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
            {/* 營業時間 */}
            {asset.menu.business_hours && (
              <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-2 text-amber-800 dark:text-amber-200 flex items-center gap-2">
                  <span className="text-xl">🕒</span>
                  Business Hours
                </h4>
                <p className="ml-4 text-gray-700 dark:text-gray-300">
                  {asset.menu.business_hours?.content || asset.menu.business_hours}
                </p>
                {mode === 'completed' && asset.menu.business_hours?.translation && (
                  <p className="ml-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {asset.menu.business_hours.translation}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    // 9: 資訊理解題—通知單
    if (typeId === 9 && asset.notice) {
      return (
        <div className="p-5 bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl border border-indigo-200/50 dark:border-indigo-800/50">
          <div className="border-l-4 border-indigo-500 pl-4 mb-4">
            <h3 className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
              {asset.notice.title?.content || asset.notice.title}
            </h3>
            {mode === 'completed' && asset.notice.title?.translation && (
              <p className="text-base text-indigo-600 dark:text-indigo-400 mt-1">
                {asset.notice.title.translation}
              </p>
            )}
          </div>
          <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg space-y-3">
            {asset.notice.date_time && (
              <div className="flex items-start gap-2">
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold min-w-[100px]">📅 Date & Time:</span>
                <div className="flex-1">
                  <span className="text-gray-700 dark:text-gray-300">{asset.notice.date_time?.content || asset.notice.date_time}</span>
                  {mode === 'completed' && asset.notice.date_time?.translation && (
                    <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">{asset.notice.date_time.translation}</span>
                  )}
                </div>
              </div>
            )}
            {asset.notice.location && (
              <div className="flex items-start gap-2">
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold min-w-[100px]">📍 Location:</span>
                <div className="flex-1">
                  <span className="text-gray-700 dark:text-gray-300">{asset.notice.location?.content || asset.notice.location}</span>
                  {mode === 'completed' && asset.notice.location?.translation && (
                    <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">{asset.notice.location.translation}</span>
                  )}
                </div>
              </div>
            )}
            <div className="pt-3 border-t border-indigo-100 dark:border-indigo-900">
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                {asset.notice.description?.content || asset.notice.description || asset.notice.content?.content || asset.notice.content}
              </p>
              {mode === 'completed' && (asset.notice.description?.translation || asset.notice.content?.translation) && (
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed mt-2">
                  {asset.notice.description?.translation || asset.notice.content?.translation}
                </p>
              )}
            </div>
            {asset.notice.participant_info && (
              <div className="flex items-start gap-2 pt-3 border-t border-indigo-100 dark:border-indigo-900">
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold min-w-[100px]">👥 Participants:</span>
                <div className="flex-1">
                  <span className="text-gray-700 dark:text-gray-300">{asset.notice.participant_info?.content || asset.notice.participant_info}</span>
                  {mode === 'completed' && asset.notice.participant_info?.translation && (
                    <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">{asset.notice.participant_info.translation}</span>
                  )}
                </div>
              </div>
            )}
            {asset.notice.fee_info && (
              <div className="flex items-start gap-2 pt-3 border-t border-indigo-100 dark:border-indigo-900">
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold min-w-[100px]">💰 Fee:</span>
                <div className="flex-1">
                  <span className="text-gray-700 dark:text-gray-300">{asset.notice.fee_info?.content || asset.notice.fee_info}</span>
                  {mode === 'completed' && asset.notice.fee_info?.translation && (
                    <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">{asset.notice.fee_info.translation}</span>
                  )}
                </div>
              </div>
            )}
            {asset.notice.contact_info && (
              <div className="flex items-start gap-2 pt-3 border-t border-indigo-100 dark:border-indigo-900">
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold min-w-[100px]">📞 Contact:</span>
                <div className="flex-1">
                  <span className="text-gray-700 dark:text-gray-300">{asset.notice.contact_info?.content || asset.notice.contact_info}</span>
                  {mode === 'completed' && asset.notice.contact_info?.translation && (
                    <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">{asset.notice.contact_info.translation}</span>
                  )}
                </div>
              </div>
            )}
            {asset.notice.requirements && (
              <div className="flex items-start gap-2 pt-3 border-t border-indigo-100 dark:border-indigo-900">
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold min-w-[100px]">✅ Requirements:</span>
                <div className="flex-1">
                  <span className="text-gray-700 dark:text-gray-300">{asset.notice.requirements?.content || asset.notice.requirements}</span>
                  {mode === 'completed' && asset.notice.requirements?.translation && (
                    <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">{asset.notice.requirements.translation}</span>
                  )}
                </div>
              </div>
            )}
            {asset.notice.deadline && (
              <div className="flex items-start gap-2 pt-3 border-t border-indigo-100 dark:border-indigo-900">
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold min-w-[100px]">⏰ Deadline:</span>
                <div className="flex-1">
                  <span className="text-gray-700 dark:text-gray-300">{asset.notice.deadline?.content || asset.notice.deadline}</span>
                  {mode === 'completed' && asset.notice.deadline?.translation && (
                    <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">{asset.notice.deadline.translation}</span>
                  )}
                </div>
              </div>
            )}
            {asset.organizer && (
              <div className="flex items-start gap-2 pt-2 border-t border-indigo-100 dark:border-indigo-900">
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold min-w-[100px]">👤 Organizer:</span>
                <div className="flex-1">
                  <span className="text-gray-700 dark:text-gray-300">{asset.organizer?.content || asset.organizer}</span>
                  {mode === 'completed' && asset.organizer?.translation && (
                    <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">{asset.organizer.translation}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // 10: 資訊理解題—時刻表
    if (typeId === 10 && asset.timetable) {
      const schedule = asset.timetable.schedule || [];
      const locations = asset.timetable.locations || [];
      const routeName = asset.timetable.route_name?.content || asset.timetable.route_name;

      return (
        <div className="p-5 bg-gradient-to-br from-sky-50/80 to-blue-50/80 dark:from-sky-950/30 dark:to-blue-950/30 rounded-xl border border-sky-200/50 dark:border-sky-800/50">
          <div className="mb-2">
            <h3 className="text-2xl font-bold text-sky-900 dark:text-sky-100">
              {asset.title?.content || asset.title || 'Schedule'}
            </h3>
            {mode === 'completed' && asset.title?.translation && (
              <p className="text-base text-sky-600 dark:text-sky-400 mt-1">
                {asset.title.translation}
              </p>
            )}
          </div>
          {routeName && (
            <div className="text-sm mb-4 flex items-center gap-2">
              <span className="text-lg">🚌</span>
              <div>
                <span className="text-sky-600 dark:text-sky-400">{routeName}</span>
                {mode === 'completed' && asset.timetable.route_name?.translation && (
                  <span className="block text-gray-500 dark:text-gray-400 text-xs mt-0.5">{asset.timetable.route_name.translation}</span>
                )}
              </div>
            </div>
          )}

          {/* 注意事項 */}
          {asset.timetable.notes && (
            <div className="mb-4 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg border-l-4 border-amber-500">
              <div className="text-sm font-semibold text-amber-700 dark:text-amber-300 mb-1 flex items-center gap-2">
                <span>⚠️</span>
                <span>Notes</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                {asset.timetable.notes?.content || asset.timetable.notes}
              </p>
              {mode === 'completed' && asset.timetable.notes?.translation && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                  {asset.timetable.notes.translation}
                </p>
              )}
            </div>
          )}

          <div className="space-y-3">
            {schedule.map((trip: any, idx: number) => (
              <div key={idx} className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-lg border-l-4 border-sky-500">
                <div className="font-bold text-sky-700 dark:text-sky-300 mb-2 flex items-center gap-2">
                  <span className="bg-sky-500 text-white px-2 py-0.5 rounded text-sm">{trip.time}</span>
                  {/* Price */}
                  {trip.price && (
                    <span className="ml-auto text-sm font-semibold text-sky-600 dark:text-sky-400">
                      💵 {trip.price?.content || trip.price}
                      {mode === 'completed' && trip.price?.translation && (
                        <span className="text-gray-500 dark:text-gray-400 ml-2">({trip.price.translation})</span>
                      )}
                    </span>
                  )}
                </div>

                {/* 總行程時間 */}
                {trip.duration && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
                    <span>⏱️</span>
                    <span>{trip.duration?.content || trip.duration}</span>
                    {mode === 'completed' && trip.duration?.translation && (
                      <span className="text-gray-500 dark:text-gray-400">({trip.duration.translation})</span>
                    )}
                  </div>
                )}

                {trip.stops && trip.stops.map((stop: any, stopIdx: number) => {
                  const location = locations[stop.location_index];
                  return (
                    <div key={stopIdx} className="flex items-center gap-3 ml-2 mb-2 last:mb-0">
                      <div className="w-2 h-2 rounded-full bg-sky-400"></div>
                      <span className="text-sm font-medium text-sky-600 dark:text-sky-400 min-w-[80px]">{stop.arrival_time}</span>
                      <div className="flex-1">
                        <span className="text-gray-700 dark:text-gray-300">{location?.name?.content || location?.name}</span>
                        {mode === 'completed' && location?.name?.translation && (
                          <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">{location.name.translation}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* 轉乘資訊 */}
          {asset.timetable.transfer_info && (
            <div className="mt-4 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg border-l-4 border-sky-500">
              <div className="text-sm font-semibold text-sky-700 dark:text-sky-300 mb-1 flex items-center gap-2">
                <span>🔄</span>
                <span>Transfer Information</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                {asset.timetable.transfer_info?.content || asset.timetable.transfer_info}
              </p>
              {mode === 'completed' && asset.timetable.transfer_info?.translation && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                  {asset.timetable.transfer_info.translation}
                </p>
              )}
            </div>
          )}
        </div>
      );
    }

    // 11: 資訊理解題—廣告
    if (typeId === 11 && asset.advertisement) {
      return (
        <div className="p-5 bg-gradient-to-br from-rose-50/80 to-pink-50/80 dark:from-rose-950/30 dark:to-pink-950/30 rounded-xl border border-rose-200/50 dark:border-rose-800/50">
          <div className="text-center mb-4">
            {/* 產品名稱 */}
            {asset.product_name && (
              <div className="mb-2">
                <h3 className="text-2xl font-bold text-rose-900 dark:text-rose-100">
                  {asset.product_name?.content || asset.product_name}
                </h3>
                {mode === 'completed' && asset.product_name?.translation && (
                  <p className="text-base text-rose-600 dark:text-rose-400 mt-1">
                    {asset.product_name.translation}
                  </p>
                )}
              </div>
            )}
            {/* 廣告標語 */}
            {asset.advertisement.headline && (
              <div className="mb-3">
                <p className="text-lg font-semibold text-rose-700 dark:text-rose-300 italic">
                  {asset.advertisement.headline?.content || asset.advertisement.headline}
                </p>
                {mode === 'completed' && asset.advertisement.headline?.translation && (
                  <p className="text-sm text-rose-500 dark:text-rose-400 mt-1 italic">
                    {asset.advertisement.headline.translation}
                  </p>
                )}
              </div>
            )}
            {asset.advertisement.price && (
              <div className="inline-block bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-2 rounded-full mt-2">
                <span className="text-3xl font-bold">{asset.advertisement.price}</span>
              </div>
            )}
          </div>
          <div className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-lg space-y-3">
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
              {asset.advertisement.description?.content || asset.advertisement.description}
            </p>
            {mode === 'completed' && asset.advertisement.description?.translation && (
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">
                {asset.advertisement.description.translation}
              </p>
            )}

            {/* Time Info */}
            {asset.advertisement.time_info && (
              <div className="flex items-start gap-2 pt-2 border-t border-rose-100 dark:border-rose-900">
                <span className="text-rose-600 dark:text-rose-400 font-semibold min-w-[24px]">🕒</span>
                <div className="flex-1">
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {asset.advertisement.time_info?.content || asset.advertisement.time_info}
                  </p>
                  {mode === 'completed' && asset.advertisement.time_info?.translation && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      {asset.advertisement.time_info.translation}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Location */}
            {asset.advertisement.location && (
              <div className="flex items-start gap-2 pt-2 border-t border-rose-100 dark:border-rose-900">
                <span className="text-rose-600 dark:text-rose-400 font-semibold min-w-[24px]">📍</span>
                <div className="flex-1">
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {asset.advertisement.location?.content || asset.advertisement.location}
                  </p>
                  {mode === 'completed' && asset.advertisement.location?.translation && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      {asset.advertisement.location.translation}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Contact Info */}
            {asset.advertisement.contact_info && (
              <div className="flex items-start gap-2 pt-2 border-t border-rose-100 dark:border-rose-900">
                <span className="text-rose-600 dark:text-rose-400 font-semibold min-w-[24px]">📞</span>
                <div className="flex-1">
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {asset.advertisement.contact_info?.content || asset.advertisement.contact_info}
                  </p>
                  {mode === 'completed' && asset.advertisement.contact_info?.translation && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      {asset.advertisement.contact_info.translation}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Discount Info */}
            {asset.advertisement.discount_info && (
              <div className="mt-3 p-3 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-lg border-l-4 border-amber-500">
                <p className="font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-2">
                  <span className="text-xl">💰</span>
                  {asset.advertisement.discount_info?.content || asset.advertisement.discount_info}
                </p>
                {mode === 'completed' && asset.advertisement.discount_info?.translation && (
                  <p className="text-amber-600 dark:text-amber-400 ml-7 mt-1">
                    {asset.advertisement.discount_info.translation}
                  </p>
                )}
              </div>
            )}

            {/* Promotional Text */}
            {asset.advertisement.promotional_text && (
              <div className="mt-3 p-3 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-lg border-l-4 border-orange-500">
                <p className="font-semibold text-orange-700 dark:text-orange-300 flex items-center gap-2">
                  <span className="text-xl">🎉</span>
                  {asset.advertisement.promotional_text?.content || asset.advertisement.promotional_text}
                </p>
                {mode === 'completed' && asset.advertisement.promotional_text?.translation && (
                  <p className="text-orange-600 dark:text-orange-400 ml-7 mt-1">
                    {asset.advertisement.promotional_text.translation}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    // 12: 資訊理解題—對話
    if (typeId === 12 && asset.dialogue) {
      const turns = asset.dialogue.turns || [];
      const speakers = asset.dialogue.speakers || [];

      return (
        <div className="p-5 bg-gradient-to-br from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl border border-emerald-200/50 dark:border-emerald-800/50">
          {/* Scenario */}
          {asset.scenario && (
            <div className="mb-4 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg border-l-4 border-emerald-500">
              <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-1">💬 Scenario</div>
              <p className="text-gray-700 dark:text-gray-300">
                {asset.scenario?.content || asset.scenario}
              </p>
              {mode === 'completed' && asset.scenario?.translation && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  {asset.scenario.translation}
                </p>
              )}
            </div>
          )}
          <div className="space-y-3">
            {turns.map((turn: any, idx: number) => {
              const speaker = speakers[turn.speaker_index];
              const speakerName = speaker?.name?.content || speaker?.name || `Speaker ${turn.speaker_index + 1}`;
              const speakerNameTranslation = speaker?.name?.translation;
              const speakerRole = speaker?.role?.content || speaker?.role;
              const speakerRoleTranslation = speaker?.role?.translation;
              const text = turn.text?.content || turn.text || turn.message?.content || turn.message;
              const textTranslation = turn.text?.translation || turn.message?.translation;

              return (
                <div key={idx} className={`flex gap-3 ${turn.speaker_index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] ${turn.speaker_index % 2 === 0 ? 'bg-white/70 dark:bg-gray-800/70' : 'bg-emerald-100/70 dark:bg-emerald-900/30'} p-3 rounded-lg`}>
                    <div className={`font-semibold text-sm mb-1 ${turn.speaker_index % 2 === 0 ? 'text-gray-600 dark:text-gray-400' : 'text-emerald-700 dark:text-emerald-300'}`}>
                      {speakerName}
                      {mode === 'completed' && speakerNameTranslation && (
                        <span className="font-normal text-xs ml-1">({speakerNameTranslation})</span>
                      )}
                      {speakerRole && (
                        <span className="font-normal text-xs ml-2 opacity-70">
                          - {speakerRole}
                          {mode === 'completed' && speakerRoleTranslation && (
                            <span> ({speakerRoleTranslation})</span>
                          )}
                        </span>
                      )}
                    </div>
                    <div className="text-gray-800 dark:text-gray-200">
                      {text}
                    </div>
                    {mode === 'completed' && textTranslation && (
                      <div className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        {textTranslation}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return null;
  };

  // 渲染題組
  const renderItemSet = (exercise: Exercise) => {
    // TODO: 根據不同的 exercise_type_id 使用對應的組件
    // 目前先簡單顯示

    // 題組的文章可能在 passage 或 asset_json.passage 中
    const passageText = exercise.passage || exercise.asset_json?.passage;

    // 圖片 URL 可能在 image_url 或 asset_json.image_url 中
    const imageUrl = exercise.image_url || exercise.asset_json?.image_url;

    // 音訊 URL 可能在 audio_url 或 asset_json.audio_url 中
    const audioUrl = exercise.audio_url || exercise.asset_json?.audio_url;

    // 聽力測驗 (exercise_type_id = 7) 的逐字稿只在結算模式顯示
    const isListening = exercise.exercise_type_id === 7;
    const shouldShowPassage = passageText && (!isListening || mode === 'completed');

    // 資訊理解題 (8-12) 需要渲染 asset_json
    const isInformationReading = exercise.exercise_type_id >= 8 && exercise.exercise_type_id <= 12;

    return (
      <div className="space-y-4">
        {/* 顯示圖片 */}
        {imageUrl && (
          <div className="flex justify-center">
            <img src={imageUrl} alt="Exercise" className="max-w-full rounded-lg shadow-lg" />
          </div>
        )}

        {/* 顯示音訊 */}
        {audioUrl && (
          <audio controls className="w-full">
            <source src={audioUrl} type="audio/mpeg" />
          </audio>
        )}

        {/* 顯示資訊理解題內容 (8-12) */}
        {isInformationReading && renderInformationAsset(exercise)}

        {/* 顯示文章（聽力測驗的逐字稿只在結算模式顯示，資訊理解題不顯示） */}
        {!isInformationReading && shouldShowPassage && (
          <div className="p-5 bg-gradient-to-br from-slate-50/80 to-gray-50/80 dark:from-slate-950/30 dark:to-gray-950/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
            <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">
              {passageText}
            </div>
            {/* 顯示段落翻譯（克漏字、聽力測驗） */}
            {mode === 'completed' && exercise.asset_json?.translation && (
              <div className="mt-4 pt-4 border-t border-slate-300/50 dark:border-slate-600/50 whitespace-pre-wrap text-gray-600 dark:text-gray-400 leading-relaxed">
                {exercise.asset_json.translation}
              </div>
            )}
          </div>
        )}

        {/* 顯示各個子題 */}
        <div className="space-y-5">
          {exercise.exercise_items.map((item, itemIdx) => {
            const userAnswer = answers.get(item.id);
            // 將 {{blank}} 或 {{blank_N}} 替換成底線
            const displayQuestion = item.question?.replace(/\{\{blank(_\d+)?\}\}/g, '____') || '';

            const isUnanswered = userAnswer === undefined;

            return (
              <div key={item.id} className="bg-white/40 dark:bg-gray-800/40 p-4 rounded-lg">
                <div className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-start gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm flex-shrink-0">
                    {itemIdx + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1">{displayQuestion}</div>
                      {/* 未作答標記 */}
                      {mode === 'completed' && isUnanswered && (
                        <span className="px-2 py-1 text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded-full border border-amber-300 dark:border-amber-700 whitespace-nowrap">
                          ⚠️ 未作答
                        </span>
                      )}
                    </div>
                    {/* 顯示題目翻譯 */}
                    {mode === 'completed' && item.metadata?.translation && (
                      <div className="mt-1 text-sm text-gray-600 dark:text-gray-400 font-normal">
                        {item.metadata.translation}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2 ml-8">
                  {item.options.map((option, optIdx) => {
                    const isSelected = userAnswer === optIdx;
                    const isCorrect = option.is_correct;
                    const showCorrect = mode === 'completed';

                    return (
                      <div key={optIdx}>
                        <label
                          className={`
                            flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all
                            ${(mode !== 'in_progress' && mode !== 'pending') ? 'cursor-not-allowed' : 'hover:shadow-md hover:scale-[1.01]'}
                            ${isSelected && !showCorrect ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-900/20 shadow-sm' : 'border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60'}
                            ${showCorrect && isCorrect && !isUnanswered ? 'border-green-400 bg-green-50/50 dark:bg-green-900/20 shadow-sm' : ''}
                            ${showCorrect && isSelected && !isCorrect ? 'border-red-400 bg-red-50/50 dark:bg-red-900/20 shadow-sm' : ''}
                            ${showCorrect && isCorrect && isUnanswered ? 'border-green-400 bg-green-50/50 dark:bg-green-900/20 shadow-sm' : ''}
                          `}
                        >
                          <input
                            type="radio"
                            name={`item-${item.id}`}
                            value={optIdx}
                            checked={isSelected}
                            onChange={() => handleAnswerChange(exercise.id, item.id, optIdx)}
                            disabled={mode !== 'in_progress' && mode !== 'pending'}
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
                        {/* 顯示選項解析（克漏字只顯示正確答案的解析） */}
                        {showCorrect && option.is_correct && option.why_correct && (
                          <div className="mt-2 ml-3 p-2 bg-gray-50/80 dark:bg-gray-900/80 rounded text-xs">
                            <div className="text-green-700 dark:text-green-300">
                              <span className="font-semibold">✓ </span>{option.why_correct}
                            </div>
                          </div>
                        )}
                      </div>
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
