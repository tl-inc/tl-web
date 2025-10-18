'use client';

import { motion } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import type { Exercise } from '@/types/paper';
import { usePaperStore } from '@/stores/usePaperStore';
import { MCQExercise } from '../exercises/MCQExercise';
import { ClozeExercise } from '../exercises/ClozeExercise';
import { ItemSetExercise } from '../exercises/ItemSetExercise';

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
}

/**
 * ExerciseCard 組件
 * 單題卡片，包含題目、素材、答題區
 */
export default function ExerciseCard({ exercise, index }: ExerciseCardProps) {
  const mode = usePaperStore((state) => state.mode);
  const answers = usePaperStore((state) => state.answers);
  const submitAnswer = usePaperStore((state) => state.submitAnswer);
  const nextExercise = usePaperStore((state) => state.nextExercise);
  const previousExercise = usePaperStore((state) => state.previousExercise);
  const direction = usePaperStore((state) => state.navigationDirection);

  // Swipe handlers for mobile
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => nextExercise(),
    onSwipedRight: () => previousExercise(),
    trackMouse: false,
    preventScrollOnSwipe: true,
  });

  const handleAnswerChange = (exerciseId: number, itemId: number, answerIndex: number) => {
    submitAnswer(exerciseId, itemId, answerIndex);
  };

  // 決定題型組件
  const renderExercise = () => {
    const exerciseTypeId = exercise.exercise_type_id;

    // 克漏字
    if (exerciseTypeId === 4) {
      return (
        <ClozeExercise
          exercise={exercise}
          answers={answers}
          onAnswerChange={handleAnswerChange}
          mode={mode}
        />
      );
    }
    // 單選題 (1, 2, 3)
    else if ([1, 2, 3].includes(exerciseTypeId)) {
      return (
        <MCQExercise
          exercise={exercise}
          answers={answers}
          onAnswerChange={handleAnswerChange}
          mode={mode}
        />
      );
    }
    // 題組 (5-12)
    else if (exerciseTypeId >= 5 && exerciseTypeId <= 12) {
      return (
        <ItemSetExercise
          exercise={exercise}
          answers={answers}
          onAnswerChange={handleAnswerChange}
          mode={mode}
        />
      );
    }

    return <div className="text-red-500">不支援的題型 ID：{exerciseTypeId}</div>;
  };

  // 動畫變體：根據方向決定進場/離場動畫
  const variants = {
    enter: {
      x: direction === 'right' ? 300 : -300,
      opacity: 0,
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x: direction === 'right' ? -300 : 300,
      opacity: 0,
    },
  };

  return (
    <motion.div
      key={exercise.id}
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }}
      {...swipeHandlers}
      className="h-full w-full bg-gray-50 dark:bg-gray-900 px-4 py-6 md:px-6 md:py-8"
    >
      <div className="mx-auto max-w-4xl">
        {/* 題號標題 */}
        <div className="mb-4 flex items-center justify-between md:mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 md:text-2xl">第 {index + 1} 題</h2>
          <span className="rounded-full bg-blue-100 dark:bg-blue-900/50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-300 md:px-3 md:py-1 md:text-sm">
            {exercise.exercise_type.name}
          </span>
        </div>

        {/* 題目內容 */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm md:p-6">
          {renderExercise()}
        </div>
      </div>
    </motion.div>
  );
}
