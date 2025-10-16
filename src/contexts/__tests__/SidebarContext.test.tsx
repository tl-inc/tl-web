import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { SidebarProvider, useSidebar } from '../SidebarContext';

describe('SidebarContext', () => {
  describe('SidebarProvider', () => {
    it('should provide default values', () => {
      const { result } = renderHook(() => useSidebar(), {
        wrapper: SidebarProvider,
      });

      expect(result.current.mobileOpen).toBe(false);
      expect(typeof result.current.setMobileOpen).toBe('function');
      expect(typeof result.current.toggleMobile).toBe('function');
    });

    it('should update mobileOpen state', () => {
      const { result } = renderHook(() => useSidebar(), {
        wrapper: SidebarProvider,
      });

      act(() => {
        result.current.setMobileOpen(true);
      });

      expect(result.current.mobileOpen).toBe(true);

      act(() => {
        result.current.setMobileOpen(false);
      });

      expect(result.current.mobileOpen).toBe(false);
    });

    it('should toggle mobileOpen state', () => {
      const { result } = renderHook(() => useSidebar(), {
        wrapper: SidebarProvider,
      });

      expect(result.current.mobileOpen).toBe(false);

      act(() => {
        result.current.toggleMobile();
      });

      expect(result.current.mobileOpen).toBe(true);

      act(() => {
        result.current.toggleMobile();
      });

      expect(result.current.mobileOpen).toBe(false);
    });
  });

  describe('useSidebar hook', () => {
    it('should throw error when used outside SidebarProvider', () => {
      // Suppress console.error for this test
      const consoleError = console.error;
      console.error = () => {};

      expect(() => {
        renderHook(() => useSidebar());
      }).toThrow('useSidebar must be used within a SidebarProvider');

      console.error = consoleError;
    });
  });
});
