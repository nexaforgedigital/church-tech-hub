import React from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-orange-900 flex items-center justify-center p-4">
          <div className="text-center text-white max-w-lg">
            <AlertTriangle className="mx-auto mb-6 text-yellow-400" size={80} />
            
            <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
            
            <p className="text-gray-300 mb-8">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition"
              >
                <RefreshCw size={20} />
                Refresh Page
              </button>
              
              <Link href="/">
                <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition">
                  <Home size={20} />
                  Go Home
                </button>
              </Link>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-8 bg-black/30 rounded-xl p-4 text-left">
                <div className="text-xs text-red-300 font-mono overflow-auto">
                  {this.state.error.toString()}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;