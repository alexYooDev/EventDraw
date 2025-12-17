/**
 * PublicFeedbackPage
 * Public-facing page for customers to submit feedback
 * Accessible via link sent to their email
 */
import { CustomerForm } from '../components/CustomerForm';
import { useTheme } from '../contexts/ThemeContext';

export function PublicFeedbackPage() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.background}`}>
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
          <h1 className={`text-2xl sm:text-4xl font-bold text-center bg-gradient-to-r ${theme.gradients.header} bg-clip-text text-transparent`}>
            {theme.emojis.main} Luck of a Draw
          </h1>
          <p className="text-center text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base px-2">
            Share your feedback and enter for a chance to win amazing prizes!
          </p>
          {/* Theme decorations */}
          <div className="text-center mt-2 text-xl sm:text-2xl space-x-1 sm:space-x-2">
            {theme.emojis.decoration.slice(0, 5).map((emoji, index) => (
              <span key={index}>{emoji}</span>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <CustomerForm />
      </main>

      {/* Footer */}
      <footer className="bg-white mt-8 sm:mt-12 py-4 sm:py-6 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <p className="text-xs sm:text-sm">Built with React + TypeScript + Tailwind CSS + FastAPI</p>
        </div>
      </footer>
    </div>
  );
}
