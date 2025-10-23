import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { ItemSetExercise } from './ItemSetExercise';
import type { Exercise } from '@/types/paper';

const meta = {
  title: 'Papers/Exercises/ItemSetExercise',
  component: ItemSetExercise,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ItemSetExercise>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock exercise data with passage (閱讀理解)
const mockReadingExercise: Exercise = {
  id: 1,
  exercise_type_id: 6,
  subject_id: 1,
  difficulty_bundle_id: 1,
  passage: `The Internet has revolutionized the way we communicate and access information. In the past, people relied on letters and phone calls to stay in touch with friends and family. Today, we can instantly connect with anyone around the world through email, social media, and video calls.

However, this convenience comes with challenges. Many people struggle with information overload and find it difficult to distinguish reliable sources from misinformation. Digital literacy has become an essential skill in the modern world.`,
  audio_url: null,
  image_url: null,
  asset_json: null,
  exercise_type: {
    id: 6,
    name: 'item_set',
    description: '題組',
  },
  created_at: '2025-01-01',
  exercise_items: [
    {
      id: 101,
      exercise_id: 1,
      sequence: 1,
      question: 'What is the main topic of this passage?',
      options: [
        { text: 'The impact of the Internet on communication', is_correct: true },
        { text: 'The history of telephone', is_correct: false },
        { text: 'Social media marketing', is_correct: false },
        { text: 'Email etiquette', is_correct: false },
      ],
    },
    {
      id: 102,
      exercise_id: 1,
      sequence: 2,
      question: 'According to the passage, what is a challenge of modern communication?',
      options: [
        { text: 'Information overload', is_correct: true },
        { text: 'Expensive phone bills', is_correct: false },
        { text: 'Slow internet speed', is_correct: false },
        { text: 'Language barriers', is_correct: false },
      ],
    },
    {
      id: 103,
      exercise_id: 1,
      sequence: 3,
      question: 'What skill does the passage suggest is essential in the modern world?',
      options: [
        { text: 'Digital literacy', is_correct: true },
        { text: 'Public speaking', is_correct: false },
        { text: 'Foreign languages', is_correct: false },
        { text: 'Mathematics', is_correct: false },
      ],
    },
  ],
};

// Mock exercise with menu asset (資訊題組 - 菜單)
const mockMenuExercise: Exercise = {
  id: 2,
  exercise_type_id: 8,
  subject_id: 1,
  difficulty_bundle_id: 1,
  passage: null,
  audio_url: null,
  image_url: null,
  asset_json: {
    restaurant_name: "Joe's Café",
    menu: {
      beverages: [
        { name: { content: 'Coffee', translation: '咖啡' }, price: '$3.50' },
        { name: { content: 'Tea', translation: '茶' }, price: '$2.50' },
      ],
      main_courses: [
        { name: { content: 'Sandwich', translation: '三明治' }, price: '$8.50' },
        { name: { content: 'Salad', translation: '沙拉' }, price: '$7.00' },
      ],
    },
  },
  exercise_type: {
    id: 8,
    name: 'item_set',
    description: '題組',
  },
  created_at: '2025-01-01',
  exercise_items: [
    {
      id: 201,
      exercise_id: 2,
      sequence: 1,
      question: 'How much does a coffee cost?',
      options: [
        { text: '$3.50', is_correct: true },
        { text: '$2.50', is_correct: false },
        { text: '$8.50', is_correct: false },
        { text: '$7.00', is_correct: false },
      ],
    },
    {
      id: 202,
      exercise_id: 2,
      sequence: 2,
      question: 'What is the cheapest item on the menu?',
      options: [
        { text: 'Tea', is_correct: true },
        { text: 'Coffee', is_correct: false },
        { text: 'Sandwich', is_correct: false },
        { text: 'Salad', is_correct: false },
      ],
    },
  ],
};

// Mock listening exercise
const mockListeningExercise: Exercise = {
  id: 3,
  exercise_type_id: 7,
  subject_id: 1,
  difficulty_bundle_id: 1,
  passage: '[Transcript]\nWoman: Good morning! Can I help you?\nMan: Yes, I would like to order a coffee and a sandwich.\nWoman: Sure! That will be $12.00.',
  audio_url: 'https://example.com/audio.mp3',
  image_url: null,
  asset_json: null,
  exercise_type: {
    id: 7,
    name: 'item_set',
    description: '題組',
  },
  created_at: '2025-01-01',
  exercise_items: [
    {
      id: 301,
      exercise_id: 3,
      sequence: 1,
      question: 'What does the man order?',
      options: [
        { text: 'Coffee and sandwich', is_correct: true },
        { text: 'Tea and salad', is_correct: false },
        { text: 'Only coffee', is_correct: false },
        { text: 'Only sandwich', is_correct: false },
      ],
    },
  ],
};

/**
 * 閱讀理解題組 - 進行中
 */
export const ReadingInProgress: Story = {
  args: {
    exercise: mockReadingExercise,
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
      <div className="max-w-4xl">
        <ItemSetExercise
          exercise={mockReadingExercise}
          answers={answers}
          onAnswerChange={handleAnswerChange}
          mode="in_progress"
        />
      </div>
    );
  },
};

