import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Music, Download, Search, Plus, Filter, Sparkles } from 'lucide-react';
import { songStorage } from '../../utils/songStorage';
import Head from 'next/head';

// Cross Pattern Component (reusable)
const CrossPattern = ({ opacity = 0.03 }) => (
  <div className={`absolute inset-0 pointer-events-none`} style={{ opacity }}>
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <pattern id="cross-pattern" x="0" y="0" width="80" height="100" patternUnits="userSpaceOnUse">
        <rect x="36" y="10" width="8" height="80" rx="1" fill="white"/>
        <rect x="24" y="25" width="32" height="8" rx="1" fill="white"/>
      </pattern>
      <rect width="100%" height="100%" fill="url(#cross-pattern)"/>
    </svg>
  </div>
);

export default function LyricsLibrary() {
  const [songs, setSongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/songs');
      const defaultSongs = await response.json();
      const customSongs = songStorage.getCustomSongs();
      const allSongs = [
        ...customSongs.map(song => ({ ...song, isCustom: true })),
        ...defaultSongs
      ];
      setSongs(allSongs);
    } catch (error) {
      console.error('Error fetching songs:', error);
      const customSongs = songStorage.getCustomSongs();
      setSongs(customSongs.map(song => ({ ...song, isCustom: true })));
    } finally {
      setLoading(false);
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
    <>
      <Head>
        <title>Lyrics Library - ChurchAssist</title>
        <meta name="description" content="Browse worship song lyrics in Tamil, English, and transliteration." />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
        {/* Hero Section */}
        <section className="relative py-16 overflow-hidden">
          <CrossPattern opacity={0.02} />
          
          {/* Ambient Glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-2xl mb-6 shadow-lg shadow-amber-500/30">
                <Music size={32} className="text-slate-900" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black mb-4 text-white">
                Lyrics <span className="text-amber-400">Library</span>
              </h1>
              <p className="text-lg text-gray-400 mb-8">
                Browse and download worship lyrics in multiple formats
              </p>

              {/* Add Custom Song Button */}
              <Link href="/add-song">
                <button className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-amber-500/30">
                  <Plus size={20} />
                  Add Custom Song
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="sticky top-14 z-30 bg-slate-900/95 backdrop-blur-xl border-y border-white/10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="text"
                  placeholder="Search songs by title or artist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 rounded-xl bg-white/5 border border-white/10 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-white placeholder-gray-500 transition-all"
                />
              </div>

              {/* Language Filter */}
              <select
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-amber-500/50 focus:outline-none text-white transition-all cursor-pointer"
              >
                <option value="all" className="bg-slate-900">All Languages</option>
                <option value="Tamil" className="bg-slate-900">Tamil</option>
                <option value="English" className="bg-slate-900">English</option>
                <option value="Bilingual" className="bg-slate-900">Bilingual</option>
              </select>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-amber-500/50 focus:outline-none text-white transition-all cursor-pointer"
              >
                <option value="all" className="bg-slate-900">All Categories</option>
                <option value="Worship" className="bg-slate-900">Worship</option>
                <option value="Praise" className="bg-slate-900">Praise</option>
                <option value="Gospel" className="bg-slate-900">Gospel</option>
                <option value="Christmas" className="bg-slate-900">Christmas</option>
                <option value="Easter" className="bg-slate-900">Easter</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-gray-400">
                Showing <span className="text-amber-400 font-bold">{filteredSongs.length}</span> of {songs.length} songs
              </span>
              <Link href="/add-song" className="text-amber-400 hover:text-amber-300 font-medium transition flex items-center gap-1">
                <Plus size={16} />
                Add Custom
              </Link>
            </div>
          </div>
        </section>

        {/* Songs Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading songs...</p>
                </div>
              </div>
            ) : filteredSongs.length === 0 ? (
              <div className="text-center py-20">
                <Music size={64} className="mx-auto text-gray-600 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">No songs found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
                <Link href="/add-song">
                  <button className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 px-6 py-3 rounded-xl font-bold transition">
                    <Plus size={20} />
                    Add Your Own Song
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSongs.map((song) => (
                  <SongCard key={song.id} song={song} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

function SongCard({ song }) {
  return (
    <Link href={`/lyrics/${song.id}`}>
      <div className="group relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur rounded-2xl p-6 border border-white/10 hover:border-amber-400/30 transition-all duration-300 cursor-pointer overflow-hidden">
        {/* Hover Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:to-yellow-500/5 transition-all duration-500 rounded-2xl"></div>
        
        <div className="relative">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Music size={24} />
            </div>
            <div className="flex flex-col gap-2 items-end">
              <span className="text-xs bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full font-semibold border border-purple-500/30">
                {song.language}
              </span>
              {song.isCustom && (
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-semibold border border-emerald-500/30">
                  Custom
                </span>
              )}
            </div>
          </div>
          
          {/* Content */}
          <h3 className="text-lg font-bold mb-2 text-white group-hover:text-amber-400 transition-colors line-clamp-1">
            {song.title}
          </h3>
          <p className="text-gray-400 text-sm mb-4 line-clamp-1">{song.artist}</p>
          
          {/* Footer */}
          <div className="flex items-center justify-between text-sm">
            <span className="bg-white/5 text-gray-400 px-3 py-1 rounded-full border border-white/10">
              {song.category}
            </span>
            <div className="flex items-center gap-1 text-gray-500">
              <Download size={14} />
              <span>{song.downloads || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}