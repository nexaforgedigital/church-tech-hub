import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Plus, Trash2, Play, BookOpen, Music, MessageSquare, X, Copy, Upload, Download as DownloadIcon, Edit2, Eye, Clock, Palette, Monitor } from 'lucide-react';

export default function WorshipPlanner() {
  const [allSongs, setAllSongs] = useState([]);
  const [serviceItems, setServiceItems] = useState([]);
  const [serviceName, setServiceName] = useState('Sunday Service');
  
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
    displayMode: 'tamil-transliteration'
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

  const fetchSongs = async () => {
    try {
      const response = await fetch('/api/songs');
      const data = await response.json();
      setAllSongs(data);
    } catch (error) {
      console.error('Error fetching songs:', error);
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

  const addSong = (song) => {
    setServiceItems([...serviceItems, {
      id: Date.now(),
      type: 'song',
      data: song,
      notes: ''
    }]);
    setShowSongPicker(false);
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
    setServiceItems([...serviceItems, {
      ...item,
      id: Date.now()
    }]);
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
    a.download = `${serviceName.replace(/\s+/g, '-')}.json`;
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header with Christian Theme */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-blue-900 text-white py-16 shadow-2xl relative overflow-hidden">
        {/* Christian Cross Pattern Background */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <pattern id="cross-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M45 20h10v25h25v10H55v25H45V55H20V45h25V20z" fill="white"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#cross-pattern)"/>
          </svg>
        </div>
  
        <div className="container mx-auto px-4 relative z-10">
          <Link href="/" className="flex items-center gap-2 text-white/90 hover:text-white hover:underline mb-6 transition">
            <ChevronLeft size={20} />
            Back to Home
          </Link>
    
          <div className="flex items-center gap-6 mb-6">
            {/* Christian Dove Icon */}
            <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl shadow-2xl">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                <path d="M12 2C10.9 2 10 2.9 10 4C10 4.7 10.4 5.4 11 5.7C11 8.3 9.3 10.5 7 11.5C5.3 12.2 4 13.8 4 15.7V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V15.7C20 13.8 18.7 12.2 17 11.5C14.7 10.5 13 8.3 13 5.7C13.6 5.4 14 4.7 14 4C14 2.9 13.1 2 12 2M12 4C12 4 12 4 12 4C12 4 12 4 12 4M7 13.7C8.9 12.8 10.4 11.2 11.3 9.2C11.5 9.7 11.8 10.2 12.1 10.6C11.4 12.4 10 13.8 8.3 14.5C7.7 14.7 7.3 15.2 7 15.7V13.7M17 15.7C16.7 15.2 16.3 14.7 15.7 14.5C14 13.8 12.6 12.4 11.9 10.6C12.2 10.2 12.5 9.7 12.7 9.2C13.6 11.2 15.1 12.8 17 13.7V15.7Z" fill="currentColor"/>
              </svg>
            </div>
      
            <div>
              <h1 className="text-6xl font-bold mb-3 drop-shadow-lg">
                ✝ Worship Service Planner
              </h1>
              <p className="text-2xl opacity-90 drop-shadow">
                Plan & Present Your Worship Service with Excellence
              </p>
              <p className="text-lg opacity-75 mt-2 italic">
                "Let everything be done decently and in order" - 1 Corinthians 14:40
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Service Header */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border-2 border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Service Name</label>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-xl font-semibold"
                  placeholder="e.g., Sunday Morning Service"
                />
              </div>
              <div className="ml-4 flex gap-2">
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition"
                  title="Presentation Settings"
                >
                  <Palette size={20} />
                </button>
                <button
                  onClick={exportService}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition"
                  title="Export Service"
                >
                  <DownloadIcon size={20} />
                </button>
                <label className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition cursor-pointer">
                  <Upload size={20} />
                  <input type="file" accept=".json" onChange={importService} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border-2 border-purple-200">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Add Items</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowSongPicker(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition shadow-md"
              >
                <Music size={20} />
                Add Song
              </button>
              <button
                onClick={() => setShowBibleVerseModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg font-semibold transition shadow-md"
              >
                <BookOpen size={20} />
                Add Bible Verse
              </button>
              <button
                onClick={() => setShowAnnouncementModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 py-3 rounded-lg font-semibold transition shadow-md"
              >
                <MessageSquare size={20} />
                Add Announcement
              </button>
              <button
                onClick={clearService}
                className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg font-semibold transition shadow-md ml-auto"
              >
                <Trash2 size={20} />
                Clear All
              </button>
            </div>
          </div>

          {/* Service Items */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border-2 border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Service Order ({serviceItems.length} items)</h2>
              {serviceItems.length > 0 && (
                <span className="text-sm text-gray-600">
                  ✓ Auto-saved • Last update: {new Date().toLocaleTimeString()}
                </span>
              )}
            </div>
            
            {serviceItems.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-xl">
                <Music size={64} className="mx-auto text-gray-400 mb-4" />
                <p className="text-xl mb-2 text-gray-600 font-semibold">No items added yet</p>
                <p className="text-gray-500">Start building your service by adding songs, verses, or announcements above</p>
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

          {/* Start Presentation */}
          {serviceItems.length > 0 && (
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border-2 border-purple-200">
              <h3 className="text-xl font-bold mb-6 text-gray-800 text-center">🎬 Ready to Present?</h3>
    
              <div className="grid md:grid-cols-2 gap-4">
                {/* Dual Screen Button */}
                <button
                  onClick={startDualScreenPresentation}
                  className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white p-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  <div className="relative flex flex-col items-center gap-3">
                    <div className="bg-white/20 p-3 rounded-full">
                      <Monitor size={32} />
                    </div>
                    <div>
                      <div className="font-bold text-lg mb-1">Dual-Screen Mode</div>
                      <div className="text-sm opacity-90">Professional Presenter Control</div>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full">
                    PRO
                  </div>
                </button>
          
                {/* Single Screen Button */}
                <button
                  onClick={startSingleScreenPresentation}
                  className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white p-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  <div className="relative flex flex-col items-center gap-3">
                    <div className="bg-white/20 p-3 rounded-full">
                      <Play size={32} />
                    </div>
                    <div>
                      <div className="font-bold text-lg mb-1">Single-Screen Mode</div>
                      <div className="text-sm opacity-90">Simple Fullscreen Presentation</div>
                    </div>
                  </div>
                </button>
              </div>

              {/* Info Banner */}
              <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800 text-center">
                  💡 <strong>Dual-Screen:</strong> Control from laptop, project to audience • 
                  <strong> Single-Screen:</strong> One screen with keyboard controls
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showSongPicker && (
        <Modal onClose={() => setShowSongPicker(false)} title="Select Song">
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {allSongs.map(song => (
              <button
                key={song.id}
                onClick={() => addSong(song)}
                className="w-full text-left p-4 bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-100 hover:to-blue-200 rounded-lg transition border-2 border-transparent hover:border-blue-400"
              >
                <div className="font-semibold text-lg">{song.title}</div>
                <div className="text-sm text-gray-600">{song.artist} • {song.category}</div>
              </button>
            ))}
          </div>
        </Modal>
      )}

      {showBibleVerseModal && (
        <Modal onClose={() => setShowBibleVerseModal(false)} title="Add Bible Verse">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Reference (e.g., John 3:16)</label>
              <input
                type="text"
                value={bibleVerse.reference}
                onChange={(e) => setBibleVerse({...bibleVerse, reference: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border-2 focus:border-green-500 focus:outline-none"
                placeholder="John 3:16"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Verse Text</label>
              <textarea
                value={bibleVerse.text}
                onChange={(e) => setBibleVerse({...bibleVerse, text: e.target.value})}
                rows="6"
                className="w-full px-4 py-3 rounded-lg border-2 focus:border-green-500 focus:outline-none"
                placeholder="For God so loved the world..."
              />
            </div>
            <button
              onClick={addBibleVerse}
              disabled={!bibleVerse.reference || !bibleVerse.text}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
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
              <label className="block text-sm font-semibold mb-2">Title</label>
              <input
                type="text"
                value={announcement.title}
                onChange={(e) => setAnnouncement({...announcement, title: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border-2 focus:border-orange-500 focus:outline-none"
                placeholder="e.g., Upcoming Events"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Content</label>
              <textarea
                value={announcement.content}
                onChange={(e) => setAnnouncement({...announcement, content: e.target.value})}
                rows="8"
                className="w-full px-4 py-3 rounded-lg border-2 focus:border-orange-500 focus:outline-none"
                placeholder="Enter announcement details..."
              />
            </div>
            <button
              onClick={addAnnouncement}
              disabled={!announcement.title || !announcement.content}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
            >
              Add Announcement to Service
            </button>
          </div>
        </Modal>
      )}

      {showSettingsModal && (
        <Modal onClose={() => setShowSettingsModal(false)} title="Presentation Settings">
          <div className="space-y-4">
            {/* Language Display Mode - NEW */}
            <div>
              <label className="block text-sm font-semibold mb-2">Text Display Mode</label>
              <select
                value={presentSettings.displayMode || 'tamil-transliteration'}
                onChange={(e) => setPresentSettings({...presentSettings, displayMode: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border-2 focus:border-purple-500 focus:outline-none"
              >
                <option value="tamil-transliteration">Tamil + Transliteration (Recommended)</option>
                <option value="tamil-only">Tamil Only</option>
                <option value="transliteration-only">Transliteration Only</option>
                <option value="english-only">English Only</option>
                <option value="tamil-english">Tamil + English</option>
                <option value="all">All Three Languages</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Choose what text appears on slides</p>
            </div>
      
            <div>
              <label className="block text-sm font-semibold mb-2">Background</label>
              <select
                value={presentSettings.background}
                onChange={(e) => setPresentSettings({...presentSettings, background: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border-2 focus:border-purple-500 focus:outline-none"
              >
                <option value="gradient-blue">Deep Blue</option>
                <option value="gradient-purple">Royal Purple</option>
                <option value="gradient-green">Forest Green</option>
                <option value="gradient-red">Crimson Red</option>
                <option value="black">Classic Black</option>
                <option value="dark-blue">Dark Navy</option>
              </select>
            </div>
      
            <div>
              <label className="block text-sm font-semibold mb-2">Font Family</label>
              <select
                value={presentSettings.fontFamily}
                onChange={(e) => setPresentSettings({...presentSettings, fontFamily: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border-2 focus:border-purple-500 focus:outline-none"
              >
                <option value="Arial">Arial</option>
                <option value="Calibri">Calibri</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
                <option value="Times New Roman">Times New Roman</option>
              </select>
            </div>
      
            <div>
              <label className="block text-sm font-semibold mb-2">Font Size: {presentSettings.fontSize}pt</label>
              <input
                type="range"
                min="24"
                max="48"
                value={presentSettings.fontSize}
                onChange={(e) => setPresentSettings({...presentSettings, fontSize: parseInt(e.target.value)})}
                className="w-full"
              />
            </div>
      
            {/* Preview Example - NEW */}
            <div className="pt-4 border-t border-gray-200">
              <label className="block text-sm font-semibold mb-2">Preview</label>
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                {presentSettings.displayMode === 'tamil-only' && (
                  <div className="text-lg">தேவன் நம்மை நேசிக்கிறார்</div>
                )}
                {presentSettings.displayMode === 'transliteration-only' && (
                  <div className="text-lg">Devan nammai nesikkiraar</div>
                )}
                {presentSettings.displayMode === 'english-only' && (
                  <div className="text-lg">God loves us</div>
                )}
                {presentSettings.displayMode === 'tamil-transliteration' && (
                  <>
                    <div className="text-lg">தேவன் நம்மை நேசிக்கிறார்</div>
                    <div className="text-sm text-gray-600 mt-1">Devan nammai nesikkiraar</div>
                  </>
                )}
                {presentSettings.displayMode === 'tamil-english' && (
                  <>
                    <div className="text-lg">தேவன் நம்மை நேசிக்கிறார்</div>
                    <div className="text-sm text-gray-600 mt-1">God loves us</div>
                  </>
                )}
                {presentSettings.displayMode === 'all' && (
                  <>
                    <div className="text-lg">தேவன் நம்மை நேசிக்கிறார்</div>
                    <div className="text-sm text-gray-600 mt-1">Devan nammai nesikkiraar</div>
                    <div className="text-sm text-gray-600">God loves us</div>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={() => setShowSettingsModal(false)}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold"
            >
              Save Settings
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ServiceItemCard({ item, index, onMoveUp, onMoveDown, onRemove, onDuplicate, isFirst, isLast }) {
  const getIcon = () => {
    switch(item.type) {
      case 'song': return <Music className="text-blue-600" size={24} />;
      case 'verse': return <BookOpen className="text-green-600" size={24} />;
      case 'announcement': return <MessageSquare className="text-orange-600" size={24} />;
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
      case 'verse': return item.data.text.substring(0, 60) + '...';
      case 'announcement': return item.data.content.substring(0, 60) + '...';
      default: return '';
    }
  };

  const getBgGradient = () => {
    switch(item.type) {
      case 'song': return 'from-blue-50 to-blue-100 border-blue-200';
      case 'verse': return 'from-green-50 to-green-100 border-green-200';
      case 'announcement': return 'from-orange-50 to-orange-100 border-orange-200';
      default: return 'from-gray-50 to-gray-100 border-gray-200';
    }
  };

  return (
    <div className={`flex items-center gap-3 p-4 bg-gradient-to-r ${getBgGradient()} rounded-xl border-2 hover:shadow-md transition`}>
      <div className="bg-white p-3 rounded-lg shadow-sm">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-lg flex items-center gap-2">
          <span className="text-gray-500">{index + 1}.</span>
          <span className="truncate">{getTitle()}</span>
        </div>
        <div className="text-sm text-gray-600 truncate">{getSubtitle()}</div>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onDuplicate}
          className="p-2 hover:bg-white rounded transition"
          title="Duplicate"
        >
          <Copy size={18} />
        </button>
        <button
          onClick={onMoveUp}
          disabled={isFirst}
          className="p-2 hover:bg-white rounded transition disabled:opacity-30 disabled:cursor-not-allowed"
          title="Move Up"
        >
          ▲
        </button>
        <button
          onClick={onMoveDown}
          disabled={isLast}
          className="p-2 hover:bg-white rounded transition disabled:opacity-30 disabled:cursor-not-allowed"
          title="Move Down"
        >
          ▼
        </button>
        <button
          onClick={onRemove}
          className="p-2 hover:bg-red-100 rounded transition text-red-600"
          title="Remove"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

function Modal({ onClose, title, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up">
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}