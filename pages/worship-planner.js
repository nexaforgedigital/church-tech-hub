import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { 
  Plus, Trash2, Play, BookOpen, Music, MessageSquare, X, Copy, 
  Upload, Download as DownloadIcon, Palette, Monitor, Calendar,
  ChevronUp, ChevronDown, Sparkles, Search
} from 'lucide-react';
import { songStorage } from '../utils/songStorage';

// Cross Pattern Component
const CrossPattern = ({ opacity = 0.02 }) => (
  <div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <pattern id="cross-pattern-planner" x="0" y="0" width="80" height="100" patternUnits="userSpaceOnUse">
        <rect x="36" y="10" width="8" height="80" rx="1" fill="white"/>
        <rect x="24" y="25" width="32" height="8" rx="1" fill="white"/>
      </pattern>
      <rect width="100%" height="100%" fill="url(#cross-pattern-planner)"/>
    </svg>
  </div>
);

export default function WorshipPlanner() {
  const [allSongs, setAllSongs] = useState([]);
  const [serviceItems, setServiceItems] = useState([]);
  const [serviceName, setServiceName] = useState('Sunday Service');
  const [songSearch, setSongSearch] = useState('');
  
  // Modal states
  const [showSongPicker, setShowSongPicker] = useState(false);
  const [showBibleVerseModal, setShowBibleVerseModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Form states
  const [bibleVerse, setBibleVerse] = useState({ reference: '', text: '' });
  const [announcement, setAnnouncement] = useState({ title: '', content: '' });

  // Presentation settings
  const [presentSettings, setPresentSettings] = useState({
    background: 'gradient-blue',
    fontFamily: 'Arial',
    fontSize: 32,
    showTimer: true,
    displayMode: 'tamil-transliteration',
    backgroundType: 'color',
    backgroundSrc: ''
  });

  useEffect(() => {
    fetchSongs();
    loadAutoSave();
  }, []);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (serviceItems.length > 0) {
        localStorage.setItem('worship-autosave', JSON.stringify({
          name: serviceName,
          items: serviceItems,
          settings: presentSettings,
          timestamp: new Date().toISOString()
        }));
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [serviceItems, serviceName, presentSettings]);

  // Auto-refresh songs every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSongs();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await fetch('/api/songs');
      const defaultSongs = await response.json();
      const customSongs = songStorage.getCustomSongs();
      const allSongs = [
        ...customSongs.map(song => ({ ...song, isCustom: true })),
        ...defaultSongs
      ];
      setAllSongs(allSongs);
    } catch (error) {
      console.error('Error fetching songs:', error);
      const customSongs = songStorage.getCustomSongs();
      setAllSongs(customSongs.map(song => ({ ...song, isCustom: true })));
    }
  };

  const loadAutoSave = () => {
    const saved = localStorage.getItem('worship-autosave');
    if (saved) {
      const data = JSON.parse(saved);
      setServiceItems(data.items || []);
      setServiceName(data.name || 'Sunday Service');
      setPresentSettings(data.settings || presentSettings);
    }
  };

  // Filter songs based on search
  const filteredSongs = allSongs.filter(song => {
    if (!songSearch.trim()) return true;
    const search = songSearch.toLowerCase();
    return (
      song.title?.toLowerCase().includes(search) ||
      song.artist?.toLowerCase().includes(search) ||
      song.category?.toLowerCase().includes(search)
    );
  });

  const addSong = (song) => {
    setServiceItems([...serviceItems, {
      id: Date.now(),
      type: 'song',
      data: song,
      notes: ''
    }]);
    setShowSongPicker(false);
    setSongSearch('');
  };

  const addBibleVerse = () => {
    if (bibleVerse.reference && bibleVerse.text) {
      setServiceItems([...serviceItems, {
        id: Date.now(),
        type: 'verse',
        data: bibleVerse,
        notes: ''
      }]);
      setBibleVerse({ reference: '', text: '' });
      setShowBibleVerseModal(false);
    }
  };

  const addAnnouncement = () => {
    if (announcement.title && announcement.content) {
      setServiceItems([...serviceItems, {
        id: Date.now(),
        type: 'announcement',
        data: announcement,
        notes: ''
      }]);
      setAnnouncement({ title: '', content: '' });
      setShowAnnouncementModal(false);
    }
  };

  const removeItem = (id) => {
    setServiceItems(serviceItems.filter(item => item.id !== id));
  };

  const duplicateItem = (item) => {
    setServiceItems([...serviceItems, { ...item, id: Date.now() }]);
  };

  const moveItem = (index, direction) => {
    const newItems = [...serviceItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newItems.length) {
      [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
      setServiceItems(newItems);
    }
  };

  const exportService = () => {
    const data = {
      name: serviceName,
      items: serviceItems,
      settings: presentSettings,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `churchassist-service-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const importService = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setServiceName(data.name);
          setServiceItems(data.items);
          setPresentSettings(data.settings || presentSettings);
          alert('Service imported successfully!');
        } catch (error) {
          alert('Error importing service. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const clearService = () => {
    if (confirm('Are you sure you want to clear the entire service?')) {
      setServiceItems([]);
      setServiceName('Sunday Service');
    }
  };

  const startSingleScreenPresentation = () => {
    if (serviceItems.length === 0) {
      alert('Please add items to your service first!');
      return;
    }
    const params = new URLSearchParams({
      service: encodeURIComponent(JSON.stringify(serviceItems)),
      settings: encodeURIComponent(JSON.stringify(presentSettings))
    });
    window.open(`/worship-presenter?${params.toString()}`, '_blank', 'fullscreen=yes');
  };

  const startDualScreenPresentation = () => {
    if (serviceItems.length === 0) {
      alert('Please add items to your service first!');
      return;
    }
    const params = new URLSearchParams({
      service: encodeURIComponent(JSON.stringify(serviceItems)),
      settings: encodeURIComponent(JSON.stringify(presentSettings))
    });
    window.open(`/presenter-control-worship?${params.toString()}`, 'presenterControl', 'width=1400,height=900,resizable=yes,scrollbars=no');
  };

  return (
    <>
      <Head>
        <title>Worship Service Planner - ChurchAssist</title>
        <meta name="description" content="Plan and present your worship service with excellence." />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
        {/* Hero Section */}
        <section className="relative py-12 overflow-hidden">
          <CrossPattern opacity={0.02} />
          
          {/* Ambient Glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mb-6 shadow-lg shadow-purple-500/30">
                <Calendar size={32} className="text-white" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black mb-4 text-white">
                Worship Service <span className="text-amber-400">Planner</span>
              </h1>
              <p className="text-lg text-gray-400 mb-2">
                Plan & present your worship service with excellence
              </p>
              <p className="text-sm text-amber-400/80 italic">
                "Let all things be done decently and in order" — 1 Corinthians 14:40
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto space-y-6">
              
              {/* Service Header Card */}
              <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur rounded-2xl p-6 border border-white/10">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="flex-1 w-full">
                    <label className="block text-sm font-semibold text-gray-400 mb-2">Service Name</label>
                    <input
                      type="text"
                      value={serviceName}
                      onChange={(e) => setServiceName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-white text-xl font-semibold placeholder-gray-500 transition-all"
                      placeholder="e.g., Sunday Morning Service"
                    />
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => setShowSettingsModal(true)}
                      className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition text-gray-400 hover:text-white"
                      title="Presentation Settings"
                    >
                      <Palette size={20} />
                    </button>
                    <button
                      onClick={exportService}
                      className="p-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl transition text-blue-400"
                      title="Export Service"
                    >
                      <DownloadIcon size={20} />
                    </button>
                    <label className="p-3 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-xl transition text-emerald-400 cursor-pointer" title="Import Service">
                      <Upload size={20} />
                      <input type="file" accept=".json" onChange={importService} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Add Items Card */}
              <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
                  <Plus size={20} className="text-amber-400" />
                  Add Items to Service
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setShowSongPicker(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition shadow-lg shadow-blue-500/20"
                  >
                    <Music size={18} />
                    Add Song
                  </button>
                  <Link href="/add-song">
                    <button className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-5 py-3 rounded-xl font-semibold transition shadow-lg shadow-purple-500/20">
                      <Plus size={18} />
                      Custom Song
                    </button>
                  </Link>
                  <button
                    onClick={() => setShowBibleVerseModal(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-5 py-3 rounded-xl font-semibold transition shadow-lg shadow-emerald-500/20"
                  >
                    <BookOpen size={18} />
                    Bible Verse
                  </button>
                  <button
                    onClick={() => setShowAnnouncementModal(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-5 py-3 rounded-xl font-semibold transition shadow-lg shadow-orange-500/20"
                  >
                    <MessageSquare size={18} />
                    Announcement
                  </button>
                  <button
                    onClick={clearService}
                    className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 px-5 py-3 rounded-xl font-semibold transition ml-auto"
                  >
                    <Trash2 size={18} />
                    Clear All
                  </button>
                </div>
              </div>

              {/* Service Items Card */}
              <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">
                    Service Order <span className="text-amber-400">({serviceItems.length} items)</span>
                  </h2>
                  {serviceItems.length > 0 && (
                    <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      ✓ Auto-saved
                    </span>
                  )}
                </div>
                
                {serviceItems.length === 0 ? (
                  <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-2xl">
                    <Music size={48} className="mx-auto text-gray-600 mb-4" />
                    <p className="text-lg mb-2 text-gray-400 font-semibold">No items added yet</p>
                    <p className="text-gray-500 text-sm">Start building your service by adding songs, verses, or announcements above</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {serviceItems.map((item, index) => (
                      <ServiceItemCard
                        key={item.id}
                        item={item}
                        index={index}
                        onMoveUp={() => moveItem(index, 'up')}
                        onMoveDown={() => moveItem(index, 'down')}
                        onRemove={() => removeItem(item.id)}
                        onDuplicate={() => duplicateItem(item)}
                        isFirst={index === 0}
                        isLast={index === serviceItems.length - 1}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Present Card */}
              {serviceItems.length > 0 && (
                <div className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 rounded-2xl p-8 border border-amber-500/20">
                  <h3 className="text-xl font-bold mb-6 text-white text-center flex items-center justify-center gap-2">
                    <Sparkles size={24} className="text-amber-400" />
                    Ready to Present?
                  </h3>
    
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Dual Screen Button */}
                    <button
                      onClick={startDualScreenPresentation}
                      className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white p-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
                    >
                      <div className="relative flex flex-col items-center gap-3">
                        <div className="bg-white/20 p-3 rounded-xl">
                          <Monitor size={28} />
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-lg mb-1">Dual-Screen Mode</div>
                          <div className="text-sm text-purple-200">Professional Presenter Control</div>
                        </div>
                      </div>
                      <div className="absolute top-3 right-3 bg-amber-400 text-slate-900 text-xs font-bold px-2 py-1 rounded-full">
                        PRO
                      </div>
                    </button>
          
                    {/* Single Screen Button */}
                    <button
                      onClick={startSingleScreenPresentation}
                      className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white p-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-blue-500/30"
                    >
                      <div className="relative flex flex-col items-center gap-3">
                        <div className="bg-white/20 p-3 rounded-xl">
                          <Play size={28} />
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-lg mb-1">Single-Screen Mode</div>
                          <div className="text-sm text-blue-200">Simple Fullscreen Presentation</div>
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Info Banner */}
                  <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-sm text-gray-400 text-center">
                      💡 <strong className="text-white">Dual-Screen:</strong> Control from laptop, project to audience • 
                      <strong className="text-white"> Single-Screen:</strong> One screen with keyboard controls
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Modals */}
        {showSongPicker && (
          <Modal onClose={() => { setShowSongPicker(false); setSongSearch(''); }} title="Select Song">
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  value={songSearch}
                  onChange={(e) => setSongSearch(e.target.value)}
                  placeholder="Search songs by title, artist..."
                  className="w-full px-4 py-3 pl-12 rounded-xl bg-slate-800 border border-white/10 focus:border-amber-500/50 focus:outline-none text-white placeholder-gray-500"
                  autoFocus
                />
                {songSearch && (
                  <button
                    onClick={() => setSongSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white p-1"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {filteredSongs.length} of {allSongs.length} songs
                {songSearch && ` matching "${songSearch}"`}
              </p>
            </div>

            {/* Add Custom Song Link */}
            <div className="mb-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-emerald-400 mb-1">Can't find your song?</h4>
                  <p className="text-sm text-gray-400">Add custom songs to your library</p>
                </div>
                <Link href="/add-song">
                  <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold transition text-sm">
                    <Plus size={16} />
                    Add Custom
                  </button>
                </Link>
              </div>
            </div>

            {/* Song List */}
            <div className="space-y-2 max-h-[50vh] overflow-y-auto custom-scrollbar">
              {filteredSongs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Music size={40} className="mx-auto mb-3 opacity-50" />
                  <p className="font-semibold">No songs found</p>
                  <p className="text-sm">Try a different search term</p>
                </div>
              ) : (
                filteredSongs.map(song => (
                  <button
                    key={song.id}
                    onClick={() => addSong(song)}
                    className="w-full text-left p-4 bg-white/5 hover:bg-white/10 rounded-xl transition border border-transparent hover:border-amber-500/30"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white truncate">{song.title}</div>
                        <div className="text-sm text-gray-400">{song.artist} • {song.category}</div>
                      </div>
                      {song.isCustom && (
                        <span className="ml-2 bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full text-xs font-bold border border-emerald-500/30">
                          Custom
                        </span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </Modal>
        )}

        {showBibleVerseModal && (
          <Modal onClose={() => setShowBibleVerseModal(false)} title="Add Bible Verse">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Reference (e.g., John 3:16)</label>
                <input
                  type="text"
                  value={bibleVerse.reference}
                  onChange={(e) => setBibleVerse({...bibleVerse, reference: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 focus:border-emerald-500/50 focus:outline-none text-white"
                  placeholder="John 3:16"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Verse Text</label>
                <textarea
                  value={bibleVerse.text}
                  onChange={(e) => setBibleVerse({...bibleVerse, text: e.target.value})}
                  rows="6"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 focus:border-emerald-500/50 focus:outline-none text-white resize-none"
                  placeholder="For God so loved the world..."
                />
              </div>
              <button
                onClick={addBibleVerse}
                disabled={!bibleVerse.reference || !bibleVerse.text}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Verse to Service
              </button>
            </div>
          </Modal>
        )}

        {showAnnouncementModal && (
          <Modal onClose={() => setShowAnnouncementModal(false)} title="Add Announcement">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={announcement.title}
                  onChange={(e) => setAnnouncement({...announcement, title: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 focus:border-orange-500/50 focus:outline-none text-white"
                  placeholder="e.g., Upcoming Events"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Content</label>
                <textarea
                  value={announcement.content}
                  onChange={(e) => setAnnouncement({...announcement, content: e.target.value})}
                  rows="6"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 focus:border-orange-500/50 focus:outline-none text-white resize-none"
                  placeholder="Enter announcement details..."
                />
              </div>
              <button
                onClick={addAnnouncement}
                disabled={!announcement.title || !announcement.content}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Announcement to Service
              </button>
            </div>
          </Modal>
        )}

        {showSettingsModal && (
          <Modal onClose={() => setShowSettingsModal(false)} title="Presentation Settings">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Text Display Mode</label>
                <select
                  value={presentSettings.displayMode || 'tamil-transliteration'}
                  onChange={(e) => setPresentSettings({...presentSettings, displayMode: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 focus:border-amber-500/50 focus:outline-none text-white cursor-pointer"
                >
                  <option value="tamil-transliteration" className="bg-slate-800">Tamil + Transliteration</option>
                  <option value="tamil-only" className="bg-slate-800">Tamil Only</option>
                  <option value="transliteration-only" className="bg-slate-800">Transliteration Only</option>
                  <option value="english-only" className="bg-slate-800">English Only</option>
                </select>
              </div>
      
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Background</label>
                <select
                  value={presentSettings.background}
                  onChange={(e) => setPresentSettings({...presentSettings, background: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 focus:border-amber-500/50 focus:outline-none text-white cursor-pointer"
                >
                  <option value="gradient-blue" className="bg-slate-800">Deep Blue</option>
                  <option value="gradient-purple" className="bg-slate-800">Royal Purple</option>
                  <option value="gradient-green" className="bg-slate-800">Forest Green</option>
                  <option value="gradient-red" className="bg-slate-800">Crimson Red</option>
                  <option value="black" className="bg-slate-800">Classic Black</option>
                  <option value="dark-blue" className="bg-slate-800">Dark Navy</option>
                </select>
              </div>
      
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Font Family</label>
                <select
                  value={presentSettings.fontFamily}
                  onChange={(e) => setPresentSettings({...presentSettings, fontFamily: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 focus:border-amber-500/50 focus:outline-none text-white cursor-pointer"
                >
                  <option value="Arial" className="bg-slate-800">Arial</option>
                  <option value="Calibri" className="bg-slate-800">Calibri</option>
                  <option value="Georgia" className="bg-slate-800">Georgia</option>
                  <option value="Verdana" className="bg-slate-800">Verdana</option>
                </select>
              </div>
      
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Font Size: {presentSettings.fontSize}pt</label>
                <input
                  type="range"
                  min="24"
                  max="48"
                  value={presentSettings.fontSize}
                  onChange={(e) => setPresentSettings({...presentSettings, fontSize: parseInt(e.target.value)})}
                  className="w-full accent-amber-500"
                />
              </div>

              <button
                onClick={() => setShowSettingsModal(false)}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 py-3 rounded-xl font-bold"
              >
                Save Settings
              </button>
            </div>
          </Modal>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.3);
        }
      `}</style>
    </>
  );
}

