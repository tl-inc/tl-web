/**
 * Authentication API client
 */
import { apiClient } from '@/lib/api';
import { tokenStorage } from '@/lib/storage';
import type { AuthResponse, LoginRequest, RegisterRequest, GoogleAuthRequest, User } from '@/types/auth';

export const authService = {
  /**
   * Register with email and password
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    // Store tokens
    tokenStorage.setAccessToken(response.data.access_token);
    tokenStorage.setRefreshToken(response.data.refresh_token);
    return response.data;
  },

  /**
   * Login with email and password
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    // Store tokens
    tokenStorage.setAccessToken(response.data.access_token);
    tokenStorage.setRefreshToken(response.data.refresh_token);
    return response.data;
  },

  /**
   * Login with Google OAuth
   */
  async googleLogin(data: GoogleAuthRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/google', data);
    // Store tokens
    tokenStorage.setAccessToken(response.data.access_token);
    tokenStorage.setRefreshToken(response.data.refresh_token);
    return response.data;
  },

  /**
   * Logout
   */
  async logout(): Promise<void> {
    const refreshToken = tokenStorage.getRefreshToken();
    if (refreshToken) {
      try {
        await apiClient.post('/auth/logout', { refresh_token: refreshToken });
      } catch (error) {
        // Ignore logout errors, still clear local tokens
      }
    }
    // Clear tokens
    tokenStorage.clearTokens();
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  /**
   * Refresh access token (handled automatically by apiClient interceptor)
   */
  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    const response = await apiClient.post<AuthResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    });
    // Update tokens
    tokenStorage.setAccessToken(response.data.access_token);
    if (response.data.refresh_token) {
      tokenStorage.setRefreshToken(response.data.refresh_token);
    }
    return response.data;
  },
};
