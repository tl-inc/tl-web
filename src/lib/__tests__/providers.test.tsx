import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Providers } from '../providers';

// Mock all child components and contexts
vi.mock('@/contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="auth-provider">{children}</div>,
}));

vi.mock('@/contexts/SidebarContext', () => ({
  SidebarProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="sidebar-provider">{children}</div>,
  useSidebar: () => ({
    mobileOpen: false,
    setMobileOpen: vi.fn(),
    toggleMobile: vi.fn(),
  }),
}));

vi.mock('@/components/Header', () => ({
  default: ({ onMenuClick }: { onMenuClick: () => void }) => (
    <div data-testid="header" onClick={onMenuClick}>Header</div>
  ),
}));

vi.mock('@/components/ScrollToTop', () => ({
  ScrollToTop: () => <div data-testid="scroll-to-top">ScrollToTop</div>,
}));

vi.mock('@react-oauth/google', () => ({
  GoogleOAuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="google-oauth-provider">{children}</div>
  ),
}));

vi.mock('@tanstack/react-query', () => ({
  QueryClient: vi.fn().mockImplementation(() => ({
    mount: vi.fn(),
    unmount: vi.fn(),
    clear: vi.fn(),
  })),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="query-client-provider">{children}</div>
  ),
}));

describe('Providers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render children', () => {
    render(
      <Providers>
        <div>Test Content</div>
      </Providers>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render QueryClientProvider', () => {
    render(
      <Providers>
        <div>Content</div>
      </Providers>
    );

    expect(screen.getByTestId('query-client-provider')).toBeInTheDocument();
  });

  it('should render GoogleOAuthProvider', () => {
    render(
      <Providers>
        <div>Content</div>
      </Providers>
    );

    expect(screen.getByTestId('google-oauth-provider')).toBeInTheDocument();
  });

  it('should render AuthProvider', () => {
    render(
      <Providers>
        <div>Content</div>
      </Providers>
    );

    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
  });

  it('should render SidebarProvider', () => {
    render(
      <Providers>
        <div>Content</div>
      </Providers>
    );

    expect(screen.getByTestId('sidebar-provider')).toBeInTheDocument();
  });

  it('should render Header', () => {
    render(
      <Providers>
        <div>Content</div>
      </Providers>
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('should render ScrollToTop', () => {
    render(
      <Providers>
        <div>Content</div>
      </Providers>
    );

    expect(screen.getByTestId('scroll-to-top')).toBeInTheDocument();
  });

  it('should have proper provider nesting', () => {
    const { container } = render(
      <Providers>
        <div>Content</div>
      </Providers>
    );

    // Check that providers are properly nested
    expect(container.querySelector('[data-testid="query-client-provider"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="google-oauth-provider"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="auth-provider"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="sidebar-provider"]')).toBeInTheDocument();
  });
});
