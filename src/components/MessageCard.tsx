//import React from 'react';
import { User2, Dice6 } from 'lucide-react';

interface MessageCardProps {
  message: string;
  onMessageChange: (value: string) => void;
  onRandomMessage: () => void;
  imageUrl?: string;
  username?: string;
  displayName?: string;
}

export function MessageCard({ 
  message, 
  onMessageChange, 
  onRandomMessage, 
  imageUrl, 
  username = "anonymous.user",
  displayName = "Send me anonymous messages!"
}: MessageCardProps) {
  return (
    <div className="bg-white rounded-[32px] shadow-lg overflow-hidden w-full">
      <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-100">
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
          {imageUrl ? (
            <img src={imageUrl} alt="User" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <User2 className="w-5 h-5 text-gray-400" />
          )}
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-[15px] font-semibold text-gray-900">@{username}</h1>
          <p className="text-[13px] text-gray-600">{displayName}</p>
        </div>
      </div>

      <div className="relative">
        <textarea
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          className="w-full h-[180px] p-4 bg-[#FFE5EC] text-gray-800 resize-none focus:outline-none"
          placeholder="send me anonymous messages..."
        />
        <button
          onClick={onRandomMessage}
          className="absolute bottom-3 right-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-all"
          aria-label="Get random message"
        >
          <Dice6 className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}
