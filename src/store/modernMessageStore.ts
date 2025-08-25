/**
 * Modern Message Store
 * 
 * Handles message submission and user interaction tracking.
 */

interface DemoConfig {
  apiUrl: string;
  sessionId: string;
  fingerprint: BrowserFingerprint;
}

interface BrowserFingerprint {
  userAgent: string;
  language: string;
  platform: string;
  screenResolution: string;
  timezone: string;
  cookiesEnabled: boolean;
}

interface MessageResponse {
  status: string;
  messageId: string;
  message: string;
  note: string;
  demonstration?: {
    captured_ip: string;
    captured_agent: string;
    timestamp: string;
  };
}

class ModernMessageStore {
  private config: DemoConfig;
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.config = {
      apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
      sessionId: this.sessionId,
      fingerprint: this.generateFingerprint()
    };
    
    // Track initialization for demo purposes
    this.trackEvent('store_initialized', { timestamp: Date.now() });
  }

  private generateSessionId(): string {
    return crypto.randomUUID();
  }

  private generateFingerprint(): BrowserFingerprint {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      cookiesEnabled: navigator.cookieEnabled
    };
  }

  // Track user interactions (demonstrates privacy violations)
  private async trackEvent(event: string, data: any = {}): Promise<void> {
    try {
      await fetch(`${this.config.apiUrl}/analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': this.sessionId
        },
        body: JSON.stringify({
          event,
          data: {
            ...data,
            fingerprint: this.config.fingerprint,
            timestamp: Date.now()
          }
        })
      });
    } catch (error) {
      console.error('Analytics tracking failed:', error);
    }
  }

  async addMessage(content: string): Promise<MessageResponse> {
    // Track message attempt
    await this.trackEvent('message_attempt', { 
      contentLength: content.length,
      hasEmoji: /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/gu.test(content)
    });

    try {
      const response = await fetch(`${this.config.apiUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': this.sessionId,
          'User-Agent': navigator.userAgent
        },
        body: JSON.stringify({
          content: content.trim(),
          metadata: {
            fingerprint: this.config.fingerprint,
            referrer: document.referrer,
            currentUrl: window.location.href
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP ${response.status}: ${errorData.error || 'Unknown error'}`);
      }

      const result = await response.json();
      
      // Track successful submission
      await this.trackEvent('message_submitted', { 
        messageId: result.messageId,
        success: true 
      });

      return result;

    } catch (error) {
      // Track failed submission
      await this.trackEvent('message_failed', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false 
      });

      console.error('Message submission failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to send message: ${errorMessage}`);
    }
  }

  // Simulate various tracking methods that real attackers might use
  async simulateAdvancedTracking(): Promise<void> {
    const trackingData = {
      // Browser capabilities
      webGL: this.getWebGLInfo(),
      canvas: this.getCanvasFingerprint(),
      audio: await this.getAudioFingerprint(),
      
      // Network information
      connection: (navigator as any).connection?.effectiveType || 'unknown',
      
      // Hardware information
      hardwareConcurrency: navigator.hardwareConcurrency || 0,
      deviceMemory: (navigator as any).deviceMemory || 'unknown',
      
      // Behavioral data
      mouseMovements: [], // Would be populated with real mouse tracking
      keystrokes: [], // Would be populated with keystroke analysis
      
      // Location attempts
      geolocation: await this.attemptGeolocation(),
    };

    await this.trackEvent('advanced_fingerprinting', trackingData);
  }

  private getWebGLInfo(): string {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl');
      return gl ? gl.getParameter(gl.RENDERER) : 'not supported';
    } catch {
      return 'error';
    }
  }

  private getCanvasFingerprint(): string {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return 'not supported';
      
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Security demo fingerprinting', 2, 2);
      
      return canvas.toDataURL().slice(-20); // Last 20 chars as fingerprint
    } catch {
      return 'error';
    }
  }

  private async getAudioFingerprint(): Promise<string> {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const analyser = audioContext.createAnalyser();
      
      oscillator.connect(analyser);
      oscillator.start(0);
      oscillator.stop(0.1);
      
      return 'audio_fingerprint_generated';
    } catch {
      return 'not_supported';
    }
  }

  private async attemptGeolocation(): Promise<string> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve('not_supported');
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(`${position.coords.latitude.toFixed(2)},${position.coords.longitude.toFixed(2)}`);
        },
        () => {
          resolve('denied');
        },
        { timeout: 5000 }
      );
    });
  }

  // Method to check if running in demo mode
  isDemoMode(): boolean {
    return import.meta.env.MODE === 'development' || 
           window.location.hostname === 'localhost' ||
           window.location.search.includes('demo=true');
  }

  // Get collected data (for educational dashboard)
  async getDemoData(adminKey: string): Promise<any> {
    if (!this.isDemoMode()) {
      throw new Error('Demo data only available in demo mode');
    }

    try {
      const response = await fetch(`${this.config.apiUrl}/admin/messages`, {
        headers: {
          'X-Admin-Key': adminKey
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch demo data');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get demo data:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const messageStore = new ModernMessageStore();

// Start advanced tracking simulation
if (typeof window !== 'undefined') {
  // Delay to avoid impacting initial page load
  setTimeout(() => {
    messageStore.simulateAdvancedTracking();
  }, 2000);
}
