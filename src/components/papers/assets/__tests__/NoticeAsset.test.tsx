import { describe, it, expect } from 'vitest';
import { render, screen } from '@/__tests__/utils/test-utils';
import { NoticeAsset } from '../NoticeAsset';

describe('NoticeAsset', () => {
  const mockNoticeAsset = {
    notice: {
      title: { content: 'School Fair 2024', translation: '學校園遊會 2024' },
      date_time: 'March 15, 2024, 10:00 AM',
      location: { content: 'Main Campus', translation: '主校區' },
      description: { content: 'Annual school fair with activities', translation: '年度學校園遊會活動' },
      participant_info: 'All students welcome',
      fee_info: { content: 'Free entry', translation: '免費入場' },
      contact_info: 'contact@school.edu',
      requirements: 'Student ID required',
      deadline: { content: 'March 10, 2024', translation: '2024年3月10日' },
    },
    organizer: 'Student Council',
  };

  it('should return null when asset is null or undefined', () => {
    const { container } = render(<NoticeAsset asset={null} mode="pending" />);
    expect(container.firstChild).toBeNull();
  });

  it('should return null when asset.notice is undefined', () => {
    const { container } = render(<NoticeAsset asset={{}} mode="pending" />);
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

  it('should render date and time', () => {
    render(<NoticeAsset asset={mockNoticeAsset} mode="pending" />);
    expect(screen.getByText('📅 Date & Time:')).toBeInTheDocument();
    expect(screen.getByText('March 15, 2024, 10:00 AM')).toBeInTheDocument();
  });

  it('should render location', () => {
    render(<NoticeAsset asset={mockNoticeAsset} mode="pending" />);
    expect(screen.getByText('📍 Location:')).toBeInTheDocument();
    expect(screen.getByText('Main Campus')).toBeInTheDocument();
  });

  it('should render description', () => {
    render(<NoticeAsset asset={mockNoticeAsset} mode="pending" />);
    expect(screen.getByText('Annual school fair with activities')).toBeInTheDocument();
  });

  it('should render participant info when available', () => {
    render(<NoticeAsset asset={mockNoticeAsset} mode="pending" />);
    expect(screen.getByText('👥 Participants:')).toBeInTheDocument();
    expect(screen.getByText('All students welcome')).toBeInTheDocument();
  });

  it('should render fee info when available', () => {
    render(<NoticeAsset asset={mockNoticeAsset} mode="pending" />);
    expect(screen.getByText('💰 Fee:')).toBeInTheDocument();
    expect(screen.getByText('Free entry')).toBeInTheDocument();
  });

  it('should render contact info when available', () => {
    render(<NoticeAsset asset={mockNoticeAsset} mode="pending" />);
    expect(screen.getByText('📞 Contact:')).toBeInTheDocument();
    expect(screen.getByText('contact@school.edu')).toBeInTheDocument();
  });

  it('should render requirements when available', () => {
    render(<NoticeAsset asset={mockNoticeAsset} mode="pending" />);
    expect(screen.getByText('✅ Requirements:')).toBeInTheDocument();
    expect(screen.getByText('Student ID required')).toBeInTheDocument();
  });

  it('should render deadline when available', () => {
    render(<NoticeAsset asset={mockNoticeAsset} mode="pending" />);
    expect(screen.getByText('⏰ Deadline:')).toBeInTheDocument();
    expect(screen.getByText('March 10, 2024')).toBeInTheDocument();
  });

  it('should render organizer when available', () => {
    render(<NoticeAsset asset={mockNoticeAsset} mode="pending" />);
    expect(screen.getByText('👤 Organizer:')).toBeInTheDocument();
    expect(screen.getByText('Student Council')).toBeInTheDocument();
  });

  it('should show translations when mode is completed', () => {
    render(<NoticeAsset asset={mockNoticeAsset} mode="completed" />);
    expect(screen.getByText('主校區')).toBeInTheDocument();
    expect(screen.getByText('年度學校園遊會活動')).toBeInTheDocument();
    expect(screen.getByText('免費入場')).toBeInTheDocument();
    expect(screen.getByText('2024年3月10日')).toBeInTheDocument();
  });

  it('should handle title as string', () => {
    const asset = {
      notice: {
        title: 'Simple Title',
        description: 'Some content',
      },
    };
    render(<NoticeAsset asset={asset} mode="pending" />);
    expect(screen.getByText('Simple Title')).toBeInTheDocument();
  });

  it('should handle content field instead of description', () => {
    const asset = {
      notice: {
        title: 'Notice',
        content: { content: 'Main content here', translation: '主要內容' },
      },
    };
    render(<NoticeAsset asset={asset} mode="pending" />);
    expect(screen.getByText('Main content here')).toBeInTheDocument();
  });

  it('should render minimal notice with only title and description', () => {
    const minimalAsset = {
      notice: {
        title: 'Simple Notice',
        description: 'Just a description',
      },
    };
    render(<NoticeAsset asset={minimalAsset} mode="pending" />);
    expect(screen.getByText('Simple Notice')).toBeInTheDocument();
    expect(screen.getByText('Just a description')).toBeInTheDocument();
    expect(screen.queryByText('📅 Date & Time:')).not.toBeInTheDocument();
    expect(screen.queryByText('📍 Location:')).not.toBeInTheDocument();
  });
});
