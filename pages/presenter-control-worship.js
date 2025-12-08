import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw, X, Clock, Settings, Home, Square, Smartphone, Maximize2, Eye, Activity, RefreshCw, Search, Zap, History } from 'lucide-react';
import QRCodeGenerator from '../components/QRCodeGenerator';
import { createSession, updateSession, listenToSession, clearCommand } from '../lib/firebase';
import { songStorage } from '../utils/songStorage';

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
  const [isMainWindowReady, setIsMainWindowReady] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [showSettings, setShowSettings] = useState(false);
  const messageQueueRef = useRef([]);
  const slideListRef = useRef(null);
  
  // Display states
  const [isBlackScreen, setIsBlackScreen] = useState(false);
  const [isClearScreen, setIsClearScreen] = useState(false);
  
  // Firebase states
  const [sessionId, setSessionId] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [remoteConnected, setRemoteConnected] = useState(false);
  const [processedCommands, setProcessedCommands] = useState(new Set());

  // Auto-refresh state
  const [refreshing, setRefreshing] = useState(false);
  
  // Preview state
  const [previewSlideIndex, setPreviewSlideIndex] = useState(null);
  const [previewSettings, setPreviewSettings] = useState(null); // For settings preview
  
  // 🔥 NEW: World-class features
  const [searchQuery, setSearchQuery] = useState('');
  const [slideHistory, setSlideHistory] = useState([]);
  const [showHotkeys, setShowHotkeys] = useState(false);

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

  // Generate session ID
  useEffect(() => {
    const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
  }, []);

  // Create Firebase session
  useEffect(() => {
    if (sessionId && allSlides.length > 0) {
      createSession(sessionId, {
        currentSlide: currentSlideIndex,
        totalSlides: allSlides.length,
        status: 'active'
      });
    }
  }, [sessionId, allSlides.length]);

  // Listen for remote commands
  useEffect(() => {
    if (!sessionId) return;

    const unsubscribe = listenToSession(sessionId, (data) => {
      if (data.currentSlide !== undefined && data.currentSlide !== currentSlideIndex) {
        setCurrentSlideIndex(data.currentSlide);
      }
      
      if (data.command) {
        const { action, timestamp } = data.command;
        const commandId = `${action}-${timestamp}`;
      
        if (processedCommands.has(commandId)) return;
      
        const age = Date.now() - timestamp;
        if (age < 5000) {
          setProcessedCommands(prev => {
            const newSet = new Set(prev);
            newSet.add(commandId);
            return newSet;
          });
          
          handleRemoteCommand(action);
          
          setTimeout(() => {
            clearCommand(sessionId).catch(err => console.error('Failed to clear command:', err));
          }, 500);
        }
      }
    
      if (data.remoteConnected) {
        setRemoteConnected(true);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [sessionId, processedCommands, currentSlideIndex]);

  // Sync slide changes to Firebase
  useEffect(() => {
    if (sessionId && allSlides.length > 0) {
      updateSession(sessionId, {
        currentSlide: currentSlideIndex,
        totalSlides: allSlides.length,
        status: 'active'
      });
    }
  }, [currentSlideIndex, allSlides.length, sessionId]);

  // Handle remote commands
  const handleRemoteCommand = (action) => {
    switch(action) {
      case 'NEXT_SLIDE':
        if (currentSlideIndex < allSlides.length - 1) {
          changeSlide(currentSlideIndex + 1);
        }
        break;
      case 'PREV_SLIDE':
        if (currentSlideIndex > 0) {
          changeSlide(currentSlideIndex - 1);
        }
        break;
      case 'FIRST_SLIDE':
        changeSlide(0);
        break;
      case 'LAST_SLIDE':
        changeSlide(allSlides.length - 1);
        break;
      case 'BLACK_SCREEN':
        toggleBlackScreen();
        break;
      case 'CLEAR_SCREEN':
        toggleClearScreen();
        break;
    }
  };

  // Generate ALL slides individually
  const generateAllSlides = useCallback(async (items, customSettings = null) => {
    const slides = [];
    const settings = customSettings || previewSettings || presentSettings;
    const displayMode = settings.displayMode || 'tamil-transliteration';
  
    console.log('📊 Generating slides with display mode:', displayMode);
    
    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
      const item = items[itemIndex];
      
      if (item.type === 'song') {
        try {
          let song;
          
          if (item.data.id && item.data.id.toString().startsWith('custom-')) {
            const customSongs = songStorage.getCustomSongs();
            song = customSongs.find(s => s.id === item.data.id);
            if (!song) continue;
          } else {
            const response = await fetch(`/api/songs/${item.data.id}`);
            if (!response.ok) continue;
            song = await response.json();
          }
          
          if (!song.lyrics || !song.lyrics.tamil || !song.lyrics.transliteration) continue;
          
          // Title slide
          slides.push({
            type: 'song-title',
            content: song.title,
            itemIndex,
            itemTitle: song.title,
            itemType: 'song',
            slideLabel: `${song.title} - Title`
          });

          // Lyric slides
          const maxLines = Math.max(
            song.lyrics.tamil?.length || 0,
            song.lyrics.transliteration?.length || 0,
            song.lyrics.english?.length || 0
          );

          let verseNum = 1;
          for (let i = 0; i < maxLines; i += 2) {
            let content = '';
            
            for (let j = 0; j < 2 && (i + j) < maxLines; j++) {
              const lineIndex = i + j;
              
              switch(displayMode) {
                case 'tamil-only':
                  if (song.lyrics.tamil[lineIndex]) {
                    content += song.lyrics.tamil[lineIndex].text + '\n\n';
                  }
                  break;
                case 'transliteration-only':
                  if (song.lyrics.transliteration[lineIndex]) {
                    content += song.lyrics.transliteration[lineIndex].text + '\n\n';
                  }
                  break;
                case 'tamil-transliteration':
                default:
                  if (song.lyrics.tamil[lineIndex]) {
                    content += song.lyrics.tamil[lineIndex].text + '\n';
                  }
                  if (song.lyrics.transliteration[lineIndex]) {
                    content += song.lyrics.transliteration[lineIndex].text + '\n\n';
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
                itemType: 'song',
                slideLabel: `${song.title} - Verse ${verseNum}`,
                displayMode: displayMode
              });
              verseNum++;
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
          itemType: 'verse',
          slideLabel: item.data.reference
        });
      } else if (item.type === 'announcement') {
        slides.push({
          type: 'announcement',
          title: item.data.title,
          content: item.data.content,
          itemIndex,
          itemTitle: item.data.title,
          itemType: 'announcement',
          slideLabel: item.data.title
        });
      }
    }
    
    setAllSlides(slides);
  }, [presentSettings.displayMode]);

  // Auto-refresh function
  const checkForUpdates = useCallback(async () => {
    if (refreshing) return;
    
    setRefreshing(true);
    try {
      const savedService = localStorage.getItem('worship-autosave');
      if (!savedService) {
        setRefreshing(false);
        return;
      }

      const data = JSON.parse(savedService);
      const newItems = data.items || [];
      
      const hasChanged = 
        newItems.length !== serviceItems.length ||
        JSON.stringify(newItems) !== JSON.stringify(serviceItems);
      
      if (hasChanged) {
        const savedIndex = currentSlideIndex;
        setServiceItems(newItems);
        await generateAllSlides(newItems);
        
        setTimeout(() => {
          if (savedIndex < allSlides.length) {
            setCurrentSlideIndex(savedIndex);
          }
        }, 500);
      }
    } catch (error) {
      console.error('❌ Auto-refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [serviceItems, currentSlideIndex, allSlides.length, generateAllSlides, refreshing]);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!refreshing) {
        checkForUpdates();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [checkForUpdates, refreshing]);

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
      } else if (event.data.type === 'SLIDE_CHANGED') {
        setCurrentSlideIndex(event.data.slideIndex);
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
    if (slideListRef.current) {
      const currentElement = slideListRef.current.querySelector(`[data-slide-index="${currentSlideIndex}"]`);
      if (currentElement) {
        currentElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [currentSlideIndex]);

  // 🔥 Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
      
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
      } else if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        toggleBlackScreen();
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        toggleClearScreen();
      } else if (e.key === '?' && e.shiftKey) {
        e.preventDefault();
        setShowHotkeys(!showHotkeys);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlideIndex, allSlides, isBlackScreen, isClearScreen, showHotkeys]);

  // Track slide history
  useEffect(() => {
    if (currentSlideIndex !== null && !slideHistory.includes(currentSlideIndex)) {
      setSlideHistory(prev => {
        const newHistory = [currentSlideIndex, ...prev];
        return newHistory.slice(0, 10); // Keep last 10
      });
    }
  }, [currentSlideIndex]);

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

  const updateSettings = async (newSettings) => {
    const displayModeChanged = newSettings.displayMode !== presentSettings.displayMode;
  
    setPresentSettings(newSettings);
  
    const message = { type: 'UPDATE_SETTINGS', settings: newSettings, timestamp: Date.now() };
    if (isMainWindowReady) {
      sendToMainWindow(message);
    }
  
    // Regenerate if display mode changed
    if (displayModeChanged && serviceItems.length > 0) {
      console.log('🔄 Display mode changed, regenerating slides...');
      setTimeout(() => generateAllSlides(serviceItems, newSettings), 300);
    }
  };

  // 🔥 NEW: Preview settings without applying
  // 🔥 IMPROVED: Preview settings without applying + regenerate if display mode changed
  // 🔥 FIXED: Preview settings with FORCED re-render
  const previewSettingsChange = async (newSettings) => {
    console.log('🎨 Preview settings changing:', newSettings);
    setPreviewSettings(newSettings);
  
    // If display mode changed, MUST regenerate slides
    if (newSettings.displayMode !== presentSettings.displayMode) {
      console.log('🔄 Display mode changed to:', newSettings.displayMode);
    
      // Update presentSettings temporarily to regenerate with new mode
      setPresentSettings(newSettings);
    
      // Force regenerate all slides
      await generateAllSlides(serviceItems);
    
      // Force preview panel to update by resetting and setting index
      const currentIdx = currentSlideIndex;
      setPreviewSlideIndex(null);
    
      setTimeout(() => {
        setPreviewSlideIndex(currentIdx);
        setPreviewSettings(newSettings); // Keep preview active
      }, 100);
    
      console.log('✅ Slides regenerated with new display mode');
    } else {
      // Just color/font changes - force preview update
      setPreviewSlideIndex(null);
      setTimeout(() => {
        setPreviewSlideIndex(currentSlideIndex);
      }, 50);
    }
  };

  // 🔥 NEW: Apply previewed settings
  // 🔥 IMPROVED: Apply previewed settings and regenerate if needed
  // 🔥 FIXED: Apply previewed settings with proper regeneration
  const applyPreviewSettings = async () => {
    if (previewSettings) {
      const displayModeChanged = previewSettings.displayMode !== presentSettings.displayMode;
    
      console.log('✅ Applying settings to main screen:', previewSettings);
    
      // Update settings first
      setPresentSettings(previewSettings);
    
      // Send to main window
      const message = { type: 'UPDATE_SETTINGS', settings: previewSettings, timestamp: Date.now() };
      if (isMainWindowReady) {
        sendToMainWindow(message);
      }
    
      // Regenerate slides if display mode changed
      if (displayModeChanged) {
        console.log('🔄 Display mode changed, regenerating local slides...');
        await generateAllSlides(serviceItems, previewSettings);
      }
    
      // Clear preview state
      setPreviewSettings(null);
      setPreviewSlideIndex(currentSlideIndex);
    }
  };

  const toggleBlackScreen = () => {
    const newState = !isBlackScreen;
    setIsBlackScreen(newState);
    setIsClearScreen(false);
    
    if (mainWindowRef && !mainWindowRef.closed) {
      mainWindowRef.postMessage({
        type: 'TOGGLE_BLACK_SCREEN',
        value: newState,
        timestamp: Date.now()
      }, '*');
    }
  };

  const toggleClearScreen = () => {
    const newState = !isClearScreen;
    setIsClearScreen(newState);
    setIsBlackScreen(false);
    
    if (mainWindowRef && !mainWindowRef.closed) {
      mainWindowRef.postMessage({
        type: 'TOGGLE_CLEAR_SCREEN',
        value: newState,
        timestamp: Date.now()
      }, '*');
    }
  };

  const openMainPresentation = (fromStart = true) => {
    if (serviceItems.length === 0) {
      alert('No service items to present!');
      return;
    }
  
    // Determine starting index
    const startIndex = fromStart ? 0 : currentSlideIndex;
  
    setConnectionStatus('connecting');
    const params = new URLSearchParams({
      service: service,
      settings: JSON.stringify(presentSettings),
      controlMode: 'true',
      startIndex: startIndex.toString()
    });
  
    console.log(`🎬 Opening presentation from slide ${startIndex + 1}`);
  
    const mainWindow = window.open(
      `/worship-presenter?${params.toString()}`,
      'mainPresentation',
      'fullscreen=yes,scrollbars=no,menubar=no,toolbar=no,location=no,status=no'
    );
  
    if (mainWindow) {
      setMainWindowRef(mainWindow);
      // Set current index if starting from current
      if (!fromStart) {
        setTimeout(() => {
          if (isMainWindowReady) {
            sendToMainWindow({ 
              type: 'CHANGE_SLIDE', 
              slideIndex: startIndex, 
              timestamp: Date.now() 
            });
          }
        }, 1000);
      }
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
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-500 mx-auto mb-6"></div>
          <div className="text-2xl font-bold">Loading Presenter Control...</div>
        </div>
      </div>
    );
  }

  const currentSlide = allSlides[currentSlideIndex];
  const nextSlide = currentSlideIndex < allSlides.length - 1 ? allSlides[currentSlideIndex + 1] : null;
  
  // Use preview settings if available, otherwise use current settings
  const activeSettings = previewSettings || presentSettings;
  const currentBgColor = backgrounds[activeSettings.background].color;

  // Filter slides based on search
  const filteredSlides = searchQuery
    ? allSlides.filter(slide => 
        slide.slideLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        slide.content?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allSlides;

  // 🔥 IMPROVED: Render slide with black/clear screen support
  const renderSlidePreview = (slide, size = 'large', showBlackClear = false) => {
    const fontSize = size === 'large' ? 'text-xl' : size === 'medium' ? 'text-base' : 'text-sm';
    const titleSize = size === 'large' ? 'text-2xl' : size === 'medium' ? 'text-xl' : 'text-base';
    
    // Show black or clear screen if active and showBlackClear is true
    if (showBlackClear && isBlackScreen) {
      return (
        <div className="h-full w-full flex items-center justify-center bg-black">
          <div className="text-gray-700 text-4xl">⚫</div>
        </div>
      );
    }
    
    if (showBlackClear && isClearScreen) {
      return (
        <div className="h-full w-full" style={{ backgroundColor: currentBgColor }}>
        </div>
      );
    }
    
    return (
      <div className="h-full w-full flex items-center justify-center p-4" style={{ backgroundColor: currentBgColor }}>
        {slide.type === 'song-title' && (
          <h1 className={`${titleSize} font-bold text-center text-white drop-shadow-2xl line-clamp-3`} style={{ fontFamily: activeSettings.fontFamily }}>
            {slide.content}
          </h1>
        )}
        {slide.type === 'song-lyrics' && (
          <pre className={`${fontSize} text-center font-sans text-white whitespace-pre-wrap leading-relaxed drop-shadow-2xl line-clamp-6`} style={{ fontFamily: activeSettings.fontFamily }}>
            {slide.content}
          </pre>
        )}
        {slide.type === 'verse' && (
          <div className="text-center text-white">
            <div className="text-lg font-bold mb-2 text-yellow-300" style={{ fontFamily: activeSettings.fontFamily }}>{slide.reference}</div>
            <div className={`${fontSize} line-clamp-4`} style={{ fontFamily: activeSettings.fontFamily }}>{slide.content}</div>
          </div>
        )}
        {slide.type === 'announcement' && (
          <div className="text-center text-white">
            <div className={`${titleSize} font-bold mb-2 line-clamp-2`} style={{ fontFamily: activeSettings.fontFamily }}>{slide.title}</div>
            <div className={`${fontSize} line-clamp-3`} style={{ fontFamily: activeSettings.fontFamily }}>{slide.content}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen bg-gray-950 text-white flex flex-col overflow-hidden">
      {/* FIXED TOP BAR */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-2 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Zap size={20} className="text-blue-400" />
            <div className="text-lg font-bold text-blue-400">ChurchAssist Pro</div>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
            connectionStatus === 'connected' ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
          }`}>
            <Activity size={12} className={connectionStatus === 'connected' ? 'animate-pulse' : ''} />
            {connectionStatus === 'connected' ? 'LIVE' : 'Offline'}
          </div>
          {refreshing && (
            <div className="flex items-center gap-2 text-xs text-blue-400">
              <RefreshCw size={12} className="animate-spin" />
              Updating...
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-gray-800 px-4 py-1.5 rounded-lg flex items-center gap-2">
            <Clock size={16} />
            <span className="font-mono text-lg font-bold">{formatTime(elapsedTime)}</span>
            <button onClick={() => setIsTimerRunning(!isTimerRunning)} className="p-1 hover:bg-gray-700 rounded">
              {isTimerRunning ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <button onClick={() => setElapsedTime(0)} className="p-1 hover:bg-gray-700 rounded">
              <RotateCcw size={14} />
            </button>
          </div>

          <button
            onClick={checkForUpdates}
            disabled={refreshing}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 ${
              refreshing ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title="Refresh service (Auto-refresh: 5s)"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          </button>

          <button
            onClick={() => setShowHotkeys(!showHotkeys)}
            className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-gray-700 hover:bg-gray-600"
            title="Keyboard Shortcuts (Shift+?)"
          >
            ⌨️
          </button>

          <button
            onClick={() => setShowQRCode(!showQRCode)}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
              remoteConnected ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title="Mobile Remote"
          >
            <Smartphone size={16} />
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-gray-700 hover:bg-gray-600"
            title="Settings"
          >
            <Settings size={16} />
          </button>

          {!mainWindowRef || mainWindowRef.closed ? (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => openMainPresentation(true)} 
                className="bg-green-600 hover:bg-green-700 px-4 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2"
                title="Start from first slide"
              >
                <Maximize2 size={16} />
                From Start
              </button>
              <button 
                onClick={() => openMainPresentation(false)} 
                className="bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2"
                title="Start from current slide"
              >
                <Play size={16} />
                From Current
              </button>
            </div>
          ) : (
            <button onClick={() => mainWindowRef.focus()} className="bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2">
              <Eye size={16} />
              Focus
            </button>
          )}

          <button onClick={closePresentation} className="bg-red-600 hover:bg-red-700 p-1.5 rounded-lg">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* MAIN LAYOUT - PROFESSIONAL 3-COLUMN */}
      <div className="flex-1 flex gap-0 overflow-hidden">
        {/* LEFT: Current/Next Preview (35%) */}
        <div className="w-[35%] bg-gray-900 flex flex-col">
          {/* Current Slide - SHOWS BLACK/CLEAR */}
          <div className="h-[50%] p-4">
            <div className="h-full bg-black rounded-xl overflow-hidden border-4 border-red-500 relative shadow-2xl">
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/90 to-transparent p-3 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-400 uppercase font-bold">CURRENT OUTPUT</div>
                    <div className="text-sm font-bold truncate">
                      {isBlackScreen ? '⚫ Black Screen' : isClearScreen ? '🔲 Clear Screen' : currentSlide.slideLabel}
                    </div>
                  </div>
                  <div className="bg-red-600 px-3 py-1 rounded-full animate-pulse">
                    <span className="text-xs font-bold">LIVE</span>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 z-10">
                <div className="text-center text-2xl font-bold">{currentSlideIndex + 1} / {allSlides.length}</div>
              </div>
              {renderSlidePreview(currentSlide, 'large', true)}
            </div>
          </div>

          {/* Next Slide */}
          <div className="h-[30%] p-4 pt-0">
            <div className="h-full bg-gray-800 rounded-xl overflow-hidden border-2 border-blue-500/30 relative">
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/90 to-transparent p-2 z-10">
                <div className="text-xs text-gray-400 uppercase font-bold">NEXT</div>
              </div>
              <div className="h-full opacity-60">
                {nextSlide ? renderSlidePreview(nextSlide, 'medium', false) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-gray-500 text-center">
                      <Square size={32} className="mx-auto mb-2" />
                      <div className="text-sm font-bold">End of Service</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="p-4 pt-0 space-y-2">
            <div className="grid grid-cols-4 gap-2">
              <button onClick={() => changeSlide(0)} disabled={currentSlideIndex === 0} className="bg-gray-800 hover:bg-gray-700 disabled:opacity-30 py-2 rounded-lg flex flex-col items-center justify-center gap-1">
                <Home size={18} />
                <span className="text-xs">First</span>
              </button>
              <button onClick={() => changeSlide(currentSlideIndex - 1)} disabled={currentSlideIndex === 0} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-30 py-2 rounded-lg flex flex-col items-center justify-center gap-1">
                <ChevronLeft size={18} />
                <span className="text-xs">Prev</span>
              </button>
              <button onClick={() => changeSlide(currentSlideIndex + 1)} disabled={currentSlideIndex >= allSlides.length - 1} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-30 py-2 rounded-lg flex flex-col items-center justify-center gap-1">
                <ChevronRight size={18} />
                <span className="text-xs">Next</span>
              </button>
              <button onClick={() => changeSlide(allSlides.length - 1)} disabled={currentSlideIndex >= allSlides.length - 1} className="bg-gray-800 hover:bg-gray-700 disabled:opacity-30 py-2 rounded-lg flex flex-col items-center justify-center gap-1">
                <Square size={18} />
                <span className="text-xs">Last</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={toggleBlackScreen} className={`py-2 rounded-lg flex items-center justify-center gap-2 transition ${isBlackScreen ? 'bg-yellow-500 text-black' : 'bg-gray-800 hover:bg-gray-700'}`}>
                <div className="w-4 h-4 bg-black border-2 border-current rounded"></div>
                <span className="text-xs font-semibold">{isBlackScreen ? 'Show' : 'Black (B)'}</span>
              </button>
              <button onClick={toggleClearScreen} className={`py-2 rounded-lg flex items-center justify-center gap-2 transition ${isClearScreen ? 'bg-yellow-500 text-black' : 'bg-gray-800 hover:bg-gray-700'}`}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                </svg>
                <span className="text-xs font-semibold">{isClearScreen ? 'Show' : 'Clear (C)'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* CENTER: All Slides with Search (40%) */}
        <div className="w-[40%] bg-gray-950 flex flex-col border-x border-gray-800">
          <div className="p-4 border-b border-gray-800 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-300 uppercase">All Slides</h3>
              <div className="text-xs text-gray-500">{allSlides.length} slides</div>
            </div>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search slides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            {slideHistory.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <History size={14} className="text-gray-500 flex-shrink-0" />
                {slideHistory.slice(0, 5).map(idx => (
                  <button
                    key={idx}
                    onClick={() => changeSlide(idx)}
                    className="bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded text-xs flex-shrink-0"
                  >
                    #{idx + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div ref={slideListRef} className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {filteredSlides.map((slide, origIndex) => {
              const index = allSlides.indexOf(slide);
              return (
                <div
                  key={`slide-${index}`}
                  data-slide-index={index}
                  className="group relative"
                >
                  <button
                    onClick={() => changeSlide(index)}
                    onMouseEnter={() => setPreviewSlideIndex(index)}
                    className={`w-full text-left p-3 rounded-lg transition border-2 ${
                      currentSlideIndex === index 
                        ? 'bg-blue-600 border-blue-400 shadow-lg' 
                        : 'bg-gray-800 border-gray-700 hover:bg-gray-750 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`text-lg font-bold w-10 text-center flex-shrink-0 ${
                        currentSlideIndex === index ? 'text-white' : 'text-gray-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate text-sm">{slide.slideLabel}</div>
                        <div className="text-xs text-gray-400 capitalize">{slide.type.replace('-', ' ')}</div>
                      </div>
                      {currentSlideIndex === index && (
                        <div className="bg-red-500 px-2 py-0.5 rounded-full text-xs font-bold animate-pulse">
                          LIVE
                        </div>
                      )}
                    </div>
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewSlideIndex(index);
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition"
                    title="Preview"
                  >
                    👁️
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Preview Panel with Settings Preview (25%) */}
        <div className="w-[25%] bg-gray-900 p-4 flex flex-col gap-4">
          <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-xl p-4 border border-blue-800/50">
            <div className="text-xs text-blue-300 uppercase font-bold mb-2">Progress</div>
            <div className="text-4xl font-bold text-blue-400 mb-2">
              {Math.round(((currentSlideIndex + 1) / allSlides.length) * 100)}%
            </div>
            <div className="h-2 bg-black/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 rounded-full"
                style={{ width: `${((currentSlideIndex + 1) / allSlides.length) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-400 mt-2">
              {currentSlideIndex + 1} of {allSlides.length} slides
            </div>
          </div>

          <div className="flex-1 bg-gray-800 rounded-xl overflow-hidden border-2 border-purple-600 flex flex-col">
            <div className="p-3 bg-gradient-to-r from-purple-900 to-pink-900 border-b border-purple-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="text-xs text-purple-300 uppercase font-bold">Preview</div>
                {previewSettings && (
                  <div className="bg-orange-500 px-2 py-0.5 rounded-full text-xs font-bold">
                    Settings Preview
                  </div>
                )}
                {previewSlideIndex !== null && previewSlideIndex !== currentSlideIndex && !previewSettings && (
                  <div className="bg-purple-500 px-2 py-0.5 rounded-full text-xs font-bold">
                    NOT LIVE
                  </div>
                )}
              </div>
              {previewSlideIndex !== null && previewSlideIndex !== currentSlideIndex && !previewSettings && (
                <button
                  onClick={() => changeSlide(previewSlideIndex)}
                  className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs font-bold"
                  title="Send to main screen"
                >
                  GO LIVE
                </button>
              )}
              {previewSettings && (
                <button
                  onClick={applyPreviewSettings}
                  className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs font-bold"
                  title="Apply settings"
                >
                  APPLY
                </button>
              )}
            </div>
            <div className="flex-1 relative">
              {previewSlideIndex !== null ? (
                <>
                  {renderSlidePreview(allSlides[previewSlideIndex], 'small', false)}
                  <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur p-2 rounded">
                    <div className="text-xs text-center font-bold">
                      Slide {previewSlideIndex + 1}: {allSlides[previewSlideIndex].slideLabel}
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center p-4 text-center">
                  <div>
                    <div className="text-4xl mb-3">👁️</div>
                    <div className="text-sm font-bold text-gray-400 mb-2">Preview Panel</div>
                    <div className="text-xs text-gray-500">
                      Hover over slides to preview or adjust settings
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hotkeys Modal */}
      {showHotkeys && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">⌨️ Keyboard Shortcuts</h2>
              <button onClick={() => setShowHotkeys(false)} className="p-2 hover:bg-gray-800 rounded-lg">
                <X size={24} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Next Slide</span>
                  <kbd className="bg-gray-800 px-3 py-1 rounded">→ or Space</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Previous Slide</span>
                  <kbd className="bg-gray-800 px-3 py-1 rounded">←</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">First Slide</span>
                  <kbd className="bg-gray-800 px-3 py-1 rounded">Home</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Last Slide</span>
                  <kbd className="bg-gray-800 px-3 py-1 rounded">End</kbd>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Black Screen</span>
                  <kbd className="bg-gray-800 px-3 py-1 rounded">B</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Clear Screen</span>
                  <kbd className="bg-gray-800 px-3 py-1 rounded">C</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Show Hotkeys</span>
                  <kbd className="bg-gray-800 px-3 py-1 rounded">Shift + ?</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">📱 Mobile Remote</h2>
              <button onClick={() => setShowQRCode(false)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                <X size={24} />
              </button>
            </div>
            <QRCodeGenerator 
              url={`${typeof window !== 'undefined' ? window.location.origin : ''}/remote-control?sessionId=${sessionId}`}
              size={250}
            />
            <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">Scan with your phone camera to control slides remotely</p>
            </div>
          </div>
        </div>
      )}

      {/* Settings Panel - LEFT SIDE, DOESN'T BLOCK PREVIEW */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex">
          {/* Settings Panel - Left Side */}
          <div className="w-full max-w-md bg-gray-900 shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 z-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">⚙️ Settings</h2>
                <button 
                  onClick={() => {
                    setShowSettings(false);
                    setPreviewSettings(null);
                  }} 
                  className="p-2 hover:bg-gray-800 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Live Preview Indicator */}
              {previewSettings && (
                <div className="bg-orange-500/20 border border-orange-500 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye size={16} className="text-orange-400" />
                    <span className="text-sm font-bold text-orange-300">Preview Active</span>
                  </div>
                  <p className="text-xs text-orange-200">Check the preview panel on the right →</p>
                </div>
              )}
            </div>

            <div className="p-6 space-y-6">
              {/* Mini Preview Inside Settings */}
              <div className="bg-gray-800 rounded-xl overflow-hidden border-2 border-purple-600">
                <div className="bg-purple-900 px-3 py-2 border-b border-purple-700">
                  <div className="text-xs font-bold text-purple-300">MINI PREVIEW</div>
                </div>
                <div className="aspect-video">
                  {renderSlidePreview(currentSlide, 'small', false)}
                </div>
              </div>

              {/* Display Mode */}
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-300">Text Display Mode</label>
                <select
                  value={(previewSettings || presentSettings).displayMode || 'tamil-transliteration'}
                  onChange={(e) => {
                    const newSettings = {...(previewSettings || presentSettings), displayMode: e.target.value};
                    previewSettingsChange(newSettings);
                    setPreviewSlideIndex(currentSlideIndex);
                  }}
                  className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg px-4 py-3 text-white"
                >
                  <option value="tamil-transliteration">Tamil + Transliteration</option>
                  <option value="tamil-only">Tamil Only</option>
                  <option value="transliteration-only">Transliteration Only</option>
                </select>
              </div>

              {/* Background Color */}
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-300">Background Color</label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(backgrounds).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => {
                        const newSettings = {...(previewSettings || presentSettings), background: key};
                        previewSettingsChange(newSettings);
                        setPreviewSlideIndex(currentSlideIndex);
                      }}
                      className={`p-4 rounded-lg border-2 transition ${
                        (previewSettings || presentSettings).background === key 
                          ? 'border-blue-500 ring-2 ring-blue-500/50' 
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                      style={{ backgroundColor: value.color }}
                    >
                      <div className="text-white text-xs font-bold text-center">{value.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Family */}
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-300">Font Family</label>
                <select
                  value={(previewSettings || presentSettings).fontFamily}
                  onChange={(e) => {
                    const newSettings = {...(previewSettings || presentSettings), fontFamily: e.target.value};
                    previewSettingsChange(newSettings);
                    setPreviewSlideIndex(currentSlideIndex);
                  }}
                  className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg px-4 py-3 text-white"
                >
                  {fontFamilies.map(font => (
                    <option key={font} value={font}>{font}</option>
                  ))}
                </select>
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-300">
                  Font Size: {(previewSettings || presentSettings).fontSize}pt
                </label>
                <input
                  type="range"
                  min="24"
                  max="48"
                  value={(previewSettings || presentSettings).fontSize}
                  onChange={(e) => {
                    const newSettings = {...(previewSettings || presentSettings), fontSize: parseInt(e.target.value)};
                    previewSettingsChange(newSettings);
                    setPreviewSlideIndex(currentSlideIndex);
                  }}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>24pt</span>
                  <span>36pt</span>
                  <span>48pt</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="sticky bottom-0 bg-gray-900 pt-4 pb-2 space-y-2 border-t border-gray-800">
                {previewSettings ? (
                  <>
                    <button
                      onClick={() => {
                        applyPreviewSettings();
                        setShowSettings(false);
                      }}
                      className="w-full bg-green-600 hover:bg-green-700 px-4 py-3 rounded-lg font-bold flex items-center justify-center gap-2"
                    >
                      <Zap size={18} />
                      Apply to Main Screen
                    </button>
                    <button
                      onClick={() => {
                        setPreviewSettings(null);
                        setPreviewSlideIndex(null);
                      }}
                      className="w-full bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-lg font-bold"
                    >
                      Cancel Changes
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowSettings(false)}
                    className="w-full bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-lg font-bold"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Transparent overlay - Click to close */}
          <div 
            className="flex-1 cursor-pointer" 
            onClick={() => {
              setShowSettings(false);
              setPreviewSettings(null);
            }}
          ></div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
}