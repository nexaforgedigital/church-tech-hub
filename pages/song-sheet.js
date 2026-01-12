import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { FileText, Download, Plus, Trash2, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Cross Pattern Component
const CrossPattern = ({ opacity = 0.02 }) => (
  <div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <pattern id="cross-pattern-sheet" x="0" y="0" width="80" height="100" patternUnits="userSpaceOnUse">
        <rect x="36" y="10" width="8" height="80" rx="1" fill="white"/>
        <rect x="24" y="25" width="32" height="8" rx="1" fill="white"/>
      </pattern>
      <rect width="100%" height="100%" fill="url(#cross-pattern-sheet)"/>
    </svg>
  </div>
);

export default function SongSheet() {
  const [allSongs, setAllSongs] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [sheetTitle, setSheetTitle] = useState('Worship Song Sheet');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('both');
  const [generating, setGenerating] = useState(false);
  
  const [layoutSettings, setLayoutSettings] = useState({
    columns: 3,
    fontSize: 10,
    includeTitle: true
  });

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await fetch('/api/songs');
      const data = await response.json();
      setAllSongs(data);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const addSong = (song) => {
    if (!selectedSongs.find(s => s.id === song.id)) {
      setSelectedSongs([...selectedSongs, song]);
    }
  };

  const removeSong = (songId) => {
    setSelectedSongs(selectedSongs.filter(s => s.id !== songId));
  };

  const moveSongUp = (index) => {
    if (index > 0) {
      const newList = [...selectedSongs];
      [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
      setSelectedSongs(newList);
    }
  };

  const moveSongDown = (index) => {
    if (index < selectedSongs.length - 1) {
      const newList = [...selectedSongs];
      [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
      setSelectedSongs(newList);
    }
  };

  const generatePDF = async () => {
    const element = document.getElementById('pdf-content');
    
    if (!element) {
      alert('Please wait for content to load');
      return;
    }

    setGenerating(true);
    element.style.display = 'block';

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('portrait', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`${sheetTitle}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      element.style.display = 'none';
      setGenerating(false);
    }
  };

  const getLyrics = (song) => {
    if (!song.lyrics) return [];
    
    if (viewMode === 'original') {
      return song.lyrics.tamil?.map(l => l.text) || [];
    } else if (viewMode === 'transliteration') {
      return song.lyrics.transliteration?.map(l => l.text) || [];
    } else {
      const combined = [];
      const tamil = song.lyrics.tamil || [];
      const trans = song.lyrics.transliteration || [];
      
      tamil.forEach((line, i) => {
        combined.push(
          <div key={`t-${i}`} style={{ fontWeight: 'bold', marginBottom: '2px' }}>
            {line.text}
          </div>
        );
        if (trans[i]) {
          combined.push(
            <div key={`r-${i}`} style={{ fontStyle: 'italic', color: '#666', marginBottom: '4px' }}>
              {trans[i].text}
            </div>
          );
        }
      });
      return combined;
    }
  };

  const filteredSongs = allSongs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>Song Sheet Creator - ChurchAssist</title>
        <meta name="description" content="Create printable multi-column song sheets for choir." />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
        {/* Hero Section */}
        <section className="relative py-12 overflow-hidden">
          <CrossPattern opacity={0.02} />
          
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-2xl mb-6 shadow-lg shadow-cyan-500/30">
                <FileText size={32} className="text-white" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black mb-4 text-white">
                Song Sheet <span className="text-amber-400">Creator</span>
              </h1>
              <p className="text-lg text-gray-400">
                Print 6-12 songs per A4 sheet in multi-column format
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-6">
                
                {/* Left: Song Selection */}
                <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur rounded-2xl p-6 border border-white/10">
                  <h2 className="text-xl font-bold mb-4 text-white">Available Songs</h2>
                  <input
                    type="text"
                    placeholder="Search songs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-amber-500/50 focus:outline-none text-white placeholder-gray-500 mb-4"
                  />
                  <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                    {filteredSongs.map((song) => (
                      <div key={song.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white truncate">{song.title}</div>
                          <div className="text-sm text-gray-400">{song.artist}</div>
                        </div>
                        <button
                          onClick={() => addSong(song)}
                          className="bg-amber-500 hover:bg-amber-600 text-slate-900 p-2 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed ml-2"
                          disabled={selectedSongs.find(s => s.id === song.id)}
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Settings & Selected */}
                <div className="space-y-6">
                  {/* Settings Card */}
                  <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur rounded-2xl p-6 border border-white/10">
                    <h2 className="text-xl font-bold mb-4 text-white">Sheet Settings</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Sheet Title</label>
                        <input
                          type="text"
                          value={sheetTitle}
                          onChange={(e) => setSheetTitle(e.target.value)}
                          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-amber-500/50 focus:outline-none text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Columns: {layoutSettings.columns} ({Math.ceil(12 / layoutSettings.columns)} songs/page)
                        </label>
                        <input
                          type="range"
                          min="2"
                          max="5"
                          value={layoutSettings.columns}
                          onChange={(e) => setLayoutSettings({...layoutSettings, columns: parseInt(e.target.value)})}
                          className="w-full accent-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Font Size: {layoutSettings.fontSize}px
                        </label>
                        <input
                          type="range"
                          min="8"
                          max="14"
                          value={layoutSettings.fontSize}
                          onChange={(e) => setLayoutSettings({...layoutSettings, fontSize: parseInt(e.target.value)})}
                          className="w-full accent-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Lyrics Format</label>
                        <div className="grid grid-cols-3 gap-2">
                          {['original', 'transliteration', 'both'].map((mode) => (
                            <button
                              key={mode}
                              onClick={() => setViewMode(mode)}
                              className={`px-3 py-2 rounded-lg font-semibold text-sm transition capitalize ${
                                viewMode === mode 
                                  ? 'bg-amber-500 text-slate-900' 
                                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
                              }`}
                            >
                              {mode === 'original' ? 'Tamil' : mode === 'transliteration' ? 'Translit' : 'Both'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Selected Songs Card */}
                  <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur rounded-2xl p-6 border border-white/10">
                    <h3 className="text-lg font-bold mb-3 text-white">
                      Selected Songs <span className="text-amber-400">({selectedSongs.length})</span>
                    </h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar mb-4">
                      {selectedSongs.length === 0 ? (
                        <p className="text-gray-500 text-center py-6">No songs selected</p>
                      ) : (
                        selectedSongs.map((song, index) => (
                          <div key={song.id} className="flex items-center gap-2 p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                            <span className="font-bold text-amber-400 w-6">{index + 1}.</span>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-white truncate text-sm">{song.title}</div>
                            </div>
                            <div className="flex gap-1">
                              <button onClick={() => moveSongUp(index)} disabled={index === 0} className="p-1 hover:bg-white/10 rounded disabled:opacity-30 text-gray-400">
                                <ChevronUp size={16} />
                              </button>
                              <button onClick={() => moveSongDown(index)} disabled={index === selectedSongs.length - 1} className="p-1 hover:bg-white/10 rounded disabled:opacity-30 text-gray-400">
                                <ChevronDown size={16} />
                              </button>
                              <button onClick={() => removeSong(song.id)} className="p-1 hover:bg-red-500/20 rounded text-red-400">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <button
                      onClick={generatePDF}
                      disabled={selectedSongs.length === 0 || generating}
                      className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-amber-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {generating ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-900"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Download size={22} />
                          Generate PDF ({selectedSongs.length} songs)
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hidden PDF Content */}
        <div
          id="pdf-content"
          style={{
            display: 'none',
            width: '210mm',
            minHeight: '297mm',
            padding: '10mm',
            backgroundColor: 'white',
            fontFamily: 'Arial, sans-serif'
          }}
        >
          {layoutSettings.includeTitle && (
            <div style={{ textAlign: 'center', marginBottom: '10mm', paddingBottom: '5mm', borderBottom: '2px solid #000' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#000' }}>{sheetTitle}</h1>
            </div>
          )}
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: `repeat(${layoutSettings.columns}, 1fr)`,
            gap: '8mm',
            fontSize: `${layoutSettings.fontSize}px`,
            lineHeight: '1.4',
            color: '#000'
          }}>
            {selectedSongs.map((song, index) => (
              <div key={song.id} style={{ breakInside: 'avoid' }}>
                <div style={{ fontWeight: 'bold', fontSize: `${layoutSettings.fontSize + 2}px`, marginBottom: '3mm', borderBottom: '1px solid #ccc', paddingBottom: '2mm', color: '#000' }}>
                  {index + 1}. {song.title}
                </div>
                <div style={{ marginBottom: '5mm' }}>
                  {viewMode === 'both' ? (
                    getLyrics(song)
                  ) : (
                    getLyrics(song).map((line, i) => (
                      <div key={i} style={{ marginBottom: '2px', color: '#000' }}>{line}</div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.3);
        }
      `}</style>
    </>
  );
}