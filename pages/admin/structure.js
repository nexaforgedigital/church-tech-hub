// pages/admin/structure.js
// Verse/Chorus Structure Detector

import { useState } from 'react';
import { Layers, Wand2, Copy, Check, Edit3, RotateCcw } from 'lucide-react';
import AdminAuth from '../../components/AdminAuth';
import { detectSongStructure, parseManualStructure } from '../../utils/verseDetector';

export default function StructureDetector() {
  const [inputLyrics, setInputLyrics] = useState('');
  const [detectedStructure, setDetectedStructure] = useState(null);
  const [structuredOutput, setStructuredOutput] = useState('');
  const [isManualMode, setIsManualMode] = useState(false);
  const [copied, setCopied] = useState(false);

  const detectStructure = () => {
    const lines = inputLyrics.split('\n').map(l => l.trim()).filter(l => l);
    
    if (lines.length === 0) {
      alert('Please enter lyrics first');
      return;
    }

    const result = detectSongStructure(lines);
    setDetectedStructure(result);
    setStructuredOutput(result.structured);
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(structuredOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setInputLyrics('');
    setDetectedStructure(null);
    setStructuredOutput('');
  };

  const loadSample = () => {
    setInputLyrics(`கர்த்தர் என் மேய்ப்பர்
எனக்கு குறைவு இல்லை

அல்லேலூயா அல்லேலூயா
ஆமென் ஆமென்

புல்லுள்ள இடங்களில்
என்னைப் படுக்கச் செய்வார்

அல்லேலூயா அல்லேலூயா
ஆமென் ஆமென்

அமர்ந்த தண்ணீர்கள் அருகே
என்னை நடத்துவார்

அல்லேலூயா அல்லேலூயா
ஆமென் ஆமென்`);
  };

  return (
    <AdminAuth title="Structure Detector">
      <div className="py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 mb-8 text-white">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-4 rounded-xl">
                <Layers size={40} />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Verse/Chorus Detector</h1>
                <p className="text-indigo-100 mt-1">
                  Auto-detect song structure (Verse, Chorus, Bridge)
                </p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg">Input Lyrics</h2>
                <div className="flex gap-2">
                  <button
                    onClick={loadSample}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Load Sample
                  </button>
                  <button
                    onClick={clearAll}
                    className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                  >
                    <RotateCcw size={14} />
                    Clear
                  </button>
                </div>
              </div>

              <textarea
                value={inputLyrics}
                onChange={(e) => setInputLyrics(e.target.value)}
                rows={16}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none"
                placeholder="Paste song lyrics here...

Tip: Leave blank lines between sections for better detection.

Example:
கர்த்தர் என் மேய்ப்பர்
எனக்கு குறைவு இல்லை

அல்லேலூயா அல்லேலூயா
ஆமென் ஆமென்"
              />

              <button
                onClick={detectStructure}
                className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                <Wand2 size={20} />
                Detect Structure
              </button>
            </div>

            {/* Output */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg">Detected Structure</h2>
                {structuredOutput && (
                  <button
                    onClick={copyOutput}
                    className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-semibold ${
                      copied 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>

              {detectedStructure ? (
                <>
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-indigo-50 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-indigo-600">
                        {detectedStructure.totalVerses}
                      </div>
                      <div className="text-xs text-indigo-700">Verses</div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {detectedStructure.hasChorus ? detectedStructure.chorusRepeats : 0}
                      </div>
                      <div className="text-xs text-purple-700">Chorus Repeats</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {detectedStructure.sections.length}
                      </div>
                      <div className="text-xs text-green-700">Total Sections</div>
                    </div>
                  </div>

                  {/* Visual Structure */}
                  <div className="mb-4 max-h-64 overflow-y-auto">
                    {detectedStructure.sections.map((section, index) => (
                      <div
                        key={index}
                        className={`mb-3 p-3 rounded-lg border-l-4 ${
                          section.type === 'chorus' || section.type === 'chorus-repeat'
                            ? 'bg-purple-50 border-purple-500'
                            : 'bg-blue-50 border-blue-500'
                        }`}
                      >
                        <div className="font-semibold text-sm mb-1">
                          {section.label}
                          {section.note && <span className="text-gray-500 ml-2">{section.note}</span>}
                        </div>
                        <div className="text-sm text-gray-700">
                          {section.lines.slice(0, 2).join(' / ')}
                          {section.lines.length > 2 && '...'}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Formatted Output */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Structured Output</label>
                    <textarea
                      value={structuredOutput}
                      onChange={(e) => setStructuredOutput(e.target.value)}
                      rows={10}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none font-mono text-sm"
                    />
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-50 rounded-xl">
                  <div className="text-center text-gray-500">
                    <Layers size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="font-semibold">No structure detected yet</p>
                    <p className="text-sm">Paste lyrics and click "Detect Structure"</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-indigo-50 rounded-xl p-6 mt-6 border-2 border-indigo-200">
            <h3 className="font-bold text-indigo-900 mb-3">💡 Tips for Better Detection</h3>
            <ul className="space-y-2 text-indigo-800 text-sm">
              <li>• <strong>Leave blank lines</strong> between verses and chorus for better detection</li>
              <li>• <strong>Repeated sections</strong> are automatically identified as chorus</li>
              <li>• <strong>Common words</strong> like "அல்லேலூயா", "ஆமென்" help identify chorus</li>
              <li>• You can <strong>manually edit</strong> the structured output if needed</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminAuth>
  );
}