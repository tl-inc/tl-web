import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { MCQExercise } from './MCQExercise';
import type { Exercise } from '@/types/paper';

const meta = {
  title: 'Papers/Exercises/MCQExercise',
  component: MCQExercise,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MCQExercise>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock exercise data
const mockExercise: Exercise = {
  id: 1,
  paper_id: 1,
  sequence: 1,
  exercise_type: 'mcq',
  topic: '選擇題',
  skill: '基礎運算',
  difficulty: 'easy',
  points: 5,
  passage: null,
  question: '',
  hint: '提示：使用加法運算',
  asset_json: null,
  correct_answer: null,
  exercise_items: [
    {
      id: 101,
      exercise_id: 1,
      sequence: 1,
      question: '2 + 3 = ?',
      hint: '',
      options: [
        { text: '5', is_correct: true },
        { text: '6', is_correct: false },
        { text: '7', is_correct: false },
        { text: '4', is_correct: false },
      ],
      correct_answer: null,
      asset_json: null,
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    },
  ],
  created_at: '2025-01-01',
  updated_at: '2025-01-01',
};

/**
 * 進行中的選擇題 - 可以選擇答案
 */
export const InProgress: Story = {
  render: () => {
    const [answers, setAnswers] = useState(new Map<number, number>());

    const handleAnswerChange = (exerciseId: number, itemId: number, answerIndex: number) => {
      setAnswers((prev) => {
        const newAnswers = new Map(prev);
        newAnswers.set(itemId, answerIndex);
        return newAnswers;
      });
    };

    return (
      <div className="max-w-2xl">
        <MCQExercise
          exercise={mockExercise}
          answers={answers}
          onAnswerChange={handleAnswerChange}
          mode="in_progress"
        />
      </div>
    );
  },
};

/**
 * 已選擇答案的選擇題
 */
export const WithAnswer: Story = {
  render: () => {
    const [answers, setAnswers] = useState(
      new Map<number, number>([[101, 0]]) // 選擇了第一個選項
    );

    const handleAnswerChange = (exerciseId: number, itemId: number, answerIndex: number) => {
      setAnswers((prev) => {
        const newAnswers = new Map(prev);
        newAnswers.set(itemId, answerIndex);
        return newAnswers;
      });
    };

    return (
      <div className="max-w-2xl">
        <MCQExercise
          exercise={mockExercise}
          answers={answers}
          onAnswerChange={handleAnswerChange}
          mode="in_progress"
        />
      </div>
    );
  },
};

/**
 * 已完成 - 答對的情況
 */
export const CompletedCorrect: Story = {
  render: () => {
    const answers = new Map<number, number>([[101, 0]]); // 選擇了正確答案

    return (
      <div className="max-w-2xl">
        <MCQExercise
          exercise={mockExercise}
          answers={answers}
          onAnswerChange={() => {}}
          mode="completed"
        />
      </div>
    );
  },
};

/**
 * 已完成 - 答錯的情況
 */
export const CompletedIncorrect: Story = {
  render: () => {
    const answers = new Map<number, number>([[101, 1]]); // 選擇了錯誤答案

    return (
      <div className="max-w-2xl">
        <MCQExercise
          exercise={mockExercise}
          answers={answers}
          onAnswerChange={() => {}}
          mode="completed"
        />
      </div>
    );
  },
};

/**
 * 已完成 - 未作答
 */
export const CompletedUnanswered: Story = {
  render: () => {
    const answers = new Map<number, number>(); // 沒有答案

    return (
      <div className="max-w-2xl">
        <MCQExercise
          exercise={mockExercise}
          answers={answers}
          onAnswerChange={() => {}}
          mode="completed"
        />
      </div>
    );
  },
};

/**
 * 英文選擇題範例
 */
export const EnglishQuestion: Story = {
  render: () => {
    const [answers, setAnswers] = useState(new Map<number, number>());

    const englishExercise: Exercise = {
      ...mockExercise,
      exercise_items: [
        {
          id: 201,
          exercise_id: 2,
          sequence: 1,
          question: 'What is the capital of France?',
          hint: '',
          options: [
            { text: 'Paris', is_correct: true },
            { text: 'London', is_correct: false },
            { text: 'Berlin', is_correct: false },
            { text: 'Madrid', is_correct: false },
          ],
          correct_answer: null,
          asset_json: null,
          metadata: {
            translation: '法國的首都是什麼？',
          },
          created_at: '2025-01-01',
          updated_at: '2025-01-01',
        },
      ],
    };

    const handleAnswerChange = (exerciseId: number, itemId: number, answerIndex: number) => {
      setAnswers((prev) => {
        const newAnswers = new Map(prev);
        newAnswers.set(itemId, answerIndex);
        return newAnswers;
      });
    };

    return (
      <div className="max-w-2xl">
        <MCQExercise
          exercise={englishExercise}
          answers={answers}
          onAnswerChange={handleAnswerChange}
          mode="completed"
        />
      </div>
    );
  },
};

/**
 * 長題目範例
 */
export const LongQuestion: Story = {
  render: () => {
    const [answers, setAnswers] = useState(new Map<number, number>());

    const longExercise: Exercise = {
      ...mockExercise,
      exercise_items: [
        {
          id: 301,
          exercise_id: 3,
          sequence: 1,
          question:
            '小明有 12 顆糖果，他給了弟弟 3 顆，又給了妹妹 2 顆。之後媽媽又給了他 5 顆糖果。請問小明現在有多少顆糖果？',
          hint: '',
          options: [
            { text: '12 顆', is_correct: true },
            { text: '10 顆', is_correct: false },
            { text: '15 顆', is_correct: false },
            { text: '7 顆', is_correct: false },
          ],
          correct_answer: null,
          asset_json: null,
          created_at: '2025-01-01',
          updated_at: '2025-01-01',
        },
      ],
    };

    const handleAnswerChange = (exerciseId: number, itemId: number, answerIndex: number) => {
      setAnswers((prev) => {
        const newAnswers = new Map(prev);
        newAnswers.set(itemId, answerIndex);
        return newAnswers;
      });
    };

    return (
      <div className="max-w-2xl">
        <MCQExercise
          exercise={longExercise}
          answers={answers}
          onAnswerChange={handleAnswerChange}
          mode="in_progress"
        />
      </div>
    );
  },
};
