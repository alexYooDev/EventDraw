/**
 * WinnerDisplay Component
 * Displays winner information in a celebratory format
 */
import type { Customer } from '../types/customer';

interface WinnerDisplayProps {
  winner: Customer;
}

export function WinnerDisplay({ winner }: WinnerDisplayProps) {
  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-50 border-4 border-yellow-400 rounded-lg shadow-2xl p-8 text-center transform hover:scale-105 transition-transform">
        {/* Celebration Emoji */}
        <div className="text-6xl mb-4 animate-bounce">
          🎉
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          We Have a Winner!
        </h2>

        {/* Winner Details */}
        <div className="bg-white rounded-lg p-6 shadow-inner mb-4">
          <p className="text-2xl font-bold text-gray-900 mb-2">
            {winner.name}
          </p>
          <p className="text-lg text-gray-600 mb-4">
            {winner.email}
          </p>

          {winner.feedback && (
            <div className="border-t border-gray-200 pt-4 mt-4">
              <p className="text-sm text-gray-500 mb-2">Their Feedback:</p>
              <p className="text-gray-700 italic">"{winner.feedback}"</p>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <p className="text-sm text-gray-600">
          Selected on {new Date(winner.created_at).toLocaleDateString()}
        </p>

        {/* Confetti decoration */}
        <div className="mt-4 text-2xl space-x-2">
          <span>🎊</span>
          <span>✨</span>
          <span>🎈</span>
          <span>🏆</span>
          <span>🎁</span>
        </div>
      </div>
    </div>
  );
}
