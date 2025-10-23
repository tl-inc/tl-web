import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '../Header';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { mockUser } from '@/__tests__/mockData';

// Mock dependencies
vi.mock('@/contexts/AuthContext');
vi.mock('next/navigation');

describe('Header', () => {
  const mockPush = vi.fn();
  const mockLogout = vi.fn();
  const mockOnMenuClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    });
  });

  it('should render logo and link to home', () => {
    vi.mocked(usePathname).mockReturnValue('/');
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      googleLogin: vi.fn(),
      logout: mockLogout,
      refreshUser: vi.fn(),
    });

    render(<Header />);

    const logo = screen.getByText('Test Learn');
    expect(logo).toBeInTheDocument();
    expect(logo.closest('a')).toHaveAttribute('href', '/');
  });

  it('should show login and signup links when user is not logged in', () => {
    vi.mocked(usePathname).mockReturnValue('/');
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      googleLogin: vi.fn(),
      logout: mockLogout,
      refreshUser: vi.fn(),
    });

    render(<Header />);

    expect(screen.getByText('登入')).toBeInTheDocument();
    expect(screen.getByText('註冊')).toBeInTheDocument();
  });

  it('should show user info and logout button when user is logged in', () => {
    vi.mocked(usePathname).mockReturnValue('/dashboard');
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      googleLogin: vi.fn(),
      logout: mockLogout,
      refreshUser: vi.fn(),
    });

    render(<Header />);

    // Header shows full_name when present
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('登出')).toBeInTheDocument();
    expect(screen.queryByText('登入')).not.toBeInTheDocument();
  });

  it('should call logout and redirect to login page on logout click', async () => {
    vi.mocked(usePathname).mockReturnValue('/dashboard');
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      googleLogin: vi.fn(),
      logout: mockLogout,
      refreshUser: vi.fn(),
    });

    const user = userEvent.setup();
    render(<Header />);

    const logoutButton = screen.getByText('登出');
    await user.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('should show menu button when logged in and not on home or dashboard', () => {
    vi.mocked(usePathname).mockReturnValue('/papers/123');
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      googleLogin: vi.fn(),
      logout: mockLogout,
      refreshUser: vi.fn(),
    });

    render(<Header onMenuClick={mockOnMenuClick} />);

    const menuButton = screen.getByLabelText('開啟選單');
    expect(menuButton).toBeInTheDocument();
  });

  it('should not show menu button on homepage', () => {
    vi.mocked(usePathname).mockReturnValue('/');
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      googleLogin: vi.fn(),
      logout: mockLogout,
      refreshUser: vi.fn(),
    });

    render(<Header />);

    expect(screen.queryByLabelText('開啟選單')).not.toBeInTheDocument();
  });

  it('should not show menu button on dashboard', () => {
    vi.mocked(usePathname).mockReturnValue('/dashboard');
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      googleLogin: vi.fn(),
      logout: mockLogout,
      refreshUser: vi.fn(),
    });

    render(<Header />);

    expect(screen.queryByLabelText('開啟選單')).not.toBeInTheDocument();
  });

  it('should call onMenuClick when menu button is clicked', async () => {
    vi.mocked(usePathname).mockReturnValue('/papers/123');
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      googleLogin: vi.fn(),
      logout: mockLogout,
      refreshUser: vi.fn(),
    });

    const user = userEvent.setup();
    render(<Header onMenuClick={mockOnMenuClick} />);

    const menuButton = screen.getByLabelText('開啟選單');
    await user.click(menuButton);

    expect(mockOnMenuClick).toHaveBeenCalledTimes(1);
  });

  it('should handle logout error gracefully', async () => {
    mockLogout.mockRejectedValue(new Error('Logout failed'));

    vi.mocked(usePathname).mockReturnValue('/dashboard');
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      googleLogin: vi.fn(),
      logout: mockLogout,
      refreshUser: vi.fn(),
    });

    const user = userEvent.setup();
    render(<Header />);

    const logoutButton = screen.getByText('登出');
    await user.click(logoutButton);

    // Should still redirect to login even on error
    expect(mockPush).toHaveBeenCalledWith('/login');
  });
});
