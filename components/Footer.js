import Link from 'next/link';
import { Heart, Mail, Instagram, Music, Calendar, FileText, BookOpen, Download, Lightbulb, Phone, HelpCircle, Send, Plus, ArrowUpRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

// Proper Christian Cross SVG Component
const ChristianCross = ({ size = 40, className = "" }) => (
  <svg width={size} height={size * 1.4} viewBox="0 0 40 56" fill="currentColor" className={className}>
    <rect x="16" y="0" width="8" height="56" rx="1"/>
    <rect x="4" y="14" width="32" height="8" rx="1"/>
  </svg>
);

// Floating Crosses Background
const FloatingCrosses = () => {
  const [crosses, setCrosses] = useState([]);

  useEffect(() => {
    const newCrosses = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 15 + Math.random() * 20,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 10,
      opacity: 0.02 + Math.random() * 0.03,
    }));
    setCrosses(newCrosses);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {crosses.map((cross) => (
        <div
          key={cross.id}
          className="absolute text-white animate-float-gentle"
          style={{
            left: `${cross.x}%`,
            top: `${cross.y}%`,
            opacity: cross.opacity,
            animationDuration: `${cross.duration}s`,
            animationDelay: `${cross.delay}s`,
          }}
        >
          <ChristianCross size={cross.size} />
        </div>
      ))}
    </div>
  );
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white overflow-hidden">
      {/* Proper Christian Cross Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <pattern id="footer-christian-cross" x="0" y="0" width="80" height="100" patternUnits="userSpaceOnUse">
            {/* Proper Christian Cross - taller vertical beam */}
            <rect x="36" y="10" width="8" height="80" rx="1" fill="white"/>
            <rect x="24" y="25" width="32" height="8" rx="1" fill="white"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#footer-christian-cross)"/>
        </svg>
      </div>

      {/* Floating Crosses */}
      <FloatingCrosses />

      {/* Ambient Light Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Top Decorative Border */}
        <div className="h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
        
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Brand Section */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative group">
                  {/* Glow Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                  
                  <div className="relative bg-white/10 backdrop-blur p-2 rounded-xl border border-amber-400/30">
                    <Image 
                      src="/logo.png" 
                      alt="ChurchAssist Logo" 
                      width={36} 
                      height={36}
                      className="object-contain"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">ChurchAssist</h3>
                  <p className="text-xs text-blue-300 flex items-center gap-1">
                    <Sparkles size={10} />
                    Worship Made Simple
                  </p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Professional worship presentation tools for churches. Plan, present, and worship with excellence.
              </p>
              
              {/* Social Links */}
              <div className="flex gap-2">
                <a 
                  href="mailto:contact@churchassist.in" 
                  className="group relative bg-white/5 hover:bg-white/10 p-2.5 rounded-lg transition-all duration-300 border border-white/10 hover:border-blue-400/50"
                  title="Email Us"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <Mail size={18} className="relative group-hover:text-blue-400 transition-colors duration-300" />
                </a>
                <a 
                  href="https://www.instagram.com/church_assist" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group relative bg-white/5 hover:bg-white/10 p-2.5 rounded-lg transition-all duration-300 border border-white/10 hover:border-pink-400/50"
                  title="Follow on Instagram"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <Instagram size={18} className="relative group-hover:text-pink-400 transition-colors duration-300" />
                </a>
              </div>
            </div>

            {/* Features Links */}
            <div>
              <h4 className="font-bold mb-4 text-amber-400 flex items-center gap-2">
                <Sparkles size={14} />
                Features
              </h4>
              <ul className="space-y-2.5 text-sm">
                {[
                  { href: '/lyrics', icon: <Music size={14} />, label: 'Lyrics Library', hoverColor: 'hover:text-blue-400' },
                  { href: '/worship-planner', icon: <Calendar size={14} />, label: 'Service Planner', hoverColor: 'hover:text-purple-400' },
                  { href: '/song-sheet', icon: <FileText size={14} />, label: 'Song Sheets', hoverColor: 'hover:text-emerald-400' },
                  { href: '/add-song', icon: <Plus size={14} />, label: 'Add Custom Songs', hoverColor: 'hover:text-cyan-400' },
                ].map((item, i) => (
                  <li key={i}>
                    <Link href={item.href} className={`flex items-center gap-2 text-gray-400 ${item.hoverColor} transition-all duration-300 group`}>
                      <span className="group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                      {item.label}
                      <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-auto" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h4 className="font-bold mb-4 text-amber-400 flex items-center gap-2">
                <BookOpen size={14} />
                Resources
              </h4>
              <ul className="space-y-2.5 text-sm">
                {[
                  { href: '/how-to-use', icon: <HelpCircle size={14} />, label: 'How to Use', hoverColor: 'hover:text-amber-400' },
                  { href: '/tutorials', icon: <BookOpen size={14} />, label: 'Tutorials', hoverColor: 'hover:text-orange-400' },
                  { href: '/downloads', icon: <Download size={14} />, label: 'Downloads', hoverColor: 'hover:text-cyan-400' },
                  { href: '/tips', icon: <Lightbulb size={14} />, label: 'Tech Tips', hoverColor: 'hover:text-yellow-400' },
                ].map((item, i) => (
                  <li key={i}>
                    <Link href={item.href} className={`flex items-center gap-2 text-gray-400 ${item.hoverColor} transition-all duration-300 group`}>
                      <span className="group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                      {item.label}
                      <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-auto" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="font-bold mb-4 text-amber-400 flex items-center gap-2">
                <Heart size={14} />
                Support
              </h4>
              <ul className="space-y-2.5 text-sm">
                {[
                  { href: '/contact', icon: <Phone size={14} />, label: 'Contact Us', hoverColor: 'hover:text-green-400' },
                  { href: '/submit-song', icon: <Send size={14} />, label: 'Submit a Song', hoverColor: 'hover:text-pink-400' },
                ].map((item, i) => (
                  <li key={i}>
                    <Link href={item.href} className={`flex items-center gap-2 text-gray-400 ${item.hoverColor} transition-all duration-300 group`}>
                      <span className="group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                      {item.label}
                      <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-auto" />
                    </Link>
                  </li>
                ))}
                <li>
                  <a href="mailto:contact@churchassist.in" className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-all duration-300 group">
                    <span className="group-hover:scale-110 transition-transform duration-300"><Mail size={14} /></span>
                    Email Support
                  </a>
                </li>
              </ul>

              {/* Mini CTA */}
              <div className="mt-6">
                <Link href="/worship-planner">
                  <button className="group relative w-full overflow-hidden">
                    {/* Animated Border */}
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 rounded-lg opacity-70 group-hover:opacity-100 blur-[0.5px] transition-all duration-300 animate-gradient-slow"></div>
                    
                    <div className="relative w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 py-2.5 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 group-hover:from-amber-400 group-hover:to-yellow-400 transition-all duration-300">
                      Start Planning
                      <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                    </div>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
              <p className="text-gray-400 flex items-center gap-1.5 flex-wrap justify-center">
                © {currentYear} ChurchAssist. Made with
                <Heart size={12} className="text-red-400 fill-red-400 animate-pulse" />
                by
                <a 
                  href="https://www.nexaforgedigital.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 font-semibold transition-colors duration-300 inline-flex items-center gap-0.5 group"
                >
                  NexaForgeDigital
                  <ArrowUpRight size={10} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                </a>
              </p>
              
              <div className="flex items-center gap-4 text-gray-400">
                <Link href="/privacy" className="hover:text-white transition-colors duration-300">Privacy</Link>
                <span className="text-white/20">•</span>
                <Link href="/terms" className="hover:text-white transition-colors duration-300">Terms</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Animations */}
      <style jsx global>{`
        @keyframes float-gentle {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(2deg);
          }
        }
        .animate-float-gentle {
          animation: float-gentle ease-in-out infinite;
        }
        
        @keyframes gradient-slow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-slow {
          background-size: 200% 200%;
          animation: gradient-slow 3s ease infinite;
        }
      `}</style>
    </footer>
  );
}