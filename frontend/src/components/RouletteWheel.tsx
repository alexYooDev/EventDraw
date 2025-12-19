/**
 * RouletteWheel Component
 * Interactive roulette wheel for selecting a random winner
 */
import { useEffect, useState } from 'react';
import { customerService } from '../services/customerService';
import { organizationService, type Prize } from '../services/organizationService';
import type { Customer } from '../types/customer';
import { useTheme } from '../contexts/ThemeContext';
import { WinnerDisplay } from './WinnerDisplay';

interface RouletteWheelProps {
  onWinnerSelected?: (winner: Customer) => void;
}

export function RouletteWheel({ onWinnerSelected }: RouletteWheelProps) {
  const { theme, updatePrimaryColor } = useTheme();
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Customer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [pendingWinner, setPendingWinner] = useState<Customer | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<number>(1);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [loadingPrizes, setLoadingPrizes] = useState(true);

  useEffect(() => {
    const fetchOrgData = async () => {
      try {
        const orgData = await organizationService.getMyOrg();
        if (orgData.primary_color) {
            updatePrimaryColor(orgData.primary_color);
        }
        const prizeData = await organizationService.getPublicPrizes(orgData.slug);
        setPrizes(prizeData.sort((a, b) => a.place - b.place));
      } catch (err) {
        console.error('Failed to fetch org/prizes:', err);
      } finally {
        setLoadingPrizes(false);
      }
    };
    fetchOrgData();
  }, [updatePrimaryColor]);

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
              className={`w-full h-full rounded-full border-4 sm:border-8 border-${theme.colors.primary} shadow-2xl flex items-center justify-center relative overflow-hidden`}
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? 'transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
                borderColor: theme.colors.primary.startsWith('#') ? theme.colors.primary : undefined,
                background: `conic-gradient(
                  #EF4444 0deg 30deg,
                  #F59E0B 30deg 60deg,
                  #10B981 60deg 90deg,
                  #3B82F6 90deg 120deg,
                  #6366F1 120deg 150deg,
                  #8B5CF6 150deg 180deg,
                  #EC4899 180deg 210deg,
                  #F43F5E 210deg 240deg,
                  #84CC16 240deg 270deg,
                  #06B6D4 270deg 300deg,
                  #F97316 300deg 330deg,
                  #A855F7 330deg 360deg
                )`
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

              {/* Center Hub */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full shadow-lg flex items-center justify-center z-10 border-4 border-gray-100">
                  <div className="text-center">
                    <div className="text-xl sm:text-3xl mb-0.5">{theme.emojis.main}</div>
                    <div className="font-bold text-[10px] sm:text-xs text-gray-800 tracking-tighter">SPIN</div>
                  </div>
                </div>
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
            disabled={isSpinning || loadingPrizes}
            className={`px-6 sm:px-8 py-2 sm:py-3 text-white font-bold text-base sm:text-lg rounded-full disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed cursor-pointer transform hover:scale-105 transition-all shadow-lg bg-gradient-to-r ${theme.gradients.button}`}
          >
            {isSpinning ? 'Spinning...' : loadingPrizes ? 'Loading...' : 'Spin the Wheel!'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center text-sm sm:text-base">
            {error}
          </div>
        )}

        {/* Winner Display Integration */}
        {winner && !isSpinning && !showNotificationDialog && (
          <WinnerDisplay winner={winner} />
        )}
      </div>

      {/* Notification Dialog Modal */}
      {showNotificationDialog && pendingWinner && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl p-5 sm:p-8 max-w-md w-full animate-fadeIn overflow-y-auto max-h-[90vh]">
            <div className="mb-6">
              <WinnerDisplay winner={pendingWinner} showCard={false} />
            </div>
            
            <div className="text-center mb-6">
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Prize</label>
                <div className="flex flex-col gap-2">
                  {prizes.length > 0 ? prizes.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPlace(p.place)}
                      className={`py-2 px-4 rounded-lg border-2 font-bold text-sm transition-all text-left flex justify-between items-center cursor-pointer ${
                        selectedPlace === p.place 
                          ? 'border-blue-600 bg-blue-50 text-blue-700' 
                          : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      <span>{p.place}{p.place === 1 ? 'st' : p.place === 2 ? 'nd' : 'rd'} Place</span>
                      <span className="text-xs opacity-70">{p.name}</span>
                    </button>
                  )) : (
                    <p className="text-xs text-gray-500">No prizes configured. Defaulting to numbers.</p>
                  )}
                  {prizes.length === 0 && [1, 2, 3].map((p) => (
                    <button
                      key={p}
                      onClick={() => setSelectedPlace(p)}
                      className={`py-2 px-3 rounded-lg border-2 font-bold text-sm transition-all cursor-pointer ${
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
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md text-sm sm:text-base cursor-pointer"
              >
                Send Now
              </button>
              <button
                onClick={() => handleSendNotification(false)}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all shadow-md text-sm sm:text-base cursor-pointer"
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
