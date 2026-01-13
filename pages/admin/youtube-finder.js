// pages/admin/youtube-finder.js
// Find YouTube reference videos for songs

import { useState } from 'react';
import { Youtube, Search, ExternalLink, Play, Check, X } from 'lucide-react';
import AdminAuth from '../../components/AdminAuth';
import { songs } from '../../data/songs';

export default function YouTubeFinder() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSong, setSelectedSong] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [savedVideos, setSavedVideos] = useState({});

  // Load saved videos from localStorage
  useState(() => {
    const saved = localStorage.getItem('churchassist-youtube-refs');
    if (saved) {
      setSavedVideos(JSON.parse(saved));
    }
  }, []);

  const searchYouTube = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Generate YouTube search URL
    const query = encodeURIComponent(`${searchQuery} Tamil Christian song`);
    const searchUrl = `https://www.youtube.com/results?search_query=${query}`;
    
    // For now, we'll open YouTube search in new tab
    // In production, you could use YouTube Data API
    window.open(searchUrl, '_blank');
    
    setIsSearching(false);
  };

  const searchForSong = (song) => {
    setSelectedSong(song);
    setSearchQuery(song.titleEnglish || song.title);
  };

  const saveVideoUrl = (songId, url) => {
    const updated = { ...savedVideos, [songId]: url };
    setSavedVideos(updated);
    localStorage.setItem('churchassist-youtube-refs', JSON.stringify(updated));
  };

  const removeVideoUrl = (songId) => {
    const updated = { ...savedVideos };
    delete updated[songId];
    setSavedVideos(updated);
    localStorage.setItem('churchassist-youtube-refs', JSON.stringify(updated));
  };

  const filteredSongs = songs.filter(song => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      song.title?.includes(searchQuery) ||
      song.titleEnglish?.toLowerCase().includes(q)
    );
  });

  return (
    <AdminAuth title="YouTube Reference Finder">
      <div className="py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl p-8 mb-8 text-white">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-4 rounded-xl">
                <Youtube size={40} />
              </div>
              <div>
                <h1 className="text-3xl font-bold">YouTube Reference Finder</h1>
                <p className="text-red-100 mt-1">
                  Find tune references for your songs
                </p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Song List */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="font-bold text-lg mb-4">Songs</h2>
              
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search songs..."
                  className="w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="max-h-[500px] overflow-y-auto space-y-2">
                {filteredSongs.map((song) => (
                  <div
                    key={song.id}
                    className={`p-3 rounded-lg border-2 transition cursor-pointer ${
                      selectedSong?.id === song.id
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => searchForSong(song)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">{song.title}</div>
                        <div className="text-sm text-gray-500 truncate">{song.titleEnglish}</div>
                      </div>
                      {savedVideos[song.id] && (
                        <div className="flex-shrink-0 ml-2">
                          <Check size={18} className="text-green-600" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Search & Results */}
            <div className="lg:col-span-2 space-y-6">
              {/* Search Box */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="font-bold text-lg mb-4">Search YouTube</h2>
                
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter song title to search..."
                    className="flex-1 px-4 py-3 border-2 rounded-xl focus:border-red-500 focus:outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && searchYouTube()}
                  />
                  <button
                    onClick={searchYouTube}
                    disabled={isSearching || !searchQuery.trim()}
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
                  >
                    <Youtube size={20} />
                    Search
                  </button>
                </div>

                <p className="text-sm text-gray-500 mt-3">
                  This will open YouTube search in a new tab. Copy the video URL and paste below.
                </p>
              </div>

              {/* Add Video URL */}
              {selectedSong && (
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h2 className="font-bold text-lg mb-4">
                    Add Reference for: {selectedSong.titleEnglish || selectedSong.title}
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">YouTube URL</label>
                      <input
                        type="url"
                        value={savedVideos[selectedSong.id] || ''}
                        onChange={(e) => saveVideoUrl(selectedSong.id, e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full px-4 py-3 border-2 rounded-xl focus:border-red-500 focus:outline-none"
                      />
                    </div>

                    {savedVideos[selectedSong.id] && (
                      <div className="flex items-center gap-3">
                        <a
                          href={savedVideos[selectedSong.id]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200"
                        >
                          <Play size={18} />
                          Watch Video
                          <ExternalLink size={14} />
                        </a>
                        <button
                          onClick={() => removeVideoUrl(selectedSong.id)}
                          className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
                        >
                          <X size={18} />
                          Remove
                        </button>
                      </div>
                    )}

                    {/* Embed Preview */}
                    {savedVideos[selectedSong.id] && savedVideos[selectedSong.id].includes('youtube.com') && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Preview</label>
                        <div className="aspect-video rounded-xl overflow-hidden bg-black">
                          <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${extractYouTubeId(savedVideos[selectedSong.id])}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Saved References */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="font-bold text-lg mb-4">
                  Saved References ({Object.keys(savedVideos).length})
                </h2>
                
                {Object.keys(savedVideos).length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {Object.entries(savedVideos).map(([songId, url]) => {
                      const song = songs.find(s => s.id === songId);
                      return (
                        <div
                          key={songId}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold truncate">
                              {song?.titleEnglish || song?.title || songId}
                            </div>
                            <div className="text-sm text-gray-500 truncate">{url}</div>
                          </div>
                          <div className="flex items-center gap-2 ml-3">
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                            >
                              <Play size={16} />
                            </a>
                            <button
                              onClick={() => removeVideoUrl(songId)}
                              className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Youtube size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No references saved yet</p>
                    <p className="text-sm">Select a song and add a YouTube URL</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminAuth>
  );
}

// Helper to extract YouTube video ID
function extractYouTubeId(url) {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
  const match = url.match(regex);
  return match ? match[1] : '';
}