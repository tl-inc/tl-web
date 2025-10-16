import type { Meta, StoryObj } from '@storybook/nextjs';
import { MenuAsset } from './MenuAsset';
import type { MenuAssetData } from '@/types/paper';

const meta = {
  title: 'Papers/Assets/MenuAsset',
  component: MenuAsset,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MenuAsset>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock menu data
const mockMenuData: MenuAssetData = {
  restaurant_name: "Joe's Café",
  menu: {
    beverages: [
      {
        name: { content: 'Coffee', translation: '咖啡' },
        price: '$3.50',
        description: { content: 'Freshly brewed coffee', translation: '新鮮現煮咖啡' },
      },
      {
        name: { content: 'Tea', translation: '茶' },
        price: '$2.50',
        description: { content: 'Various flavors available', translation: '多種口味可選' },
      },
      {
        name: { content: 'Orange Juice', translation: '柳橙汁' },
        price: '$4.00',
        description: { content: 'Fresh squeezed', translation: '現榨新鮮' },
      },
    ],
    food: [
      {
        name: { content: 'Sandwich', translation: '三明治' },
        price: '$8.50',
        description: { content: 'Ham and cheese on wheat bread', translation: '火腿起司全麥麵包' },
      },
      {
        name: { content: 'Salad', translation: '沙拉' },
        price: '$7.00',
        description: { content: 'Mixed greens with vinaigrette', translation: '綜合生菜配油醋醬' },
      },
    ],
    desserts: [
      {
        name: { content: 'Cheesecake', translation: '起司蛋糕' },
        price: '$5.50',
        description: { content: 'Classic New York style', translation: '經典紐約風格' },
      },
      {
        name: { content: 'Ice Cream', translation: '冰淇淋' },
        price: '$4.00',
        description: { content: 'Vanilla, chocolate, or strawberry', translation: '香草、巧克力或草莓' },
      },
    ],
  },
};

/**
 * 進行中模式 - 不顯示翻譯
 */
export const InProgress: Story = {
  args: {
    asset: mockMenuData,
    mode: 'in_progress',
  },
};

/**
 * 已完成模式 - 顯示翻譯
 */
export const Completed: Story = {
  args: {
    asset: mockMenuData,
    mode: 'completed',
  },
};

/**
 * 簡單菜單 - 只有飲料
 */
export const BeveragesOnly: Story = {
  args: {
    asset: {
      restaurant_name: 'Coffee Shop',
      menu: {
        beverages: [
          {
            name: { content: 'Espresso', translation: '濃縮咖啡' },
            price: '$3.00',
          },
          {
            name: { content: 'Latte', translation: '拿鐵' },
            price: '$4.50',
            description: { content: 'With steamed milk', translation: '加蒸奶' },
          },
          {
            name: { content: 'Cappuccino', translation: '卡布奇諾' },
            price: '$4.50',
          },
        ],
      },
    },
    mode: 'in_progress',
  },
};

/**
 * 中文菜單範例
 */
export const ChineseMenu: Story = {
  args: {
    asset: {
      restaurant_name: '小吃店',
      menu: {
        beverages: [
          { name: '珍珠奶茶', price: '$50' },
          { name: '綠茶', price: '$30' },
          { name: '紅茶', price: '$30' },
        ],
        food: [
          {
            name: '滷肉飯',
            price: '$60',
            description: '香濃美味的滷肉配白飯',
          },
          {
            name: '炒飯',
            price: '$70',
            description: '蛋炒飯附小菜',
          },
          {
            name: '牛肉麵',
            price: '$120',
            description: '大塊牛肉配Q彈麵條',
          },
        ],
        desserts: [
          { name: '豆花', price: '$40' },
          { name: '愛玉冰', price: '$35' },
        ],
      },
    },
    mode: 'in_progress',
  },
};

/**
 * 完整菜單 - 包含所有分類
 */
export const FullMenu: Story = {
  args: {
    asset: {
      restaurant_name: { content: "The Grand Restaurant", translation: '大飯店' },
      menu: {
        beverages: [
          { name: { content: 'Sparkling Water', translation: '氣泡水' }, price: '$2.00' },
          { name: { content: 'Wine', translation: '紅酒' }, price: '$12.00' },
        ],
        food: [
          {
            name: { content: 'Grilled Salmon', translation: '烤鮭魚' },
            price: '$24.00',
            description: { content: 'With seasonal vegetables', translation: '配時令蔬菜' },
          },
          {
            name: { content: 'Steak', translation: '牛排' },
            price: '$28.00',
            description: { content: 'Angus beef with mashed potatoes', translation: '安格斯牛肉配薯泥' },
          },
        ],
        desserts: [
          {
            name: { content: 'Chocolate Cake', translation: '巧克力蛋糕' },
            price: '$6.00',
            description: { content: 'Rich and moist', translation: '濃郁濕潤' },
          },
        ],
      },
    },
    mode: 'completed',
  },
};
