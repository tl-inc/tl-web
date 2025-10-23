import { describe, it, expect } from 'vitest';
import { render, screen } from '@/__tests__/utils/test-utils';
import { MenuAsset } from '../MenuAsset';

describe('MenuAsset', () => {
  const mockMenuAsset = {
    restaurant_name: 'The Food Palace',
    menu: {
      beverages: [
        {
          name: 'Coffee',
          price: '$3.50',
          description: 'Fresh brewed coffee',
        },
      ],
      appetizers: [
        {
          name: { content: 'Spring Rolls', translation: '春捲' },
          price: '$5.00',
        },
      ],
      main_courses: [
        {
          name: 'Grilled Chicken',
          price: '$12.00',
          description: { content: 'Marinated chicken', translation: '醃製雞肉' },
        },
      ],
      desserts: [
        {
          name: 'Ice Cream',
          price: '$4.00',
        },
      ],
      set_meals: [
        {
          name: 'Lunch Special',
          price: '$15.00',
          items: [
            { name: 'Soup' },
            { name: 'Main' },
            { name: 'Dessert' },
          ],
        },
      ],
      promotions: [
        {
          description: '20% off on weekdays!',
        },
      ],
    },
  };

  it('should return null when asset is null or undefined', () => {
    const { container } = render(<MenuAsset asset={null} mode="pending" />);
    expect(container.firstChild).toBeNull();
  });

  it('should return null when asset.menu is undefined', () => {
    const { container } = render(<MenuAsset asset={{}} mode="pending" />);
    expect(container.firstChild).toBeNull();
  });

  it('should render restaurant name', () => {
    render(<MenuAsset asset={mockMenuAsset} mode="pending" />);
    expect(screen.getByText('The Food Palace')).toBeInTheDocument();
  });

  it('should render beverages section', () => {
    render(<MenuAsset asset={mockMenuAsset} mode="pending" />);
    expect(screen.getByText('Beverages')).toBeInTheDocument();
    expect(screen.getByText('Coffee')).toBeInTheDocument();
    expect(screen.getByText('$3.50')).toBeInTheDocument();
    expect(screen.getByText('Fresh brewed coffee')).toBeInTheDocument();
  });

  it('should render appetizers section', () => {
    render(<MenuAsset asset={mockMenuAsset} mode="pending" />);
    expect(screen.getByText('Appetizers')).toBeInTheDocument();
    expect(screen.getByText('Spring Rolls')).toBeInTheDocument();
    expect(screen.getByText('$5.00')).toBeInTheDocument();
  });

  it('should render main courses section', () => {
    render(<MenuAsset asset={mockMenuAsset} mode="pending" />);
    expect(screen.getByText('Main Courses')).toBeInTheDocument();
    expect(screen.getByText('Grilled Chicken')).toBeInTheDocument();
    expect(screen.getByText('$12.00')).toBeInTheDocument();
    expect(screen.getByText('Marinated chicken')).toBeInTheDocument();
  });

  it('should render desserts section', () => {
    render(<MenuAsset asset={mockMenuAsset} mode="pending" />);
    expect(screen.getByText('Desserts')).toBeInTheDocument();
    expect(screen.getByText('Ice Cream')).toBeInTheDocument();
    expect(screen.getByText('$4.00')).toBeInTheDocument();
  });

  it('should render set meals section', () => {
    render(<MenuAsset asset={mockMenuAsset} mode="pending" />);
    expect(screen.getByText('Set Meals')).toBeInTheDocument();
    expect(screen.getByText('Lunch Special')).toBeInTheDocument();
    expect(screen.getByText('$15.00')).toBeInTheDocument();
    expect(screen.getByText(/• Soup/)).toBeInTheDocument();
    expect(screen.getByText(/• Main/)).toBeInTheDocument();
    expect(screen.getByText(/• Dessert/)).toBeInTheDocument();
  });

  it('should render promotions section', () => {
    render(<MenuAsset asset={mockMenuAsset} mode="pending" />);
    expect(screen.getByText('Promotions')).toBeInTheDocument();
    expect(screen.getByText('20% off on weekdays!')).toBeInTheDocument();
  });

  it('should not show translations when mode is not completed', () => {
    render(<MenuAsset asset={mockMenuAsset} mode="pending" />);
    expect(screen.queryByText('(春捲)')).not.toBeInTheDocument();
    expect(screen.queryByText('(醃製雞肉)')).not.toBeInTheDocument();
  });

  it('should show translations when mode is completed', () => {
    render(<MenuAsset asset={mockMenuAsset} mode="completed" />);
    expect(screen.getByText('(春捲)')).toBeInTheDocument();
    expect(screen.getByText('醃製雞肉')).toBeInTheDocument();
  });

  it('should handle restaurant_name as object with content', () => {
    const asset = {
      restaurant_name: { content: 'Fancy Restaurant' },
      menu: { beverages: [] },
    };
    render(<MenuAsset asset={asset} mode="pending" />);
    expect(screen.getByText('Fancy Restaurant')).toBeInTheDocument();
  });

  it('should render without optional sections', () => {
    const minimalAsset = {
      restaurant_name: 'Simple Cafe',
      menu: {
        beverages: [{ name: 'Tea', price: '$2.00' }],
      },
    };
    render(<MenuAsset asset={minimalAsset} mode="pending" />);
    expect(screen.getByText('Simple Cafe')).toBeInTheDocument();
    expect(screen.getByText('Tea')).toBeInTheDocument();
    expect(screen.queryByText('Appetizers')).not.toBeInTheDocument();
    expect(screen.queryByText('Main Courses')).not.toBeInTheDocument();
  });
});
