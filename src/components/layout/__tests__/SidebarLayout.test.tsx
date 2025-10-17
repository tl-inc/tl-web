import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SidebarLayout } from '../SidebarLayout';
import { SidebarProvider } from '@/contexts/SidebarContext';

// Mock Sidebar component
vi.mock('../Sidebar', () => ({
  Sidebar: ({ mobileOpen, onMobileClose }: any) => (
    <div data-testid="sidebar" data-mobile-open={mobileOpen}>
      <button onClick={onMobileClose}>Close</button>
    </div>
  ),
}));

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/dashboard'),
}));

describe('SidebarLayout', () => {
  it('should render children', () => {
    render(
      <SidebarProvider>
        <SidebarLayout>
          <div>Test Content</div>
        </SidebarLayout>
      </SidebarProvider>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render Sidebar component', () => {
    render(
      <SidebarProvider>
        <SidebarLayout>
          <div>Test Content</div>
        </SidebarLayout>
      </SidebarProvider>
    );

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('should pass mobileOpen state to Sidebar', () => {
    render(
      <SidebarProvider>
        <SidebarLayout>
          <div>Test Content</div>
        </SidebarLayout>
      </SidebarProvider>
    );

    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar.getAttribute('data-mobile-open')).toBe('false');
  });

  it('should have relative positioning wrapper when lockScroll is true', () => {
    const { container } = render(
      <SidebarProvider>
        <SidebarLayout lockScroll={true}>
          <div>Test Content</div>
        </SidebarLayout>
      </SidebarProvider>
    );

    const wrapper = container.querySelector('.relative');
    expect(wrapper).toBeInTheDocument();
  });

  it('should not have relative positioning wrapper when lockScroll is false', () => {
    const { container } = render(
      <SidebarProvider>
        <SidebarLayout lockScroll={false}>
          <div>Test Content</div>
        </SidebarLayout>
      </SidebarProvider>
    );

    const wrapper = container.querySelector('.relative');
    expect(wrapper).not.toBeInTheDocument();
  });
});
