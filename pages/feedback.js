import { useState } from 'react';
import Head from 'next/head';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function Feedback() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'feedback',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: 'YOUR_WEB3FORMS_KEY', // Get from web3forms.com
          subject: `[ChurchAssist] ${formData.type}: ${formData.name}`,
          from_name: formData.name,
          email: formData.email,
          message: formData.message,
          type: formData.type
        }),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', type: 'feedback', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <>
      <Head>
        <title>Feedback | ChurchAssist</title>
      </Head>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Navigation />

        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Send Feedback
            </h1>
            <p className="text-gray-600 text-center mb-8">
              Help us improve ChurchAssist with your feedback, bug reports, or feature requests.
            </p>

            {status === 'success' ? (
              <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-8 text-center">
                <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
                <h2 className="text-2xl font-bold text-green-800 mb-2">Thank You!</h2>
                <p className="text-green-700">Your feedback has been submitted successfully.</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    >
                      <option value="feedback">💬 General Feedback</option>
                      <option value="bug">🐛 Bug Report</option>
                      <option value="feature">✨ Feature Request</option>
                      <option value="song">🎵 Song Request</option>
                      <option value="other">📝 Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                    <textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
                      placeholder="Tell us what's on your mind..."
                    />
                  </div>

                  {status === 'error' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                      <AlertCircle className="text-red-500" size={20} />
                      <span className="text-red-700">Failed to send. Please try again.</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {status === 'loading' ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Send Feedback
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}