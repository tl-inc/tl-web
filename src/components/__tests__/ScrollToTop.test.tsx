import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@/__tests__/utils/test-utils';
import { ScrollToTop } from '@/components/ScrollToTop';
import { usePathname } from 'next/navigation';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

describe('ScrollToTop', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.scrollTo
    global.scrollTo = vi.fn();
  });

  it('should render without crashing', () => {
    vi.mocked(usePathname).mockReturnValue('/');
    const { container } = render(<ScrollToTop />);
    // Component returns null, so container should be empty
    expect(container.firstChild).toBeNull();
  });

  it('should scroll to top on pathname change', () => {
    const { rerender } = render(<ScrollToTop />);

    // Change pathname
    vi.mocked(usePathname).mockReturnValue('/new-path');
    rerender(<ScrollToTop />);

    // Should have called scrollTo
    expect(global.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('should scroll to top on initial mount', () => {
    vi.mocked(usePathname).mockReturnValue('/');
    render(<ScrollToTop />);

    expect(global.scrollTo).toHaveBeenCalledWith(0, 0);
  });
});
