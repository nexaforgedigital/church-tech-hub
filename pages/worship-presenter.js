import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { ChevronLeft, ChevronRight, X, Grid, Maximize, Clock, Pause, Play, RotateCcw, List, Minimize } from 'lucide-react';
import VideoBackground from '../components/VideoBackground';
import LandscapePrompt from '../components/LandscapePrompt';
import { songStorage } from '../utils/songStorage';

export default function WorshipPresenter() {
  const router = useRouter();
  const { service, settings, controlMode, startIndex } = router.query; // 🔥 Added startIndex
  
  const [serviceItems, setServiceItems] = useState([]);
  const [allSlides, setAllSlides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [showItemList, setShowItemList] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [presentSettings, setPresentSettings] = useState({
    background: 'gradient-blue',
    fontFamily: 'Arial',
    fontSize: 32,
    displayMode: 'tamil-transliteration',
    backgroundType: 'color',
    backgroundSrc: ''
  });
  const [isReady, setIsReady] = useState(false);
  const slideChangeTimeoutRef = useRef(null);
  
  // 🔥 NEW: Black screen state
  const [isBlackScreen, setIsBlackScreen] = useState(false);

  const backgrounds = {
    'gradient-blue': '#1e3a8a',
    'gradient-purple': '#6b21a8',
    'gradient-green': '#15803d',
    'gradient-red': '#991b1b',
    'black': '#000000',
    'dark-blue': '#1e293b',
  };

  // 🔥 FIXED: Generate slides with custom song support
  const generateAllSlides = useCallback(async (items) => {
    const slides = [];
    const displayMode = presentSettings.displayMode || 'tamil-transliteration';
    
    console.log('📊 Main screen generating slides with mode:', displayMode);
    
    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
      const item = items[itemIndex];
      
      if (item.type === 'song') {
        try {
          let song;
          
          // 🔥 FIX: Check if it's a custom song
          if (item.data.id && item.data.id.toString().startsWith('custom-')) {
            const customSongs = songStorage.getCustomSongs();
            song = customSongs.find(s => s.id === item.data.id);
            
            if (!song) {
              console.error('Custom song not found:', item.data.id);
              continue;
            }
          } else {
            // Fetch from API
            const response = await fetch(`/api/songs/${item.data.id}`);
            if (!response.ok) {
              console.error('Failed to fetch song:', item.data.id);
              continue;
            }
            song = await response.json();
          }
          
          // Validate lyrics exist
          if (!song.lyrics) {
            console.error('Song has no lyrics:', song.title);
            continue;
          }
          
          // Initialize lyrics with empty arrays if undefined
          const lyrics = {
            tamil: song.lyrics.tamil || [],
            english: song.lyrics.english || [],
            transliteration: song.lyrics.transliteration || []
          };
          
          // Title slide
          slides.push({
            type: 'song-title',
            content: song.title,
            itemIndex,
            itemTitle: song.title,
            slideNumber: slides.length + 1
          });

          // Generate lyric slides based on available data
          const maxLength = Math.max(
            lyrics.tamil.length,
            lyrics.english.length,
            lyrics.transliteration.length
          );

          for (let i = 0; i < maxLength; i += 2) {
            let content = '';
            
            for (let j = 0; j < 2 && (i + j) < maxLength; j++) {
              const lineIndex = i + j;
              
              switch(displayMode) {
                case 'tamil-only':
                  if (lyrics.tamil[lineIndex]) {
                    content += lyrics.tamil[lineIndex].text + '\n\n';
                  }
                  break;
                  
                case 'transliteration-only':
                  if (lyrics.transliteration[lineIndex]) {
                    content += lyrics.transliteration[lineIndex].text + '\n\n';
                  }
                  break;
                  
                case 'english-only':
                  if (lyrics.english[lineIndex]) {
                    content += lyrics.english[lineIndex].text + '\n\n';
                  }
                  break;
                  
                case 'tamil-english':
                  if (lyrics.tamil[lineIndex]) {
                    content += lyrics.tamil[lineIndex].text + '\n';
                  }
                  if (lyrics.english[lineIndex]) {
                    content += lyrics.english[lineIndex].text + '\n\n';
                  }
                  break;
                  
                case 'all':
                  if (lyrics.tamil[lineIndex]) {
                    content += lyrics.tamil[lineIndex].text + '\n';
                  }
                  if (lyrics.transliteration[lineIndex]) {
                    content += lyrics.transliteration[lineIndex].text + '\n';
                  }
                  if (lyrics.english[lineIndex]) {
                    content += lyrics.english[lineIndex].text + '\n\n';
                  }
                  break;
                  
                case 'tamil-transliteration':
                default:
                  if (lyrics.tamil[lineIndex]) {
                    content += lyrics.tamil[lineIndex].text + '\n';
                  }
                  if (lyrics.transliteration[lineIndex]) {
                    content += lyrics.transliteration[lineIndex].text + '\n\n';
                  }
                  break;
              }
            }
            
            if (content.trim()) {
              slides.push({
                type: 'song-lyrics',
                content: content.trim(),
                itemIndex,
                itemTitle: song.title,
                slideNumber: slides.length + 1,
                displayMode: displayMode
              });
            }
          }
        } catch (error) {
          console.error('Error processing song:', error);
        }
      } else if (item.type === 'verse') {
        slides.push({
          type: 'verse',
          reference: item.data.reference,
          content: item.data.text,
          itemIndex,
          itemTitle: item.data.reference,
          slideNumber: slides.length + 1
        });
      } else if (item.type === 'announcement') {
        slides.push({
          type: 'announcement',
          title: item.data.title,
          content: item.data.content,
          itemIndex,
          itemTitle: item.data.title,
          slideNumber: slides.length + 1
        });
      }
    }

    console.log('✅ Main screen generated', slides.length, 'slides');
    setAllSlides(slides);
  }, [presentSettings.displayMode]);

  // Initialize service data
  useEffect(() => {
    if (service) {
      try {
        const items = JSON.parse(decodeURIComponent(service));
        setServiceItems(items);
        generateAllSlides(items);
      } catch (error) {
        console.error('Error parsing service data:', error);
      }
    }
    if (settings) {
      try {
        const parsedSettings = JSON.parse(decodeURIComponent(settings));
        setPresentSettings(parsedSettings);
      } catch (error) {
        console.error('Error parsing settings:', error);
      }
    }
  }, [service, settings]);

  // 🔥 NEW: Set initial slide from URL parameter
  useEffect(() => {
    if (startIndex && allSlides.length > 0) {
      const index = parseInt(startIndex);
      if (index >= 0 && index < allSlides.length) {
        console.log('🎬 Starting from slide:', index + 1);
        setCurrentSlideIndex(index);
      }
    }
  }, [startIndex, allSlides.length]);

  // Regenerate slides when display mode changes
  useEffect(() => {
    if (serviceItems.length > 0) {
      console.log('🔄 Main screen: Display mode changed, regenerating...');
      generateAllSlides(serviceItems);
    }
  }, [presentSettings.displayMode, serviceItems, generateAllSlides]);

  // Signal ready
  useEffect(() => {
    if (allSlides.length > 0 && !isReady) {
      setIsReady(true);
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({
          type: 'MAIN_READY',
          timestamp: Date.now()
        }, '*');
        console.log('✅ Main window ready signal sent');
      }
    }
  }, [allSlides, isReady]);

  // Listen for messages
  useEffect(() => {
    const handleMessage = (event) => {
      console.log('📨 Main received:', event.data.type);
      
      if (event.data.type === 'CHANGE_SLIDE') {
        const newIndex = event.data.slideIndex;
        console.log('🎯 Main: Changing to slide:', newIndex);
        
        if (slideChangeTimeoutRef.current) {
          clearTimeout(slideChangeTimeoutRef.current);
        }
        
        setCurrentSlideIndex(newIndex);
        setShowGrid(false);
        setShowItemList(false);
        
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage({
            type: 'SLIDE_CHANGED',
            slideIndex: newIndex,
            timestamp: Date.now()
          }, '*');
        }
      } else if (event.data.type === 'UPDATE_SETTINGS') {
        console.log('⚙️ Main: Updating settings:', event.data.settings);
        setPresentSettings(event.data.settings);
        
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage({
            type: 'SETTINGS_UPDATED',
            settings: event.data.settings,
            timestamp: Date.now()
          }, '*');
        }
      } else if (event.data.type === 'TOGGLE_BLACK_SCREEN') {
        // 🔥 NEW: Handle black screen toggle
        console.log('⚫ Main: Toggling black screen to:', event.data.value);
        setIsBlackScreen(event.data.value);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

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

  // Manual fullscreen button instead of auto
  useEffect(() => {
    // Show controls on load so user can click fullscreen button
    setShowControls(true);
    setTimeout(() => setShowControls(false), 5000); // Hide after 5 seconds
  }, []);

  // Show controls on mouse move
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

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Escape') {
        if (showGrid || showItemList) {
          setShowGrid(false);
          setShowItemList(false);
        } else {
          exitPresentation();
        }
      } else if (e.key === 'g' || e.key === 'G') {
        setShowGrid(!showGrid);
        setShowItemList(false);
      } else if (e.key === 'l' || e.key === 'L') {
        setShowItemList(!showItemList);
        setShowGrid(false);
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToSlide(allSlides.length - 1);
      } else if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        setIsBlackScreen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlideIndex, allSlides, showGrid, showItemList]);

  const nextSlide = () => {
    if (currentSlideIndex < allSlides.length - 1) {
      const newIndex = currentSlideIndex + 1;
      setCurrentSlideIndex(newIndex);
      notifyPresenterControl(newIndex);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      const newIndex = currentSlideIndex - 1;
      setCurrentSlideIndex(newIndex);
      notifyPresenterControl(newIndex);
    }
  };

  const goToSlide = (index) => {
    if (index >= 0 && index < allSlides.length) {
      setCurrentSlideIndex(index);
      setShowGrid(false);
      setShowItemList(false);
      notifyPresenterControl(index);
    }
  };

  const goToItem = (itemIndex) => {
    const slideIndex = allSlides.findIndex(slide => slide.itemIndex === itemIndex);
    if (slideIndex !== -1) {
      goToSlide(slideIndex);
    }
  };

  const notifyPresenterControl = (slideIndex) => {
    if (window.opener && !window.opener.closed) {
      window.opener.postMessage({
        type: 'SLIDE_CHANGED',
        slideIndex: slideIndex,
        timestamp: Date.now()
      }, '*');
    }
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

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!serviceItems.length || !allSlides.length) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-white mx-auto mb-6"></div>
          <div className="text-4xl font-bold mb-2">Loading Presentation...</div>
          <div className="text-xl text-gray-300">Preparing your worship service</div>
        </div>
      </div>
    );
  }

  const currentSlide = allSlides[currentSlideIndex];
  const currentBgColor = backgrounds[presentSettings.background];
  const currentFont = presentSettings.fontFamily || 'Arial';
  const currentFontSize = presentSettings.fontSize || 32;

  const groupedSlides = allSlides.reduce((acc, slide) => {
    const itemIndex = slide.itemIndex;
    if (!acc[itemIndex]) {
      acc[itemIndex] = {
        item: serviceItems[itemIndex],
        slides: []
      };
    }
    acc[itemIndex].slides.push(slide);
    return acc;
  }, {});

  return (
    <>
      <LandscapePrompt />
      <div className="landscape-only h-screen flex flex-col text-white relative overflow-hidden">
        {/* 🔥 NEW: Black Screen Overlay */}
        {isBlackScreen ? (
          <div className="absolute inset-0 bg-black z-50 flex items-center justify-center">
            <div className="text-gray-800 text-6xl">⚫</div>
          </div>
        ) : (
          <>
            {/* Background - Video or Color */}
            {presentSettings.backgroundType === 'video' || presentSettings.backgroundType === 'image' ? (
              <VideoBackground 
                src={presentSettings.backgroundSrc} 
                type={presentSettings.backgroundType}
                opacity={0.6}
                loop={true}
              />
            ) : (
              <div className="absolute inset-0" style={{ backgroundColor: currentBgColor }}>
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white rounded-full blur-3xl"></div>
                </div>
              </div>
            )}

            {/* Main Content - VERTICALLY CENTERED */}
            <div className="flex-1 flex items-center justify-center p-6 relative z-10">
              <div className="w-full max-w-7xl animate-fade-in" key={currentSlideIndex}>
                {currentSlide.type === 'song-title' && (
                  <div className="text-center flex items-center justify-center min-h-[60vh]">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold drop-shadow-2xl leading-tight" style={{ fontFamily: currentFont }}>
                    </h1>
                  </div>
                )}

                {currentSlide.type === 'song-lyrics' && (
                  <div className="text-center flex items-center justify-center min-h-[60vh] max-w-6xl mx-auto">
                    <pre 
                      className="leading-relaxed font-sans whitespace-pre-wrap drop-shadow-2xl text-3xl md:text-4xl lg:text-5xl" 
                      style={{ 
                        fontSize: `${currentFontSize}pt`, 
                        fontFamily: currentFont 
                      }}
                    >
                      {currentSlide.content}
                    </pre>
                  </div>
                )}

                {currentSlide.type === 'verse' && (
                  <div className="text-center flex items-center justify-center min-h-[60vh]">
                    <div className="max-w-5xl mx-auto px-6">
                      <div className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-yellow-300 drop-shadow-xl" style={{ fontFamily: currentFont }}>
                        {currentSlide.reference}
                      </div>
                      <div className="text-3xl md:text-4xl lg:text-5xl leading-relaxed drop-shadow-2xl" style={{ fontFamily: currentFont }}>
                        {currentSlide.reference}
                      </div>
                      <div className="text-5xl leading-relaxed drop-shadow-2xl" style={{ fontFamily: currentFont }}>
                        {currentSlide.content}
                      </div>
                    </div>
                  </div>
                )}

                {currentSlide.type === 'announcement' && (
                  <div className="text-center flex items-center justify-center min-h-[60vh]">
                    <div className="max-w-6xl mx-auto px-6">
                      <div className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 drop-shadow-2xl" style={{ fontFamily: currentFont }}>
                        {currentSlide.title}
                      </div>
                      <div className="text-3xl md:text-4xl lg:text-5xl leading-relaxed drop-shadow-2xl whitespace-pre-wrap" style={{ fontFamily: currentFont }}>
                        {currentSlide.title}
                      </div>
                      <div className="text-5xl leading-relaxed drop-shadow-2xl whitespace-pre-wrap" style={{ fontFamily: currentFont }}>
                        {currentSlide.content}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Slide Grid View */}
            {showGrid && (
              <div className="absolute inset-0 bg-black/95 backdrop-blur-sm z-50 overflow-y-auto p-8 animate-fade-in">
                <div className="container mx-auto max-w-7xl">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2 className="text-5xl font-bold mb-2">All Slides</h2>
                      <p className="text-xl text-gray-300">Click any slide to jump to it • Press ESC to close</p>
                    </div>
                    <button onClick={() => setShowGrid(false)} className="bg-red-600 hover:bg-red-700 p-5 rounded-full transition shadow-2xl">
                      <X size={32} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {allSlides.map((slide, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`relative aspect-video rounded-xl overflow-hidden border-4 transition transform hover:scale-105 ${
                          currentSlideIndex === index 
                            ? 'border-yellow-400 shadow-2xl shadow-yellow-400/50 scale-105 ring-4 ring-yellow-400/30' 
                            : 'border-white/20 hover:border-white/50'
                        }`}
                      >
                        <div className="absolute inset-0 flex items-center justify-center p-3" style={{ backgroundColor: currentBgColor }}>
                          {slide.type === 'song-title' && (
                            <div className="text-center">
                              <div className="text-sm font-bold line-clamp-3">{slide.content}</div>
                            </div>
                          )}
                          {slide.type === 'song-lyrics' && (
                            <div className="text-xs line-clamp-4 leading-tight">{slide.content}</div>
                          )}
                          {slide.type === 'verse' && (
                            <div className="text-center">
                              <div className="text-xs font-bold text-yellow-300 mb-1">{slide.reference}</div>
                              <div className="text-xs line-clamp-3">{slide.content}</div>
                            </div>
                          )}
                          {slide.type === 'announcement' && (
                            <div className="text-center">
                              <div className="text-sm font-bold mb-1">{slide.title}</div>
                              <div className="text-xs line-clamp-2">{slide.content}</div>
                            </div>
                          )}
                        </div>
                        
                        <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded text-xs font-bold">
                          {index + 1}
                        </div>
                        
                        {currentSlideIndex === index && (
                          <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold animate-pulse">
                            LIVE
                          </div>
                        )}

                        <div className="absolute bottom-2 left-2 right-2 bg-black/70 px-2 py-1 rounded text-xs truncate">
                          {slide.itemTitle}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Item List View */}
            {showItemList && (
              <div className="absolute inset-0 bg-black/95 backdrop-blur-sm z-50 overflow-y-auto p-8 animate-fade-in">
                <div className="container mx-auto max-w-5xl">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2 className="text-5xl font-bold mb-2">Service Items</h2>
                      <p className="text-xl text-gray-300">Jump to any item • Press ESC to close</p>
                    </div>
                    <button onClick={() => setShowItemList(false)} className="bg-red-600 hover:bg-red-700 p-5 rounded-full transition shadow-2xl">
                      <X size={32} />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {Object.entries(groupedSlides).map(([itemIndex, data]) => {
                      const isCurrentItem = data.slides.some(slide => allSlides.indexOf(slide) === currentSlideIndex);
                      return (
                        <button
                          key={itemIndex}
                          onClick={() => goToItem(parseInt(itemIndex))}
                          className={`w-full text-left p-8 rounded-2xl transition transform hover:scale-102 shadow-xl ${
                            isCurrentItem 
                              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 shadow-2xl shadow-yellow-500/50 ring-4 ring-yellow-400/30' 
                              : 'bg-white/10 hover:bg-white/20'
                          }`}
                        >
                          <div className="flex items-center gap-6">
                            <div className={`text-5xl font-bold ${isCurrentItem ? 'text-white' : 'text-gray-400'}`}>
                              {parseInt(itemIndex) + 1}
                            </div>
                            <div className="flex-1">
                              <div className="text-3xl font-bold mb-2">
                                {data.item.type === 'song' ? data.item.data.title : 
                                 data.item.type === 'verse' ? data.item.data.reference : 
                                 data.item.data.title}
                              </div>
                              <div className="text-lg opacity-75">
                                {data.slides.length} slide{data.slides.length !== 1 ? 's' : ''} • {data.item.type}
                              </div>
                            </div>
                            {isCurrentItem && (
                              <div className="bg-white text-black px-4 py-2 rounded-full text-lg font-bold">
                                ▶ CURRENT
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
              <button onClick={prevSlide} disabled={currentSlideIndex === 0} className="absolute bottom-8 left-8 bg-white/20 hover:bg-white/40 backdrop-blur-md p-6 rounded-full transition disabled:opacity-20 pointer-events-auto shadow-2xl">
                <ChevronLeft size={40} />
              </button>

              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 pointer-events-auto">
                <button onClick={() => { setShowItemList(!showItemList); setShowGrid(false); }} className="bg-white/20 hover:bg-white/40 backdrop-blur-md p-5 rounded-full transition shadow-2xl">
                  <List size={28} />
                </button>
                <button onClick={() => { setShowGrid(!showGrid); setShowItemList(false); }} className="bg-white/20 hover:bg-white/40 backdrop-blur-md p-5 rounded-full transition shadow-2xl">
                  <Grid size={28} />
                </button>
                <button onClick={toggleFullscreen} className="bg-white/20 hover:bg-white/40 backdrop-blur-md p-5 rounded-full transition shadow-2xl">
                  {isFullscreen ? <Minimize size={28} /> : <Maximize size={28} />}
                </button>
              </div>

              <button onClick={nextSlide} disabled={currentSlideIndex === allSlides.length - 1} className="absolute bottom-8 right-8 bg-white/20 hover:bg-white/40 backdrop-blur-md p-6 rounded-full transition disabled:opacity-20 pointer-events-auto shadow-2xl">
                <ChevronRight size={40} />
              </button>

              <div className="absolute top-8 left-8 space-y-3 pointer-events-auto">
                <div className="bg-white/20 backdrop-blur-md px-6 py-4 rounded-xl flex items-center gap-4 shadow-2xl">
                  <Clock size={28} />
                  <span className="font-mono text-3xl font-bold">{formatTime(elapsedTime)}</span>
                  <button onClick={() => setIsTimerRunning(!isTimerRunning)} className="ml-2 p-2 hover:bg-white/20 rounded-lg transition">
                    {isTimerRunning ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <button onClick={() => setElapsedTime(0)} className="p-2 hover:bg-white/20 rounded-lg transition">
                    <RotateCcw size={20} />
                  </button>
                </div>
                
                <div className="bg-white/20 backdrop-blur-md px-6 py-4 rounded-xl shadow-2xl">
                  <div className="text-sm opacity-75 mb-1">Current Item</div>
                  <div className="font-bold text-xl">{currentSlide.itemTitle}</div>
                </div>
              </div>

              <div className="absolute top-8 right-8 bg-white/20 backdrop-blur-md px-6 py-4 rounded-xl pointer-events-auto shadow-2xl">
                <div className="text-sm opacity-75 mb-3">Progress</div>
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold">
                    {currentSlideIndex + 1} / {allSlides.length}
                  </div>
                  <div className="w-48 h-3 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 transition-all duration-300"
                      style={{ width: `${((currentSlideIndex + 1) / allSlides.length) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-lg font-semibold">
                    {Math.round(((currentSlideIndex + 1) / allSlides.length) * 100)}%
                  </div>
                </div>
              </div>

              {!isFullscreen && (
                <button 
                  onClick={toggleFullscreen} 
                  className="absolute top-8 left-1/2 transform -translate-x-1/2 -translate-y-16 bg-blue-600/40 hover:bg-blue-600/60 backdrop-blur-md px-8 py-4 rounded-full transition pointer-events-auto shadow-2xl flex items-center gap-3"
                >
                  <Maximize size={24} />
                  <span className="font-semibold text-lg">Enter Fullscreen</span>
                </button>
              )}

              <button onClick={exitPresentation} className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-red-600/40 hover:bg-red-600/60 backdrop-blur-md px-8 py-4 rounded-full transition pointer-events-auto shadow-2xl flex items-center gap-3">
                <X size={24} />
                <span className="font-semibold text-lg">Exit</span>
              </button>
            </div>
          </>
        )}

        <style jsx>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.4s ease-out;
          }
        `}</style>
      </div>
    </>
  );
}