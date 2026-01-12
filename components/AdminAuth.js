import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminAuth({ children, title = "Admin Access" }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authStatus = sessionStorage.getItem('churchassist-admin-auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    setError('');
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'churchassist2025';
    
    if (password === adminPassword) {
      sessionStorage.setItem('churchassist-admin-auth', 'true');
      setIsAuthenticated(true);
    } else {
      setError('Invalid password. Please try again.');
      setPassword('');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('churchassist-admin-auth');
    setIsAuthenticated(false);
    setPassword('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-white"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm">
            ← Back to Home
          </Link>

          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600 mt-2">Enter admin password to continue</p>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter password"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none pr-12 text-gray-900"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}
            
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition shadow-lg"
            >
              Access Admin Panel
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-gray-400">
            Default password[REDACTED:PASSWORD]25
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gray-900 text-white py-2 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold">🔐 Admin Mode</span>
          <Link href="/" className="text-gray-400 hover:text-white text-sm">
            ← Back to Site
          </Link>
        </div>
        <button
          onClick={handleLogout}
          className="text-gray-400 hover:text-white text-sm"
        >
          Logout
        </button>
      </div>
      
      {children}
    </div>
  );
}