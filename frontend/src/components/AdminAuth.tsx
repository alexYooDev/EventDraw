/**
 * AdminAuth Component
 * Simple password protection for admin dashboard
 */
import { useState } from 'react';
import type { FormEvent } from 'react';

interface AdminAuthProps {
  onAuthenticated: () => void;
}

// In production, this should be moved to environment variables and validated on the backend
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD; // Change this to a secure password

export function AdminAuth({ onAuthenticated }: AdminAuthProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password === ADMIN_PASSWORD) {
      // Store authentication in session storage
      sessionStorage.setItem('admin_authenticated', 'true');
      onAuthenticated();
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-800">
            Admin Access
          </h2>
          <p className="text-center text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
            Enter the admin password to access the dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Enter password"
                required
                autoFocus
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs sm:text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm sm:text-base cursor-pointer"
            >
              Access Dashboard
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-4 sm:mt-6 text-center">
            Note: For production use, implement proper authentication with JWT tokens and backend validation.
          </p>
        </div>
      </div>
    </div>
  );
}
