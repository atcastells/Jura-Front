// Auth feature public API
// Only export what other modules can use

// Types
export type {
  User,
  SignInCredentials,
  SignUpCredentials,
  AuthResponse,
  AuthState,
  AuthContextType,
} from './types';

// Hooks
export { useAuth } from './hooks';
export { useCurrentUser, useMaybeCurrentUser } from './hooks';

// Context & Provider
export { AuthProvider, useAuthContext } from './context';

// Components
export { LoginForm, SignUpForm, AuthLayout, ProtectedRoute } from './components';
