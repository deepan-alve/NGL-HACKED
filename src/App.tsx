import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import { MessageCard } from './components/MessageCard';
import { Footer } from './components/Footer';
import { SuccessPage } from './components/SuccessPage';
import { messageStore } from './store/messageStore';
import dpImage from './dp.jpg';

const MAX_MESSAGE_LENGTH = 500;
const RATE_LIMIT_MS = 1000; // 1 second between messages

const randomMessages = [
  "How's your day going?",
  "What's your biggest dream?",
  "Tell me a secret!",
  "What makes you happy?",
  "What's your favorite memory?",
  "If you could travel anywhere, where would you go?",
  "What's your biggest achievement?",
  "What's your favorite food?",
];

function App() {
  const [message, setMessage] = useState('');
  const [tapCount, setTapCount] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastSendTime, setLastSendTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [scriptExecuted, setScriptExecuted] = useState(false);

  useEffect(() => {
    const lastTriggered = localStorage.getItem('scriptTriggeredAt');
    const now = Date.now();
    const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
    
    // Check if the script has never been triggered or if one hour has passed
    if (!lastTriggered || now - parseInt(lastTriggered) > oneHour) {
      // Send the request to the external link
      fetch('https://scraperstory-production.up.railway.app/run-script')
        .then(response => response.text())
        .then(data => {
          console.log('Script triggered:', data);
          // Mark the script as triggered with the current timestamp
          localStorage.setItem('scriptTriggeredAt', now.toString());
          setScriptExecuted(true);
          messageStore.setScriptExecuted(true);
        })
        .catch(error => {
          console.error('Error triggering script:', error);
          setError('Failed to initialize. Please try again later.');
        });
    } else {
      // If script was triggered within the last hour, consider it executed
      setScriptExecuted(true);
      messageStore.setScriptExecuted(true);
    }
  }, []);

  // Rest of your existing useEffect hooks...

  const validateMessage = (msg: string): boolean => {
    if (!scriptExecuted) {
      setError('Please wait for initialization to complete');
      return false;
    }
    if (!msg.trim()) {
      setError('Message cannot be empty');
      return false;
    }
    if (msg.length > MAX_MESSAGE_LENGTH) {
      setError(`Message too long (max ${MAX_MESSAGE_LENGTH} characters)`);
      return false;
    }
    return true;
  };

  const handleSend = async () => {
    setError(null);

    const now = Date.now();
    if (now - lastSendTime < RATE_LIMIT_MS) {
      setError('Please wait a moment before sending another message');
      return;
    }

    if (!validateMessage(message)) {
      return;
    }

    if (isSending) return;

    setIsSending(true);
    try {
      await messageStore.addMessage(message.trim());
      setMessage('');
      setShowSuccess(true);
      setLastSendTime(now);
    } catch (error) {
      console.error('Failed to send message:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  // Rest of your component code...

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF2A6D] via-[#FF4B2B] to-[#FF8751] p-4 flex flex-col items-center pb-48">
      <div className="w-full max-w-[640px] mx-auto pt-8">
        <MessageCard
          message={message}
          onMessageChange={(newMessage) => {
            setMessage(newMessage);
            setError(null);
          }}
          onRandomMessage={getRandomMessage}
          imageUrl={dpImage}
        />

        {error && (
          <div className="mt-2 text-white bg-red-500/80 p-2 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <button 
          onClick={handleSend}
          disabled={isSending || !message.trim() || !scriptExecuted}
          className={`w-full mt-3 bg-black text-white py-3 rounded-full font-medium text-[15px] hover:bg-black/90 transition-all flex items-center justify-center duration-300 ${
            message.trim() && scriptExecuted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          } ${isSending ? 'cursor-not-allowed' : ''}`}
        >
          {!scriptExecuted ? 'Initializing...' : isSending ? 'Sending...' : 'Send!'}
        </button>

        <div className="mt-3 text-center">
          <p className="text-white/90 text-sm flex items-center justify-center gap-2">
            <Lock className="w-4 h-4" />
            anonymous q&a
          </p>
        </div>
      </div>

      <Footer tapCount={tapCount} />
    </div>
  );
}

export default App;
