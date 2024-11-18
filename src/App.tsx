Sure, I can help you remove the dependency on `framer-motion` from your code. Here's an updated version of your code without using `framer-motion`:

```jsx
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

const AppNotification = ({ message, type, show }) => {
  const getStyles = () => {
    switch (type) {
      case 'loading':
        return 'bg-black/80 text-white';
      case 'success':
        return 'bg-green-500/90 text-white';
      default:
        return '';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'loading': return '🔄';
      case 'success': return '✨';
      default: return '';
    }
  };

  return (
    show && (
      <div className={`fixed bottom-4 right-4 p-4 rounded ${getStyles()}`}>
        <span>{getIcon()}</span>
        <span>{message}</span>
      </div>
    )
  );
};

function App() {
  const [message, setMessage] = useState('');
  const [tapCount, setTapCount] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastSendTime, setLastSendTime] = useState(0);
  const [error, setError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [showReadyMessage, setShowReadyMessage] = useState(false);

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

  const validateMessage = (msg) => {
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

  const handleGetMessages = () => {
    window.location.href = 'https://apps.apple.com/us/app/ngl-ask-me-anything/id1596550932?ppid=543cb167-5bdc-448f-a202-e5506f5d2837';
  };

  const handleBack = () => {
    setShowSuccess(false);
    setError(null);
  };

  if (showSuccess) {
    return (
      <SuccessPage onBack={handleBack} />
    );
  }

  return (
    <div className="app">
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
        <div className="error">{error}</div>
      )}

      <button onClick={handleSend} disabled={isInitializing || isSending}>
        {isInitializing ? '🔄 Getting Ready...' : isSending ? 'Sending...' : 'Send!'}
      </button>

      <Footer onGetMessages={handleGetMessages} />

      <AppNotification
        message={showReadyMessage ? 'Ready to send messages!' : ''}
        type="success"
        show={showReadyMessage}
      />
    </div>
  );
}

export default App;
```

This version removes the `framer-motion` dependency and uses basic conditional rendering for the notification component. Let me know if you need any further adjustments!
