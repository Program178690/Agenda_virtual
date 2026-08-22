// src/components/VinylButton.jsx
import { useRef, useState } from 'react';

export default function VinylButton() {
  const audioRef = useRef(null);
  const [sonando, setSonando] = useState(false);

  const toggleSonido = () => {
    if (!audioRef.current) return;

    if (sonando) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setSonando(!sonando);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <audio
        ref={audioRef}
        src="/audio/easter-egg.mp3"
        onEnded={() => setSonando(false)}
      />
      <button
        onClick={toggleSonido}
        aria-label="Easter egg"
        className="w-12 h-12 rounded-full bg-slate-900 dark:bg-black shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        style={{
          animation: sonando ? 'spin-vinyl 2s linear infinite' : 'none',
        }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="15" fill="#111827" stroke="#374151" strokeWidth="1" />
          <circle cx="16" cy="16" r="11" fill="none" stroke="#374151" strokeWidth="0.5" />
          <circle cx="16" cy="16" r="8" fill="none" stroke="#374151" strokeWidth="0.5" />
          <circle cx="16" cy="16" r="5" fill="#dc2626" />
          <circle cx="16" cy="16" r="1.5" fill="#111827" />
        </svg>
      </button>

      <style>{`
        @keyframes spin-vinyl {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}