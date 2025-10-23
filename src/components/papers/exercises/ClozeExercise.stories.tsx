import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { ClozeExercise } from './ClozeExercise';
import type { Exercise } from '@/types/paper';

const meta = {
  title: 'Papers/Exercises/ClozeExercise',
  component: ClozeExercise,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ClozeExercise>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock exercise data
const mockExercise: Exercise = {
  id: 1,
  exercise_type_id: 4,
  subject_id: 1,
  difficulty_bundle_id: 1,
  passage: '今天天氣{{blank_1}}，我和朋友們決定去{{blank_2}}。我們準備了很多{{blank_3}}，期待著美好的一天。',
  audio_url: null,
  image_url: null,
  asset_json: null,
  exercise_type: {
    id: 4,
    name: 'cloze',
    description: '克漏字',
  },
  created_at: '2025-01-01',
  exercise_items: [
    {
      id: 101,
      exercise_id: 1,
      sequence: 1,
      question: null,
      options: [
        { text: '很好', is_correct: true },
        { text: '很差', is_correct: false },
        { text: '普通', is_correct: false },
      ],
    },
    {
      id: 102,
      exercise_id: 1,
      sequence: 2,
      question: null,
      options: [
        { text: '公園', is_correct: true },
        { text: '圖書館', is_correct: false },
        { text: '電影院', is_correct: false },
      ],
    },
    {
      id: 103,
      exercise_id: 1,
      sequence: 3,
      question: null,
      options: [
        { text: '食物', is_correct: true },
        { text: '書籍', is_correct: false },
        { text: '玩具', is_correct: false },
      ],
    },
  ],
};

/**
 * 進行中的克漏字練習 - 可以選擇答案
 */
export const InProgress: Story = {
  args: {
    exercise: mockExercise,
    answers: new Map(),
    onAnswerChange: () => {},
    mode: 'in_progress',
  },
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
        <ClozeExercise
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
 * 已完成的克漏字練習 - 顯示答案和結果
 */
export const Completed: Story = {
  args: {
    exercise: mockExercise,
    answers: new Map(),
    onAnswerChange: () => {},
    mode: 'completed',
  },
  render: () => {
    // Pre-filled with correct answers
    const answers = new Map<number, number>([
      [101, 0], // 很好
      [102, 0], // 公園
      [103, 0], // 食物
    ]);

    const handleAnswerChange = () => {
      // No-op in completed mode
    };

    return (
      <div className="max-w-2xl">
        <ClozeExercise
          exercise={mockExercise}
          answers={answers}
          onAnswerChange={handleAnswerChange}
          mode="completed"
        />
      </div>
    );
  },
};

/**
 * 英文克漏字範例
 */
export const EnglishCloze: Story = {
  args: {
    exercise: mockExercise,
    answers: new Map(),
    onAnswerChange: () => {},
    mode: 'in_progress',
  },
  render: () => {
    const [answers, setAnswers] = useState(new Map<number, number>());

    const englishExercise: Exercise = {
      ...mockExercise,
      passage:
        'Yesterday, I {{blank_1}} to the library. I {{blank_2}} many interesting books there. It {{blank_3}} a wonderful day.',
      exercise_items: [
        {
          id: 201,
          exercise_id: 2,
          sequence: 1,
          question: null,
          options: [
            { text: 'went', is_correct: true },
            { text: 'go', is_correct: false },
            { text: 'going', is_correct: false },
          ],
        },
        {
          id: 202,
          exercise_id: 2,
          sequence: 2,
          question: null,
          options: [
            { text: 'found', is_correct: true },
            { text: 'find', is_correct: false },
            { text: 'finding', is_correct: false },
          ],
        },
        {
          id: 203,
          exercise_id: 2,
          sequence: 3,
          question: null,
          options: [
            { text: 'was', is_correct: true },
            { text: 'is', is_correct: false },
            { text: 'were', is_correct: false },
          ],
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
        <ClozeExercise
          exercise={englishExercise}
          answers={answers}
          onAnswerChange={handleAnswerChange}
          mode="in_progress"
        />
      </div>
    );
  },
};

/**
 * 部分填寫的克漏字
 */
export const PartiallyFilled: Story = {
  args: {
    exercise: mockExercise,
    answers: new Map(),
    onAnswerChange: () => {},
    mode: 'in_progress',
  },
  render: () => {
    const [answers, setAnswers] = useState(
      new Map<number, number>([
        [101, 0], // 已選擇第一個空格
        // 第二、三個空格未選擇
      ])
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
        <ClozeExercise
          exercise={mockExercise}
          answers={answers}
          onAnswerChange={handleAnswerChange}
          mode="in_progress"
        />
      </div>
    );
  },
};
