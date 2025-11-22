import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ChevronLeft, ChevronRight, X, Grid as GridIcon, Maximize } from 'lucide-react';
import { songStorage } from '../../utils/songStorage';

export default function PresentationMode() {
  const router = useRouter();
  const { songId, mode = 'original', bg = 'gradient-blue', font = 'Arial', fontSize = '32' } = router.query;
  
  const [song, setSong] = useState(null);
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const backgrounds = {
    'gradient-blue': '#1e3a8a',
    'gradient-purple': '#6b21a8',
    'gradient-green': '#15803d',
    'gradient-red': '#991b1b',
    'black': '#000000',
    'dark-blue': '#1e293b',
  };

  // FIXED: Only fetch when songId is available
  useEffect(() => {
    if (!songId) return; // Wait for songId to be available
    
    fetchSong();
    
    // Auto-fullscreen
    const timer = setTimeout(async () => {
      try {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.log('Fullscreen not supported');
      }
    }, 500);

    // Hide instructions after first view
    const hasSeenInstructions = localStorage.getItem('hasSeenPresentInstructions');
    if (hasSeenInstructions) {
      setShowInstructions(false);
    } else {
      setTimeout(() => {
        setShowInstructions(false);
        localStorage.setItem('hasSeenPresentInstructions', 'true');
      }, 5000);
    }

    return () => clearTimeout(timer);
  }, [songId]); // Added songId as dependency

  const fetchSong = async () => {
    // FIXED: Added safety check
    if (!songId) {
      console.error('No songId provided');
      return;
    }

    try {
      // Check if it's a custom song
      if (songId.toString().startsWith('custom-')) {
        const customSongs = songStorage.getCustomSongs();
        const customSong = customSongs.find(s => s.id === songId);
        
        if (customSong) {
          setSong(customSong);
          generateSlides(customSong);
          return;
        } else {
          console.error('Custom song not found');
          alert('Custom song not found');
          router.push('/lyrics');
          return;
        }
      }
      
      // Try to fetch from API
      const response = await fetch(`/api/songs/${songId}`);
      if (response.ok) {
        const data = await response.json();
        setSong(data);
        generateSlides(data);
      } else {
        alert('Song not found');
        router.push('/lyrics');
      }
    } catch (error) {
      console.error('Error fetching song:', error);
      // Try custom songs as fallback
      const customSongs = songStorage.getCustomSongs();
      const customSong = customSongs.find(s => s.id === songId);
      
      if (customSong) {
        setSong(customSong);
        generateSlides(customSong);
      } else {
        alert('Error loading song');
        router.push('/lyrics');
      }
    }
  };

  // Rest of your code stays the same...
  const generateSlides = (songData) => {
    if (!songData || !songData.lyrics) {
      console.error('No lyrics data available');
      return;
    }

    const slideData = [];
    const linesPerSlide = 2;
    
    // Safety: Initialize with empty arrays if undefined
    const lyrics = {
      tamil: songData.lyrics.tamil || [],
      english: songData.lyrics.english || [],
      transliteration: songData.lyrics.transliteration || []
    };

    // Title slide
    slideData.push({
      type: 'title',
      content: songData.title
    });

    // Generate lyric slides based on mode
    if (mode === 'original' && lyrics.tamil.length > 0) {
      for (let i = 0; i < lyrics.tamil.length; i += linesPerSlide) {
        const lines = lyrics.tamil.slice(i, i + linesPerSlide);
        slideData.push({
          type: 'lyrics',
          content: lines.map(l => l.text).join('\n')
        });
      }
    } else if (mode === 'transliteration' && lyrics.transliteration.length > 0) {
      for (let i = 0; i < lyrics.transliteration.length; i += linesPerSlide) {
        const lines = lyrics.transliteration.slice(i, i + linesPerSlide);
        slideData.push({
          type: 'lyrics',
          content: lines.map(l => l.text).join('\n')
        });
      }
    } else if (mode === 'both') {
      const maxLength = Math.max(lyrics.tamil.length, lyrics.transliteration.length);
      
      for (let i = 0; i < maxLength; i += linesPerSlide) {
        let content = '';
        
        for (let j = 0; j < linesPerSlide && (i + j) < maxLength; j++) {
          const index = i + j;
          
          if (lyrics.tamil[index]) {
            content += lyrics.tamil[index].text + '\n';
          }
          if (lyrics.transliteration[index]) {
            content += lyrics.transliteration[index].text + '\n\n';
          }
        }
        
        if (content.trim()) {
          slideData.push({
            type: 'lyrics',
            content: content.trim()
          });
        }
      }
    } else {
      // Fallback: use whichever is available
      const availableLyrics = lyrics.tamil.length > 0 ? lyrics.tamil :
                             lyrics.transliteration.length > 0 ? lyrics.transliteration :
                             lyrics.english.length > 0 ? lyrics.english : [];
      
      if (availableLyrics.length > 0) {
        for (let i = 0; i < availableLyrics.length; i += linesPerSlide) {
          const lines = availableLyrics.slice(i, i + linesPerSlide);
          slideData.push({
            type: 'lyrics',
            content: lines.map(l => l.text).join('\n')
          });
        }
      }
    }

    // End slide
    slideData.push({
      type: 'end',
      content: ''
    });

    setSlides(slideData);
  };

  useEffect(() => {
    let timeout;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Escape') {
        exitPresentation();
      } else if (e.key === 'g' || e.key === 'G') {
        setShowGrid(!showGrid);
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlide, slides, showGrid]);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setShowGrid(false);
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const exitPresentation = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
    window.close();
    setTimeout(() => router.back(), 100);
  };

  // FIXED: Better loading state
  if (!songId || !song || slides.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-white mx-auto mb-6"></div>
          <div className="text-2xl font-bold">Loading Presentation...</div>
          {!songId && <div className="text-sm mt-2 opacity-75">Waiting for song data...</div>}
        </div>
      </div>
    );
  }

  const currentSlideData = slides[currentSlide];
  const bgColor = backgrounds[bg] || backgrounds['gradient-blue'];

  return (
    <div className="h-screen flex flex-col text-white relative overflow-hidden" style={{ backgroundColor: bgColor }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      {/* Instructions Overlay */}
      {showInstructions && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-2xl mx-4 border border-white/20">
            <h2 className="text-3xl font-bold mb-6 text-center">Keyboard Controls</h2>
            <div className="grid grid-cols-2 gap-4 text-lg">
              <div className="flex items-center gap-3">
                <kbd className="bg-white/20 px-4 py-2 rounded-lg font-mono">→</kbd>
                <span>Next Slide</span>
              </div>
              <div className="flex items-center gap-3">
                <kbd className="bg-white/20 px-4 py-2 rounded-lg font-mono">←</kbd>
                <span>Previous Slide</span>
              </div>
              <div className="flex items-center gap-3">
                <kbd className="bg-white/20 px-4 py-2 rounded-lg font-mono">G</kbd>
                <span>Grid View</span>
              </div>
              <div className="flex items-center gap-3">
                <kbd className="bg-white/20 px-4 py-2 rounded-lg font-mono">F</kbd>
                <span>Fullscreen</span>
              </div>
              <div className="flex items-center gap-3">
                <kbd className="bg-white/20 px-4 py-2 rounded-lg font-mono">Esc</kbd>
                <span>Exit</span>
              </div>
              <div className="flex items-center gap-3">
                <kbd className="bg-white/20 px-4 py-2 rounded-lg font-mono">Space</kbd>
                <span>Next Slide</span>
              </div>
            </div>
            <p className="text-center mt-6 text-sm opacity-75">This message will disappear in a few seconds...</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-12 relative z-10">
        <div className="w-full max-w-7xl text-center">
          {currentSlideData.type === 'title' && (
            <h1 className="text-8xl font-bold drop-shadow-2xl" style={{ fontFamily: font }}>
              {currentSlideData.content}
            </h1>
          )}
          
          {currentSlideData.type === 'lyrics' && (
            <pre className="text-5xl leading-relaxed font-sans whitespace-pre-wrap drop-shadow-2xl" style={{ fontFamily: font, fontSize: `${fontSize}pt` }}>
              {currentSlideData.content}
            </pre>
          )}
          
          {currentSlideData.type === 'end' && (
            <div className="text-6xl font-bold drop-shadow-2xl opacity-50">•</div>
          )}
        </div>
      </div>

      {/* Grid View */}
      {showGrid && (
        <div className="absolute inset-0 bg-black/95 backdrop-blur-sm z-40 overflow-y-auto p-8">
          <div className="container mx-auto max-w-7xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-4xl font-bold">All Slides</h2>
              <button onClick={() => setShowGrid(false)} className="bg-red-600 hover:bg-red-700 p-4 rounded-full transition">
                <X size={32} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {slides.map((slide, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`aspect-video rounded-xl overflow-hidden border-4 transition relative ${
                    currentSlide === index 
                      ? 'border-yellow-400 shadow-2xl scale-105' 
                      : 'border-white/20 hover:border-white/50'
                  }`}
                  style={{ backgroundColor: bgColor }}
                >
                  <div className="flex items-center justify-center h-full p-3">
                    <div className="text-xs line-clamp-3">
                      {slide.content || '•'}
                    </div>
                  </div>
                  <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded text-xs font-bold">
                    {index + 1}
                  </div>
                  {currentSlide === index && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">
                      LIVE
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <button 
          onClick={prevSlide} 
          disabled={currentSlide === 0}
          className="absolute bottom-8 left-8 bg-white/20 hover:bg-white/40 backdrop-blur-md p-6 rounded-full transition disabled:opacity-20 pointer-events-auto"
        >
          <ChevronLeft size={40} />
        </button>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 pointer-events-auto">
          <button 
            onClick={() => setShowGrid(!showGrid)}
            className="bg-white/20 hover:bg-white/40 backdrop-blur-md p-4 rounded-full transition"
          >
            <GridIcon size={28} />
          </button>
          <button 
            onClick={toggleFullscreen}
            className="bg-white/20 hover:bg-white/40 backdrop-blur-md p-4 rounded-full transition"
          >
            <Maximize size={28} />
          </button>
        </div>

        <button 
          onClick={nextSlide} 
          disabled={currentSlide === slides.length - 1}
          className="absolute bottom-8 right-8 bg-white/20 hover:bg-white/40 backdrop-blur-md p-6 rounded-full transition disabled:opacity-20 pointer-events-auto"
        >
          <ChevronRight size={40} />
        </button>

        <div className="absolute top-8 right-8 bg-white/20 backdrop-blur-md px-6 py-4 rounded-xl pointer-events-auto">
          <div className="text-3xl font-bold">
            {currentSlide + 1} / {slides.length}
          </div>
        </div>

        <button 
          onClick={exitPresentation}
          className="absolute top-8 left-8 bg-red-600/40 hover:bg-red-600/60 backdrop-blur-md px-6 py-3 rounded-full transition pointer-events-auto"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
}