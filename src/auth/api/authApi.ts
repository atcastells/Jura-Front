import { apiClient } from '@/shared';
import type { User, AuthResponse, SignInCredentials, SignUpCredentials } from '../types';

const AUTH_ENDPOINTS = {
  signIn: '/auth/signin',
  signUp: '/auth/signup',
  me: '/auth/me',
} as const;

/**
 * Sign in with email and password
 */
export const signIn = async (credentials: SignInCredentials): Promise<AuthResponse> => {
  return apiClient.post<AuthResponse>(AUTH_ENDPOINTS.signIn, credentials);
};

/**
 * Sign up with email, password, and organization
 */
export const signUp = async (credentials: SignUpCredentials): Promise<User> => {
  return apiClient.post<User>(AUTH_ENDPOINTS.signUp, credentials);
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = async (): Promise<User> => {
  return apiClient.get<User>(AUTH_ENDPOINTS.me);
};
