import { useState, type FormEvent } from "react";
import { useAuth } from "../hooks";
import { cn } from "@/shared";

interface LoginFormProps {
  onSuccess?: () => void;
  onSignUpClick?: () => void;
}

export const LoginForm = ({ onSuccess, onSignUpClick }: LoginFormProps) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signIn({ email, password });
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-neutral-700"
        >
          Email address
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={cn(
            "mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2",
            "shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500",
            "disabled:bg-neutral-100 disabled:cursor-not-allowed"
          )}
          disabled={isLoading}
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-neutral-700"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={cn(
            "mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2",
            "shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500",
            "disabled:bg-neutral-100 disabled:cursor-not-allowed"
          )}
          disabled={isLoading}
        />
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-md bg-error-50 p-3 text-sm text-error-700"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className={cn(
          "w-full rounded-md bg-primary-500 px-4 py-2 text-sm font-semibold text-white",
          "hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
          "disabled:bg-primary-300 disabled:cursor-not-allowed"
        )}
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </button>

      {onSignUpClick && (
        <p className="text-center text-sm text-neutral-600">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSignUpClick}
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Sign up
          </button>
        </p>
      )}
    </form>
  );
};
