import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ChartPage from '../page';

// Mock ProtectedRoute
vi.mock('@/components/auth/ProtectedRoute', () => ({
  ProtectedRoute: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock SidebarLayout
vi.mock('@/components/layout/SidebarLayout', () => ({
  SidebarLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock SidebarContext
vi.mock('@/contexts/SidebarContext', () => ({
  useSidebar: () => ({
    mobileOpen: false,
    setMobileOpen: vi.fn(),
    toggleMobile: vi.fn(),
  }),
  SidebarProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('ChartPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render page title', () => {
    render(<ChartPage />);
    expect(screen.getByText('成長曲線')).toBeInTheDocument();
  });

  it('should render within ProtectedRoute', () => {
    const { container } = render(<ChartPage />);
    expect(container).toBeInTheDocument();
  });

  it('should have main container with proper styling', () => {
    const { container } = render(<ChartPage />);
    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();
    expect(main?.className).toContain('min-h-screen');
  });
});
