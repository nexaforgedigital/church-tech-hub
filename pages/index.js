import { useState } from 'react';
import Link from 'next/link';
import { Search, Music, BookOpen, Download, Calendar, FileText } from 'lucide-react';
import Head from 'next/head';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <Head>
        <title>ChurchAssist - Professional Worship Presentation & Lyrics Management</title>
        <meta name="description" content="Empower your worship team with professional presentation tools, Tamil & English lyrics library, service planning, and technical resources. Perfect for churches of all sizes." />
        <meta name="keywords" content="church presentation, worship lyrics, Tamil Christian songs, service planner, ProPresenter alternative, church tech" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Empowering Church Tech Teams
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your complete solution for worship lyrics, professional presentations, and ministry tools
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

        {/* How to Use Banner */}
        <section className="container mx-auto px-4 py-8">
          <Link href="/how-to-use">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white text-center hover:shadow-2xl transition cursor-pointer">
              <h2 className="text-3xl font-bold mb-2">🎓 New to ChurchAssist?</h2>
              <p className="text-xl mb-4">Learn how to use all features in 5 minutes</p>
              <span className="inline-block bg-white text-green-600 px-8 py-3 rounded-full font-bold">
                View Complete Guide →
              </span>
            </div>
          </Link>
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
              icon={<Calendar size={40} />}
              title="Service Planner"
              description="Plan complete worship services with songs, verses, and announcements"
              link="/worship-planner"
              color="purple"
            />
            <FeatureCard 
              icon={<FileText size={40} />}
              title="Song Sheets"
              description="Create printable multi-column song sheets for distribution"
              link="/song-sheet"
              color="green"
            />
            <FeatureCard 
              icon={<BookOpen size={40} />}
              title="Tutorials"
              description="Step-by-step guides for ProPresenter, OBS, sound systems, and more"
              link="/tutorials"
              color="orange"
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8">Explore our lyrics library and plan your first service</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/lyrics" className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition">
                Browse Lyrics
              </Link>
              <Link href="/worship-planner" className="inline-block bg-white/20 backdrop-blur text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/30 transition">
                Plan Service
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
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