import Link from 'next/link';
import { Heart, Mail, Github, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" opacity="0.8"/>
                <path d="M2 17L12 22L22 17V12L12 17L2 12V17Z"/>
              </svg>
              ChurchAssist
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Empowering worship teams with professional presentation tools, lyrics management, and technical resources.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <div className="space-y-2">
              <Link href="/lyrics" className="block text-gray-300 hover:text-white transition">Lyrics Library</Link>
              <Link href="/worship-planner" className="block text-gray-300 hover:text-white transition">Service Planner</Link>
              <Link href="/song-sheet" className="block text-gray-300 hover:text-white transition">Song Sheets</Link>
              <Link href="/tutorials" className="block text-gray-300 hover:text-white transition">Tutorials</Link>
            </div>
          </div>

          {/* Tools */}
          <div>
            <h4 className="font-bold mb-4">Tools</h4>
            <div className="space-y-2">
              <Link href="/downloads" className="block text-gray-300 hover:text-white transition">Software Downloads</Link>
              <Link href="/tips" className="block text-gray-300 hover:text-white transition">Tech Tips</Link>
              <Link href="/how-to-use" className="block text-gray-300 hover:text-white transition">How to Use</Link>
              <Link href="/contact" className="block text-gray-300 hover:text-white transition">Contact Support</Link>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-bold mb-4">Connect</h4>
            <p className="text-gray-300 mb-4">
              Join our community and stay updated with new features.
            </p>
            <div className="flex gap-3">
              <a href="mailto:support@churchassist.in" className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition">
                <Mail size={20} />
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition">
                <Github size={20} />
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition">
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-gray-400 text-sm">
            © 2024 ChurchAssist. Built with <Heart size={14} className="inline text-red-500" /> for worship teams worldwide.
          </div>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
            <Link href="/how-to-use" className="hover:text-white transition">Documentation</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}