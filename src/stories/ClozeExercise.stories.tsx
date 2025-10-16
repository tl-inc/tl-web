import type { Meta, StoryObj } from '@storybook/nextjs';
import { ClozeExercise } from '@/components/papers/exercises/ClozeExercise';
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

// Helper: 建立 mock cloze exercise
const createClozeExercise = (
  passage: string,
  itemCount: number = 3,
  optionLengths: 'short' | 'medium' | 'long' = 'short'
): Exercise => {
  const getOptionText = (index: number) => {
    if (optionLengths === 'short') {
      return ['room', 'desk', 'chair', 'table'][index] || `Option ${index}`;
    } else if (optionLengths === 'medium') {
      return ['cleaning supplies', 'household items', 'personal belongings', 'school materials'][index] || `Option ${index}`;
    } else {
      return [
        'very long option text that might cause layout issues',
        'another extremely long option with many words',
        'a third long option text for testing purposes',
        'the fourth and final long option text here'
      ][index] || `Very long option ${index}`;
    }
  };

  return {
    id: 1,
    exercise_type_id: 4,
    exercise_type: { id: 4, name: 'Cloze' },
    difficulty_bundle_id: 1,
    question: 'Complete the passage by choosing the best option for each blank.',
    passage,
    asset_json: { passage, translation: '完成文章填空...' },
    exercise_items: Array.from({ length: itemCount }, (_, i) => ({
      id: i + 1,
      exercise_id: 1,
      sequence: i + 1,
      question: `Blank ${i + 1}`,
      options: Array.from({ length: 4 }, (_, j) => ({
        id: j + 1,
        content: getOptionText(j),
        text: getOptionText(j),
        is_correct: j === 0,
      })),
    })),
  };
};

/**
 * 基本範例 - 短選項
 * 正常長度的選項文字
 */
export const Basic: Story = {
  args: {
    exercise: createClozeExercise(
      'Today was cleaning day at home. I cleaned my {{blank_1}} today. Dust hid under the bed. Mom brought boxes and bags. My {{blank_2}} came to help me. We sorted books and toys. I chose {{blank_3}} to keep.',
      3,
      'short'
    ),
    answers: new Map(),
    onAnswerChange: (exerciseId, itemId, answerIndex) => {
      console.log('Answer changed:', { exerciseId, itemId, answerIndex });
    },
    mode: 'in_progress',
  },
};

/**
 * 中等長度選項
 * 選項文字較長的情況
 */
export const MediumOptions: Story = {
  args: {
    exercise: createClozeExercise(
      'Today was cleaning day at home. I cleaned my {{blank_1}} today. Dust hid under the bed. Mom brought boxes and bags. My {{blank_2}} came to help me. We sorted books and toys. I chose {{blank_3}} to keep.',
      3,
      'medium'
    ),
    answers: new Map(),
    onAnswerChange: (exerciseId, itemId, answerIndex) => {
      console.log('Answer changed:', { exerciseId, itemId, answerIndex });
    },
    mode: 'in_progress',
  },
};

/**
 * 長選項文字 (RWD 測試)
 * 測試長選項文字在不同螢幕寬度的顯示效果
 */
export const LongOptions: Story = {
  args: {
    exercise: createClozeExercise(
      'Today was cleaning day at home. I cleaned my {{blank_1}} today. Dust hid under the bed. Mom brought boxes and bags. My {{blank_2}} came to help me. We sorted books and toys. I chose {{blank_3}} to keep.',
      3,
      'long'
    ),
    answers: new Map(),
    onAnswerChange: (exerciseId, itemId, answerIndex) => {
      console.log('Answer changed:', { exerciseId, itemId, answerIndex });
    },
    mode: 'in_progress',
  },
};

/**
 * 部分已答
 * 已經選擇了一些答案
 */
export const PartiallyAnswered: Story = {
  args: {
    exercise: createClozeExercise(
      'Today was cleaning day at home. I cleaned my {{blank_1}} today. Dust hid under the bed. Mom brought boxes and bags. My {{blank_2}} came to help me. We sorted books and toys. I chose {{blank_3}} to keep.',
      3,
      'short'
    ),
    answers: new Map([
      [1, 0], // 第一個空格選了第一個選項
      [2, 1], // 第二個空格選了第二個選項
    ]),
    onAnswerChange: (exerciseId, itemId, answerIndex) => {
      console.log('Answer changed:', { exerciseId, itemId, answerIndex });
    },
    mode: 'in_progress',
  },
};

/**
 * Completed 模式
 * 顯示正確答案和用戶答案的對比
 */
