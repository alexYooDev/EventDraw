/**
 * AdminDashboard
 * Business owner dashboard for managing customers and drawing winners
 */
import { useState } from 'react';
import { CustomerList } from '../components/CustomerList';
import { RouletteWheel } from '../components/RouletteWheel';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { themes } from '../types/theme';
import type { ThemeType } from '../types/theme';

type Tab = 'roulette' | 'customers';

export function AdminDashboard() {
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('roulette');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleWinnerSelected = () => {
    // Trigger customer list refresh to show updated winner status
    setRefreshKey(prev => prev + 1);
  };

  const handleLogout = () => {
    logout();
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value as ThemeType);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.background}`}>
      {/* Header */}
      <header className="bg-white shadow-md w-full">
        <div className="w-full px-4 py-4 md:py-6">
          {/* Mobile: Stacked Layout */}
          <div className="flex flex-col md:hidden space-y-3">
            <div className="flex justify-between items-center">
              <select
                value={theme.name}
                onChange={handleThemeChange}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.values(themes).map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.displayName}
                  </option>
                ))}
              </select>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs"
              >
                Logout
              </button>
            </div>
            <div className="text-center">
              <h1 className={`text-2xl font-bold bg-gradient-to-r ${theme.gradients.header} bg-clip-text text-transparent`}>
                {theme.emojis.main} Admin Dashboard
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Manage customers and draw winners
              </p>
            </div>
          </div>

          {/* Desktop: Horizontal Layout with Absolute Positioning */}
          <div className="hidden md:block relative">
            <h1 className={`text-4xl font-bold text-center bg-gradient-to-r ${theme.gradients.header} bg-clip-text text-transparent`}>
              {theme.emojis.main} Admin Dashboard
            </h1>
            <p className="text-center text-gray-600 mt-2">
              Manage customers and draw winners
            </p>

            {/* Theme Selector */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
              <select
                value={theme.name}
                onChange={handleThemeChange}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.values(themes).map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.displayName}
                  </option>
                ))}
              </select>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white shadow-sm w-full">
        <div className="w-full px-4">
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 py-4">
            <button
              onClick={() => setActiveTab('roulette')}
              className={
                activeTab === 'roulette'
                  ? theme.name === 'christmas'
                    ? 'px-4 sm:px-6 py-2 rounded-lg font-medium transition-all shadow-md text-white bg-gradient-to-r from-red-600 to-green-700 text-sm sm:text-base'
                    : theme.name === 'new-year'
                    ? 'px-4 sm:px-6 py-2 rounded-lg font-medium transition-all shadow-md text-white bg-gradient-to-r from-purple-600 to-yellow-500 text-sm sm:text-base'
                    : 'px-4 sm:px-6 py-2 rounded-lg font-medium transition-all shadow-md text-white bg-gradient-to-r from-purple-600 to-purple-600 text-sm sm:text-base'
                  : 'px-4 sm:px-6 py-2 rounded-lg font-medium transition-all shadow-md bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm sm:text-base'
              }
            >
              Draw Winner
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={
                activeTab === 'customers'
                  ? theme.name === 'christmas'
                    ? 'px-4 sm:px-6 py-2 rounded-lg font-medium transition-all shadow-md text-white bg-yellow-500 text-sm sm:text-base'
                    : theme.name === 'new-year'
                    ? 'px-4 sm:px-6 py-2 rounded-lg font-medium transition-all shadow-md text-white bg-pink-500 text-sm sm:text-base'
                    : 'px-4 sm:px-6 py-2 rounded-lg font-medium transition-all shadow-md text-white bg-pink-700 text-sm sm:text-base'
                  : 'px-4 sm:px-6 py-2 rounded-lg font-medium transition-all shadow-md bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm sm:text-base'
              }
            >
              View Customers
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="w-full px-4 py-8">
        {activeTab === 'roulette' && <RouletteWheel onWinnerSelected={handleWinnerSelected} />}
        {activeTab === 'customers' && <CustomerList key={refreshKey} />}
      </main>

      {/* Footer */}
      <footer className="bg-white mt-12 py-6 shadow-inner w-full">
        <div className="w-full px-4 text-center text-gray-600">
          <p className="text-xs">Built with React + TypeScript + Tailwind CSS + FastAPI</p>
        </div>
      </footer>
    </div>
  );
}
