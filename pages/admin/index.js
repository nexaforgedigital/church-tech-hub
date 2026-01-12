// pages/admin/index.js
// Admin Dashboard - Main Hub

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Music, Plus, Layers, Database, Settings, Wand2, 
  TrendingUp, Clock, BookOpen, Zap, ArrowRight,
  BarChart3, FileText, Download, Upload
} from 'lucide-react';
import AdminAuth from '../../components/AdminAuth';
import AdminNav from '../../components/AdminNav';
import { getLearningStats, getLearnedWordCount } from '../../utils/learningSystem';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSongs: 0,
    learnedWords: 0,
    recentlyAdded: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch song count from API
      const response = await fetch('/api/songs');
      const songs = await response.json();
      
      // Get learning stats
      const learningStats = getLearningStats();
      const learnedCount = getLearnedWordCount();
      
      // Calculate recently added (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const recent = songs.filter(s => new Date(s.createdAt) > weekAgo).length;
      
      setStats({
        totalSongs: songs.length,
        learnedWords: learnedCount,
        recentlyAdded: recent,
        ...learningStats
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      href: '/admin/quick-add',
      icon: Wand2,
      title: 'Quick Add',
      description: 'Add single song with magic transliteration',
      color: 'from-purple-500 to-blue-500'
    },
    {
      href: '/admin/batch-add',
      icon: Layers,
      title: 'Batch Add',
      description: 'Add multiple songs at once',
      color: 'from-green-500 to-emerald-500'
    },
    {
      href: '/admin/songs',
      icon: Database,
      title: 'Manage Songs',
      description: 'View, edit, delete songs',
      color: 'from-orange-500 to-red-500'
    },
    {
      href: '/admin/settings',
      icon: Settings,
      title: 'Settings',
      description: 'Learned words & preferences',
      color: 'from-gray-500 to-gray-700'
    }
  ];

  return (
    <AdminAuth title="Admin Dashboard">
      <AdminNav />
      
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Welcome Header */}
          <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white">
            <h1 className="text-3xl font-bold mb-2">Welcome to ChurchAssist Admin</h1>
            <p className="text-purple-100">Manage your worship song database</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Music className="text-blue-600" size={24} />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {loading ? '...' : stats.totalSongs}
              </div>
              <div className="text-sm text-gray-500">Total Songs</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-green-100 p-2 rounded-lg">
                  <TrendingUp className="text-green-600" size={24} />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {loading ? '...' : stats.recentlyAdded}
              </div>
              <div className="text-sm text-gray-500">Added This Week</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <BookOpen className="text-purple-600" size={24} />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {loading ? '...' : stats.learnedWords}
              </div>
              <div className="text-sm text-gray-500">Learned Words</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Zap className="text-orange-600" size={24} />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {loading ? '...' : (stats.correctionsApplied || 0)}
              </div>
              <div className="text-sm text-gray-500">Corrections Applied</div>
            </div>
          </div>

          {/* Quick Actions */}
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.href} href={action.href}>
                  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition cursor-pointer group h-full">
                    <div className={`bg-gradient-to-r ${action.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                      <Icon className="text-white" size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">{action.description}</p>
                    <div className="flex items-center text-purple-600 text-sm font-semibold">
                      Open <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200">
            <h3 className="font-bold text-yellow-900 mb-3 flex items-center gap-2">
              💡 Pro Tips
            </h3>
            <ul className="space-y-2 text-yellow-800 text-sm">
              <li>• <strong>Quick Add:</strong> Paste Tamil lyrics and get auto-transliteration instantly</li>
              <li>• <strong>Batch Add:</strong> Separate multiple songs with <code className="bg-yellow-200 px-1 rounded">---</code></li>
              <li>• <strong>Learning System:</strong> Corrections you make are remembered for future songs</li>
              <li>• <strong>Duplicate Detection:</strong> System warns you about potential duplicate songs</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminAuth>
  );
}