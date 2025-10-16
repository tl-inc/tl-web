import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authService } from '../auth';

// Create a proper mock for apiClient
const mockPost = vi.fn();
const mockGet = vi.fn();

vi.mock('@/lib/api', () => ({
  apiClient: {
    post: (...args: any[]) => mockPost(...args),
    get: (...args: any[]) => mockGet(...args),
  },
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockPost.mockClear();
    mockGet.mockClear();
  });

  describe('register', () => {
    it('should register user and store tokens', async () => {
      const mockResponse = {
        data: {
          access_token: 'access_123',
          refresh_token: 'refresh_123',
          user: { id: 1, email: 'test@example.com' },
        },
      };

      mockPost.mockResolvedValue(mockResponse);

      const result = await authService.register({
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      });

      expect(mockPost).toHaveBeenCalledWith('/auth/register', {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      });
      expect(result).toEqual(mockResponse.data);
      expect(localStorage.getItem('access_token')).toBe('access_123');
      expect(localStorage.getItem('refresh_token')).toBe('refresh_123');
    });
  });

  describe('login', () => {
    it('should login user and store tokens', async () => {
      const mockResponse = {
        data: {
          access_token: 'access_456',
          refresh_token: 'refresh_456',
          user: { id: 2, email: 'user@example.com' },
        },
      };

      mockPost.mockResolvedValue(mockResponse);

      const result = await authService.login({
        email: 'user@example.com',
        password: 'password456',
      });

      expect(mockPost).toHaveBeenCalledWith('/auth/login', {
        email: 'user@example.com',
        password: 'password456',
      });
      expect(result).toEqual(mockResponse.data);
      expect(localStorage.getItem('access_token')).toBe('access_456');
      expect(localStorage.getItem('refresh_token')).toBe('refresh_456');
    });
  });

  describe('googleLogin', () => {
    it('should login with Google and store tokens', async () => {
      const mockResponse = {
        data: {
          access_token: 'google_access',
          refresh_token: 'google_refresh',
          user: { id: 3, email: 'google@example.com' },
        },
      };

      mockPost.mockResolvedValue(mockResponse);

      const result = await authService.googleLogin({
        credential: 'google_credential_token',
      });

      expect(mockPost).toHaveBeenCalledWith('/auth/google', {
        credential: 'google_credential_token',
      });
      expect(result).toEqual(mockResponse.data);
      expect(localStorage.getItem('access_token')).toBe('google_access');
      expect(localStorage.getItem('refresh_token')).toBe('google_refresh');
    });
  });

  describe('logout', () => {
    it('should call logout endpoint and clear tokens', async () => {
      localStorage.setItem('access_token', 'access_token');
      localStorage.setItem('refresh_token', 'refresh_token');

      mockPost.mockResolvedValue({ data: {} });

      await authService.logout();

      expect(mockPost).toHaveBeenCalledWith('/auth/logout', {
        refresh_token: 'refresh_token',
      });
      expect(localStorage.getItem('access_token')).toBeNull();
      expect(localStorage.getItem('refresh_token')).toBeNull();
    });

    it('should clear tokens even when logout endpoint fails', async () => {
      localStorage.setItem('access_token', 'access_token');
      localStorage.setItem('refresh_token', 'refresh_token');

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockPost.mockRejectedValue(new Error('Logout failed'));

      // Should not throw
      await authService.logout();

      expect(localStorage.getItem('access_token')).toBeNull();
      expect(localStorage.getItem('refresh_token')).toBeNull();

      consoleErrorSpy.mockRestore();
    });

    it('should handle logout when no refresh token exists', async () => {
      await authService.logout();

      expect(mockPost).not.toHaveBeenCalled();
      expect(localStorage.getItem('access_token')).toBeNull();
      expect(localStorage.getItem('refresh_token')).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('should fetch current user', async () => {
      const mockUser = {
        data: {
          id: 1,
          email: 'current@example.com',
          username: 'currentuser',
        },
      };

      mockGet.mockResolvedValue(mockUser);

      const result = await authService.getCurrentUser();

      expect(mockGet).toHaveBeenCalledWith('/auth/me');
      expect(result).toEqual(mockUser.data);
    });
  });

  describe('refreshToken', () => {
    it('should refresh access token', async () => {
      localStorage.setItem('refresh_token', 'old_refresh');

      const mockResponse = {
        data: {
          access_token: 'new_access',
          refresh_token: 'new_refresh',
        },
      };

      mockPost.mockResolvedValue(mockResponse);

      const result = await authService.refreshToken();

      expect(mockPost).toHaveBeenCalledWith('/auth/refresh', {
        refresh_token: 'old_refresh',
      });
      expect(result).toEqual(mockResponse.data);
      expect(localStorage.getItem('access_token')).toBe('new_access');
      expect(localStorage.getItem('refresh_token')).toBe('new_refresh');
    });

    it('should update access token without new refresh token', async () => {
      localStorage.setItem('refresh_token', 'old_refresh');

      const mockResponse = {
        data: {
          access_token: 'new_access',
        },
      };

      mockPost.mockResolvedValue(mockResponse);

      await authService.refreshToken();

      expect(localStorage.getItem('access_token')).toBe('new_access');
      expect(localStorage.getItem('refresh_token')).toBe('old_refresh');
    });

    it('should throw error when no refresh token exists', async () => {
      await expect(authService.refreshToken()).rejects.toThrow('No refresh token available');
    });
  });
});
