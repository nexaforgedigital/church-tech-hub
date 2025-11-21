import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ChevronLeft, ChevronRight, X, Maximize, Grid, Monitor } from 'lucide-react';

export default function PresentationMode() {
  const router = useRouter();
  const { songId, mode, bg, font, fontSize: urlFontSize } = router.query;
  
  const [song, setSong] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSlideNav, setShowSlideNav] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [hasSeenHints, setHasSeenHints] = useState(false);

  // Get settings from URL
  const presentSettings = {
    background: bg || 'gradient-blue',
    fontFamily: font || 'Arial',
    fontSize: parseInt(urlFontSize) || 32
  };

  const backgrounds = {
    'gradient-blue': '#1e3a8a',
    'gradient-purple': '#6b21a8',
    'gradient-green': '#15803d',
    'gradient-red': '#991b1b',
    'black': '#000000',
    'dark-blue': '#1e293b',
  };

  const currentBgColor = backgrounds[presentSettings.background];

  // Check if user has seen hints
  useEffect(() => {
    const seen = localStorage.getItem('hasSeenPresentationHints');
    if (!seen) {
      setShowControls(true);
      const timer = setTimeout(() => {
        setShowControls(false);
        localStorage.setItem('hasSeenPresentationHints', 'true');
        setHasSeenHints(true);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setHasSeenHints(true);
    }
  }, []);

  // Show controls on mouse move
  useEffect(() => {
    let timeout;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 2000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

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

  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
          setIsFullscreen(true);
        }
      } catch (err) {
        console.log('Fullscreen not supported');
      }
    };

    const timer = setTimeout(() => {
      enterFullscreen();
    }, 500);

    return () => clearTimeout(timer);
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
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'g' || e.key === 'G') {
        setShowSlideNav(!showSlideNav);
      } else if (e.key === 'p' || e.key === 'P') {
        openPresenterView();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlide, slides, showSlideNav]);

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
      content: song.title
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
      content: ''
    });

    setSlides(slideData);
  };

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
    setShowSlideNav(false);
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.log('Could not enter fullscreen');
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const exitPresentation = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
    window.close();
    setTimeout(() => {
      router.back();
    }, 100);
  };

  const openPresenterView = () => {
    window.open(
      `/presenter-control/${songId}?mode=${mode}&bg=${presentSettings.background}&font=${presentSettings.fontFamily}&fontSize=${presentSettings.fontSize}`,
      'presenterControl',
      'width=1200,height=800'
    );
  };

  if (!song || slides.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ backgroundColor: currentBgColor }}>
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <div className="text-3xl">Loading...</div>
        </div>
      </div>
    );
  }

  const currentSlideData = slides[currentSlide];

  return (
    <div className="h-screen flex flex-col text-white relative overflow-hidden" style={{ backgroundColor: currentBgColor }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-12 relative z-10">
        {currentSlideData.type === 'title' && (
          <div className="text-center animate-fade-in">
            <h1 className="text-7xl font-bold drop-shadow-2xl" style={{ fontFamily: presentSettings.fontFamily }}>
              {currentSlideData.content}
            </h1>
          </div>
        )}

        {currentSlideData.type === 'lyrics' && (
          <div className="text-center max-w-5xl animate-fade-in">
            <pre className="leading-relaxed font-sans whitespace-pre-wrap drop-shadow-2xl" 
                 style={{ fontSize: `${presentSettings.fontSize}pt`, fontFamily: presentSettings.fontFamily }}>
              {currentSlideData.content}
            </pre>
          </div>
        )}

        {currentSlideData.type === 'end' && (
          <div className="text-center animate-fade-in">
            <h1 className="text-7xl font-bold drop-shadow-2xl" style={{ fontFamily: presentSettings.fontFamily }}>
              {currentSlideData.content}
            </h1>
          </div>
        )}
      </div>

      {/* Grid Overlay */}
      {showSlideNav && (
        <div className="absolute inset-0 bg-black/90 z-50 overflow-y-auto p-8">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Select Slide</h2>
              <button onClick={() => setShowSlideNav(false)} className="bg-red-500 hover:bg-red-600 p-3 rounded-full">
                <X size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {slides.map((slide, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`relative aspect-video rounded-lg overflow-hidden border-4 transition ${
                    currentSlide === index ? 'border-yellow-400 scale-105' : 'border-white/20 hover:border-white/50'
                  }`}
                >
                  <div className="absolute inset-0 flex items-center justify-center p-4" style={{ backgroundColor: currentBgColor }}>
                    <div className="text-xs line-clamp-4">{slide.content || 'End'}</div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs">
                    {index + 1}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cursor-Activated Controls with proper spacing */}
      <div className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        {/* Previous Button - Bottom Left */}
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="absolute bottom-8 left-8 bg-white/20 hover:bg-white/40 backdrop-blur p-4 rounded-full transition disabled:opacity-10 pointer-events-auto"
        >
          <ChevronLeft size={32} />
        </button>

        {/* Center Controls with spacing */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-6 pointer-events-auto">
          <button
            onClick={() => setShowSlideNav(true)}
            className="bg-white/20 hover:bg-white/40 backdrop-blur p-4 rounded-full transition"
            title="Grid View (G)"
          >
            <Grid size={32} />
          </button>

          <button
            onClick={toggleFullscreen}
            className="bg-white/20 hover:bg-white/40 backdrop-blur p-4 rounded-full transition"
            title="Fullscreen (F)"
          >
            <Maximize size={32} />
          </button>

          <button
            onClick={openPresenterView}
            className="bg-white/20 hover:bg-white/40 backdrop-blur p-4 rounded-full transition"
            title="Presenter View (P)"
          >
            <Monitor size={32} />
          </button>
        </div>
      
        {/* Next Button - Bottom Right */}
        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="absolute bottom-8 right-8 bg-white/20 hover:bg-white/40 backdrop-blur p-4 rounded-full transition disabled:opacity-10 pointer-events-auto"
        >
          <ChevronRight size={32} />
        </button>

        {/* Exit Button - Top Right */}
        <button
          onClick={exitPresentation}
          className="absolute top-8 right-8 bg-red-500/30 hover:bg-red-500/50 backdrop-blur p-3 rounded-full transition pointer-events-auto"
        >
          <X size={24} />
        </button>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}