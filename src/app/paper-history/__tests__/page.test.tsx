import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import PaperHistoryPage from '../page';

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

describe('PaperHistoryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render page title', () => {
    render(<PaperHistoryPage />);
    expect(screen.getByText('考卷回顧')).toBeInTheDocument();
  });

  it('should render within ProtectedRoute', () => {
    const { container } = render(<PaperHistoryPage />);
    expect(container).toBeInTheDocument();
  });

  it('should have main container with proper styling', () => {
    const { container } = render(<PaperHistoryPage />);
    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();
    expect(main?.className).toContain('min-h-screen');
  });

  it('should have centered heading', () => {
    const { container } = render(<PaperHistoryPage />);
    const heading = container.querySelector('h1');
    expect(heading?.className).toContain('text-center');
  });
});
