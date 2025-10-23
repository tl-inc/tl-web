import type { Meta, StoryObj } from '@storybook/nextjs';
import ViewModeToggle from '@/components/papers/CardView/ViewModeToggle';
import { usePaperStore } from '@/stores/usePaperStore';
import { useEffect } from 'react';

const meta = {
  title: 'Papers/CardView/ViewModeToggle',
  component: ViewModeToggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story, context) => {
      // 在每個 story 開始前重置 store
      useEffect(() => {
        const args = context.args as { initialMode?: 'scroll' | 'card' };
        const initialMode = args.initialMode || 'scroll';
        usePaperStore.setState({ viewMode: initialMode });
      }, [context.args]);

      return (
        <div className="p-8">
          <Story />
        </div>
      );
    },
  ],
} satisfies Meta<typeof ViewModeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 預設狀態 - 整頁模式
 * 顯示整頁模式被選中
 */
export const DefaultScrollMode: Story = {
  args: {
    initialMode: 'scroll',
  },
};

/**
 * 卡片模式被選中
 * 顯示卡片模式被選中
 */
export const CardModeSelected: Story = {
  args: {
    initialMode: 'card',
  },
};

/**
 * 互動示範
 * 點擊按鈕可以切換模式
 */
export const Interactive: Story = {
  args: {
    initialMode: 'scroll',
  },
  render: () => {
    return (
      <div className="space-y-4">
        <ViewModeToggle />
        <div className="text-center text-sm text-gray-600">
          <p>點擊按鈕試試切換模式</p>
          <p className="mt-2">
            當前模式: <strong>{usePaperStore.getState().viewMode === 'scroll' ? '整頁' : '卡片'}</strong>
          </p>
        </div>
      </div>
    );
  },
};

/**
 * 夜間模式
 * 顯示夜間模式的外觀
 */
export const DarkMode: Story = {
  args: {
    initialMode: 'scroll',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
};

/**
 * 在深色背景上
 * 顯示在深色背景上的外觀
 */
export const OnDarkBackground: Story = {
  args: {
    initialMode: 'scroll',
  },
  decorators: [
    (Story) => (
      <div className="bg-gray-800 p-8 rounded-lg">
        <Story />
      </div>
    ),
  ],
};

/**
 * 在有色背景上
 * 顯示在藍色背景上的外觀
 */
export const OnColoredBackground: Story = {
  args: {
    initialMode: 'card',
  },
  decorators: [
    (Story) => (
      <div className="bg-blue-50 p-8 rounded-lg">
        <Story />
      </div>
    ),
  ],
};

/**
 * 與其他元素組合
 * 顯示如何與其他 UI 元素搭配使用
 */
export const WithOtherElements: Story = {
  args: {
    initialMode: 'scroll',
  },
  render: () => (
    <div className="flex items-center gap-4">
      <h2 className="text-lg font-semibold text-gray-800">試卷練習</h2>
      <ViewModeToggle />
      <button className="ml-auto rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600">
        提交試卷
      </button>
    </div>
  ),
};

/**
 * 響應式示範 - 手機版
 * 在小螢幕上的顯示效果
 */
export const MobileView: Story = {
  args: {
    initialMode: 'scroll',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
