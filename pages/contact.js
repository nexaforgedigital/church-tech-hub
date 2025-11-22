import { useState } from 'react';
import Link from 'next/link';
import { Send, Mail, MessageSquare, Phone, CheckCircle, XCircle } from 'lucide-react';

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
    formData.append("replyto", event.target.email.value); // Allows you to reply directly
    formData.append("access_key", "cc44612f-a015-4816-a1bf-6ac467d44e58"); // Replace with your actual access key

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setResult("success");
        event.target.reset(); // Clear form
      } else {
        console.log("Error", data);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-white hover:underline mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-5xl font-bold mb-4">Get In Touch</h1>
          <p className="text-xl">We'd love to hear your feedback and suggestions</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>
              
              <form onSubmit={onSubmit} className="space-y-6">
                {/* Hidden field for subject line in email */}
                <input type="hidden" name="subject" value="New Contact Form Submission from ChurchAssist" />
                
                {/* Optional: Redirect after submission */}
                <input type="hidden" name="redirect" value="https://churchassist.in/thank-you" />

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition text-gray-900"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition text-gray-900"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    name="topic"
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition text-gray-900 bg-white"
                  >
                    <option value="">Select a topic</option>
                    <option value="Song/Lyrics Request">Song/Lyrics Request</option>
                    <option value="Bug Report">Report a Bug</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Tutorial Request">Tutorial Request</option>
                    <option value="General Feedback">General Feedback</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows="6"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition resize-none text-gray-900"
                    placeholder="Tell us more about your request or feedback..."
                  />
                </div>

                {/* Honeypot field for spam protection */}
                <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
                  <div className="bg-green-50 border-2 border-green-500 text-green-700 p-4 rounded-lg flex items-start gap-3 animate-fade-in">
                    <CheckCircle size={24} className="flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block mb-1">Thank you!</strong>
                      <p className="text-sm">Your message has been sent successfully. We'll get back to you within 24-48 hours at the email address you provided.</p>
                    </div>
                  </div>
                )}

                {result === 'error' && (
                  <div className="bg-red-50 border-2 border-red-500 text-red-700 p-4 rounded-lg flex items-start gap-3 animate-fade-in">
                    <XCircle size={24} className="flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block mb-1">Oops! Something went wrong.</strong>
                      <p className="text-sm">Please try again or email us directly at <a href="mailto:contact@churchassist.in" className="underline font-semibold">contact@churchassist.in</a></p>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                      <Mail className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Email</h3>
                      <a href="mailto:contact@churchassist.in" className="text-blue-600 hover:underline">
                        contact@churchassist.in
                      </a>
                      <p className="text-sm text-gray-500 mt-1">We respond within 24-48 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-purple-100 p-3 rounded-lg flex-shrink-0">
                      <MessageSquare className="text-purple-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Feedback</h3>
                      <p className="text-gray-600">We value your suggestions and ideas for improving ChurchAssist</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-3 rounded-lg flex-shrink-0">
                      <Phone className="text-green-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Support Hours</h3>
                      <p className="text-gray-600">Monday - Saturday<br />9:00 AM - 6:00 PM IST</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Need Immediate Help?</h3>
                <p className="mb-6">Check out our comprehensive guides and tutorials for quick answers</p>
                <div className="space-y-3">
                  <Link href="/how-to-use" className="block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold text-center hover:bg-gray-100 transition">
                    📖 How to Use Guide
                  </Link>
                  <Link href="/tutorials" className="block bg-white/20 text-white px-6 py-3 rounded-lg font-semibold text-center hover:bg-white/30 transition">
                    🎥 Video Tutorials
                  </Link>
                  <Link href="/tips" className="block bg-white/20 text-white px-6 py-3 rounded-lg font-semibold text-center hover:bg-white/30 transition">
                    💡 Tech Tips
                  </Link>
                </div>
              </div>

              {/* FAQ Teaser */}
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-2 text-yellow-900">💬 Common Questions</h3>
                <ul className="space-y-2 text-sm text-yellow-800">
                  <li>• How do I add songs to my service?</li>
                  <li>• Can I use this on mobile devices?</li>
                  <li>• How do I download PowerPoint slides?</li>
                  <li>• Is there a limit on service items?</li>
                </ul>
                <Link href="/how-to-use" className="text-yellow-900 font-semibold hover:underline text-sm mt-3 inline-block">
                  Find answers in our guide →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}