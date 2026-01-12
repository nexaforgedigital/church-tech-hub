import Link from 'next/link';
import { useRouter } from 'next/router';
import { Music, BookOpen, Download, Lightbulb, Phone, FileText, Calendar, HelpCircle, X, Menu, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Navigation() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 20);
      
      // Calculate scroll progress
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      setScrollProgress(progress);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [router.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);
  
  const navItems = [
    { href: '/lyrics', label: 'Lyrics', icon: <Music size={16} /> },
    { href: '/worship-planner', label: 'Planner', icon: <Calendar size={16} /> },
    { href: '/song-sheet', label: 'Sheets', icon: <FileText size={16} /> },
    { href: '/tutorials', label: 'Tutorials', icon: <BookOpen size={16} /> },
    { href: '/downloads', label: 'Downloads', icon: <Download size={16} /> },
    { href: '/tips', label: 'Tips', icon: <Lightbulb size={16} /> },
    { href: '/contact', label: 'Contact', icon: <Phone size={16} /> },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          scrolled 
            ? 'py-2' 
            : 'py-3'
        }`}
        style={{
          background: scrolled 
            ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 27, 75, 0.95) 50%, rgba(15, 23, 42, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(15, 23, 42, 0.7) 0%, rgba(30, 27, 75, 0.7) 50%, rgba(15, 23, 42, 0.7) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: scrolled 
            ? '1px solid rgba(251, 191, 36, 0.2)' 
            : '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: scrolled 
            ? '0 10px 40px -10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(251, 191, 36, 0.1)' 
            : 'none',
        }}
      >
        {/* Scroll Progress Bar */}
        <div 
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 transition-all duration-150"
          style={{ 
            width: `${scrollProgress}%`,
            opacity: scrolled ? 1 : 0,
            boxShadow: '0 0 10px rgba(251, 191, 36, 0.5)'
          }}
        />

        {/* Decorative Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"></div>

        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer group">
                {/* Logo Container with Glow */}
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl blur-md transition-all duration-300 ${
                    scrolled ? 'opacity-40' : 'opacity-60'
                  } group-hover:opacity-80`}></div>
                  <div className={`relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-amber-400/30 transition-all duration-300 ${
                    scrolled ? 'p-1.5' : 'p-2'
                  }`}>
                    <Image 
                      src="/logo.png" 
                      alt="ChurchAssist" 
                      width={scrolled ? 28 : 32} 
                      height={scrolled ? 28 : 32}
                      className="object-contain transition-all duration-300"
                      style={{ width: 'auto', height: scrolled ? '28px' : '32px' }}
                    />
                  </div>
                </div>
                
                {/* Brand Name */}
                <div className="hidden sm:block">
                  <div className={`font-bold transition-all duration-300 bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text text-transparent ${
                    scrolled ? 'text-lg' : 'text-xl'
                  }`}>
                    ChurchAssist
                  </div>
                  <div className={`font-medium text-amber-400/80 transition-all duration-300 ${
                    scrolled ? 'text-[10px]' : 'text-xs'
                  }`}>
                    ✝ Worship Made Simple
                  </div>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center">
              {/* Nav Items Container */}
              <div className={`flex items-center bg-white/5 rounded-full border border-white/10 transition-all duration-300 ${
                scrolled ? 'px-1 py-1 gap-0' : 'px-2 py-1.5 gap-1'
              }`}>
                {navItems.map((item) => {
                  const isActive = router.pathname === item.href || router.pathname.startsWith(item.href + '/');
                  return (
                    <Link key={item.href} href={item.href}>
                      <div className={`relative flex items-center gap-1.5 font-medium transition-all duration-300 rounded-full ${
                        scrolled ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
                      } ${
                        isActive 
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 shadow-lg shadow-amber-500/25' 
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}>
                        {item.icon}
                        <span>{item.label}</span>
                        
                        {/* Active Indicator Dot */}
                        {isActive && (
                          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-400 rounded-full shadow-lg shadow-amber-400/50"></span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
              
              {/* Guide Button - Special */}
              <Link href="/how-to-use">
                <div className={`flex items-center gap-1.5 font-bold ml-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 rounded-full shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 transition-all duration-300 ${
                  scrolled ? 'px-4 py-1.5 text-xs' : 'px-5 py-2.5 text-sm'
                }`}>
                  <HelpCircle size={scrolled ? 14 : 16} />
                  <span>Guide</span>
                </div>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden relative p-2 rounded-xl transition-all duration-300 ${
                mobileMenuOpen 
                  ? 'bg-amber-500 text-slate-900' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6 flex items-center justify-center">
                <span className={`absolute w-5 h-0.5 bg-current transform transition-all duration-300 ${
                  mobileMenuOpen ? 'rotate-45' : '-translate-y-1.5'
                }`}></span>
                <span className={`absolute w-5 h-0.5 bg-current transition-all duration-300 ${
                  mobileMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                }`}></span>
                <span className={`absolute w-5 h-0.5 bg-current transform transition-all duration-300 ${
                  mobileMenuOpen ? '-rotate-45' : 'translate-y-1.5'
                }`}></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          mobileMenuOpen 
            ? 'opacity-100 visible' 
            : 'opacity-0 invisible'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"></div>
      </div>

      {/* Mobile Menu Panel */}
      <div 
        className={`fixed top-0 right-0 z-50 h-full w-[300px] max-w-[85vw] lg:hidden transition-all duration-500 ease-out ${
          mobileMenuOpen 
            ? 'translate-x-0' 
            : 'translate-x-full'
        }`}
        style={{
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 27, 75, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
          boxShadow: mobileMenuOpen ? '-10px 0 40px rgba(0, 0, 0, 0.5)' : 'none',
        }}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-amber-400 to-yellow-500 p-1.5 rounded-lg">
              <span className="text-lg">✝</span>
            </div>
            <span className="font-bold text-white">Menu</span>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mobile Menu Content */}
        <div className="p-4 overflow-y-auto h-[calc(100%-70px)]">
          <div className="space-y-2">
            {navItems.map((item, index) => {
              const isActive = router.pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div 
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 shadow-lg' 
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                    style={{
                      transitionDelay: mobileMenuOpen ? `${index * 50}ms` : '0ms',
                      transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(20px)',
                      opacity: mobileMenuOpen ? 1 : 0,
                    }}
                  >
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-slate-900/20' : 'bg-white/10'}`}>
                      {item.icon}
                    </div>
                    <span>{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-slate-900 rounded-full"></div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
          
          {/* Guide Button in Mobile */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <Link href="/how-to-use">
              <div 
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 shadow-xl shadow-amber-500/30"
                style={{
                  transitionDelay: mobileMenuOpen ? `${navItems.length * 50}ms` : '0ms',
                  transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
                  opacity: mobileMenuOpen ? 1 : 0,
                }}
              >
                <HelpCircle size={20} />
                <span>How to Use Guide</span>
              </div>
            </Link>
          </div>

          {/* Bible Verse in Mobile Menu */}
          <div 
            className="mt-6 p-4 rounded-xl bg-white/5 border border-amber-400/20"
            style={{
              transitionDelay: mobileMenuOpen ? `${(navItems.length + 1) * 50}ms` : '0ms',
              transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
              opacity: mobileMenuOpen ? 1 : 0,
            }}
          >
            <p className="text-white/70 text-sm italic text-center">
              "Let all things be done decently and in order."
            </p>
            <p className="text-amber-400 text-xs font-bold text-center mt-2">
              — 1 Corinthians 14:40
            </p>
          </div>

          {/* Social Links */}
          <div 
            className="mt-6 flex justify-center gap-4"
            style={{
              transitionDelay: mobileMenuOpen ? `${(navItems.length + 2) * 50}ms` : '0ms',
              transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
              opacity: mobileMenuOpen ? 1 : 0,
            }}
          >
            <a 
              href="mailto:contact@churchassist.in" 
              className="p-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </a>
            <a 
              href="https://www.instagram.com/church_assist" 
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-white/10 text-white hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 transition"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className={`transition-all duration-500 ${scrolled ? 'h-14' : 'h-16 md:h-20'}`}></div>

      {/* Navigation Styles */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}