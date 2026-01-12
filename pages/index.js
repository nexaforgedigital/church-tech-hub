import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Music, BookOpen, Download, Calendar, FileText, 
  Play, ArrowRight, Check, Monitor, Smartphone,
  Palette, Globe, Heart, ArrowUpRight, Sparkles, ShieldCheck
} from 'lucide-react';
import Head from 'next/head';

// ============================================
// PROPER CHRISTIAN CROSS PATTERN
// ============================================
const ChristianCrossPattern = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.04]">
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <pattern id="christian-cross" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
        {/* Proper Christian Cross - taller vertical beam */}
        <rect x="54" y="10" width="12" height="100" rx="2" fill="white"/>
        <rect x="35" y="30" width="50" height="12" rx="2" fill="white"/>
      </pattern>
      <rect width="100%" height="100%" fill="url(#christian-cross)"/>
    </svg>
  </div>
);

// ============================================
// FLOATING CROSSES COMPONENT
// ============================================
const FloatingCrosses = () => {
  const [crosses, setCrosses] = useState([]);

  useEffect(() => {
    const newCrosses = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: 5 + Math.random() * 90,
      y: 10 + Math.random() * 70,
      size: 20 + Math.random() * 25,
      duration: 20 + Math.random() * 15,
      delay: Math.random() * 10,
      opacity: 0.03 + Math.random() * 0.04,
    }));
    setCrosses(newCrosses);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {crosses.map((cross) => (
        <div
          key={cross.id}
          className="absolute animate-cross-float"
          style={{
            left: `${cross.x}%`,
            top: `${cross.y}%`,
            opacity: cross.opacity,
            animationDuration: `${cross.duration}s`,
            animationDelay: `${cross.delay}s`,
          }}
        >
          <svg width={cross.size} height={cross.size * 1.5} viewBox="0 0 40 60" fill="white">
            <rect x="16" y="0" width="8" height="60" rx="2"/>
            <rect x="4" y="15" width="32" height="8" rx="2"/>
          </svg>
        </div>
      ))}
    </div>
  );
};

// ============================================
// DOVE COMPONENT (Holy Spirit Symbol)
// ============================================
const Dove = ({ style, size = 40 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 64 64" 
    fill="currentColor" 
    style={style}
    className="text-white/15"
  >
    <path d="M52.4,12.8c-4.4-3.2-10-4.8-16-4.8c-2.8,0-5.6,0.4-8,1.2c-1.6-2-4-3.2-6.8-3.2c-4.8,0-8.8,4-8.8,8.8
      c0,1.6,0.4,3.2,1.2,4.4c-4,3.2-6.4,8-6.4,13.6c0,9.6,7.6,17.2,17.2,17.2h4c0.8,2.8,3.2,4.8,6,4.8c3.6,0,6.4-2.8,6.4-6.4
      c0-0.8-0.1-1.5-0.4-2.2c7.2-2.8,12.4-9.6,12.4-17.8C53.2,22,53.2,16.4,52.4,12.8z"/>
  </svg>
);

// ============================================
// ANIMATED DOVES COMPONENT
// ============================================
const AnimatedDoves = () => {
  const [doves, setDoves] = useState([]);

  useEffect(() => {
    const newDoves = Array.from({ length: 4 }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 15 + Math.random() * 35,
      size: 35 + Math.random() * 25,
      duration: 18 + Math.random() * 12,
      delay: Math.random() * 8,
    }));
    setDoves(newDoves);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {doves.map((dove) => (
        <div
          key={dove.id}
          className="absolute animate-dove-float"
          style={{
            left: `${dove.x}%`,
            top: `${dove.y}%`,
            animationDuration: `${dove.duration}s`,
            animationDelay: `${dove.delay}s`,
          }}
        >
          <Dove size={dove.size} />
        </div>
      ))}
    </div>
  );
};

