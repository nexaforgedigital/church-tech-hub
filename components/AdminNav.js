// components/AdminNav.js
// Unified Admin Navigation

import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  LayoutDashboard, 
  Plus, 
  Layers, 
  Database, 
  Settings, 
  Wand2,
  ArrowLeft,
  Music
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/quick-add', label: 'Quick Add', icon: Wand2 },
  { href: '/admin/batch-add', label: 'Batch Add', icon: Layers },
  { href: '/admin/songs', label: 'All Songs', icon: Database },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminNav() {
  const router = useRouter();
  
  return (
    <div className="bg-gray-900 text-white">
      {/* Top Bar */}
      <div className="border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Music className="text-purple-400" size={24} />
          <span className="font-bold text-lg">ChurchAssist Admin</span>
        </div>
        <Link 
          href="/" 
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm"
        >
          <ArrowLeft size={16} />
          Back to Site
        </Link>
      </div>
      
      {/* Navigation */}
      <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = router.pathname === item.href;
          
          return (
            <Link key={item.href} href={item.href}>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                isActive 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}>
                <Icon size={18} />
                {item.label}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}