/**
 * 閱讀理解題組 - 已完成 (全對)
 */
export const ReadingCompletedCorrect: Story = {
  args: {
    exercise: mockReadingExercise,
    answers: new Map(),
    onAnswerChange: () => {},
    mode: 'completed',
  },
  render: () => {
    const answers = new Map<number, number>([
      [101, 0],
      [102, 0],
      [103, 0],
    ]);

    return (
      <div className="max-w-4xl">
        <ItemSetExercise
          exercise={mockReadingExercise}
          answers={answers}
          onAnswerChange={() => {}}
          mode="completed"
        />
      </div>
    );
  },
};

/**
 * 閱讀理解題組 - 已完成 (部分錯誤)
 */
export const ReadingCompletedPartial: Story = {
  args: {
    exercise: mockReadingExercise,
    answers: new Map(),
    onAnswerChange: () => {},
    mode: 'completed',
  },
  render: () => {
    const answers = new Map<number, number>([
      [101, 0], // 正確
      [102, 1], // 錯誤
      [103, 0], // 正確
    ]);

    return (
      <div className="max-w-4xl">
        <ItemSetExercise
          exercise={mockReadingExercise}
          answers={answers}
          onAnswerChange={() => {}}
          mode="completed"
        />
      </div>
    );
  },
};

/**
 * 資訊題組 - 菜單 (進行中)
 */
export const MenuInformationReading: Story = {
  args: {
    exercise: mockMenuExercise,
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
      <div className="max-w-4xl">
        <ItemSetExercise
          exercise={mockMenuExercise}
          answers={answers}
          onAnswerChange={handleAnswerChange}
          mode="in_progress"
        />
      </div>
    );
  },
};

/**
 * 資訊題組 - 菜單 (已完成)
 */
export const MenuInformationReadingCompleted: Story = {
  args: {
    exercise: mockMenuExercise,
    answers: new Map(),
    onAnswerChange: () => {},
    mode: 'completed',
  },
  render: () => {
    const answers = new Map<number, number>([
      [201, 0],
      [202, 0],
    ]);

    return (
      <div className="max-w-4xl">
        <ItemSetExercise
          exercise={mockMenuExercise}
          answers={answers}
          onAnswerChange={() => {}}
          mode="completed"
        />
      </div>
    );
  },
};

/**
 * 聽力理解 - 進行中 (不顯示稿本)
 */
export const ListeningInProgress: Story = {
  args: {
    exercise: mockListeningExercise,
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
      <div className="max-w-4xl">
        <ItemSetExercise
          exercise={mockListeningExercise}
          answers={answers}
          onAnswerChange={handleAnswerChange}
          mode="in_progress"
        />
      </div>
    );
  },
};

/**
 * 聽力理解 - 已完成 (顯示稿本)
 */
export const ListeningCompleted: Story = {
  args: {
    exercise: mockListeningExercise,
    answers: new Map(),
    onAnswerChange: () => {},
    mode: 'completed',
  },
  render: () => {
    const answers = new Map<number, number>([[301, 0]]);

    return (
      <div className="max-w-4xl">
        <ItemSetExercise
          exercise={mockListeningExercise}
          answers={answers}
          onAnswerChange={() => {}}
          mode="completed"
        />
      </div>
    );
  },
};
