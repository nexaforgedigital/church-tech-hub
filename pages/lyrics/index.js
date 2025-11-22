import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Filter } from 'lucide-react';
import { songStorage } from '../../utils/songStorage';
import { Plus, Music, Download, Search } from 'lucide-react';

export default function LyricsLibrary() {
  const [songs, setSongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      // Fetch default songs
      const response = await fetch('/api/songs');
      const defaultSongs = await response.json();
      
      // Get custom songs
      const customSongs = songStorage.getCustomSongs();
      
      // Merge and mark custom songs
      const allSongs = [
        ...customSongs.map(song => ({ ...song, isCustom: true })),
        ...defaultSongs
      ];
      
      setSongs(allSongs);
    } catch (error) {
      console.error('Error fetching songs:', error);
      // Fallback to custom + sample
      const customSongs = songStorage.getCustomSongs();
      setSongs([...customSongs.map(song => ({ ...song, isCustom: true })), ...sampleSongs]);
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
      {/* Page Header - Enhanced */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-16 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute w-64 h-64 bg-white/10 rounded-full blur-3xl -top-32 -left-32 animate-pulse"></div>
          <div className="absolute w-64 h-64 bg-white/10 rounded-full blur-3xl -bottom-32 -right-32 animate-pulse"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Lyrics Library</h1>
              <p className="text-xl text-blue-100">Browse and download worship lyrics in multiple formats</p>
            </div>
      
            {/* Add Custom Song Button */}
            <Link href="/add-song">
              <button className="flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:scale-105 transition shadow-2xl">
                <Plus size={24} />
                Add Custom Song
              </button>
            </Link>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0L60 5C120 10 240 20 360 23.3C480 26.7 600 23.3 720 21.7C840 20 960 20 1080 23.3C1200 26.7 1320 33.3 1380 36.7L1440 40V60H0V0Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow-md sticky top-[72px] z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search - FIXED TEXT COLOR */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search songs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900 placeholder-gray-500"
              />
              <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            </div>

            {/* Language Filter - FIXED TEXT COLOR */}
            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900 bg-white"
            >
              <option value="all">All Languages</option>
              <option value="Tamil">Tamil</option>
              <option value="English">English</option>
              <option value="Bilingual">Bilingual</option>
            </select>

            {/* Category Filter - FIXED TEXT COLOR */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900 bg-white"
            >
              <option value="all">All Categories</option>
              <option value="Worship">Worship</option>
              <option value="Praise">Praise</option>
              <option value="Gospel">Gospel</option>
              <option value="Christmas">Christmas</option>
              <option value="Easter">Easter</option>
            </select>
          </div>

          <div className="mt-4 text-gray-600 flex items-center justify-between">
            <span>Showing {filteredSongs.length} of {songs.length} songs</span>
            <Link href="/add-song">
              <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-lg font-semibold transition text-sm">
                + Add Custom Song
              </button>
            </Link>
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
          <div className="flex flex-col gap-2">
            <span className="text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-semibold">
              {song.language}
            </span>
            {song.isCustom && (
              <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full font-semibold">
                Custom
              </span>
            )}
          </div>
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