'use client';

import { memo, useMemo } from 'react';
import type { Exercise } from '@/types/paper';
import { CheckCircle, XCircle } from 'lucide-react';
import { StructuredText, findHighlightedIndices } from './StructuredText';
import { UnansweredBadge } from '@/components/common/UnansweredBadge';
import { AnswerFeedback } from '@/components/common/AnswerFeedback';

interface MCQExerciseProps {
  exercise: Exercise;
  answers: Map<number, number>;
  onAnswerChange: (exerciseId: number, itemId: number, answerIndex: number) => void;
  mode: 'pending' | 'in_progress' | 'completed' | 'abandoned';
}

export const MCQExercise = memo(function MCQExercise({ exercise, answers, onAnswerChange, mode }: MCQExerciseProps) {
  const item = exercise.exercise_items[0];

  // Memoize display question - must be before early return to follow hooks rules
  const displayQuestion = useMemo(
    () => item?.question?.replace(/\{\{blank(_\d+)?\}\}/g, '____') || '',
    [item?.question]
  );

  // Calculate variables that depend on item - must be before early return
  const userAnswer = item ? answers.get(item.id) : undefined;
  const isUnanswered = userAnswer === undefined;
  const showCorrect = mode === 'completed';
  const hasStructuredBreakdown = item?.metadata?.structured_breakdown && item.metadata.structured_breakdown.length > 0;

  // 計算需要 highlight 的索引 - must be before early return to follow hooks rules
  const highlightedIndices = useMemo(() => {
    if (!item || !showCorrect || !hasStructuredBreakdown) return undefined;

    // 找出正確答案
    const correctOption = item.options.find(opt => opt.is_correct);
    if (!correctOption) return undefined;

    return findHighlightedIndices(
      item.metadata!.structured_breakdown!,
      [correctOption.text]
    );
  }, [item, showCorrect, hasStructuredBreakdown]);

  if (!item) return null;

  return (
    <div className="space-y-4">
      {item.question && (
        <div className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 p-3 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border-l-4 border-blue-400">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              {/* 作答模式:顯示原文 (有挖洞) */}
              {!showCorrect && displayQuestion}

              {/* 公布答案模式:顯示結構化文本 (完整句子,highlight 正確答案) */}
              {showCorrect && hasStructuredBreakdown && (
                <StructuredText
                  breakdown={item.metadata!.structured_breakdown!}
                  highlightedIndices={highlightedIndices}
                />
              )}

              {/* 沒有結構化文本時的 fallback */}
              {showCorrect && !hasStructuredBreakdown && displayQuestion}
            </div>
            {/* Unanswered badge */}
            {showCorrect && isUnanswered && <UnansweredBadge />}
          </div>
          {/* Show translation */}
          {showCorrect && item.metadata?.translation && (
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
                  onChange={() => onAnswerChange(exercise.id, item.id, idx)}
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
              {/* Show explanation */}
              {showCorrect && option.is_correct && option.why_correct && (
                <AnswerFeedback
                  type="correct"
                  message={option.why_correct}
                />
              )}
              {showCorrect && !option.is_correct && option.why_incorrect && (
                <AnswerFeedback
                  type="incorrect"
                  message={option.why_incorrect}
                  variant="info"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});
