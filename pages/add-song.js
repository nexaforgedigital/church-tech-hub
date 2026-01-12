import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Plus, Save, Music, Upload, Download, CheckCircle } from 'lucide-react';
import { songStorage } from '../utils/songStorage';
import { useRouter } from 'next/router';

// Cross Pattern Component
const CrossPattern = ({ opacity = 0.02 }) => (
  <div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <pattern id="cross-pattern-add" x="0" y="0" width="80" height="100" patternUnits="userSpaceOnUse">
        <rect x="36" y="10" width="8" height="80" rx="1" fill="white"/>
        <rect x="24" y="25" width="32" height="8" rx="1" fill="white"/>
      </pattern>
      <rect width="100%" height="100%" fill="url(#cross-pattern-add)"/>
    </svg>
  </div>
);

export default function AddSong() {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    const processedLyrics = {
      tamil: formData.lyrics.tamil.split('\n').filter(l => l.trim()).map((text, i) => ({ line: i + 1, text })),
      english: formData.lyrics.english.split('\n').filter(l => l.trim()).map((text, i) => ({ line: i + 1, text })),
      transliteration: formData.lyrics.transliteration.split('\n').filter(l => l.trim()).map((text, i) => ({ line: i + 1, text }))
    };

    const newSong = {
      ...formData,
      lyrics: processedLyrics
    };

    songStorage.addSong(newSong);
    
    setSuccess(true);
    setSaving(false);
    
    setTimeout(() => {
      router.push('/lyrics');
    }, 1500);
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        await songStorage.importSongs(file);
        alert('Songs imported successfully!');
        router.push('/lyrics');
      } catch (error) {
        alert('Error importing songs. Please check the file format.');
      }
    }
  };

  return (
    <>
      <Head>
        <title>Add Custom Song - ChurchAssist</title>
        <meta name="description" content="Add your own songs to the ChurchAssist library." />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
        {/* Hero Section */}
        <section className="relative py-12 overflow-hidden">
          <CrossPattern opacity={0.02} />
          
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl mb-6 shadow-lg shadow-emerald-500/30">
                <Plus size={32} className="text-white" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black mb-4 text-white">
                Add <span className="text-amber-400">Custom Song</span>
              </h1>
              <p className="text-lg text-gray-400">
                Add your own songs to the library for use in worship services
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-6">
              
              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold mb-4 text-white">Quick Actions</h3>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 px-5 py-3 rounded-xl cursor-pointer transition font-semibold">
                    <Upload size={18} />
                    Import Songs (JSON)
                    <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                  </label>
                  <button
                    onClick={() => songStorage.exportSongs()}
                    className="flex items-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 px-5 py-3 rounded-xl transition font-semibold"
                  >
                    <Download size={18} />
                    Export All Songs
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur rounded-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                  <Music size={24} className="text-amber-400" />
                  Song Details
                </h2>

                {/* Basic Info */}
                <div className="grid md:grid-cols-2 gap-5 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Song Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-white placeholder-gray-500 transition-all"
                      placeholder="Amazing Grace"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Artist/Composer</label>
                    <input
                      type="text"
                      value={formData.artist}
                      onChange={(e) => setFormData({...formData, artist: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-white placeholder-gray-500 transition-all"
                      placeholder="John Newton"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Language *</label>
                    <select
                      required
                      value={formData.language}
                      onChange={(e) => setFormData({...formData, language: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-amber-500/50 focus:outline-none text-white cursor-pointer"
                    >
                      <option value="Tamil" className="bg-slate-900">Tamil</option>
                      <option value="English" className="bg-slate-900">English</option>
                      <option value="Bilingual" className="bg-slate-900">Bilingual</option>
                      <option value="Hindi" className="bg-slate-900">Hindi</option>
                      <option value="Malayalam" className="bg-slate-900">Malayalam</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Category *</label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-amber-500/50 focus:outline-none text-white cursor-pointer"
                    >
                      <option value="Worship" className="bg-slate-900">Worship</option>
                      <option value="Praise" className="bg-slate-900">Praise</option>
                      <option value="Gospel" className="bg-slate-900">Gospel</option>
                      <option value="Christmas" className="bg-slate-900">Christmas</option>
                      <option value="Easter" className="bg-slate-900">Easter</option>
                      <option value="Prayer" className="bg-slate-900">Prayer</option>
                    </select>
                  </div>
                </div>

                {/* Lyrics Section */}
                <div className="border-t border-white/10 pt-6 mb-6">
                  <h3 className="text-xl font-bold mb-2 text-white">Lyrics</h3>
                  <p className="text-sm text-gray-400 mb-4">Enter lyrics line by line. At least one language is required.</p>

                  <div className="grid md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Tamil (தமிழ்)
                      </label>
                      <textarea
                        value={formData.lyrics.tamil}
                        onChange={(e) => setFormData({
                          ...formData,
                          lyrics: {...formData.lyrics, tamil: e.target.value}
                        })}
                        rows="10"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-white placeholder-gray-500 transition-all resize-none"
                        placeholder="கர்த்தர் என் மேய்ப்பர்&#10;எனக்கு குறைவு இல்லை"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Transliteration
                      </label>
                      <textarea
                        value={formData.lyrics.transliteration}
                        onChange={(e) => setFormData({
                          ...formData,
                          lyrics: {...formData.lyrics, transliteration: e.target.value}
                        })}
                        rows="10"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-white placeholder-gray-500 transition-all resize-none"
                        placeholder="Karththar en meypar&#10;Enakku kuraivu illai"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        English
                      </label>
                      <textarea
                        value={formData.lyrics.english}
                        onChange={(e) => setFormData({
                          ...formData,
                          lyrics: {...formData.lyrics, english: e.target.value}
                        })}
                        rows="10"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-white placeholder-gray-500 transition-all resize-none"
                        placeholder="The Lord is my shepherd&#10;I shall not want"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={saving || !formData.title || (!formData.lyrics.tamil && !formData.lyrics.english && !formData.lyrics.transliteration)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-amber-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-900"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={22} />
                      Save Song
                    </>
                  )}
                </button>

                {success && (
                  <div className="mt-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl flex items-center justify-center gap-2 animate-fade-in">
                    <CheckCircle size={20} />
                    <span className="font-semibold">Song saved successfully! Redirecting...</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}