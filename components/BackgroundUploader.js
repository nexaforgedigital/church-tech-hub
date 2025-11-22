import { useState, useEffect } from 'react';
import { Upload, Trash2, Eye, Check } from 'lucide-react';

export default function BackgroundUploader({ onSelect, currentBackground }) {
  const [backgrounds, setBackgrounds] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadBackgrounds();
  }, []);

  const loadBackgrounds = () => {
    const stored = localStorage.getItem('customBackgrounds');
    setBackgrounds(stored ? JSON.parse(stored) : []);
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      alert('Please upload an image or video file');
      return;
    }

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert('File size must be less than 50MB');
      return;
    }

    setUploading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const newBackground = {
        id: `bg-${Date.now()}`,
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'video',
        data: event.target.result,
        uploadedAt: new Date().toISOString()
      };

      const updated = [...backgrounds, newBackground];
      setBackgrounds(updated);
      localStorage.setItem('customBackgrounds', JSON.stringify(updated));
      setUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const deleteBackground = (id) => {
    if (!confirm('Delete this background?')) return;
    const updated = backgrounds.filter(bg => bg.id !== id);
    setBackgrounds(updated);
    localStorage.setItem('customBackgrounds', JSON.stringify(updated));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Custom Backgrounds</h3>
        <label className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition text-sm font-semibold">
          <Upload size={18} />
          Upload
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {uploading && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
          <div className="spinner w-8 h-8 mx-auto mb-2"></div>
          <p className="text-sm text-blue-800">Uploading...</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {backgrounds.map((bg) => (
          <div
            key={bg.id}
            className={`relative group cursor-pointer rounded-lg overflow-hidden border-4 transition ${
              currentBackground === bg.data
                ? 'border-green-500 ring-4 ring-green-200'
                : 'border-gray-200 hover:border-blue-400'
            }`}
            onClick={() => onSelect(bg.data, bg.type)}
          >
            {bg.type === 'image' ? (
              <img src={bg.data} alt={bg.name} className="w-full h-32 object-cover" />
            ) : (
              <video src={bg.data} className="w-full h-32 object-cover" muted />
            )}
            
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(bg.data, bg.type);
                }}
                className="bg-green-600 hover:bg-green-700 p-2 rounded-lg transition"
              >
                <Check size={20} className="text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteBackground(bg.id);
                }}
                className="bg-red-600 hover:bg-red-700 p-2 rounded-lg transition"
              >
                <Trash2 size={20} className="text-white" />
              </button>
            </div>

            {currentBackground === bg.data && (
              <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                ACTIVE
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 truncate">
              {bg.name}
            </div>
          </div>
        ))}
      </div>

      {backgrounds.length === 0 && !uploading && (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <Upload size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No custom backgrounds yet</p>
          <p className="text-sm text-gray-500">Upload images or videos to use as backgrounds</p>
        </div>
      )}
    </div>
  );
}