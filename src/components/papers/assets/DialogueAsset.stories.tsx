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
      title: { content: 'School Conversation', translation: '校園對話' },
      setting: { content: 'In the hallway after class', translation: '課後在走廊' },
      turns: [
        {
          speaker: { content: 'John', translation: '約翰' },
          text: { content: 'Hi Mary! How are you doing today?', translation: '嗨瑪麗！你今天好嗎？' },
        },
        {
          speaker: { content: 'Mary', translation: '瑪麗' },
          text: { content: "I'm doing great, thanks! How about you?", translation: '我很好，謝謝！你呢？' },
        },
        {
          speaker: { content: 'John', translation: '約翰' },
          text: { content: "I'm good. Did you finish the homework?", translation: '我很好。你完成作業了嗎？' },
        },
        {
          speaker: { content: 'Mary', translation: '瑪麗' },
          text: { content: 'Yes, I finished it last night. It was quite challenging!', translation: '是的，我昨晚完成了。相當有挑戰性！' },
        },
      ],
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
      title: { content: 'School Conversation', translation: '校園對話' },
      setting: { content: 'In the hallway after class', translation: '課後在走廊' },
      turns: [
        {
          speaker: { content: 'John', translation: '約翰' },
          text: { content: 'Hi Mary! How are you doing today?', translation: '嗨瑪麗！你今天好嗎？' },
        },
        {
          speaker: { content: 'Mary', translation: '瑪麗' },
          text: { content: "I'm doing great, thanks! How about you?", translation: '我很好，謝謝！你呢？' },
        },
        {
          speaker: { content: 'John', translation: '約翰' },
          text: { content: "I'm good. Did you finish the homework?", translation: '我很好。你完成作業了嗎？' },
        },
        {
          speaker: { content: 'Mary', translation: '瑪麗' },
          text: { content: 'Yes, I finished it last night. It was quite challenging!', translation: '是的，我昨晚完成了。相當有挑戰性！' },
        },
      ],
    } as DialogueAssetData,
    mode: 'completed',
  },
};

/**
 * 三人對話
 */
export const ThreePersonDialogue: Story = {
  args: {
    asset: {
      title: { content: 'Group Project Discussion', translation: '小組專題討論' },
      setting: { content: 'In the library', translation: '在圖書館' },
      turns: [
        {
          speaker: { content: 'Alice', translation: '艾莉絲' },
          text: { content: "Let's start working on our science project.", translation: '我們開始做科學專題吧。' },
        },
        {
          speaker: { content: 'Bob', translation: '鮑勃' },
          text: { content: 'Good idea! What topic should we choose?', translation: '好主意！我們應該選什麼主題？' },
        },
        {
          speaker: { content: 'Carol', translation: '卡蘿' },
          text: { content: 'How about renewable energy? It\'s very relevant.', translation: '可再生能源如何？這個主題很有意義。' },
        },
        {
          speaker: { content: 'Alice', translation: '艾莉絲' },
          text: { content: "That's perfect! We can focus on solar energy.", translation: '太完美了！我們可以專注在太陽能。' },
        },
        {
          speaker: { content: 'Bob', translation: '鮑勃' },
          text: { content: "Great! I'll research the current technology.", translation: '太好了！我來研究現有技術。' },
        },
        {
          speaker: { content: 'Carol', translation: '卡蘿' },
          text: { content: "And I'll look into the environmental impact.", translation: '我來研究環境影響。' },
        },
      ],
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
      title: { content: 'At the Clothing Store', translation: '在服飾店' },
      turns: [
        {
          speaker: { content: 'Customer', translation: '顧客' },
          text: { content: 'Excuse me, do you have this shirt in medium size?', translation: '不好意思，這件襯衫有中號的嗎？' },
        },
        {
          speaker: { content: 'Sales Assistant', translation: '銷售員' },
          text: { content: "Let me check for you. Yes, we have it in stock!", translation: '讓我幫您查看。有的，我們有庫存！' },
        },
        {
          speaker: { content: 'Customer', translation: '顧客' },
          text: { content: 'Great! Can I try it on?', translation: '太好了！我可以試穿嗎？' },
        },
        {
          speaker: { content: 'Sales Assistant', translation: '銷售員' },
          text: { content: 'Of course! The fitting room is over there.', translation: '當然可以！試衣間在那邊。' },
        },
      ],
    } as DialogueAssetData,
    mode: 'in_progress',
  },
};

/**
 * 中文對話
 */
export const ChineseDialogue: Story = {
  args: {
    asset: {
      title: '週末計畫',
      setting: '放學後在教室',
      turns: [
        {
          speaker: '小明',
          text: '週末要不要一起去看電影？',
        },
        {
          speaker: '小華',
          text: '好啊！你想看哪一部？',
        },
        {
          speaker: '小明',
          text: '新上映的科幻片怎麼樣？',
        },
        {
          speaker: '小華',
          text: '聽起來不錯！那就星期六下午兩點見？',
        },
        {
          speaker: '小明',
          text: '沒問題！到時候見！',
        },
      ],
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
      title: { content: 'Making an Appointment', translation: '預約' },
      setting: { content: 'Phone conversation', translation: '電話對話' },
      turns: [
        {
          speaker: { content: 'Receptionist', translation: '櫃台人員' },
          text: { content: "Good morning! Smith's Dental Clinic. How may I help you?", translation: '早安！史密斯牙醫診所。有什麼可以幫您？' },
        },
        {
          speaker: { content: 'Patient', translation: '病患' },
          text: { content: "Hi, I'd like to make an appointment for a check-up.", translation: '您好，我想預約做檢查。' },
        },
        {
          speaker: { content: 'Receptionist', translation: '櫃台人員' },
          text: { content: 'Sure! When would you like to come in?', translation: '好的！您想什麼時候過來？' },
        },
        {
          speaker: { content: 'Patient', translation: '病患' },
          text: { content: 'Is next Wednesday afternoon available?', translation: '下週三下午可以嗎？' },
        },
        {
          speaker: { content: 'Receptionist', translation: '櫃台人員' },
          text: { content: "Yes, we have an opening at 2 PM. I'll book that for you.", translation: '可以，我們下午兩點有空檔。我幫您預約。' },
        },
      ],
    } as DialogueAssetData,
    mode: 'completed',
  },
};
