//import React from 'react';

interface FooterProps {
  tapCount: number;
}

export function Footer({ tapCount }: FooterProps) {
  const handleGetMessages = () => {
    window.location.href = 'https://apps.apple.com/us/app/ngl-ask-me-anything/id1596550932?ppid=543cb167-5bdc-448f-a202-e5506f5d2837';
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 text-center bg-gradient-to-t from-black/20 to-transparent">
      <style>
        {`
          @keyframes pop-wiggle {
            0% { transform: scale(1); }
            15% { transform: scale(1.05); }
            20% { transform: scale(1.05) rotate(2deg); }
            25% { transform: scale(1.05) rotate(-2deg); }
            30% { transform: scale(1.05) rotate(2deg); }
            35% { transform: scale(1.05) rotate(-2deg); }
            40% { transform: scale(1.03); }
            50% { transform: scale(1.01); }
            100% { transform: scale(1); }
          }
          .animate-pop-wiggle {
            animation: pop-wiggle 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }
        `}
      </style>
      <p className="text-white/90 text-sm mb-3">
        👆 {tapCount} people just tapped the button👆
      </p>
      <button 
        onClick={handleGetMessages}
        className="w-full max-w-[640px] bg-black text-white py-4 rounded-full font-semibold mb-4 hover:bg-black/90 transition-all animate-pop-wiggle"
      >
        Get your own messages!
      </button>
      <div className="flex justify-center gap-4 text-white/60 text-sm">
        <a 
          href="https://ngl.link/p/terms" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:text-white"
        >
          Terms
        </a>
        <a 
          href="https://ngl.link/p/privacy" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:text-white"
        >
          Privacy
        </a>
      </div>
    </div>
  );
}