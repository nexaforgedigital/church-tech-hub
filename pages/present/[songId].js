import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function PresentationMode() {
  const router = useRouter();
  const { songId, mode } = router.query;
  
  const [song, setSong] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);

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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'Escape') {
        window.close();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlide, slides]);

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
    
    // Title slide
    slideData.push({
      type: 'title',
      content: song.title,
      subtitle: song.artist
    });

    // Lyrics slides
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

    // End slide
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

  if (!song || slides.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900 text-white">
        <div className="text-3xl">Loading presentation...</div>
      </div>
    );
  }

  const currentSlideData = slides[currentSlide];

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-12 relative z-10">
        {currentSlideData.type === 'title' && (
          <div className="text-center animate-fade-in">
            <h1 className="text-7xl font-bold mb-8 drop-shadow-2xl">{currentSlideData.content}</h1>
            <p className="text-4xl opacity-90">{currentSlideData.subtitle}</p>
          </div>
        )}

        {currentSlideData.type === 'lyrics' && (
          <div className="text-center max-w-5xl animate-fade-in">
            <pre className="text-5xl leading-relaxed font-sans whitespace-pre-wrap drop-shadow-2xl">
              {currentSlideData.content}
            </pre>
          </div>
        )}

        {currentSlideData.type === 'end' && (
          <div className="text-center animate-fade-in">
            <h1 className="text-7xl font-bold drop-shadow-2xl"></h1>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-8 z-20">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="bg-white/20 hover:bg-white/30 backdrop-blur p-4 rounded-full transition disabled:opacity-30"
        >
          <ChevronLeft size={32} />
        </button>

        <div className="bg-white/20 backdrop-blur px-6 py-3 rounded-full text-xl font-semibold">
          {currentSlide + 1} / {slides.length}
        </div>

        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="bg-white/20 hover:bg-white/30 backdrop-blur p-4 rounded-full transition disabled:opacity-30"
        >
          <ChevronRight size={32} />
        </button>
      </div>

      {/* Exit Button */}
      <button
        onClick={() => window.close()}
        className="absolute top-8 right-8 bg-red-500/80 hover:bg-red-600 backdrop-blur p-3 rounded-full transition z-20"
      >
        <X size={24} />
      </button>

      {/* Keyboard Hints */}
      <div className="absolute top-8 left-8 bg-white/10 backdrop-blur px-4 py-2 rounded-lg text-sm z-20">
        ← → Space: Navigate | Esc: Exit
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}