// ============================================
// HEAVENLY CLOUDS COMPONENT
// ============================================
const HeavenlyClouds = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Cloud Layer 1 */}
    <div className="absolute w-full h-full">
      <div 
        className="absolute w-[200%] h-[350px] top-0 animate-cloud-drift-slow"
        style={{
          background: `
            radial-gradient(ellipse 350px 180px at 10% 50%, rgba(255,255,255,0.07) 0%, transparent 70%),
            radial-gradient(ellipse 450px 220px at 35% 30%, rgba(255,255,255,0.05) 0%, transparent 70%),
            radial-gradient(ellipse 380px 190px at 65% 55%, rgba(255,255,255,0.06) 0%, transparent 70%),
            radial-gradient(ellipse 320px 160px at 85% 40%, rgba(255,255,255,0.04) 0%, transparent 70%)
          `,
        }}
      />
    </div>

    {/* Cloud Layer 2 */}
    <div className="absolute w-full h-full">
      <div 
        className="absolute w-[200%] h-[400px] top-[8%] animate-cloud-drift-medium"
        style={{
          background: `
            radial-gradient(ellipse 400px 200px at 20% 45%, rgba(255,255,255,0.08) 0%, transparent 70%),
            radial-gradient(ellipse 500px 250px at 50% 50%, rgba(255,255,255,0.06) 0%, transparent 70%),
            radial-gradient(ellipse 420px 210px at 75% 40%, rgba(255,255,255,0.07) 0%, transparent 70%)
          `,
        }}
      />
    </div>

    {/* Cloud Layer 3 - Front */}
    <div className="absolute w-full h-full">
      <div 
        className="absolute w-[200%] h-[300px] top-[3%] animate-cloud-drift-fast"
        style={{
          background: `
            radial-gradient(ellipse 320px 160px at 8% 55%, rgba(255,255,255,0.1) 0%, transparent 70%),
            radial-gradient(ellipse 480px 240px at 30% 40%, rgba(255,255,255,0.08) 0%, transparent 70%),
            radial-gradient(ellipse 400px 200px at 60% 50%, rgba(255,255,255,0.09) 0%, transparent 70%),
            radial-gradient(ellipse 350px 175px at 88% 45%, rgba(255,255,255,0.07) 0%, transparent 70%)
          `,
        }}
      />
    </div>
  </div>
);

