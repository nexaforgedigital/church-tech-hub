import { useState } from 'react';
import { generateSlug, parseLyricsText, validateSong, createSongObject } from '../../utils/songHelpers';
import AdminAuth from '../../components/AdminAuth';

export default function AddSongBulk() {
  const [titleEnglish, setTitleEnglish] = useState('');
  const [titleTamil, setTitleTamil] = useState('');
  const [artist, setArtist] = useState('');
  const [tamilLyrics, setTamilLyrics] = useState('');
  const [transliteration, setTransliteration] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState([]);

  const escapeQuotes = (str) => {
    if (!str) return '';
    return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  };

  const parseLyrics = (text) => {
    if (!text || !text.trim()) return [];
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map((text, index) => ({
        line: index + 1,
        text
      }));
  };

  const generateCode = () => {
    const validationErrors = [];
    
    if (!titleEnglish.trim()) validationErrors.push('English title is required');
    if (!titleTamil.trim()) validationErrors.push('Tamil title is required');
    
    const tamilLines = parseLyrics(tamilLyrics);
    const translitLines = parseLyrics(transliteration);
    
    if (tamilLines.length === 0) validationErrors.push('Tamil lyrics are required');
    if (translitLines.length === 0) validationErrors.push('Transliteration is required');
    if (tamilLines.length !== translitLines.length) {
      validationErrors.push(`Line count mismatch: Tamil has ${tamilLines.length} lines, Transliteration has ${translitLines.length} lines`);
    }
    
    setErrors(validationErrors);
    
    if (validationErrors.length > 0) {
      setGeneratedCode('');
      return;
    }

    const slug = titleEnglish
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const today = new Date().toISOString().split('T')[0];

    const code = `  // ========================================
  // SONG: ${titleEnglish.toUpperCase()}
  // ========================================
  {
    id: "${slug}",
    title: "${escapeQuotes(titleTamil)}",
    titleEnglish: "${escapeQuotes(titleEnglish)}",
    artist: "${escapeQuotes(artist)}",
    language: "Tamil",
    lyrics: {
      tamil: [
${tamilLines.map(l => `        { line: ${l.line}, text: "${escapeQuotes(l.text)}" }`).join(',\n')}
      ],
      transliteration: [
${translitLines.map(l => `        { line: ${l.line}, text: "${escapeQuotes(l.text)}" }`).join(',\n')}
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
    createdAt: "${today}",
    updatedAt: "${today}"
  },`;

    setGeneratedCode(code);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearForm = () => {
    setTitleEnglish('');
    setTitleTamil('');
    setArtist('');
    setTamilLyrics('');
    setTransliteration('');
    setGeneratedCode('');
    setErrors([]);
  };

  const slug = titleEnglish
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  const tamilLineCount = parseLyrics(tamilLyrics).length;
  const translitLineCount = parseLyrics(transliteration).length;

  return (
    <AdminAuth title="Song Entry Tool">
      <div className="py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h1 className="text-3xl font-bold mb-2">🎵 Song Entry Tool</h1>
            <p className="text-gray-600 mb-6">Quickly generate song code for data/songs.js</p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: Input Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">English Title *</label>
                  <input
                    type="text"
                    value={titleEnglish}
                    onChange={(e) => setTitleEnglish(e.target.value)}
                    className="w-full px-4 py-2 border-2 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
                    placeholder="The Lord is My Shepherd"
                  />
                  {titleEnglish && (
                    <p className="text-xs text-gray-500 mt-1">
                      ID: <code className="bg-gray-100 px-1 rounded">{slug}</code>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Tamil Title *</label>
                  <input
                    type="text"
                    value={titleTamil}
                    onChange={(e) => setTitleTamil(e.target.value)}
                    className="w-full px-4 py-2 border-2 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
                    placeholder="கர்த்தர் என் மேய்ப்பர்"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Artist (Optional)</label>
                  <input
                    type="text"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    className="w-full px-4 py-2 border-2 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
                    placeholder="Traditional / Unknown"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    Tamil Lyrics * <span className="text-gray-400 font-normal">(one line per row)</span>
                  </label>
                  <textarea
                    value={tamilLyrics}
                    onChange={(e) => setTamilLyrics(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-2 border-2 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
                    placeholder="கர்த்தர் என் மேய்ப்பர்&#10;எனக்கு குறைவு இல்லை&#10;புல்லுள்ள இடங்களில்&#10;என்னைப் படுக்கச் செய்வார்"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Lines: {tamilLineCount}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    Transliteration * <span className="text-gray-400 font-normal">(one line per row)</span>
                  </label>
                  <textarea
                    value={transliteration}
                    onChange={(e) => setTransliteration(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-2 border-2 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
                    placeholder="Karthar en meypar&#10;Enakku kuraivu illai&#10;Pullulla idangalil&#10;Ennai padukka seivaar"
                  />
                  <p className={`text-xs mt-1 ${tamilLineCount !== translitLineCount && tamilLineCount > 0 && translitLineCount > 0 ? 'text-red-500 font-semibold' : 'text-gray-500'}`}>
                    Lines: {translitLineCount}
                    {tamilLineCount !== translitLineCount && tamilLineCount > 0 && translitLineCount > 0 && (
                      <span> ⚠️ Must match Tamil lines ({tamilLineCount})</span>
                    )}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={generateCode}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                  >
                    ➕ Generate Code
                  </button>
                  <button
                    onClick={clearForm}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-3 rounded-lg font-semibold"
                  >
                    🗑️
                  </button>
                </div>

                {/* Errors */}
                {errors.length > 0 && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-700 font-semibold mb-2">
                      ⚠️ Validation Errors
                    </div>
                    <ul className="text-sm text-red-600 space-y-1">
                      {errors.map((err, i) => (
                        <li key={i}>• {err}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Right: Generated Code */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">Generated Code</label>
                  {generatedCode && (
                    <button
                      onClick={copyToClipboard}
                      className={`flex items-center gap-1 px-3 py-1 rounded text-sm font-semibold transition ${
                        copied 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {copied ? '✓ Copied!' : '📋 Copy'}
                    </button>
                  )}
                </div>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto text-xs h-[600px]">
                  {generatedCode || '// Generated code will appear here...\n// Fill in the form and click "Generate Code"'}
                </pre>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-blue-900 mb-3">📝 How to Add Songs</h3>
            <ol className="space-y-2 text-blue-800">
              <li><strong>1.</strong> Fill in the form above</li>
              <li><strong>2.</strong> Click "Generate Code"</li>
              <li><strong>3.</strong> Click "Copy" to copy the generated code</li>
              <li><strong>4.</strong> Open <code className="bg-blue-100 px-1 rounded">data/songs.js</code></li>
              <li><strong>5.</strong> Paste the code inside the <code className="bg-blue-100 px-1 rounded">songs</code> array (before the closing <code>]</code>)</li>
              <li><strong>6.</strong> Save and test!</li>
            </ol>
          </div>
        </div>
      </div>
    </AdminAuth>
  );
}