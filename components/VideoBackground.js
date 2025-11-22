import { useEffect, useRef } from 'react';

export default function VideoBackground({ src, type, opacity = 0.5, loop = true }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && type === 'video') {
      videoRef.current.play().catch(err => console.log('Video autoplay failed:', err));
    }
  }, [src, type]);

  if (type === 'video') {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <video
          ref={videoRef}
          src={src}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity }}
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
  return (
    <div 
      className="absolute inset-0 bg-cover bg-center"
      style={{ 
        backgroundImage: `url(${src})`,
        opacity
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40"></div>
    </div>
  );
}