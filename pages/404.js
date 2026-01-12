import Link from 'next/link';
import Head from 'next/head';
import { Home, Search, Music, ArrowLeft } from 'lucide-react';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 - Page Not Found | ChurchAssist</title>
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="text-center text-white max-w-lg">
          {/* Animated 404 */}
          <div className="text-9xl font-bold mb-4 animate-pulse">
            4<span className="text-yellow-400">0</span>4
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
          
          <p className="text-gray-300 mb-8">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          
          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Link href="/">
              <div className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl p-4 transition cursor-pointer">
                <Home className="mx-auto mb-2" size={24} />
                <div className="text-sm font-semibold">Home</div>
              </div>
            </Link>
            <Link href="/lyrics">
              <div className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl p-4 transition cursor-pointer">
                <Music className="mx-auto mb-2" size={24} />
                <div className="text-sm font-semibold">Lyrics</div>
              </div>
            </Link>
            <Link href="/worship-planner">
              <div className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl p-4 transition cursor-pointer">
                <Search className="mx-auto mb-2" size={24} />
                <div className="text-sm font-semibold">Planner</div>
              </div>
            </Link>
            <Link href="/contact">
              <div className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl p-4 transition cursor-pointer">
                <ArrowLeft className="mx-auto mb-2" size={24} />
                <div className="text-sm font-semibold">Contact</div>
              </div>
            </Link>
          </div>
          
          <Link href="/">
            <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-8 py-3 rounded-full font-bold transition">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}