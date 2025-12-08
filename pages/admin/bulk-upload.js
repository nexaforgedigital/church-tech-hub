import { useState } from 'react';
import { Upload, FileJson, Database } from 'lucide-react';

export default function BulkUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const handleAuth = () => {
    // Simple password check (replace with your secure method)
    if (password === 'your-admin-password-here') {
      setAuthenticated(true);
    } else {
      alert('Wrong password!');
    }
  };

  const handleJSONUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const songs = JSON.parse(event.target.result);
        
        // Validate format
        if (!Array.isArray(songs)) {
          throw new Error('JSON must be an array of songs');
        }

        // Upload to your database
        for (let i = 0; i < songs.length; i++) {
          const song = songs[i];
          
          // POST to your API
          await fetch('/api/songs/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(song)
          });

          setProgress(Math.round(((i + 1) / songs.length) * 100));
        }

        alert(`✅ Successfully uploaded ${songs.length} songs!`);
        setProgress(0);
      } catch (error) {
        alert('Error: ' + error.message);
      } finally {
        setUploading(false);
      }
    };

    reader.readAsText(file);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold mb-6 text-center">Admin Access</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
            placeholder="Enter admin password"
            className="w-full px-4 py-3 border-2 rounded-lg mb-4"
          />
          <button
            onClick={handleAuth}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Bulk Song Upload</h1>

        {/* JSON Upload */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <FileJson size={48} className="text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold">Upload JSON File</h2>
              <p className="text-gray-600">Upload songs from JSON format</p>
            </div>
          </div>

          <input
            type="file"
            accept=".json"
            onChange={handleJSONUpload}
            disabled={uploading}
            className="mb-4"
          />

          {uploading && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Expected JSON Format */}
        <div className="bg-gray-900 text-green-400 rounded-2xl p-6 font-mono text-sm">
          <div className="mb-2 text-gray-400">// Expected JSON format:</div>
          <pre>{`[
  {
    "title": "Song Title",
    "artist": "Artist Name",
    "language": "tamil",
    "category": "worship",
    "lyrics": {
      "tamil": [
        { "text": "தமிழ் வரி 1" },
        { "text": "தமிழ் வரி 2" }
      ],
      "transliteration": [
        { "text": "Tamil vari 1" },
        { "text": "Tamil vari 2" }
      ],
      "english": [
        { "text": "Tamil line 1" },
        { "text": "Tamil line 2" }
      ]
    }
  }
]`}</pre>
        </div>
      </div>
    </div>
  );
}