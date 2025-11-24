import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Music, BookOpen, Download, Calendar, FileText, Zap, Users, Shield, Star, Play, ArrowRight, Check, Sparkles, Heart, TrendingUp } from 'lucide-react';
import Head from 'next/head';

const ClientOnly = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false);
  
  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  if (!hasMounted) return null;
  return <>{children}</>;
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <Head>
        <title>ChurchAssist - Transform Your Worship Experience</title>
        <meta name="description" content="The most powerful worship presentation platform. 1000+ songs, dual-screen presenter, mobile control, and more." />
      </Head>

      <div className="min-h-screen overflow-x-hidden">
        {/* MEGA HERO SECTION */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
          {/* Animated Background Orbs */}
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"
              style={{
                top: '10%',
                left: `${20 + mousePosition.x * 0.02}%`,
                transition: 'all 0.3s ease-out'
              }}
            ></div>
            <div 
              className="absolute w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-700"
              style={{
                top: '50%',
                right: `${10 + mousePosition.x * 0.015}%`,
                transition: 'all 0.3s ease-out'
              }}
            ></div>
            <div 
              className="absolute w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse delay-1000"
              style={{
                bottom: '10%',
                left: `${30 + mousePosition.x * 0.01}%`,
                transition: 'all 0.3s ease-out'
              }}
            ></div>
          </div>

          {/* Floating Particles */}
          <ClientOnly>
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`
                }}
              />
            ))}
          </ClientOnly>

          <div className="container mx-auto px-4 py-20 relative z-10">
            <div className="text-center max-w-6xl mx-auto">
              {/* Premium Badge */}
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-xl border border-yellow-400/30 px-8 py-4 rounded-full mb-8 transform hover:scale-105 transition-all cursor-pointer shadow-2xl">
                <Sparkles size={24} className="text-yellow-400 animate-pulse" />
                <span className="text-white font-bold text-lg">Trusted by 1,000+ Churches Worldwide</span>
                <TrendingUp size={20} className="text-green-400" />
              </div>

              {/* Main Headline - HUGE */}
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-none">
                <span className="block text-white drop-shadow-2xl animate-fade-in-down">Transform</span>
                <span className="block bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x drop-shadow-2xl">
                  Your Worship
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl md:text-3xl text-blue-100 mb-12 leading-relaxed max-w-4xl mx-auto font-light animate-fade-in-up">
                The <span className="font-bold text-white">world's most powerful</span> worship presentation platform. 
                <span className="block mt-2">Professional tools. Beautiful presentations. Zero hassle.</span>
              </p>

              {/* CTA Buttons - LARGE */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-fade-in-up delay-300">
                <Link href="/worship-planner">
                  <button className="group relative px-10 py-6 bg-white text-purple-900 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all overflow-hidden">
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      <Play size={28} className="group-hover:scale-110 transition-transform" />
                      Start Planning Now
                      <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>
                </Link>
                
                <Link href="/lyrics">
                  <button className="px-10 py-6 bg-white/10 backdrop-blur-xl text-white border-2 border-white/30 rounded-2xl font-bold text-xl hover:bg-white/20 transform hover:scale-105 transition-all shadow-2xl flex items-center gap-3">
                    <Music size={28} />
                    Browse 1,000+ Songs
                  </button>
                </Link>
              </div>

              {/* Stats Bar - Modern */}
              <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto animate-fade-in-up delay-500">
                {[
                  { number: '1,000+', label: 'Worship Songs', icon: <Music size={32} /> },
                  { number: '50+', label: 'Video Tutorials', icon: <Play size={32} /> },
                  { number: '24/7', label: 'Support', icon: <Heart size={32} /> }
                ].map((stat, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl hover:bg-white/20 transition-all transform hover:scale-105 cursor-pointer">
                    <div className="text-white mb-2">{stat.icon}</div>
                    <div className="text-4xl md:text-5xl font-black text-white mb-2">{stat.number}</div>
                    <div className="text-sm md:text-base text-blue-200 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-8 h-12 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* FEATURES SHOWCASE - 3D CARDS */}
        <section className="py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-20">
              <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold mb-6">
                POWERFUL FEATURES
              </div>
              <h2 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
                Everything You Need
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
                Professional worship tools that make your team look like rockstars
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {[
                {
                  icon: <Music size={48} />,
                  title: 'Massive Lyrics Library',
                  description: '1,000+ songs in Tamil, English & transliteration',
                  color: 'from-blue-500 to-cyan-500',
                  link: '/lyrics'
                },
                {
                  icon: <Calendar size={48} />,
                  title: 'Smart Planner',
                  description: 'Plan services with drag-drop. Auto-save. Export/Import.',
                  color: 'from-purple-500 to-pink-500',
                  link: '/worship-planner'
                },
                {
                  icon: <Zap size={48} />,
                  title: 'Dual-Screen Pro',
                  description: 'ProPresenter-style presenter control. Game changer.',
                  color: 'from-yellow-500 to-orange-500',
                  link: '/worship-planner'
                },
                {
                  icon: <FileText size={48} />,
                  title: 'Song Sheets',
                  description: 'Beautiful printable sheets. 6-12 songs per page.',
                  color: 'from-green-500 to-emerald-500',
                  link: '/song-sheet'
                }
              ].map((feature, i) => (
                <Link key={i} href={feature.link}>
                  <div className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 cursor-pointer border border-gray-100 overflow-hidden h-full">
                    {/* Gradient Background on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                    
                    {/* Icon */}
                    <div className={`inline-flex p-5 rounded-2xl bg-gradient-to-br ${feature.color} text-white mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      {feature.icon}
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">{feature.description}</p>
                    
                    {/* Arrow */}
                    <div className="flex items-center text-purple-600 font-semibold group-hover:gap-3 transition-all">
                      Learn More
                      <ArrowRight size={20} className="ml-2 group-hover:translate-x-2 transition-transform" />
                    </div>

                    {/* Bottom Border Animation */}
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF - TESTIMONIAL */}
        <section className="py-32 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2LTRoLTJ2NGgtNHYyaDR2NGgydi00aDR2LTJoLTR6bTAtMzBWMGgtMnY0aC00djJoNHY0aDJWNmg0VjRoLTR6TTYgMzR2LTRINHY0SDB2Mmg0djRoMnYtNGg0di0ySDZ6TTYgNFYwSDR2NEgwdjJoNHY0aDJWNmg0VjRINnoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="flex justify-center gap-2 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={40} className="text-yellow-400 fill-yellow-400 drop-shadow-lg" />
                  ))}
                </div>
                <blockquote className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
                  "This is hands down the <span className="text-yellow-400">best worship presentation tool</span> we've ever used. Our team went from chaos to clarity in one Sunday."
                </blockquote>
                <div className="flex items-center justify-center gap-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center shadow-2xl">
                    <Users size={40} className="text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-white">Pastor John Samuel</div>
                    <div className="text-xl text-blue-200">Grace Community Church, Chennai</div>
                    <div className="text-blue-300 mt-1">Using ChurchAssist since 2024</div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
                {[
                  { icon: <Users />, stat: '1,000+', label: 'Active Churches' },
                  { icon: <Music />, stat: '50K+', label: 'Services Planned' },
                  { icon: <Heart />, stat: '4.9/5', label: 'User Rating' },
                  { icon: <Zap />, stat: '99.9%', label: 'Uptime' }
                ].map((item, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 transition-all transform hover:scale-105">
                    <div className="text-white mb-3">{item.icon}</div>
                    <div className="text-3xl font-black text-white mb-1">{item.stat}</div>
                    <div className="text-sm text-blue-200">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* MEGA CTA - FINAL PUSH */}
        <section className="py-32 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-[3rem] p-12 md:p-20 relative overflow-hidden shadow-2xl">
              {/* Animated Background */}
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
              </div>

              <div className="relative z-10 text-center">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xl px-6 py-3 rounded-full mb-8">
                  <Check size={20} className="text-green-300" />
                  <span className="text-white font-bold">Free Forever • No Credit Card Required</span>
                </div>

                <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
                  Ready to Transform<br />Your Worship?
                </h2>
                
                <p className="text-2xl md:text-3xl text-purple-100 mb-12 max-w-3xl mx-auto">
                  Join 1,000+ churches using ChurchAssist for professional, stress-free worship presentations
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link href="/worship-planner">
                    <button className="group px-12 py-6 bg-white text-purple-900 rounded-2xl font-black text-2xl shadow-2xl hover:scale-105 transition-all flex items-center gap-4 justify-center">
                      <Play size={32} className="group-hover:scale-110 transition-transform" />
                      Start Free Now
                      <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                  </Link>
                  
                  <Link href="/how-to-use">
                    <button className="px-12 py-6 bg-white/10 backdrop-blur-xl text-white border-2 border-white/30 rounded-2xl font-bold text-2xl hover:bg-white/20 transition-all flex items-center gap-4">
                      <BookOpen size={28} />
                      Watch 2-Min Demo
                    </button>
                  </Link>
                </div>

                <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/80 text-lg">
                  <div className="flex items-center gap-2">
                    <Check size={24} className="text-green-300" />
                    <span>1,000+ Songs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={24} className="text-green-300" />
                    <span>Dual-Screen Mode</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={24} className="text-green-300" />
                    <span>24/7 Support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={24} className="text-green-300" />
                    <span>Mobile Friendly</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .delay-300 { animation-delay: 300ms; }
        .delay-500 { animation-delay: 500ms; }
        .delay-700 { animation-delay: 700ms; }
        .delay-1000 { animation-delay: 1000ms; }
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 1s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </>
  );
}