'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    // TODO: 可以整合錯誤追蹤服務 (Sentry, etc.)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

// Default fallback component
function DefaultErrorFallback({ error }: { error?: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <svg
              className="w-8 h-8 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            哎呀，發生錯誤了
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            我們遇到了一些問題，請重新整理頁面再試一次。
          </p>
        </div>

        {process.env.NODE_ENV === 'development' && error && (
          <div className="mb-6 text-left bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-xs font-mono text-red-600 dark:text-red-400 font-semibold mb-2">
              開發模式錯誤訊息:
            </p>
            <pre className="text-xs font-mono text-gray-700 dark:text-gray-300 overflow-auto">
              {error.message}
              {error.stack && (
                <>
                  {'\n\n'}
                  {error.stack}
                </>
              )}
            </pre>
          </div>
        )}

        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          重新整理頁面
        </button>
      </div>
    </div>
  );
}
