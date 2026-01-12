// pages/admin/import-songs.js
// CSV Import Tool for Bulk Song Addition

import { useState, useRef } from 'react';
import { Upload, Check, AlertCircle, Download, Copy, Trash2, FileSpreadsheet, HelpCircle } from 'lucide-react';
import AdminAuth from '../../components/AdminAuth';

// Helper: Generate slug from text
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

export default function ImportSongs() {
  const [parsedSongs, setParsedSongs] = useState([]);
  const [errors, setErrors] = useState([]);
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const fileInputRef = useRef(null);

  // Parse CSV file
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  // Parse CSV content
  const parseCSV = (csvText) => {
    const lines = csvText.split('\n').map(line => line.trim()).filter(line => line);
    
    if (lines.length < 2) {
      setErrors(['CSV file must have at least a header row and one data row']);
      return;
    }

    // Parse header
    const header = parseCSVLine(lines[0]).map(h => h.toLowerCase().trim());
    
    // Expected columns
    const expectedColumns = ['english_title', 'tamil_title', 'artist', 'tamil_lyrics', 'transliteration'];
    const missingColumns = expectedColumns.filter(col => !header.includes(col));
    
    if (missingColumns.length > 0) {
      setErrors([`Missing required columns: ${missingColumns.join(', ')}`]);
      return;
    }

    // Get column indices
    const colIndex = {
      englishTitle: header.indexOf('english_title'),
      tamilTitle: header.indexOf('tamil_title'),
      artist: header.indexOf('artist'),
      tamilLyrics: header.indexOf('tamil_lyrics'),
      transliteration: header.indexOf('transliteration')
    };

    // Parse data rows
    const songs = [];
    const parseErrors = [];

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = parseCSVLine(lines[i]);
        
        if (values.length < expectedColumns.length) {
          parseErrors.push(`Row ${i + 1}: Not enough columns`);
          continue;
        }

        const englishTitle = values[colIndex.englishTitle]?.trim() || '';
        const tamilTitle = values[colIndex.tamilTitle]?.trim() || '';
        const artist = values[colIndex.artist]?.trim() || '';
        const tamilLyrics = values[colIndex.tamilLyrics]?.trim() || '';
        const transliteration = values[colIndex.transliteration]?.trim() || '';

        if (!englishTitle || !tamilTitle) {
          parseErrors.push(`Row ${i + 1}: Missing title`);
          continue;
        }

        // Parse lyrics (separated by | or newline)
        const tamilLines = tamilLyrics.split(/[|\n]/).map(l => l.trim()).filter(l => l);
        const translitLines = transliteration.split(/[|\n]/).map(l => l.trim()).filter(l => l);

        if (tamilLines.length === 0) {
          parseErrors.push(`Row ${i + 1}: No Tamil lyrics`);
          continue;
        }

        if (translitLines.length === 0) {
          parseErrors.push(`Row ${i + 1}: No transliteration`);
          continue;
        }

        if (tamilLines.length !== translitLines.length) {
          parseErrors.push(`Row ${i + 1}: Line count mismatch (Tamil: ${tamilLines.length}, Translit: ${translitLines.length})`);
          continue;
        }

        songs.push({
          id: generateSlug(englishTitle),
          titleEnglish: englishTitle,
          title: tamilTitle,
          artist: artist,
          tamilLines,
          translitLines,
          rowNumber: i + 1
        });

      } catch (err) {
        parseErrors.push(`Row ${i + 1}: Parse error - ${err.message}`);
      }
    }

    setParsedSongs(songs);
    setErrors(parseErrors);
    
    if (songs.length > 0) {
      generateBulkCode(songs);
    }
  };

  // Parse a single CSV line (handling quoted values)
  const parseCSVLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result.map(v => v.replace(/^"|"$/g, '').trim());
  };

  // Escape quotes in strings
  const escapeQuotes = (str) => {
    return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
  };

  // Generate JavaScript code for all songs
  const generateBulkCode = (songs) => {
    const today = new Date().toISOString().split('T')[0];
    
    const codeBlocks = songs.map(song => {
      const tamilLyricsCode = song.tamilLines
        .map((text, i) => `        { line: ${i + 1}, text: "${escapeQuotes(text)}" }`)
        .join(',\n');
      
      const translitCode = song.translitLines
        .map((text, i) => `        { line: ${i + 1}, text: "${escapeQuotes(text)}" }`)
        .join(',\n');

      return `  // ========================================
  // SONG: ${song.titleEnglish.toUpperCase()}
  // ========================================
  {
    id: "${song.id}",
    title: "${escapeQuotes(song.title)}",
    titleEnglish: "${escapeQuotes(song.titleEnglish)}",
    artist: "${escapeQuotes(song.artist)}",
    language: "Tamil",
    lyrics: {
      tamil: [
${tamilLyricsCode}
      ],
      transliteration: [
${translitCode}
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
  }`;
    });

    setGeneratedCode(codeBlocks.join(',\n\n'));
  };

  // Copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download sample CSV
  const downloadSampleCSV = () => {
    const sampleCSV = `english_title,tamil_title,artist,tamil_lyrics,transliteration
"The Lord is My Shepherd","கர்த்தர் என் மேய்ப்பர்","Traditional","கர்த்தர் என் மேய்ப்பர்|எனக்கு குறைவு இல்லை|புல்லுள்ள இடங்களில்|என்னைப் படுக்கச் செய்வார்","Karthar en meypar|Enakku kuraivu illai|Pullulla idangalil|Ennai padukka seivaar"
"Amazing Grace","அற்புதமான கிருபை","John Newton","அற்புதமான கிருபை|எவ்வளவு இனிமையான ஒலி|என்னைப் போன்ற பாவியை|இரட்சித்தது","Arputhamaana kirupai|Evvalavu inimaiyaana oli|Ennai pondra paaviyai|Iratchithathu"
"How Great Thou Art","எவ்வளவு பெரியவர் நீர்","Carl Boberg","என் ஆத்துமாவே|என் இரட்சகரான தேவனைப் பாடு|நீர் எவ்வளவு பெரியவர்","En aathtumaavae|En iratchagaraan daevanai paadu|Neer evvalavu periyavar"`;

    const blob = new Blob([sampleCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'churchassist-songs-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Clear all
  const clearAll = () => {
    setParsedSongs([]);
    setErrors([]);
    setGeneratedCode('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <AdminAuth title="CSV Import Tool">
      <div className="py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-xl">
                  <FileSpreadsheet size={32} className="text-green-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">CSV Import Tool</h1>
                  <p className="text-gray-600">Import multiple songs from CSV/Excel file</p>
                </div>
              </div>
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg font-semibold transition"
              >
                <HelpCircle size={20} />
                {showHelp ? 'Hide Help' : 'Show Help'}
              </button>
            </div>

            {/* Help Section */}
            {showHelp && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-blue-900 mb-4 text-lg">📝 CSV Format Requirements</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="font-semibold text-blue-800 mb-2">Required Columns:</p>
                    <ul className="space-y-2 text-blue-700">
                      <li className="flex items-start gap-2">
                        <code className="bg-blue-100 px-2 py-0.5 rounded text-sm">english_title</code>
                        <span className="text-sm">- Song title in English (for search)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <code className="bg-blue-100 px-2 py-0.5 rounded text-sm">tamil_title</code>
                        <span className="text-sm">- Song title in Tamil script</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <code className="bg-blue-100 px-2 py-0.5 rounded text-sm">artist</code>
                        <span className="text-sm">- Artist name (can be empty)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <code className="bg-blue-100 px-2 py-0.5 rounded text-sm">tamil_lyrics</code>
                        <span className="text-sm">- Tamil lyrics (use | to separate lines)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <code className="bg-blue-100 px-2 py-0.5 rounded text-sm">transliteration</code>
                        <span className="text-sm">- Transliteration (use | to separate lines)</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-800 mb-2">Important Notes:</p>
                    <ul className="space-y-2 text-sm text-blue-700">
                      <li>• Separate each lyric line with <code className="bg-blue-100 px-1 rounded">|</code> (pipe character)</li>
                      <li>• Tamil and transliteration must have the <strong>same number of lines</strong></li>
                      <li>• Wrap values with quotes if they contain commas</li>
                      <li>• Save Excel files as CSV (UTF-8) for Tamil text</li>
                    </ul>
                    <button
                      onClick={downloadSampleCSV}
                      className="mt-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                    >
                      <Download size={16} />
                      Download Sample CSV
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* File Upload */}
            <div className="flex items-center gap-4">
              <label className="flex-1 cursor-pointer">
                <div className="border-3 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition">
                  <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-lg font-semibold text-gray-700">Click to upload CSV file</p>
                  <p className="text-sm text-gray-500 mt-1">or drag and drop • .csv files only</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              
              {(parsedSongs.length > 0 || errors.length > 0) && (
                <button
                  onClick={clearAll}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-4 rounded-xl transition"
                  title="Clear All"
                >
                  <Trash2 size={24} />
                </button>
              )}
            </div>
          </div>

          {/* Results */}
          {(parsedSongs.length > 0 || errors.length > 0) && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left: Parsed Songs & Errors */}
              <div className="space-y-6">
                {/* Success Count */}
                {parsedSongs.length > 0 && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-green-500 text-white p-2 rounded-lg">
                        <Check size={24} />
                      </div>
                      <h3 className="font-bold text-green-900 text-xl">
                        Successfully Parsed: {parsedSongs.length} songs
                      </h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto space-y-2">
                      {parsedSongs.map((song, i) => (
                        <div key={i} className="bg-white p-4 rounded-lg border border-green-200">
                          <div className="font-semibold text-gray-900">{song.titleEnglish}</div>
                          <div className="text-gray-600">{song.title}</div>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            <span className="bg-gray-100 px-2 py-1 rounded">{song.tamilLines.length} lines</span>
                            <span>Row {song.rowNumber}</span>
                            {song.artist && <span>by {song.artist}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Errors */}
                {errors.length > 0 && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-red-500 text-white p-2 rounded-lg">
                        <AlertCircle size={24} />
                      </div>
                      <h3 className="font-bold text-red-900 text-xl">
                        Errors: {errors.length}
                      </h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {errors.map((error, i) => (
                        <div key={i} className="text-sm text-red-700 bg-white p-3 rounded-lg border border-red-200">
                          {error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Generated Code */}
              <div>
                <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-gray-900">Generated Code</h3>
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
                        {copied ? 'Copied!' : 'Copy All'}
                      </button>
                    )}
                  </div>
                  
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto text-xs h-[500px] font-mono">
                    {generatedCode || '// Upload a CSV file to generate code...\n// The generated JavaScript code will appear here.\n// Copy and paste it into data/songs.js'}
                  </pre>
                  
                  {generatedCode && (
                    <div className="mt-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">
                        <strong>📋 Next Step:</strong> Copy this code and paste it inside the{' '}
                        <code className="bg-yellow-100 px-1 rounded font-mono">songs</code> array in{' '}
                        <code className="bg-yellow-100 px-1 rounded font-mono">data/songs.js</code>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Excel/Google Sheets Instructions */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
            <h3 className="font-bold text-xl text-gray-900 mb-6">📗 Using Excel or Google Sheets</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Creating Your Spreadsheet:</h4>
                <ol className="space-y-3 text-gray-700">
                  <li className="flex gap-3">
                    <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">1</span>
                    <span>Create columns: <strong>english_title, tamil_title, artist, tamil_lyrics, transliteration</strong></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">2</span>
                    <span>For lyrics, use <code className="bg-gray-100 px-1 rounded">|</code> (pipe) to separate lines</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">3</span>
                    <span>Export/Download as <strong>CSV (UTF-8)</strong> for Tamil support</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">4</span>
                    <span>Upload the CSV file above</span>
                  </li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Example Row:</h4>
                <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                  <table className="text-sm w-full">
                    <thead>
                      <tr className="text-left text-gray-600">
                        <th className="pr-4 pb-2">english_title</th>
                        <th className="pr-4 pb-2">tamil_title</th>
                        <th className="pr-4 pb-2">artist</th>
                        <th className="pr-4 pb-2">tamil_lyrics</th>
                        <th className="pb-2">transliteration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="text-gray-900">
                        <td className="pr-4">The Lord is My Shepherd</td>
                        <td className="pr-4">கர்த்தர் என் மேய்ப்பர்</td>
                        <td className="pr-4">Traditional</td>
                        <td className="pr-4 text-xs">Line1|Line2|Line3</td>
                        <td className="text-xs">Line1|Line2|Line3</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  💡 <strong>Tip:</strong> You can prepare songs in batches and import multiple times.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminAuth>
  );
}