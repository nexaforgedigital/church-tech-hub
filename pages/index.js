import { useState } from 'react';
import Link from 'next/link';
import { Search, Music, BookOpen, Download, Users, Sparkles } from 'lucide-react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="text-blue-600" size={32} />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Church Tech Hub
              </span>
            </div>
            <div className="hidden md:flex gap-6">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
              <Link href="/lyrics" className="text-gray-700 hover:text-blue-600 font-medium">Lyrics</Link>
              <Link href="/tutorials" className="text-gray-700 hover:text-blue-600 font-medium">Tutorials</Link>
              <Link href="/downloads" className="text-gray-700 hover:text-blue-600 font-medium">Downloads</Link>
              <Link href="/tips" className="text-gray-700 hover:text-blue-600 font-medium">Tips</Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium">Contact</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Empowering Church Tech Teams
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your one-stop resource for worship lyrics, tech tutorials, and ministry tools
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <input
              type="text"
              placeholder="Search for songs, tutorials, or resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:outline-none shadow-lg text-lg"
            />
            <Search className="absolute right-6 top-4 text-gray-400" size={24} />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="text-3xl font-bold text-blue-600">1000+</div>
              <div className="text-gray-600">Songs</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="text-3xl font-bold text-purple-600">50+</div>
              <div className="text-gray-600">Tutorials</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="text-3xl font-bold text-green-600">100+</div>
              <div className="text-gray-600">Tools</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Everything You Need</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard 
            icon={<Music size={40} />}
            title="Lyrics Library"
            description="Access 1000+ worship songs in Tamil, English, and bilingual formats with instant PPT downloads"
            link="/lyrics"
            color="blue"
          />
          <FeatureCard 
            icon={<BookOpen size={40} />}
            title="Video Tutorials"
            description="Step-by-step guides for ProPresenter, OBS, sound systems, and more"
            link="/tutorials"
            color="purple"
          />
          <FeatureCard 
            icon={<Download size={40} />}
            title="Software Hub"
            description="Direct download links to essential church tech software and tools"
            link="/downloads"
            color="green"
          />
          <FeatureCard 
            icon={<Users size={40} />}
            title="Tech Tips"
            description="Best practices, troubleshooting guides, and pro tips for church tech teams"
            link="/tips"
            color="orange"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8">Explore our lyrics library and download your first presentation</p>
          <Link href="/lyrics" className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition">
            Browse Lyrics Library
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Church Tech Hub</h3>
              <p className="text-gray-400">Empowering worship teams with the right tools and resources</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link href="/lyrics" className="block text-gray-400 hover:text-white">Lyrics</Link>
                <Link href="/tutorials" className="block text-gray-400 hover:text-white">Tutorials</Link>
                <Link href="/downloads" className="block text-gray-400 hover:text-white">Downloads</Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <div className="space-y-2">
                <Link href="/tips" className="block text-gray-400 hover:text-white">Tech Tips</Link>
                <Link href="/contact" className="block text-gray-400 hover:text-white">Contact Us</Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <p className="text-gray-400">Have feedback? We'd love to hear from you!</p>
              <Link href="/contact" className="inline-block mt-4 bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700">
                Get in Touch
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 Church Tech Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, link, color }) {
  const colorClasses = {
    blue: 'group-hover:border-blue-500 text-blue-600',
    purple: 'group-hover:border-purple-500 text-purple-600',
    green: 'group-hover:border-green-500 text-green-600',
    orange: 'group-hover:border-orange-500 text-orange-600',
  };

  return (
    <Link href={link}>
      <div className="group cursor-pointer">
        <div className={`bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-transparent h-full ${colorClasses[color]}`}>
          <div className={`${colorClasses[color]} mb-4 group-hover:scale-110 transition-transform`}>
            {icon}
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </Link>
  );
}