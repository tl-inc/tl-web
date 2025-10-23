import type { Meta, StoryObj } from '@storybook/nextjs';
import NavigationPanel from '@/components/papers/CardView/NavigationPanel';
import { usePaperStore } from '@/stores/usePaperStore';
import { useEffect } from 'react';
import type { PaperData } from '@/types/paper';

// Helper: 建立 mock paper
const createMockPaper = (exerciseCount: number = 10): PaperData => ({
  id: 1,
  range_pack_id: 1,
  blueprint_id: 1,
  total_items: exerciseCount,
  exercises: Array.from({ length: exerciseCount }, (_, i) => ({
    id: i + 1,
    exercise_type_id: 1,
    subject_id: 1,
    difficulty_bundle_id: 1,
    passage: null,
    audio_url: null,
    image_url: null,
    asset_json: null,
    exercise_type: { id: 1, name: 'MCQ', description: '選擇題' },
    created_at: new Date().toISOString(),
    exercise_items: [
      {
        id: (i + 1) * 10,
        exercise_id: i + 1,
        sequence: 1,
        question: `Item ${i + 1}`,
        options: [
          { text: 'A', is_correct: true },
          { text: 'B', is_correct: false },
          { text: 'C', is_correct: false },
          { text: 'D', is_correct: false },
        ],
      },
    ],
  })),
  created_at: new Date().toISOString(),
});

const meta = {
  title: 'Papers/CardView/NavigationPanel',
  component: NavigationPanel,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story, context) => {
      useEffect(() => {
        // 設定 mock paper 和其他狀態
        const args = context.args as {
          paper?: PaperData;
          mode?: 'pending' | 'in_progress' | 'completed' | 'abandoned';
          answers?: Map<number, number>;
          markedExercises?: Set<number>;
          currentExerciseIndex?: number;
        };
        const { paper, mode, answers, markedExercises, currentExerciseIndex } = args;
        usePaperStore.setState({
          paper: paper || createMockPaper(10),
          mode: mode || 'pending',
          answers: answers || new Map(),
          markedExercises: markedExercises || new Set(),
          currentExerciseIndex: currentExerciseIndex ?? 0,
          isNavigationPanelOpen: true,
        });
      }, [context.args]);

      return (
        <div className="h-[600px] w-[400px] rounded-lg border border-gray-300 shadow-lg">
          <Story />
        </div>
      );
    },
  ],
} satisfies Meta<typeof NavigationPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Pending 模式 - 全部未答
 * 試卷還未開始，所有題目都是未答狀態
 */
export const PendingAllUnanswered: Story = {
  args: {
    paper: createMockPaper(10),
    mode: 'pending',
    answers: new Map(),
    markedExercises: new Set(),
    currentExerciseIndex: 0,
  },
};

/**
 * In Progress 模式 - 部分已答
 * 正在作答中，已經答了 3 題
 */
export const InProgressPartiallyAnswered: Story = {
  args: {
    paper: createMockPaper(10),
    mode: 'in_progress',
    answers: new Map([
      [10, 0], // 第 1 題
      [20, 1], // 第 2 題
      [30, 0], // 第 3 題
    ]),
    markedExercises: new Set(),
    currentExerciseIndex: 3,
  },
};

/**
 * In Progress 模式 - 有標記題目
 * 標記了第 1、3、5 題
 */
export const InProgressWithMarkedExercises: Story = {
  args: {
    paper: createMockPaper(10),
    mode: 'in_progress',
    answers: new Map([
      [10, 0], // 第 1 題已答
      [20, 1], // 第 2 題已答
    ]),
    markedExercises: new Set([1, 3, 5]),
    currentExerciseIndex: 0,
  },
};

/**
 * Completed 模式 - 全對
 * 試卷完成，所有題目都答對
 */
export const CompletedAllCorrect: Story = {
  args: {
    paper: createMockPaper(10),
    mode: 'completed',
    answers: new Map(
      Array.from({ length: 10 }, (_, i) => [(i + 1) * 10, 0]) // 全部選第一個選項（正確答案）
    ),
    markedExercises: new Set(),
    currentExerciseIndex: 0,
  },
};

