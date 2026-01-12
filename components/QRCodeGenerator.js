import { useEffect, useRef, useState } from 'react';

export default function QRCodeGenerator({ url, size = 200 }) {
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (canvasRef.current && url) {
      generateQR(url);
    }
  }, [url, size]);

  const generateQR = (text) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setLoading(true);
    setError(false);
    
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);
      setLoading(false);
    };
    
    img.onerror = () => {
      // Fallback: draw a placeholder
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = '#666';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('QR Code Error', size / 2, size / 2 - 10);
      ctx.fillText('Use URL below', size / 2, size / 2 + 10);
      setLoading(false);
      setError(true);
    };
    
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-xl shadow-lg">
      <h3 className="text-lg font-bold text-gray-900">📱 Scan to Control</h3>
      
      <div className="relative">
        <canvas 
          ref={canvasRef} 
          width={size} 
          height={size} 
          className="border-4 border-gray-200 rounded-lg" 
        />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
      
      <p className="text-sm text-gray-600 text-center max-w-xs">
        Scan this QR code with your phone to control the presentation
      </p>
      
      {/* Fallback URL display */}
      {error && url && (
        <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600 break-all max-w-[200px]">
          <strong>Manual URL:</strong><br />
          {url}
        </div>
      )}
    </div>
  );
}