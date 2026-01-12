import Link from 'next/link';
import Head from 'next/head';
import { Download, ExternalLink, Star, Users, Sparkles } from 'lucide-react';

// Cross Pattern Component
const CrossPattern = ({ opacity = 0.02 }) => (
  <div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <pattern id="cross-pattern-downloads" x="0" y="0" width="80" height="100" patternUnits="userSpaceOnUse">
        <rect x="36" y="10" width="8" height="80" rx="1" fill="white"/>
        <rect x="24" y="25" width="32" height="8" rx="1" fill="white"/>
      </pattern>
      <rect width="100%" height="100%" fill="url(#cross-pattern-downloads)"/>
    </svg>
  </div>
);

const softwareCategories = [
  {
    name: "Presentation Software",
    color: "blue",
    items: [
      {
        name: "ProPresenter 7",
        description: "Industry-leading worship presentation software with powerful features",
        platform: "Windows & Mac",
        price: "Paid",
        rating: 4.8,
        downloads: "50K+",
        link: "https://renewedvision.com/propresenter/",
        features: ["Multi-screen support", "Live video integration", "Stage display", "Planning Center integration"]
      },
      {
        name: "OpenLP",
        description: "Free and open-source worship presentation software",
        platform: "Windows, Mac & Linux",
        price: "Free",
        rating: 4.5,
        downloads: "100K+",
        link: "https://openlp.org/",
        features: ["Cross-platform", "Bible integration", "Song database", "Custom themes"]
      },
      {
        name: "EasyWorship",
        description: "User-friendly church presentation software",
        platform: "Windows",
        price: "Paid",
        rating: 4.6,
        downloads: "30K+",
        link: "https://www.easyworship.com/",
        features: ["Built-in media library", "Scripture integration", "Easy to learn", "Cloud backup"]
      }
    ]
  },
  {
    name: "Video Production",
    color: "purple",
    items: [
      {
        name: "OBS Studio",
        description: "Free and open-source software for video recording and live streaming",
        platform: "Windows, Mac & Linux",
        price: "Free",
        rating: 4.9,
        downloads: "500K+",
        link: "https://obsproject.com/",
        features: ["Live streaming", "Scene switching", "Audio mixing", "Unlimited sources"]
      },
      {
        name: "DaVinci Resolve",
        description: "Professional video editing software with free version",
        platform: "Windows, Mac & Linux",
        price: "Free/Paid",
        rating: 4.7,
        downloads: "200K+",
        link: "https://www.blackmagicdesign.com/products/davinciresolve",
        features: ["Color grading", "Video editing", "Audio post-production", "Visual effects"]
      }
    ]
  },
  {
    name: "Audio Software",
    color: "emerald",
    items: [
      {
        name: "Audacity",
        description: "Free, open-source audio editing software",
        platform: "Windows, Mac & Linux",
        price: "Free",
        rating: 4.6,
        downloads: "1M+",
        link: "https://www.audacityteam.org/",
        features: ["Multi-track editing", "Audio effects", "Noise reduction", "Easy to use"]
      },
      {
        name: "Reaper",
        description: "Affordable DAW for audio production and recording",
        platform: "Windows, Mac & Linux",
        price: "Paid",
        rating: 4.8,
        downloads: "100K+",
        link: "https://www.reaper.fm/",
        features: ["Multi-track recording", "VST support", "Customizable", "Low latency"]
      }
    ]
  },
  {
    name: "Church Management",
    color: "orange",
    items: [
      {
        name: "Planning Center",
        description: "Complete church management and planning solution",
        platform: "Web & Mobile",
        price: "Paid",
        rating: 4.9,
        downloads: "75K+",
        link: "https://www.planningcenter.com/",
        features: ["Service planning", "Check-in", "Giving", "People management"]
      },
      {
        name: "Breeze ChMS",
        description: "Simple church management software",
        platform: "Web & Mobile",
        price: "Paid",
        rating: 4.6,
        downloads: "30K+",
        link: "https://www.breezechms.com/",
        features: ["Member database", "Online giving", "Event management", "Mobile apps"]
      }
    ]
  }
];

// Color mapping
const colorClasses = {
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', bar: 'bg-blue-500' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400', bar: 'bg-purple-500' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', bar: 'bg-emerald-500' },
  orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400', bar: 'bg-orange-500' }
};

const priceColors = {
  'Free': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Paid': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Free/Paid': 'bg-blue-500/20 text-blue-400 border-blue-500/30'
};

export default function Downloads() {
  return (
    <>
      <Head>
        <title>Software Downloads - ChurchAssist</title>
        <meta name="description" content="Essential tools and software for your church tech ministry." />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
        {/* Hero Section */}
        <section className="relative py-16 overflow-hidden">
          <CrossPattern opacity={0.02} />
          
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl mb-6 shadow-lg shadow-emerald-500/30">
                <Download size={32} className="text-white" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black mb-4 text-white">
                Software <span className="text-amber-400">Downloads</span>
              </h1>
              <p className="text-lg text-gray-400">
                Essential tools and software for your church tech ministry
              </p>
            </div>
          </div>
        </section>

        {/* Info Banner */}
        <section className="py-4">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
                <Sparkles size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-300">
                  <strong>Before You Download:</strong> These are external links to official software websites. Always download from official sources to ensure safety and get the latest versions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Software Categories */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              {softwareCategories.map((category, idx) => (
                <div key={idx}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-2 h-8 rounded-full ${colorClasses[category.color].bar}`}></div>
                    <h2 className="text-2xl font-bold text-white">{category.name}</h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.items.map((software, sidx) => (
                      <SoftwareCard key={sidx} software={software} color={category.color} />
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
                <h2 className="text-2xl font-bold mb-4 text-white">Need Help Choosing?</h2>
                <p className="text-gray-400 mb-6">Check out our tutorials for detailed guides on each software</p>
                <Link href="/tutorials">
                  <button className="bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-amber-500/30 transition">
                    View Tutorials
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

function SoftwareCard({ software, color }) {
  return (
    <div className={`${colorClasses[color].bg} border ${colorClasses[color].border} rounded-2xl p-5 hover:border-amber-500/30 transition-all duration-300`}>
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white mb-2">{software.name}</h3>
        <p className="text-gray-400 text-sm line-clamp-2">{software.description}</p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`text-xs px-2 py-1 rounded-full font-semibold border ${priceColors[software.price]}`}>
          {software.price}
        </span>
        <span className="text-xs bg-white/5 text-gray-400 px-2 py-1 rounded-full border border-white/10">
          {software.platform}
        </span>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4 text-sm">
        <div className="flex items-center gap-1 text-amber-400">
          <Star size={14} fill="currentColor" />
          <span className="font-semibold">{software.rating}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <Users size={14} />
          <span>{software.downloads}</span>
        </div>
      </div>

      {/* Features */}
      <div className="mb-4">
        <ul className="space-y-1">
          {software.features.slice(0, 3).map((feature, idx) => (
            <li key={idx} className="text-xs text-gray-400 flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Download Button */}
      <a
        href={software.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 py-3 rounded-xl font-bold text-center hover:shadow-lg hover:shadow-amber-500/30 transition text-sm"
      >
        <span className="flex items-center justify-center gap-2">
          <Download size={16} />
          Visit Official Site
          <ExternalLink size={12} />
        </span>
      </a>
    </div>
  );
}