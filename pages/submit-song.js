import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Send, Music, CheckCircle, XCircle, Sparkles } from 'lucide-react';

// Cross Pattern Component
const CrossPattern = ({ opacity = 0.02 }) => (
  <div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <pattern id="cross-pattern-submit" x="0" y="0" width="80" height="100" patternUnits="userSpaceOnUse">
        <rect x="36" y="10" width="8" height="80" rx="1" fill="white"/>
        <rect x="24" y="25" width="32" height="8" rx="1" fill="white"/>
      </pattern>
      <rect width="100%" height="100%" fill="url(#cross-pattern-submit)"/>
    </svg>
  </div>
);

export default function SubmitSong() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    songTitle: '',
    artist: '',
    language: 'Tamil',
    lyrics: '',
    notes: ''
  });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setResult('');

    const formDataToSend = new FormData();
    // ✅ FIXED: Using the correct API key
    formDataToSend.append("access_key", "cc44612f-a015-4816-a1bf-6ac467d44e58");
    formDataToSend.append("subject", "New Song Submission for ChurchAssist");
    
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formDataToSend
      });

      const data = await response.json();

      if (data.success) {
        setResult("success");
        setFormData({
          name: '',
          email: '',
          songTitle: '',
          artist: '',
          language: 'Tamil',
          lyrics: '',
          notes: ''
        });
      } else {
        setResult("error");
      }
    } catch (error) {
      setResult("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Submit Song Request - ChurchAssist</title>
        <meta name="description" content="Request a song to be added to the ChurchAssist library." />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
        {/* Hero Section */}
        <section className="relative py-12 overflow-hidden">
          <CrossPattern opacity={0.02} />
          
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mb-6 shadow-lg shadow-purple-500/30">
                <Music size={32} className="text-white" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black mb-4 text-white">
                Submit <span className="text-amber-400">Song Request</span>
              </h1>
              <p className="text-lg text-gray-400">
                Request a song to be added to the main library
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              
              {/* Info Banner */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5 mb-6">
                <h3 className="text-lg font-bold text-blue-400 mb-2 flex items-center gap-2">
                  <Sparkles size={18} />
                  Song Submission Guidelines
                </h3>
                <ul className="text-blue-300 text-sm space-y-1">
                  <li>• This form submits songs for review and addition to the main database</li>
                  <li>• For immediate use, use <Link href="/add-song" className="underline font-semibold text-amber-400 hover:text-amber-300">Add Custom Song</Link> instead</li>
                  <li>• Include accurate lyrics and proper attribution</li>
                  <li>• We'll review and add approved songs within 7 days</li>
                </ul>
              </div>

              {/* Form */}
              <form onSubmit={onSubmit} className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur rounded-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold mb-6 text-white">Song Details</h2>

                <div className="space-y-5">
                  {/* Your Details */}
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Your Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-amber-500/50 focus:outline-none text-white placeholder-gray-500"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Your Email *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-amber-500/50 focus:outline-none text-white placeholder-gray-500"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  {/* Song Details */}
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Song Title *</label>
                      <input
                        type="text"
                        name="songTitle"
                        required
                        value={formData.songTitle}
                        onChange={(e) => setFormData({...formData, songTitle: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-amber-500/50 focus:outline-none text-white placeholder-gray-500"
                        placeholder="Amazing Grace"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Artist/Composer</label>
                      <input
                        type="text"
                        name="artist"
                        value={formData.artist}
                        onChange={(e) => setFormData({...formData, artist: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-amber-500/50 focus:outline-none text-white placeholder-gray-500"
                        placeholder="John Newton"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Language *</label>
                    <select
                      name="language"
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
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Lyrics *</label>
                    <textarea
                      name="lyrics"
                      required
                      rows="8"
                      value={formData.lyrics}
                      onChange={(e) => setFormData({...formData, lyrics: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-amber-500/50 focus:outline-none text-white placeholder-gray-500 resize-none"
                      placeholder="Enter complete lyrics here (line by line)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Additional Notes</label>
                    <textarea
                      name="notes"
                      rows="3"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-amber-500/50 focus:outline-none text-white placeholder-gray-500 resize-none"
                      placeholder="Any additional information about the song..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-amber-500/30 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-900"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={22} />
                        Submit Song Request
                      </>
                    )}
                  </button>

                  {result === 'success' && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl flex items-start gap-3 animate-fade-in">
                      <CheckCircle size={24} className="flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="block mb-1">Thank you for your submission!</strong>
                        <p className="text-sm text-emerald-400/80">We'll review your song and add it to the library if approved. You'll receive an email confirmation.</p>
                      </div>
                    </div>
                  )}

                  {result === 'error' && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-start gap-3 animate-fade-in">
                      <XCircle size={24} className="flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="block mb-1">Oops! Something went wrong.</strong>
                        <p className="text-sm text-red-400/80">Please try again or email us directly at <a href="mailto:contact@churchassist.in" className="underline">contact@churchassist.in</a></p>
                      </div>
                    </div>
                  )}
                </div>
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