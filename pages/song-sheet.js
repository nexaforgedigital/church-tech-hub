import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Download, Plus, Trash2, FileText } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function SongSheet() {
  const [allSongs, setAllSongs] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [sheetTitle, setSheetTitle] = useState('Worship Song Sheet');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('both');
  
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

    // Show the hidden element temporarily
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
    }
  };

  const getLyrics = (song) => {
    if (viewMode === 'original') {
      return song.lyrics.tamil.map(l => l.text);
    } else if (viewMode === 'transliteration') {
      return song.lyrics.transliteration.map(l => l.text);
    } else {
      const combined = [];
      song.lyrics.tamil.forEach((line, i) => {
        combined.push(
          <div key={`t-${i}`} style={{ fontWeight: 'bold', marginBottom: '2px' }}>
            {line.text}
          </div>
        );
        combined.push(
          <div key={`r-${i}`} style={{ fontStyle: 'italic', color: '#666', marginBottom: '4px' }}>
            {song.lyrics.transliteration[i]?.text || ''}
          </div>
        );
      });
      return combined;
    }
  };

  const filteredSongs = allSongs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-12 shadow-xl">
        <div className="container mx-auto px-4">
          <Link href="/" className="flex items-center gap-2 text-white hover:underline mb-4">
            <ChevronLeft size={20} />
            Back to Home
          </Link>
          <div className="flex items-center gap-4">
            <FileText size={48} />
            <div>
              <h1 className="text-5xl font-bold">Compact Song Sheet Creator</h1>
              <p className="text-xl opacity-90">Print 6-12 songs per A4 sheet in multi-column format</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Song Selection */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Available Songs</h2>
              <input
                type="text"
                placeholder="Search songs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none mb-4"
              />
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredSongs.map((song) => (
                  <div key={song.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex-1">
                      <div className="font-semibold">{song.title}</div>
                      <div className="text-sm text-gray-600">{song.artist}</div>
                    </div>
                    <button
                      onClick={() => addSong(song)}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition disabled:opacity-50"
                      disabled={selectedSongs.find(s => s.id === song.id)}
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Settings & Selected */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Sheet Settings</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sheet Title</label>
                  <input
                    type="text"
                    value={sheetTitle}
                    onChange={(e) => setSheetTitle(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Columns: {layoutSettings.columns} ({Math.ceil(12 / layoutSettings.columns)} songs/page)
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="5"
                    value={layoutSettings.columns}
                    onChange={(e) => setLayoutSettings({...layoutSettings, columns: parseInt(e.target.value)})}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Font Size: {layoutSettings.fontSize}px
                  </label>
                  <input
                    type="range"
                    min="8"
                    max="14"
                    value={layoutSettings.fontSize}
                    onChange={(e) => setLayoutSettings({...layoutSettings, fontSize: parseInt(e.target.value)})}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Lyrics Format</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setViewMode('original')}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        viewMode === 'original' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                      }`}
                    >
                      Tamil
                    </button>
                    <button
                      onClick={() => setViewMode('transliteration')}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        viewMode === 'transliteration' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                      }`}
                    >
                      Translit
                    </button>
                    <button
                      onClick={() => setViewMode('both')}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        viewMode === 'both' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                      }`}
                    >
                      Both
                    </button>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-3">Selected Songs ({selectedSongs.length})</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
                {selectedSongs.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No songs selected</p>
                ) : (
                  selectedSongs.map((song, index) => (
                    <div key={song.id} className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                      <span className="font-bold text-blue-600">{index + 1}.</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">{song.title}</div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => moveSongUp(index)}
                          disabled={index === 0}
                          className="p-1 hover:bg-blue-200 rounded disabled:opacity-30"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => moveSongDown(index)}
                          disabled={index === selectedSongs.length - 1}
                          className="p-1 hover:bg-blue-200 rounded disabled:opacity-30"
                        >
                          ▼
                        </button>
                        <button
                          onClick={() => removeSong(song.id)}
                          className="p-1 hover:bg-red-200 rounded text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={generatePDF}
                disabled={selectedSongs.length === 0}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Download size={24} />
                Generate PDF ({selectedSongs.length} songs)
              </button>
            </div>
          </div>
        </div>
      </div>

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
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{sheetTitle}</h1>
          </div>
        )}
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(${layoutSettings.columns}, 1fr)`,
          gap: '8mm',
          fontSize: `${layoutSettings.fontSize}px`,
          lineHeight: '1.4'
        }}>
          {selectedSongs.map((song, index) => (
            <div key={song.id} style={{ breakInside: 'avoid' }}>
              <div style={{ fontWeight: 'bold', fontSize: `${layoutSettings.fontSize + 2}px`, marginBottom: '3mm', borderBottom: '1px solid #ccc', paddingBottom: '2mm' }}>
                {index + 1}. {song.title}
              </div>
              <div style={{ marginBottom: '5mm' }}>
                {viewMode === 'both' ? (
                  getLyrics(song)
                ) : (
                  getLyrics(song).map((line, i) => (
                    <div key={i} style={{ marginBottom: '2px' }}>{line}</div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}