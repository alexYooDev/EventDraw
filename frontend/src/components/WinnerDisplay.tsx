import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { Customer } from '../types/customer';

interface WinnerDisplayProps {
  winner: Customer;
  showCard?: boolean;
}

export function WinnerDisplay({ winner, showCard = true }: WinnerDisplayProps) {
  useEffect(() => {
    // Trigger a multi-burst confetti celebration
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const content = (
    <>
      {/* Celebration Emoji */}
      <div className="text-5xl my-5 animate-bounce">
        🎉
      </div>

      {/* Title */}
      <h2 className={`text-3xl font-bold mb-4 ${showCard ? 'text-gray-900' : 'text-gray-900'}`}>
        We Have a Winner!
      </h2>

      {/* Winner Details */}
      <div className={`rounded-xl p-6 mb-6 ${showCard ? 'bg-white shadow-inner border border-gray-100' : 'bg-yellow-50/50 border border-yellow-200/50 shadow-sm'}`}>
        <div className="flex flex-col items-center mb-2">
          <p className="text-xl font-bold text-gray-900 tracking-tight">
            {winner.name}
          </p>
          <p className="text-xs text-gray-500 font-medium">
            {winner.email}
          </p>
        </div>

        {winner.feedback && (
          <div className="border-t border-gray-100 pt-4 mt-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Customer Feedback</p>
            <p className="text-md sm:text-sm text-gray-800 leading-relaxed font-medium italic italic-font-serif">
              "{winner.feedback}"
            </p>
          </div>
        )}
      </div>

      {/* Additional Info */}
      <p className="text-sm text-gray-600">
        Selected on {new Date(winner.created_at).toLocaleDateString()}
      </p>
    </>
  );

  return (
    <div className={`w-full mx-auto ${showCard ? 'max-w-2xl p-6' : ''}`}>
      {showCard ? (
        <div className="bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-50 border-4 border-yellow-400 rounded-lg shadow-2xl p-8 text-center transform hover:scale-105 transition-transform">
          {content}
        </div>
      ) : (
        <div className="text-center">
          {content}
        </div>
      )}
    </div>
  );
}
