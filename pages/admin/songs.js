// pages/admin/songs.js
// Song Management Dashboard

import { useState, useEffect } from 'react';
import { 
  Search, Edit2, Trash2, Eye, Download, Upload,
  ChevronLeft, ChevronRight, Filter, Music, AlertCircle,
  Check, X, ExternalLink
} from 'lucide-react';
import AdminAuth from '../../components/AdminAuth';
import AdminNav from '../../components/AdminNav';

export default function SongManagement() {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingSong, setEditingSong] = useState(null);
  const [viewingSong, setViewingSong] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  const songsPerPage = 20;

  useEffect(() => {
    fetchSongs();
  }, []);

  useEffect(() => {
    filterSongs();
  }, [songs, searchQuery]);

  const fetchSongs = async () => {
    try {
      const response = await fetch('/api/songs');
      const data = await response.json();
      setSongs(data);
      setFilteredSongs(data);
    } catch (error) {
      console.error('Error fetching songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSongs = () => {
    if (!searchQuery.trim()) {
      setFilteredSongs(songs);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = songs.filter(song => 
      song.titleEnglish?.toLowerCase().includes(query) ||
      song.title?.includes(searchQuery) ||
      song.artist?.toLowerCase().includes(query) ||
      song.id?.includes(query)
    );
    
    setFilteredSongs(filtered);
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(filteredSongs.length / songsPerPage);
  const startIndex = (currentPage - 1) * songsPerPage;
  const paginatedSongs = filteredSongs.slice(startIndex, startIndex + songsPerPage);

  const exportAllSongs = () => {
    const dataStr = JSON.stringify(songs, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `churchassist-songs-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const exportAsJS = () => {
    const codeBlocks = songs.map(song => {
      return `  {
    id: "${song.id}",
    title: "${song.title?.replace(/"/g, '\\"') || ''}",
    titleEnglish: "${song.titleEnglish?.replace(/"/g, '\\"') || ''}",
    artist: "${song.artist?.replace(/"/g, '\\"') || ''}",
    language: "${song.language || 'Tamil'}",
    lyrics: {
      tamil: [
${(song.lyrics?.tamil || []).map(l => `        { line: ${l.line}, text: "${l.text?.replace(/"/g, '\\"') || ''}" }`).join(',\n')}
      ],
      transliteration: [
${(song.lyrics?.transliteration || []).map(l => `        { line: ${l.line}, text: "${l.text?.replace(/"/g, '\\"') || ''}" }`).join(',\n')}
      ]
    },
    lyrics_english: null,
    chords: null,
    tempo: null,
    musicalKey: null,
    timeSignature: null,
    ccliNumber: null,
    youtubeUrl: null,
    audioUrl: null,
    originalLanguage: "Tamil",
    createdAt: "${song.createdAt || new Date().toISOString().split('T')[0]}",
    updatedAt: "${song.updatedAt || new Date().toISOString().split('T')[0]}"
  }`;
    });
    
    const fullCode = `// ChurchAssist Song Database
// Exported: ${new Date().toISOString()}
// Total Songs: ${songs.length}

export const songs = [
${codeBlocks.join(',\n\n')}
];

export const getSongCount = () => songs.length;
export const getSongById = (id) => songs.find(s => s.id === id);
`;
    
    const blob = new Blob([fullCode], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `songs.js`;
    a.click();
  };

  return (
    <AdminAuth title="Song Management">
      <AdminNav />
      
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Song Database</h1>
                <p className="text-gray-500">
                  {loading ? 'Loading...' : `${songs.length} total songs`}
                </p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={exportAllSongs}
                  className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg font-semibold text-sm"
                >
                  <Download size={18} />
                  Export JSON
                </button>
                <button
                  onClick={exportAsJS}
                  className="flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg font-semibold text-sm"
                >
                  <Download size={18} />
                  Export as songs.js
                </button>
              </div>
            </div>
            
            {/* Search */}
            <div className="mt-4 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, artist, or ID..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Song Table */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading songs...</p>
              </div>
            ) : filteredSongs.length === 0 ? (
              <div className="p-12 text-center">
                <Music className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-500">No songs found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">#</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">ID</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Tamil Title</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">English Title</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Artist</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Lines</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {paginatedSongs.map((song, index) => (
                        <tr key={song.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {startIndex + index + 1}
                          </td>
                          <td className="px-4 py-3">
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {song.id?.substring(0, 20)}...
                            </code>
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {song.title?.substring(0, 30)}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {song.titleEnglish?.substring(0, 30)}
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-sm">
                            {song.artist || '-'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {song.lyrics?.tamil?.length || 0}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => setViewingSong(song)}
                                className="p-2 hover:bg-blue-100 rounded-lg text-blue-600"
                                title="View"
                              >
                                <Eye size={18} />
                              </button>
                              <a
                                href={`/lyrics/${song.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 hover:bg-green-100 rounded-lg text-green-600"
                                title="Open in Site"
                              >
                                <ExternalLink size={18} />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
                    <div className="text-sm text-gray-500">
                      Showing {startIndex + 1}-{Math.min(startIndex + songsPerPage, filteredSongs.length)} of {filteredSongs.length}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <span className="text-sm font-medium">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* View Song Modal */}
      {viewingSong && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{viewingSong.titleEnglish}</h2>
                  <p className="text-purple-200">{viewingSong.title}</p>
                </div>
                <button
                  onClick={() => setViewingSong(null)}
                  className="p-2 hover:bg-white/20 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-gray-700 mb-3">Tamil Lyrics</h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                    {viewingSong.lyrics?.tamil?.map((line, i) => (
                      <p key={i} className="text-gray-800">{line.text}</p>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-700 mb-3">Transliteration</h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                    {viewingSong.lyrics?.transliteration?.map((line, i) => (
                      <p key={i} className="text-purple-700">{line.text}</p>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">ID:</span>
                  <code className="ml-2 bg-gray-100 px-2 py-1 rounded">{viewingSong.id}</code>
                </div>
                <div>
                  <span className="text-gray-500">Artist:</span>
                  <span className="ml-2">{viewingSong.artist || 'Unknown'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Language:</span>
                  <span className="ml-2">{viewingSong.language}</span>
                </div>
                <div>
                  <span className="text-gray-500">Lines:</span>
                  <span className="ml-2">{viewingSong.lyrics?.tamil?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminAuth>
  );
}