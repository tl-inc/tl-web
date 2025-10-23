import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdvertisementAsset } from '../AdvertisementAsset';

describe('AdvertisementAsset', () => {
  const mockAsset = {
    title: { content: 'Summer Sale', translation: '夏季促銷' },
    company: { content: 'Best Electronics', translation: '最佳電器' },
    content: {
      content: 'Get 50% off on all items this summer!\nLimited time offer.',
      translation: '夏季全場五折優惠!\n限時優惠。',
    },
    contact: { content: 'Tel: 555-1234\nEmail: info@best.com', translation: '電話: 555-1234\n電郵: info@best.com' },
  };

  it('should return null when asset is null or undefined', () => {
    const { container } = render(<AdvertisementAsset asset={null} mode="pending" />);
    expect(container.firstChild).toBeNull();
  });

  it('should render title', () => {
    render(<AdvertisementAsset asset={mockAsset} mode="pending" />);
    expect(screen.getByText('Summer Sale')).toBeInTheDocument();
  });

  it('should not show title translation when mode is not completed', () => {
    render(<AdvertisementAsset asset={mockAsset} mode="pending" />);
    expect(screen.queryByText('夏季促銷')).not.toBeInTheDocument();
  });

  it('should show title translation when mode is completed', () => {
    render(<AdvertisementAsset asset={mockAsset} mode="completed" />);
    expect(screen.getByText('夏季促銷')).toBeInTheDocument();
  });

  it('should render company when available', () => {
    render(<AdvertisementAsset asset={mockAsset} mode="pending" />);
    expect(screen.getByText('Best Electronics')).toBeInTheDocument();
  });

  it('should show company translation when mode is completed', () => {
    render(<AdvertisementAsset asset={mockAsset} mode="completed" />);
    expect(screen.getByText('最佳電器')).toBeInTheDocument();
  });

  it('should render content', () => {
    render(<AdvertisementAsset asset={mockAsset} mode="pending" />);
    expect(screen.getByText(/Get 50% off on all items this summer!/)).toBeInTheDocument();
    expect(screen.getByText(/Limited time offer./)).toBeInTheDocument();
  });

  it('should show content translation when mode is completed', () => {
    render(<AdvertisementAsset asset={mockAsset} mode="completed" />);
    expect(screen.getByText(/夏季全場五折優惠!/)).toBeInTheDocument();
    expect(screen.getByText(/限時優惠。/)).toBeInTheDocument();
  });

  it('should render contact info', () => {
    render(<AdvertisementAsset asset={mockAsset} mode="pending" />);
    expect(screen.getByText(/Tel: 555-1234/)).toBeInTheDocument();
    expect(screen.getByText(/Email: info@best.com/)).toBeInTheDocument();
  });

  it('should show contact translation when mode is completed', () => {
    render(<AdvertisementAsset asset={mockAsset} mode="completed" />);
    expect(screen.getByText(/電話: 555-1234/)).toBeInTheDocument();
    expect(screen.getByText(/電郵: info@best.com/)).toBeInTheDocument();
  });

  it('should render contact emoji icon', () => {
    const { container } = render(<AdvertisementAsset asset={mockAsset} mode="pending" />);
    expect(container.innerHTML).toContain('📞');
  });

  it('should handle title as string', () => {
    const asset = {
      title: 'Simple Title',
      content: 'Some content',
    };
    render(<AdvertisementAsset asset={asset} mode="pending" />);
    expect(screen.getByText('Simple Title')).toBeInTheDocument();
  });

  it('should render minimal advertisement with only title and content', () => {
    const minimalAsset = {
      title: 'Big Sale',
      content: 'Everything must go!',
    };
    render(<AdvertisementAsset asset={minimalAsset} mode="pending" />);
    expect(screen.getByText('Big Sale')).toBeInTheDocument();
    expect(screen.getByText('Everything must go!')).toBeInTheDocument();
    expect(screen.queryByText('📞')).not.toBeInTheDocument();
  });

  it('should apply gradient background classes', () => {
    const { container } = render(<AdvertisementAsset asset={mockAsset} mode="pending" />);
    const wrapper = container.querySelector('.bg-gradient-to-br');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper?.className).toContain('from-rose-50');
  });
});
