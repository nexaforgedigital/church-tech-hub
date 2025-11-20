import Link from 'next/link';
import { Lightbulb, ChevronLeft, Zap, Shield, Settings, Users, Mic, Video, Monitor } from 'lucide-react';

const tipCategories = [
  {
    icon: <Monitor size={32} />,
    title: "Presentation Best Practices",
    color: "blue",
    tips: [
      {
        title: "Use High-Quality Images",
        description: "Always use images with at least 1920x1080 resolution for full HD displays. Avoid pixelated or stretched images.",
        level: "Beginner"
      },
      {
        title: "Keep Text Readable",
        description: "Use large fonts (minimum 48pt) and high contrast. Avoid fancy fonts that are hard to read from distance.",
        level: "Beginner"
      },
      {
        title: "Test Before Service",
        description: "Always do a full run-through at least 30 minutes before service. Check all videos, transitions, and backgrounds.",
        level: "Essential"
      },
      {
        title: "Create Backup Slides",
        description: "Have backup slides ready for technical difficulties. Include 'Please Stand' and 'Please Be Seated' slides.",
        level: "Intermediate"
      }
    ]
  },
  {
    icon: <Video size={32} />,
    title: "Live Streaming Tips",
    color: "purple",
    tips: [
      {
        title: "Internet Speed Matters",
        description: "For 1080p streaming, you need at least 10 Mbps upload speed. Test your connection before going live.",
        level: "Essential"
      },
      {
        title: "Use Ethernet, Not WiFi",
        description: "Always use a wired connection for streaming. WiFi can be unstable and cause buffering.",
        level: "Beginner"
      },
      {
        title: "Multi-Camera Setup",
        description: "Use at least 2 cameras - one wide shot and one close-up. This keeps viewers engaged and provides variety.",
        level: "Intermediate"
      },
      {
        title: "Monitor Audio Levels",
        description: "Keep audio levels between -12dB and -6dB. Set up audio limiters to prevent distortion.",
        level: "Advanced"
      }
    ]
  },
  {
    icon: <Mic size={32} />,
    title: "Audio Excellence",
    color: "green",
    tips: [
      {
        title: "Soundcheck is Critical",
        description: "Always do a proper soundcheck with the worship team. Check each mic and instrument individually.",
        level: "Essential"
      },
      {
        title: "Position Speakers Correctly",
        description: "Main speakers should be aimed at the audience, not the stage. Use monitors for stage sound.",
        level: "Beginner"
      },
      {
        title: "Fight Feedback",
        description: "Use a 31-band EQ to ring out the room. Turn up gain slowly until feedback, then reduce that frequency.",
        level: "Intermediate"
      },
      {
        title: "Wireless Mic Management",
        description: "Always have fresh batteries. Change them weekly, not when they die. Keep backups ready.",
        level: "Essential"
      }
    ]
  },
  {
    icon: <Settings size={32} />,
    title: "Technical Setup",
    color: "orange",
    tips: [
      {
        title: "Cable Management",
        description: "Use cable ties and label everything. Messy cables lead to mistakes and safety hazards.",
        level: "Beginner"
      },
      {
        title: "Create a Setup Diagram",
        description: "Document your entire setup with diagrams. This helps when troubleshooting or training new volunteers.",
        level: "Intermediate"
      },
      {
        title: "Regular Maintenance",
        description: "Clean equipment monthly. Check all connections, update software, and replace worn cables.",
        level: "Essential"
      },
      {
        title: "Power Management",
        description: "Use surge protectors and UPS systems. Protect expensive equipment from power surges.",
        level: "Advanced"
      }
    ]
  },
  {
    icon: <Users size={32} />,
    title: "Team Management",
    color: "red",
    tips: [
      {
        title: "Train Your Team Well",
        description: "Create training videos and documentation. Don't rely on memory - write everything down.",
        level: "Essential"
      },
      {
        title: "Build a Rotation Schedule",
        description: "Avoid burnout by rotating team members. Have at least 3 people trained for each position.",
        level: "Intermediate"
      },
      {
        title: "Communicate Changes",
        description: "Use group chats or email to notify team of changes. Keep everyone informed about service plans.",
        level: "Beginner"
      },
      {
        title: "Encourage and Appreciate",
        description: "Regularly thank your volunteers. Recognition goes a long way in keeping teams motivated.",
        level: "Essential"
      }
    ]
  },
  {
    icon: <Shield size={32} />,
    title: "Troubleshooting Quick Fixes",
    color: "indigo",
    tips: [
      {
        title: "No Sound? Check These First",
        description: "1) Is it muted? 2) Is the gain up? 3) Is the channel on? 4) Is phantom power on (for condensers)?",
        level: "Beginner"
      },
      {
        title: "Computer Frozen?",
        description: "Force quit the application (Ctrl+Alt+Del on Windows, Cmd+Option+Esc on Mac). Have backup ready.",
        level: "Essential"
      },
      {
        title: "Video Not Showing?",
        description: "Check: 1) HDMI connection, 2) Input source selected, 3) Resolution settings, 4) Cable quality.",
        level: "Beginner"
      },
      {
        title: "Keep Emergency Kit",
        description: "Always have: extra cables, adapters, batteries, duct tape, and a backup laptop ready.",
        level: "Essential"
      }
    ]
  }
];

export default function Tips() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-20">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-white hover:underline mb-4 inline-block flex items-center gap-2">
            <ChevronLeft size={20} />
            Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <Lightbulb size={48} />
            <h1 className="text-5xl font-bold">Tech Tips & Best Practices</h1>
          </div>
          <p className="text-xl">Pro tips to level up your church tech game</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Quick Tips Banner */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-8 mb-12 text-center">
            <Zap className="mx-auto mb-4" size={48} />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Pro Tip of the Day</h2>
            <p className="text-xl text-gray-800">
              "Always arrive 30 minutes early. The best tech teams make it look effortless because they're prepared."
            </p>
          </div>

          {/* Categories */}
          <div className="space-y-12">
            {tipCategories.map((category, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`bg-${category.color}-100 p-4 rounded-xl text-${category.color}-600`}>
                    {category.icon}
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800">{category.title}</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {category.tips.map((tip, tidx) => (
                    <TipCard key={tidx} tip={tip} color={category.color} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white text-center mt-16">
            <h2 className="text-4xl font-bold mb-4">Want More Detailed Guides?</h2>
            <p className="text-xl mb-8">Check out our video tutorials for step-by-step instructions</p>
            <Link href="/tutorials" className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition">
              Watch Tutorials
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function TipCard({ tip, color }) {
  const levelColors = {
    Beginner: 'bg-green-100 text-green-700',
    Intermediate: 'bg-blue-100 text-blue-700',
    Advanced: 'bg-purple-100 text-purple-700',
    Essential: 'bg-red-100 text-red-700'
  };

  return (
    <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-400 transition-all hover:shadow-md">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-800">{tip.title}</h3>
        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${levelColors[tip.level]}`}>
          {tip.level}
        </span>
      </div>
      <p className="text-gray-600 leading-relaxed">{tip.description}</p>
    </div>
  );
}