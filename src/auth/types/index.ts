// User entity
export interface User {
  id: string;
  email: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

// Auth credentials for sign in
export interface SignInCredentials {
  email: string;
  password: string;
}

// Auth credentials for sign up
export interface SignUpCredentials {
  email: string;
  password: string;
}

// Response from auth endpoints
export interface AuthResponse {
  token: string;
  user: User;
}

// Auth context state
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Auth context actions
export interface AuthActions {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  signOut: () => void;
}

// Combined auth context type
export type AuthContextType = AuthState & AuthActions;
