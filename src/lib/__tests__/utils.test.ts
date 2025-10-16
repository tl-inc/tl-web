import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn (className merger)', () => {
  it('should merge class names', () => {
    expect(cn('btn', 'btn-primary')).toBe('btn btn-primary');
  });

  it('should handle conditional classes', () => {
    expect(cn('btn', false && 'hidden', 'active')).toBe('btn active');
  });

  it('should handle undefined and null', () => {
    expect(cn('btn', undefined, null, 'active')).toBe('btn active');
  });

  it('should merge tailwind classes correctly', () => {
    // twMerge should handle conflicting classes
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('should handle empty input', () => {
    expect(cn()).toBe('');
  });
});
