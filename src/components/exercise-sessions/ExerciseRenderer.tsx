'use client';

import { memo } from 'react';
import type { ExerciseContent } from '@/types/exerciseSession';
import type { Exercise } from '@/types/paper';
import { MCQExercise } from '@/components/papers/exercises/MCQExercise';
import { ClozeExercise } from '@/components/papers/exercises/ClozeExercise';

interface ExerciseRendererProps {
  question: ExerciseContent;
  answer: Record<string, unknown>;
  onAnswerChange: (answer: Record<string, unknown>) => void;
  disabled?: boolean;
}

/**
 * ExerciseRenderer - 適配器元件，將 ExerciseContent 轉換為 Exercise 格式
 *
 * 用途：複用 papers 模組的渲染元件 (MCQExercise, ClozeExercise)
 *
 * 類型對應：
 * - exercise_type_id 1 (字彙) -> MCQExercise
 * - exercise_type_id 2 (片語) -> MCQExercise
 * - exercise_type_id 3 (文法) -> ClozeExercise
 */
export const ExerciseRenderer = memo(function ExerciseRenderer({
  question,
  answer,
  onAnswerChange,
  disabled = false,
}: ExerciseRendererProps) {
  const typeId = question.exercise_type.id;

  // 將 ExerciseContent.content 轉換為 Exercise 格式
  // 注意：後端返回的格式與 papers 的格式不同，需要特殊處理

  // 對於單字題（類型1）和片語題（類型2），content 包含 question 和 options
  // 需要轉換為 exercise_items 格式
  let exerciseItems: any[] = [];

  if (typeId === 1 || typeId === 2 || typeId === 3) {
    // MCQ 格式：單個 item
    // 注意：exercise_item_id 可能是 null（基礎題型 n=1）
    // 需要從 content 中找到實際的 item_id（如果有的話）
    const itemId = question.exercise_item_id ||
                   (question.content.item_id as number) ||
                   question.exercise_id;

    exerciseItems = [{
      id: itemId,
      exercise_id: question.exercise_id,
      sequence: 1,
      question: question.content.question as string,
      options: question.content.options as any[],
      metadata: (question.content.metadata as any) || null,
    }];
  }

  const exercise: Exercise = {
    id: question.exercise_id,
    exercise_type_id: typeId,
    subject_id: (question.content.subject_id as number) || 1,
    difficulty_bundle_id: (question.content.difficulty_bundle_id as number) || 1,
    passage: (question.content.passage as string) || null,
    audio_url: (question.content.audio_url as string) || null,
    image_url: (question.content.image_url as string) || null,
    asset_json: (question.content.asset_json as any) || null,
    exercise_type: question.exercise_type,
    exercise_items: exerciseItems,
    created_at: new Date().toISOString(),
  };

  // 將 answer 物件轉換為 Map<itemId, answerIndex>
  const answersMap = new Map<number, number>();
  if (answer && typeof answer === 'object') {
    Object.entries(answer).forEach(([itemId, answerIndex]) => {
      answersMap.set(Number(itemId), answerIndex as number);
    });
  }

  // 處理答案變更：將 Map 轉回物件
  const handleAnswerChange = (_exerciseId: number, itemId: number, answerIndex: number) => {
    const newAnswer = { ...answer, [itemId]: answerIndex };
    onAnswerChange(newAnswer);
  };

  // 字彙 (1)、片語 (2)、文法 (3) 使用 MCQExercise
  if (typeId === 1 || typeId === 2 || typeId === 3) {
    return (
      <MCQExercise
        exercise={exercise}
        answers={answersMap}
        onAnswerChange={handleAnswerChange}
        mode={disabled ? 'completed' : 'in_progress'}
      />
    );
  }

  // 不支援的題型
  return (
    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
      <p className="text-yellow-800 dark:text-yellow-200">
        不支援的題型：{question.exercise_type.name} (ID: {typeId})
      </p>
    </div>
  );
});
