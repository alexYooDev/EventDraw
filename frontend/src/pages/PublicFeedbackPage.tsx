/**
 * PublicFeedbackPage
 * Public-facing page for customers to submit feedback
 * Accessible via link sent to their email
 */
import { Link } from 'react-router-dom';
import { CustomerForm } from '../components/CustomerForm';
import { useTheme } from '../contexts/ThemeContext';

export function PublicFeedbackPage() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.background}`}>
      {/* Header */}
      <header className="bg-white shadow-sm w-full">
        <div className="w-full px-4 py-4 sm:py-6 flex justify-between items-center">
          <h1 className={`text-xl sm:text-2xl font-bold bg-gradient-to-r ${theme.gradients.header} bg-clip-text text-transparent`}>
            {theme.emojis.main} Luck of a Draw
          </h1>
          <Link to="/" className="text-gray-400 hover:text-gray-600 text-xs sm:text-sm font-medium transition-colors">
            ← Back to Prizes
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 py-6 sm:py-8">
        <CustomerForm />
      </main>

      {/* Footer */}
      <footer className="bg-white mt-8 sm:mt-12 py-4 sm:py-6 shadow-inner w-full">
        <div className="w-full px-4 text-center text-gray-600">
          <p className="text-xs sm:text-sm">Built with React + TypeScript + Tailwind CSS + FastAPI</p>
        </div>
      </footer>
    </div>
  );
}
