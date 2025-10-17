'use client';

import { memo, useMemo } from 'react';
import type { Exercise } from '@/types/paper';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ClozeExerciseProps {
  exercise: Exercise;
  answers: Map<number, number>;
  onAnswerChange: (exerciseId: number, itemId: number, answerIndex: number) => void;
  mode: 'pending' | 'in_progress' | 'completed' | 'abandoned';
}

export const ClozeExercise = memo(function ClozeExercise({ exercise, answers, onAnswerChange, mode }: ClozeExerciseProps) {
  const passageText = exercise.passage || exercise.asset_json?.passage;

  // Memoize sorted items to avoid re-sorting on every render
  const sortedItems = useMemo(
    () => [...exercise.exercise_items].sort((a, b) => a.sequence - b.sequence),
    [exercise.exercise_items]
  );

  // Memoize the parts generation
  const parts = useMemo(() => {
    if (!passageText) return null;

    const result: React.ReactNode[] = [];
    let text = passageText;

    sortedItems.forEach((item) => {
      const placeholder = `{{blank_${item.sequence}}}`;
      const placeholderIndex = text.indexOf(placeholder);

      if (placeholderIndex !== -1) {
        // Add text before blank
        if (placeholderIndex > 0) {
          result.push(text.substring(0, placeholderIndex));
        }

        // Add custom select dropdown with proper positioning
        const currentAnswer = answers.get(item.id);
        const valueToDisplay = currentAnswer !== undefined && currentAnswer !== -1
          ? String(currentAnswer)
          : undefined;

        result.push(
          <span key={item.id} className="inline-block align-baseline mx-0.5">
            <Select
              value={valueToDisplay}
              onValueChange={(value) => {
                onAnswerChange(exercise.id, item.id, Number(value));
              }}
              disabled={mode !== 'in_progress' && mode !== 'pending'}
            >
              <SelectTrigger
                size="sm"
                className="min-w-[120px] max-w-[180px] sm:min-w-[140px] sm:max-w-[220px] md:min-w-[160px] md:max-w-[280px] h-auto py-1 text-sm"
              >
                <SelectValue placeholder="請選擇" />
              </SelectTrigger>
              <SelectContent>
                {item.options.map((opt, optIdx) => (
                  <SelectItem key={optIdx} value={String(optIdx)}>
                    {opt.text}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </span>
        );

        // Update remaining text
        text = text.substring(placeholderIndex + placeholder.length);
      }
    });

    // Add remaining text
    if (text) {
      result.push(text);
    }

    return result;
  }, [passageText, sortedItems, answers, onAnswerChange, exercise.id, mode]);

  if (!passageText) return null;

  return (
    <div className="space-y-4">
      <div className="text-gray-900 dark:text-gray-100 leading-relaxed">
        {parts}
      </div>

      {/* Show answers in completed mode */}
      {mode === 'completed' && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
          <div className="font-semibold text-blue-900 dark:text-blue-100 mb-2">正確答案：</div>
          {sortedItems.map((item) => {
            const correctIdx = item.options.findIndex(opt => opt.is_correct);
            const userAnswer = answers.get(item.id);
            const isCorrect = userAnswer === correctIdx;
            const correctOption = item.options[correctIdx];

            return (
              <div key={item.id} className="mb-3">
                <div>
                  <span className="font-medium">空格 {item.sequence}:</span>{' '}
                  <span className={isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                    {correctOption?.text}
                    {!isCorrect && userAnswer !== undefined && userAnswer !== -1 && (
                      <span className="ml-2 text-gray-600 dark:text-gray-400">
                        (你的答案: {item.options[userAnswer]?.text})
                      </span>
                    )}
                  </span>
                </div>
                {/* Show why_correct */}
                {correctOption?.why_correct && (
                  <div className="mt-1 ml-3 p-2 bg-gray-50/80 dark:bg-gray-900/80 rounded text-xs text-green-700 dark:text-green-300">
                    <span className="font-semibold">✓ </span>{correctOption.why_correct}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});
