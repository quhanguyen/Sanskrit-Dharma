import React from 'react';

interface CosmicBackgroundProps {
    reduceMotion: boolean;
}

const CosmicBackground: React.FC<CosmicBackgroundProps> = ({ reduceMotion }) => (
  <div className="fixed inset-0 z-0 overflow-hidden bg-[#050508] pointer-events-none select-none">
    {/* Deep Space Gradient */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#111827] via-[#050508] to-[#000000] opacity-80"></div>

    {!reduceMotion && (
      <>
        {/* Moving Nebulas */}
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-purple-900/10 rounded-full blur-[120px] animate-pulse" style={{animationDuration: '15s'}}></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-900/10 rounded-full blur-[100px] animate-pulse" style={{animationDuration: '20s', animationDelay: '5s'}}></div>
        <div className="absolute top-[30%] left-[40%] w-[40%] h-[40%] bg-blue-900/5 rounded-full blur-[80px] animate-pulse" style={{animationDuration: '25s', animationDelay: '2s'}}></div>

        {/* Stars - Layer 2 (Twinkling & Glowing) */}
        <div className="absolute inset-0">
            {[...Array(60)].map((_, i) => (
              <div 
                key={`s2-${i}`}
                className="absolute bg-white rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 2 + 1}px`,
                  opacity: Math.random() * 0.7 + 0.3,
                  boxShadow: `0 0 ${Math.random() * 4 + 2}px rgba(255, 255, 255, 0.9)`,
                  animation: `twinkle ${Math.random() * 5 + 3}s infinite alternate ease-in-out`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              />
            ))}
        </div>

        {/* Shooting Stars */}
        <div className="absolute top-[-100px] left-1/4 w-[150px] h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-0 rotate-[45deg] animate-shooting-star" style={{animationDelay: '7s'}}></div>
        <div className="absolute top-1/3 right-[-100px] w-[200px] h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-0 rotate-[135deg] animate-shooting-star" style={{animationDelay: '15s'}}></div>
        <div className="absolute bottom-1/4 left-[-100px] w-[180px] h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-0 rotate-[-45deg] animate-shooting-star" style={{animationDelay: '23s'}}></div>
      </>
    )}

    {/* Static Stars */}
    <div className="absolute inset-0 opacity-50">
        {[...Array(150)].map((_, i) => (
            <div key={`s1-${i}`} className="absolute bg-white rounded-full" style={{
                top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
                width: `${Math.random() * 1.5}px`, height: `${Math.random() * 1.5}px`,
                opacity: Math.random() * 0.5 + 0.1
            }} />
        ))}
    </div>

    <style>{`
      @keyframes twinkle {
        0% { opacity: 0.3; transform: scale(0.8); box-shadow: 0 0 2px rgba(255, 255, 255, 0.5); }
        100% { opacity: 1; transform: scale(1.2); box-shadow: 0 0 8px rgba(255, 255, 255, 1); }
      }
      @keyframes shooting-star {
        0% { transform: translate(0, 0) scale(0.5); opacity: 0; }
        10% { opacity: 1; transform: translate(100px, 100px) scale(1); }
        20% { opacity: 0; transform: translate(300px, 300px) scale(0.5); }
        100% { opacity: 0; transform: translate(300px, 300px) scale(0.5); }
      }
    `}</style>
  </div>
);

export default CosmicBackground;