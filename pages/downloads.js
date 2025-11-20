import Link from 'next/link';
import { Download, ExternalLink, Star, Users, ChevronLeft } from 'lucide-react';

const softwareCategories = [
  {
    name: "Presentation Software",
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
      },
      {
        name: "vMix",
        description: "Live video production software with powerful mixing capabilities",
        platform: "Windows",
        price: "Paid",
        rating: 4.8,
        downloads: "25K+",
        link: "https://www.vmix.com/",
        features: ["Multi-camera switching", "Live streaming", "NDI support", "Instant replay"]
      }
    ]
  },
  {
    name: "Audio Software",
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
        name: "Elvanto",
        description: "Church management software for connecting your church",
        platform: "Web & Mobile",
        price: "Paid",
        rating: 4.7,
        downloads: "40K+",
        link: "https://www.elvanto.com/",
        features: ["Roster scheduling", "Communication", "Giving", "Reporting"]
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

export default function Downloads() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-white hover:underline mb-4 inline-block flex items-center gap-2">
            <ChevronLeft size={20} />
            Back to Home
          </Link>
          <h1 className="text-5xl font-bold mb-4">Software Downloads</h1>
          <p className="text-xl">Essential tools and software for your church tech ministry</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Info Banner */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-12">
            <h3 className="text-xl font-bold text-blue-900 mb-2">💡 Before You Download</h3>
            <p className="text-blue-800">
              These are external links to official software websites. Always download from official sources to ensure safety and get the latest versions. 
              Check system requirements before downloading.
            </p>
          </div>

          {/* Categories */}
          {softwareCategories.map((category, idx) => (
            <div key={idx} className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-gray-800">{category.name}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((software, sidx) => (
                  <SoftwareCard key={sidx} software={software} />
                ))}
              </div>
            </div>
          ))}

          {/* Additional Resources */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-white text-center mt-16">
            <h2 className="text-4xl font-bold mb-4">Need Help Choosing?</h2>
            <p className="text-xl mb-8">Check out our tutorials for detailed guides on each software</p>
            <Link href="/tutorials" className="inline-block bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition">
              View Tutorials
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function SoftwareCard({ software }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-green-500">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{software.name}</h3>
            <p className="text-gray-600 text-sm mb-3">{software.description}</p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
            software.price === 'Free' 
              ? 'bg-green-100 text-green-700' 
              : software.price === 'Free/Paid'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-purple-100 text-purple-700'
          }`}>
            {software.price}
          </span>
          <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-semibold">
            {software.platform}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Star className="text-yellow-500 fill-yellow-500" size={16} />
            <span className="font-semibold">{software.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>{software.downloads}</span>
          </div>
        </div>

        {/* Features */}
        <div className="mb-4">
          <h4 className="font-semibold text-sm text-gray-700 mb-2">Key Features:</h4>
          <ul className="space-y-1">
            {software.features.slice(0, 3).map((feature, idx) => (
              <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
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
          className="block w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition text-center"
        >
          <span className="flex items-center justify-center gap-2">
            <Download size={18} />
            Visit Official Site
            <ExternalLink size={14} />
          </span>
        </a>
      </div>
    </div>
  );
}