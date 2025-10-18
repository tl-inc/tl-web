import { describe, it, expect } from 'vitest';
import { render, screen } from '@/__tests__/utils/test-utils';
import { ImageAsset } from '../ImageAsset';
import type { ImageAssetData } from '@/types/paper';

describe('ImageAsset', () => {
  const mockAsset: ImageAssetData = {
    caption: '學生在公園踢足球比賽',
    image_url: 'https://storage.googleapis.com/tl-platform-assets/exercises/1464/image.jpg',
    image_prompt: 'A simple, clean, flat cartoon illustration',
  };

  describe('rendering', () => {
    it('should render image with alt text', () => {
      render(<ImageAsset asset={mockAsset} />);

      const image = screen.getByAltText(mockAsset.caption);
      expect(image).toBeInTheDocument();
    });

    it('should render image without caption text displayed', () => {
      render(<ImageAsset asset={mockAsset} />);

      // Caption 不會顯示在畫面上（只在 alt 屬性中）
      expect(screen.queryByText(mockAsset.caption)).not.toBeInTheDocument();
    });

    it('should have correct image src', () => {
      render(<ImageAsset asset={mockAsset} />);

      const image = screen.getByAltText(mockAsset.caption);
      expect(image).toHaveAttribute('src', expect.stringContaining(encodeURIComponent(mockAsset.image_url)));
    });
  });

  describe('styling', () => {
    it('should have proper container classes', () => {
      const { container } = render(<ImageAsset asset={mockAsset} />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('aspect-video');
      expect(wrapper).toHaveClass('w-full');
      expect(wrapper).toHaveClass('rounded-md');
    });

    it('should have responsive image container', () => {
      const { container } = render(<ImageAsset asset={mockAsset} />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('aspect-video');
      expect(wrapper).toHaveClass('w-full');
    });
  });

  describe('image loading', () => {
    it('should have object-contain class', () => {
      render(<ImageAsset asset={mockAsset} />);

      const image = screen.getByAltText(mockAsset.caption);
      expect(image).toHaveClass('object-contain');
    });

    it('should render Next.js Image component', () => {
      render(<ImageAsset asset={mockAsset} />);

      const image = screen.getByAltText(mockAsset.caption);
      // Next.js Image 會有 data-nimg 屬性
      expect(image).toHaveAttribute('data-nimg');
    });
  });

  describe('accessibility', () => {
    it('should have alt attribute', () => {
      render(<ImageAsset asset={mockAsset} />);

      const image = screen.getByAltText(mockAsset.caption);
      expect(image).toBeInTheDocument();
    });

    it('should render image even when caption is empty', () => {
      const assetWithoutCaption = { ...mockAsset, caption: '' };
      const { container } = render(<ImageAsset asset={assetWithoutCaption} />);

      // 圖片應該存在
      const images = container.querySelectorAll('img');
      expect(images.length).toBeGreaterThan(0);
    });
  });
});
