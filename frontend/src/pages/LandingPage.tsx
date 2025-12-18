/**
 * LandingPage
 * Shows the prizes and details of the lucky draw event
 */
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

export function LandingPage() {
  const { theme } = useTheme();

  const prizes = [
    {
      place: '1st Prize',
      name: 'Whipped Shampoo for Eyelash',
      link: 'https://akinolashes.com/products/whipped-cream-lash-shampoo-100ml?srsltid=AfmBOoruidoJa-wnnACeZ145N8BIxR1Sb673uRFCE6jTtBdqWKPeWv6Y',
      description: 'Premium creamy shampoo for eyelash health and longevity.',
      image: '🧴'
    },
    {
      place: '2nd Prize',
      name: 'Eyelash Coating Gel',
      link: 'https://www.lashadvance.com.au/product-page/eyelash-brow-coating-serum?srsltid=AfmBOoo3M4Lnl1A17skBQ2wDWxWUaG476qpfBDLGtPhyQCRwCOqBXhtK8H4',
      description: 'Strengthening serum for bold and beautiful lashes.',
      image: '✨'
    },
    {
      place: '3rd Prize',
      name: 'Eyelash Adhesive Remover',
      link: '#',
      description: 'Gentle and effective adhesive remover for safe lash removal.',
      image: '🧼'
    }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.background}`}>
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
          <h1 className={`text-3xl sm:text-5xl font-extrabold text-center bg-gradient-to-r ${theme.gradients.header} bg-clip-text text-transparent`}>
            {theme.emojis.main} Luck of a Draw
          </h1>
          <p className="text-center text-gray-600 mt-2 text-base sm:text-lg max-w-2xl mx-auto">
            Share your experience with us and you could win one of our premium eyelash care rewards!
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-4">🏆 Amazing Prizes Await!</h2>
          <p className="text-gray-600">We appreciate your feedback and want to reward our valued customers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {prizes.map((prize, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 border border-gray-100"
            >
              <div className={`p-6 text-center bg-gradient-to-br ${index === 0 ? 'from-yellow-50 to-orange-50' : index === 1 ? 'from-gray-50 to-blue-50' : 'from-orange-50 to-red-50'}`}>
                <div className="text-6xl mb-4">{prize.image}</div>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider ${
                  index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                  index === 1 ? 'bg-gray-100 text-gray-700' : 
                  'bg-orange-100 text-orange-700'
                }`}>
                  {prize.place}
                </span>
              </div>
              <div className="p-6 flex flex-col h-full">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{prize.name}</h3>
                <p className="text-gray-600 text-sm mb-6 flex-grow">
                  {prize.description}
                </p>
                <a 
                  href={prize.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center justify-center transition-colors"
                >
                  View Product Details <span className="ml-1">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/feedback"
            className={`inline-block px-10 py-4 rounded-full text-white font-bold text-lg shadow-2xl transform transition-all duration-300 hover:scale-110 active:scale-95 bg-gradient-to-r ${theme.gradients.button}`}
          >
            Enter the Draw Now! {theme.emojis.celebration[0]}
          </Link>
          <p className="mt-4 text-sm text-gray-500 italic">
            * By entering, you agree to our Terms and Conditions.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-12 py-8 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm mb-4">© 2025 Didi Beauty Studio. All rights reserved.</p>
          <div className="flex justify-center space-x-6">
            <Link to="/privacy" className="text-gray-400 hover:text-gray-600 text-xs">Privacy Policy</Link>
            <Link to="/login" className="text-gray-400 hover:text-gray-600 text-xs">Admin Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
