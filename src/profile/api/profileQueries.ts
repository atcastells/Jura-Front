import { useQuery } from '@tanstack/react-query';
import { profileKeys } from '@/shared';
import { getMyProfile } from './profileApi';

/**
 * Query hook to fetch current user's profile
 */
export const useMyProfileQuery = (enabled = true) => {
  return useQuery({
    queryKey: profileKeys.me(),
    queryFn: getMyProfile,
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes - profile changes frequently during conversation
    retry: false,
  });
};
