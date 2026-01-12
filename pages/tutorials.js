import Link from 'next/link';
import Head from 'next/head';
import { Play, Clock, BookOpen, ExternalLink, Sparkles } from 'lucide-react';

// Cross Pattern Component
const CrossPattern = ({ opacity = 0.02 }) => (
  <div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <pattern id="cross-pattern-tutorials" x="0" y="0" width="80" height="100" patternUnits="userSpaceOnUse">
        <rect x="36" y="10" width="8" height="80" rx="1" fill="white"/>
        <rect x="24" y="25" width="32" height="8" rx="1" fill="white"/>
      </pattern>
      <rect width="100%" height="100%" fill="url(#cross-pattern-tutorials)"/>
    </svg>
  </div>
);

const tutorials = [
  {
    category: "ProPresenter",
    color: "blue",
    videos: [
      {
        title: "ProPresenter 7 - Complete Beginner's Guide",
        duration: "45:30",
        level: "Beginner",
        description: "Learn the fundamentals of ProPresenter 7 from scratch",
        link: "https://www.youtube.com/results?search_query=propresenter+7+tutorial+beginner"
      },
      {
        title: "Creating Beautiful Slide Templates",
        duration: "28:15",
        level: "Intermediate",
        description: "Design stunning worship slides with custom templates",
        link: "https://www.youtube.com/results?search_query=propresenter+slide+templates"
      },
      {
        title: "Stage Display Setup Tutorial",
        duration: "35:20",
        level: "Advanced",
        description: "Configure stage displays for your worship team",
        link: "https://www.youtube.com/results?search_query=propresenter+stage+display+setup"
      }
    ]
  },
  {
    category: "OBS Studio",
    color: "purple",
    videos: [
      {
        title: "OBS Studio Setup for Church Live Streaming",
        duration: "52:10",
        level: "Beginner",
        description: "Complete setup guide for streaming your church service",
        link: "https://www.youtube.com/results?search_query=obs+studio+church+setup"
      },
      {
        title: "Multi-Camera Switching in OBS",
        duration: "38:45",
        level: "Intermediate",
        description: "Professional camera switching techniques",
        link: "https://www.youtube.com/results?search_query=obs+multi+camera+switching"
      },
      {
        title: "Lower Thirds and Graphics",
        duration: "25:30",
        level: "Intermediate",
        description: "Add professional graphics to your live stream",
        link: "https://www.youtube.com/results?search_query=obs+lower+thirds+tutorial"
      }
    ]
  },
  {
    category: "Audio Mixing",
    color: "emerald",
    videos: [
      {
        title: "Church Sound System Basics",
        duration: "41:20",
        level: "Beginner",
        description: "Understanding your church sound system",
        link: "https://www.youtube.com/results?search_query=church+sound+system+basics"
      },
      {
        title: "Mixing Worship Music - Complete Guide",
        duration: "1:05:15",
        level: "Intermediate",
        description: "Professional mixing techniques for worship",
        link: "https://www.youtube.com/results?search_query=mixing+worship+music+tutorial"
      },
      {
        title: "Eliminating Feedback",
        duration: "22:40",
        level: "Beginner",
        description: "Ring out your system and prevent feedback",
        link: "https://www.youtube.com/results?search_query=eliminate+audio+feedback"
      }
    ]
  },
  {
    category: "Video Production",
    color: "orange",
    videos: [
      {
        title: "Church Video Production 101",
        duration: "48:25",
        level: "Beginner",
        description: "Getting started with church video production",
        link: "https://www.youtube.com/results?search_query=church+video+production+basics"
      },
      {
        title: "Lighting Your Church Service",
        duration: "36:50",
        level: "Intermediate",
        description: "Professional lighting setup for worship services",
        link: "https://www.youtube.com/results?search_query=church+lighting+tutorial"
      },
      {
        title: "Editing Sermon Videos",
        duration: "44:30",
        level: "Intermediate",
        description: "Edit and publish sermon videos professionally",
        link: "https://www.youtube.com/results?search_query=editing+sermon+videos"
      }
    ]
  }
];

// Color mapping for dynamic classes
const colorClasses = {
  blue: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    text: 'text-blue-400',
    badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  },
  purple: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    text: 'text-purple-400',
    badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-400',
    badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
  },
  orange: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    text: 'text-orange-400',
    badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
  }
};

const levelColors = {
  Beginner: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Intermediate: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Advanced: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
};

export default function Tutorials() {
  return (
    <>
      <Head>
        <title>Video Tutorials - ChurchAssist</title>
        <meta name="description" content="Step-by-step video guides to master church tech tools." />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
        {/* Hero Section */}
        <section className="relative py-16 overflow-hidden">
          <CrossPattern opacity={0.02} />
          
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mb-6 shadow-lg shadow-purple-500/30">
                <BookOpen size={32} className="text-white" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black mb-4 text-white">
                Video <span className="text-amber-400">Tutorials</span>
              </h1>
              <p className="text-lg text-gray-400">
                Step-by-step guides to master church tech tools
              </p>
            </div>
          </div>
        </section>

        {/* Info Banner */}
        <section className="py-4">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
                <ExternalLink size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-300">
                  <strong>External Links:</strong> These links will take you to YouTube for high-quality video tutorials. We've curated the best content to help you learn quickly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tutorials Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              {tutorials.map((category, idx) => (
                <div key={idx}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-2 h-8 rounded-full ${colorClasses[category.color].text.replace('text-', 'bg-')}`}></div>
                    <h2 className="text-2xl font-bold text-white">{category.category}</h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.videos.map((video, vidx) => (
                      <VideoCard key={vidx} video={video} color={category.color} />
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
              <div className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 rounded-2xl p-8 border border-amber-500/20 text-center">
                <Sparkles size={40} className="text-amber-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4 text-white">Need More Help?</h2>
                <p className="text-gray-400 mb-6">Check out our tips section for quick solutions and best practices</p>
                <Link href="/tips">
                  <button className="bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-amber-500/30 transition">
                    Browse Tech Tips
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

function VideoCard({ video, color }) {
  return (
    <a
      href={video.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div className={`${colorClasses[color].bg} border ${colorClasses[color].border} rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all duration-300`}>
        {/* Thumbnail Placeholder */}
        <div className="relative aspect-video bg-slate-800 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800"></div>
          <div className="relative z-10 bg-white/10 backdrop-blur p-4 rounded-full group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
            <Play size={32} className="text-white" fill="white" />
          </div>
          
          {/* Duration Badge */}
          <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-mono flex items-center gap-1">
            <Clock size={12} />
            {video.duration}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs px-2 py-1 rounded-full font-semibold border ${levelColors[video.level]}`}>
              {video.level}
            </span>
          </div>
          <h3 className="font-bold text-white mb-2 group-hover:text-amber-400 transition-colors line-clamp-2">
            {video.title}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2">
            {video.description}
          </p>
        </div>
      </div>
    </a>
  );
}