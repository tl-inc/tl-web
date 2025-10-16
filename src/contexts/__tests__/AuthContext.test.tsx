import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { authService } from '@/lib/api/auth';
import type { User, LoginRequest, RegisterRequest } from '@/types/auth';

// Mock authService
vi.mock('@/lib/api/auth');

describe('AuthContext', () => {
  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    username: 'testuser',
    created_at: '2025-01-01T00:00:00Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('useAuth hook', () => {
    it('should throw error when used outside AuthProvider', () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = vi.fn();

      expect(() => {
        renderHook(() => useAuth());
      }).toThrow('useAuth must be used within an AuthProvider');

      console.error = originalError;
    });

    it('should return auth context when used within provider', () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      expect(result.current).toHaveProperty('user');
      expect(result.current).toHaveProperty('loading');
      expect(result.current).toHaveProperty('login');
      expect(result.current).toHaveProperty('register');
      expect(result.current).toHaveProperty('googleLogin');
      expect(result.current).toHaveProperty('logout');
      expect(result.current).toHaveProperty('refreshUser');
    });
  });

  describe('Initial load', () => {
    it('should start with loading true or complete loading quickly', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      // Check that loading eventually becomes false
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('should load user when access token exists', async () => {
      localStorage.setItem('access_token', 'valid-token');
      vi.mocked(authService.getCurrentUser).mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(authService.getCurrentUser).toHaveBeenCalledTimes(1);
    });

    it('should clear invalid token on load error', async () => {
      localStorage.setItem('access_token', 'invalid-token');
      vi.mocked(authService.getCurrentUser).mockRejectedValue(new Error('Unauthorized'));

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(localStorage.getItem('access_token')).toBeNull();
    });

    it('should not load user when no token exists', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(authService.getCurrentUser).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should set user on successful login', async () => {
      const loginData: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      vi.mocked(authService.login).mockResolvedValue({
        user: mockUser,
        access_token: 'new-token',
        refresh_token: 'refresh-token',
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.login(loginData);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(authService.login).toHaveBeenCalledWith(loginData);
    });

    it('should throw error on login failure', async () => {
      const loginData: LoginRequest = {
        email: 'wrong@example.com',
        password: 'wrongpass',
      };

      vi.mocked(authService.login).mockRejectedValue(new Error('Invalid credentials'));

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.login(loginData);
        })
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('register', () => {
    it('should set user on successful registration', async () => {
      const registerData: RegisterRequest = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
      };

      vi.mocked(authService.register).mockResolvedValue({
        user: mockUser,
        access_token: 'new-token',
        refresh_token: 'refresh-token',
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.register(registerData);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(authService.register).toHaveBeenCalledWith(registerData);
    });
  });

  describe('googleLogin', () => {
    it('should set user on successful Google login', async () => {
      const credential = 'google-credential-token';

      vi.mocked(authService.googleLogin).mockResolvedValue({
        user: mockUser,
        access_token: 'google-token',
        refresh_token: 'refresh-token',
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.googleLogin(credential);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(authService.googleLogin).toHaveBeenCalledWith({ credential });
    });
  });

  describe('logout', () => {
    it('should clear user on logout', async () => {
      localStorage.setItem('access_token', 'valid-token');
      vi.mocked(authService.getCurrentUser).mockResolvedValue(mockUser);
      vi.mocked(authService.logout).mockResolvedValue();

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(authService.logout).toHaveBeenCalledTimes(1);
    });
  });

  describe('refreshUser', () => {
    it('should reload user data', async () => {
      localStorage.setItem('access_token', 'valid-token');
      const updatedUser = { ...mockUser, username: 'updateduser' };

      vi.mocked(authService.getCurrentUser)
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(updatedUser);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      await act(async () => {
        await result.current.refreshUser();
      });

      expect(result.current.user).toEqual(updatedUser);
      expect(authService.getCurrentUser).toHaveBeenCalledTimes(2);
    });
  });
});
