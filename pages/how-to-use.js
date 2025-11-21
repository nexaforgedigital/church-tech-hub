import Link from 'next/link';
import { ChevronLeft, Music, Download, Maximize, Settings, Grid, Monitor, FileText, Calendar, Play, Eye, Palette, List } from 'lucide-react';

export default function HowToUse() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <pattern id="guide-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="2" fill="white"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#guide-pattern)"/>
          </svg>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl font-bold mb-6 drop-shadow-lg">📖 Complete User Guide</h1>
            <p className="text-2xl opacity-90 mb-8">
              Everything you need to know about Church Tech Hub
            </p>
            <p className="text-lg opacity-75">
              Professional worship presentation made simple
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-12">
          
          {/* Quick Start */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl shadow-xl p-8 border-2 border-green-200">
            <h2 className="text-4xl font-bold mb-6 text-green-900">🚀 Quick Start Guide</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="text-4xl mb-3">1️⃣</div>
                <h3 className="font-bold text-lg mb-2">Browse Lyrics</h3>
                <p className="text-gray-600">Search and find songs in our library of worship lyrics</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="text-4xl mb-3">2️⃣</div>
                <h3 className="font-bold text-lg mb-2">Plan Service</h3>
                <p className="text-gray-600">Build your worship service with songs, verses & announcements</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="text-4xl mb-3">3️⃣</div>
                <h3 className="font-bold text-lg mb-2">Present Live</h3>
                <p className="text-gray-600">Use dual-screen mode for professional presentation</p>
              </div>
            </div>
          </div>

          {/* Section 1: Lyrics Library */}
          <section className="bg-white rounded-3xl shadow-2xl p-10 border-2 border-blue-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-blue-100 p-4 rounded-2xl">
                <Music size={40} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-gray-800">Lyrics Library</h2>
                <p className="text-gray-600">Find and view worship songs</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500">
                <h3 className="font-bold text-xl mb-3 text-blue-900">🔍 Finding Songs</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>Search:</strong> Use the search bar to find songs by title or artist</li>
                  <li>• <strong>Filter by Language:</strong> Tamil, English, or Bilingual</li>
                  <li>• <strong>Filter by Category:</strong> Worship, Praise, Gospel, Christmas, Easter</li>
                  <li>• <strong>Browse All:</strong> Scroll through the complete library</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-6 rounded-xl border-l-4 border-purple-500">
                <h3 className="font-bold text-xl mb-3 text-purple-900">👁️ View Modes</h3>
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Original (தமிழ்)</h4>
                    <p className="text-sm text-gray-600">Tamil script lyrics</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Transliteration</h4>
                    <p className="text-sm text-gray-600">Tamil words in English letters</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Both</h4>
                    <p className="text-sm text-gray-600">Tamil + Transliteration together</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-500">
                <h3 className="font-bold text-xl mb-3 text-green-900">💾 Download Options</h3>
                <ul className="space-y-3 text-gray-700">
                  <li>
                    <strong>Download PowerPoint:</strong> Get ready-to-use presentation with your selected view mode
                  </li>
                  <li>
                    <strong>PPT Settings:</strong> Customize background, font, size, and lines per slide
                  </li>
                  <li>
                    <strong>Apply & Preview:</strong> Test settings in presentation mode before downloading
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2: Worship Service Planner */}
          <section className="bg-white rounded-3xl shadow-2xl p-10 border-2 border-purple-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-purple-100 p-4 rounded-2xl">
                <Calendar size={40} className="text-purple-600" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-gray-800">Worship Service Planner</h2>
                <p className="text-gray-600">Professional service planning & presentation</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border-2 border-purple-200">
                <h3 className="font-bold text-xl mb-4 text-purple-900">📋 Building Your Service</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Music size={18} className="text-blue-600" />
                      Add Songs
                    </h4>
                    <p className="text-sm text-gray-600">Select from your lyrics library</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <FileText size={18} className="text-green-600" />
                      Add Bible Verses
                    </h4>
                    <p className="text-sm text-gray-600">Display scripture passages</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Grid size={18} className="text-orange-600" />
                      Add Announcements
                    </h4>
                    <p className="text-sm text-gray-600">Show important messages</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Settings size={18} className="text-gray-600" />
                      Presentation Settings
                    </h4>
                    <p className="text-sm text-gray-600">Customize look & feel</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-6 rounded-xl border-l-4 border-yellow-500">
                <h3 className="font-bold text-xl mb-3 text-yellow-900">✨ Features</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>Reorder Items:</strong> Drag or use ▲▼ buttons to rearrange</li>
                  <li>• <strong>Duplicate Items:</strong> Quickly copy songs or announcements</li>
                  <li>• <strong>Auto-Save:</strong> Your service is automatically saved every 30 seconds</li>
                  <li>• <strong>Export/Import:</strong> Save services as JSON files for backup</li>
                  <li>• <strong>Clear All:</strong> Start fresh with one click</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl border-2 border-green-200">
                <h3 className="font-bold text-2xl mb-6 text-green-900">🎬 Presentation Modes</h3>
                
                <div className="space-y-6">
                  {/* Single Screen */}
                  <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-blue-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-blue-600 p-2 rounded-lg">
                        <Play size={24} className="text-white" />
                      </div>
                      <h4 className="text-xl font-bold">Single Screen Mode</h4>
                    </div>
                    <p className="text-gray-700 mb-4">
                      Perfect for simple presentations or when you only have one screen
                    </p>
                    <ul className="space-y-2 text-gray-600 text-sm">
                      <li>✓ Fullscreen presentation</li>
                      <li>✓ Keyboard navigation (← → Space)</li>
                      <li>✓ Grid view to jump to any slide</li>
                      <li>✓ Item list view</li>
                      <li>✓ Timer with pause/reset</li>
                      <li>✓ Progress indicator</li>
                    </ul>
                  </div>

                  {/* Dual Screen */}
                  <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-purple-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-purple-600 p-2 rounded-lg">
                        <Monitor size={24} className="text-white" />
                      </div>
                      <h4 className="text-xl font-bold">Dual-Screen Presenter Mode ⭐</h4>
                    </div>
                    <p className="text-gray-700 mb-4">
                      <strong>Professional mode</strong> with presenter control window and main presentation screen
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-semibold mb-2 text-purple-900">📺 Control Window (Your Screen)</h5>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• Large current slide preview</li>
                          <li>• Next slide preview</li>
                          <li>• Timer with controls</li>
                          <li>• Navigation buttons</li>
                          <li>• All slides thumbnail view</li>
                          <li>• Service order view</li>
                          <li>• Settings panel</li>
                          <li>• Notes display</li>
                          <li>• Progress bar</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-semibold mb-2 text-blue-900">🖥️ Main Screen (Audience)</h5>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• Fullscreen presentation</li>
                          <li>• Beautiful backgrounds</li>
                          <li>• Smooth transitions</li>
                          <li>• Auto-synced with control</li>
                          <li>• Professional appearance</li>
                          <li>• Custom fonts & colors</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-lg">
                      <h5 className="font-semibold mb-2 text-purple-900">🎯 How to Use Dual-Screen:</h5>
                      <ol className="space-y-2 text-sm text-gray-700">
                        <li><strong>1.</strong> Click "Open Presenter Control (Dual Screen)" in Service Planner</li>
                        <li><strong>2.</strong> Presenter Control window opens (keep this on your laptop)</li>
                        <li><strong>3.</strong> Click "Open Main Screen" button in Presenter Control</li>
                        <li><strong>4.</strong> Main presentation opens fullscreen (project this to audience)</li>
                        <li><strong>5.</strong> Control everything from your laptop screen!</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Song Sheets */}
          <section className="bg-white rounded-3xl shadow-2xl p-10 border-2 border-green-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-green-100 p-4 rounded-2xl">
                <FileText size={40} className="text-green-600" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-gray-800">Song Sheet Creator</h2>
                <p className="text-gray-600">Print multiple songs on one page</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-500">
                <h3 className="font-bold text-xl mb-3">📄 Creating Song Sheets</h3>
                <ol className="space-y-3 text-gray-700">
                  <li><strong>1.</strong> Select songs from the available list</li>
                  <li><strong>2.</strong> Reorder using ▲▼ buttons</li>
                  <li><strong>3.</strong> Adjust columns (2-5) - more columns = more songs per page</li>
                  <li><strong>4.</strong> Set font size (8-14pt) for readability</li>
                  <li><strong>5.</strong> Choose format: Tamil, Transliteration, or Both</li>
                  <li><strong>6.</strong> Click "Generate PDF" to download</li>
                </ol>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="font-bold text-xl mb-3 text-blue-900">💡 Pro Tips</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>3 columns</strong> fits about 6-8 songs per A4 page</li>
                  <li>• Print <strong>double-sided</strong> to save paper</li>
                  <li>• Use for conventions where projectors aren't available</li>
                  <li>• Perfect for choir practice or small groups</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 4: Presentation Mode Controls */}
          <section className="bg-white rounded-3xl shadow-2xl p-10 border-2 border-orange-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-orange-100 p-4 rounded-2xl">
                <Maximize size={40} className="text-orange-600" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-gray-800">Presentation Controls</h2>
                <p className="text-gray-600">Master keyboard shortcuts</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-orange-50 p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-4">⌨️ Keyboard Shortcuts</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg">
                    <span className="font-semibold">Next Slide</span>
                    <kbd className="bg-gray-200 px-3 py-1 rounded font-mono text-sm">→ or Space</kbd>
                  </div>
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg">
                    <span className="font-semibold">Previous Slide</span>
                    <kbd className="bg-gray-200 px-3 py-1 rounded font-mono text-sm">←</kbd>
                  </div>
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg">
                    <span className="font-semibold">Grid View</span>
                    <kbd className="bg-gray-200 px-3 py-1 rounded font-mono text-sm">G</kbd>
                  </div>
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg">
                    <span className="font-semibold">Item List</span>
                    <kbd className="bg-gray-200 px-3 py-1 rounded font-mono text-sm">L</kbd>
                  </div>
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg">
                    <span className="font-semibold">Fullscreen</span>
                    <kbd className="bg-gray-200 px-3 py-1 rounded font-mono text-sm">F</kbd>
                  </div>
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg">
                    <span className="font-semibold">Exit</span>
                    <kbd className="bg-gray-200 px-3 py-1 rounded font-mono text-sm">Esc</kbd>
                  </div>
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg">
                    <span className="font-semibold">First Slide</span>
                    <kbd className="bg-gray-200 px-3 py-1 rounded font-mono text-sm">Home</kbd>
                  </div>
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg">
                    <span className="font-semibold">Last Slide</span>
                    <kbd className="bg-gray-200 px-3 py-1 rounded font-mono text-sm">End</kbd>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-4">🖱️ Mouse Controls</h3>
                <div className="space-y-3 text-gray-700">
                  <div className="bg-white p-4 rounded-lg">
                    <p className="font-semibold mb-2">Move Mouse</p>
                    <p className="text-sm">Shows navigation controls (auto-hide after 2 seconds)</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="font-semibold mb-2">Click Slide Thumbnails</p>
                    <p className="text-sm">Jump directly to any slide</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="font-semibold mb-2">Click Item in List</p>
                    <p className="text-sm">Go to first slide of that item</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Pro Tips */}
          <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 rounded-3xl shadow-2xl p-10 text-white">
            <h2 className="text-4xl font-bold mb-8 text-center">💎 Pro Tips for Excellence</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <h3 className="font-bold text-xl mb-3">🎯 Before Service</h3>
                <ul className="space-y-2 text-sm">
                  <li>✓ Build your service in the planner</li>
                  <li>✓ Test presentation mode 30 minutes early</li>
                  <li>✓ Check all lyrics for accuracy</li>
                  <li>✓ Verify projector resolution matches settings</li>
                  <li>✓ Have backup PPT files downloaded</li>
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <h3 className="font-bold text-xl mb-3">🎬 During Service</h3>
                <ul className="space-y-2 text-sm">
                  <li>✓ Use dual-screen mode for better control</li>
                  <li>✓ Keep presenter control on your laptop</li>
                  <li>✓ Watch the next slide preview</li>
                  <li>✓ Use keyboard shortcuts for smooth transitions</li>
                  <li>✓ Monitor the timer</li>
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <h3 className="font-bold text-xl mb-3">🎨 Presentation Tips</h3>
                <ul className="space-y-2 text-sm">
                  <li>✓ Use high contrast backgrounds</li>
                  <li>✓ Font size 32-36pt for readability</li>
                  <li>✓ 2 lines per slide is ideal</li>
                  <li>✓ Test visibility from back of room</li>
                  <li>✓ Keep transitions smooth and simple</li>
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <h3 className="font-bold text-xl mb-3">📱 Mobile & Offline</h3>
                <ul className="space-y-2 text-sm">
                  <li>✓ Works on tablets and phones</li>
                  <li>✓ Pages cached for offline access</li>
                  <li>✓ Download PPTs as backup</li>
                  <li>✓ Export services for sharing</li>
                  <li>✓ Auto-save protects your work</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Need Help */}
          <section className="bg-white rounded-3xl shadow-2xl p-10 border-2 border-gray-200 text-center">
            <h2 className="text-4xl font-bold mb-6">Need More Help?</h2>
            <p className="text-xl text-gray-600 mb-8">
              We're here to support you in making your worship services excellent
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/tutorials">
                <div className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition shadow-lg cursor-pointer">
                  Watch Video Tutorials
                </div>
              </Link>
              <Link href="/tips">
                <div className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-bold transition shadow-lg cursor-pointer">
                  Browse Tech Tips
                </div>
              </Link>
              <Link href="/contact">
                <div className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold transition shadow-lg cursor-pointer">
                  Contact Support
                </div>
              </Link>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}