// pages/admin/quick-add.js
// 🚀 MAGIC SONG ADDER - Just paste Tamil, get everything!
// With Smart Learning System Integration

import { useState, useEffect } from 'react';
import { 
  Wand2, Copy, Check, AlertTriangle, Sparkles, 
  RotateCcw, Eye, ChevronDown, ChevronUp, 
  BookOpen, Lightbulb, EyeOff
} from 'lucide-react';
import AdminAuth from '../../components/AdminAuth';
import AdminNav from '../../components/AdminNav';
import { 
  processSong, 
  transliterate, 
  validateTransliteration,
  getBaseWordCount 
} from '../../utils/tamilTransliterator';
import { 
  learnMultipleWords, 
  extractCorrections, 
  getLearnedWordCount,
  updateStats 
} from '../../utils/learningSystem';
import { checkDuplicate } from '../../utils/duplicateDetector';

export default function QuickAdd() {
  // Input states
  const [tamilLyrics, setTamilLyrics] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [artist, setArtist] = useState('');
  
  // Output states
  const [processedSong, setProcessedSong] = useState(null);
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [warnings, setWarnings] = useState([]);
  
  // UI states
  const [showPreview, setShowPreview] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTransliteration, setEditedTransliteration] = useState('');
  
  // Stats
  const [learnedCount, setLearnedCount] = useState(0);
  const [baseWordCount, setBaseWordCount] = useState(0);
  
  // Duplicate check
  const [existingSongs, setExistingSongs] = useState([]);
  const [duplicateWarning, setDuplicateWarning] = useState(null);

  // Load initial data
  useEffect(() => {
    setLearnedCount(getLearnedWordCount());
    setBaseWordCount(getBaseWordCount());
    fetchExistingSongs();
  }, []);

  // Fetch existing songs for duplicate check
  const fetchExistingSongs = async () => {
    try {
      const response = await fetch('/api/songs');
      const songs = await response.json();
      setExistingSongs(songs);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  // Auto-process when Tamil lyrics change
  useEffect(() => {
    if (tamilLyrics.trim()) {
      processLyrics();
    } else {
      clearOutput();
    }
  }, [tamilLyrics, customTitle, artist]);

  const clearOutput = () => {
    setProcessedSong(null);
    setGeneratedCode('');
    setWarnings([]);
    setDuplicateWarning(null);
    setEditedTransliteration('');
    setIsEditing(false);
  };

  const processLyrics = () => {
    const song = processSong(tamilLyrics, customTitle, artist);
    
    if (!song) {
      clearOutput();
      return;
    }

    setProcessedSong(song);
    
    // Validate transliteration
    const allWarnings = [];
    song.lyrics.tamil.forEach((line, i) => {
      const validation = validateTransliteration(
        line.text, 
        song.lyrics.transliteration[i]?.text || ''
      );
      if (!validation.isGood) {
        allWarnings.push(`Line ${i + 1}: ${validation.warnings.join(', ')}`);
      }
    });
    setWarnings(allWarnings);

    // Check for duplicates
    if (existingSongs.length > 0) {
      const dupCheck = checkDuplicate(song, existingSongs, 0.7);
      if (dupCheck.isDuplicate && dupCheck.matches.length > 0) {
        setDuplicateWarning(dupCheck.matches[0]);
      } else {
        setDuplicateWarning(null);
      }
    }

    // Generate code
    generateCode(song);
    
    // Set editable transliteration
    setEditedTransliteration(
      song.lyrics.transliteration.map(l => l.text).join('\n')
    );
  };

  const generateCode = (song) => {
    const code = `  {
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
  },`;

    setGeneratedCode(code);
  };

  const escapeQuotes = (str) => {
    if (!str) return '';
    return str
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    updateStats('songsAdded');
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setTamilLyrics('');
    setCustomTitle('');
    setArtist('');
    clearOutput();
  };

  const applyEditedTransliteration = () => {
    if (!processedSong) return;
    
    const editedLines = editedTransliteration
      .split('\n')
      .map(l => l.trim())
      .filter(l => l);
    
    const originalLines = processedSong.lyrics.transliteration.map(l => l.text);
    const tamilLines = processedSong.lyrics.tamil.map(l => l.text);
    
    // Extract corrections for learning
    const corrections = extractCorrections(tamilLines, originalLines, editedLines);
    
    // Learn the corrections
    if (Object.keys(corrections).length > 0) {
      learnMultipleWords(corrections);
      setLearnedCount(getLearnedWordCount());
      console.log('📚 Learned corrections:', corrections);
    }
    
    // Update song with edited transliteration
    const updatedSong = {
      ...processedSong,
      lyrics: {
        ...processedSong.lyrics,
        transliteration: editedLines.map((text, i) => ({ line: i + 1, text }))
      }
    };
    
    setProcessedSong(updatedSong);
    setIsEditing(false);
    generateCode(updatedSong);
    
    // Clear warnings after edit
    setWarnings([]);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    if (processedSong) {
      setEditedTransliteration(
        processedSong.lyrics.transliteration.map(l => l.text).join('\n')
      );
    }
  };

  // Sample songs for testing
  const loadSample = (sampleNum = 1) => {
    const samples = {
      1: `கர்த்தர் என் மேய்ப்பர்
எனக்கு குறைவு இல்லை
புல்லுள்ள இடங்களில்
என்னைப் படுக்கச் செய்வார்
அமர்ந்த தண்ணீர்கள் அருகே
என்னை நடத்துவார்`,
      2: `இயேசு என் ராஜா
என் உள்ளம் உம்மைப் பாடும்
உம் நாமம் மகிமை
என்றென்றும் துதிப்பேன்`,
      3: `அல்லேலூயா அல்லேலூயா
ஆண்டவரை துதியுங்கள்
அவர் நல்லவர் அவர் வல்லவர்
அவர் கிருபை என்றுமுள்ளது`
    };
    
    setTamilLyrics(samples[sampleNum] || samples[1]);
    setCustomTitle('');
    setArtist('Traditional');
  };

  const tamilLineCount = tamilLyrics.split('\n').filter(l => l.trim()).length;

  return (
    <AdminAuth title="Quick Song Adder">
      <AdminNav />
      
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 mb-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white/20 p-4 rounded-xl">
                <Wand2 size={40} />
              </div>
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <Sparkles className="text-yellow-300" />
                  Magic Song Adder
                </h1>
                <p className="text-purple-100 mt-1">
                  Just paste Tamil lyrics → Get everything automatically!
                </p>
              </div>
            </div>
            
            {/* How it works */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">1️⃣</div>
                <div className="font-semibold">Paste Tamil</div>
                <div className="text-sm text-purple-200">Just the lyrics</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">2️⃣</div>
                <div className="font-semibold">Auto Magic</div>
                <div className="text-sm text-purple-200">Title + Transliteration</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">3️⃣</div>
                <div className="font-semibold">Copy Code</div>
                <div className="text-sm text-purple-200">Paste in songs.js</div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-6 mt-6 text-sm">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                <BookOpen size={16} />
                <span>{baseWordCount} base words</span>
              </div>
              <div className="flex items-center gap-2 bg-green-500/30 px-3 py-1 rounded-full">
                <Lightbulb size={16} />
                <span>{learnedCount} learned words</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Input */}
            <div className="space-y-6">
              {/* Tamil Lyrics Input */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-bold text-gray-800">
                    Tamil Lyrics (தமிழ் பாடல்)
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => loadSample(1)}
                      className="text-sm text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50"
                    >
                      Sample 1
                    </button>
                    <button
                      onClick={() => loadSample(2)}
                      className="text-sm text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50"
                    >
                      Sample 2
                    </button>
                    <button
                      onClick={() => loadSample(3)}
                      className="text-sm text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50"
                    >
                      Sample 3
                    </button>
                  </div>
                </div>
                
                <textarea
                  value={tamilLyrics}
                  onChange={(e) => setTamilLyrics(e.target.value)}
                  rows={12}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-lg leading-relaxed"
                  placeholder="பாடலின் வரிகளை இங்கே ஒட்டவும்...

உதாரணம்:
கர்த்தர் என் மேய்ப்பர்
எனக்கு குறைவு இல்லை
புல்லுள்ள இடங்களில்
என்னைப் படுக்கச் செய்வார்"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
                
                <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                  <span>
                    {tamilLineCount} {tamilLineCount === 1 ? 'line' : 'lines'}
                  </span>
                  <button
                    onClick={clearAll}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <RotateCcw size={14} />
                    Clear All
                  </button>
                </div>
              </div>

              {/* Advanced Options */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <span className="font-semibold text-gray-700">
                    Advanced Options (Optional)
                  </span>
                  {showAdvanced ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                
                {showAdvanced && (
                  <div className="px-6 pb-6 space-y-4 border-t">
                    <div className="pt-4">
                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        Custom English Title
                        <span className="text-gray-400 font-normal ml-2">
                          (leave empty to auto-generate)
                        </span>
                      </label>
                      <input
                        type="text"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                        placeholder="e.g., The Lord is My Shepherd"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        Artist / Composer
                        <span className="text-gray-400 font-normal ml-2">(optional)</span>
                      </label>
                      <input
                        type="text"
                        value={artist}
                        onChange={(e) => setArtist(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                        placeholder="e.g., Traditional, Unknown"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Duplicate Warning */}
              {duplicateWarning && (
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-yellow-700 font-semibold mb-2">
                    <AlertTriangle size={20} />
                    Possible Duplicate Found
                  </div>
                  <p className="text-yellow-700 text-sm">
                    Similar to: <strong>{duplicateWarning.song.titleEnglish}</strong>
                    <br />
                    Match: {Math.round(duplicateWarning.overallScore * 100)}%
                  </p>
                  <p className="text-yellow-600 text-xs mt-2">
                    You can still add this song if it's different.
                  </p>
                </div>
              )}

              {/* Transliteration Warnings */}
              {warnings.length > 0 && !isEditing && (
                <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-orange-700 font-semibold mb-2">
                    <AlertTriangle size={20} />
                    Review Transliteration
                  </div>
                  <ul className="text-sm text-orange-700 space-y-1 mb-3">
                    {warnings.slice(0, 3).map((w, i) => (
                      <li key={i}>• {w}</li>
                    ))}
                    {warnings.length > 3 && (
                      <li>• ... and {warnings.length - 3} more</li>
                    )}
                  </ul>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-sm bg-orange-200 hover:bg-orange-300 text-orange-800 px-4 py-2 rounded-lg font-semibold"
                  >
                    ✏️ Edit Transliteration
                  </button>
                </div>
              )}

              {/* Edit Transliteration */}
              {isEditing && (
                <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-purple-500">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                    ✏️ Edit Transliteration
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Corrections you make will be learned for future songs!
                  </p>
                  
                  <textarea
                    value={editedTransliteration}
                    onChange={(e) => setEditedTransliteration(e.target.value)}
                    rows={10}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none font-mono"
                    placeholder="Edit transliteration here..."
                  />
                  
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={applyEditedTransliteration}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                    >
                      <Check size={20} />
                      Apply & Learn
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                  
                  <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-700">
                      💡 <strong>Tip:</strong> Word-level corrections will be automatically 
                      learned and applied to future songs!
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Output */}
            <div className="space-y-6">
              {/* Preview */}
              {processedSong && (
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      {showPreview ? <Eye size={20} /> : <EyeOff size={20} />}
                      Preview
                    </h3>
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className="text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
                    >
                      {showPreview ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  
                  {showPreview && (
                    <div className="space-y-4">
                      {/* ID Badge */}
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4">
                        <div className="text-sm text-gray-500 mb-1">Song ID</div>
                        <code className="text-purple-700 font-mono text-sm break-all">
                          {processedSong.id}
                        </code>
                      </div>
                      
                      {/* Titles */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Tamil Title</div>
                          <div className="font-semibold text-lg text-gray-800">
                            {processedSong.title}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">English Title</div>
                          <div className="font-semibold text-lg text-gray-800">
                            {processedSong.titleEnglish}
                          </div>
                        </div>
                      </div>
                      
                      {/* Artist */}
                      {processedSong.artist && (
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Artist</div>
                          <div className="text-gray-700">{processedSong.artist}</div>
                        </div>
                      )}
                      
                      {/* Lyrics Comparison */}
                      <div>
                        <div className="text-sm text-gray-500 mb-2">
                          Lyrics ({processedSong.lyrics.tamil.length} lines)
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 max-h-64 overflow-y-auto">
                          {processedSong.lyrics.tamil.map((line, i) => (
                            <div 
                              key={i} 
                              className="mb-3 pb-3 border-b border-gray-200 last:border-0 last:mb-0 last:pb-0"
                            >
                              <div className="font-semibold text-gray-800">
                                {line.text}
                              </div>
                              <div className="text-purple-600 text-sm mt-1">
                                {processedSong.lyrics.transliteration[i]?.text}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Quick Edit Button */}
                      {!isEditing && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium text-sm"
                        >
                          ✏️ Edit Transliteration
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Generated Code */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Generated Code</h3>
                  {generatedCode && (
                    <button
                      onClick={copyToClipboard}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                        copied 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                      }`}
                    >
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                      {copied ? 'Copied!' : 'Copy Code'}
                    </button>
                  )}
                </div>
                
                <pre className="bg-gray-900 text-green-400 p-4 rounded-xl overflow-auto text-xs h-80 font-mono">
                  {generatedCode || '// Paste Tamil lyrics to generate code...'}
                </pre>
                
                {generatedCode && (
                  <div className="mt-4 bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Next Step:</strong> Copy this code and paste it inside the{' '}
                      <code className="bg-blue-100 px-1 rounded">songs</code> array in{' '}
                      <code className="bg-blue-100 px-1 rounded">data/songs.js</code>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mt-8 border-2 border-green-200">
            <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
              <Lightbulb size={20} />
              Pro Tips
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-green-800 text-sm">
              <ul className="space-y-2">
                <li>• <strong>First line</strong> becomes the title automatically</li>
                <li>• <strong>Override title</strong> using Advanced Options if needed</li>
                <li>• <strong>Review transliteration</strong> for accuracy before copying</li>
              </ul>
              <ul className="space-y-2">
                <li>• <strong>Corrections are learned</strong> and applied to future songs</li>
                <li>• <strong>Common words</strong> like கர்த்தர், இயேசு are pre-mapped</li>
                <li>• <strong>Duplicate detection</strong> warns about similar songs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminAuth>
  );
}