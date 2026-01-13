// pages/admin/chords.js
// Chord Parser and Editor

import { useState, useEffect } from 'react';
import { Music2, ArrowUp, ArrowDown, Copy, Check, RotateCcw } from 'lucide-react';
import AdminAuth from '../../components/AdminAuth';
import { parseChords, transposeAll, getUniqueChords, formatChordChart } from '../../utils/chordParser';

export default function ChordEditor() {
  const [inputText, setInputText] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [transposeValue, setTransposeValue] = useState(0);
  const [displayMode, setDisplayMode] = useState('inline'); // inline, above
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (inputText.trim()) {
      const transposed = transposeValue !== 0 ? transposeAll(inputText, transposeValue) : inputText;
      const parsed = parseChords(transposed);
      setParsedData(parsed);
    } else {
      setParsedData(null);
    }
  }, [inputText, transposeValue]);

  const copyOutput = () => {
    let textToCopy = '';
    if (displayMode === 'inline') {
      textToCopy = transposeValue !== 0 ? transposeAll(inputText, transposeValue) : inputText;
    } else {
      textToCopy = parsedData ? formatChordChart(parsedData.lines) : '';
    }
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadSample = () => {
    setInputText(`[G]கர்த்தர் என் [D]மேய்ப்பர்
[Em]எனக்கு [C]குறைவு இல்லை

[G]புல்லுள்ள [D]இடங்களில்
[Em]என்னைப் படுக்கச் [C]செய்வார்

[G]அமர்ந்த தண்ணீர்கள் [D]அருகே
[Em]என்னை [C]நடத்து[G]வார்`);
    setTransposeValue(0);
  };

  const uniqueChords = parsedData ? getUniqueChords(
    transposeValue !== 0 ? transposeAll(inputText, transposeValue) : inputText
  ) : [];

  return (
    <AdminAuth title="Chord Editor">
      <div className="py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-8 mb-8 text-white">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-4 rounded-xl">
                <Music2 size={40} />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Chord Parser & Editor</h1>
                <p className="text-amber-100 mt-1">
                  Add, edit, and transpose chords for songs
                </p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg">Input (with chords)</h2>
                <div className="flex gap-2">
                  <button
                    onClick={loadSample}
                    className="text-sm text-amber-600 hover:text-amber-800"
                  >
                    Load Sample
                  </button>
                  <button
                    onClick={() => { setInputText(''); setTransposeValue(0); }}
                    className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                  >
                    <RotateCcw size={14} />
                    Clear
                  </button>
                </div>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={14}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none font-mono"
                placeholder="Enter lyrics with chords in brackets:

[G]கர்த்தர் என் [D]மேய்ப்பர்
[Em]எனக்கு [C]குறைவு இல்லை

Supported formats:
[G] [Am] [F#m] [Cmaj7] [D/F#]"
              />

              {/* Chord Format Help */}
              <div className="mt-4 bg-amber-50 rounded-xl p-4">
                <h3 className="font-semibold text-amber-900 mb-2">Chord Format</h3>
                <p className="text-sm text-amber-800">
                  Use square brackets: <code className="bg-amber-100 px-1 rounded">[G]</code>, 
                  <code className="bg-amber-100 px-1 rounded ml-1">[Am]</code>, 
                  <code className="bg-amber-100 px-1 rounded ml-1">[F#m]</code>, 
                  <code className="bg-amber-100 px-1 rounded ml-1">[Cmaj7]</code>
                </p>
              </div>
            </div>

            {/* Output & Controls */}
            <div className="space-y-6">
              {/* Transpose Controls */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="font-bold text-lg mb-4">Transpose</h2>
                
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setTransposeValue(transposeValue - 1)}
                    className="bg-gray-200 hover:bg-gray-300 p-3 rounded-lg"
                  >
                    <ArrowDown size={20} />
                  </button>
                  
                  <div className="flex-1 text-center">
                    <div className="text-3xl font-bold">
                      {transposeValue > 0 ? '+' : ''}{transposeValue}
                    </div>
                    <div className="text-sm text-gray-500">semitones</div>
                  </div>
                  
                  <button
                    onClick={() => setTransposeValue(transposeValue + 1)}
                    className="bg-gray-200 hover:bg-gray-300 p-3 rounded-lg"
                  >
                    <ArrowUp size={20} />
                  </button>
                  
                  <button
                    onClick={() => setTransposeValue(0)}
                    className="bg-gray-200 hover:bg-gray-300 px-4 py-3 rounded-lg text-sm font-medium"
                  >
                    Reset
                  </button>
                </div>

                {/* Unique Chords */}
                {uniqueChords.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-sm font-medium text-gray-600 mb-2">Chords Used:</div>
                    <div className="flex flex-wrap gap-2">
                      {uniqueChords.map((chord, i) => (
                        <span
                          key={i}
                          className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold"
                        >
                          {chord}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Display Mode */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-lg">Output</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDisplayMode('inline')}
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        displayMode === 'inline' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100'
                      }`}
                    >
                      Inline
                    </button>
                    <button
                      onClick={() => setDisplayMode('above')}
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        displayMode === 'above' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100'
                      }`}
                    >
                      Above Lyrics
                    </button>
                  </div>
                </div>

                {parsedData ? (
                  <>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-xl overflow-auto text-sm h-64 font-mono">
                      {displayMode === 'inline'
                        ? (transposeValue !== 0 ? transposeAll(inputText, transposeValue) : inputText)
                        : formatChordChart(parsedData.lines)
                      }
                    </pre>
                    
                    <button
                      onClick={copyOutput}
                      className={`w-full mt-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 ${
                        copied 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-amber-100 hover:bg-amber-200 text-amber-700'
                      }`}
                    >
                      {copied ? <Check size={20} /> : <Copy size={20} />}
                      {copied ? 'Copied!' : 'Copy Output'}
                    </button>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-64 bg-gray-50 rounded-xl">
                    <div className="text-center text-gray-500">
                      <Music2 size={48} className="mx-auto mb-4 opacity-50" />
                      <p className="font-semibold">No chords detected</p>
                      <p className="text-sm">Enter lyrics with [chords] to see output</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminAuth>
  );
}