export const CompletedMode: Story = {
  args: {
    exercise: createClozeExercise(
      'Today was cleaning day at home. I cleaned my {{blank_1}} today. Dust hid under the bed. Mom brought boxes and bags. My {{blank_2}} came to help me. We sorted books and toys. I chose {{blank_3}} to keep.',
      3,
      'short'
    ),
    answers: new Map([
      [1, 0], // 正確
      [2, 1], // 錯誤 (正確答案是 0)
      [3, 0], // 正確
    ]),
    onAnswerChange: (exerciseId, itemId, answerIndex) => {
      console.log('Answer changed:', { exerciseId, itemId, answerIndex });
    },
    mode: 'completed',
  },
};

/**
 * 手機版 - 短選項
 * 在手機螢幕上查看短選項的顯示效果
 */
export const MobileShortOptions: Story = {
  args: {
    exercise: createClozeExercise(
      'Today was cleaning day at home. I cleaned my {{blank_1}} today. Dust hid under the bed. Mom brought boxes and bags. My {{blank_2}} came to help me.',
      2,
      'short'
    ),
    answers: new Map(),
    onAnswerChange: (exerciseId, itemId, answerIndex) => {
      console.log('Answer changed:', { exerciseId, itemId, answerIndex });
    },
    mode: 'in_progress',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * 手機版 - 長選項 (RWD 關鍵測試)
 * 測試長選項在手機螢幕上是否會跑版
 */
export const MobileLongOptions: Story = {
  args: {
    exercise: createClozeExercise(
      'Today was cleaning day at home. I cleaned my {{blank_1}} today. Dust hid under the bed. Mom brought boxes and bags. My {{blank_2}} came to help me.',
      2,
      'long'
    ),
    answers: new Map(),
    onAnswerChange: (exerciseId, itemId, answerIndex) => {
      console.log('Answer changed:', { exerciseId, itemId, answerIndex });
    },
    mode: 'in_progress',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * 平板版 - 長選項
 * 在平板螢幕上查看長選項的顯示效果
 */
export const TabletLongOptions: Story = {
  args: {
    exercise: createClozeExercise(
      'Today was cleaning day at home. I cleaned my {{blank_1}} today. Dust hid under the bed. Mom brought boxes and bags. My {{blank_2}} came to help me. We sorted books and toys. I chose {{blank_3}} to keep.',
      3,
      'long'
    ),
    answers: new Map(),
    onAnswerChange: (exerciseId, itemId, answerIndex) => {
      console.log('Answer changed:', { exerciseId, itemId, answerIndex });
    },
    mode: 'in_progress',
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

/**
 * 多個空格 - 長文章
 * 測試包含多個空格的長文章
 */
export const ManyBlanks: Story = {
  args: {
    exercise: createClozeExercise(
      'Today was cleaning day at home. I cleaned my {{blank_1}} today. Dust hid under the bed. Mom brought boxes and bags. My {{blank_2}} came to help me. We sorted books and toys. I chose {{blank_3}} to keep. Then we moved to the {{blank_4}}. It was full of old {{blank_5}}.',
      5,
      'medium'
    ),
    answers: new Map([
      [1, 0],
      [3, 2],
    ]),
    onAnswerChange: (exerciseId, itemId, answerIndex) => {
      console.log('Answer changed:', { exerciseId, itemId, answerIndex });
    },
    mode: 'in_progress',
  },
};

/**
 * Pending 模式
 * 試卷尚未開始
 */
export const PendingMode: Story = {
  args: {
    exercise: createClozeExercise(
      'Today was cleaning day at home. I cleaned my {{blank_1}} today. Dust hid under the bed. Mom brought boxes and bags. My {{blank_2}} came to help me.',
      2,
      'short'
    ),
    answers: new Map(),
    onAnswerChange: (exerciseId, itemId, answerIndex) => {
      console.log('Answer changed:', { exerciseId, itemId, answerIndex });
    },
    mode: 'pending',
  },
};

/**
 * 無文章
 * 沒有 passage 資料時的顯示
 */
export const NoPassage: Story = {
  args: {
    exercise: {
      id: 1,
      exercise_type_id: 4,
      exercise_type: { id: 4, name: 'Cloze' },
      difficulty_bundle_id: 1,
      question: 'Complete the passage.',
      exercise_items: [],
    },
    answers: new Map(),
    onAnswerChange: (exerciseId, itemId, answerIndex) => {
      console.log('Answer changed:', { exerciseId, itemId, answerIndex });
    },
    mode: 'in_progress',
  },
};
