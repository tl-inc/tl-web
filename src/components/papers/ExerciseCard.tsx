/**
 * ExerciseCard Component
 * 
 * 渲染單一題目卡片
 */

import type { Exercise } from '@/types/paper';
import { ClozeExercise } from './exercises/ClozeExercise';
import { MCQExercise } from './exercises/MCQExercise';
import { ItemSetExercise } from './exercises/ItemSetExercise';

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  answers: Map<number, number>;
  mode: 'pending' | 'in_progress' | 'completed' | 'abandoned';
  onAnswerChange: (exerciseId: number, exerciseItemId: number, answerIndex: number) => Promise<void>;
}

export function ExerciseCard({
  exercise,
  index,
  answers,
  mode,
  onAnswerChange,
}: ExerciseCardProps) {
  const exerciseTypeId = exercise.exercise_type_id;
  const exerciseTypeName = exercise.exercise_type.name;

  // 根據題型選擇對應的元件
  const renderExerciseContent = () => {
    // 克漏字 (ID: 4)
    if (exerciseTypeId === 4) {
      return (
        <ClozeExercise
          exercise={exercise}
          answers={answers}
          onAnswerChange={onAnswerChange}
          mode={mode}
        />
      );
    }

    // 單選題 (ID: 1, 2, 3)
    if ([1, 2, 3].includes(exerciseTypeId)) {
      return (
        <MCQExercise
          exercise={exercise}
          answers={answers}
          onAnswerChange={onAnswerChange}
          mode={mode}
        />
      );
    }

    // 題組 (ID: 5-12)
    if (exerciseTypeId >= 5 && exerciseTypeId <= 12) {
      return (
        <ItemSetExercise
          exercise={exercise}
          answers={answers}
          onAnswerChange={onAnswerChange}
          mode={mode}
        />
      );
    }

    return null;
  };

  return (
    <div className="p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-orange-50/80 to-amber-50/80 dark:from-orange-950/30 dark:to-amber-950/30 border-orange-200/50 dark:border-orange-700/50">
      {/* 題目標籤 */}
      <div className="mb-4">
        <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm text-gray-700 dark:text-gray-300">
          題目 {index + 1} - {exerciseTypeName}
        </span>
      </div>

      {/* 題目內容 */}
      {renderExerciseContent()}
    </div>
  );
}
