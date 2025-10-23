import type { Meta, StoryObj } from '@storybook/nextjs';
import { NoticeAsset } from './NoticeAsset';
import type { NoticeAssetData } from '@/types/paper';

const meta = {
  title: 'Papers/Assets/NoticeAsset',
  component: NoticeAsset,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NoticeAsset>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 活動公告 - 進行中模式 (不顯示翻譯)
 */
export const EventNotice: Story = {
  args: {
    asset: {
      title: { content: 'School Annual Festival', translation: '學校年度慶典' },
      date: { content: 'Saturday, June 15th, 2025, 2:00 PM - 6:00 PM', translation: '2025年6月15日星期六，下午2點至6點' },
      location: { content: 'Main Campus Auditorium', translation: '主校區禮堂' },
      content: {
        content: 'Join us for our annual school festival! There will be food stalls, performances, games, and more. All students and families are welcome to attend.',
        translation: '歡迎參加我們的年度學校慶典!將有美食攤位、表演、遊戲等等。歡迎所有學生和家庭參加。',
      },
      organizer: { content: 'For more information, please contact the Student Activities Office at 555-1234', translation: '如需更多資訊,請聯絡學生活動辦公室，電話555-1234' },
    } as NoticeAssetData,
    mode: 'in_progress',
  },
};

/**
 * 活動公告 - 已完成模式 (顯示翻譯)
 */
export const EventNoticeCompleted: Story = {
  args: {
    asset: {
      title: { content: 'School Annual Festival', translation: '學校年度慶典' },
      date: { content: 'Saturday, June 15th, 2025, 2:00 PM - 6:00 PM', translation: '2025年6月15日星期六，下午2點至6點' },
      location: { content: 'Main Campus Auditorium', translation: '主校區禮堂' },
      content: {
        content: 'Join us for our annual school festival! There will be food stalls, performances, games, and more. All students and families are welcome to attend.',
        translation: '歡迎參加我們的年度學校慶典!將有美食攤位、表演、遊戲等等。歡迎所有學生和家庭參加。',
      },
      organizer: { content: 'For more information, please contact the Student Activities Office at 555-1234', translation: '如需更多資訊,請聯絡學生活動辦公室，電話555-1234' },
    } as NoticeAssetData,
    mode: 'completed',
  },
};

/**
 * 會議通知
 */
export const MeetingNotice: Story = {
  args: {
    asset: {
      title: { content: 'Parent-Teacher Conference', translation: '家長會' },
      date: { content: 'Friday, May 10th, 2025, 6:00 PM', translation: '2025年5月10日星期五，下午6點' },
      location: { content: 'Classroom 301', translation: '教室301' },
      content: {
        content: 'We will discuss student progress and upcoming events. Please confirm your attendance by May 5th.',
        translation: '我們將討論學生進度和即將到來的活動。請在5月5日前確認出席。',
      },
      organizer: { content: 'Contact Ms. Johnson at mjohnson@school.edu', translation: '請聯絡 Johnson 老師，電子郵件 mjohnson@school.edu' },
    } as NoticeAssetData,
    mode: 'in_progress',
  },
};

/**
 * 考試通知
 */
export const ExamNotice: Story = {
  args: {
    asset: {
      title: { content: 'Mid-term Examination Notice', translation: '期中考試通知' },
      date: { content: 'March 20-22, 2025', translation: '2025年3月20-22日' },
      location: { content: 'Regular Classrooms', translation: '各班教室' },
      content: {
        content: 'The mid-term examinations will cover all materials taught from January to March. Students must bring their student ID cards and writing materials. No electronic devices are allowed during the exam.\n\n• Arrive 10 minutes early\n• Bring pencils and erasers\n• Mobile phones must be turned off',
        translation: '期中考試將涵蓋1月至3月所教授的所有內容。學生必須攜帶學生證和書寫用具。考試期間不得使用電子設備。\n\n• 提前10分鐘到達\n• 攜帶鉛筆和橡皮擦\n• 手機必須關機',
      },
    } as NoticeAssetData,
    mode: 'completed',
  },
};

/**
 * 中文公告
 */
export const ChineseNotice: Story = {
  args: {
    asset: {
      title: '圖書館閉館通知',
      date: '2025年5月1日至5月7日',
      location: '圖書館',
      content: '因圖書館內部整修，圖書館將於5月1日至5月7日期間暫停開放。造成不便，敬請見諒。',
      organizer: '如有疑問，請洽圖書館辦公室，分機1234',
    } as NoticeAssetData,
    mode: 'in_progress',
  },
};

/**
 * 簡潔公告 - 只有必要資訊
 */
export const MinimalNotice: Story = {
  args: {
    asset: {
      title: { content: 'Cafeteria Closed', translation: '餐廳關閉' },
      date: { content: 'Tomorrow, 12:00 PM - 2:00 PM', translation: '明天中午12點至下午2點' },
      content: {
        content: 'The cafeteria will be closed for maintenance.',
        translation: '餐廳將因維護而關閉。',
      },
    } as NoticeAssetData,
    mode: 'in_progress',
  },
};

/**
 * 緊急通知
 */
export const UrgentNotice: Story = {
  args: {
    asset: {
      title: { content: '🚨 URGENT: Class Cancellation', translation: '🚨 緊急：停課通知' },
      date: { content: 'Today, All Day', translation: '今天，全天' },
      location: { content: 'All Buildings', translation: '所有建築' },
      content: {
        content: 'Due to severe weather conditions, all classes are cancelled today. Please stay safe and check your email for further updates.',
        translation: '由於惡劣天氣，今天所有課程取消。請注意安全並檢查電子郵件以獲取進一步更新。',
      },
      organizer: { content: 'Emergency Hotline: 911', translation: '緊急熱線：911' },
    } as NoticeAssetData,
    mode: 'completed',
  },
};
