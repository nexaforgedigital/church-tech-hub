import { useState } from 'react';
import Link from 'next/link';
import { Send, Mail, MessageSquare, Phone, CheckCircle, XCircle, Clock, Sparkles } from 'lucide-react';
import Head from 'next/head';

// Cross Pattern Component
const CrossPattern = ({ opacity = 0.03 }) => (
  <div className={`absolute inset-0 pointer-events-none`} style={{ opacity }}>
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <pattern id="cross-pattern-contact" x="0" y="0" width="80" height="100" patternUnits="userSpaceOnUse">
        <rect x="36" y="10" width="8" height="80" rx="1" fill="white"/>
        <rect x="24" y="25" width="32" height="8" rx="1" fill="white"/>
      </pattern>
      <rect width="100%" height="100%" fill="url(#cross-pattern-contact)"/>
    </svg>
  </div>
);

export default function Contact() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setResult('');

    const formData = new FormData(event.target);
    formData.append("from_name", "ChurchAssist Contact Form");
    formData.append("template", "ChurchAssist");
    formData.append("replyto", event.target.email.value);
    formData.append("access_key", "cc44612f-a015-4816-a1bf-6ac467d44e58");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setResult("success");
        event.target.reset();
      } else {
        setResult("error");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setResult("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Contact Us - ChurchAssist</title>
        <meta name="description" content="Get in touch with ChurchAssist. We'd love to hear your feedback and suggestions." />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
        {/* Hero Section */}
        <section className="relative py-16 overflow-hidden">
          <CrossPattern opacity={0.02} />
          
          {/* Ambient Glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-2xl mb-6 shadow-lg shadow-amber-500/30">
                <Mail size={32} className="text-slate-900" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black mb-4 text-white">
                Get In <span className="text-amber-400">Touch</span>
              </h1>
              <p className="text-lg text-gray-400">
                We'd love to hear your feedback and suggestions
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8">
                
                {/* Contact Form */}
                <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur rounded-3xl p-8 border border-white/10">
                  <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                    <MessageSquare size={24} className="text-amber-400" />
                    Send us a Message
                  </h2>
                  
                  <form onSubmit={onSubmit} className="space-y-5">
                    <input type="hidden" name="subject" value="New Contact Form Submission from ChurchAssist" />

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-white placeholder-gray-500 transition-all"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-white placeholder-gray-500 transition-all"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Subject *
                      </label>
                      <select
                        name="topic"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-amber-500/50 focus:outline-none text-white transition-all cursor-pointer"
                      >
                        <option value="" className="bg-slate-900">Select a topic</option>
                        <option value="Song/Lyrics Request" className="bg-slate-900">Song/Lyrics Request</option>
                        <option value="Bug Report" className="bg-slate-900">Report a Bug</option>
                        <option value="Feature Request" className="bg-slate-900">Feature Request</option>
                        <option value="General Feedback" className="bg-slate-900">General Feedback</option>
                        <option value="Other" className="bg-slate-900">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Your Message *
                      </label>
                      <textarea
                        name="message"
                        required
                        rows="5"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-white placeholder-gray-500 transition-all resize-none"
                        placeholder="Tell us more about your request or feedback..."
                      />
                    </div>

                    {/* Honeypot */}
                    <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-900"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={20} />
                          Send Message
                        </>
                      )}
                    </button>

                    {result === 'success' && (
                      <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl flex items-start gap-3 animate-fade-in">
                        <CheckCircle size={24} className="flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="block mb-1">Thank you!</strong>
                          <p className="text-sm text-emerald-400/80">Your message has been sent successfully. We'll get back to you within 24-48 hours.</p>
                        </div>
                      </div>
                    )}

                    {result === 'error' && (
                      <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-start gap-3 animate-fade-in">
                        <XCircle size={24} className="flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="block mb-1">Oops! Something went wrong.</strong>
                          <p className="text-sm text-red-400/80">Please try again or email us directly at <a href="mailto:contact@churchassist.in" className="underline font-semibold">contact@churchassist.in</a></p>
                        </div>
                      </div>
                    )}
                  </form>
                </div>

                {/* Contact Info */}
                <div className="space-y-6">
                  {/* Info Card */}
                  <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur rounded-3xl p-8 border border-white/10">
                    <h2 className="text-2xl font-bold mb-6 text-white">Contact Information</h2>
                    
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-blue-500/20 p-3 rounded-xl text-blue-400 border border-blue-500/30">
                          <Mail size={24} />
                        </div>
                        <div>
                          <h3 className="font-bold text-white mb-1">Email</h3>
                          <a href="mailto:contact@churchassist.in" className="text-amber-400 hover:text-amber-300 transition">
                            contact@churchassist.in
                          </a>
                          <p className="text-sm text-gray-500 mt-1">We respond within 24-48 hours</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="bg-purple-500/20 p-3 rounded-xl text-purple-400 border border-purple-500/30">
                          <MessageSquare size={24} />
                        </div>
                        <div>
                          <h3 className="font-bold text-white mb-1">Feedback</h3>
                          <p className="text-gray-400">We value your suggestions and ideas for improving ChurchAssist</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="bg-emerald-500/20 p-3 rounded-xl text-emerald-400 border border-emerald-500/30">
                          <Clock size={24} />
                        </div>
                        <div>
                          <h3 className="font-bold text-white mb-1">Support Hours</h3>
                          <p className="text-gray-400">Monday - Saturday<br />9:00 AM - 6:00 PM IST</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Help Card */}
                  <div className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 rounded-3xl p-8 border border-amber-500/20">
                    <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                      <Sparkles size={20} className="text-amber-400" />
                      Need Immediate Help?
                    </h3>
                    <p className="text-gray-400 mb-6">Check out our comprehensive guides and tutorials for quick answers</p>
                    <div className="space-y-3">
                      <Link href="/how-to-use">
                        <button className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-amber-500/30 transition text-center">
                          📖 How to Use Guide
                        </button>
                      </Link>
                      <Link href="/tutorials">
                        <button className="w-full bg-white/10 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition text-center border border-white/10">
                          🎥 Video Tutorials
                        </button>
                      </Link>
                      <Link href="/tips">
                        <button className="w-full bg-white/10 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition text-center border border-white/10">
                          💡 Tech Tips
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
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