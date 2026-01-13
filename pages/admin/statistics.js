// pages/admin/statistics.js
// Song Statistics Dashboard

import { useState, useEffect } from 'react';
import { BarChart3, PieChart, TrendingUp, Music, Calendar, Users } from 'lucide-react';
import AdminAuth from '../../components/AdminAuth';
import { songs } from '../../data/songs';
import { songStorage } from '../../utils/songStorage';

export default function Statistics() {
  const [stats, setStats] = useState(null);
  const [customSongs, setCustomSongs] = useState([]);

  useEffect(() => {
    const custom = songStorage.getCustomSongs();
    setCustomSongs(custom);
    calculateStats([...songs, ...custom]);
  }, []);

  const calculateStats = (allSongs) => {
    // Language distribution
    const byLanguage = {};
    allSongs.forEach(song => {
      const lang = song.language || 'Unknown';
      byLanguage[lang] = (byLanguage[lang] || 0) + 1;
    });

    // Artist distribution
    const byArtist = {};
    allSongs.forEach(song => {
      const artist = song.artist || 'Unknown';
      byArtist[artist] = (byArtist[artist] || 0) + 1;
    });

    // Top artists (sorted)
    const topArtists = Object.entries(byArtist)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // Songs by date (if createdAt exists)
    const byMonth = {};
    allSongs.forEach(song => {
      if (song.createdAt) {
        const month = song.createdAt.substring(0, 7); // YYYY-MM
        byMonth[month] = (byMonth[month] || 0) + 1;
      }
    });

    // Average lines per song
    let totalLines = 0;
    let songsWithLyrics = 0;
    allSongs.forEach(song => {
      if (song.lyrics?.tamil?.length) {
        totalLines += song.lyrics.tamil.length;
        songsWithLyrics++;
      }
    });
    const avgLines = songsWithLyrics > 0 ? Math.round(totalLines / songsWithLyrics) : 0;

    // Recently added (last 10)
    const recentSongs = [...allSongs]
      .filter(s => s.createdAt)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    setStats({
      total: allSongs.length,
      database: songs.length,
      custom: customSongs.length,
      byLanguage,
      topArtists,
      byMonth,
      avgLines,
      recentSongs
    });
  };

  if (!stats) {
    return (
      <AdminAuth title="Statistics">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
        </div>
      </AdminAuth>
    );
  }

  const maxLanguageCount = Math.max(...Object.values(stats.byLanguage));

  return (
    <AdminAuth title="Song Statistics">
      <div className="py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 mb-8 text-white">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-4 rounded-xl">
                <BarChart3 size={40} />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Song Statistics</h1>
                <p className="text-emerald-100 mt-1">
                  Overview of your song library
                </p>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<Music />}
              label="Total Songs"
              value={stats.total}
              color="blue"
            />
            <StatCard
              icon={<BarChart3 />}
              label="Database Songs"
              value={stats.database}
              color="purple"
            />
            <StatCard
              icon={<Users />}
              label="Custom Songs"
              value={stats.custom}
              color="green"
            />
            <StatCard
              icon={<TrendingUp />}
              label="Avg Lines/Song"
              value={stats.avgLines}
              color="orange"
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Language Distribution */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                <PieChart size={20} className="text-blue-600" />
                By Language
              </h2>
              
              <div className="space-y-4">
                {Object.entries(stats.byLanguage).map(([lang, count]) => (
                  <div key={lang}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{lang}</span>
                      <span className="text-gray-500">{count} songs ({Math.round(count / stats.total * 100)}%)</span>
                    </div>
                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${(count / maxLanguageCount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Artists */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Users size={20} className="text-purple-600" />
                Top Artists
              </h2>
              
              <div className="space-y-3">
                {stats.topArtists.map(([artist, count], index) => (
                  <div
                    key={artist}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-amber-600' :
                      'bg-gray-300'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium truncate">{artist}</div>
                    </div>
                    <div className="text-gray-500 font-semibold">{count}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recently Added */}
            <div className="bg-white rounded-2xl shadow-xl p-6 lg:col-span-2">
              <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Calendar size={20} className="text-green-600" />
                Recently Added
              </h2>
              
              {stats.recentSongs.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {stats.recentSongs.map((song, index) => (
                    <div
                      key={song.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                        <Music size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{song.titleEnglish || song.title}</div>
                        <div className="text-sm text-gray-500">{song.createdAt}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No date information available</p>
                </div>
              )}
            </div>
          </div>

          {/* Monthly Growth Chart */}
          {Object.keys(stats.byMonth).length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-6 mt-8">
              <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                <TrendingUp size={20} className="text-emerald-600" />
                Songs Added Over Time
              </h2>
              
              <div className="flex items-end gap-2 h-48">
                {Object.entries(stats.byMonth)
                  .sort((a, b) => a[0].localeCompare(b[0]))
                  .slice(-12)
                  .map(([month, count]) => {
                    const maxCount = Math.max(...Object.values(stats.byMonth));
                    const height = (count / maxCount) * 100;
                    return (
                      <div key={month} className="flex-1 flex flex-col items-center">
                        <div className="text-xs text-gray-500 mb-1">{count}</div>
                        <div
                          className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-lg transition-all duration-500"
                          style={{ height: `${height}%`, minHeight: '8px' }}
                        ></div>
                        <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left">
                          {month.substring(5)}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminAuth>
  );
}

function StatCard({ icon, label, value, color }) {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-2xl p-6 text-white`}>
      <div className="flex items-center justify-between mb-4">
        <div className="bg-white/20 p-2 rounded-lg">
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm opacity-90">{label}</div>
    </div>
  );
}