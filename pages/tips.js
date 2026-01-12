import Link from 'next/link';
import Head from 'next/head';
import { Lightbulb, Zap, Shield, Settings, Users, Mic, Video, Monitor, Sparkles } from 'lucide-react';

// Cross Pattern Component
const CrossPattern = ({ opacity = 0.02 }) => (
  <div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <pattern id="cross-pattern-tips" x="0" y="0" width="80" height="100" patternUnits="userSpaceOnUse">
        <rect x="36" y="10" width="8" height="80" rx="1" fill="white"/>
        <rect x="24" y="25" width="32" height="8" rx="1" fill="white"/>
      </pattern>
      <rect width="100%" height="100%" fill="url(#cross-pattern-tips)"/>
    </svg>
  </div>
);

// Color mapping for dynamic Tailwind classes
const colorClasses = {
  blue: { 
    bg: 'bg-blue-500/10', 
    border: 'border-blue-500/20', 
    text: 'text-blue-400',
    iconBg: 'bg-blue-500/20',
    bar: 'bg-blue-500',
    tipBorder: 'border-l-blue-500'
  },
  purple: { 
    bg: 'bg-purple-500/10', 
    border: 'border-purple-500/20', 
    text: 'text-purple-400',
    iconBg: 'bg-purple-500/20',
    bar: 'bg-purple-500',
    tipBorder: 'border-l-purple-500'
  },
  emerald: { 
    bg: 'bg-emerald-500/10', 
    border: 'border-emerald-500/20', 
    text: 'text-emerald-400',
    iconBg: 'bg-emerald-500/20',
    bar: 'bg-emerald-500',
    tipBorder: 'border-l-emerald-500'
  },
  orange: { 
    bg: 'bg-orange-500/10', 
    border: 'border-orange-500/20', 
    text: 'text-orange-400',
    iconBg: 'bg-orange-500/20',
    bar: 'bg-orange-500',
    tipBorder: 'border-l-orange-500'
  },
  red: { 
    bg: 'bg-red-500/10', 
    border: 'border-red-500/20', 
    text: 'text-red-400',
    iconBg: 'bg-red-500/20',
    bar: 'bg-red-500',
    tipBorder: 'border-l-red-500'
  },
  indigo: { 
    bg: 'bg-indigo-500/10', 
    border: 'border-indigo-500/20', 
    text: 'text-indigo-400',
    iconBg: 'bg-indigo-500/20',
    bar: 'bg-indigo-500',
    tipBorder: 'border-l-indigo-500'
  }
};

const levelColors = {
  Beginner: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Intermediate: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Advanced: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Essential: 'bg-red-500/20 text-red-400 border-red-500/30'
};

