'use client';

import type { Exercise } from '@/types/paper';

interface ClozeExerciseProps {
  exercise: Exercise;
  answers: Map<number, number>;
  onAnswerChange: (exerciseId: number, itemId: number, answerIndex: number) => void;
  mode: 'pending' | 'in_progress' | 'completed' | 'abandoned';
}

export function ClozeExercise({ exercise, answers, onAnswerChange, mode }: ClozeExerciseProps) {
  const passageText = exercise.passage || exercise.asset_json?.passage;
  if (!passageText) return null;

  const parts: React.ReactNode[] = [];
  let text = passageText;

  // Sort by sequence
  const sortedItems = [...exercise.exercise_items].sort((a, b) => a.sequence - b.sequence);

  sortedItems.forEach((item) => {
    const placeholder = `{{blank_${item.sequence}}}`;
    const placeholderIndex = text.indexOf(placeholder);

    if (placeholderIndex !== -1) {
      // Add text before blank
      if (placeholderIndex > 0) {
        parts.push(text.substring(0, placeholderIndex));
      }

      // Add dropdown
      parts.push(
        <select
          key={item.id}
          value={answers.get(item.id) ?? -1}
          onChange={(e) => onAnswerChange(exercise.id, item.id, Number(e.target.value))}
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

      // Update remaining text
      text = text.substring(placeholderIndex + placeholder.length);
    }
  });

  // Add remaining text
  if (text) {
    parts.push(text);
  }

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
}
