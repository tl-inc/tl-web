import { describe, it, expect } from 'vitest';
import { render, screen } from '@/__tests__/utils/test-utils';
import { NoticeAsset } from '../NoticeAsset';

describe('NoticeAsset', () => {
  const mockNoticeAsset = {
    title: { content: 'School Fair 2024', translation: '學校園遊會 2024' },
    content: { content: 'Annual school fair with activities and games for all students.', translation: '年度學校園遊會,有各種活動和遊戲供所有學生參加。' },
    date: 'March 15, 2024, 10:00 AM',
    location: { content: 'Main Campus', translation: '主校區' },
    organizer: 'Student Council',
  };

  it('should return null when asset is null or undefined', () => {
    const { container } = render(<NoticeAsset asset={null} mode="pending" />);
    expect(container.firstChild).toBeNull();
  });

  it('should render notice title', () => {
    render(<NoticeAsset asset={mockNoticeAsset} mode="pending" />);
    expect(screen.getByText('School Fair 2024')).toBeInTheDocument();
  });

  it('should not show title translation when mode is not completed', () => {
    render(<NoticeAsset asset={mockNoticeAsset} mode="pending" />);
    expect(screen.queryByText('學校園遊會 2024')).not.toBeInTheDocument();
  });

  it('should show title translation when mode is completed', () => {
    render(<NoticeAsset asset={mockNoticeAsset} mode="completed" />);
    expect(screen.getByText('學校園遊會 2024')).toBeInTheDocument();
  });

  it('should render date', () => {
    render(<NoticeAsset asset={mockNoticeAsset} mode="pending" />);
    expect(screen.getByText('📅 Date:')).toBeInTheDocument();
    expect(screen.getByText('March 15, 2024, 10:00 AM')).toBeInTheDocument();
  });

  it('should render location', () => {
    render(<NoticeAsset asset={mockNoticeAsset} mode="pending" />);
    expect(screen.getByText('📍 Location:')).toBeInTheDocument();
    expect(screen.getByText('Main Campus')).toBeInTheDocument();
  });

  it('should render content', () => {
    render(<NoticeAsset asset={mockNoticeAsset} mode="pending" />);
    expect(screen.getByText('Annual school fair with activities and games for all students.')).toBeInTheDocument();
  });

  it('should render organizer when available', () => {
    render(<NoticeAsset asset={mockNoticeAsset} mode="pending" />);
    expect(screen.getByText('👥 Organizer:')).toBeInTheDocument();
    expect(screen.getByText('Student Council')).toBeInTheDocument();
  });

  it('should show translations when mode is completed', () => {
    render(<NoticeAsset asset={mockNoticeAsset} mode="completed" />);
    expect(screen.getByText('主校區')).toBeInTheDocument();
    expect(screen.getByText('年度學校園遊會,有各種活動和遊戲供所有學生參加。')).toBeInTheDocument();
  });

  it('should handle title as string', () => {
    const asset = {
      title: 'Simple Title',
      content: 'Some content',
    };
    render(<NoticeAsset asset={asset} mode="pending" />);
    expect(screen.getByText('Simple Title')).toBeInTheDocument();
  });

  it('should render minimal notice with only title and content', () => {
    const minimalAsset = {
      title: 'Simple Notice',
      content: 'Just a description',
    };
    render(<NoticeAsset asset={minimalAsset} mode="pending" />);
    expect(screen.getByText('Simple Notice')).toBeInTheDocument();
    expect(screen.getByText('Just a description')).toBeInTheDocument();
    expect(screen.queryByText('📅 Date:')).not.toBeInTheDocument();
    expect(screen.queryByText('📍 Location:')).not.toBeInTheDocument();
  });
});
