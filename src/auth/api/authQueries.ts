import { useQuery } from '@tanstack/react-query';
import { authKeys } from '@/shared';
import { getCurrentUser } from './authApi';

/**
 * Query hook to fetch current authenticated user
 */
export const useCurrentUserQuery = (enabled = true) => {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: getCurrentUser,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry on 401
  });
};
