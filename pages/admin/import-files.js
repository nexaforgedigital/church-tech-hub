// pages/admin/import-files.js
// Import songs from TXT files

import { useState, useRef } from 'react';
import { FileText, Upload, Check, AlertCircle, Trash2, Download } from 'lucide-react';
import AdminAuth from '../../components/AdminAuth';
import { processSong } from '../../utils/tamilTransliterator';

export default function ImportFiles() {
  const [files, setFiles] = useState([]);
  const [processedSongs, setProcessedSongs] = useState([]);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const uploadedFiles = Array.from(e.target.files);
    setFiles(uploadedFiles);
    
    const songs = [];
    const errs = [];

    for (const file of uploadedFiles) {
      try {
        const text = await readFileAsText(file);
        const song = processSong(text);
        
        if (song) {
          // Use filename as title hint
          const filenameTitle = file.name
            .replace(/\.(txt|doc|docx)$/i, '')
            .replace(/[-_]/g, ' ');
          
          if (!song.titleEnglish) {
            song.titleEnglish = filenameTitle;
            song.id = filenameTitle.toLowerCase().replace(/\s+/g, '-');
          }
          
          songs.push({
            ...song,
            sourceFile: file.name,
            status: 'success'
          });
        } else {
          errs.push(`${file.name}: Could not parse content`);
        }
      } catch (error) {
        errs.push(`${file.name}: ${error.message}`);
      }
    }

    setProcessedSongs(songs);
    setErrors(errs);
  };

  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const removeSong = (index) => {
    setProcessedSongs(processedSongs.filter((_, i) => i !== index));
  };

  const generateAllCode = () => {
    const code = processedSongs.map(song => {
      const { sourceFile, status, ...cleanSong } = song;
      return `  {
    id: "${cleanSong.id}",
    title: "${cleanSong.title}",
    titleEnglish: "${cleanSong.titleEnglish}",
    artist: "${cleanSong.artist || ''}",
    language: "Tamil",
    lyrics: {
      tamil: [
${cleanSong.lyrics.tamil.map(l => `        { line: ${l.line}, text: "${l.text.replace(/"/g, '\\"')}" }`).join(',\n')}
      ],
      transliteration: [
${cleanSong.lyrics.transliteration.map(l => `        { line: ${l.line}, text: "${l.text.replace(/"/g, '\\"')}" }`).join(',\n')}
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
    createdAt: "${cleanSong.createdAt}",
    updatedAt: "${cleanSong.updatedAt}"
  }`;
    }).join(',\n\n');

    navigator.clipboard.writeText(code);
    alert(`${processedSongs.length} songs copied to clipboard!`);
  };

  const clearAll = () => {
    setFiles([]);
    setProcessedSongs([]);
    setErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <AdminAuth title="Import Files">
      <div className="py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-8 mb-8 text-white">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-4 rounded-xl">
                <FileText size={40} />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Import from Files</h1>
                <p className="text-cyan-100 mt-1">
                  Import songs from TXT files (one song per file)
                </p>
              </div>
            </div>
          </div>

          {/* Upload Area */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-semibold text-gray-700">
                Click to upload TXT files
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Each file should contain Tamil lyrics (one song per file)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.text"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {files.length > 0 && (
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {files.length} file(s) uploaded
                </span>
                <button
                  onClick={clearAll}
                  className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                >
                  <Trash2 size={14} />
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-8">
              <div className="flex items-center gap-2 text-red-700 font-semibold mb-3">
                <AlertCircle size={20} />
                Errors ({errors.length})
              </div>
              <ul className="space-y-1 text-sm text-red-600">
                {errors.map((err, i) => (
                  <li key={i}>• {err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Processed Songs */}
          {processedSongs.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-lg">
                  Processed Songs ({processedSongs.length})
                </h2>
                <button
                  onClick={generateAllCode}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
                >
                  <Download size={18} />
                  Copy All Code
                </button>
              </div>

              <div className="space-y-3">
                {processedSongs.map((song, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-green-50 rounded-xl border-2 border-green-200"
                  >
                    <div className="flex items-center gap-3">
                      <Check size={20} className="text-green-600" />
                      <div>
                        <div className="font-semibold">{song.titleEnglish}</div>
                        <div className="text-sm text-gray-600">{song.title}</div>
                        <div className="text-xs text-gray-500">
                          From: {song.sourceFile} • {song.lyrics.tamil.length} lines
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeSong(index)}
                      className="text-gray-400 hover:text-red-500 p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-cyan-50 rounded-xl p-6 mt-8 border-2 border-cyan-200">
            <h3 className="font-bold text-cyan-900 mb-3">📝 File Format</h3>
            <ul className="space-y-2 text-cyan-800 text-sm">
              <li>• Each TXT file should contain <strong>one song</strong></li>
              <li>• Tamil lyrics should be on separate lines</li>
              <li>• Filename will be used as English title (e.g., "amazing-grace.txt")</li>
              <li>• Auto-transliteration will be applied</li>
              <li>• Review and edit the output before adding to database</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminAuth>
  );
}