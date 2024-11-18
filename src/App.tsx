import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import { MessageCard } from './components/MessageCard';
import { Footer } from './components/Footer';
import { SuccessPage } from './components/SuccessPage';
import { messageStore } from './store/messageStore';
import dpImage from './dp.jpg';

const MAX_MESSAGE_LENGTH = 500;
const RATE_LIMIT_MS = 1000;

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

const AppNotification: React.FC<{
  message: string;
  type: 'loading' | 'success' | 'error';
  show: boolean;
}> = ({ message, type, show }) => {
  const getStyles = () => {
    const baseStyles = "fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out";
    
    switch (type) {
      case 'loading':
        return `${baseStyles} ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'} bg-black/80 text-white`;
      case 'success':
        return `${baseStyles} ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'} bg-green-500/90 text-white`;
      case 'error':
        return `${baseStyles} ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'} bg-red-500/90 text-white`;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'loading': return '🔄';
      case 'success': return '✨';
      case 'error': return '⚠️';
    }
  };

  return show ? (
    <div className={getStyles()}>
      <div className="flex items-center space-x-2">
        <span className="text-lg">{getIcon()}</span>
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  ) : null;
};

function App() {
  const [message, setMessage] = useState('');
  const [tapCount, setTapCount] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastSendTime, setLastSendTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [showReadyMessage, setShowReadyMessage] = useState(false);
  const [showMultipleMessageError, setShowMultipleMessageError] = useState(false);

  useEffect(() => {
    const lastTriggered = localStorage.getItem('scriptTriggeredAt');
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    
    if (!lastTriggered || now - parseInt(lastTriggered) > oneHour) {
      setIsInitializing(true);
      fetch('https://scraperstory-production.up.railway.app/run-script')
        .then(response => response.text())
        .then(data => {
          console.log('Script triggered:', data);
          localStorage.setItem('scriptTriggeredAt', now.toString());
          messageStore.setScriptExecuted(true);
          setIsInitializing(false);
          setShowReadyMessage(true);
          setTimeout(() => setShowReadyMessage(false), 3000);
        })
        .catch(error => {
          console.error('Error triggering script:', error);
          setError('Something went wrong. Please try again later.');
          setIsInitializing(false);
        });
    } else {
      messageStore.setScriptExecuted(true);
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => {
    setTapCount(Math.floor(Math.random() * (300 - 200 + 1) + 200));

    const interval = setInterval(() => {
      const shouldUpdate = Math.random() > 0.3;
      if (shouldUpdate) {
        setTapCount(Math.floor(Math.random() * (300 - 200 + 1) + 200));
      }
    }, Math.floor(Math.random() * (5000 - 2000 + 1) + 2000));

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch('/api/run-bot')
      .then(response => response.text())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
  }, []);

  const getRandomMessage = () => {
    const randomIndex = Math.floor(Math.random() * randomMessages.length);
    setMessage(randomMessages[randomIndex]);
    setError(null);
  };

  const validateMessage = (msg: string): boolean => {
    // Check if message has already been sent
    const messageSent = localStorage.getItem('messageSent');
    if (messageSent === 'true') {
      setShowMultipleMessageError(true);
      setTimeout(() => setShowMultipleMessageError(false), 3000);
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
      
      // Mark message as sent in localStorage
      localStorage.setItem('messageSent', 'true');
    } catch (error) {
      console.error('Failed to send message:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleGetMessages = () => {
    window.location.href = 'https://apps.apple.com/us/app/ngl-ask-me-anything/id1596550932?ppid=543cb167-5bdc-448f-a202-e5506f5d2837';
  };

  const handleBack = () => {
    setShowSuccess(false);
    setError(null);
  };

  if (showSuccess) {
    return (
      <SuccessPage 
        tapCount={tapCount}
        onBack={handleBack}
        onGetMessages={handleGetMessages}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF2A6D] via-[#FF4B2B] to-[#FF8751] p-4 flex flex-col items-center pb-48">
      <AppNotification 
        message="Please wait a moment, our servers are warming up..."
        type="loading"
        show={isInitializing}
      />

      <AppNotification 
        message="Voila! We're ready to go! Send your message now!"
        type="success"
        show={showReadyMessage}
      />

      <AppNotification 
        message="You can only send one message. Try again later!"
        type="error"
        show={showMultipleMessageError}
      />

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
          disabled={isSending || !message.trim() || isInitializing}
          className={`w-full mt-3 bg-black text-white py-3 rounded-full font-medium text-[15px] hover:bg-black/90 transition-all flex items-center justify-center duration-300 ${
            message.trim() && !isInitializing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          } ${isSending || isInitializing ? 'cursor-not-allowed' : ''}`}
        >
          {isInitializing ? '🔄 Getting Ready...' : isSending ? 'Sending...' : 'Send!'}
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
