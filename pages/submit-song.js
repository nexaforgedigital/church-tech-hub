import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Send, Music, CheckCircle } from 'lucide-react';

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
    formDataToSend.append("access_key", "YOUR_WEB3FORMS_ACCESS_KEY_HERE");
    formDataToSend.append("subject", "New Song Submission for ChurchAssist");
    
    // Add all form fields
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <Link href="/lyrics" className="text-white hover:underline mb-4 inline-block flex items-center gap-2">
            <ChevronLeft size={20} />
            Back to Library
          </Link>
          <div className="flex items-center gap-4">
            <Music size={48} />
            <div>
              <h1 className="text-5xl font-bold mb-2">Submit Song Request</h1>
              <p className="text-xl opacity-90">Request a song to be added to the main library</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Info Banner */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-blue-900 mb-2">📝 Song Submission Guidelines</h3>
            <ul className="text-blue-800 space-y-2">
              <li>• This form submits songs for review and addition to the main database</li>
              <li>• For immediate use, use <Link href="/add-song" className="underline font-semibold">Add Custom Song</Link> instead</li>
              <li>• Include accurate lyrics and proper attribution</li>
              <li>• We'll review and add approved songs within 7 days</li>
            </ul>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-6">Song Details</h2>

            <div className="space-y-6">
              {/* Your Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              {/* Song Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Song Title *</label>
                  <input
                    type="text"
                    name="songTitle"
                    required
                    value={formData.songTitle}
                    onChange={(e) => setFormData({...formData, songTitle: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900"
                    placeholder="Amazing Grace"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Artist/Composer</label>
                  <input
                    type="text"
                    name="artist"
                    value={formData.artist}
                    onChange={(e) => setFormData({...formData, artist: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900"
                    placeholder="John Newton"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Language *</label>
                <select
                  name="language"
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Lyrics *</label>
                <textarea
                  name="lyrics"
                  required
                  rows="10"
                  value={formData.lyrics}
                  onChange={(e) => setFormData({...formData, lyrics: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900"
                  placeholder="Enter complete lyrics here (line by line)"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Notes</label>
                <textarea
                  name="notes"
                  rows="3"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900"
                  placeholder="Any additional information about the song..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="spinner w-5 h-5"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={24} />
                    Submit Song Request
                  </>
                )}
              </button>

              {result === 'success' && (
                <div className="bg-green-50 border-2 border-green-500 text-green-700 p-4 rounded-lg flex items-start gap-3 animate-fade-in">
                  <CheckCircle size={24} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block mb-1">Thank you for your submission!</strong>
                    <p className="text-sm">We'll review your song and add it to the library if approved. You'll receive an email confirmation at {formData.email}.</p>
                  </div>
                </div>
              )}

              {result === 'error' && (
                <div className="bg-red-50 border-2 border-red-500 text-red-700 p-4 rounded-lg text-center">
                  <strong>Oops! Something went wrong.</strong> Please try again or email us directly.
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}