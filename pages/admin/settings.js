// pages/admin/settings.js
// Admin Settings - Manage Learning System

import { useState, useEffect } from 'react';
import { 
  Settings, BookOpen, Download, Upload, Trash2, 
  Save, RotateCcw, Check, AlertTriangle, Eye
} from 'lucide-react';
import AdminAuth from '../../components/AdminAuth';
import AdminNav from '../../components/AdminNav';
import { 
  getLearnedWords, 
  learnWord, 
  forgetWord, 
  clearAllLearned,
  exportLearnedWords,
  importLearnedWords,
  getLearningStats
} from '../../utils/learningSystem';

export default function AdminSettings() {
  const [learnedWords, setLearnedWords] = useState({});
  const [stats, setStats] = useState({});
  const [newTamil, setNewTamil] = useState('');
  const [newEnglish, setNewEnglish] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLearnedWords(getLearnedWords());
    setStats(getLearningStats());
  };

  const handleAddWord = () => {
    if (newTamil.trim() && newEnglish.trim()) {
      learnWord(newTamil.trim(), newEnglish.trim());
      setNewTamil('');
      setNewEnglish('');
      loadData();
    }
  };

  const handleDeleteWord = (tamilWord) => {
    forgetWord(tamilWord);
    loadData();
  };

  const handleClearAll = () => {
    clearAllLearned();
    setShowClearConfirm(false);
    loadData();
  };

  const handleExport = () => {
    const json = exportLearnedWords();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `learned-words-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImport = () => {
    try {
      const count = importLearnedWords(importText);
      alert(`Successfully imported ${count} words!`);
      setImportText('');
      setShowImport(false);
      loadData();
    } catch (error) {
      alert('Invalid JSON format. Please check your input.');
    }
  };

  const filteredWords = Object.entries(learnedWords).filter(([tamil, english]) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return tamil.includes(searchQuery) || english.toLowerCase().includes(q);
  });

  const wordCount = Object.keys(learnedWords).length;

  return (
    <AdminAuth title="Admin Settings">
      <AdminNav />
      
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-700 to-gray-900 rounded-2xl p-8 mb-8 text-white">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-4 rounded-xl">
                <Settings size={40} />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Admin Settings</h1>
                <p className="text-gray-300 mt-1">Manage learning system & preferences</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="text-4xl font-bold text-purple-600">{wordCount}</div>
              <div className="text-gray-500">Learned Words</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="text-4xl font-bold text-green-600">{stats.songsAdded || 0}</div>
              <div className="text-gray-500">Songs Added</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="text-4xl font-bold text-blue-600">{stats.correctionsApplied || 0}</div>
              <div className="text-gray-500">Corrections Applied</div>
            </div>
          </div>

          {/* Learned Words Management */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <BookOpen size={24} />
                Learned Words Dictionary
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg text-sm font-semibold"
                >
                  <Download size={16} />
                  Export
                </button>
                <button
                  onClick={() => setShowImport(true)}
                  className="flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-lg text-sm font-semibold"
                >
                  <Upload size={16} />
                  Import
                </button>
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg text-sm font-semibold"
                >
                  <Trash2 size={16} />
                  Clear All
                </button>
              </div>
            </div>

            {/* Add New Word */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold mb-3">Add New Word</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newTamil}
                  onChange={(e) => setNewTamil(e.target.value)}
                  placeholder="Tamil word (தமிழ்)"
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                />
                <input
                  type="text"
                  value={newEnglish}
                  onChange={(e) => setNewEnglish(e.target.value)}
                  placeholder="English transliteration"
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                />
                <button
                  onClick={handleAddWord}
                  disabled={!newTamil.trim() || !newEnglish.trim()}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Search */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search words..."
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none mb-4"
            />

            {/* Word List */}
            <div className="max-h-96 overflow-y-auto">
              {filteredWords.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {wordCount === 0 ? 'No learned words yet' : 'No matching words found'}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredWords.map(([tamil, english]) => (
                    <div 
                      key={tamil}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                    >
                      <div className="flex-1">
                        <span className="font-semibold text-gray-800">{tamil}</span>
                        <span className="mx-3 text-gray-400">→</span>
                        <span className="text-purple-600">{english}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteWord(tamil)}
                        className="p-2 hover:bg-red-100 rounded-lg text-red-500"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border-2 border-purple-200">
            <h3 className="font-bold text-purple-900 mb-3">💡 How Learning Works</h3>
            <ul className="space-y-2 text-purple-800 text-sm">
              <li>• When you edit transliterations in Quick Add, corrections are automatically learned</li>
              <li>• Learned words are applied to all future transliterations</li>
              <li>• Export your dictionary to backup or share with others</li>
              <li>• Import dictionaries to quickly add common worship words</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <h3 className="text-xl font-bold">Clear All Learned Words?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              This will permanently delete all {wordCount} learned words. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full">
            <h3 className="text-xl font-bold mb-4">Import Learned Words</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Paste JSON format: <code className="bg-gray-100 px-1 rounded">{`{"தமிழ்": "Tamil", ...}`}</code>
            </p>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none font-mono text-sm"
              placeholder='{"கர்த்தர்": "Karthar", "இயேசு": "Yesu"}'
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setShowImport(false); setImportText(''); }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={!importText.trim()}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-2 rounded-lg font-semibold"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminAuth>
  );
}