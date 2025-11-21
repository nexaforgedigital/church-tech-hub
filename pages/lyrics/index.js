import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, Music, Download, Home } from 'lucide-react';

export default function LyricsLibrary() {
  const [songs, setSongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Load songs from API
  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await fetch('/api/songs');
      const data = await response.json();
      setSongs(data);
    } catch (error) {
      console.error('Error fetching songs:', error);
      // For demo purposes, use sample data
      setSongs(sampleSongs);
    }
  };

  const filteredSongs = songs.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         song.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = languageFilter === 'all' || song.language === languageFilter;
    const matchesCategory = categoryFilter === 'all' || song.category === categoryFilter;
    return matchesSearch && matchesLanguage && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Full Navigation Header */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Home className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Church Tech Hub
              </span>
            </Link>
            <div className="hidden md:flex gap-6">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
              <Link href="/lyrics" className="text-blue-600 font-bold">Lyrics</Link>
              <Link href="/tutorials" className="text-gray-700 hover:text-blue-600 font-medium">Tutorials</Link>
              <Link href="/downloads" className="text-gray-700 hover:text-blue-600 font-medium">Downloads</Link>
              <Link href="/tips" className="text-gray-700 hover:text-blue-600 font-medium">Tips</Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium">Contact</Link>
              <Link href="/how-to-use" className="text-green-600 hover:text-green-700 font-bold">📖 How to Use</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Lyrics Library</h1>
          <p className="text-xl">Browse and download worship lyrics in multiple formats</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search songs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
              />
              <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            </div>

            {/* Language Filter */}
            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Languages</option>
              <option value="Tamil">Tamil</option>
              <option value="English">English</option>
              <option value="Bilingual">Bilingual</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="Worship">Worship</option>
              <option value="Praise">Praise</option>
              <option value="Gospel">Gospel</option>
              <option value="Christmas">Christmas</option>
              <option value="Easter">Easter</option>
            </select>
          </div>

          <div className="mt-4 text-gray-600">
            Showing {filteredSongs.length} of {songs.length} songs
          </div>
        </div>
      </div>

      {/* Songs Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSongs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>

        {filteredSongs.length === 0 && (
          <div className="text-center py-20">
            <Music size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No songs found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SongCard({ song }) {
  return (
    <Link href={`/lyrics/${song.id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border-2 border-transparent hover:border-blue-500">
        <div className="flex items-start justify-between mb-4">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Music className="text-blue-600" size={24} />
          </div>
          <span className="text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-semibold">
            {song.language}
          </span>
        </div>
        
        <h3 className="text-xl font-bold mb-2 text-gray-800">{song.title}</h3>
        <p className="text-gray-600 mb-4">{song.artist}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="bg-gray-100 px-3 py-1 rounded-full">{song.category}</span>
          <div className="flex items-center gap-1">
            <Download size={16} />
            <span>{song.downloads || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Sample data for demo
const sampleSongs = [
  {
    id: 1,
    title: "Amazing Grace",
    artist: "Traditional",
    language: "English",
    category: "Worship",
    downloads: 245
  },
  {
    id: 2,
    title: "கர்த்தர் என் மேய்ப்பர்",
    artist: "Tamil Christian Song",
    language: "Tamil",
    category: "Praise",
    downloads: 189
  },
  {
    id: 3,
    title: "How Great Thou Art",
    artist: "Carl Boberg",
    language: "Bilingual",
    category: "Worship",
    downloads: 312
  },
  {
    id: 4,
    title: "என்னை தேடி வந்தார்",
    artist: "Tamil Christian Song",
    language: "Tamil",
    category: "Gospel",
    downloads: 156
  },
  {
    id: 5,
    title: "Blessed Assurance",
    artist: "Fanny Crosby",
    language: "English",
    category: "Worship",
    downloads: 198
  }
];