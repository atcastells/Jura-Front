import { useAuthContext } from '../context';
import type { User } from '../types';

/**
 * Hook to get the current authenticated user
 * Throws if user is not authenticated
 */
export const useCurrentUser = (): User => {
  const { user, isAuthenticated } = useAuthContext();

  if (!isAuthenticated || !user) {
    throw new Error('useCurrentUser must be used when user is authenticated');
  }

  return user;
};

/**
 * Hook to get the current user or null if not authenticated
 */
export const useMaybeCurrentUser = (): User | null => {
  const { user } = useAuthContext();
  return user;
};
