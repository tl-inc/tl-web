import type { Meta, StoryObj } from '@storybook/nextjs';
import { DialogueAsset } from './DialogueAsset';
import type { DialogueAssetData } from '@/types/paper';

const meta = {
  title: 'Papers/Assets/DialogueAsset',
  component: DialogueAsset,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DialogueAsset>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 雙人對話 - 進行中模式
 */
export const TwoPersonDialogue: Story = {
  args: {
    asset: {
      dialogue: {
        participants: ['John', 'Mary'],
        exchanges: [
          {
            speaker: 'John',
            text: { content: 'Hi Mary! How are you doing today?', translation: '嗨瑪麗！你今天好嗎？' },
          },
          {
            speaker: 'Mary',
            text: { content: "I'm doing great, thanks! How about you?", translation: '我很好，謝謝！你呢？' },
          },
          {
            speaker: 'John',
            text: { content: "I'm good. Did you finish the homework?", translation: '我很好。你完成作業了嗎？' },
          },
          {
            speaker: 'Mary',
            text: { content: 'Yes, I finished it last night. It was quite challenging!', translation: '是的，我昨晚完成了。相當有挑戰性！' },
          },
        ],
      },
    } as DialogueAssetData,
    mode: 'in_progress',
  },
};

/**
 * 雙人對話 - 已完成模式 (顯示翻譯)
 */
export const TwoPersonDialogueCompleted: Story = {
  args: {
    asset: {
      dialogue: {
        participants: ['John', 'Mary'],
        exchanges: [
          {
            speaker: 'John',
            text: { content: 'Hi Mary! How are you doing today?', translation: '嗨瑪麗！你今天好嗎？' },
          },
          {
            speaker: 'Mary',
            text: { content: "I'm doing great, thanks! How about you?", translation: '我很好，謝謝！你呢？' },
          },
          {
            speaker: 'John',
            text: { content: "I'm good. Did you finish the homework?", translation: '我很好。你完成作業了嗎？' },
          },
          {
            speaker: 'Mary',
            text: { content: 'Yes, I finished it last night. It was quite challenging!', translation: '是的，我昨晚完成了。相當有挑戰性！' },
          },
        ],
      },
    } as DialogueAssetData,
    mode: 'completed',
  },
};

/**
 * 三人對話 - 教室討論
 */
export const ThreePersonDialogue: Story = {
  args: {
    asset: {
      dialogue: {
        participants: ['Teacher', 'Student A', 'Student B'],
        exchanges: [
          {
            speaker: 'Teacher',
            text: { content: 'Today we will discuss climate change. Who wants to start?', translation: '今天我們將討論氣候變遷。誰想開始？' },
          },
          {
            speaker: 'Student A',
            text: { content: 'I think reducing carbon emissions is the most important step.', translation: '我認為減少碳排放是最重要的一步。' },
          },
          {
            speaker: 'Student B',
            text: { content: 'I agree, but we also need to focus on renewable energy.', translation: '我同意，但我們也需要專注於可再生能源。' },
          },
          {
            speaker: 'Teacher',
            text: { content: 'Excellent points! Both are crucial for our future.', translation: '很好的觀點！兩者對我們的未來都至關重要。' },
          },
        ],
      },
    } as DialogueAssetData,
    mode: 'in_progress',
  },
};

/**
 * 購物對話
 */
export const ShoppingDialogue: Story = {
  args: {
    asset: {
      dialogue: {
        participants: ['Customer', 'Shopkeeper'],
        exchanges: [
          {
            speaker: 'Customer',
            text: { content: 'Excuse me, how much is this shirt?', translation: '不好意思，這件襯衫多少錢？' },
          },
          {
            speaker: 'Shopkeeper',
            text: { content: "It's $25. We have a 20% discount today.", translation: '25美元。今天我們有20%折扣。' },
          },
          {
            speaker: 'Customer',
            text: { content: 'Great! Do you have it in blue?', translation: '太好了！你有藍色的嗎？' },
          },
          {
            speaker: 'Shopkeeper',
            text: { content: 'Yes, let me check the size for you.', translation: '有的，讓我幫你確認尺寸。' },
          },
          {
            speaker: 'Customer',
            text: { content: 'Thank you so much!', translation: '非常感謝！' },
          },
        ],
      },
    } as DialogueAssetData,
    mode: 'completed',
  },
};

/**
 * 中文對話
 */
export const ChineseDialogue: Story = {
  args: {
    asset: {
      dialogue: {
        participants: ['小明', '小華'],
        exchanges: [
          { speaker: '小明', text: '你好！今天天氣真好。' },
          { speaker: '小華', text: '是啊！我們去公園走走吧。' },
          { speaker: '小明', text: '好主意！幾點出發？' },
          { speaker: '小華', text: '下午兩點怎麼樣？' },
          { speaker: '小明', text: '完美！那我們兩點見。' },
        ],
      },
    } as DialogueAssetData,
    mode: 'in_progress',
  },
};

/**
 * 電話對話
 */
export const PhoneCall: Story = {
  args: {
    asset: {
      dialogue: {
        participants: ['Tom', 'Sarah'],
        exchanges: [
          {
            speaker: 'Tom',
            text: { content: 'Hello, is this Sarah?', translation: '你好，是莎拉嗎？' },
          },
          {
            speaker: 'Sarah',
            text: { content: 'Yes, speaking. Who is this?', translation: '是的，我就是。你是誰？' },
          },
          {
            speaker: 'Tom',
            text: { content: "It's Tom from the marketing department. I'm calling about tomorrow's meeting.", translation: '我是行銷部門的湯姆。我打電話是關於明天的會議。' },
          },
          {
            speaker: 'Sarah',
            text: { content: 'Oh yes! The meeting is at 10 AM, right?', translation: '哦對！會議是上午10點，對嗎？' },
          },
          {
            speaker: 'Tom',
            text: { content: 'Actually, it has been moved to 11 AM. I wanted to let you know.', translation: '實際上，已經改到上午11點了。我想讓你知道。' },
          },
          {
            speaker: 'Sarah',
            text: { content: 'Thank you for letting me know! See you tomorrow.', translation: '謝謝你告訴我！明天見。' },
          },
        ],
      },
    } as DialogueAssetData,
    mode: 'completed',
  },
};
