import type { Meta, StoryObj } from '@storybook/nextjs';
import { ScoreCard } from '@/components/papers/ScoreCard';

const meta = {
  title: 'Papers/ScoreCard',
  component: ScoreCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    score: {
      control: { type: 'range', min: 0, max: 100, step: 5 },
      description: '分數 (0-100)',
    },
    correctCount: {
      control: { type: 'number', min: 0 },
      description: '答對題數',
    },
    totalCount: {
      control: { type: 'number', min: 1 },
      description: '總題數',
    },
  },
} satisfies Meta<typeof ScoreCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 優異成績 (90-100 分)
 * 顯示綠色主題,表示優秀的表現
 */
export const Excellent: Story = {
  args: {
    score: 95,
    correctCount: 19,
    totalCount: 20,
  },
};

/**
 * 良好成績 (70-89 分)
 * 顯示藍色主題,表示良好的表現
 */
export const Good: Story = {
  args: {
    score: 75,
    correctCount: 15,
    totalCount: 20,
  },
};

/**
 * 及格成績 (60-69 分)
 * 顯示黃色主題,表示達到及格標準
 */
export const Pass: Story = {
  args: {
    score: 65,
    correctCount: 13,
    totalCount: 20,
  },
};

/**
 * 待加強 (< 60 分)
 * 顯示紅色主題,表示需要加強
 */
export const NeedsImprovement: Story = {
  args: {
    score: 50,
    correctCount: 10,
    totalCount: 20,
  },
};

/**
 * 滿分
 * 全部答對的完美表現
 */
export const PerfectScore: Story = {
  args: {
    score: 100,
    correctCount: 20,
    totalCount: 20,
  },
};

/**
 * 零分
 * 全部答錯
 */
export const ZeroScore: Story = {
  args: {
    score: 0,
    correctCount: 0,
    totalCount: 20,
  },
};

/**
 * 少量題目
 * 只有 5 題的測驗
 */
export const SmallTest: Story = {
  args: {
    score: 80,
    correctCount: 4,
    totalCount: 5,
  },
};

/**
 * 大量題目
 * 50 題的測驗
 */
export const LargeTest: Story = {
  args: {
    score: 86,
    correctCount: 43,
    totalCount: 50,
  },
};

/**
 * 接近及格
 * 剛好低於 60 分
 */
export const NearlyPass: Story = {
  args: {
    score: 59,
    correctCount: 11,
    totalCount: 20,
  },
};

/**
 * 接近良好
 * 剛好達到 70 分
 */
export const NearlyGood: Story = {
  args: {
    score: 70,
    correctCount: 14,
    totalCount: 20,
  },
};

/**
 * 接近優異
 * 剛好達到 90 分
 */
export const NearlyExcellent: Story = {
  args: {
    score: 90,
    correctCount: 18,
    totalCount: 20,
  },
};
