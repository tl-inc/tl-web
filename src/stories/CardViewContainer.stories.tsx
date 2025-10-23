import type { Meta, StoryObj } from '@storybook/nextjs';
import CardViewContainer from '@/components/papers/CardView/CardViewContainer';
import { usePaperDataStore, usePaperCardViewStore } from '@/stores/paper';
import { useEffect } from 'react';
import type { PaperData } from '@/types/paper';

// Helper: 建立 mock paper
const createMockPaper = (exerciseCount: number = 5, exerciseTypeId: number = 1): PaperData => ({
  id: 1,
  range_pack_id: 1,
  blueprint_id: 1,
  total_items: exerciseCount,
  exercises: Array.from({ length: exerciseCount }, (_, i) => ({
    id: i + 1,
    exercise_type_id: exerciseTypeId,
    subject_id: 1,
    difficulty_bundle_id: 1,
    exercise_type: {
      id: exerciseTypeId,
      name: exerciseTypeId === 4 ? 'Cloze' : exerciseTypeId === 5 ? 'ItemSet' : 'MCQ',
      description: exerciseTypeId === 4 ? '克漏字' : exerciseTypeId === 5 ? '題組' : '選擇題',
    },
    passage: exerciseTypeId === 4 ? `This is a passage for cloze test. It has {{blank_${i + 1}}} that need to be filled.` : null,
    audio_url: null,
    image_url: null,
    asset_json: exerciseTypeId === 4 ? {
      passage: `Today was cleaning day at home. I cleaned my {{blank_1}} today. Dust hid under the bed. Mom brought boxes and bags.`,
      translation: '今天是家裡的清潔日...',
    } : null,
    created_at: new Date().toISOString(),
    exercise_items: [
      {
        id: (i + 1) * 10,
        exercise_id: i + 1,
        sequence: 1,
        question: `Item ${i + 1}`,
        options: [
          { text: 'Option A (Correct)', is_correct: true },
          { text: 'Option B', is_correct: false },
          { text: 'Option C', is_correct: false },
          { text: 'Option D', is_correct: false },
        ],
      },
    ],
  })),
  created_at: new Date().toISOString(),
});

const meta = {
  title: 'Papers/CardView/CardViewContainer',
  component: CardViewContainer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story, context) => {
      useEffect(() => {
        const args = context.args as {
          paper?: PaperData;
          mode?: 'pending' | 'in_progress' | 'completed' | 'abandoned';
          answers?: Map<number, number>;
          markedExercises?: Set<number>;
          currentExerciseIndex?: number;
        };
        usePaperDataStore, usePaperCardViewStore.setState({
          paper: args.paper || createMockPaper(5),
          mode: args.mode || 'in_progress',
          answers: args.answers || new Map(),
          markedExercises: args.markedExercises || new Set(),
          currentExerciseIndex: args.currentExerciseIndex ?? 0,
          viewMode: 'card',
          isNavigationPanelOpen: false,
          navigationDirection: 'right',
        });
      }, [context.args]);

      return (
        <div className="h-screen w-full bg-gray-50">
          <Story />
        </div>
      );
    },
  ],
} satisfies Meta<typeof CardViewContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本範例 - MCQ 題型
 * 5 題選擇題，第一題
 */
export const Basic: Story = {
  args: {
    paper: createMockPaper(5, 1),
    mode: 'in_progress',
    answers: new Map(),
    markedExercises: new Set(),
    currentExerciseIndex: 0,
  },
};

/**
 * 部分已答
 * 已經答了前 2 題
 */
export const PartiallyAnswered: Story = {
  args: {
    paper: createMockPaper(5, 1),
    mode: 'in_progress',
    answers: new Map([
      [10, 0], // 第 1 題
      [20, 1], // 第 2 題
    ]),
    markedExercises: new Set(),
    currentExerciseIndex: 2,
  },
};

/**
 * 有標記的題目
 * 標記了第 1 和第 3 題
 */
export const WithMarkedExercises: Story = {
  args: {
    paper: createMockPaper(5, 1),
    mode: 'in_progress',
    answers: new Map([
      [10, 0],
    ]),
    markedExercises: new Set([1, 3]),
    currentExerciseIndex: 0,
  },
};

/**
 * Completed 模式
 * 試卷已完成，顯示答題結果
 */
export const CompletedMode: Story = {
  args: {
    paper: createMockPaper(5, 1),
    mode: 'completed',
    answers: new Map([
      [10, 0], // 對
      [20, 1], // 錯
      [30, 0], // 對
      [40, 2], // 錯
      [50, 0], // 對
    ]),
    markedExercises: new Set([2, 4]), // 標記錯誤的題目
    currentExerciseIndex: 0,
  },
};

/**
 * 克漏字題型
 * 顯示克漏字題目的卡片模式
 */
