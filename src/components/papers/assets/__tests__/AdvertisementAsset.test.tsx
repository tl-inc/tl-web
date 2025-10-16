import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdvertisementAsset } from '../AdvertisementAsset';

describe('AdvertisementAsset', () => {
  const mockAsset = {
    product_name: 'Summer Camp 2024',
    advertisement: {
      headline: 'Join us for an amazing summer!',
      price: '$299',
      description: 'Experience outdoor adventure and make new friends.',
      time_info: 'June 1-30, 2024',
      location: '123 Mountain Road, Adventure Park',
      contact_info: 'Tel: 555-1234, Email: camp@example.com',
      discount_info: 'Early bird discount: 20% off before May 1st',
      promotional_text: 'Limited spots available!',
    },
  };

  describe('Rendering - in_progress mode', () => {
    it('should render product name', () => {
      render(<AdvertisementAsset asset={mockAsset} mode="in_progress" />);
      expect(screen.getByText('Summer Camp 2024')).toBeInTheDocument();
    });

    it('should render headline', () => {
      render(<AdvertisementAsset asset={mockAsset} mode="in_progress" />);
      expect(screen.getByText('Join us for an amazing summer!')).toBeInTheDocument();
    });

    it('should render price', () => {
      render(<AdvertisementAsset asset={mockAsset} mode="in_progress" />);
      expect(screen.getByText('$299')).toBeInTheDocument();
    });

    it('should render description', () => {
      render(<AdvertisementAsset asset={mockAsset} mode="in_progress" />);
      expect(screen.getByText('Experience outdoor adventure and make new friends.')).toBeInTheDocument();
    });

    it('should render time info', () => {
      render(<AdvertisementAsset asset={mockAsset} mode="in_progress" />);
      expect(screen.getByText('June 1-30, 2024')).toBeInTheDocument();
    });

    it('should render location', () => {
      render(<AdvertisementAsset asset={mockAsset} mode="in_progress" />);
      expect(screen.getByText('123 Mountain Road, Adventure Park')).toBeInTheDocument();
    });

    it('should render contact info', () => {
      render(<AdvertisementAsset asset={mockAsset} mode="in_progress" />);
      expect(screen.getByText('Tel: 555-1234, Email: camp@example.com')).toBeInTheDocument();
    });

    it('should render discount info', () => {
      render(<AdvertisementAsset asset={mockAsset} mode="in_progress" />);
      expect(screen.getByText('Early bird discount: 20% off before May 1st')).toBeInTheDocument();
    });

    it('should render promotional text', () => {
      render(<AdvertisementAsset asset={mockAsset} mode="in_progress" />);
      expect(screen.getByText('Limited spots available!')).toBeInTheDocument();
    });
  });

  describe('Rendering - completed mode with translations', () => {
    const assetWithTranslations = {
      product_name: { content: 'Summer Camp 2024', translation: '夏令營 2024' },
      advertisement: {
        headline: { content: 'Join us for an amazing summer!', translation: '加入我們精彩的夏天!' },
        price: '$299',
        description: {
          content: 'Experience outdoor adventure and make new friends.',
          translation: '體驗戶外冒險並結交新朋友。',
        },
        time_info: { content: 'June 1-30, 2024', translation: '2024年6月1-30日' },
        location: { content: '123 Mountain Road', translation: '山路123號' },
        contact_info: { content: 'Tel: 555-1234', translation: '電話: 555-1234' },
        discount_info: { content: 'Early bird discount', translation: '早鳥優惠' },
        promotional_text: { content: 'Limited spots', translation: '名額有限' },
      },
    };

    it('should render product name translation in completed mode', () => {
      render(<AdvertisementAsset asset={assetWithTranslations} mode="completed" />);
      expect(screen.getByText('夏令營 2024')).toBeInTheDocument();
    });

    it('should render headline translation in completed mode', () => {
      render(<AdvertisementAsset asset={assetWithTranslations} mode="completed" />);
      expect(screen.getByText('加入我們精彩的夏天!')).toBeInTheDocument();
    });

    it('should render description translation in completed mode', () => {
      render(<AdvertisementAsset asset={assetWithTranslations} mode="completed" />);
      expect(screen.getByText('體驗戶外冒險並結交新朋友。')).toBeInTheDocument();
    });

    it('should render time_info translation in completed mode', () => {
      render(<AdvertisementAsset asset={assetWithTranslations} mode="completed" />);
      expect(screen.getByText('2024年6月1-30日')).toBeInTheDocument();
    });

    it('should NOT render translations in in_progress mode', () => {
      render(<AdvertisementAsset asset={assetWithTranslations} mode="in_progress" />);
      expect(screen.queryByText('夏令營 2024')).not.toBeInTheDocument();
      expect(screen.queryByText('加入我們精彩的夏天!')).not.toBeInTheDocument();
    });
  });

  describe('Conditional rendering', () => {
    it('should render null when asset is missing', () => {
      const { container } = render(<AdvertisementAsset asset={null} mode="in_progress" />);
      expect(container.firstChild).toBeNull();
    });

    it('should render null when advertisement field is missing', () => {
      const { container } = render(<AdvertisementAsset asset={{}} mode="in_progress" />);
      expect(container.firstChild).toBeNull();
    });

    it('should handle missing optional fields', () => {
      const minimalAsset = {
        advertisement: {
          description: 'Only description',
        },
      };

      render(<AdvertisementAsset asset={minimalAsset} mode="in_progress" />);
      expect(screen.getByText('Only description')).toBeInTheDocument();
      expect(screen.queryByText('$')).not.toBeInTheDocument();
    });

    it('should handle missing product_name', () => {
      const assetWithoutName = {
        advertisement: {
          headline: 'Test headline',
          description: 'Test description',
        },
      };

      const { container } = render(<AdvertisementAsset asset={assetWithoutName} mode="in_progress" />);
      expect(container.querySelector('h3')).not.toBeInTheDocument();
      expect(screen.getByText('Test headline')).toBeInTheDocument();
    });
  });

  describe('Styling and visual elements', () => {
    it('should render emoji icons for special sections', () => {
      render(<AdvertisementAsset asset={mockAsset} mode="in_progress" />);

      const { container } = render(<AdvertisementAsset asset={mockAsset} mode="in_progress" />);
      // Check for emojis in the rendered HTML
      expect(container.innerHTML).toContain('🕒'); // time_info
      expect(container.innerHTML).toContain('📍'); // location
      expect(container.innerHTML).toContain('📞'); // contact_info
      expect(container.innerHTML).toContain('💰'); // discount_info
      expect(container.innerHTML).toContain('🎉'); // promotional_text
    });

    it('should apply gradient background classes', () => {
      const { container } = render(<AdvertisementAsset asset={mockAsset} mode="in_progress" />);

      const wrapper = container.querySelector('.bg-gradient-to-br');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper?.className).toContain('from-rose-50');
    });
  });
});
