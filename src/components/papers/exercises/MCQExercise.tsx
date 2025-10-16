'use client';

import { memo, useMemo } from 'react';
import type { Exercise } from '@/types/paper';
import { CheckCircle, XCircle } from 'lucide-react';

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

  if (!item) return null;

  const userAnswer = answers.get(item.id);
  const isUnanswered = userAnswer === undefined;
  const showCorrect = mode === 'completed';

  return (
    <div className="space-y-4">
      {item.question && (
        <div className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 p-3 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border-l-4 border-blue-400">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              {displayQuestion}
            </div>
            {/* Unanswered badge */}
            {showCorrect && isUnanswered && (
              <span className="px-3 py-1 text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded-full border border-amber-300 dark:border-amber-700 whitespace-nowrap">
                ⚠️ 未作答
              </span>
            )}
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
});
