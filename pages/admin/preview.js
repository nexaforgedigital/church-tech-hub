// pages/admin/preview.js
// Song Preview Tool - Test how songs look in presenter

import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Maximize2, Monitor, Smartphone, X } from 'lucide-react';
import AdminAuth from '../../components/AdminAuth';
import { songs } from '../../data/songs';
import { songStorage } from '../../utils/songStorage';

export default function SongPreview() {
  const [allSongs, setAllSongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSong, setSelectedSong] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState('desktop'); // desktop, tablet, mobile
  
  // Settings
  const [settings, setSettings] = useState({
    background: 'gradient-blue',
    fontSize: 36,
    linesPerSlide: 2
  });

  const backgrounds = {
    'gradient-blue': { color: '#1e3a8a', name: 'Deep Blue' },
    'gradient-purple': { color: '#6b21a8', name: 'Royal Purple' },
    'gradient-green': { color: '#15803d', name: 'Forest Green' },
    'gradient-red': { color: '#991b1b', name: 'Crimson Red' },
    'black': { color: '#000000', name: 'Classic Black' },
    'dark-blue': { color: '#1e293b', name: 'Dark Navy' },
  };

  useEffect(() => {
    // Combine database songs and custom songs
    const customSongs = songStorage.getCustomSongs();
    setAllSongs([...songs, ...customSongs]);
  }, []);

  useEffect(() => {
    if (selectedSong) {
      generateSlides(selectedSong);
    }
  }, [selectedSong, settings.linesPerSlide]);

  const generateSlides = (song) => {
    const slideList = [];
    
    // Title slide
    slideList.push({
      type: 'title',
      content: song.title,
      subtitle: song.titleEnglish || ''
    });

    // Lyrics slides
    const tamilLines = song.lyrics?.tamil || [];
    const linesPerSlide = settings.linesPerSlide;

    for (let i = 0; i < tamilLines.length; i += linesPerSlide) {
      const lines = tamilLines.slice(i, i + linesPerSlide);
      slideList.push({
        type: 'lyrics',
        content: lines.map(l => l.text).join('\n'),
        lineNumbers: `${i + 1}-${Math.min(i + linesPerSlide, tamilLines.length)}`
      });
    }

    // End slide
    slideList.push({
      type: 'end',
      content: ''
    });

    setSlides(slideList);
    setCurrentSlide(0);
  };

  const filteredSongs = allSongs.filter(song => {
    const q = searchQuery.toLowerCase();
    return (
      song.title?.includes(searchQuery) ||
      song.titleEnglish?.toLowerCase().includes(q) ||
      song.artist?.toLowerCase().includes(q)
    );
  });

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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, slides.length]);

  const viewModeStyles = {
    desktop: { width: '100%', aspectRatio: '16/9' },
    tablet: { width: '768px', aspectRatio: '4/3' },
    mobile: { width: '375px', aspectRatio: '9/16' }
  };

  return (
    <AdminAuth title="Song Preview Tool">
      <div className="py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <h1 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Monitor className="text-blue-600" />
              Song Preview Tool
            </h1>
            <p className="text-gray-600">
              Test how songs will look in the presenter before your service
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left: Song Selection */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="font-bold mb-4">Select Song</h2>
              
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search songs..."
                  className="w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Song List */}
              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredSongs.slice(0, 50).map((song) => (
                  <button
                    key={song.id}
                    onClick={() => setSelectedSong(song)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      selectedSong?.id === song.id
                        ? 'bg-blue-100 border-2 border-blue-500'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="font-semibold truncate">{song.title}</div>
                    <div className="text-sm text-gray-500 truncate">{song.titleEnglish}</div>
                  </button>
                ))}
              </div>

              {/* Settings */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-3">Preview Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Background</label>
                    <select
                      value={settings.background}
                      onChange={(e) => setSettings({ ...settings, background: e.target.value })}
                      className="w-full px-3 py-2 border-2 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      {Object.entries(backgrounds).map(([key, val]) => (
                        <option key={key} value={key}>{val.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Font Size: {settings.fontSize}px
                    </label>
                    <input
                      type="range"
                      min="24"
                      max="56"
                      value={settings.fontSize}
                      onChange={(e) => setSettings({ ...settings, fontSize: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Lines per Slide</label>
                    <select
                      value={settings.linesPerSlide}
                      onChange={(e) => setSettings({ ...settings, linesPerSlide: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border-2 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      <option value={1}>1 Line</option>
                      <option value={2}>2 Lines</option>
                      <option value={3}>3 Lines</option>
                      <option value={4}>4 Lines</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Preview */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                {/* View Mode Selector */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewMode('desktop')}
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        viewMode === 'desktop' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'
                      }`}
                    >
                      <Monitor size={16} className="inline mr-1" />
                      Desktop
                    </button>
                    <button
                      onClick={() => setViewMode('tablet')}
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        viewMode === 'tablet' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'
                      }`}
                    >
                      Tablet
                    </button>
                    <button
                      onClick={() => setViewMode('mobile')}
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        viewMode === 'mobile' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'
                      }`}
                    >
                      <Smartphone size={16} className="inline mr-1" />
                      Mobile
                    </button>
                  </div>
                  
                  <button
                    onClick={() => setIsFullscreen(true)}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold"
                  >
                    <Maximize2 size={18} />
                    Fullscreen
                  </button>
                </div>

                {/* Preview Area */}
                {selectedSong ? (
                  <div className="flex flex-col items-center">
                    <div
                      className="rounded-xl overflow-hidden shadow-2xl mx-auto"
                      style={{
                        ...viewModeStyles[viewMode],
                        maxWidth: '100%',
                        backgroundColor: backgrounds[settings.background].color
                      }}
                    >
                      <div className="w-full h-full flex items-center justify-center p-8 text-white text-center">
                        {slides[currentSlide]?.type === 'title' && (
                          <div>
                            <h1 style={{ fontSize: `${settings.fontSize * 1.5}px` }} className="font-bold">
                              {slides[currentSlide].content}
                            </h1>
                            {slides[currentSlide].subtitle && (
                              <p style={{ fontSize: `${settings.fontSize * 0.8}px` }} className="mt-4 opacity-75">
                                {slides[currentSlide].subtitle}
                              </p>
                            )}
                          </div>
                        )}
                        
                        {slides[currentSlide]?.type === 'lyrics' && (
                          <pre
                            style={{ fontSize: `${settings.fontSize}px` }}
                            className="font-sans whitespace-pre-wrap leading-relaxed"
                          >
                            {slides[currentSlide].content}
                          </pre>
                        )}
                        
                        {slides[currentSlide]?.type === 'end' && (
                          <div className="text-4xl opacity-50">•</div>
                        )}
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-4 mt-6">
                      <button
                        onClick={prevSlide}
                        disabled={currentSlide === 0}
                        className="bg-gray-200 hover:bg-gray-300 disabled:opacity-30 p-3 rounded-full"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      
                      <div className="text-lg font-semibold">
                        {currentSlide + 1} / {slides.length}
                      </div>
                      
                      <button
                        onClick={nextSlide}
                        disabled={currentSlide === slides.length - 1}
                        className="bg-gray-200 hover:bg-gray-300 disabled:opacity-30 p-3 rounded-full"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </div>

                    {/* Slide Thumbnails */}
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2 max-w-full">
                      {slides.map((slide, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`flex-shrink-0 w-20 h-12 rounded-lg overflow-hidden border-2 transition ${
                            currentSlide === index
                              ? 'border-blue-500 ring-2 ring-blue-300'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          style={{ backgroundColor: backgrounds[settings.background].color }}
                        >
                          <div className="w-full h-full flex items-center justify-center text-white text-xs p-1 truncate">
                            {slide.type === 'title' ? 'Title' : slide.type === 'end' ? 'End' : `${index}`}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-96 bg-gray-100 rounded-xl">
                    <div className="text-center text-gray-500">
                      <Monitor size={48} className="mx-auto mb-4 opacity-50" />
                      <p className="font-semibold">Select a song to preview</p>
                      <p className="text-sm">Choose from the list on the left</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Keyboard Hints */}
              <div className="mt-4 bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <span>
                    <kbd className="bg-white px-2 py-1 rounded border">←</kbd>
                    <kbd className="bg-white px-2 py-1 rounded border ml-1">→</kbd>
                    Navigate slides
                  </span>
                  <span>
                    <kbd className="bg-white px-2 py-1 rounded border">Space</kbd>
                    Next slide
                  </span>
                  <span>
                    <kbd className="bg-white px-2 py-1 rounded border">Esc</kbd>
                    Exit fullscreen
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && selectedSong && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: backgrounds[settings.background].color }}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full"
          >
            <X size={24} />
          </button>

          <div className="w-full h-full flex items-center justify-center p-12 text-white text-center">
            {slides[currentSlide]?.type === 'title' && (
              <div>
                <h1 className="text-7xl font-bold">{slides[currentSlide].content}</h1>
                {slides[currentSlide].subtitle && (
                  <p className="text-3xl mt-6 opacity-75">{slides[currentSlide].subtitle}</p>
                )}
              </div>
            )}
            
            {slides[currentSlide]?.type === 'lyrics' && (
              <pre className="text-5xl font-sans whitespace-pre-wrap leading-relaxed">
                {slides[currentSlide].content}
              </pre>
            )}
            
            {slides[currentSlide]?.type === 'end' && (
              <div className="text-6xl opacity-50">•</div>
            )}
          </div>

          {/* Fullscreen Controls */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-6">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="bg-white/20 hover:bg-white/30 disabled:opacity-30 text-white p-4 rounded-full"
            >
              <ChevronLeft size={32} />
            </button>
            
            <div className="bg-white/20 px-6 py-3 rounded-full text-white text-xl font-semibold">
              {currentSlide + 1} / {slides.length}
            </div>
            
            <button
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              className="bg-white/20 hover:bg-white/30 disabled:opacity-30 text-white p-4 rounded-full"
            >
              <ChevronRight size={32} />
            </button>
          </div>
        </div>
      )}
    </AdminAuth>
  );
}