import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { ChevronLeft, ChevronRight, Square, Home } from 'lucide-react';
import { listenToSession, sendCommand, updateSession } from '../lib/firebase';

export default function RemoteControl() {
  const router = useRouter();
  const { sessionId } = router.query;
  const [connected, setConnected] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  const [error, setError] = useState('');
  const [lastCommand, setLastCommand] = useState('');
  
  // 🔥 NEW: Debouncing to prevent rapid clicks
  const lastCommandTime = useRef(0);
  const COMMAND_COOLDOWN = 300; // 300ms between commands

  useEffect(() => {
    if (!sessionId) return;

    // Announce remote is connected
    updateSession(sessionId, {
      remoteConnected: true
    });

    // Listen to session updates
    const unsubscribe = listenToSession(sessionId, (data) => {
      if (data) {
        setCurrentSlide(data.currentSlide || 0);
        setTotalSlides(data.totalSlides || 0);
        setConnected(data.status === 'active');
        setError('');
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
      // Announce disconnect
      updateSession(sessionId, {
        remoteConnected: false
      });
    };
  }, [sessionId]);

  // 🔥 IMPROVED: Debounced command handler
  const handleCommand = async (command) => {
    if (!sessionId) return;
    
    // Prevent rapid-fire commands
    const now = Date.now();
    if (now - lastCommandTime.current < COMMAND_COOLDOWN) {
      console.log('⏱️ Command ignored (cooldown)');
      return;
    }
    lastCommandTime.current = now;
    
    console.log('📤 Sending command:', command);
    setLastCommand(command);
    
    try {
      await sendCommand(sessionId, command);
      console.log('✅ Command sent successfully');
      
      // Haptic feedback on mobile
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    } catch (err) {
      setError('Failed to send command');
      console.error('❌ Command error:', err);
    }
    
    // Clear visual feedback
    setTimeout(() => setLastCommand(''), 300);
  };

  const nextSlide = () => handleCommand('NEXT_SLIDE');
  const prevSlide = () => handleCommand('PREV_SLIDE');
  const goToFirst = () => handleCommand('FIRST_SLIDE');
  const goToLast = () => handleCommand('LAST_SLIDE');

  // Swipe gesture support
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };

    const handleSwipe = () => {
      const swipeDistance = touchStartX - touchEndX;
      if (Math.abs(swipeDistance) > 50) {
        if (swipeDistance > 0) {
          nextSlide(); // Swipe left = next
        } else {
          prevSlide(); // Swipe right = previous
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [sessionId]);

  if (!sessionId) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-red-600 to-pink-600 text-white p-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Invalid Session</h1>
          <p className="text-xl">Please scan the QR code from the presenter control</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
      {/* Header - MOBILE OPTIMIZED */}
      <div className="p-3 sm:p-4 md:p-6 bg-black/30 backdrop-blur-md flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold">🎮 Remote Control</h1>
            <p className="text-xs sm:text-sm opacity-75 flex items-center gap-2">
              {connected ? (
                <>
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Connected & Live
                </>
              ) : (
                <>
                  <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                  Connecting...
                </>
              )}
            </p>
          </div>
          <div className="text-right">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold">{currentSlide + 1}</div>
            <div className="text-xs sm:text-sm opacity-75">of {totalSlides}</div>
          </div>
        </div>
        
        {/* 🔥 NEW: Visual feedback for commands */}
        {lastCommand && (
          <div className="mt-2 text-xs bg-green-500/30 rounded px-2 py-1 text-center animate-pulse">
            ✓ {lastCommand.replace('_', ' ')}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-4 bg-red-500/20 backdrop-blur border border-red-500 rounded-lg p-3 text-center flex-shrink-0">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Swipe Area */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-hidden">
        <div className="text-center">
          <div className="text-3xl sm:text-4xl md:text-6xl mb-3 sm:mb-4 md:mb-6 animate-bounce">👆</div>
          <p className="text-lg sm:text-xl md:text-3xl font-bold mb-2 md:mb-4">Swipe to Navigate</p>
          <div className="space-y-1 md:space-y-2 text-xs sm:text-sm md:text-lg opacity-90">
            <p>← Swipe right for previous</p>
            <p>Swipe left for next →</p>
          </div>
          
          {!connected && totalSlides === 0 && (
            <div className="mt-4 sm:mt-6 md:mt-8 bg-yellow-500/20 backdrop-blur rounded-xl p-3 sm:p-4 md:p-6 max-w-md mx-auto">
              <div className="text-2xl sm:text-3xl md:text-4xl mb-2 md:mb-3">⏳</div>
              <p className="text-sm sm:text-base md:text-lg font-semibold mb-1 md:mb-2">Waiting for presenter...</p>
              <p className="text-xs md:text-sm opacity-75">Make sure presenter control is open on your computer</p>
            </div>
          )}

          {connected && (
            <div className="mt-4 sm:mt-6 md:mt-8 bg-green-500/20 backdrop-blur rounded-xl p-2 sm:p-3 md:p-4 max-w-md mx-auto">
              <p className="text-xs sm:text-sm">✅ Successfully connected to presentation!</p>
            </div>
          )}
        </div>
      </div>

      {/* Controls - MOBILE OPTIMIZED */}
      <div className="p-3 sm:p-4 md:p-6 bg-black/30 backdrop-blur-md flex-shrink-0">
        {/* Quick Actions - SMALLER ON MOBILE */}
        <div className="grid grid-cols-3 gap-2 md:gap-3 mb-2 sm:mb-3 md:mb-4">
          <button
            onClick={goToFirst}
            disabled={!connected || currentSlide === 0}
            className={`bg-white/20 hover:bg-white/30 active:bg-white/40 disabled:opacity-30 p-2 sm:p-3 md:p-5 rounded-lg md:rounded-xl transition active:scale-95 flex flex-col items-center justify-center ${
              lastCommand === 'FIRST_SLIDE' ? 'ring-2 ring-white/50' : ''
            }`}
          >
            <Home size={16} className="sm:hidden" />
            <Home size={20} className="hidden sm:block md:hidden" />
            <Home size={28} className="hidden md:block" />
            <p className="text-xs mt-1">First</p>
          </button>
          <button
            onClick={goToLast}
            disabled={!connected || currentSlide >= totalSlides - 1}
            className={`bg-white/20 hover:bg-white/30 active:bg-white/40 disabled:opacity-30 p-2 sm:p-3 md:p-5 rounded-lg md:rounded-xl transition active:scale-95 flex flex-col items-center justify-center ${
              lastCommand === 'LAST_SLIDE' ? 'ring-2 ring-white/50' : ''
            }`}
          >
            <Square size={16} className="sm:hidden" />
            <Square size={20} className="hidden sm:block md:hidden" />
            <Square size={28} className="hidden md:block" />
            <p className="text-xs mt-1">Last</p>
          </button>
        </div>

        {/* Main Controls - BIGGER TOUCH TARGETS */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
          <button
            onClick={prevSlide}
            disabled={!connected || currentSlide === 0}
            className={`bg-white/20 hover:bg-white/30 active:bg-white/40 disabled:opacity-30 p-4 sm:p-6 md:p-8 rounded-lg md:rounded-xl transition active:scale-95 flex flex-col items-center justify-center ${
              lastCommand === 'PREV_SLIDE' ? 'ring-4 ring-white/50' : ''
            }`}
          >
            <ChevronLeft size={24} className="sm:hidden" />
            <ChevronLeft size={32} className="hidden sm:block md:hidden" />
            <ChevronLeft size={48} className="hidden md:block" />
            <p className="text-sm sm:text-base md:text-lg font-bold mt-1 sm:mt-2">Previous</p>
          </button>
          <button
            onClick={nextSlide}
            disabled={!connected || currentSlide >= totalSlides - 1}
            className={`bg-white/20 hover:bg-white/30 active:bg-white/40 disabled:opacity-30 p-4 sm:p-6 md:p-8 rounded-lg md:rounded-xl transition active:scale-95 flex flex-col items-center justify-center ${
              lastCommand === 'NEXT_SLIDE' ? 'ring-4 ring-white/50' : ''
            }`}
          >
            <ChevronRight size={24} className="sm:hidden" />
            <ChevronRight size={32} className="hidden sm:block md:hidden" />
            <ChevronRight size={48} className="hidden md:block" />
            <p className="text-sm sm:text-base md:text-lg font-bold mt-1 sm:mt-2">Next</p>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-2 sm:mt-3 md:mt-4 bg-white/10 rounded-lg p-2 sm:p-3 md:p-4">
          <div className="flex justify-between text-xs sm:text-sm mb-2">
            <span>Progress</span>
            <span>{totalSlides > 0 ? Math.round(((currentSlide + 1) / totalSlides) * 100) : 0}%</span>
          </div>
          <div className="h-2 md:h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 transition-all duration-500"
              style={{ width: `${totalSlides > 0 ? ((currentSlide + 1) / totalSlides) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}