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
      place: '2nd Place',
      name: 'Eyelash Coating Gel',
      link: 'https://www.lashadvance.com.au/product-page/eyelash-brow-coating-serum?srsltid=AfmBOoo3M4Lnl1A17skBQ2wDWxWUaG476qpfBDLGtPhyQCRwCOqBXhtK8H4',
      description: 'Strengthening serum for bold and beautiful lashes.',
      image: '/eyelash_coating_gel.png',
      color: 'gray',
      height: 'h-64 sm:h-72',
      order: 'order-1'
    },
    {
      place: '1st Place',
      name: 'Whipped Shampoo for Eyelash',
      link: 'https://akinolashes.com/products/whipped-cream-lash-shampoo-100ml?srsltid=AfmBOoruidoJa-wnnACeZ145N8BIxR1Sb673uRFCE6jTtBdqWKPeWv6Y',
      description: 'Premium creamy shampoo for eyelash health and longevity.',
      image: '/whipped_cream_lash_shampoo.png',
      color: 'yellow',
      height: 'h-72 sm:h-80',
      order: 'order-first md:order-2',
      featured: true
    },
    {
      place: '3rd Place',
      name: 'Eyelash Removal Service',
      link: '#',
      description: 'Professional and gentle eyelash removal by our experts.',
      image: '/eyelash_removal_service.png',
      color: 'orange',
      height: 'h-56 sm:h-64',
      order: 'order-3'
    }
  ];

  return (
    <div className={`min-h-screen w-full bg-gradient-to-br ${theme.colors.background}`}>
      {/* Header */}
      <header className="bg-white shadow-md w-full">
        <div className="w-full px-4 py-6 sm:py-8">
          <h1 className={`text-3xl sm:text-5xl font-extrabold text-center bg-gradient-to-r ${theme.gradients.header} bg-clip-text text-transparent`}>
            {theme.emojis.main} Luck of a Draw
          </h1>
          <p className="text-center text-gray-600 mt-2 text-base sm:text-lg max-w-2xl mx-auto">
            Share your experience with us and you could win one of our premium eyelash care rewards!
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full py-8 sm:py-16">
        <div className="text-center mb-12 sm:mb-20 px-4">
          <h2 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4 tracking-tight">🏆 Amazing Prizes Await!</h2>
          <div className="h-1.5 w-24 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">We appreciate your feedback and want to reward our valued customers with these premium treatments.</p>
        </div>

        {/* Podium Prize Layout */}
        <div className="flex flex-col md:flex-row items-end justify-center gap-4 lg:gap-8 mb-20 px-4 sm:px-8 lg:px-12 w-full">
          {[prizes[0], prizes[1], prizes[2]].map((prize, index) => (
            <div 
              key={index} 
              className={`flex flex-col items-center w-full md:w-1/3 ${prize.order} ${prize.featured ? 'z-10' : 'z-0'}`}
            >
              <div className={`w-full bg-white rounded-t-3xl shadow-2xl overflow-hidden border-x border-t border-gray-100 flex flex-col items-center transition-all duration-500 hover:translate-y-[-8px] hover:rounded-b-3xl ${prize.height}`}>
                <div className="relative w-full h-full group">
                  <img 
                    src={prize.image} 
                    alt={prize.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500`}></div>
                  <div className="absolute top-4 left-4">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg ${
                      prize.color === 'yellow' ? 'bg-yellow-400 text-black' : 
                      prize.color === 'gray' ? 'bg-gray-300 text-gray-800' : 
                      'bg-orange-500 text-white'
                    }`}>
                      {prize.place}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Podium Base */}
              <div className={`w-full p-6 text-center shadow-xl border-x border-b border-gray-50 flex flex-col items-center ${
                prize.color === 'yellow' ? 'bg-yellow-50 rounded-b-3xl border-t-4 border-yellow-400 pt-8' : 
                prize.color === 'gray' ? 'bg-gray-50 rounded-b-2xl border-t-4 border-gray-300' : 
                'bg-orange-50 rounded-b-2xl border-t-4 border-orange-400'
              }`}>
                <h3 className={`text-xl font-black mb-2 ${prize.featured ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'}`}>{prize.name}</h3>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed max-w-md">
                  {prize.description}
                </p>
                <a 
                  href={prize.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`text-xs font-bold uppercase tracking-widest flex items-center transition-all ${
                    prize.color === 'yellow' ? 'text-yellow-700 hover:text-yellow-600' : 
                    prize.color === 'gray' ? 'text-gray-600 hover:text-gray-500' : 
                    'text-orange-700 hover:text-orange-600'
                  }`}
                >
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center px-4">
          <Link
            to="/feedback"
            className={`inline-block px-10 py-4 rounded-full text-white font-bold text-lg shadow-2xl transform transition-all duration-300 hover:scale-110 active:scale-95 bg-gradient-to-r ${theme.gradients.button}`}
          >
            Enter the Draw Now! {theme.emojis.celebration[0]}
          </Link>
          <p className="mt-4 text-sm text-gray-500 italic">
            * By entering, you agree to our <a href="/privacy" className="underline">Terms and Conditions</a>.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-12 py-8 shadow-inner w-full">
        <div className="w-full px-4 text-center">
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
