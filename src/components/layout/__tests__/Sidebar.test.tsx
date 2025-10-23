import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from '../Sidebar';

// Mock Next.js navigation
const mockUsePathname = vi.fn(() => '/paper-configuration');
vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}));

describe('Sidebar', () => {
  const mockOnMobileClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render all navigation items', () => {
      render(<Sidebar mobileOpen={false} onMobileClose={mockOnMobileClose} />);

      expect(screen.getByText('開始練習')).toBeInTheDocument();
      expect(screen.getByText('考卷回顧')).toBeInTheDocument();
      expect(screen.getByText('程度分析')).toBeInTheDocument();
      expect(screen.getByText('成長曲線')).toBeInTheDocument();
    });

    it('should render navigation icons', () => {
      const { container } = render(
        <Sidebar mobileOpen={false} onMobileClose={mockOnMobileClose} />
      );

      // Each nav item should have an icon (svg element)
      const icons = container.querySelectorAll('nav svg');
      expect(icons.length).toBe(5);
    });

    it('should highlight active navigation item', () => {
      mockUsePathname.mockReturnValue('/paper-configuration');

      const { container } = render(
        <Sidebar mobileOpen={false} onMobileClose={mockOnMobileClose} />
      );

      const activeLink = container.querySelector('a[href="/paper-configuration"]');
      expect(activeLink?.className).toContain('bg-blue-50');
    });
  });

  describe('Desktop behavior', () => {
    it('should show collapse/expand button on desktop', () => {
      const { container } = render(
        <Sidebar mobileOpen={false} onMobileClose={mockOnMobileClose} />
      );

      // Desktop toggle button has 'hidden lg:block' class
      const toggleButton = container.querySelector('button.hidden.lg\\:block');
      expect(toggleButton).toBeInTheDocument();
    });

    it('should toggle collapsed state when desktop button is clicked', () => {
      const { container } = render(
        <Sidebar mobileOpen={false} onMobileClose={mockOnMobileClose} />
      );

      const toggleButton = container.querySelector('button.hidden.lg\\:block');
      expect(toggleButton).toBeInTheDocument();

      // Initially not collapsed (showing ChevronLeft)
      expect(container.querySelector('aside')?.className).toContain('lg:w-64');

      // Click to collapse
      fireEvent.click(toggleButton!);

      // Should show ChevronRight after collapse
      expect(container.querySelector('aside')?.className).toContain('lg:w-16');
    });
  });

  describe('Mobile behavior', () => {
    it('should show mobile close button', () => {
      const { container } = render(
        <Sidebar mobileOpen={true} onMobileClose={mockOnMobileClose} />
      );

      // Mobile close button has 'lg:hidden' class
      const closeButton = container.querySelector('button.lg\\:hidden');
      expect(closeButton).toBeInTheDocument();
    });

    it('should call onMobileClose when mobile close button is clicked', () => {
      const localMock = vi.fn();
      const { container } = render(
        <Sidebar mobileOpen={true} onMobileClose={localMock} />
      );

      // useEffect will call it once on mount when mobileOpen is true
      const initialCalls = localMock.mock.calls.length;

      const closeButton = container.querySelector('button.lg\\:hidden');
      fireEvent.click(closeButton!);

      // Should be called one more time after the click
      expect(localMock).toHaveBeenCalledTimes(initialCalls + 1);
    });

    it('should apply correct transform class when mobileOpen is true', () => {
      const { container } = render(
        <Sidebar mobileOpen={true} onMobileClose={mockOnMobileClose} />
      );

      const aside = container.querySelector('aside');
      expect(aside?.className).toContain('translate-x-0');
    });

    it('should apply correct transform class when mobileOpen is false', () => {
      const { container } = render(
        <Sidebar mobileOpen={false} onMobileClose={mockOnMobileClose} />
      );

      const aside = container.querySelector('aside');
      expect(aside?.className).toContain('-translate-x-full');
    });
  });

  describe('Navigation', () => {
    it('should render correct href for all navigation items', () => {
      const { container } = render(
        <Sidebar mobileOpen={false} onMobileClose={mockOnMobileClose} />
      );

      expect(container.querySelector('a[href="/paper-configuration"]')).toBeInTheDocument();
      expect(container.querySelector('a[href="/paper-history"]')).toBeInTheDocument();
      expect(container.querySelector('a[href="/analytics"]')).toBeInTheDocument();
      expect(container.querySelector('a[href="/chart"]')).toBeInTheDocument();
    });
  });

  describe('Responsive design', () => {
    it('should have appropriate CSS classes for responsive layout', () => {
      const { container } = render(
        <Sidebar mobileOpen={false} onMobileClose={mockOnMobileClose} />
      );

      const aside = container.querySelector('aside');

      // Should be fixed positioned
      expect(aside?.className).toContain('fixed');

      // Should have proper width classes
      expect(aside?.className).toContain('lg:w-64');

      // Should have z-index
      expect(aside?.className).toContain('z-40');
    });
  });
});
