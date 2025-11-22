import { useEffect, useRef } from 'react';

export default function QRCodeGenerator({ url, size = 200 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && url) {
      // Simple QR code generation (you can use qrcode library for better results)
      generateQR(url);
    }
  }, [url]);

  const generateQR = (text) => {
    // Using Google Charts API as a simple solution
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);
    };
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-xl shadow-lg">
      <h3 className="text-lg font-bold">Scan to Control</h3>
      <canvas ref={canvasRef} width={size} height={size} className="border-4 border-gray-200 rounded-lg" />
      <p className="text-sm text-gray-600 text-center max-w-xs">
        Scan this QR code with your phone to control the presentation
      </p>
    </div>
  );
}