import { Component } from 'react';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo);
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex items-center justify-center p-8">
            <div className="max-w-md rounded-lg border border-error-200 bg-error-50 p-6">
              <h2 className="mb-2 text-lg font-semibold text-error-800">
                Something went wrong
              </h2>
              <p className="text-sm text-error-600">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
