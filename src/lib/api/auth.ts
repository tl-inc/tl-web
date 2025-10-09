/**
 * Authentication API client
 */
import axios from 'axios';
import type { AuthResponse, LoginRequest, RegisterRequest, GoogleAuthRequest, User } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const authApi = axios.create({
  baseURL: `${API_URL}/auth`,
  withCredentials: true, // Important for httpOnly cookies
});

// Add access token to requests
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  /**
   * Register with email and password
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await authApi.post<AuthResponse>('/register', data);
    // Store access token
    localStorage.setItem('access_token', response.data.access_token);
    return response.data;
  },

  /**
   * Login with email and password
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await authApi.post<AuthResponse>('/login', data);
    // Store access token
    localStorage.setItem('access_token', response.data.access_token);
    return response.data;
  },

  /**
   * Login with Google OAuth
   */
  async googleLogin(data: GoogleAuthRequest): Promise<AuthResponse> {
    const response = await authApi.post<AuthResponse>('/google', data);
    // Store access token
    localStorage.setItem('access_token', response.data.access_token);
    return response.data;
  },

  /**
   * Logout
   */
  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      await authApi.post('/logout', { refresh_token: refreshToken });
    }
    // Clear tokens
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User> {
    const response = await authApi.get<User>('/me');
    return response.data;
  },

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    const response = await authApi.post<AuthResponse>('/refresh', {
      refresh_token: refreshToken,
    });
    // Update access token
    localStorage.setItem('access_token', response.data.access_token);
    return response.data;
  },
};
