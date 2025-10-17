'use client';

import { X, Check, Circle, AlertCircle, Bookmark, Filter, AlertTriangle } from 'lucide-react';
import { useMemo, useState, useCallback } from 'react';
import { usePaperStore } from '@/stores/usePaperStore';
import type { Exercise } from '@/types/paper';

type FilterType = 'all' | 'unanswered' | 'answered' | 'correct' | 'incorrect' | 'marked';

/**
 * NavigationPanel 組件
 * 顯示題目導航列表，根據模式顯示不同資訊
 */
export default function NavigationPanel() {
  const paper = usePaperStore((state) => state.paper);
  const mode = usePaperStore((state) => state.mode);
  const answers = usePaperStore((state) => state.answers);
  const currentExerciseIndex = usePaperStore((state) => state.currentExerciseIndex);
  const jumpToExercise = usePaperStore((state) => state.jumpToExercise);
  const toggleNavigationPanel = usePaperStore((state) => state.toggleNavigationPanel);
  const markedExercises = usePaperStore((state) => state.markedExercises);

  const [filter, setFilter] = useState<FilterType>('all');

  // 計算各題狀態
  const getExerciseStatus = useCallback((exercise: Exercise) => {
    const items = exercise.exercise_items;
    const answeredItems = items.filter((item) => answers.has(item.id));
    const answeredCount = answeredItems.length;
    const totalCount = items.length;

    // pending / in_progress: 只顯示答題進度，不顯示正確性
    if (mode === 'pending' || mode === 'in_progress') {
      if (answeredCount === 0) {
        return {
          status: 'unanswered' as const,
          color: 'gray',
          icon: null,
          label: '未答',
        };
      } else if (answeredCount === totalCount) {
        return {
          status: 'answered' as const,
          color: 'blue',
          icon: <Check className="h-4 w-4 text-blue-500" />,
          label: '已答',
        };
      } else {
        return {
          status: 'partial' as const,
          color: 'blue',
          icon: <Circle className="h-4 w-4 text-blue-400" />,
          label: '部分',
        };
      }
    }

    // completed / abandoned: 顯示答題結果
    if (answeredCount === 0) {
      return {
        status: 'unanswered' as const,
        color: 'amber',
        icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
        label: '未答',
      };
    }

    // 計算正確率
    let correctCount = 0;
    answeredItems.forEach((item) => {
      const userAnswer = answers.get(item.id);
      if (userAnswer !== undefined) {
        const selectedOption = item.options[userAnswer];
        if (selectedOption && selectedOption.is_correct) {
          correctCount++;
        }
      }
    });

    if (correctCount === answeredCount) {
      return {
        status: 'all_correct' as const,
        color: 'green',
        icon: <Check className="h-4 w-4 text-green-500" />,
        label: '正確',
      };
    } else if (correctCount === 0) {
      return {
        status: 'all_wrong' as const,
        color: 'red',
        icon: <X className="h-4 w-4 text-red-500" />,
        label: '錯誤',
      };
    } else {
      return {
        status: 'partial_correct' as const,
        color: 'yellow',
        icon: <AlertCircle className="h-4 w-4 text-yellow-500" />,
        label: '部分正確',
      };
    }
  }, [answers, mode]);

  // 篩選題目
  const filteredExercises = useMemo(() => {
    if (!paper) return [];
    return paper.exercises
      .map((exercise, index) => ({
        exercise,
        index,
        status: getExerciseStatus(exercise),
        isMarked: markedExercises.has(exercise.id),
      }))
      .filter((item) => {
        if (filter === 'all') return true;
        if (filter === 'marked') return item.isMarked;

        const { status } = item.status;

        if (mode === 'pending' || mode === 'in_progress') {
          // in_progress: 只有 unanswered / answered / partial
          if (filter === 'unanswered') return status === 'unanswered';
          if (filter === 'answered') return status === 'answered' || status === 'partial';
          return true;
        } else {
          // completed / abandoned: 可以按正確性篩選
          if (filter === 'unanswered') return status === 'unanswered';
          if (filter === 'answered')
            return status !== 'unanswered';
          if (filter === 'correct') return status === 'all_correct';
          if (filter === 'incorrect')
            return status === 'all_wrong' || status === 'partial_correct';
          return true;
        }
      });
  }, [paper, filter, mode, answers, markedExercises, getExerciseStatus]);

  // 統計
  const stats = useMemo(() => {
    if (!paper) return { total: 0, answered: 0, correct: 0 };
    const total = paper.exercises.length;
    let answered = 0;
    let correct = 0;

    paper.exercises.forEach((exercise) => {
      const status = getExerciseStatus(exercise);
      if (status.status !== 'unanswered') {
        answered++;
      }
      if (status.status === 'all_correct') {
        correct++;
      }
    });

    return { total, answered, correct };
  }, [paper, getExerciseStatus]);

  // 可用的篩選選項
  const availableFilters = useMemo(() => {
    const base: FilterType[] = ['all', 'unanswered', 'answered', 'marked'];
    if (mode === 'completed' || mode === 'abandoned') {
      return [...base, 'correct', 'incorrect'];
    }
    return base;
  }, [mode]);

  const filterLabels: Record<FilterType, string> = {
    all: '全部',
    unanswered: '未答',
    answered: '已答',
    correct: '答對',
    incorrect: '答錯',
    marked: '已標記',
  };

  if (!paper) return null;

  return (
    <div className="flex h-full flex-col bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100">題目導航</h3>
        <button
          onClick={toggleNavigationPanel}
          className="cursor-pointer rounded-lg p-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="關閉導航面板"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Stats */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3">
        <div className="flex items-center justify-between text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">進度：</span>
            <span className="font-semibold text-gray-800 dark:text-gray-100">
              {stats.answered} / {stats.total}
            </span>
          </div>
          {(mode === 'completed' || mode === 'abandoned') && (
            <div>
              <span className="text-gray-600 dark:text-gray-400">正確率：</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center gap-1 text-xs">
          <Filter className="h-3 w-3 text-gray-400 dark:text-gray-500" />
          {availableFilters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`cursor-pointer rounded px-2 py-1 transition-colors ${
                filter === f
                  ? 'bg-blue-500 dark:bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {filterLabels[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise List */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        <div className="space-y-1">
          {filteredExercises.map(({ exercise, index, status, isMarked }) => (
            <button
              key={exercise.id}
              onClick={() => {
                jumpToExercise(index);
                toggleNavigationPanel(); // 自動收起導覽面板
              }}
              className={`cursor-pointer flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                index === currentExerciseIndex
                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="font-semibold text-gray-700 dark:text-gray-300">#{index + 1}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {status.icon}
                  <span className="text-sm text-gray-600 dark:text-gray-400">{status.label}</span>
                  {isMarked && <Bookmark className="h-3 w-3 fill-yellow-500 dark:fill-yellow-400 text-yellow-500 dark:text-yellow-400" />}
                </div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-500">{exercise.exercise_items.length}小題</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-center text-xs text-gray-500 dark:text-gray-400">
        {mode === 'in_progress' || mode === 'pending' ? (
          <p>作答中不顯示正確性</p>
        ) : (
          <p>點擊題目快速跳轉</p>
        )}
      </div>
    </div>
  );
}
