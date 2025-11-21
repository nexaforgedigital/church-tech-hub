import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw, Grid, Monitor, X, Clock, List, Settings, Home, Maximize2, Square, Eye, GripVertical, Zap, Activity, ChevronUp, ChevronDown } from 'lucide-react';

export default function PresenterControlWorship() {
  const router = useRouter();
  const { service, settings } = router.query;
  
  const [serviceItems, setServiceItems] = useState([]);
  const [allSlides, setAllSlides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [presentSettings, setPresentSettings] = useState({
    background: 'gradient-blue',
    fontFamily: 'Arial',
    fontSize: 32,
    displayMode: 'tamil-transliteration'
  });
  const [mainWindowRef, setMainWindowRef] = useState(null);
  const [activeTab, setActiveTab] = useState('slides');
  const [isMainWindowReady, setIsMainWindowReady] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const messageQueueRef = useRef([]);
  const slideListRef = useRef(null);
  
  // Resizable panel states
  const [leftPanelWidth, setLeftPanelWidth] = useState(60);
  const [isDragging, setIsDragging] = useState(false);

  const backgrounds = {
    'gradient-blue': { color: '#1e3a8a', name: 'Deep Blue' },
    'gradient-purple': { color: '#6b21a8', name: 'Royal Purple' },
    'gradient-green': { color: '#15803d', name: 'Forest Green' },
    'gradient-red': { color: '#991b1b', name: 'Crimson Red' },
    'black': { color: '#000000', name: 'Classic Black' },
    'dark-blue': { color: '#1e293b', name: 'Dark Navy' },
  };

  const fontFamilies = ['Arial', 'Calibri', 'Georgia', 'Verdana', 'Times New Roman'];

  // Initialize service data
  useEffect(() => {
    if (service) {
      try {
        const items = JSON.parse(decodeURIComponent(service));
        setServiceItems(items);
        generateAllSlides(items);
      } catch (error) {
        console.error('Error parsing service:', error);
      }
    }
    if (settings) {
      try {
        const parsed = JSON.parse(decodeURIComponent(settings));
        setPresentSettings(parsed);
      } catch (error) {
        console.error('Error parsing settings:', error);
      }
    }
  }, [service, settings]);

  // Generate slides with useCallback
  const generateAllSlides = useCallback(async (items) => {
    const slides = [];
    const displayMode = presentSettings.displayMode || 'tamil-transliteration';
    
    console.log('📊 Generating slides with mode:', displayMode);
    
    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
      const item = items[itemIndex];
      
      if (item.type === 'song') {
        try {
          const response = await fetch(`/api/songs/${item.data.id}`);
          const song = await response.json();
          
          slides.push({
            type: 'song-title',
            content: song.title,
            itemIndex,
            itemTitle: song.title,
            itemType: 'song',
            notes: item.notes || ''
          });

          for (let i = 0; i < song.lyrics.tamil.length; i += 2) {
            let content = '';
            
            for (let j = 0; j < 2 && (i + j) < song.lyrics.tamil.length; j++) {
              const lineIndex = i + j;
              
              switch(displayMode) {
                case 'tamil-only':
                  content += song.lyrics.tamil[lineIndex].text + '\n\n';
                  break;
                case 'transliteration-only':
                  content += song.lyrics.transliteration[lineIndex].text + '\n\n';
                  break;
                case 'english-only':
                  content += song.lyrics.english[lineIndex].text + '\n\n';
                  break;
                case 'tamil-english':
                  content += song.lyrics.tamil[lineIndex].text + '\n';
                  content += song.lyrics.english[lineIndex].text + '\n\n';
                  break;
                case 'all':
                  content += song.lyrics.tamil[lineIndex].text + '\n';
                  content += song.lyrics.transliteration[lineIndex].text + '\n';
                  content += song.lyrics.english[lineIndex].text + '\n\n';
                  break;
                case 'tamil-transliteration':
                default:
                  content += song.lyrics.tamil[lineIndex].text + '\n';
                  content += song.lyrics.transliteration[lineIndex].text + '\n\n';
                  break;
              }
            }
            
            slides.push({
              type: 'song-lyrics',
              content: content.trim(),
              itemIndex,
              itemTitle: song.title,
              itemType: 'song',
              notes: item.notes || '',
              displayMode: displayMode
            });
          }
        } catch (error) {
          console.error('Error fetching song:', error);
        }
      } else if (item.type === 'verse') {
        slides.push({
          type: 'verse',
          reference: item.data.reference,
          content: item.data.text,
          itemIndex,
          itemTitle: item.data.reference,
          itemType: 'verse',
          notes: item.notes || ''
        });
      } else if (item.type === 'announcement') {
        slides.push({
          type: 'announcement',
          title: item.data.title,
          content: item.data.content,
          itemIndex,
          itemTitle: item.data.title,
          itemType: 'announcement',
          notes: item.notes || ''
        });
      }
    }
    
    setAllSlides(slides);
  }, [presentSettings.displayMode]);

  // Regenerate when display mode changes
  useEffect(() => {
    if (serviceItems.length > 0 && allSlides.length > 0) {
      const firstLyricsSlide = allSlides.find(s => s.type === 'song-lyrics');
      if (firstLyricsSlide && firstLyricsSlide.displayMode !== presentSettings.displayMode) {
        setTimeout(() => generateAllSlides(serviceItems), 200);
      }
    }
  }, [presentSettings.displayMode, serviceItems, allSlides, generateAllSlides]);

  // Timer
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Listen for messages
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'MAIN_READY') {
        setIsMainWindowReady(true);
        setConnectionStatus('connected');
        if (messageQueueRef.current.length > 0) {
          messageQueueRef.current.forEach(msg => sendToMainWindow(msg));
          messageQueueRef.current = [];
        }
      } else if (event.data.type === 'SLIDE_CHANGED') {
        setCurrentSlideIndex(event.data.slideIndex);
      } else if (event.data.type === 'SETTINGS_UPDATED') {
        setPresentSettings(event.data.settings);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Check connection
  useEffect(() => {
    if (!mainWindowRef) return;
    const checkConnection = setInterval(() => {
      if (mainWindowRef.closed) {
        setMainWindowRef(null);
        setIsMainWindowReady(false);
        setConnectionStatus('disconnected');
      }
    }, 1000);
    return () => clearInterval(checkConnection);
  }, [mainWindowRef]);

  // Auto-scroll to current slide
  useEffect(() => {
    if (slideListRef.current && activeTab === 'slides') {
      const currentElement = slideListRef.current.querySelector(`[data-slide-index="${currentSlideIndex}"]`);
      if (currentElement) {
        currentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentSlideIndex, activeTab]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        changeSlide(currentSlideIndex + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        changeSlide(currentSlideIndex - 1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        changeSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        changeSlide(allSlides.length - 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        changeSlide(currentSlideIndex - 1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        changeSlide(currentSlideIndex + 1);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlideIndex, allSlides]);

  // Drag resize
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const container = document.getElementById('main-container');
        if (container) {
          const rect = container.getBoundingClientRect();
          const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
          if (newWidth > 40 && newWidth < 70) {
            setLeftPanelWidth(newWidth);
          }
        }
      }
    };
    const handleMouseUp = () => setIsDragging(false);
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const sendToMainWindow = (message) => {
    if (mainWindowRef && !mainWindowRef.closed) {
      try {
        mainWindowRef.postMessage(message, '*');
        return true;
      } catch (error) {
        return false;
      }
    }
    return false;
  };

  const changeSlide = (newIndex) => {
    if (newIndex >= 0 && newIndex < allSlides.length) {
      setCurrentSlideIndex(newIndex);
      const message = { type: 'CHANGE_SLIDE', slideIndex: newIndex, timestamp: Date.now() };
      if (isMainWindowReady) {
        sendToMainWindow(message);
      } else {
        messageQueueRef.current.push(message);
      }
    }
  };

  const updateSettings = (newSettings) => {
    const displayModeChanged = newSettings.displayMode !== presentSettings.displayMode;
    setPresentSettings(newSettings);
    const message = { type: 'UPDATE_SETTINGS', settings: newSettings, timestamp: Date.now() };
    if (isMainWindowReady) {
      sendToMainWindow(message);
    }
    if (displayModeChanged && serviceItems.length > 0) {
      setTimeout(() => generateAllSlides(serviceItems), 300);
    }
  };

  const goToItem = (itemIndex) => {
    const slideIndex = allSlides.findIndex(slide => slide.itemIndex === itemIndex);
    if (slideIndex !== -1) {
      changeSlide(slideIndex);
    }
  };

  const openMainPresentation = () => {
    if (serviceItems.length === 0) {
      alert('No service items to present!');
      return;
    }
    setConnectionStatus('connecting');
    const params = new URLSearchParams({
      service: service,
      settings: JSON.stringify(presentSettings),
      controlMode: 'true'
    });
    const mainWindow = window.open(
      `/worship-presenter?${params.toString()}`,
      'mainPresentation',
      'fullscreen=yes,scrollbars=no,menubar=no,toolbar=no,location=no,status=no'
    );
    if (mainWindow) {
      setMainWindowRef(mainWindow);
      setTimeout(() => {
        if (!isMainWindowReady) {
          sendToMainWindow({ type: 'CHANGE_SLIDE', slideIndex: currentSlideIndex, timestamp: Date.now() });
        }
      }, 2000);
    } else {
      setConnectionStatus('disconnected');
      alert('Failed to open presentation window. Please allow pop-ups.');
    }
  };

  const closePresentation = () => {
    if (mainWindowRef && !mainWindowRef.closed) {
      mainWindowRef.close();
    }
    window.close();
    setTimeout(() => router.push('/worship-planner'), 100);
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

  if (!allSlides.length) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950 text-white">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-500 mx-auto mb-6"></div>
            <Zap size={32} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-500 animate-pulse" />
          </div>
          <div className="text-2xl font-bold mb-2">Loading Presenter Control...</div>
          <div className="text-gray-400">Preparing your worship service</div>
        </div>
      </div>
    );
  }

  const currentSlide = allSlides[currentSlideIndex];
  const nextSlide = currentSlideIndex < allSlides.length - 1 ? allSlides[currentSlideIndex + 1] : null;
  const currentBgColor = backgrounds[presentSettings.background].color;

  const groupedItems = serviceItems.map((item, index) => ({
    ...item,
    slides: allSlides.filter(slide => slide.itemIndex === index),
    isActive: currentSlide.itemIndex === index
  }));

  const renderSlidePreview = (slide, size = 'large') => {
    const fontSize = size === 'large' ? 'text-2xl' : 'text-lg';
    const titleSize = size === 'large' ? 'text-3xl' : 'text-xl';
    
    return (
      <div className="h-full w-full flex items-center justify-center p-4 transition-all duration-300" style={{ backgroundColor: currentBgColor }}>
        {slide.type === 'song-title' && (
          <h1 className={`${titleSize} font-bold text-center text-white drop-shadow-2xl line-clamp-3`} style={{ fontFamily: presentSettings.fontFamily }}>
            {slide.content}
          </h1>
        )}
        {slide.type === 'song-lyrics' && (
          <pre className={`${fontSize} text-center font-sans text-white whitespace-pre-wrap leading-relaxed drop-shadow-2xl line-clamp-5`} 
               style={{ fontFamily: presentSettings.fontFamily }}>
            {slide.content}
          </pre>
        )}
        {slide.type === 'verse' && (
          <div className="text-center text-white">
            <div className={`${size === 'large' ? 'text-xl' : 'text-base'} font-bold mb-3 text-yellow-300 drop-shadow-lg`}>{slide.reference}</div>
            <div className={`${fontSize} leading-relaxed drop-shadow-2xl line-clamp-4`}>{slide.content}</div>
          </div>
        )}
        {slide.type === 'announcement' && (
          <div className="text-center max-w-3xl text-white">
            <div className={`${titleSize} font-bold mb-3 drop-shadow-2xl line-clamp-2`}>{slide.title}</div>
            <div className={`${fontSize} leading-relaxed drop-shadow-2xl whitespace-pre-wrap line-clamp-3`}>{slide.content}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen bg-gray-950 text-white flex flex-col overflow-hidden">
      {/* Top Bar - Compact */}
      <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 border-b border-gray-800 shadow-2xl flex-shrink-0">
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
              <Monitor size={20} />
            </div>
            <div>
              <h1 className="text-base font-bold">Presenter Control</h1>
              <p className="text-xs text-gray-400">Dual-Screen Mode</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-black/50 backdrop-blur-xl rounded-lg px-3 py-1.5 border border-gray-700">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-blue-400" />
                <span className="font-mono text-xl font-bold">{formatTime(elapsedTime)}</span>
                <button onClick={() => setIsTimerRunning(!isTimerRunning)} className="p-1 hover:bg-white/10 rounded transition">
                  {isTimerRunning ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <button onClick={() => setElapsedTime(0)} className="p-1 hover:bg-white/10 rounded transition">
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>

            <div className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
              connectionStatus === 'connected' ? 'bg-green-500/20 text-green-400' :
              connectionStatus === 'connecting' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-gray-500/20 text-gray-400'
            }`}>
              <Activity size={12} className={connectionStatus === 'connected' ? 'animate-pulse' : ''} />
              {connectionStatus === 'connected' ? 'Live' : connectionStatus === 'connecting' ? 'Connecting' : 'Offline'}
            </div>

            {!mainWindowRef || mainWindowRef.closed ? (
              <button onClick={openMainPresentation} className="bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition text-xs">
                <Maximize2 size={14} />
                Open Main
              </button>
            ) : (
              <button onClick={() => mainWindowRef.focus()} className="bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition text-xs">
                <Eye size={14} />
                Focus
              </button>
            )}

            <button onClick={closePresentation} className="bg-red-600 hover:bg-red-700 p-1.5 rounded-lg transition">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Tabs - Integrated */}
        <div className="flex gap-0 px-4 bg-gray-950">
          <button onClick={() => setActiveTab('slides')} className={`px-4 py-2 font-semibold transition flex items-center gap-2 text-xs border-b-2 ${activeTab === 'slides' ? 'border-blue-500 text-white bg-gray-900/50' : 'border-transparent text-gray-400 hover:text-white'}`}>
            <Grid size={14} />
            Slides
            <span className="bg-blue-600 px-1.5 py-0.5 rounded text-xs">{allSlides.length}</span>
          </button>
          <button onClick={() => setActiveTab('service')} className={`px-4 py-2 font-semibold transition flex items-center gap-2 text-xs border-b-2 ${activeTab === 'service' ? 'border-purple-500 text-white bg-gray-900/50' : 'border-transparent text-gray-400 hover:text-white'}`}>
            <List size={14} />
            Service
            <span className="bg-purple-600 px-1.5 py-0.5 rounded text-xs">{serviceItems.length}</span>
          </button>
          <button onClick={() => setActiveTab('settings')} className={`px-4 py-2 font-semibold transition flex items-center gap-2 text-xs border-b-2 ${activeTab === 'settings' ? 'border-orange-500 text-white bg-gray-900/50' : 'border-transparent text-gray-400 hover:text-white'}`}>
            <Settings size={14} />
            Settings
          </button>
        </div>
      </div>

      {/* Main Content - Fixed Height, No Scroll */}
      <div id="main-container" className="flex-1 flex gap-0 bg-gray-950 overflow-hidden">
        {/* Left Panel - Fixed, No Scroll */}
        <div className="flex flex-col gap-3 p-3 bg-gray-950" style={{ width: `${leftPanelWidth}%` }}>
          {/* Previews - Fixed Height */}
          <div className="flex gap-3" style={{ height: '40vh' }}>
            <div className="flex-1 bg-gray-900 rounded-xl overflow-hidden shadow-2xl border-2 border-red-500 relative">
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/90 to-transparent px-3 py-2 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <span className="text-xs uppercase text-gray-400 font-semibold">Current</span>
                    <div className="text-xs font-bold truncate">{currentSlide.itemTitle}</div>
                  </div>
                  <div className="flex items-center gap-1 bg-red-600 px-2 py-0.5 rounded-full animate-pulse ml-2">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <span className="text-xs font-bold">LIVE</span>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-3 py-1.5 z-10">
                <div className="text-center text-sm font-bold">{currentSlideIndex + 1} / {allSlides.length}</div>
              </div>
              {renderSlidePreview(currentSlide, 'large')}
            </div>

            <div className="flex-1 bg-gray-900 rounded-xl overflow-hidden shadow-xl border-2 border-blue-500/30 relative">
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/90 to-transparent px-3 py-2 z-10">
                <span className="text-xs uppercase text-gray-400 font-semibold">Next</span>
              </div>
              <div className="h-full opacity-70">
                {nextSlide ? renderSlidePreview(nextSlide, 'large') : (
                  <div className="h-full flex items-center justify-center" style={{ backgroundColor: currentBgColor }}>
                    <div className="text-center">
                      <Square size={32} className="mx-auto mb-2 text-gray-500" />
                      <div className="text-lg text-gray-400 font-semibold">End</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Info Card - Fixed Height */}
          <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-xl p-3 shadow-xl border border-blue-800/50 flex-shrink-0">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-xs uppercase text-blue-300 mb-0.5 font-semibold">Current Item</h3>
                <div className="text-base font-bold line-clamp-1">{currentSlide.itemTitle}</div>
                <div className="text-xs text-gray-400 capitalize">{currentSlide.itemType} • {currentSlide.itemIndex + 1}/{serviceItems.length}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-400">{Math.round(((currentSlideIndex + 1) / allSlides.length) * 100)}%</div>
                <div className="text-xs text-gray-400">Done</div>
              </div>
            </div>
            <div className="mt-2 h-1.5 bg-black/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${((currentSlideIndex + 1) / allSlides.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Navigation - Fixed Height */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-3 shadow-xl border border-gray-700 flex-shrink-0">
            <h3 className="text-xs font-bold mb-2 text-gray-300 uppercase flex items-center gap-1.5">
              <ChevronRight size={12} />
              Quick Nav
            </h3>
            <div className="grid grid-cols-4 gap-1.5">
              <button onClick={() => changeSlide(0)} className="bg-gray-800 hover:bg-gray-700 py-2 rounded-lg transition flex flex-col items-center justify-center gap-0.5 text-xs">
                <Home size={14} />
                <span>First</span>
              </button>
              <button onClick={() => changeSlide(currentSlideIndex - 1)} disabled={currentSlideIndex === 0} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:opacity-50 py-2 rounded-lg transition flex flex-col items-center justify-center gap-0.5 text-xs">
                <ChevronLeft size={14} />
                <span>Prev</span>
              </button>
              <button onClick={() => changeSlide(currentSlideIndex + 1)} disabled={currentSlideIndex === allSlides.length - 1} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:opacity-50 py-2 rounded-lg transition flex flex-col items-center justify-center gap-0.5 text-xs">
                <ChevronRight size={14} />
                <span>Next</span>
              </button>
              <button onClick={() => changeSlide(allSlides.length - 1)} className="bg-gray-800 hover:bg-gray-700 py-2 rounded-lg transition flex flex-col items-center justify-center gap-0.5 text-xs">
                <Square size={14} />
                <span>Last</span>
              </button>
            </div>
          </div>
        </div>

        {/* Resize Handle */}
        <div 
          className={`w-1 bg-gray-800 hover:bg-blue-500 cursor-col-resize flex items-center justify-center group transition-all flex-shrink-0 ${isDragging ? 'bg-blue-500 w-2' : ''}`}
          onMouseDown={() => setIsDragging(true)}
        >
          <GripVertical size={16} className="text-gray-600 group-hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Right Panel - Full Height, Embedded Look */}
        <div className="flex-1 bg-gray-900 overflow-hidden flex flex-col">
          {/* Tab Content - Full Height, Only This Scrolls */}
          {activeTab === 'slides' && (
            <div className="flex-1 overflow-y-auto p-3" ref={slideListRef}>
              <div className="space-y-2">
                {allSlides.map((slide, index) => (
                  <button
                    key={`slide-${index}`}
                    data-slide-index={index}
                    onClick={() => changeSlide(index)}
                    className={`w-full text-left p-3 rounded-lg transition border-2 cursor-pointer transform hover:scale-[1.01] ${
                      currentSlideIndex === index 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 border-blue-400 shadow-lg scale-[1.02]' 
                        : 'bg-gray-800 border-gray-700 hover:bg-gray-750 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`text-lg font-bold w-8 text-center flex-shrink-0 ${
                        currentSlideIndex === index ? 'text-white' : 'text-gray-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate text-sm">{slide.itemTitle}</div>
                        <div className="text-xs text-gray-400 capitalize">{slide.type.replace('-', ' ')}</div>
                      </div>
                      {currentSlideIndex === index && (
                        <div className="bg-red-500 px-1.5 py-0.5 rounded-full text-xs font-bold animate-pulse flex-shrink-0">
                          LIVE
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'service' && (
            <div className="flex-1 overflow-y-auto p-3">
              <div className="space-y-2">
                {groupedItems.map((item, index) => (
                  <button
                    key={`item-${index}`}
                    onClick={() => goToItem(index)}
                    className={`w-full text-left p-4 rounded-lg transition border-2 cursor-pointer transform hover:scale-[1.01] ${
                      item.isActive 
                        ? 'bg-gradient-to-r from-yellow-600 to-orange-600 border-yellow-400 shadow-lg scale-[1.02]' 
                        : 'bg-gray-800 border-gray-700 hover:bg-gray-750 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`text-2xl font-bold flex-shrink-0 ${item.isActive ? 'text-white' : 'text-gray-600'}`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold mb-1 line-clamp-2">
                          {item.type === 'song' ? item.data.title : 
                           item.type === 'verse' ? item.data.reference : 
                           item.data.title}
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className={`px-2 py-0.5 rounded-full capitalize font-semibold ${
                            item.isActive ? 'bg-white/30' : 'bg-white/10'
                          }`}>
                            {item.type}
                          </span>
                          <span className="opacity-75">
                            {item.slides.length} slide{item.slides.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        {item.isActive && (
                          <div className="bg-white text-black px-2 py-0.5 rounded-full text-xs font-bold inline-block mt-1">
                            ▶ ACTIVE
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-2 text-gray-300">Text Display Mode</label>
                  <select
                    value={presentSettings.displayMode || 'tamil-transliteration'}
                    onChange={(e) => updateSettings({...presentSettings, displayMode: e.target.value})}
                    className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 transition text-sm"
                  >
                    <option value="tamil-transliteration">Tamil + Transliteration</option>
                    <option value="tamil-only">Tamil Only</option>
                    <option value="transliteration-only">Transliteration Only</option>
                    <option value="english-only">English Only</option>
                    <option value="tamil-english">Tamil + English</option>
                    <option value="all">All Three Languages</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2 text-gray-300">Background Color</label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(backgrounds).map(([key, value]) => (
                      <button
                        key={key}
                        onClick={() => updateSettings({...presentSettings, background: key})}
                        className={`p-3 rounded-lg border-2 transition cursor-pointer ${
                          presentSettings.background === key 
                            ? 'border-blue-500 ring-2 ring-blue-500/50 scale-105' 
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                        style={{ backgroundColor: value.color }}
                      >
                        <div className="text-white text-xs font-semibold text-center drop-shadow-lg">
                          {value.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2 text-gray-300">Font Family</label>
                  <select
                    value={presentSettings.fontFamily}
                    onChange={(e) => updateSettings({...presentSettings, fontFamily: e.target.value})}
                    className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 transition text-sm"
                  >
                    {fontFamilies.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2 text-gray-300">
                    Font Size: {presentSettings.fontSize}pt
                  </label>
                  <input
                    type="range"
                    min="24"
                    max="48"
                    value={presentSettings.fontSize}
                    onChange={(e) => updateSettings({...presentSettings, fontSize: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Small</span>
                    <span>Medium</span>
                    <span>Large</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-700">
                  <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Zap size={18} className="text-blue-400 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-semibold text-xs mb-1">Instant Updates</div>
                        <div className="text-xs text-gray-400 leading-relaxed">
                          All changes apply immediately to the live presentation
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}