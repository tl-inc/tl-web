import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './collapsible';
import { Button } from './button';

const meta = {
  title: 'UI/Collapsible',
  component: Collapsible,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本折疊面板
 */
export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-[400px]">
        <div className="border rounded-lg">
          <CollapsibleTrigger asChild>
            <button className="flex w-full items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <h4 className="text-sm font-semibold">數學公式</h4>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="border-t p-4">
            <div className="space-y-2 text-sm">
              <p>• 一元二次方程式: ax² + bx + c = 0</p>
              <p>• 圓面積: πr²</p>
              <p>• 三角形面積: ½bh</p>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    );
  },
};

/**
 * 預設展開
 */
export const DefaultOpen: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-[400px]">
        <div className="border rounded-lg">
          <CollapsibleTrigger asChild>
            <button className="flex w-full items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
              <h4 className="text-sm font-semibold">重要提醒</h4>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="border-t p-4">
            <p className="text-sm">此面板預設為展開狀態，方便查看重要資訊。</p>
          </CollapsibleContent>
        </div>
      </Collapsible>
    );
  },
};

/**
 * FAQ 範例
 */
export const FAQExample: Story = {
  render: () => {
    const [openItem, setOpenItem] = useState<string | null>(null);

    const faqs = [
      {
        id: 'q1',
        question: '如何開始練習？',
        answer: '點擊首頁的「開始練習」按鈕，選擇科目和難度，系統會自動生成適合的試卷。',
      },
      {
        id: 'q2',
        question: '可以暫停練習嗎？',
        answer: '可以！您隨時可以暫停練習，系統會自動保存您的進度，下次登入時可以繼續。',
      },
      {
        id: 'q3',
        question: '如何查看錯題？',
        answer: '在「練習記錄」頁面，點擊任一試卷即可查看詳細的答題情況和錯題解析。',
      },
    ];

    return (
      <div className="w-[500px] space-y-2">
        <h3 className="text-lg font-bold mb-4">常見問題</h3>
        {faqs.map((faq) => (
          <Collapsible
            key={faq.id}
            open={openItem === faq.id}
            onOpenChange={(open) => setOpenItem(open ? faq.id : null)}
          >
            <div className="border rounded-lg">
              <CollapsibleTrigger asChild>
                <button className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800">
                  <h4 className="text-sm font-medium">{faq.question}</h4>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform ${
                      openItem === faq.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="border-t p-4 bg-gray-50/50 dark:bg-gray-800/50">
                <p className="text-sm text-gray-600 dark:text-gray-400">{faq.answer}</p>
              </CollapsibleContent>
            </div>
          </Collapsible>
        ))}
      </div>
    );
  },
};

/**
 * 帶按鈕的折疊面板
 */
export const WithButton: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-[400px] space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">進階設定</h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {isOpen ? '收起' : '展開'}
              <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm">自動儲存</label>
              <input type="checkbox" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm">顯示提示</label>
              <input type="checkbox" />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm">深色模式</label>
              <input type="checkbox" />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  },
};

/**
 * 題目解析折疊
 */
export const AnswerExplanation: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="w-[500px]">
        <div className="p-4 border rounded-lg mb-2 bg-gray-50 dark:bg-gray-800">
          <p className="font-medium mb-2">題目：2 + 3 × 4 = ?</p>
          <p className="text-sm text-green-600 dark:text-green-400">✓ 您的答案：14 (正確)</p>
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <button className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline">
              {isOpen ? '隱藏' : '查看'}解析
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-2 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/30">
              <h5 className="font-medium mb-2">解析：</h5>
              <p className="text-sm mb-2">根據運算順序，應先計算乘法，再計算加法：</p>
              <ol className="text-sm list-decimal list-inside space-y-1">
                <li>先算：3 × 4 = 12</li>
                <li>再算：2 + 12 = 14</li>
              </ol>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  },
};
