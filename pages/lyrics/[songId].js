import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download, Eye, Share2, Heart, ChevronLeft, Maximize, Settings, Home } from 'lucide-react';
import PptxGenJS from 'pptxgenjs';

export default function SongPage({ songId }) {
  const [song, setSong] = useState(null);
  const [viewMode, setViewMode] = useState('original');
  const [fontSize, setFontSize] = useState('small');
  const [loading, setLoading] = useState(true);
  const [showPptSettings, setShowPptSettings] = useState(false);
  
  // PPT Customization Settings
  const [pptSettings, setPptSettings] = useState({
    background: 'gradient-blue',
    fontFamily: 'Arial',
    fontSize: 32,
    textColor: 'FFFFFF',
    linesPerSlide: 2
  });

  useEffect(() => {
    fetchSong();
  }, [songId]);

  const fetchSong = async () => {
    try {
      const response = await fetch(`/api/songs/${songId}`);
      const data = await response.json();
      setSong(data);
      setLoading(false);
    } catch (error) {
      setSong(demoSong);
      setLoading(false);
    }
  };

  const backgrounds = {
    'gradient-blue': { color: '1e3a8a' },
    'gradient-purple': { color: '6b21a8' },
    'gradient-green': { color: '15803d' },
    'gradient-red': { color: '991b1b' },
    'black': { color: '000000' },
    'dark-blue': { color: '1e293b' },
  };

  const generatePPT = () => {
    const ppt = new PptxGenJS();
    ppt.layout = 'LAYOUT_16x9';

    // Title Slide - PERFECTLY CENTERED
    let slide1 = ppt.addSlide();
    slide1.background = { color: backgrounds[pptSettings.background].color };
    
    slide1.addText(song.title, {
      x: 0, y: '40%', w: '100%', h: 1.5,
      fontSize: 48, 
      color: pptSettings.textColor, 
      bold: true, 
      align: 'center',
      valign: 'middle',
      fontFace: pptSettings.fontFamily
    });

    // Get lyrics based on view mode
    const verses = getVersesForPPT();

    // Lyrics slides - ALWAYS CENTERED
    verses.forEach((verse) => {
      let slide = ppt.addSlide();
      slide.background = { color: backgrounds[pptSettings.background].color };
      
      slide.addText(verse, {
        x: 0.5, 
        y: '30%',
        w: 9, 
        h: '40%',
        fontSize: pptSettings.fontSize,
        color: pptSettings.textColor,
        align: 'center',
        valign: 'middle',
        lineSpacing: 40,
        fontFace: pptSettings.fontFamily
      });
    });

    // End slide
    let endSlide = ppt.addSlide();
    endSlide.background = { color: backgrounds[pptSettings.background].color };
    endSlide.addText('', {
      x: 0, y: '45%', w: '100%', h: 1.5,
      fontSize: 48, 
      color: pptSettings.textColor, 
      bold: true, 
      align: 'center',
      valign: 'middle',
      fontFace: pptSettings.fontFamily
    });

    ppt.writeFile({ fileName: `${song.title}.pptx` });
  };

  const getVersesForPPT = () => {
    if (!song) return [];
    
    const linesPerSlide = pptSettings.linesPerSlide;
    let allLines = [];

    switch(viewMode) {
      case 'original':
        allLines = song.lyrics.tamil.map(l => l.text);
        break;
      case 'transliteration':
        allLines = song.lyrics.transliteration.map(l => l.text);
        break;
      case 'both':
        for (let i = 0; i < song.lyrics.tamil.length; i += linesPerSlide) {
          let slideText = '';
          for (let j = 0; j < linesPerSlide && (i + j) < song.lyrics.tamil.length; j++) {
            slideText += song.lyrics.tamil[i + j].text + '\n';
            slideText += song.lyrics.transliteration[i + j].text + '\n\n';
          }
          allLines.push(slideText.trim());
        }
        return allLines;
      default:
        return [];
    }

    const verses = [];
    for (let i = 0; i < allLines.length; i += linesPerSlide) {
      verses.push(allLines.slice(i, i + linesPerSlide).join('\n'));
    }
    return verses;
  };

  const openPresentationMode = () => {
    const params = new URLSearchParams({
      mode: viewMode,
      bg: pptSettings.background,
      font: pptSettings.fontFamily,
      fontSize: pptSettings.fontSize
    });
    window.open(`/present/${songId}?${params.toString()}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <div className="text-2xl font-semibold text-gray-700">Loading...</div>
        </div>
      </div>
    );
  }

  if (!song) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Song not found</div>
      </div>
    );
  }

  const fontSizes = {
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-3xl'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header with Logo */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-12 shadow-xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/lyrics" className="flex items-center gap-2 text-white hover:underline hover:gap-3 transition-all">
              <ChevronLeft size={20} />
              Back to Library
            </Link>
            <Link href="/" className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur px-4 py-2 rounded-full transition">
              <Home size={20} />
              Home
            </Link>
          </div>
          <h1 className="text-5xl font-bold mb-2">{song.title}</h1>
          <p className="text-xl opacity-90">{song.artist}</p>
          <div className="flex gap-4 mt-4">
            <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full">{song.language}</span>
            <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full">{song.category}</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white shadow-lg sticky top-0 z-40 border-b-2 border-purple-200">
        <div className="container mx-auto px-4 py-6">
          {/* View Mode Selector */}
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={() => setViewMode('original')}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                viewMode === 'original' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Original (தமிழ்)
            </button>
            <button
              onClick={() => setViewMode('transliteration')}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                viewMode === 'transliteration' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Transliteration
            </button>
            <button
              onClick={() => setViewMode('both')}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                viewMode === 'both' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Both (Tamil + Transliteration)
            </button>
          </div>

          {/* Font Size Control */}
          <div className="flex items-center gap-4 mb-4">
            <span className="text-gray-700 font-semibold">Font Size:</span>
            <button
              onClick={() => setFontSize('small')}
              className={`px-4 py-2 rounded-lg transition ${fontSize === 'small' ? 'bg-purple-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Small
            </button>
            <button
              onClick={() => setFontSize('medium')}
              className={`px-4 py-2 rounded-lg transition ${fontSize === 'medium' ? 'bg-purple-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Medium
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-4 py-2 rounded-lg transition ${fontSize === 'large' ? 'bg-purple-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Large
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={openPresentationMode}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:shadow-xl transition-all text-sm"
            >
              <Maximize size={18} />
              Present Mode
            </button>
            
            <button
              onClick={() => setShowPptSettings(!showPptSettings)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:shadow-xl transition-all text-sm"
            >
              <Settings size={18} />
              PPT Settings
            </button>

            <button
              onClick={generatePPT}
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:shadow-xl transition-all text-sm"
            >
              <Download size={18} />
              Download PPT
            </button>
          </div>

          {/* PPT Settings Panel */}
          {showPptSettings && (
            <div className="mt-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-purple-200">
              <h3 className="text-xl font-bold mb-4 text-gray-800">PowerPoint Customization</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Background Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Background Color</label>
                  <select
                    value={pptSettings.background}
                    onChange={(e) => setPptSettings({...pptSettings, background: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="gradient-blue">Deep Blue</option>
                    <option value="gradient-purple">Royal Purple</option>
                    <option value="gradient-green">Forest Green</option>
                    <option value="gradient-red">Crimson Red</option>
                    <option value="black">Classic Black</option>
                    <option value="dark-blue">Dark Navy</option>
                  </select>
                </div>

                {/* Font Family */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Font Family</label>
                  <select
                    value={pptSettings.fontFamily}
                    onChange={(e) => setPptSettings({...pptSettings, fontFamily: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="Arial">Arial</option>
                    <option value="Calibri">Calibri</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Verdana">Verdana</option>
                  </select>
                </div>

                {/* Font Size */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Font Size: {pptSettings.fontSize}pt</label>
                  <input
                    type="range"
                    min="24"
                    max="48"
                    value={pptSettings.fontSize}
                    onChange={(e) => setPptSettings({...pptSettings, fontSize: parseInt(e.target.value)})}
                    className="w-full"
                  />
                </div>

                {/* Lines per Slide */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Lines per Slide</label>
                  <select
                    value={pptSettings.linesPerSlide}
                    onChange={(e) => setPptSettings({...pptSettings, linesPerSlide: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="1">1 Line</option>
                    <option value="2">2 Lines (Recommended)</option>
                    <option value="3">3 Lines</option>
                    <option value="4">4 Lines</option>
                  </select>
                </div>
              </div>

              {/* Download Button Inside Settings */}
              <div className="mt-6 flex gap-4">
                <button
                  onClick={openPresentationMode}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-lg font-bold hover:shadow-xl transition-all text-lg"
                >
                  <Eye size={24} />
                  Apply & Preview
                </button>
                <button
                  onClick={generatePPT}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-lg font-bold hover:shadow-xl transition-all text-lg"
                >
                  <Download size={24} />
                  Download PPT
                </button>
              </div>

              <div className="mt-4 p-4 bg-blue-100 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 <strong>Tip:</strong> Preview your settings by clicking "Present Mode" before downloading. Text is always centered for best readability.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lyrics Display */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12 border-2 border-purple-100">
          <div className="space-y-8">
            {renderLyrics(song, viewMode, fontSizes[fontSize])}
          </div>
        </div>
      </div>
    </div>
  );
}

function renderLyrics(song, mode, fontSize) {
  switch(mode) {
    case 'original':
      return song.lyrics.tamil.map((line, i) => (
        <p key={i} className={`${fontSize} text-gray-800 leading-relaxed`}>
          {line.text}
        </p>
      ));
    
    case 'transliteration':
      return song.lyrics.transliteration.map((line, i) => (
        <p key={i} className={`${fontSize} text-gray-800 leading-relaxed`}>
          {line.text}
        </p>
      ));
    
    case 'both':
      return song.lyrics.tamil.map((line, i) => (
        <div key={i} className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-l-4 border-purple-500">
          <p className={`${fontSize} text-gray-800 mb-2 font-semibold`}>{line.text}</p>
          <p className={`${fontSize} text-purple-700 italic`}>
            {song.lyrics.transliteration[i]?.text}
          </p>
        </div>
      ));
  }
}

export async function getServerSideProps(context) {
  return {
    props: {
      songId: context.params.songId
    }
  };
}

const demoSong = {
  id: 1,
  title: "கர்த்தர் என் மேய்ப்பர்",
  artist: "Tamil Christian Song",
  language: "Tamil",
  category: "Worship",
  lyrics: {
    tamil: [
      { line: 1, text: "கர்த்தர் என் மேய்ப்பர்" },
      { line: 2, text: "எனக்கு குறைவு இல்லை" },
      { line: 3, text: "புல்லுள்ள இடங்களில் என்னைப் படுக்கச் செய்வார்" },
      { line: 4, text: "அமர்ந்த தண்ணீர்கள் அருகே என்னை நடத்துவார்" }
    ],
    english: [
      { line: 1, text: "The Lord is my shepherd" },
      { line: 2, text: "I shall not want" },
      { line: 3, text: "He makes me lie down in green pastures" },
      { line: 4, text: "He leads me beside still waters" }
    ],
    transliteration: [
      { line: 1, text: "Karththar en meypar" },
      { line: 2, text: "Enakku kuraivu illai" },
      { line: 3, text: "Pullulla idangalil ennai padukka seivaar" },
      { line: 4, text: "Amarntha thanneerkal arugae ennai nadaththuvaar" }
    ]
  }
};