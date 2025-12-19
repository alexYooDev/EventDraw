/**
 * PublicFeedbackPage
 * Public-facing page for customers to submit feedback
 * Accessible via link sent to their email
 */
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CustomerForm } from '../components/CustomerForm';
import { useTheme } from '../contexts/ThemeContext';
import { organizationService, type Organization } from '../services/organizationService';

export function PublicFeedbackPage() {
  const { theme, updatePrimaryColor } = useTheme();
  const { slug } = useParams<{ slug: string }>();
  const activeSlug = slug || 'didi-beauty';

  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrg = async () => {
      try {
        const orgData = await organizationService.getPublicOrg(activeSlug);
        setOrg(orgData);
        
        // Update the global theme with the organization's primary color
        if (orgData.primary_color) {
          updatePrimaryColor(orgData.primary_color);
        }
      } catch (err) {
        console.error('Failed to fetch org:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrg();
  }, [activeSlug, updatePrimaryColor]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.background}`}>
      {/* Header */}
      <header className="bg-white shadow-sm w-full">
        <div className="w-full px-4 py-4 sm:py-6 flex justify-between items-center">
          <h1 className={`text-xl sm:text-2xl font-bold bg-gradient-to-r ${theme.gradients.header} bg-clip-text text-transparent`}>
            {theme.emojis.main} {org?.name || 'Luck of a Draw'}
          </h1>
          <Link to={`/draw/${activeSlug}`} className="text-gray-400 hover:text-gray-600 text-xs sm:text-sm font-medium transition-colors">
            ← Back to Prizes
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 py-6 sm:py-8">
        <CustomerForm organization_slug={activeSlug} />
      </main>

      {/* Footer */}
      <footer className="bg-white mt-8 sm:mt-12 py-4 sm:py-6 shadow-inner w-full">
        <div className="w-full px-4 text-center text-gray-600">
          <p className="text-xs sm:text-sm">© 2025 {org?.name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
