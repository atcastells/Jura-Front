import { useAuthContext } from '../context';

/**
 * Hook to access auth state and actions
 * Shorthand for useAuthContext
 */
export const useAuth = () => {
  return useAuthContext();
};
