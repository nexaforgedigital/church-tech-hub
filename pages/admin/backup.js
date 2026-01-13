// pages/admin/backup.js
import { useState, useEffect } from 'react';
import { Database, Download, Upload, Clock, Check } from 'lucide-react';
import AdminAuth from '../../components/AdminAuth';
import { songs } from '../../data/songs';
import { songStorage } from '../../utils/songStorage';

export default function BackupManager() {
  const [backups, setBackups] = useState([]);
  const [lastBackup, setLastBackup] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('churchassist-backups');
    if (saved) setBackups(JSON.parse(saved));
    const last = localStorage.getItem('churchassist-last-backup');
    if (last) setLastBackup(last);
  }, []);

  const createBackup = () => {
    const customSongs = songStorage.getCustomSongs();
    const backup = {
      id: Date.now(),
      date: new Date().toISOString(),
      databaseSongs: songs.length,
      customSongs: customSongs,
      settings: {
        learnedWords: localStorage.getItem('churchassist-learned-words'),
        categories: localStorage.getItem('churchassist-categories'),
        youtubeRefs: localStorage.getItem('churchassist-youtube-refs'),
      }
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `churchassist-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();

    setLastBackup(new Date().toISOString());
    localStorage.setItem('churchassist-last-backup', new Date().toISOString());
  };

  const restoreBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const backup = JSON.parse(event.target.result);
        
        if (backup.customSongs) {
          localStorage.setItem('customSongs', JSON.stringify(backup.customSongs));
        }
        if (backup.settings?.learnedWords) {
          localStorage.setItem('churchassist-learned-words', backup.settings.learnedWords);
        }
        if (backup.settings?.categories) {
          localStorage.setItem('churchassist-categories', backup.settings.categories);
        }
        
        alert('Backup restored successfully! Please refresh the page.');
      } catch (error) {
        alert('Error restoring backup: Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  return (
    <AdminAuth title="Backup Manager">
      <div className="py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-2xl p-8 mb-8 text-white">
            <div className="flex items-center gap-4">
              <Database size={40} />
              <div>
                <h1 className="text-3xl font-bold">Backup Manager</h1>
                <p className="text-slate-300">Backup and restore your data</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Create Backup */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="font-bold text-lg mb-4">Create Backup</h2>
              <p className="text-gray-600 mb-4">
                Download a complete backup of your custom songs and settings.
              </p>
              <button
                onClick={createBackup}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                <Download size={20} />
                Download Backup
              </button>
              {lastBackup && (
                <div className="mt-4 text-sm text-gray-500 flex items-center gap-2">
                  <Clock size={14} />
                  Last backup: {new Date(lastBackup).toLocaleString()}
                </div>
              )}
            </div>

            {/* Restore Backup */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="font-bold text-lg mb-4">Restore Backup</h2>
              <p className="text-gray-600 mb-4">
                Upload a backup file to restore your data.
              </p>
              <label className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 cursor-pointer">
                <Upload size={20} />
                Upload Backup File
                <input
                  type="file"
                  accept=".json"
                  onChange={restoreBackup}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* What's Backed Up */}
          <div className="bg-slate-50 rounded-xl p-6 mt-8 border-2 border-slate-200">
            <h3 className="font-bold text-slate-900 mb-3">📦 What's Included in Backup</h3>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-600" />
                Custom songs (localStorage)
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-600" />
                Learned transliteration words
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-600" />
                Custom categories
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-600" />
                YouTube references
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AdminAuth>
  );
}