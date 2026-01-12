// pages/admin/batch-add.js
// Batch Song Adder - Add multiple songs at once!

import { useState, useEffect } from 'react';
import { 
  Layers, Copy, Check, AlertTriangle, Sparkles, 
  RotateCcw, ChevronDown, ChevronUp, AlertCircle,
  CheckCircle, XCircle, Edit2
} from 'lucide-react';
import AdminAuth from '../../components/AdminAuth';
import AdminNav from '../../components/AdminNav';
import { processSong } from '../../utils/tamilTransliterator';
import { checkMultipleDuplicates, getDuplicateSummary } from '../../utils/duplicateDetector';
import { learnMultipleWords } from '../../utils/learningSystem';

export default function BatchAdd() {
  const [bulkLyrics, setBulkLyrics] = useState('');
  const [processedSongs, setProcessedSongs] = useState([]);
  const [existingSongs, setExistingSongs] = useState([]);
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [duplicateResults, setDuplicateResults] = useState([]);
  const [showDuplicates, setShowDuplicates] = useState(true);
  const [selectedSongs, setSelectedSongs] = useState(new Set());
  const [editingIndex, setEditingIndex] = useState(null);
  const [editForm, setEditForm] = useState({ titleEnglish: '', artist: '' });

  // Fetch existing songs for duplicate check
  useEffect(() => {
    fetchExistingSongs();
  }, []);

  const fetchExistingSongs = async () => {
    try {
      const response = await fetch('/api/songs');
      const songs = await response.json();
      setExistingSongs(songs);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const processBulkLyrics = () => {
    if (!bulkLyrics.trim()) return;

    // Split by --- separator
    const songBlocks = bulkLyrics
      .split(/\n---\n|\n---|\n-{3,}\n/)
      .map(block => block.trim())
      .filter(block => block.length > 0);

    const songs = [];
    
    for (const block of songBlocks) {
      const song = processSong(block);
      if (song) {
        songs.push(song);
      }
    }

    setProcessedSongs(songs);
    
    // Check for duplicates
    const duplicates = checkMultipleDuplicates(songs, existingSongs);
    setDuplicateResults(duplicates);
    
    // Select all non-duplicates by default
    const nonDuplicateIndices = new Set(
      duplicates
        .filter(r => !r.isDuplicate)
        .map(r => r.index)
    );
    setSelectedSongs(nonDuplicateIndices);

    // Generate code for selected songs
    generateCodeForSelected(songs, nonDuplicateIndices);
  };

  const generateCodeForSelected = (songs, selectedIndices) => {
    const selected = songs.filter((_, i) => selectedIndices.has(i));
    
    if (selected.length === 0) {
      setGeneratedCode('// No songs selected');
      return;
    }

    const codeBlocks = selected.map(song => generateSongCode(song));
    setGeneratedCode(codeBlocks.join(',\n\n'));
  };

  const generateSongCode = (song) => {
    return `  {
    id: "${song.id}",
    title: "${escapeQuotes(song.title)}",
    titleEnglish: "${escapeQuotes(song.titleEnglish)}",
    artist: "${escapeQuotes(song.artist)}",
    language: "Tamil",
    lyrics: {
      tamil: [
${song.lyrics.tamil.map(l => `        { line: ${l.line}, text: "${escapeQuotes(l.text)}" }`).join(',\n')}
      ],
      transliteration: [
${song.lyrics.transliteration.map(l => `        { line: ${l.line}, text: "${escapeQuotes(l.text)}" }`).join(',\n')}
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
    createdAt: "${song.createdAt}",
    updatedAt: "${song.updatedAt}"
  }`;
  };

  const escapeQuotes = (str) => {
    if (!str) return '';
    return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  };

  const toggleSongSelection = (index) => {
    const newSelected = new Set(selectedSongs);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedSongs(newSelected);
    generateCodeForSelected(processedSongs, newSelected);
  };

  const selectAll = () => {
    const allIndices = new Set(processedSongs.map((_, i) => i));
    setSelectedSongs(allIndices);
    generateCodeForSelected(processedSongs, allIndices);
  };

  const selectNonDuplicates = () => {
    const nonDupIndices = new Set(
      duplicateResults
        .filter(r => !r.isDuplicate)
        .map(r => r.index)
    );
    setSelectedSongs(nonDupIndices);
    generateCodeForSelected(processedSongs, nonDupIndices);
  };

  const deselectAll = () => {
    setSelectedSongs(new Set());
    setGeneratedCode('// No songs selected');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setBulkLyrics('');
    setProcessedSongs([]);
    setGeneratedCode('');
    setDuplicateResults([]);
    setSelectedSongs(new Set());
    setEditingIndex(null);
  };

  const startEditing = (index) => {
    const song = processedSongs[index];
    setEditForm({
      titleEnglish: song.titleEnglish,
      artist: song.artist
    });
    setEditingIndex(index);
  };

  const saveEdit = () => {
    if (editingIndex === null) return;
    
    const updated = [...processedSongs];
    updated[editingIndex] = {
      ...updated[editingIndex],
      titleEnglish: editForm.titleEnglish,
      artist: editForm.artist,
      id: editForm.titleEnglish.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-').substring(0, 50)
    };
    
    setProcessedSongs(updated);
    setEditingIndex(null);
    generateCodeForSelected(updated, selectedSongs);
  };

  const loadSample = () => {
    setBulkLyrics(`கர்த்தர் என் மேய்ப்பர்
எனக்கு குறைவு இல்லை
புல்லுள்ள இடங்களில்
என்னைப் படுக்கச் செய்வார்

---

அற்புதமான கிருபை
எவ்வளவு இனிமையான ஒலி
என்னைப் போன்ற பாவியை
இரட்சித்தது

---

இயேசு என் ராஜா
என் உள்ளம் உம்மைப் பாடும்
உம் நாமம் மகிமை
என்றென்றும் துதிப்பேன்`);
  };

  const summary = duplicateResults.length > 0 ? getDuplicateSummary(duplicateResults) : null;

  return (
    <AdminAuth title="Batch Song Adder">
      <AdminNav />
      
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 mb-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white/20 p-4 rounded-xl">
                <Layers size={40} />
              </div>
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <Sparkles className="text-yellow-300" />
                  Batch Song Adder
                </h1>
                <p className="text-green-100 mt-1">
                  Add multiple songs at once - separate with ---
                </p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Input */}
            <div className="space-y-6">
              {/* Bulk Input */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-bold text-gray-800">
                    Paste Multiple Songs
                  </label>
                  <button
                    onClick={loadSample}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Load Sample
                  </button>
                </div>
                
                <textarea
                  value={bulkLyrics}
                  onChange={(e) => setBulkLyrics(e.target.value)}
                  rows={16}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-base leading-relaxed font-mono"
                  placeholder={`பாடல் 1 வரிகள்
வரி 2
வரி 3

---

பாடல் 2 வரிகள்
வரி 2
வரி 3

---

பாடல் 3 வரிகள்
...`}
                />
                
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm text-gray-500">
                    Separate songs with <code className="bg-gray-100 px-2 py-1 rounded">---</code>
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={clearAll}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm"
                    >
                      <RotateCcw size={14} />
                      Clear
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={processBulkLyrics}
                  disabled={!bulkLyrics.trim()}
                  className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <Sparkles size={20} />
                  Process All Songs
                </button>
              </div>

              {/* Results Summary */}
              {processedSongs.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="font-bold text-lg mb-4">Processed Songs</h3>
                  
                  {/* Summary Stats */}
                  {summary && (
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-blue-600">{summary.total}</div>
                        <div className="text-xs text-blue-700">Total</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-green-600">{summary.unique}</div>
                        <div className="text-xs text-green-700">Unique</div>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-yellow-600">{summary.similar}</div>
                        <div className="text-xs text-yellow-700">Similar</div>
                      </div>
                      <div className="bg-red-50 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-red-600">{summary.exact}</div>
                        <div className="text-xs text-red-700">Duplicates</div>
                      </div>
                    </div>
                  )}

                  {/* Selection Controls */}
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={selectAll}
                      className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-lg"
                    >
                      Select All
                    </button>
                    <button
                      onClick={selectNonDuplicates}
                      className="text-sm bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-lg"
                    >
                      Select Unique Only
                    </button>
                    <button
                      onClick={deselectAll}
                      className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg"
                    >
                      Deselect All
                    </button>
                  </div>

                  {/* Song List */}
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {processedSongs.map((song, index) => {
                      const dupInfo = duplicateResults.find(r => r.index === index);
                      const isDuplicate = dupInfo?.isDuplicate;
                      const isSelected = selectedSongs.has(index);
                      
                      return (
                        <div 
                          key={index}
                          className={`p-3 rounded-lg border-2 transition ${
                            isSelected 
                              ? 'border-green-500 bg-green-50' 
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSongSelection(index)}
                              className="mt-1 w-5 h-5 rounded"
                            />
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold truncate">{song.titleEnglish}</span>
                                {isDuplicate && (
                                  <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full">
                                    Duplicate?
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-600 truncate">{song.title}</div>
                              <div className="text-xs text-gray-400">
                                {song.lyrics.tamil.length} lines
                              </div>
                              
                              {/* Duplicate Warning */}
                              {isDuplicate && dupInfo.matches?.[0] && (
                                <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded p-2 text-xs">
                                  <span className="text-yellow-700">
                                    Similar to: <strong>{dupInfo.matches[0].song.titleEnglish}</strong>
                                    ({Math.round(dupInfo.matches[0].overallScore * 100)}% match)
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            <button
                              onClick={() => startEditing(index)}
                              className="p-1 hover:bg-gray-200 rounded"
                              title="Edit"
                            >
                              <Edit2 size={16} className="text-gray-500" />
                            </button>
                          </div>
                          
                          {/* Edit Form */}
                          {editingIndex === index && (
                            <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                              <input
                                type="text"
                                value={editForm.titleEnglish}
                                onChange={(e) => setEditForm({ ...editForm, titleEnglish: e.target.value })}
                                placeholder="English Title"
                                className="w-full px-3 py-2 border rounded-lg text-sm"
                              />
                              <input
                                type="text"
                                value={editForm.artist}
                                onChange={(e) => setEditForm({ ...editForm, artist: e.target.value })}
                                placeholder="Artist (optional)"
                                className="w-full px-3 py-2 border rounded-lg text-sm"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={saveEdit}
                                  className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingIndex(null)}
                                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Output */}
            <div>
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">
                    Generated Code ({selectedSongs.size} songs)
                  </h3>
                  {generatedCode && generatedCode !== '// No songs selected' && (
                    <button
                      onClick={copyToClipboard}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                        copied 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                      }`}
                    >
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                      {copied ? 'Copied!' : 'Copy All'}
                    </button>
                  )}
                </div>
                
                <pre className="bg-gray-900 text-green-400 p-4 rounded-xl overflow-auto text-xs h-[600px]">
                  {generatedCode || '// Process songs to generate code...'}
                </pre>
                
                {generatedCode && generatedCode !== '// No songs selected' && (
                  <div className="mt-4 bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Next:</strong> Copy and paste into <code className="bg-blue-100 px-1 rounded">data/songs.js</code>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminAuth>
  );
}