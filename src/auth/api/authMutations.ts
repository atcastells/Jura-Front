import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authKeys } from '@/shared';
import { signIn, signUp } from './authApi';
import type { SignInCredentials, SignUpCredentials, AuthResponse } from '../types';

const TOKEN_KEY = 'auth_token';

/**
 * Mutation hook for user sign in
 */
export const useSignInMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: SignInCredentials) => signIn(credentials),
    onSuccess: (data: AuthResponse) => {
      // Store token
      localStorage.setItem(TOKEN_KEY, data.token);
      // Update user in cache
      queryClient.setQueryData(authKeys.me(), data.user);
    },
  });
};

/**
 * Mutation hook for user sign up
 */
export const useSignUpMutation = () => {
  return useMutation({
    mutationFn: (credentials: SignUpCredentials) => signUp(credentials),
  });
};

/**
 * Hook to handle sign out
 */
export const useSignOut = () => {
  const queryClient = useQueryClient();

  return () => {
    localStorage.removeItem(TOKEN_KEY);
    queryClient.setQueryData(authKeys.me(), null);
    queryClient.invalidateQueries({ queryKey: authKeys.all });
  };
};
