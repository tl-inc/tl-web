import type { Meta, StoryObj } from '@storybook/nextjs';
import { AdvertisementAsset } from './AdvertisementAsset';
import type { AdvertisementAssetData } from '@/types/paper';

const meta = {
  title: 'Papers/Assets/AdvertisementAsset',
  component: AdvertisementAsset,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AdvertisementAsset>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 產品廣告 - 進行中模式
 */
export const ProductAd: Story = {
  args: {
    asset: {
      advertisement: {
        title: { content: 'Summer Sale - 50% OFF!', translation: '夏季特賣 - 五折優惠！' },
        subtitle: { content: 'Limited Time Offer', translation: '限時優惠' },
        description: {
          content: 'Get amazing discounts on all summer clothing. From swimwear to sandals, everything you need for a perfect summer!',
          translation: '所有夏季服裝都有驚人折扣。從泳裝到涼鞋，滿足您完美夏日所需的一切！',
        },
        price: { content: 'Starting from $19.99', translation: '$19.99起' },
        contact: { content: 'Visit our store at 123 Main Street or call 555-1234', translation: '造訪我們位於Main Street 123號的商店，或致電555-1234' },
      },
    } as AdvertisementAssetData,
    mode: 'in_progress',
  },
};

/**
 * 產品廣告 - 已完成模式
 */
export const ProductAdCompleted: Story = {
  args: {
    asset: {
      advertisement: {
        title: { content: 'Summer Sale - 50% OFF!', translation: '夏季特賣 - 五折優惠！' },
        subtitle: { content: 'Limited Time Offer', translation: '限時優惠' },
        description: {
          content: 'Get amazing discounts on all summer clothing. From swimwear to sandals, everything you need for a perfect summer!',
          translation: '所有夏季服裝都有驚人折扣。從泳裝到涼鞋，滿足您完美夏日所需的一切！',
        },
        price: { content: 'Starting from $19.99', translation: '$19.99起' },
        contact: { content: 'Visit our store at 123 Main Street or call 555-1234', translation: '造訪我們位於Main Street 123號的商店，或致電555-1234' },
      },
    } as AdvertisementAssetData,
    mode: 'completed',
  },
};

/**
 * 活動廣告
 */
export const EventAd: Story = {
  args: {
    asset: {
      advertisement: {
        title: { content: '🎵 Summer Music Festival 2025', translation: '🎵 2025夏日音樂節' },
        subtitle: { content: 'Three Days of Amazing Performances', translation: '三天精彩表演' },
        description: {
          content: 'Join us for the biggest music event of the year! Featuring international artists, food trucks, and fun activities for the whole family.',
          translation: '加入我們一年中最盛大的音樂盛會！包括國際藝術家表演、美食卡車和全家同樂的趣味活動。',
        },
        date_time: { content: 'July 15-17, 2025', translation: '2025年7月15-17日' },
        location: { content: 'Central Park', translation: '中央公園' },
        price: { content: 'Tickets from $50', translation: '門票$50起' },
        contact: { content: 'Book now at www.musicfest.com', translation: '立即在 www.musicfest.com 預訂' },
      },
    } as AdvertisementAssetData,
    mode: 'in_progress',
  },
};

/**
 * 餐廳廣告
 */
export const RestaurantAd: Story = {
  args: {
    asset: {
      advertisement: {
        title: { content: '🍕 Mario\'s Italian Restaurant', translation: '🍕 瑪利歐義大利餐廳' },
        subtitle: { content: 'Authentic Italian Cuisine', translation: '正宗義大利美食' },
        description: {
          content: 'Experience the taste of Italy in the heart of the city. Fresh pasta, wood-fired pizza, and homemade desserts.',
          translation: '在市中心體驗義大利風味。新鮮義大利麵、窯烤披薩和自製甜點。',
        },
        opening_hours: {
          content: 'Mon-Sat: 11:00 AM - 10:00 PM\nSun: 12:00 PM - 9:00 PM',
          translation: '週一至週六：上午11:00 - 晚上10:00\n週日：中午12:00 - 晚上9:00',
        },
        location: { content: '456 Food Street', translation: 'Food Street 456號' },
        contact: { content: 'Reserve: 555-PIZZA (555-7499)', translation: '訂位：555-PIZZA (555-7499)' },
      },
    } as AdvertisementAssetData,
    mode: 'completed',
  },
};

/**
 * 中文廣告
 */
export const ChineseAd: Story = {
  args: {
    asset: {
      advertisement: {
        title: '📚 暑期英文補習班招生中',
        subtitle: '小班教學 • 名師授課',
        description: '專業外籍教師授課，小班制教學，讓您的孩子在輕鬆愉快的環境中提升英文能力。包含聽說讀寫全方位訓練。',
        date_time: '7月1日 - 8月31日',
        location: '台北市中正區學習路100號',
        price: '學費：每期 $8,000 (8週課程)',
        contact: '報名專線：(02)2345-6789\n網址：www.englishcenter.com',
      },
    } as AdvertisementAssetData,
    mode: 'in_progress',
  },
};

/**
 * 簡潔廣告
 */
export const MinimalAd: Story = {
  args: {
    asset: {
      advertisement: {
        title: { content: 'New Smartphone Released!', translation: '新款智慧型手機上市！' },
        description: {
          content: 'The latest technology in the palm of your hand.',
          translation: '最新科技盡在掌握。',
        },
        price: { content: '$999', translation: '$999' },
        contact: { content: 'Available in all stores', translation: '各門市均有販售' },
      },
    } as AdvertisementAssetData,
    mode: 'in_progress',
  },
};
