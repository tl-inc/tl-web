import type { Meta, StoryObj } from '@storybook/nextjs';
import { Button } from './button';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'Button 的視覺樣式變體',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon', 'icon-sm', 'icon-lg'],
      description: 'Button 的尺寸',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用按鈕',
    },
    asChild: {
      control: 'boolean',
      description: '是否作為子元素渲染',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 預設樣式的按鈕，使用主色調
 */
export const Default: Story = {
  args: {
    children: '預設按鈕',
    variant: 'default',
  },
};

/**
 * 破壞性操作按鈕，用於刪除等危險操作
 */
export const Destructive: Story = {
  args: {
    children: '刪除',
    variant: 'destructive',
  },
};

/**
 * 輪廓按鈕，次要操作
 */
export const Outline: Story = {
  args: {
    children: '取消',
    variant: 'outline',
  },
};

/**
 * 次要按鈕
 */
export const Secondary: Story = {
  args: {
    children: '次要按鈕',
    variant: 'secondary',
  },
};

/**
 * 幽靈按鈕，無邊框無背景
 */
export const Ghost: Story = {
  args: {
    children: '幽靈按鈕',
    variant: 'ghost',
  },
};

/**
 * 連結樣式按鈕
 */
export const Link: Story = {
  args: {
    children: '連結按鈕',
    variant: 'link',
  },
};

/**
 * 小尺寸按鈕
 */
export const Small: Story = {
  args: {
    children: '小按鈕',
    size: 'sm',
  },
};

/**
 * 大尺寸按鈕
 */
export const Large: Story = {
  args: {
    children: '大按鈕',
    size: 'lg',
  },
};

/**
 * 禁用狀態
 */
export const Disabled: Story = {
  args: {
    children: '禁用按鈕',
    disabled: true,
  },
};

/**
 * 所有變體展示
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap">
        <Button variant="default">預設</Button>
        <Button variant="destructive">破壞性</Button>
        <Button variant="outline">輪廓</Button>
        <Button variant="secondary">次要</Button>
        <Button variant="ghost">幽靈</Button>
        <Button variant="link">連結</Button>
      </div>
      <div className="flex gap-2 items-center">
        <Button size="sm">小</Button>
        <Button size="default">預設</Button>
        <Button size="lg">大</Button>
      </div>
      <div className="flex gap-2">
        <Button disabled>禁用預設</Button>
        <Button variant="outline" disabled>禁用輪廓</Button>
      </div>
    </div>
  ),
};
