import type { Meta, StoryObj } from '@storybook/nextjs';
import { ImageAsset } from './ImageAsset';

const meta: Meta<typeof ImageAsset> = {
  title: 'Papers/Assets/ImageAsset',
  component: ImageAsset,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ImageAsset>;

// 基本圖片素材
export const Default: Story = {
  args: {
    asset: {
      caption: '學生在公園踢足球比賽',
      image_url: 'https://storage.googleapis.com/tl-platform-assets/exercises/1464/image.jpg',
      image_prompt: 'A simple, clean, flat cartoon illustration of a sunny afternoon park. Three middle school kids in soccer uniforms are actively playing: one kicks the ball, one is diving as a goalkeeper, and a third is cheering. A few parents on the sideline clap. No text, logos, or complex background; bright, clear colors; focus on the ongoing match action.',
    },
  },
};

// 風景圖片
export const Landscape: Story = {
  args: {
    asset: {
      caption: '美麗的山景與湖泊',
      image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    },
  },
};

// 動物圖片
export const Animal: Story = {
  args: {
    asset: {
      caption: '可愛的小貓咪',
      image_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&h=600&fit=crop',
    },
  },
};

// 學生讀書
export const Students: Story = {
  args: {
    asset: {
      caption: '學生在圖書館讀書',
      image_url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&h=600&fit=crop',
    },
  },
};

// 無說明文字
export const NoCaption: Story = {
  args: {
    asset: {
      caption: '',
      image_url: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=800&h=600&fit=crop',
    },
  },
};
