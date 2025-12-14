import { createContext, useCallback, useMemo, type ReactNode } from "react";
import {
  useCurrentUserQuery,
  useSignInMutation,
  useSignUpMutation,
  useSignOut,
} from "../api";
import type {
  AuthContextType,
  SignInCredentials,
  SignUpCredentials,
} from "../types";

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const token = localStorage.getItem("auth_token");
  const { data: user, isLoading } = useCurrentUserQuery(!!token);
  const signInMutation = useSignInMutation();
  const signUpMutation = useSignUpMutation();
  const performSignOut = useSignOut();

  const signIn = useCallback(
    async (credentials: SignInCredentials) => {
      await signInMutation.mutateAsync(credentials);
    },
    [signInMutation]
  );

  const signUp = useCallback(
    async (credentials: SignUpCredentials) => {
      await signUpMutation.mutateAsync(credentials);
    },
    [signUpMutation]
  );

  const signOut = useCallback(() => {
    performSignOut();
  }, [performSignOut]);

  const value = useMemo<AuthContextType>(
    () => ({
      user: user ?? null,
      token,
      isAuthenticated: !!user && !!token,
      isLoading,
      signIn,
      signUp,
      signOut,
    }),
    [user, token, isLoading, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
