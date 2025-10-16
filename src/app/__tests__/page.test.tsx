import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from '../page';

const mockPush = vi.fn();
const mockUseAuth = vi.fn();

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock AuthContext
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
    });

    render(<HomePage />);
    expect(screen.getByText('載入中...')).toBeInTheDocument();
  });

  it('should redirect to dashboard when user is logged in', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 1, username: 'testuser' },
      loading: false,
    });

    render(<HomePage />);
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('should render landing page when not logged in', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
    });

    render(<HomePage />);
    expect(screen.getByText('Test Learn')).toBeInTheDocument();
    expect(screen.getByText(/克服弱點.*題練潛能/)).toBeInTheDocument();
  });

  it('should render core values section', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
    });

    render(<HomePage />);
    expect(screen.getByText('以戰養戰')).toBeInTheDocument();
    expect(screen.getByText('即時詳解')).toBeInTheDocument();
    expect(screen.getByText('弱點擊破')).toBeInTheDocument();
    expect(screen.getByText('成長可見')).toBeInTheDocument();
  });

  it('should render call-to-action section', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
    });

    const { container } = render(<HomePage />);
    // Check for links existence in the page
    const links = container.querySelectorAll('a');
    expect(links.length).toBeGreaterThan(0);
  });

  it('should render icons for core values', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
    });

    const { container } = render(<HomePage />);
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });
});