const tipCategories = [
  {
    icon: <Monitor size={28} />,
    title: "Presentation Best Practices",
    color: "blue",
    tips: [
      { title: "Use High-Quality Images", description: "Always use images with at least 1920x1080 resolution for full HD displays. Avoid pixelated or stretched images.", level: "Beginner" },
      { title: "Keep Text Readable", description: "Use large fonts (minimum 48pt) and high contrast. Avoid fancy fonts that are hard to read from distance.", level: "Beginner" },
      { title: "Test Before Service", description: "Always do a full run-through at least 30 minutes before service. Check all videos, transitions, and backgrounds.", level: "Essential" },
      { title: "Create Backup Slides", description: "Have backup slides ready for technical difficulties. Include 'Please Stand' and 'Please Be Seated' slides.", level: "Intermediate" }
    ]
  },
  {
    icon: <Video size={28} />,
    title: "Live Streaming Tips",
    color: "purple",
    tips: [
      { title: "Internet Speed Matters", description: "For 1080p streaming, you need at least 10 Mbps upload speed. Test your connection before going live.", level: "Essential" },
      { title: "Use Ethernet, Not WiFi", description: "Always use a wired connection for streaming. WiFi can be unstable and cause buffering.", level: "Beginner" },
      { title: "Multi-Camera Setup", description: "Use at least 2 cameras - one wide shot and one close-up. This keeps viewers engaged and provides variety.", level: "Intermediate" },
      { title: "Monitor Audio Levels", description: "Keep audio levels between -12dB and -6dB. Set up audio limiters to prevent distortion.", level: "Advanced" }
    ]
  },
  {
    icon: <Mic size={28} />,
    title: "Audio Excellence",
    color: "emerald",
    tips: [
      { title: "Soundcheck is Critical", description: "Always do a proper soundcheck with the worship team. Check each mic and instrument individually.", level: "Essential" },
      { title: "Position Speakers Correctly", description: "Main speakers should be aimed at the audience, not the stage. Use monitors for stage sound.", level: "Beginner" },
      { title: "Fight Feedback", description: "Use a 31-band EQ to ring out the room. Turn up gain slowly until feedback, then reduce that frequency.", level: "Intermediate" },
      { title: "Wireless Mic Management", description: "Always have fresh batteries. Change them weekly, not when they die. Keep backups ready.", level: "Essential" }
    ]
  },
  {
    icon: <Settings size={28} />,
    title: "Technical Setup",
    color: "orange",
    tips: [
      { title: "Cable Management", description: "Use cable ties and label everything. Messy cables lead to mistakes and safety hazards.", level: "Beginner" },
      { title: "Create a Setup Diagram", description: "Document your entire setup with diagrams. This helps when troubleshooting or training new volunteers.", level: "Intermediate" },
      { title: "Regular Maintenance", description: "Clean equipment monthly. Check all connections, update software, and replace worn cables.", level: "Essential" },
      { title: "Power Management", description: "Use surge protectors and UPS systems. Protect expensive equipment from power surges.", level: "Advanced" }
    ]
  },
  {
    icon: <Users size={28} />,
    title: "Team Management",
    color: "red",
    tips: [
      { title: "Train Your Team Well", description: "Create training videos and documentation. Don't rely on memory - write everything down.", level: "Essential" },
      { title: "Build a Rotation Schedule", description: "Avoid burnout by rotating team members. Have at least 3 people trained for each position.", level: "Intermediate" },
      { title: "Communicate Changes", description: "Use group chats or email to notify team of changes. Keep everyone informed about service plans.", level: "Beginner" },
      { title: "Encourage and Appreciate", description: "Regularly thank your volunteers. Recognition goes a long way in keeping teams motivated.", level: "Essential" }
    ]
  },
  {
    icon: <Shield size={28} />,
    title: "Troubleshooting Quick Fixes",
    color: "indigo",
    tips: [
      { title: "No Sound? Check These First", description: "1) Is it muted? 2) Is the gain up? 3) Is the channel on? 4) Is phantom power on (for condensers)?", level: "Beginner" },
      { title: "Computer Frozen?", description: "Force quit the application (Ctrl+Alt+Del on Windows, Cmd+Option+Esc on Mac). Have backup ready.", level: "Essential" },
      { title: "Video Not Showing?", description: "Check: 1) HDMI connection, 2) Input source selected, 3) Resolution settings, 4) Cable quality.", level: "Beginner" },
      { title: "Keep Emergency Kit", description: "Always have: extra cables, adapters, batteries, duct tape, and a backup laptop ready.", level: "Essential" }
    ]
  }
];

export default function Tips() {
  return (
    <>
      <Head>
        <title>Tech Tips - ChurchAssist</title>
        <meta name="description" content="Pro tips to level up your church tech game." />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
        {/* Hero Section */}
        <section className="relative py-16 overflow-hidden">
          <CrossPattern opacity={0.02} />
          
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mb-6 shadow-lg shadow-orange-500/30">
                <Lightbulb size={32} className="text-white" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black mb-4 text-white">
                Tech <span className="text-amber-400">Tips</span> & Best Practices
              </h1>
              <p className="text-lg text-gray-400">
                Pro tips to level up your church tech game
              </p>
            </div>
          </div>
        </section>

        {/* Pro Tip Banner */}
        <section className="py-4">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 rounded-xl p-5 text-center">
                <Zap size={28} className="text-amber-400 mx-auto mb-2" />
                <h2 className="text-lg font-bold text-white mb-1">Pro Tip of the Day</h2>
                <p className="text-amber-300">
                  "Always arrive 30 minutes early. The best tech teams make it look effortless because they're prepared."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tips Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-8">
              {tipCategories.map((category, idx) => (
                <div key={idx} className={`${colorClasses[category.color].bg} border ${colorClasses[category.color].border} rounded-2xl p-6`}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`${colorClasses[category.color].iconBg} p-3 rounded-xl ${colorClasses[category.color].text}`}>
                      {category.icon}
                    </div>
                    <h2 className="text-xl font-bold text-white">{category.title}</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {category.tips.map((tip, tidx) => (
                      <TipCard key={tidx} tip={tip} color={category.color} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl p-8 border border-purple-500/20 text-center">
                <Sparkles size={40} className="text-amber-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4 text-white">Want More Detailed Guides?</h2>
                <p className="text-gray-400 mb-6">Check out our video tutorials for step-by-step instructions</p>
                <Link href="/tutorials">
                  <button className="bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-amber-500/30 transition">
                    Watch Tutorials
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function TipCard({ tip, color }) {
  return (
    <div className={`bg-white/5 rounded-xl p-4 border-l-4 ${colorClasses[color].tipBorder} hover:bg-white/10 transition-all`}>
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-bold text-white">{tip.title}</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${levelColors[tip.level]} flex-shrink-0 ml-2`}>
          {tip.level}
        </span>
      </div>
      <p className="text-gray-400 text-sm leading-relaxed">{tip.description}</p>
    </div>
  );
}