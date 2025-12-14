import { useState, type FormEvent } from "react";
import { useAuth } from "../hooks";
import { cn } from "@/shared";

interface SignUpFormProps {
  onSuccess?: () => void;
  onSignInClick?: () => void;
}

export const SignUpForm = ({ onSuccess, onSignInClick }: SignUpFormProps) => {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      await signUp({ email, password });
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="signup-email"
          className="block text-sm font-medium text-neutral-700"
        >
          Email address
        </label>
        <input
          id="signup-email"
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
          htmlFor="signup-password"
          className="block text-sm font-medium text-neutral-700"
        >
          Password
        </label>
        <input
          id="signup-password"
          type="password"
          required
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={cn(
            "mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2",
            "shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500",
            "disabled:bg-neutral-100 disabled:cursor-not-allowed"
          )}
          disabled={isLoading}
          minLength={8}
        />
      </div>

      <div>
        <label
          htmlFor="confirm-password"
          className="block text-sm font-medium text-neutral-700"
        >
          Confirm Password
        </label>
        <input
          id="confirm-password"
          type="password"
          required
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
        {isLoading ? "Creating account..." : "Create account"}
      </button>

      {onSignInClick && (
        <p className="text-center text-sm text-neutral-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSignInClick}
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Sign in
          </button>
        </p>
      )}
    </form>
  );
};
