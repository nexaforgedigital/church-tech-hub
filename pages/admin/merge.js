// pages/admin/merge.js
// Merge duplicate songs into one

import { useState, useEffect } from 'react';
import { GitMerge, Search, Check, X, ArrowRight } from 'lucide-react';
import AdminAuth from '../../components/AdminAuth';
import { songs } from '../../data/songs';

export default function MergeSongs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [mergedSong, setMergedSong] = useState(null);
  const [duplicates, setDuplicates] = useState([]);

  useEffect(() => {
    // Find potential duplicates on load
    findDuplicates();
  }, []);

  const findDuplicates = () => {
    const potential = [];
    const checked = new Set();

    songs.forEach((song, i) => {
      if (checked.has(song.id)) return;

      const similar = songs.filter((other, j) => {
        if (i === j || checked.has(other.id)) return false;
        
        // Check similarity
        const titleMatch = song.title === other.title ||
          song.titleEnglish?.toLowerCase() === other.titleEnglish?.toLowerCase();
        
        const firstLineMatch = song.lyrics?.tamil?.[0]?.text === other.lyrics?.tamil?.[0]?.text;
        
        return titleMatch || firstLineMatch;
      });

      if (similar.length > 0) {
        potential.push({
          main: song,
          duplicates: similar
        });
        similar.forEach(s => checked.add(s.id));
      }
      checked.add(song.id);
    });

    setDuplicates(potential);
  };

  const filteredSongs = songs.filter(song => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      song.title?.includes(searchQuery) ||
      song.titleEnglish?.toLowerCase().includes(q)
    );
  });

  const toggleSongSelection = (song) => {
    if (selectedSongs.find(s => s.id === song.id)) {
      setSelectedSongs(selectedSongs.filter(s => s.id !== song.id));
    } else if (selectedSongs.length < 2) {
      setSelectedSongs([...selectedSongs, song]);
    }
  };

  const generateMergedSong = () => {
    if (selectedSongs.length !== 2) return;

    const [song1, song2] = selectedSongs;
    
    // Merge: prefer longer/more complete data
    const merged = {
      id: song1.id,
      title: song1.title || song2.title,
      titleEnglish: song1.titleEnglish || song2.titleEnglish,
      artist: song1.artist || song2.artist,
      language: song1.language || song2.language,
      lyrics: {
        tamil: (song1.lyrics?.tamil?.length || 0) >= (song2.lyrics?.tamil?.length || 0)
          ? song1.lyrics?.tamil
          : song2.lyrics?.tamil,
        transliteration: (song1.lyrics?.transliteration?.length || 0) >= (song2.lyrics?.transliteration?.length || 0)
          ? song1.lyrics?.transliteration
          : song2.lyrics?.transliteration
      },
      lyrics_english: song1.lyrics_english || song2.lyrics_english,
      chords: song1.chords || song2.chords,
      tempo: song1.tempo || song2.tempo,
      musicalKey: song1.musicalKey || song2.musicalKey,
      youtubeUrl: song1.youtubeUrl || song2.youtubeUrl,
      originalLanguage: song1.originalLanguage || song2.originalLanguage,
      createdAt: song1.createdAt || song2.createdAt,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setMergedSong(merged);
  };

  const clearSelection = () => {
    setSelectedSongs([]);
    setMergedSong(null);
  };

  return (
    <AdminAuth title="Merge Songs">
      <div className="py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-8 mb-8 text-white">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-4 rounded-xl">
                <GitMerge size={40} />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Song Merge Tool</h1>
                <p className="text-violet-100 mt-1">
                  Combine duplicate songs into one
                </p>
              </div>
            </div>
          </div>

          {/* Potential Duplicates Alert */}
          {duplicates.length > 0 && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 mb-8">
              <h3 className="font-bold text-yellow-900 mb-3">
                ⚠️ Potential Duplicates Found: {duplicates.length}
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {duplicates.map((group, i) => (
                  <div key={i} className="bg-white p-3 rounded-lg">
                    <span className="font-medium">{group.main.titleEnglish}</span>
                    <span className="text-gray-500 mx-2">→</span>
                    <span className="text-yellow-700">
                      {group.duplicates.length} similar song(s)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Song Selection */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="font-bold text-lg mb-4">Select 2 Songs to Merge</h2>
              
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search songs..."
                  className="w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:border-violet-500 focus:outline-none"
                />
              </div>

              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredSongs.map((song) => {
                  const isSelected = selectedSongs.find(s => s.id === song.id);
                  return (
                    <button
                      key={song.id}
                      onClick={() => toggleSongSelection(song)}
                      disabled={!isSelected && selectedSongs.length >= 2}
                      className={`w-full text-left p-3 rounded-lg transition border-2 ${
                        isSelected
                          ? 'border-violet-500 bg-violet-50'
                          : selectedSongs.length >= 2
                          ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold truncate">{song.title}</div>
                          <div className="text-sm text-gray-500 truncate">{song.titleEnglish}</div>
                        </div>
                        {isSelected && (
                          <Check size={20} className="text-violet-600 flex-shrink-0 ml-2" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={generateMergedSong}
                  disabled={selectedSongs.length !== 2}
                  className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white py-2 rounded-lg font-semibold"
                >
                  <GitMerge size={18} className="inline mr-2" />
                  Merge
                </button>
                <button
                  onClick={clearSelection}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Selected Songs Preview */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="font-bold text-lg mb-4">Selected Songs</h2>
              
              {selectedSongs.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <GitMerge size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Select 2 songs to merge</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedSongs.map((song, index) => (
                    <div key={song.id}>
                      <div className="bg-violet-50 p-4 rounded-xl border-2 border-violet-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-violet-600">SONG {index + 1}</span>
                          <button
                            onClick={() => toggleSongSelection(song)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <div className="font-semibold">{song.title}</div>
                        <div className="text-sm text-gray-600">{song.titleEnglish}</div>
                        <div className="text-xs text-gray-500 mt-2">
                          {song.lyrics?.tamil?.length || 0} Tamil lines • 
                          {song.lyrics?.transliteration?.length || 0} Translit lines
                        </div>
                      </div>
                      {index === 0 && selectedSongs.length === 2 && (
                        <div className="flex justify-center py-2">
                          <ArrowRight className="text-violet-400" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Merged Result */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="font-bold text-lg mb-4">Merged Result</h2>
              
              {mergedSong ? (
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200">
                    <div className="text-xs font-bold text-green-600 mb-2">MERGED SONG</div>
                    <div className="font-semibold">{mergedSong.title}</div>
                    <div className="text-sm text-gray-600">{mergedSong.titleEnglish}</div>
                    <div className="text-xs text-gray-500 mt-2">
                      ID: {mergedSong.id}
                    </div>
                  </div>

                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tamil Lines:</span>
                      <span className="font-medium">{mergedSong.lyrics?.tamil?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Translit Lines:</span>
                      <span className="font-medium">{mergedSong.lyrics?.transliteration?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Artist:</span>
                      <span className="font-medium">{mergedSong.artist || 'N/A'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const code = JSON.stringify(mergedSong, null, 2);
                      navigator.clipboard.writeText(code);
                      alert('Merged song copied to clipboard!');
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
                  >
                    Copy Merged Song Code
                  </button>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Check size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Merged song will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminAuth>
  );
}