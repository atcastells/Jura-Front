import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-neutral-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo placeholder */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-500">
          <span className="text-xl font-bold text-white">J</span>
        </div>

        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-neutral-900">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-2 text-center text-sm text-neutral-600">
            {subtitle}
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
};
