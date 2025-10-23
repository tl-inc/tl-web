import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TimetableAsset } from '../TimetableAsset';

describe('TimetableAsset', () => {
  const mockAsset = {
    title: { content: 'Taipei - Kaohsiung Train', translation: '台北 - 高雄火車' },
    route: { content: 'High Speed Rail Route 1', translation: '高鐵一號線' },
    schedule: [
      {
        train_number: 'TR101',
        departure_time: '08:00',
        arrival_time: '10:30',
        duration: '2h 30m',
        platform: 'Platform 1',
        stops: [
          { station: { content: 'Taipei Main Station', translation: '台北車站' }, arrival: '08:00', departure: '08:00' },
          { station: { content: 'Hsinchu Station', translation: '新竹車站' }, arrival: '08:45', departure: '08:47' },
          { station: { content: 'Taichung Station', translation: '台中車站' }, arrival: '09:20', departure: '09:22' },
          { station: { content: 'Kaohsiung Station', translation: '高雄車站' }, arrival: '10:30', departure: '10:30' },
        ],
      },
      {
        train_number: 'TR102',
        departure_time: '10:00',
        arrival_time: '12:30',
        duration: '2h 30m',
        stops: [
          { station: 'Taipei Main Station', arrival: '10:00', departure: '10:00' },
          { station: 'Kaohsiung Station', arrival: '12:30', departure: '12:30' },
        ],
      },
    ],
  };

  it('should return null when asset is null or undefined', () => {
    const { container } = render(<TimetableAsset asset={null} mode="pending" />);
    expect(container.firstChild).toBeNull();
  });

  it('should return null when schedule is empty', () => {
    const emptyAsset = {
      title: 'Empty Schedule',
      schedule: [],
    };
    const { container } = render(<TimetableAsset asset={emptyAsset} mode="pending" />);
    expect(container.firstChild).toBeNull();
  });

  it('should render title', () => {
    render(<TimetableAsset asset={mockAsset} mode="pending" />);
    expect(screen.getByText('Taipei - Kaohsiung Train')).toBeInTheDocument();
  });

  it('should not show title translation when mode is not completed', () => {
    render(<TimetableAsset asset={mockAsset} mode="pending" />);
    expect(screen.queryByText('台北 - 高雄火車')).not.toBeInTheDocument();
  });

  it('should show title translation when mode is completed', () => {
    render(<TimetableAsset asset={mockAsset} mode="completed" />);
    expect(screen.getByText('台北 - 高雄火車')).toBeInTheDocument();
  });

  it('should render route when available', () => {
    render(<TimetableAsset asset={mockAsset} mode="pending" />);
    expect(screen.getByText('High Speed Rail Route 1')).toBeInTheDocument();
  });

  it('should render train numbers', () => {
    render(<TimetableAsset asset={mockAsset} mode="pending" />);
    expect(screen.getByText('TR101')).toBeInTheDocument();
    expect(screen.getByText('TR102')).toBeInTheDocument();
  });

  it('should render departure and arrival times', () => {
    render(<TimetableAsset asset={mockAsset} mode="pending" />);
    expect(screen.getAllByText(/08:00/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/10:30/).length).toBeGreaterThan(0);
  });

  it('should render duration when available', () => {
    render(<TimetableAsset asset={mockAsset} mode="pending" />);
    expect(screen.getAllByText(/Duration: 2h 30m/).length).toBe(2);
  });

  it('should render platform when available', () => {
    render(<TimetableAsset asset={mockAsset} mode="pending" />);
    expect(screen.getByText(/Platform.*Platform 1/)).toBeInTheDocument();
  });

  it('should render stops', () => {
    render(<TimetableAsset asset={mockAsset} mode="pending" />);
    expect(screen.getAllByText(/Taipei Main Station/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Hsinchu Station/).length).toBeGreaterThan(0);
  });

  it('should show stop translations when mode is completed', () => {
    render(<TimetableAsset asset={mockAsset} mode="completed" />);
    expect(screen.getAllByText(/台北車站/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/新竹車站/).length).toBeGreaterThan(0);
  });

  it('should handle simple string values', () => {
    const simpleAsset = {
      title: 'Simple Title',
      schedule: [
        {
          train_number: 'T1',
          departure_time: '09:00',
          arrival_time: '11:00',
          stops: [
            { station: 'Station A', arrival: '09:00' },
            { station: 'Station B', arrival: '11:00' },
          ],
        },
      ],
    };
    render(<TimetableAsset asset={simpleAsset} mode="pending" />);
    expect(screen.getByText('Simple Title')).toBeInTheDocument();
    expect(screen.getByText('T1')).toBeInTheDocument();
  });

  it('should render minimal timetable without route', () => {
    const minimalAsset = {
      title: 'Minimal Schedule',
      schedule: [
        {
          train_number: 'M1',
          departure_time: '08:00',
          arrival_time: '09:00',
        },
      ],
    };
    render(<TimetableAsset asset={minimalAsset} mode="pending" />);
    expect(screen.getByText('Minimal Schedule')).toBeInTheDocument();
    expect(screen.getByText('M1')).toBeInTheDocument();
  });
});