// ============================================
// DIVINE LIGHT RAYS COMPONENT
// ============================================
const DivineLightRays = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Central Heavenly Glow */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[900px] h-[900px]">
      <div className="absolute inset-0 bg-gradient-to-b from-amber-200/25 via-yellow-100/10 to-transparent rounded-full blur-3xl animate-divine-pulse"></div>
    </div>

    {/* Light Rays from Heaven */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
      {[...Array(9)].map((_, i) => {
        const angle = -40 + (i * 10);
        const height = 45 + Math.random() * 35;
        const opacity = 0.08 + Math.random() * 0.12;
        const width = 2 + Math.random() * 2;
        const delay = i * 0.3;
        
        return (
          <div
            key={i}
            className="absolute top-0 left-1/2 origin-top animate-ray-shimmer"
            style={{
              width: `${width}px`,
              height: `${height}%`,
              background: `linear-gradient(to bottom, rgba(251, 191, 36, ${opacity}), rgba(253, 224, 71, ${opacity * 0.5}), transparent)`,
              transform: `translateX(-50%) rotate(${angle}deg)`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
    </div>

    {/* Soft Top Glow */}
    <div className="absolute top-0 left-0 right-0 h-[50%] bg-gradient-to-b from-amber-300/15 via-yellow-200/5 to-transparent"></div>
  </div>
);

// ============================================
// RISING PRAYERS/LIGHT PARTICLES
// ============================================
const RisingPrayers = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 2 + Math.random() * 3,
      duration: 10 + Math.random() * 15,
      delay: Math.random() * 10,
      opacity: 0.15 + Math.random() * 0.25,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute bottom-0 rounded-full bg-amber-300 animate-rise-up"
          style={{
            left: `${particle.x}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            boxShadow: `0 0 ${particle.size * 3}px rgba(251, 191, 36, 0.6)`,
          }}
        />
      ))}
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      icon: <Calendar size={28} />,
      title: 'Service Planner',
      description: 'Build worship services with songs, verses & announcements.',
      color: 'from-blue-500 to-blue-600',
      href: '/worship-planner',
    },
    {
      icon: <Monitor size={28} />,
      title: 'Dual-Screen Presenter',
      description: 'Control from laptop, project to congregation.',
      color: 'from-purple-500 to-purple-600',
      href: '/worship-planner',
      badge: 'PRO'
    },
    {
      icon: <Music size={28} />,
      title: 'Lyrics Library',
      description: 'Tamil songs with transliteration. Add custom songs.',
      color: 'from-emerald-500 to-emerald-600',
      href: '/lyrics',
    },
    {
      icon: <Smartphone size={28} />,
      title: 'Mobile Remote',
      description: 'Control presentations from any smartphone.',
      color: 'from-orange-500 to-orange-600',
      href: null,
      badge: 'FREE'
    },
    {
      icon: <FileText size={28} />,
      title: 'Song Sheets',
      description: 'Printable multi-column song sheets for choir.',
      color: 'from-cyan-500 to-cyan-600',
      href: '/song-sheet',
    },
    {
      icon: <Download size={28} />,
      title: 'PowerPoint Export',
      description: 'Download songs as customized presentations.',
      color: 'from-pink-500 to-pink-600',
      href: '/lyrics',
    },
  ];

  return (
    <>
      <Head>
        <title>ChurchAssist - Professional Worship Presentation Made Simple</title>
        <meta name="description" content="Free worship presentation software for churches. Plan services, display lyrics, and present with excellence." />
      </Head>

      <div className="overflow-x-hidden">
        
        {/* ==================== HERO SECTION ==================== */}
        <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-indigo-950 via-blue-950 to-slate-900">
          {/* Heavenly Background Elements */}
          <ChristianCrossPattern />
          <FloatingCrosses />
          <HeavenlyClouds />
          <DivineLightRays />
          <AnimatedDoves />
          <RisingPrayers />
          
          {/* Content */}
          <div className="container mx-auto px-4 py-12 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              
              {/* ===== BIBLE VERSE AT TOP ===== */}
              <div className="mb-10 animate-fade-in-down">
                <div className="relative inline-block max-w-2xl">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-yellow-400/30 to-amber-500/20 rounded-2xl blur-2xl"></div>
                  
                  <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-amber-400/40 rounded-2xl px-8 py-5 shadow-2xl">
                    {/* Decorative Crosses */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <div className="bg-gradient-to-br from-amber-400 to-yellow-500 p-2 rounded-lg shadow-lg shadow-amber-500/50">
                        <svg width="20" height="28" viewBox="0 0 40 56" fill="white">
                          <rect x="16" y="0" width="8" height="56" rx="2"/>
                          <rect x="4" y="14" width="32" height="8" rx="2"/>
                        </svg>
                      </div>
                    </div>
                    
                    {/* Quote Marks */}
                    <div className="absolute top-2 left-4 text-amber-400/40 text-5xl font-serif leading-none">"</div>
                    <div className="absolute bottom-2 right-4 text-amber-400/40 text-5xl font-serif leading-none rotate-180">"</div>
                    
                    <p className="text-white text-lg md:text-xl font-medium italic leading-relaxed pt-3 px-4">
                      Let all things be done decently and in order.
                    </p>
                    
                    <div className="flex items-center justify-center gap-3 mt-3">
                      <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"></div>
                      <p className="text-amber-400 font-bold text-sm tracking-widest">
                        1 CORINTHIANS 14:40
                      </p>
                      <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight animate-fade-in">
                <span className="text-white drop-shadow-lg">Professional</span>
                <br />
                <span className="bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-300 bg-clip-text text-transparent drop-shadow-lg animate-shimmer bg-[length:200%_auto]">
                  Worship Presentation
                </span>
                <br />
                <span className="text-white drop-shadow-lg">Made Simple</span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg md:text-xl text-blue-100/80 mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in-up">
                Plan your worship services, display lyrics beautifully, and present with confidence.
                <span className="block mt-2 text-white font-medium">
                  Free forever. Works in your browser.
                </span>
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-fade-in-up">
                <Link href="/worship-planner">
                  <button className="group px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 rounded-xl font-bold text-lg shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3">
                    <Play size={22} />
                    Start Planning Service
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                
                <Link href="/lyrics">
                  <button className="px-8 py-4 bg-white/10 backdrop-blur text-white border border-white/20 rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-3">
                    <Music size={22} />
                    Browse Lyrics
                  </button>
                </Link>
              </div>

              {/* Feature Pills - Including Ad Free */}
              <div className="flex flex-wrap justify-center gap-3 animate-fade-in-up">
                {[
                  { icon: <Check size={16} />, text: 'No Download', color: 'text-emerald-400' },
                  { icon: <Heart size={16} />, text: '100% Free', color: 'text-pink-400' },
                  { icon: <ShieldCheck size={16} />, text: 'Ad Free', color: 'text-blue-400' },
                  { icon: <Globe size={16} />, text: 'Works Offline', color: 'text-cyan-400' },
                  { icon: <Smartphone size={16} />, text: 'Mobile Ready', color: 'text-purple-400' },
                ].map((item, i) => (
                  <div 
                    key={i} 
                    className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white/90 border border-white/10 hover:bg-white/15 transition-all duration-300"
                  >
                    <span className={item.color}>{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none"></div>
        </section>

        {/* ==================== FEATURES SECTION ==================== */}
        <section className="py-16 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 relative">
          {/* Subtle Background */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
          </div>

          {/* Subtle Cross Pattern */}
          <div className="absolute inset-0 opacity-[0.015]">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <pattern id="cross-features" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect x="46" y="10" width="8" height="80" rx="2" fill="white"/>
                <rect x="25" y="25" width="50" height="8" rx="2" fill="white"/>
              </pattern>
              <rect width="100%" height="100%" fill="url(#cross-features)"/>
            </svg>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-2 rounded-full text-sm font-bold mb-4">
                <Sparkles size={16} />
                FEATURES
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white">
                Everything You Need
              </h2>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {features.map((feature, i) => {
                const Card = feature.href ? Link : 'div';
                const cardProps = feature.href ? { href: feature.href } : {};
                
                return (
                  <Card key={i} {...cardProps}>
                    <div className="group relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur rounded-2xl p-6 border border-white/10 hover:border-amber-400/30 transition-all duration-300 hover:bg-white/10 cursor-pointer h-full overflow-hidden">
                      {/* Hover Glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:to-yellow-500/5 transition-all duration-500 rounded-2xl"></div>
                      
                      {/* Badge */}
                      {feature.badge && (
                        <div className={`absolute top-4 right-4 px-2 py-0.5 rounded-full text-xs font-bold ${
                          feature.badge === 'PRO' 
                            ? 'bg-purple-500 text-white' 
                            : 'bg-emerald-500 text-white'
                        }`}>
                          {feature.badge}
                        </div>
                      )}

                      {/* Icon */}
                      <div className={`bg-gradient-to-br ${feature.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                        {feature.icon}
                      </div>

                      {/* Content */}
                      <h3 className="text-lg font-bold mb-2 text-white group-hover:text-amber-400 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {feature.description}
                      </p>

                      {/* Arrow */}
                      {feature.href && (
                        <ArrowUpRight size={16} className="absolute bottom-4 right-4 text-gray-600 group-hover:text-amber-400 transition-colors" />
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================== HOW IT WORKS ==================== */}
        <section className="py-16 bg-slate-950 relative overflow-hidden">
          {/* Subtle Background */}
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
                Ready in <span className="text-amber-400">3 Steps</span>
              </h2>
              <p className="text-gray-400">From planning to presenting in minutes</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                {
                  step: '1',
                  title: 'Build Service',
                  description: 'Add songs, verses & announcements',
                  icon: <Calendar size={28} />,
                  color: 'from-blue-500 to-cyan-500'
                },
                {
                  step: '2',
                  title: 'Customize',
                  description: 'Choose background & font settings',
                  icon: <Palette size={28} />,
                  color: 'from-purple-500 to-pink-500'
                },
                {
                  step: '3',
                  title: 'Present',
                  description: 'Go live with dual-screen mode',
                  icon: <Monitor size={28} />,
                  color: 'from-amber-500 to-yellow-500'
                }
              ].map((item, i) => (
                <div key={i} className="text-center group">
                  <div className="relative inline-block mb-4">
                    {/* Glow Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300`}></div>
                    
                    <div className={`relative bg-gradient-to-br ${item.color} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto text-white shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                      {item.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 bg-white text-slate-900 w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shadow-lg">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-1 text-white">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== FINAL CTA ==================== */}
        <section className="py-16 bg-gradient-to-b from-slate-950 to-indigo-950 relative overflow-hidden">
          {/* Heavenly Glow */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-amber-400/15 to-transparent rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl mx-auto text-center">
              {/* Card */}
              <div className="relative">
                {/* Outer Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-3xl blur-2xl"></div>
                
                <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl p-10 border border-amber-400/20 shadow-2xl">
                  
                  {/* Cross Icon */}
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-amber-400 rounded-xl blur-lg opacity-50 animate-pulse"></div>
                    <div className="relative inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl shadow-lg">
                      <svg width="24" height="32" viewBox="0 0 40 56" fill="white">
                        <rect x="16" y="0" width="8" height="56" rx="2"/>
                        <rect x="4" y="14" width="32" height="8" rx="2"/>
                      </svg>
                    </div>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-black mb-4 text-white">
                    Ready to Serve Your Church?
                  </h2>
                  
                  <p className="text-gray-300 mb-6">
                    Join churches using ChurchAssist for professional worship presentations
                  </p>

                  {/* Badges */}
                  <div className="flex flex-wrap justify-center gap-3 mb-8">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-bold border border-emerald-500/30">
                      <Check size={16} />
                      Free Forever
                    </div>
                    <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm font-bold border border-blue-500/30">
                      <ShieldCheck size={16} />
                      No Ads
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div>
                    <Link href="/worship-planner">
                      <button className="group px-10 py-5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 rounded-xl font-black text-xl shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 mx-auto">
                        <Play size={24} />
                        Get Started Free
                        <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  </div>

                  {/* Secondary Link */}
                  <div className="mt-4">
                    <Link href="/how-to-use" className="text-gray-400 hover:text-amber-400 text-sm font-medium transition inline-flex items-center gap-1">
                      <BookOpen size={16} />
                      View Guide
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ==================== ANIMATIONS ==================== */}
      <style jsx global>{`
        /* Fade in animations */
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-fade-in-down {
          animation: fade-in-down 1s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out 0.3s both;
        }

        /* Cross floating animation */
        @keyframes cross-float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.03;
          }
          50% {
            transform: translateY(-15px) rotate(3deg);
            opacity: 0.06;
          }
        }
        .animate-cross-float {
          animation: cross-float ease-in-out infinite;
        }

        /* Dove floating animation */
        @keyframes dove-float {
          0%, 100% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          25% {
            transform: translateY(-15px) translateX(25px) rotate(3deg);
          }
          50% {
            transform: translateY(-8px) translateX(50px) rotate(-2deg);
          }
          75% {
            transform: translateY(-20px) translateX(25px) rotate(2deg);
          }
        }
        .animate-dove-float {
          animation: dove-float ease-in-out infinite;
        }

        /* Cloud drift animations */
        @keyframes cloud-drift-slow {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes cloud-drift-medium {
          0% { transform: translateX(-25%); }
          100% { transform: translateX(-75%); }
        }
        @keyframes cloud-drift-fast {
          0% { transform: translateX(-10%); }
          100% { transform: translateX(-60%); }
        }
        .animate-cloud-drift-slow {
          animation: cloud-drift-slow 80s linear infinite;
        }
        .animate-cloud-drift-medium {
          animation: cloud-drift-medium 60s linear infinite;
        }
        .animate-cloud-drift-fast {
          animation: cloud-drift-fast 45s linear infinite;
        }

        /* Divine pulse */
        @keyframes divine-pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.03); }
        }
        .animate-divine-pulse {
          animation: divine-pulse 5s ease-in-out infinite;
        }

        /* Light ray shimmer */
        @keyframes ray-shimmer {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.9; }
        }
        .animate-ray-shimmer {
          animation: ray-shimmer 4s ease-in-out infinite;
        }

        /* Rising prayers */
        @keyframes rise-up {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 0.4;
          }
          90% {
            opacity: 0.2;
          }
          100% {
            transform: translateY(-100vh) scale(0.5);
            opacity: 0;
          }
        }
        .animate-rise-up {
          animation: rise-up linear infinite;
        }

        /* Shimmer text */
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-shimmer {
          animation: shimmer 4s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}