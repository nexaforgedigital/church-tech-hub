import { useEffect, useRef, useState } from 'react';

export default function VideoBackground({ src, type, opacity = 0.5, loop = true }) {
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (videoRef.current && type === 'video') {
      videoRef.current.play().catch(err => console.log('Video autoplay failed:', err));
    }
  }, [src, type]);

  // Reset loaded state when src changes
  useEffect(() => {
    setVideoLoaded(false);
    setImageLoaded(false);
  }, [src]);

  if (type === 'video') {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {/* Loading Spinner - Shows while video loads */}
        {!videoLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-white mx-auto mb-4"></div>
              <p className="text-sm opacity-75">Loading video...</p>
            </div>
          </div>
        )}
        
        <video
          ref={videoRef}
          src={src}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: videoLoaded ? opacity : 0 }}
          onLoadedData={() => setVideoLoaded(true)}
          onCanPlay={() => setVideoLoaded(true)}
          autoPlay
          loop={loop}
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/50"></div>
      </div>
    );
  }

  if (type === 'youtube') {
    // Extract YouTube video ID
    const videoId = src.includes('youtube.com') 
      ? new URL(src).searchParams.get('v')
      : src.split('/').pop();

    return (
      <div className="absolute inset-0 overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0`}
          className="absolute inset-0 w-full h-full"
          style={{ 
            opacity,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none'
          }}
          allow="autoplay; encrypted-media"
          frameBorder="0"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/50"></div>
      </div>
    );
  }

  // Image background
  if (type === 'image') {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {/* Loading Spinner - Shows while image loads */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-white mx-auto mb-4"></div>
              <p className="text-sm opacity-75">Loading background...</p>
            </div>
          </div>
        )}
        
        {/* Hidden image to detect load */}
        <img 
          src={src} 
          alt="" 
          className="hidden"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)} // Show anyway on error
        />
        
        <div 
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
          style={{ 
            backgroundImage: `url(${src})`,
            opacity: imageLoaded ? opacity : 0
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40"></div>
      </div>
    );
  }

  // Default fallback (no type or unknown type)
  return (
    <div 
      className="absolute inset-0 bg-cover bg-center"
      style={{ 
        backgroundImage: src ? `url(${src})` : 'none',
        backgroundColor: '#1e3a8a',
        opacity
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40"></div>
    </div>
  );
}