function ServiceItemCard({ item, index, onMoveUp, onMoveDown, onRemove, onDuplicate, isFirst, isLast }) {
  const getIcon = () => {
    switch(item.type) {
      case 'song': return <Music className="text-blue-400" size={20} />;
      case 'verse': return <BookOpen className="text-emerald-400" size={20} />;
      case 'announcement': return <MessageSquare className="text-orange-400" size={20} />;
      default: return null;
    }
  };

  const getTitle = () => {
    switch(item.type) {
      case 'song': return item.data.title;
      case 'verse': return item.data.reference;
      case 'announcement': return item.data.title;
      default: return 'Unknown';
    }
  };

  const getSubtitle = () => {
    switch(item.type) {
      case 'song': return `${item.data.artist} • ${item.data.category}`;
      case 'verse': return item.data.text.substring(0, 50) + '...';
      case 'announcement': return item.data.content.substring(0, 50) + '...';
      default: return '';
    }
  };

  const getBorderColor = () => {
    switch(item.type) {
      case 'song': return 'border-blue-500/30 hover:border-blue-500/50';
      case 'verse': return 'border-emerald-500/30 hover:border-emerald-500/50';
      case 'announcement': return 'border-orange-500/30 hover:border-orange-500/50';
      default: return 'border-white/10';
    }
  };

  return (
    <div className={`flex items-center gap-3 p-4 bg-white/5 rounded-xl border ${getBorderColor()} transition-all`}>
      <div className="bg-white/10 p-2.5 rounded-lg">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-white flex items-center gap-2">
          <span className="text-amber-400">{index + 1}.</span>
          <span className="truncate">{getTitle()}</span>
          {item.data.isCustom && (
            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">
              Custom
            </span>
          )}
        </div>
        <div className="text-sm text-gray-400 truncate">{getSubtitle()}</div>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={onDuplicate} className="p-2 hover:bg-white/10 rounded-lg transition text-gray-400 hover:text-white" title="Duplicate">
          <Copy size={16} />
        </button>
        <button onClick={onMoveUp} disabled={isFirst} className="p-2 hover:bg-white/10 rounded-lg transition text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed" title="Move Up">
          <ChevronUp size={16} />
        </button>
        <button onClick={onMoveDown} disabled={isLast} className="p-2 hover:bg-white/10 rounded-lg transition text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed" title="Move Down">
          <ChevronDown size={16} />
        </button>
        <button onClick={onRemove} className="p-2 hover:bg-red-500/20 rounded-lg transition text-gray-400 hover:text-red-400" title="Remove">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

function Modal({ onClose, title, children }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-slate-900 border border-white/10 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-amber-500 to-yellow-500 p-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-black/10 rounded-lg transition">
            <X size={20} className="text-slate-900" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {children}
        </div>
      </div>
    </div>
  );
}