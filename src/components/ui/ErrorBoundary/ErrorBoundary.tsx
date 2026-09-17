import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorState } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/Button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorState
          title="Application error"
          description={this.state.error?.message ?? 'An unexpected error occurred.'}
          action={
            <>
              <Button variant="primary" onClick={this.handleReset}>
                Try again
              </Button>
              <Button variant="secondary" onClick={() => window.location.assign('/')}>
                Go home
              </Button>
            </>
          }
        />
      );
    }

    return this.props.children;
  }
}