export const ClozeExercise: Story = {
  args: {
    paper: createMockPaper(3, 4),
    mode: 'in_progress',
    answers: new Map(),
    markedExercises: new Set(),
    currentExerciseIndex: 0,
  },
};

/**
 * 第一題
 * 在第一題時，「上一題」按鈕應該被停用
 */
export const FirstExercise: Story = {
  args: {
    paper: createMockPaper(5, 1),
    mode: 'in_progress',
    answers: new Map(),
    markedExercises: new Set(),
    currentExerciseIndex: 0,
  },
};

/**
 * 最後一題
 * 在最後一題時，「下一題」按鈕應該被停用
 */
export const LastExercise: Story = {
  args: {
    paper: createMockPaper(5, 1),
    mode: 'in_progress',
    answers: new Map(),
    markedExercises: new Set(),
    currentExerciseIndex: 4, // 第 5 題 (index 4)
  },
};

/**
 * 中間題目
 * 在中間題目，兩個按鈕都可用
 */
export const MiddleExercise: Story = {
  args: {
    paper: createMockPaper(5, 1),
    mode: 'in_progress',
    answers: new Map([
      [10, 0],
      [20, 1],
    ]),
    markedExercises: new Set(),
    currentExerciseIndex: 2, // 第 3 題
  },
};

/**
 * 少量題目 - 只有 1 題
 * 測試極端情況
 */
export const SingleExercise: Story = {
  args: {
    paper: createMockPaper(1, 1),
    mode: 'in_progress',
    answers: new Map(),
    markedExercises: new Set(),
    currentExerciseIndex: 0,
  },
};

/**
 * 大量題目 - 20 題
 * 測試導航列表的捲動
 */
export const ManyExercises: Story = {
  args: {
    paper: createMockPaper(20, 1),
    mode: 'in_progress',
    answers: new Map(
      Array.from({ length: 10 }, (_, i) => [(i + 1) * 10, i % 2]) // 前 10 題已答
    ),
    markedExercises: new Set([5, 10, 15]),
    currentExerciseIndex: 10,
  },
};

/**
 * 導航面板開啟
 * 顯示導航面板打開時的樣子
 */
export const WithNavigationPanelOpen: Story = {
  args: {
    paper: createMockPaper(10, 1),
    mode: 'in_progress',
    answers: new Map([
      [10, 0],
      [20, 1],
      [30, 0],
    ]),
    markedExercises: new Set([1, 5]),
    currentExerciseIndex: 2,
  },
  decorators: [
    (Story, context) => {
      useEffect(() => {
        // 打開導航面板
        usePaperDataStore, usePaperCardViewStore.setState({ isNavigationPanelOpen: true });
      }, []);

      return (
        <div className="h-screen w-full bg-gray-50">
          <Story />
        </div>
      );
    },
  ],
};

/**
 * 手機版寬度
 * 在較窄的螢幕上的顯示效果
 */
export const MobileView: Story = {
  args: {
    paper: createMockPaper(5, 1),
    mode: 'in_progress',
    answers: new Map([
      [10, 0],
    ]),
    markedExercises: new Set([1]),
    currentExerciseIndex: 0,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * 平板寬度
 * 在平板螢幕上的顯示效果
 */
export const TabletView: Story = {
  args: {
    paper: createMockPaper(5, 1),
    mode: 'in_progress',
    answers: new Map([
      [10, 0],
      [20, 1],
    ]),
    markedExercises: new Set(),
    currentExerciseIndex: 1,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

/**
 * 無題目
 * 當沒有題目時的顯示
 */
export const NoExercises: Story = {
  args: {
    paper: {
      id: 1,
      range_pack_id: 1,
      blueprint_id: 1,
      total_items: 0,
      exercises: [],
      created_at: new Date().toISOString(),
    },
    mode: 'pending',
    answers: new Map(),
    markedExercises: new Set(),
    currentExerciseIndex: 0,
  },
};

/**
 * 接近完成
 * 只剩最後一題未答
 */
export const NearlyComplete: Story = {
  args: {
    paper: createMockPaper(5, 1),
    mode: 'in_progress',
    answers: new Map([
      [10, 0],
      [20, 1],
      [30, 0],
      [40, 2],
    ]),
    markedExercises: new Set([5]), // 標記最後一題
    currentExerciseIndex: 4, // 第 5 題
  },
};

/**
 * 夜間模式
 * 顯示卡片模式在夜間模式下的外觀
 */
export const DarkMode: Story = {
  args: {
    paper: createMockPaper(10, 1),
    mode: 'in_progress',
    answers: new Map([
      [10, 0],
      [20, 1],
      [30, 0],
    ]),
    markedExercises: new Set([1, 5]),
    currentExerciseIndex: 2,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="dark h-screen">
        <Story />
      </div>
    ),
  ],
};
