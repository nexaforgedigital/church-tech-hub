import Link from 'next/link';
import { useRouter } from 'next/router';
import { Music, BookOpen, Download, Lightbulb, Phone, FileText, Calendar, HelpCircle } from 'lucide-react';

export default function Navigation() {
  const router = useRouter();
  
  const navItems = [
    { href: '/lyrics', label: 'Lyrics', icon: <Music size={18} /> },
    { href: '/worship-planner', label: 'Planner', icon: <Calendar size={18} /> },
    { href: '/song-sheet', label: 'Sheets', icon: <FileText size={18} /> },
    { href: '/tutorials', label: 'Tutorials', icon: <BookOpen size={18} /> },
    { href: '/downloads', label: 'Downloads', icon: <Download size={18} /> },
    { href: '/tips', label: 'Tips', icon: <Lightbulb size={18} /> },
    { href: '/contact', label: 'Contact', icon: <Phone size={18} /> },
    { href: '/how-to-use', label: 'Guide', icon: <HelpCircle size={18} />, highlight: true },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b-2 border-purple-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl group-hover:scale-110 transition-transform shadow-lg">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" opacity="0.8"/>
                  <path d="M2 17L12 22L22 17V12L12 17L2 12V17Z" fill="currentColor"/>
                  <path d="M12 2V22" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
                  Church Tech Hub
                </div>
                <div className="text-xs text-gray-600 whitespace-nowrap">Professional Worship Solutions</div>
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
                      : item.highlight
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}>
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}