import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ChevronLeft, ChevronRight, Square, Home, Grid } from 'lucide-react';

export default function RemoteControl() {
  const router = useRouter();
  const { sessionId } = router.query;
  const [connected, setConnected] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);

  useEffect(() => {
    if (sessionId) {
      connectToPresenter();
    }
  }, [sessionId]);

  const connectToPresenter = () => {
    // Listen for messages from presenter
    const handleMessage = (event) => {
      if (event.data.type === 'REMOTE_SYNC') {
        setCurrentSlide(event.data.currentSlide);
        setTotalSlides(event.data.totalSlides);
        setConnected(true);
      }
    };

    window.addEventListener('message', handleMessage);

    // Request initial sync
    if (window.opener && !window.opener.closed) {
      window.opener.postMessage({
        type: 'REMOTE_CONNECTED',
        sessionId
      }, '*');
    }

    return () => window.removeEventListener('message', handleMessage);
  };

  const sendCommand = (command, data = {}) => {
    if (window.opener && !window.opener.closed) {
      window.opener.postMessage({
        type: 'REMOTE_COMMAND',
        command,
        sessionId,
        ...data
      }, '*');
    } else {
      // Fallback: Use localStorage for communication
      localStorage.setItem('remoteCommand', JSON.stringify({
        command,
        timestamp: Date.now(),
        ...data
      }));
    }
  };

  const nextSlide = () => sendCommand('NEXT_SLIDE');
  const prevSlide = () => sendCommand('PREV_SLIDE');
  const goToFirst = () => sendCommand('FIRST_SLIDE');
  const goToLast = () => sendCommand('LAST_SLIDE');
  const showGrid = () => sendCommand('SHOW_GRID');

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
      if (touchStartX - touchEndX > 50) {
        nextSlide(); // Swipe left
      }
      if (touchEndX - touchStartX > 50) {
        prevSlide(); // Swipe right
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

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
            <h1 className="text-2xl font-bold">Remote Control</h1>
            <p className="text-sm opacity-75">
              {connected ? '🟢 Connected' : '🔴 Connecting...'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{currentSlide + 1}</div>
            <div className="text-sm opacity-75">of {totalSlides}</div>
          </div>
        </div>
      </div>

      {/* Swipe Area */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">👆</div>
          <p className="text-2xl font-semibold mb-2">Swipe to Navigate</p>
          <p className="text-lg opacity-75">← Swipe left for next slide</p>
          <p className="text-lg opacity-75">Swipe right for previous →</p>
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 bg-black/30 backdrop-blur-md">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <button
            onClick={goToFirst}
            className="bg-white/20 hover:bg-white/30 p-6 rounded-xl transition active:scale-95"
          >
            <Home size={32} className="mx-auto" />
            <p className="text-sm mt-2">First</p>
          </button>
          <button
            onClick={showGrid}
            className="bg-white/20 hover:bg-white/30 p-6 rounded-xl transition active:scale-95"
          >
            <Grid size={32} className="mx-auto" />
            <p className="text-sm mt-2">Grid</p>
          </button>
          <button
            onClick={goToLast}
            className="bg-white/20 hover:bg-white/30 p-6 rounded-xl transition active:scale-95"
          >
            <Square size={32} className="mx-auto" />
            <p className="text-sm mt-2">Last</p>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="bg-white/20 hover:bg-white/30 disabled:opacity-30 p-8 rounded-xl transition active:scale-95 flex flex-col items-center justify-center"
          >
            <ChevronLeft size={48} />
            <p className="text-lg font-bold mt-2">Previous</p>
          </button>
          <button
            onClick={nextSlide}
            disabled={currentSlide >= totalSlides - 1}
            className="bg-white/20 hover:bg-white/30 disabled:opacity-30 p-8 rounded-xl transition active:scale-95 flex flex-col items-center justify-center"
          >
            <ChevronRight size={48} />
            <p className="text-lg font-bold mt-2">Next</p>
          </button>
        </div>

        <div className="mt-4 bg-white/10 rounded-lg p-4">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300"
              style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}