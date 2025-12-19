/**
 * RouletteWheel Component
 * Interactive roulette wheel for selecting a random winner
 */
import { useState } from 'react';
import { customerService } from '../services/customerService';
import type { Customer } from '../types/customer';
import { useTheme } from '../contexts/ThemeContext';

interface RouletteWheelProps {
  onWinnerSelected?: (winner: Customer) => void;
}

export function RouletteWheel({ onWinnerSelected }: RouletteWheelProps) {
  const { theme } = useTheme();
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Customer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [pendingWinner, setPendingWinner] = useState<Customer | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<number>(1);

  const spinWheel = async () => {
    if (isSpinning) return;

    setError(null);
    setWinner(null);
    setIsSpinning(true);

    try {
      // Fetch random winner
      const selectedWinner = await customerService.getRandomWinner();

      // Animate wheel spinning
      const spinDuration = 3000; // 3 seconds
      const spinRotations = 5 + Math.random() * 3; // 5-8 full rotations
      const finalRotation = rotation + (spinRotations * 360);

      setRotation(finalRotation);

      // Wait for animation to complete
      setTimeout(() => {
        setIsSpinning(false);
        setPendingWinner(selectedWinner);
        setShowNotificationDialog(true);
      }, spinDuration);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to select winner. Make sure there are eligible customers.';
      setError(errorMessage);
      setIsSpinning(false);
    }
  };

  const handleSendNotification = async (sendNow: boolean) => {
    if (!pendingWinner) return;

    try {
      // Mark customer as winner with selected place
      await customerService.markAsWinner(pendingWinner.id, selectedPlace);

      // Send notification
      const notificationResult = await customerService.notifyWinner(pendingWinner.id, sendNow);

      setWinner(pendingWinner);
      setShowNotificationDialog(false);

      // Show success message
      if (sendNow && notificationResult.email_sent_to) {
        alert(`Winner marked! Notification sent to ${notificationResult.email_sent_to}`);
      } else {
        alert(`Winner marked! ${notificationResult.message}`);
      }

      if (onWinnerSelected) {
        onWinnerSelected(pendingWinner);
      }
    } catch (err) {
      setError('Failed to mark winner or send notification');
      console.error(err);
    } finally {
      setPendingWinner(null);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-3 sm:p-6">
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 text-gray-800">
          Luck of a Draw
        </h2>

        {/* Roulette Wheel */}
        <div className="flex justify-center items-center mb-6 sm:mb-8">
          <div className="relative w-48 h-48 sm:w-64 sm:h-64">
            {/* Wheel */}
            <div
              className={`w-full h-full rounded-full border-4 sm:border-8 border-${theme.colors.primary} bg-gradient-to-br ${theme.gradients.button} shadow-2xl flex items-center justify-center relative overflow-hidden`}
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? 'transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
              }}
            >
              {/* Segment Lines */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 left-1/2 w-0.5 h-full bg-white opacity-30"
                  style={{
                    transform: `translateX(-50%) rotate(${i * 30}deg)`,
                    transformOrigin: 'center center',
                  }}
                />
              ))}

              {/* Center Content */}
              <div className="text-white text-center relative z-10">
                <div className="text-2xl sm:text-4xl mb-1 sm:mb-2">{theme.emojis.main}</div>
                <div className="font-bold text-xs sm:text-base">SPIN</div>
              </div>
            </div>

            {/* Pointer */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 sm:-translate-y-4">
              <div className="w-0 h-0 border-l-6 sm:border-l-8 border-r-6 sm:border-r-8 border-t-6 sm:border-t-8 border-l-transparent border-r-transparent border-t-red-600"></div>
            </div>
          </div>
        </div>

        {/* Spin Button */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <button
            onClick={spinWheel}
            disabled={isSpinning}
            className={`px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r ${theme.gradients.button} text-white font-bold text-base sm:text-lg rounded-full disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transform hover:scale-105 transition-all shadow-lg`}
          >
            {isSpinning ? 'Spinning...' : 'Spin the Wheel!'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center text-sm sm:text-base">
            {error}
          </div>
        )}

        {/* Winner Display */}
        {winner && !isSpinning && !showNotificationDialog && (
          <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-400 rounded-lg text-center animate-pulse">
            <div className="text-3xl sm:text-4xl mb-2">{theme.emojis.celebration[0]}</div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Congratulations!
            </h3>
            <p className="text-lg sm:text-xl text-gray-800 font-semibold mb-1">
              {winner.name}
            </p>
            <p className="text-xs sm:text-sm text-gray-600">{winner.email}</p>
            <div className="mt-3 sm:mt-4 text-xl sm:text-2xl space-x-1 sm:space-x-2">
              {theme.emojis.decoration.slice(0, 5).map((emoji, index) => (
                <span key={index}>{emoji}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Notification Dialog Modal */}
      {showNotificationDialog && pendingWinner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl p-5 sm:p-8 max-w-md w-full animate-fadeIn">
            <div className="text-center mb-4 sm:mb-6">
              <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">{theme.emojis.celebration[0]}</div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Winner Selected!
              </h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                <p className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
                  {pendingWinner.name}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 break-all">{pendingWinner.email}</p>
                <div className="mt-3 p-3 bg-gray-50 border border-gray-100 rounded text-left">
                  <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Feedback:</p>
                  <p className="text-sm text-gray-700 italic">"{pendingWinner.feedback}"</p>
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
                Assign a prize place and send a notification:
              </p>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Prize</label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((p) => (
                    <button
                      key={p}
                      onClick={() => setSelectedPlace(p)}
                      className={`py-2 px-3 rounded-lg border-2 font-bold text-sm transition-all ${
                        selectedPlace === p 
                          ? 'border-blue-600 bg-blue-50 text-blue-700' 
                          : 'border-gray-200 bg-gray-50 text-gray-400 hover:border-gray-300'
                      }`}
                    >
                      {p}{p === 1 ? 'st' : p === 2 ? 'nd' : 'rd'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => handleSendNotification(true)}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md text-sm sm:text-base"
              >
                Send Now
              </button>
              <button
                onClick={() => handleSendNotification(false)}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all shadow-md text-sm sm:text-base"
              >
                Send Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
