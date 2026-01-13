// components/admin/RecentSongsWidget.js
import { Music, Clock } from 'lucide-react';
import Link from 'next/link';

export default function RecentSongsWidget({ songs = [], limit = 5 }) {
  const recentSongs = [...songs]
    .filter(s => s.createdAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <Clock size={20} className="text-blue-600" />
        Recently Added
      </h3>
      
      {recentSongs.length > 0 ? (
        <div className="space-y-3">
          {recentSongs.map((song) => (
            <Link key={song.id} href={`/lyrics/${song.id}`}>
              <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                <Music size={16} className="text-gray-400" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate text-sm">{song.titleEnglish || song.title}</div>
                  <div className="text-xs text-gray-500">{song.createdAt}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No recent songs</p>
      )}
    </div>
  );
}