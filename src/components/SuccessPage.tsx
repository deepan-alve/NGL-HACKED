//import React from 'react';
import { ChevronLeft, Check } from 'lucide-react';

interface SuccessPageProps {
  tapCount: number;
  onBack: () => void;
  onGetMessages: () => void;
}

export function SuccessPage({ tapCount, onBack, onGetMessages }: SuccessPageProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#FF2A6D] via-[#FF4B2B] to-[#FF8751] flex flex-col items-center justify-start px-4 py-6 sm:p-8 transform sm:scale-110 sm:origin-top">
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

      <button 
        onClick={onBack}
        className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center text-white sm:w-10 sm:h-10"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <div className="flex flex-col items-center justify-start flex-1 max-w-[640px] w-full text-center mt-12 sm:mt-0">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center mb-6 sm:mb-8">
          <Check className="w-8 h-8 sm:w-10 sm:h-10 text-[#FF4B2B]" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Sent!</h1>

        <p className="text-white/90 text-sm sm:text-base mb-4 sm:mb-6">
          👆 {tapCount} people just tapped the button 👆
        </p>

        <button 
          onClick={onGetMessages}
          className="w-full max-w-lg bg-black text-white py-4 sm:py-5 rounded-full font-semibold mb-4 hover:bg-black/90 transition-all animate-pop-wiggle text-lg sm:text-xl"
        >
          <a 
            href="https://apps.apple.com/us/app/ngl-ask-me-anything/id1596550932?ppid=543cb167-5bdc-448f-a202-e5506f5d2837"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get your own messages!
          </a>
        </button>

        <button 
          onClick={onBack}
          className="text-white underline underline-offset-4 text-sm sm:text-base hover:text-white/90 transition-all"
        >
          Send another message
        </button>
      </div>
    </div>
  );
}
