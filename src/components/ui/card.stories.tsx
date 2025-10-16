import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from './card';
import { Button } from './button';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本卡片，包含標題和內容
 */
export const Default: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>卡片標題</CardTitle>
        <CardDescription>這是卡片的描述文字</CardDescription>
      </CardHeader>
      <CardContent>
        <p>這是卡片的主要內容區域，可以放置任何元素。</p>
      </CardContent>
    </Card>
  ),
};

/**
 * 帶有頁尾的卡片
 */
export const WithFooter: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>確認操作</CardTitle>
        <CardDescription>請確認您要執行此操作</CardDescription>
      </CardHeader>
      <CardContent>
        <p>此操作無法復原，請仔細考慮。</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline">取消</Button>
        <Button>確認</Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * 帶有操作按鈕的卡片
 */
export const WithAction: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>試卷記錄</CardTitle>
        <CardDescription>2025-10-16 完成</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm">
            查看
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">得分</span>
            <span className="font-semibold">85 / 100</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">用時</span>
            <span className="font-semibold">45 分鐘</span>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

/**
 * 統計卡片範例
 */
export const StatsCard: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardDescription>總題數</CardDescription>
          <CardTitle className="text-3xl">1,234</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>完成試卷</CardDescription>
          <CardTitle className="text-3xl">56</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>平均分數</CardDescription>
          <CardTitle className="text-3xl">82%</CardTitle>
        </CardHeader>
      </Card>
    </div>
  ),
};

/**
 * 複雜卡片範例 - 試卷配置
 */
export const PaperConfigCard: Story = {
  render: () => (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>國中數學 - 一元一次方程式</CardTitle>
        <CardDescription>練習範圍包含基礎運算和應用題</CardDescription>
        <CardAction>
          <Button size="sm">編輯</Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium mb-1">題型分布</div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">選擇題</span>
                <span>10 題</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">填充題</span>
                <span>5 題</span>
              </div>
            </div>
          </div>
          <div>
            <div className="text-sm font-medium mb-1">難度設定</div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">簡單</span>
                <span>40%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">中等</span>
                <span>40%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">困難</span>
                <span>20%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">開始練習</Button>
      </CardFooter>
    </Card>
  ),
};
