import Link from 'next/link';
import { useRouter } from 'next/router';
import { Music, BookOpen, Download, Lightbulb, Phone, FileText, Calendar, HelpCircle, X, Menu } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

export default function Navigation() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navItems = [
    { href: '/lyrics', label: 'Lyrics', icon: <Music size={18} /> },
    { href: '/worship-planner', label: 'Planner', icon: <Calendar size={18} /> },
    { href: '/song-sheet', label: 'Sheets', icon: <FileText size={18} /> },
    { href: '/tutorials', label: 'Tutorials', icon: <BookOpen size={18} /> },
    { href: '/downloads', label: 'Downloads', icon: <Download size={18} /> },
    { href: '/tips', label: 'Tips', icon: <Lightbulb size={18} /> },
    { href: '/contact', label: 'Contact', icon: <Phone size={18} /> },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-purple-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Compact */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg blur opacity-50 group-hover:opacity-75 transition"></div>
                <div className="relative bg-white p-1.5 rounded-lg">
                  <Image 
                    src="/logo.png" 
                    alt="ChurchAssist" 
                    width={32} 
                    height={32}
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ChurchAssist
                </div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation - Compact Pills */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}>
                    {item.icon}
                    <span className="hidden xl:inline">{item.label}</span>
                  </div>
                </Link>
              );
            })}
            
            {/* How to Use - Special */}
            <Link href="/how-to-use">
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition shadow-md ml-2">
                <HelpCircle size={18} />
                <span className="hidden xl:inline">Guide</span>
              </div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X size={24} className="text-gray-700" />
            ) : (
              <Menu size={24} className="text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu - Slide Down */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 animate-slide-down">
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = router.pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <div 
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                        isActive 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
              <Link href="/how-to-use">
                <div 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md"
                >
                  <HelpCircle size={18} />
                  <span>How to Use Guide</span>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
}