/**
 * Completed 模式 - 部分正確
 * 試卷完成，有對有錯
 */
export const CompletedPartiallyCorrect: Story = {
  args: {
    paper: createMockPaper(10),
    mode: 'completed',
    answers: new Map([
      [10, 0], // 對
      [20, 1], // 錯
      [30, 0], // 對
      [40, 1], // 錯
      [50, 0], // 對
      [60, 0], // 對
      [70, 1], // 錯
      [80, 0], // 對
      [90, 0], // 對
      [100, 0], // 對
    ]),
    markedExercises: new Set([2, 4, 7]), // 標記錯誤的題目
    currentExerciseIndex: 5,
  },
};

/**
 * Completed 模式 - 全錯
 * 試卷完成，所有題目都答錯
 */
export const CompletedAllWrong: Story = {
  args: {
    paper: createMockPaper(10),
    mode: 'completed',
    answers: new Map(
      Array.from({ length: 10 }, (_, i) => [(i + 1) * 10, 1]) // 全部選第二個選項（錯誤答案）
    ),
    markedExercises: new Set(),
    currentExerciseIndex: 0,
  },
};

/**
 * 少量題目 - 5 題
 * 顯示較少題目時的排版
 */
export const SmallPaper: Story = {
  args: {
    paper: createMockPaper(5),
    mode: 'in_progress',
    answers: new Map([
      [10, 0],
      [20, 1],
    ]),
    markedExercises: new Set([1]),
    currentExerciseIndex: 2,
  },
};

/**
 * 大量題目 - 30 題
 * 顯示大量題目時的捲動效果
 */
export const LargePaper: Story = {
  args: {
    paper: createMockPaper(30),
    mode: 'in_progress',
    answers: new Map(
      Array.from({ length: 15 }, (_, i) => [(i + 1) * 10, i % 2]) // 前 15 題已答
    ),
    markedExercises: new Set([1, 5, 10, 15, 20]),
    currentExerciseIndex: 15,
  },
};

/**
 * 篩選 - 只顯示未答題目
 * 演示篩選功能 (需要手動點擊「未答」按鈕)
 */
export const FilterExample: Story = {
  args: {
    paper: createMockPaper(10),
    mode: 'in_progress',
    answers: new Map([
      [10, 0], // 第 1 題已答
      [20, 1], // 第 2 題已答
      [30, 0], // 第 3 題已答
    ]),
    markedExercises: new Set([1, 5]),
    currentExerciseIndex: 0,
  },
};

/**
 * 接近完成
 * 只剩 2 題未答
 */
export const NearlyComplete: Story = {
  args: {
    paper: createMockPaper(10),
    mode: 'in_progress',
    answers: new Map(
      Array.from({ length: 8 }, (_, i) => [(i + 1) * 10, 0]) // 前 8 題已答
    ),
    markedExercises: new Set([9, 10]), // 標記剩餘未答的題目
    currentExerciseIndex: 8,
  },
};

/**
 * 手機版寬度
 * 在較窄的螢幕上顯示
 */
export const MobileWidth: Story = {
  args: {
    paper: createMockPaper(10),
    mode: 'in_progress',
    answers: new Map([
      [10, 0],
      [20, 1],
      [30, 0],
    ]),
    markedExercises: new Set([1, 3]),
    currentExerciseIndex: 2,
  },
  decorators: [
    (Story) => (
      <div className="h-[600px] w-[320px] rounded-lg border border-gray-300 shadow-lg">
        <Story />
      </div>
    ),
  ],
};

/**
 * Abandoned 模式
 * 已放棄的試卷，可以看到結果
 */
export const Abandoned: Story = {
  args: {
    paper: createMockPaper(10),
    mode: 'abandoned',
    answers: new Map([
      [10, 0], // 對
      [20, 1], // 錯
      [30, 0], // 對
      [40, 0], // 對
    ]),
    markedExercises: new Set(),
    currentExerciseIndex: 0,
  },
};
