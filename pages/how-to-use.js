import Link from 'next/link';
import Head from 'next/head';
import { 
  Music, Download, Maximize, Settings, Monitor, FileText, 
  Calendar, Play, Palette, HelpCircle, Sparkles, Smartphone,
  ChevronRight, BookOpen, Lightbulb, Keyboard
} from 'lucide-react';

// Cross Pattern Component
const CrossPattern = ({ opacity = 0.02 }) => (
  <div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <pattern id="cross-pattern-guide" x="0" y="0" width="80" height="100" patternUnits="userSpaceOnUse">
        <rect x="36" y="10" width="8" height="80" rx="1" fill="white"/>
        <rect x="24" y="25" width="32" height="8" rx="1" fill="white"/>
      </pattern>
      <rect width="100%" height="100%" fill="url(#cross-pattern-guide)"/>
    </svg>
  </div>
);

export default function HowToUse() {
  return (
    <>
      <Head>
        <title>How to Use - ChurchAssist Guide</title>
        <meta name="description" content="Complete guide on how to use ChurchAssist for worship presentation." />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
        {/* Hero Section */}
        <section className="relative py-16 overflow-hidden">
          <CrossPattern opacity={0.02} />
          
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-2xl mb-6 shadow-lg shadow-amber-500/30">
                <BookOpen size={32} className="text-slate-900" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black mb-4 text-white">
                Complete <span className="text-amber-400">User Guide</span>
              </h1>
              <p className="text-lg text-gray-400">
                Everything you need to know about ChurchAssist
              </p>
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              
              {/* Quick Start Card */}
              <div className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 rounded-2xl p-8 border border-amber-500/20 mb-8">
                <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                  <Sparkles size={24} className="text-amber-400" />
                  Quick Start Guide
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { step: '1', title: 'Browse Lyrics', desc: 'Search and find songs in our library', icon: <Music size={24} /> },
                    { step: '2', title: 'Plan Service', desc: 'Build your worship service with songs & verses', icon: <Calendar size={24} /> },
                    { step: '3', title: 'Present Live', desc: 'Use dual-screen mode for professional presentation', icon: <Monitor size={24} /> },
                  ].map((item, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-5 border border-white/10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-amber-500 text-slate-900 w-8 h-8 rounded-lg flex items-center justify-center font-bold">
                          {item.step}
                        </div>
                        <div className="text-amber-400">{item.icon}</div>
                      </div>
                      <h3 className="font-bold text-white mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-400">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sections */}
              <div className="space-y-8">
                
                {/* Lyrics Library */}
                <GuideSection
                  icon={<Music size={28} />}
                  title="Lyrics Library"
                  color="blue"
                >
                  <div className="space-y-4">
                    <GuideItem title="Finding Songs" color="blue">
                      <ul className="space-y-1 text-gray-400 text-sm">
                        <li>• Use the search bar to find songs by title or artist</li>
                        <li>• Filter by Language: Tamil, English, or Bilingual</li>
                        <li>• Filter by Category: Worship, Praise, Gospel, etc.</li>
                      </ul>
                    </GuideItem>
                    
                    <GuideItem title="View Modes" color="purple">
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <div className="bg-white/5 p-3 rounded-lg text-center">
                          <div className="font-semibold text-white text-sm">Tamil</div>
                          <div className="text-xs text-gray-500">Original script</div>
                        </div>
                        <div className="bg-white/5 p-3 rounded-lg text-center">
                          <div className="font-semibold text-white text-sm">Transliteration</div>
                          <div className="text-xs text-gray-500">English letters</div>
                        </div>
                        <div className="bg-white/5 p-3 rounded-lg text-center">
                          <div className="font-semibold text-white text-sm">Both</div>
                          <div className="text-xs text-gray-500">Combined view</div>
                        </div>
                      </div>
                    </GuideItem>
                    
                    <GuideItem title="Download Options" color="emerald">
                      <ul className="space-y-1 text-gray-400 text-sm">
                        <li>• Download as PowerPoint with customizable settings</li>
                        <li>• Choose background color, font, and size</li>
                        <li>• Preview before downloading</li>
                      </ul>
                    </GuideItem>
                  </div>
                </GuideSection>

                {/* Service Planner */}
                <GuideSection
                  icon={<Calendar size={28} />}
                  title="Worship Service Planner"
                  color="purple"
                >
                  <div className="space-y-4">
                    <GuideItem title="Building Your Service" color="purple">
                      <div className="grid md:grid-cols-2 gap-3 mt-2">
                        {[
                          { icon: <Music size={16} />, label: 'Add Songs', desc: 'From library or custom' },
                          { icon: <BookOpen size={16} />, label: 'Bible Verses', desc: 'Display scripture' },
                          { icon: <FileText size={16} />, label: 'Announcements', desc: 'Show messages' },
                          { icon: <Settings size={16} />, label: 'Settings', desc: 'Customize look' },
                        ].map((item, i) => (
                          <div key={i} className="bg-white/5 p-3 rounded-lg flex items-center gap-3">
                            <div className="text-purple-400">{item.icon}</div>
                            <div>
                              <div className="font-semibold text-white text-sm">{item.label}</div>
                              <div className="text-xs text-gray-500">{item.desc}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </GuideItem>
                    
                    <GuideItem title="Features" color="amber">
                      <ul className="space-y-1 text-gray-400 text-sm">
                        <li>• Reorder items with up/down buttons</li>
                        <li>• Duplicate items for quick copying</li>
                        <li>• Auto-save every 30 seconds</li>
                        <li>• Export/Import services as JSON files</li>
                      </ul>
                    </GuideItem>
                  </div>
                </GuideSection>

                {/* Presentation Modes */}
                <GuideSection
                  icon={<Monitor size={28} />}
                  title="Presentation Modes"
                  color="emerald"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Single Screen */}
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-blue-500 p-2 rounded-lg">
                          <Play size={20} className="text-white" />
                        </div>
                        <h4 className="font-bold text-white">Single Screen</h4>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">Simple fullscreen presentation</p>
                      <ul className="space-y-1 text-xs text-gray-500">
                        <li>✓ Fullscreen presentation</li>
                        <li>✓ Keyboard navigation</li>
                        <li>✓ Grid view for slides</li>
                        <li>✓ Timer display</li>
                      </ul>
                    </div>

                    {/* Dual Screen */}
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-5 relative">
                      <div className="absolute top-3 right-3 bg-amber-400 text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full">PRO</div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-purple-500 p-2 rounded-lg">
                          <Monitor size={20} className="text-white" />
                        </div>
                        <h4 className="font-bold text-white">Dual Screen</h4>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">Professional presenter control</p>
                      <ul className="space-y-1 text-xs text-gray-500">
                        <li>✓ Control window on laptop</li>
                        <li>✓ Main display for audience</li>
                        <li>✓ Next slide preview</li>
                        <li>✓ Mobile remote via QR code</li>
                      </ul>
                    </div>
                  </div>
                </GuideSection>

                {/* Keyboard Shortcuts */}
                <GuideSection
                  icon={<Keyboard size={28} />}
                  title="Keyboard Shortcuts"
                  color="orange"
                >
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      { key: '→ / Space', action: 'Next Slide' },
                      { key: '←', action: 'Previous Slide' },
                      { key: 'Home', action: 'First Slide' },
                      { key: 'End', action: 'Last Slide' },
                      { key: 'G', action: 'Grid View' },
                      { key: 'F', action: 'Fullscreen' },
                      { key: 'B', action: 'Black Screen' },
                      { key: 'Esc', action: 'Exit' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                        <span className="text-gray-400 text-sm">{item.action}</span>
                        <kbd className="bg-slate-800 text-amber-400 px-3 py-1 rounded font-mono text-sm border border-white/10">
                          {item.key}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </GuideSection>

                {/* Pro Tips */}
                <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl p-8 border border-purple-500/20">
                  <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                    <Lightbulb size={24} className="text-amber-400" />
                    Pro Tips for Excellence
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { title: 'Before Service', tips: ['Build service in planner', 'Test presentation 30 min early', 'Check all lyrics'] },
                      { title: 'During Service', tips: ['Use dual-screen mode', 'Watch next slide preview', 'Use keyboard shortcuts'] },
                      { title: 'Presentation Tips', tips: ['Use high contrast backgrounds', 'Font size 32-36pt', '2 lines per slide'] },
                      { title: 'Mobile & Offline', tips: ['Works on tablets', 'Pages cached offline', 'Download PPTs as backup'] },
                    ].map((section, i) => (
                      <div key={i} className="bg-white/5 rounded-xl p-5 border border-white/10">
                        <h4 className="font-bold text-white mb-3">{section.title}</h4>
                        <ul className="space-y-1">
                          {section.tips.map((tip, j) => (
                            <li key={j} className="text-sm text-gray-400 flex items-start gap-2">
                              <span className="text-emerald-400 mt-1">✓</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Need Help CTA */}
                <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] rounded-2xl p-8 border border-white/10 text-center">
                  <h2 className="text-2xl font-bold mb-4 text-white">Need More Help?</h2>
                  <p className="text-gray-400 mb-6">We're here to support you</p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Link href="/tutorials">
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold transition">
                        Watch Tutorials
                      </button>
                    </Link>
                    <Link href="/tips">
                      <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-bold transition">
                        Browse Tips
                      </button>
                    </Link>
                    <Link href="/contact">
                      <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition">
                        Contact Support
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function GuideSection({ icon, title, color, children }) {
  const colorClasses = {
    blue: 'from-blue-500/10 border-blue-500/20',
    purple: 'from-purple-500/10 border-purple-500/20',
    emerald: 'from-emerald-500/10 border-emerald-500/20',
    orange: 'from-orange-500/10 border-orange-500/20',
    amber: 'from-amber-500/10 border-amber-500/20',
  };

  const iconColors = {
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    emerald: 'text-emerald-400',
    orange: 'text-orange-400',
    amber: 'text-amber-400',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} to-transparent rounded-2xl p-6 border`}>
      <div className="flex items-center gap-3 mb-5">
        <div className={iconColors[color]}>{icon}</div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function GuideItem({ title, color, children }) {
  const borderColors = {
    blue: 'border-blue-500/30',
    purple: 'border-purple-500/30',
    emerald: 'border-emerald-500/30',
    orange: 'border-orange-500/30',
    amber: 'border-amber-500/30',
  };

  return (
    <div className={`bg-white/5 rounded-xl p-4 border-l-4 ${borderColors[color]}`}>
      <h4 className="font-bold text-white mb-2">{title}</h4>
      {children}
    </div>
  );
}