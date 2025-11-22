import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ChevronLeft, ChevronRight, Square, Home, Grid } from 'lucide-react';
import { listenToSession, sendCommand, updateSession } from '../lib/firebase';

export default function RemoteControl() {
  const router = useRouter();
  const { sessionId } = router.query;
  const [connected, setConnected] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  const [error, setError] = useState('');

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

  const handleCommand = async (command) => {
    if (!sessionId) return;
    try {
      await sendCommand(sessionId, command);
    } catch (err) {
      setError('Failed to send command');
      console.error(err);
    }
  };

  const nextSlide = () => handleCommand('NEXT_SLIDE');
  const prevSlide = () => handleCommand('PREV_SLIDE');
  const goToFirst = () => handleCommand('FIRST_SLIDE');
  const goToLast = () => handleCommand('LAST_SLIDE');
  const showGridView = () => handleCommand('SHOW_GRID');

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
          nextSlide(); // Swipe left
        } else {
          prevSlide(); // Swipe right
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
      {/* Header */}
      <div className="p-6 bg-black/30 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">🎮 Remote Control</h1>
            <p className="text-sm opacity-75 flex items-center gap-2">
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
            <div className="text-3xl font-bold">{currentSlide + 1}</div>
            <div className="text-sm opacity-75">of {totalSlides}</div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-4 mt-4 bg-red-500/20 backdrop-blur border border-red-500 rounded-lg p-3 text-center">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Swipe Area */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-6xl mb-6 animate-bounce">👆</div>
          <p className="text-3xl font-bold mb-4">Swipe to Navigate</p>
          <div className="space-y-2 text-lg opacity-90">
            <p>← Swipe right for previous</p>
            <p>Swipe left for next →</p>
          </div>
          
          {!connected && totalSlides === 0 && (
            <div className="mt-8 bg-yellow-500/20 backdrop-blur rounded-xl p-6 max-w-md mx-auto">
              <div className="text-4xl mb-3">⏳</div>
              <p className="text-lg font-semibold mb-2">Waiting for presenter...</p>
              <p className="text-sm opacity-75">Make sure presenter control is open on your computer</p>
            </div>
          )}

          {connected && (
            <div className="mt-8 bg-green-500/20 backdrop-blur rounded-xl p-4 max-w-md mx-auto">
              <p className="text-sm">✅ Successfully connected to presentation!</p>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 bg-black/30 backdrop-blur-md">
        <div className="grid grid-cols-3 gap-3 mb-4">
          <button
            onClick={goToFirst}
            disabled={!connected}
            className="bg-white/20 hover:bg-white/30 disabled:opacity-30 p-5 rounded-xl transition active:scale-95 flex flex-col items-center justify-center"
          >
            <Home size={28} />
            <p className="text-xs mt-2">First</p>
          </button>
          <button
            onClick={showGridView}
            disabled={!connected}
            className="bg-white/20 hover:bg-white/30 disabled:opacity-30 p-5 rounded-xl transition active:scale-95 flex flex-col items-center justify-center"
          >
            <Grid size={28} />
            <p className="text-xs mt-2">Grid</p>
          </button>
          <button
            onClick={goToLast}
            disabled={!connected}
            className="bg-white/20 hover:bg-white/30 disabled:opacity-30 p-5 rounded-xl transition active:scale-95 flex flex-col items-center justify-center"
          >
            <Square size={28} />
            <p className="text-xs mt-2">Last</p>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={prevSlide}
            disabled={!connected || currentSlide === 0}
            className="bg-white/20 hover:bg-white/30 disabled:opacity-30 p-8 rounded-xl transition active:scale-95 flex flex-col items-center justify-center"
          >
            <ChevronLeft size={48} />
            <p className="text-lg font-bold mt-2">Previous</p>
          </button>
          <button
            onClick={nextSlide}
            disabled={!connected || currentSlide >= totalSlides - 1}
            className="bg-white/20 hover:bg-white/30 disabled:opacity-30 p-8 rounded-xl transition active:scale-95 flex flex-col items-center justify-center"
          >
            <ChevronRight size={48} />
            <p className="text-lg font-bold mt-2">Next</p>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 bg-white/10 rounded-lg p-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Progress</span>
            <span>{totalSlides > 0 ? Math.round(((currentSlide + 1) / totalSlides) * 100) : 0}%</span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
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