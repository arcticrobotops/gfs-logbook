'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div role="alert" className="flex flex-col items-center justify-center py-12 px-4 border-2 border-navy/20">
            <p className="font-mono text-xs tracking-[0.25em] text-brass mb-2">&#9670;</p>
            <p className="font-mono text-xs tracking-[0.2em] text-navy font-semibold mb-1">
              COMPONENT ERROR
            </p>
            <p className="font-sans text-sm text-graphite text-center">
              Something went wrong loading this section.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-4 font-mono text-xs tracking-[0.2em] uppercase px-5 py-2 border-[1.5px] border-navy/30 text-navy hover:bg-navy/5 transition-colors"
            >
              RETRY
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
