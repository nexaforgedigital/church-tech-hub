import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download, Eye, Share2, Heart, ChevronLeft, Maximize, Settings, Home, Trash2, Edit } from 'lucide-react';
import PptxGenJS from 'pptxgenjs';
import { songStorage } from '../../utils/songStorage';
import { useRouter } from 'next/router';

export default function SongPage({ songId }) {
  const router = useRouter();
  const [song, setSong] = useState(null);
  const [viewMode, setViewMode] = useState('original');
  const [fontSize, setFontSize] = useState('small');
  const [loading, setLoading] = useState(true);
  const [showPptSettings, setShowPptSettings] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
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
      // Check if it's a custom song (starts with 'custom-')
      if (songId.toString().startsWith('custom-')) {
        const customSongs = songStorage.getCustomSongs();
        const customSong = customSongs.find(s => s.id === songId);
        
        if (customSong) {
          setSong(customSong);
          setLoading(false);
          return;
        } else {
          console.error('Custom song not found');
          setSong(null);
          setLoading(false);
          return;
        }
      }
      
      // Try to fetch from API for default songs
      const response = await fetch(`/api/songs/${songId}`);
      if (response.ok) {
        const data = await response.json();
        setSong(data);
      } else {
        setSong(demoSong);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching song:', error);
      const customSongs = songStorage.getCustomSongs();
      const customSong = customSongs.find(s => s.id === songId);
      
      if (customSong) {
        setSong(customSong);
      } else {
        setSong(demoSong);
      }
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
    if (!song) return;

    const ppt = new PptxGenJS();
    ppt.layout = 'LAYOUT_16x9';

    // Title Slide
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

    // Lyrics slides
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
    if (!song || !song.lyrics) return [];
    
    const linesPerSlide = pptSettings.linesPerSlide;
    const { tamil = [], english = [], transliteration = [] } = song.lyrics;
    let allLines = [];

    switch(viewMode) {
      case 'original':
        if (tamil.length === 0) {
          alert('Tamil lyrics not available. Please select another view mode.');
          return [];
        }
        allLines = tamil.map(l => l.text);
        break;
        
      case 'transliteration':
        if (transliteration.length === 0) {
          alert('Transliteration not available. Please select another view mode.');
          return [];
        }
        allLines = transliteration.map(l => l.text);
        break;
        
      case 'both':
        if (tamil.length === 0 && transliteration.length === 0) {
          alert('Lyrics not available. Please add lyrics first.');
          return [];
        }
        
        const maxLen = Math.max(tamil.length, transliteration.length);
        for (let i = 0; i < maxLen; i += linesPerSlide) {
          let slideText = '';
          for (let j = 0; j < linesPerSlide && (i + j) < maxLen; j++) {
            if (tamil[i + j]) {
              slideText += tamil[i + j].text + '\n';
            }
            if (transliteration[i + j]) {
              slideText += transliteration[i + j].text + '\n\n';
            }
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

  const handleDeleteSong = () => {
    if (!song.isCustom) {
      alert('Only custom songs can be deleted');
      return;
    }
    
    songStorage.deleteSong(song.id);
    router.push('/lyrics');
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Song Not Found</h2>
          <p className="text-gray-600 mb-6">The song you're looking for doesn't exist or has been removed.</p>
          <Link href="/lyrics">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition">
              Back to Library
            </button>
          </Link>
        </div>
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
            <div className="flex items-center gap-3">
              {song.isCustom && (
                <>
                  <Link href={`/edit-song/${song.id}`}>
                    <button className="flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 backdrop-blur px-4 py-2 rounded-full transition">
                      <Edit size={20} />
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 backdrop-blur px-4 py-2 rounded-full transition"
                    title="Delete Custom Song"
                  >
                    <Trash2 size={20} />
                    Delete
                  </button>
                </>
              )}
              <Link href="/" className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur px-4 py-2 rounded-full transition">
                <Home size={20} />
                Home
              </Link>
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-2">{song.title}</h1>
          <p className="text-xl opacity-90">{song.artist || 'Unknown Artist'}</p>
          <div className="flex gap-4 mt-4">
            <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full">{song.language}</span>
            <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full">{song.category}</span>
            {song.isCustom && (
              <span className="bg-green-500 px-4 py-2 rounded-full font-bold">Custom Song</span>
            )}
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} className="text-red-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Delete Custom Song?</h2>
              <p className="text-gray-600">
                Are you sure you want to delete "<strong>{song.title}</strong>"? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSong}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition"
              >
                Delete Song
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .text-8xl { font-size: 3rem !important; }
          .text-7xl { font-size: 2.5rem !important; }
          .text-6xl { font-size: 2rem !important; }
          .text-5xl { font-size: 1.875rem !important; }
          .text-4xl { font-size: 1.5rem !important; }
          .text-3xl { font-size: 1.25rem !important; }
          .text-2xl { font-size: 1.125rem !important; }
          .text-xl { font-size: 1rem !important; }
          
          .p-12 { padding: 1.5rem !important; }
          .p-8 { padding: 1rem !important; }
          .py-12 { padding-top: 2rem !important; padding-bottom: 2rem !important; }
          
          pre {
            white-space: pre-wrap;
            word-wrap: break-word;
            overflow-wrap: break-word;
          }
        }
      `}</style>
    </div>
  );
}

function renderLyrics(song, mode, fontSize) {
  if (!song || !song.lyrics) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">No lyrics available</p>
      </div>
    );
  }

  const { tamil = [], english = [], transliteration = [] } = song.lyrics;

  switch(mode) {
    case 'original':
      if (tamil.length === 0) {
        return (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">Tamil lyrics not available</p>
          </div>
        );
      }
      return tamil.map((line, i) => (
        <p key={i} className={`${fontSize} text-gray-800 leading-relaxed`}>
          {line.text}
        </p>
      ));
    
    case 'transliteration':
      if (transliteration.length === 0) {
        return (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">Transliteration not available</p>
          </div>
        );
      }
      return transliteration.map((line, i) => (
        <p key={i} className={`${fontSize} text-gray-800 leading-relaxed`}>
          {line.text}
        </p>
      ));
    
    case 'both':
      if (tamil.length === 0 && transliteration.length === 0) {
        return (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">Lyrics not available in this format</p>
          </div>
        );
      }
      
      const maxLength = Math.max(tamil.length, transliteration.length);
      const result = [];
      
      for (let i = 0; i < maxLength; i++) {
        if (tamil[i] || transliteration[i]) {
          result.push(
            <div key={i} className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-l-4 border-purple-500">
              {tamil[i] && (
                <p className={`${fontSize} text-gray-800 mb-2 font-semibold`}>
                  {tamil[i].text}
                </p>
              )}
              {transliteration[i] && (
                <p className={`${fontSize} text-purple-700 italic`}>
                  {transliteration[i].text}
                </p>
              )}
            </div>
          );
        }
      }
      return result;
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