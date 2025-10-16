import type { Meta, StoryObj } from '@storybook/nextjs';
import { ExerciseTypeRadarChart } from '@/components/analytics/ExerciseTypeRadarChart';

/**
 * ExerciseTypeRadarChart 顯示題型分組的雷達圖
 *
 * 用於展示使用者在各題型的等級 (1-10) 以及答題統計
 */
const meta = {
  title: 'Analytics/ExerciseTypeRadarChart',
  component: ExerciseTypeRadarChart,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onExerciseTypeClick: { action: 'clicked' },
  },
} satisfies Meta<typeof ExerciseTypeRadarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 預設狀態 - 基礎題型分組
 */
export const Default: Story = {
  args: {
    group: {
      id: 1,
      name: '基礎題型',
      display_order: 1,
      exercise_types: [
        {
          id: 1,
          name: '單字題',
          level: 8,
          max_level: 10,
          recent_attempts: 10,
          recent_correct_rate: 0.9,
        },
        {
          id: 2,
          name: '片語題',
          level: 7,
          max_level: 10,
          recent_attempts: 8,
          recent_correct_rate: 0.85,
        },
        {
          id: 3,
          name: '文法題',
          level: 6,
          max_level: 10,
          recent_attempts: 9,
          recent_correct_rate: 0.778,
        },
        {
          id: 4,
          name: '克漏字',
          level: 5,
          max_level: 10,
          recent_attempts: 7,
          recent_correct_rate: 0.714,
        },
      ],
    },
  },
};

/**
 * 單一題型 - 最簡單的情況
 */
export const Single: Story = {
  args: {
    group: {
      id: 1,
      name: '單一題型',
      display_order: 1,
      exercise_types: [
        {
          id: 1,
          name: '單字題',
          level: 8,
          max_level: 10,
          recent_attempts: 10,
          recent_correct_rate: 0.9,
        },
      ],
    },
  },
};

/**
 * 空分組 - 沒有題型資料
 */
export const Empty: Story = {
  args: {
    group: {
      id: 1,
      name: '空分組',
      display_order: 1,
      exercise_types: [],
    },
  },
};

/**
 * 最高等級 - 所有題型都達到滿級
 */
export const MaxLevel: Story = {
  args: {
    group: {
      id: 2,
      name: '資訊題型',
      display_order: 2,
      exercise_types: [
        {
          id: 9,
          name: '菜單',
          level: 10,
          max_level: 10,
          recent_attempts: 10,
          recent_correct_rate: 1.0,
        },
        {
          id: 10,
          name: '公告',
          level: 10,
          max_level: 10,
          recent_attempts: 10,
          recent_correct_rate: 0.95,
        },
        {
          id: 11,
          name: '對話',
          level: 10,
          max_level: 10,
          recent_attempts: 10,
          recent_correct_rate: 0.98,
        },
        {
          id: 12,
          name: '時刻表',
          level: 10,
          max_level: 10,
          recent_attempts: 10,
          recent_correct_rate: 1.0,
        },
      ],
    },
  },
};

/**
 * 最低等級 - 新手剛開始練習
 */
export const MinLevel: Story = {
  args: {
    group: {
      id: 1,
      name: '基礎題型',
      display_order: 1,
      exercise_types: [
        {
          id: 1,
          name: '單字題',
          level: 1,
          max_level: 5,
          recent_attempts: 2,
          recent_correct_rate: 0.5,
        },
        {
          id: 2,
          name: '片語題',
          level: 1,
          max_level: 5,
          recent_attempts: 1,
          recent_correct_rate: 0.0,
        },
        {
          id: 3,
          name: '文法題',
          level: 2,
          max_level: 5,
          recent_attempts: 3,
          recent_correct_rate: 0.333,
        },
      ],
    },
  },
};

/**
 * 混合等級 - 有強有弱
 */
export const MixedLevels: Story = {
  args: {
    group: {
      id: 3,
      name: '敘事題型',
      display_order: 3,
      exercise_types: [
        {
          id: 5,
          name: '閱讀',
          level: 9,
          max_level: 10,
          recent_attempts: 10,
          recent_correct_rate: 0.9,
        },
        {
          id: 6,
          name: '聽力',
          level: 3,
          max_level: 8,
          recent_attempts: 5,
          recent_correct_rate: 0.4,
        },
        {
          id: 7,
          name: '圖片',
          level: 7,
          max_level: 10,
          recent_attempts: 8,
          recent_correct_rate: 0.75,
        },
        {
          id: 8,
          name: '廣告',
          level: 5,
          max_level: 8,
          recent_attempts: 6,
          recent_correct_rate: 0.667,
        },
      ],
    },
  },
};

/**
 * 無練習記錄 - Level 預設值
 */
export const NoAttempts: Story = {
  args: {
    group: {
      id: 1,
      name: '基礎題型',
      display_order: 1,
      exercise_types: [
        {
          id: 1,
          name: '單字題',
          level: 2,
          max_level: 5,
          recent_attempts: 0,
          recent_correct_rate: 0.0,
        },
        {
          id: 2,
          name: '片語題',
          level: 2,
          max_level: 5,
          recent_attempts: 0,
          recent_correct_rate: 0.0,
        },
        {
          id: 3,
          name: '文法題',
          level: 2,
          max_level: 5,
          recent_attempts: 0,
          recent_correct_rate: 0.0,
        },
      ],
    },
  },
};
