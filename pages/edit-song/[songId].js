import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Save, Music } from 'lucide-react';
import { songStorage } from '../../utils/songStorage';
import { useRouter } from 'next/router';

export default function EditSong({ songId }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    language: 'Tamil',
    category: 'Worship',
    lyrics: {
      tamil: '',
      english: '',
      transliteration: ''
    }
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSong();
  }, [songId]);

  const loadSong = () => {
    const customSongs = songStorage.getCustomSongs();
    const song = customSongs.find(s => s.id === songId);
    
    if (song) {
      // Convert array format to text format for editing
      setFormData({
        title: song.title,
        artist: song.artist || '',
        language: song.language,
        category: song.category,
        lyrics: {
          tamil: song.lyrics.tamil?.map(l => l.text).join('\n') || '',
          english: song.lyrics.english?.map(l => l.text).join('\n') || '',
          transliteration: song.lyrics.transliteration?.map(l => l.text).join('\n') || ''
        }
      });
      setLoading(false);
    } else {
      alert('Song not found or not a custom song');
      router.push('/lyrics');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    // Convert line-by-line text to array format
    const processedLyrics = {
      tamil: formData.lyrics.tamil.split('\n').filter(l => l.trim()).map((text, i) => ({ line: i + 1, text })),
      english: formData.lyrics.english.split('\n').filter(l => l.trim()).map((text, i) => ({ line: i + 1, text })),
      transliteration: formData.lyrics.transliteration.split('\n').filter(l => l.trim()).map((text, i) => ({ line: i + 1, text }))
    };

    const updatedSong = {
      ...formData,
      lyrics: processedLyrics
    };

    songStorage.updateSong(songId, updatedSong);
    
    setSuccess(true);
    setSaving(false);
    
    setTimeout(() => {
      router.push(`/lyrics/${songId}`);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <div className="text-2xl font-semibold text-gray-700">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <Link href={`/lyrics/${songId}`} className="text-white hover:underline mb-4 inline-block flex items-center gap-2">
            <ChevronLeft size={20} />
            Back to Song
          </Link>
          <div className="flex items-center gap-4">
            <Music size={48} />
            <div>
              <h1 className="text-5xl font-bold mb-2">Edit Custom Song</h1>
              <p className="text-xl opacity-90">Update your custom song details</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-6">Song Details</h2>

            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Song Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900"
                  placeholder="Amazing Grace"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Artist/Composer</label>
                <input
                  type="text"
                  value={formData.artist}
                  onChange={(e) => setFormData({...formData, artist: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900"
                  placeholder="John Newton"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Language *</label>
                <select
                  required
                  value={formData.language}
                  onChange={(e) => setFormData({...formData, language: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900 bg-white"
                >
                  <option value="Tamil">Tamil</option>
                  <option value="English">English</option>
                  <option value="Bilingual">Bilingual</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Malayalam">Malayalam</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900 bg-white"
                >
                  <option value="Worship">Worship</option>
                  <option value="Praise">Praise</option>
                  <option value="Gospel">Gospel</option>
                  <option value="Christmas">Christmas</option>
                  <option value="Easter">Easter</option>
                  <option value="Prayer">Prayer</option>
                </select>
              </div>
            </div>

            {/* Lyrics Section */}
            <div className="border-t-2 border-gray-200 pt-6 mb-6">
              <h3 className="text-2xl font-bold mb-4">Lyrics</h3>
              <p className="text-sm text-gray-600 mb-4">Enter lyrics line by line. At least one language is required.</p>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tamil (தமிழ்)
                  </label>
                  <textarea
                    value={formData.lyrics.tamil}
                    onChange={(e) => setFormData({
                      ...formData,
                      lyrics: {...formData.lyrics, tamil: e.target.value}
                    })}
                    rows="12"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900 font-sans"
                    placeholder="கர்த்தர் என் மேய்ப்பர்&#10;எனக்கு குறைவு இல்லை"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Transliteration
                  </label>
                  <textarea
                    value={formData.lyrics.transliteration}
                    onChange={(e) => setFormData({
                      ...formData,
                      lyrics: {...formData.lyrics, transliteration: e.target.value}
                    })}
                    rows="12"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900"
                    placeholder="Karththar en meypar&#10;Enakku kuraivu illai"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    English
                  </label>
                  <textarea
                    value={formData.lyrics.english}
                    onChange={(e) => setFormData({
                      ...formData,
                      lyrics: {...formData.lyrics, english: e.target.value}
                    })}
                    rows="12"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900"
                    placeholder="The Lord is my shepherd&#10;I shall not want"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving || !formData.title || (!formData.lyrics.tamil && !formData.lyrics.english && !formData.lyrics.transliteration)}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="spinner w-5 h-5"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={24} />
                    Save Changes
                  </>
                )}
              </button>
            </div>

            {success && (
              <div className="mt-4 bg-green-50 border-2 border-green-500 text-green-700 p-4 rounded-lg text-center font-semibold animate-fade-in">
                ✅ Song updated successfully! Redirecting...
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      songId: context.params.songId
    }
  };
}