import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TimetableAsset } from '../TimetableAsset';

describe('TimetableAsset', () => {
  const mockAsset = {
    title: 'Bus Schedule',
    timetable: {
      route_name: 'Route 101',
      notes: 'No service on public holidays',
      schedule: [
        {
          time: '08:00',
          price: '$5.00',
          duration: '45 minutes',
          stops: [
            { arrival_time: '08:00', location_index: 0 },
            { arrival_time: '08:15', location_index: 1 },
            { arrival_time: '08:45', location_index: 2 },
          ],
        },
        {
          time: '10:00',
          price: '$5.00',
          duration: '45 minutes',
          stops: [
            { arrival_time: '10:00', location_index: 0 },
            { arrival_time: '10:15', location_index: 1 },
            { arrival_time: '10:45', location_index: 2 },
          ],
        },
      ],
      locations: [
        { name: 'City Center' },
        { name: 'Park Station' },
        { name: 'Airport Terminal' },
      ],
      transfer_info: 'Transfer available at Park Station',
    },
  };

  describe('Rendering - basic elements', () => {
    it('should render title', () => {
      render(<TimetableAsset asset={mockAsset} mode="in_progress" />);
      expect(screen.getByText('Bus Schedule')).toBeInTheDocument();
    });

    it('should render route name', () => {
      render(<TimetableAsset asset={mockAsset} mode="in_progress" />);
      expect(screen.getByText('Route 101')).toBeInTheDocument();
    });

    it('should render notes', () => {
      render(<TimetableAsset asset={mockAsset} mode="in_progress" />);
      expect(screen.getByText('No service on public holidays')).toBeInTheDocument();
    });

    it('should render transfer info', () => {
      render(<TimetableAsset asset={mockAsset} mode="in_progress" />);
      expect(screen.getByText('Transfer available at Park Station')).toBeInTheDocument();
    });
  });

  describe('Rendering - schedule trips', () => {
    it('should render all trip times', () => {
      render(<TimetableAsset asset={mockAsset} mode="in_progress" />);
      expect(screen.getAllByText('08:00').length).toBeGreaterThan(0);
      expect(screen.getAllByText('10:00').length).toBeGreaterThan(0);
    });

    it('should render trip prices', () => {
      render(<TimetableAsset asset={mockAsset} mode="in_progress" />);
      const prices = screen.getAllByText(/\$5\.00/);
      expect(prices.length).toBeGreaterThan(0);
    });

    it('should render trip durations', () => {
      render(<TimetableAsset asset={mockAsset} mode="in_progress" />);
      const durations = screen.getAllByText('45 minutes');
      expect(durations.length).toBe(2);
    });

    it('should render all stops with arrival times', () => {
      render(<TimetableAsset asset={mockAsset} mode="in_progress" />);
      expect(screen.getAllByText('08:15').length).toBeGreaterThan(0);
      expect(screen.getAllByText('08:45').length).toBeGreaterThan(0);
      expect(screen.getAllByText('10:15').length).toBeGreaterThan(0);
      expect(screen.getAllByText('10:45').length).toBeGreaterThan(0);
    });

    it('should render all location names', () => {
      render(<TimetableAsset asset={mockAsset} mode="in_progress" />);
      expect(screen.getAllByText('City Center').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Park Station').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Airport Terminal').length).toBeGreaterThan(0);
    });
  });

  describe('Rendering - completed mode with translations', () => {
    const assetWithTranslations = {
      title: { content: 'Bus Schedule', translation: '巴士時刻表' },
      timetable: {
        route_name: { content: 'Route 101', translation: '101號路線' },
        notes: {
          content: 'No service on public holidays',
          translation: '國定假日停駛',
        },
        schedule: [
          {
            time: '08:00',
            price: { content: '$5.00', translation: '$5.00' },
            duration: { content: '45 minutes', translation: '45分鐘' },
            stops: [{ arrival_time: '08:00', location_index: 0 }],
          },
        ],
        locations: [{ name: { content: 'City Center', translation: '市中心' } }],
        transfer_info: {
          content: 'Transfer available',
          translation: '可轉乘',
        },
      },
    };

    it('should render title translation in completed mode', () => {
      render(<TimetableAsset asset={assetWithTranslations} mode="completed" />);
      expect(screen.getByText('巴士時刻表')).toBeInTheDocument();
    });

    it('should render route name translation in completed mode', () => {
      render(<TimetableAsset asset={assetWithTranslations} mode="completed" />);
      expect(screen.getByText('101號路線')).toBeInTheDocument();
    });

    it('should render notes translation in completed mode', () => {
      render(<TimetableAsset asset={assetWithTranslations} mode="completed" />);
      expect(screen.getByText('國定假日停駛')).toBeInTheDocument();
    });

    it('should render location translation in completed mode', () => {
      render(<TimetableAsset asset={assetWithTranslations} mode="completed" />);
      expect(screen.getByText('市中心')).toBeInTheDocument();
    });

    it('should render transfer info translation in completed mode', () => {
      render(<TimetableAsset asset={assetWithTranslations} mode="completed" />);
      expect(screen.getByText('可轉乘')).toBeInTheDocument();
    });

    it('should NOT render translations in in_progress mode', () => {
      render(<TimetableAsset asset={assetWithTranslations} mode="in_progress" />);
      expect(screen.queryByText('巴士時刻表')).not.toBeInTheDocument();
      expect(screen.queryByText('101號路線')).not.toBeInTheDocument();
    });
  });

  describe('Conditional rendering', () => {
    it('should render null when asset is missing', () => {
      const { container } = render(<TimetableAsset asset={null} mode="in_progress" />);
      expect(container.firstChild).toBeNull();
    });

    it('should render null when timetable field is missing', () => {
      const { container } = render(<TimetableAsset asset={{}} mode="in_progress" />);
      expect(container.firstChild).toBeNull();
    });

    it('should handle missing schedule', () => {
      const assetWithoutSchedule = {
        title: 'Test',
        timetable: {
          route_name: 'Test Route',
        },
      };

      render(<TimetableAsset asset={assetWithoutSchedule} mode="in_progress" />);
      expect(screen.getByText('Test')).toBeInTheDocument();
      expect(screen.getByText('Test Route')).toBeInTheDocument();
    });

    it('should handle missing locations', () => {
      const assetWithoutLocations = {
        title: 'Test',
        timetable: {
          schedule: [
            {
              time: '08:00',
              stops: [{ arrival_time: '08:00', location_index: 0 }],
            },
          ],
        },
      };

      render(<TimetableAsset asset={assetWithoutLocations} mode="in_progress" />);
      expect(screen.getAllByText('08:00').length).toBeGreaterThan(0);
    });

    it('should handle missing optional fields (notes, transfer_info)', () => {
      const minimalAsset = {
        title: 'Minimal',
        timetable: {
          schedule: [],
          locations: [],
        },
      };

      render(<TimetableAsset asset={minimalAsset} mode="in_progress" />);
      expect(screen.getByText('Minimal')).toBeInTheDocument();
      expect(screen.queryByText('Notes')).not.toBeInTheDocument();
      expect(screen.queryByText('Transfer Information')).not.toBeInTheDocument();
    });

    it('should use fallback title when missing', () => {
      const assetWithoutTitle = {
        timetable: {
          schedule: [],
          locations: [],
        },
      };

      render(<TimetableAsset asset={assetWithoutTitle} mode="in_progress" />);
      expect(screen.getByText('Schedule')).toBeInTheDocument();
    });
  });

  describe('Styling and visual elements', () => {
    it('should render emoji icons', () => {
      const { container } = render(<TimetableAsset asset={mockAsset} mode="in_progress" />);

      expect(container.innerHTML).toContain('🚌'); // route name
      expect(container.innerHTML).toContain('⚠️'); // notes
      expect(container.innerHTML).toContain('💵'); // price
      expect(container.innerHTML).toContain('⏱️'); // duration
      expect(container.innerHTML).toContain('🔄'); // transfer info
    });

    it('should apply gradient background classes', () => {
      const { container } = render(<TimetableAsset asset={mockAsset} mode="in_progress" />);

      const wrapper = container.querySelector('.bg-gradient-to-br');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper?.className).toContain('from-sky-50');
    });

    it('should render schedule items with border styling', () => {
      const { container } = render(<TimetableAsset asset={mockAsset} mode="in_progress" />);

      const scheduleItems = container.querySelectorAll('.border-l-4.border-sky-500');
      expect(scheduleItems.length).toBeGreaterThan(0);
    });
  });
});
