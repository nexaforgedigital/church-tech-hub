import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw } from 'lucide-react';

export default function PresenterControl() {
  const router = useRouter();
  const { songId, mode } = router.query;
  
  const [song, setSong] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  useEffect(() => {
    if (songId) {
      fetchSong();
    }
  }, [songId]);

  useEffect(() => {
    if (song && mode) {
      generateSlides();
    }
  }, [song, mode]);

  // Timer
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Listen for slide changes from main presentation
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'SLIDE_CHANGED') {
        setCurrentSlide(event.data.slideIndex);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const fetchSong = async () => {
    try {
      const response = await fetch(`/api/songs/${songId}`);
      const data = await response.json();
      setSong(data);
    } catch (error) {
      console.error('Error fetching song:', error);
    }
  };

  const generateSlides = () => {
    const slideData = [];
    
    slideData.push({
      type: 'title',
      content: song.title,
      subtitle: song.artist
    });

    const linesPerSlide = 2;
    
    if (mode === 'original') {
      for (let i = 0; i < song.lyrics.tamil.length; i += linesPerSlide) {
        const lines = song.lyrics.tamil.slice(i, i + linesPerSlide);
        slideData.push({
          type: 'lyrics',
          content: lines.map(l => l.text).join('\n')
        });
      }
    } else if (mode === 'transliteration') {
      for (let i = 0; i < song.lyrics.transliteration.length; i += linesPerSlide) {
        const lines = song.lyrics.transliteration.slice(i, i + linesPerSlide);
        slideData.push({
          type: 'lyrics',
          content: lines.map(l => l.text).join('\n')
        });
      }
    } else if (mode === 'both') {
      for (let i = 0; i < song.lyrics.tamil.length; i += linesPerSlide) {
        let content = '';
        for (let j = 0; j < linesPerSlide && (i + j) < song.lyrics.tamil.length; j++) {
          content += song.lyrics.tamil[i + j].text + '\n';
          content += song.lyrics.transliteration[i + j].text + '\n\n';
        }
        slideData.push({
          type: 'lyrics',
          content: content.trim()
        });
      }
    }

    slideData.push({
      type: 'end',
      content: 'Thank You'
    });

    setSlides(slideData);
  };

  const changeSlide = (index) => {
    setCurrentSlide(index);
    // Send message to main presentation window
    if (window.opener) {
      window.opener.postMessage({
        type: 'CHANGE_SLIDE',
        slideIndex: index
      }, '*');
    }
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      changeSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      changeSlide(currentSlide - 1);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!song || slides.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-2xl">Loading presenter view...</div>
      </div>
    );
  }

  const currentSlideData = slides[currentSlide];
  const nextSlideData = currentSlide < slides.length - 1 ? slides[currentSlide + 1] : null;

  return (
    <div className="h-screen bg-gray-900 text-white p-6 overflow-hidden">
      <div className="h-full flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{song.title}</h1>
            <p className="text-gray-400">{song.artist}</p>
          </div>
          
          {/* Timer */}
          <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-4">
            <div className="text-4xl font-mono">{formatTime(elapsedTime)}</div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="bg-blue-600 hover:bg-blue-700 p-2 rounded"
              >
                {isTimerRunning ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button
                onClick={() => setElapsedTime(0)}
                className="bg-gray-700 hover:bg-gray-600 p-2 rounded"
              >
                <RotateCcw size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="flex-1 grid grid-cols-2 gap-6 overflow-hidden">
          {/* Current Slide - Large */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">Current Slide ({currentSlide + 1}/{slides.length})</h3>
            <div className="flex-1 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 rounded-lg flex items-center justify-center p-8 relative">
              {currentSlideData.type === 'title' && (
                <div className="text-center">
                  <h2 className="text-4xl font-bold mb-4">{currentSlideData.content}</h2>
                  <p className="text-2xl">{currentSlideData.subtitle}</p>
                </div>
              )}
              {currentSlideData.type === 'lyrics' && (
                <pre className="text-3xl text-center font-sans whitespace-pre-wrap leading-relaxed">
                  {currentSlideData.content}
                </pre>
              )}
              {currentSlideData.type === 'end' && (
                <h2 className="text-4xl font-bold">{currentSlideData.content}</h2>
              )}
              
              <div className="absolute bottom-4 right-4 bg-black/50 px-3 py-1 rounded">
                Slide {currentSlide + 1}
              </div>
            </div>
          </div>

          {/* Next Slide - Preview */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">Next Slide</h3>
            <div className="flex-1 bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg flex items-center justify-center p-6 relative opacity-60">
              {nextSlideData ? (
                <>
                  {nextSlideData.type === 'title' && (
                    <div className="text-center">
                      <h2 className="text-3xl font-bold mb-3">{nextSlideData.content}</h2>
                      <p className="text-xl">{nextSlideData.subtitle}</p>
                    </div>
                  )}
                  {nextSlideData.type === 'lyrics' && (
                    <pre className="text-2xl text-center font-sans whitespace-pre-wrap leading-relaxed">
                      {nextSlideData.content}
                    </pre>
                  )}
                  {nextSlideData.type === 'end' && (
                    <h2 className="text-3xl font-bold">{nextSlideData.content}</h2>
                  )}
                  
                  <div className="absolute bottom-4 right-4 bg-black/50 px-3 py-1 rounded">
                    Slide {currentSlide + 2}
                  </div>
                </>
              ) : (
                <div className="text-2xl text-gray-500">End of Presentation</div>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed px-8 py-4 rounded-lg font-semibold flex items-center gap-2 text-lg"
          >
            <ChevronLeft size={24} />
            Previous
          </button>

          <div className="text-2xl font-bold">
            {currentSlide + 1} / {slides.length}
          </div>

          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed px-8 py-4 rounded-lg font-semibold flex items-center gap-2 text-lg"
          >
            Next
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Slide Thumbnails */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-3">All Slides</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {slides.map((slide, index) => (
              <button
                key={index}
                onClick={() => changeSlide(index)}
                className={`flex-shrink-0 w-32 h-20 rounded border-2 transition ${
                  currentSlide === index 
                    ? 'border-yellow-400 scale-110' 
                    : 'border-gray-600 hover:border-gray-400'
                }`}
              >
                <div className="w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 rounded flex items-center justify-center p-2 relative">
                  <div className="text-xs text-center line-clamp-3">
                    {slide.type === 'title' ? slide.content : slide.type === 'lyrics' ? slide.content.substring(0, 30) + '...' : slide.content}
                  </div>
                  <div className="absolute bottom-1 right-1 bg-black/70 px-1 rounded text-xs">
                    {index + 1}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}