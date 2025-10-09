/**
 * Authentication types
 */

export interface User {
  id: number;
  email: string;
  username?: string;
  full_name?: string;
  role: 'student' | 'teacher' | 'admin';
  is_active: boolean;
  is_verified: boolean;
  avatar_url?: string;
  locale: string;
  timezone: string;
  created_at: string;
  last_login_at?: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  is_new_user: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name?: string;
}

export interface GoogleAuthRequest {
  credential: string;
}
