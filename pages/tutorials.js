import Link from 'next/link';
import { Play, Clock, BarChart, ChevronLeft, BookOpen } from 'lucide-react';

const tutorials = [
  {
    category: "ProPresenter",
    videos: [
      {
        title: "ProPresenter 7 - Complete Beginner's Guide",
        duration: "45:30",
        level: "Beginner",
        thumbnail: "https://via.placeholder.com/400x225/3b82f6/ffffff?text=ProPresenter+Basics",
        description: "Learn the fundamentals of ProPresenter 7 from scratch",
        link: "https://www.youtube.com/results?search_query=propresenter+7+tutorial+beginner"
      },
      {
        title: "Creating Beautiful Slide Templates",
        duration: "28:15",
        level: "Intermediate",
        thumbnail: "https://via.placeholder.com/400x225/8b5cf6/ffffff?text=Slide+Templates",
        description: "Design stunning worship slides with custom templates",
        link: "https://www.youtube.com/results?search_query=propresenter+slide+templates"
      },
      {
        title: "Stage Display Setup Tutorial",
        duration: "35:20",
        level: "Advanced",
        thumbnail: "https://via.placeholder.com/400x225/ec4899/ffffff?text=Stage+Display",
        description: "Configure stage displays for your worship team",
        link: "https://www.youtube.com/results?search_query=propresenter+stage+display+setup"
      }
    ]
  },
  {
    category: "OBS Studio",
    videos: [
      {
        title: "OBS Studio Setup for Church Live Streaming",
        duration: "52:10",
        level: "Beginner",
        thumbnail: "https://via.placeholder.com/400x225/10b981/ffffff?text=OBS+Setup",
        description: "Complete setup guide for streaming your church service",
        link: "https://www.youtube.com/results?search_query=obs+studio+church+setup"
      },
      {
        title: "Multi-Camera Switching in OBS",
        duration: "38:45",
        level: "Intermediate",
        thumbnail: "https://via.placeholder.com/400x225/f59e0b/ffffff?text=Multi-Camera",
        description: "Professional camera switching techniques",
        link: "https://www.youtube.com/results?search_query=obs+multi+camera+switching"
      },
      {
        title: "Lower Thirds and Graphics",
        duration: "25:30",
        level: "Intermediate",
        thumbnail: "https://via.placeholder.com/400x225/ef4444/ffffff?text=Graphics",
        description: "Add professional graphics to your live stream",
        link: "https://www.youtube.com/results?search_query=obs+lower+thirds+tutorial"
      }
    ]
  },
  {
    category: "Audio Mixing",
    videos: [
      {
        title: "Church Sound System Basics",
        duration: "41:20",
        level: "Beginner",
        thumbnail: "https://via.placeholder.com/400x225/6366f1/ffffff?text=Audio+Basics",
        description: "Understanding your church sound system",
        link: "https://www.youtube.com/results?search_query=church+sound+system+basics"
      },
      {
        title: "Mixing Worship Music - Complete Guide",
        duration: "1:05:15",
        level: "Intermediate",
        thumbnail: "https://via.placeholder.com/400x225/14b8a6/ffffff?text=Mixing+Guide",
        description: "Professional mixing techniques for worship",
        link: "https://www.youtube.com/results?search_query=mixing+worship+music+tutorial"
      },
      {
        title: "Eliminating Feedback",
        duration: "22:40",
        level: "Beginner",
        thumbnail: "https://via.placeholder.com/400x225/f43f5e/ffffff?text=No+Feedback",
        description: "Ring out your system and prevent feedback",
        link: "https://www.youtube.com/results?search_query=eliminate+audio+feedback"
      }
    ]
  },
  {
    category: "Video Production",
    videos: [
      {
        title: "Church Video Production 101",
        duration: "48:25",
        level: "Beginner",
        thumbnail: "https://via.placeholder.com/400x225/8b5cf6/ffffff?text=Video+101",
        description: "Getting started with church video production",
        link: "https://www.youtube.com/results?search_query=church+video+production+basics"
      },
      {
        title: "Lighting Your Church Service",
        duration: "36:50",
        level: "Intermediate",
        thumbnail: "https://via.placeholder.com/400x225/f59e0b/ffffff?text=Lighting",
        description: "Professional lighting setup for worship services",
        link: "https://www.youtube.com/results?search_query=church+lighting+tutorial"
      },
      {
        title: "Editing Sermon Videos",
        duration: "44:30",
        level: "Intermediate",
        thumbnail: "https://via.placeholder.com/400x225/3b82f6/ffffff?text=Video+Editing",
        description: "Edit and publish sermon videos professionally",
        link: "https://www.youtube.com/results?search_query=editing+sermon+videos"
      }
    ]
  }
];

export default function Tutorials() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-white hover:underline mb-4 inline-block flex items-center gap-2">
            <ChevronLeft size={20} />
            Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <BookOpen size={48} />
            <h1 className="text-5xl font-bold">Video Tutorials</h1>
          </div>
          <p className="text-xl">Step-by-step guides to master church tech tools</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Info Banner */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-12">
            <h3 className="text-xl font-bold text-blue-900 mb-2">📺 External Video Links</h3>
            <p className="text-blue-800">
              These links will take you to YouTube for high-quality video tutorials. We've curated the best content to help you learn quickly.
            </p>
          </div>

          {/* Tutorial Categories */}
          {tutorials.map((category, idx) => (
            <div key={idx} className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-gray-800">{category.category}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.videos.map((video, vidx) => (
                  <VideoCard key={vidx} video={video} />
                ))}
              </div>
            </div>
          ))}

          {/* Additional Resources */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-12 text-white text-center mt-16">
            <h2 className="text-4xl font-bold mb-4">Need More Help?</h2>
            <p className="text-xl mb-8">Check out our tips section for quick solutions and best practices</p>
            <Link href="/tips" className="inline-block bg-white text-green-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition">
              Browse Tips
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoCard({ video }) {
  const levelColors = {
    Beginner: 'bg-green-100 text-green-700',
    Intermediate: 'bg-blue-100 text-blue-700',
    Advanced: 'bg-purple-100 text-purple-700'
  };

  return (
    <a
      href={video.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group"
    >
      <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-purple-500">
        {/* Thumbnail */}
        <div className="relative overflow-hidden bg-gray-200 aspect-video">
          <img 
            src={video.thumbnail} 
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-60 transition">
            <div className="bg-white rounded-full p-4 group-hover:scale-110 transition-transform">
              <Play className="text-purple-600" size={32} fill="currentColor" />
            </div>
          </div>
          {/* Duration Badge */}
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
            <Clock size={14} />
            {video.duration}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${levelColors[video.level]}`}>
              {video.level}
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition">
            {video.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {video.description}
          </p>
        </div>
      </div>
    </a>
  );
}