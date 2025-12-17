/**
 * Main App Component
 * Luck of a Draw - Customer Feedback Roulette
 *
 * Routes:
 * / - Public feedback page (customer-facing)
 * /admin - Admin dashboard (business owner)
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { PublicFeedbackPage } from './pages/PublicFeedbackPage';
import { AdminDashboard } from './pages/AdminDashboard';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicFeedbackPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
