/**
 * Security Demo Dashboard - Shows Collected Data
 * 
 * This component demonstrates what attackers might see from their
 * data collection efforts. For educational purposes only.
 */

import { useState } from 'react';
import { Shield, Eye, Users, MapPin, Clock, AlertTriangle } from 'lucide-react';
import { messageStore } from '../store/modernMessageStore';

interface CapturedMessage {
  id: string;
  content: string;
  timestamp: string;
  ip_address: string;
  user_agent: string;
  fingerprint: string;
  session_id: string;
}

interface DashboardData {
  message: string;
  count: number;
  data: CapturedMessage[];
  note: string;
}

export function SecurityDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adminKey, setAdminKey] = useState('admin2024secure');
  const [showWarning, setShowWarning] = useState(true);

  const fetchDemoData = async () => {
    if (!messageStore.isDemoMode()) {
      setError('Dashboard only available in demo mode');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await messageStore.getDemoData(adminKey);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const parseFingerprint = (fingerprintStr: string) => {
    try {
      return JSON.parse(fingerprintStr);
    } catch {
      return {};
    }
  };

  const formatUserAgent = (ua: string) => {
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Warning Banner */}
      {showWarning && (
        <div className="mb-6 bg-red-900/50 border border-red-500 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-bold text-red-300 mb-2">⚠️ EDUCATIONAL DEMONSTRATION ONLY</h3>
            <p className="text-red-200 text-sm mb-3">
              This dashboard shows what malicious actors could collect from users who think they're anonymous. 
              This is for cybersecurity education and awareness purposes only.
            </p>
            <button
              onClick={() => setShowWarning(false)}
              className="bg-red-700 hover:bg-red-600 px-3 py-1 rounded text-sm transition-colors"
            >
              I Understand - Continue to Demo
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-red-400" />
          <div>
            <h1 className="text-3xl font-bold">Security Demo Dashboard</h1>
            <p className="text-gray-400">Collected data from "anonymous" message submissions</p>
          </div>
        </div>

        {/* Admin Access */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Admin Access
          </h2>
          <div className="flex gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-2">Demo Admin Key</label>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded px-3 py-2 w-64"
                placeholder="Enter demo admin key"
              />
            </div>
            <button
              onClick={fetchDemoData}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-2 rounded font-medium transition-colors"
            >
              {loading ? 'Loading...' : 'Load Captured Data'}
            </button>
          </div>
          {error && (
            <div className="mt-3 text-red-400 text-sm">
              Error: {error}
            </div>
          )}
        </div>

        {/* Statistics */}
        {data && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-blue-400" />
                  <div>
                    <p className="text-2xl font-bold">{data.count}</p>
                    <p className="text-gray-400">Messages Captured</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center gap-3">
                  <MapPin className="w-8 h-8 text-green-400" />
                  <div>
                    <p className="text-2xl font-bold">{new Set(data.data.map(d => d.ip_address)).size}</p>
                    <p className="text-gray-400">Unique IP Addresses</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 text-yellow-400" />
                  <div>
                    <p className="text-2xl font-bold">
                      {data.data.length > 0 ? new Date(data.data[0].timestamp).toLocaleDateString() : 'N/A'}
                    </p>
                    <p className="text-gray-400">Latest Activity</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Captured Messages */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Captured "Anonymous" Messages</h2>
              
              {data.data.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  No messages captured yet. Submit some messages in the main app to see data here.
                </p>
              ) : (
                <div className="space-y-4">
                  {data.data.map((message) => {
                    const fingerprint = parseFingerprint(message.fingerprint);
                    
                    return (
                      <div key={message.id} className="border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                          {/* Message Content */}
                          <div className="lg:col-span-2">
                            <h3 className="font-medium text-green-400 mb-2">Message Content</h3>
                            <p className="bg-gray-900 p-3 rounded text-gray-300 italic">
                              "{message.content}"
                            </p>
                          </div>
                          
                          {/* Collected Metadata */}
                          <div>
                            <h3 className="font-medium text-red-400 mb-2">Collected Data</h3>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="text-gray-400">IP:</span>
                                <span className="ml-2 font-mono">{message.ip_address}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Browser:</span>
                                <span className="ml-2">{formatUserAgent(message.user_agent)}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Time:</span>
                                <span className="ml-2">{new Date(message.timestamp).toLocaleString()}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Session:</span>
                                <span className="ml-2 font-mono text-xs">{message.session_id.substring(0, 8)}...</span>
                              </div>
                              {fingerprint.platform && (
                                <div>
                                  <span className="text-gray-400">Platform:</span>
                                  <span className="ml-2">{fingerprint.platform}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Educational Note */}
            <div className="mt-8 bg-blue-900/30 border border-blue-500 rounded-lg p-6">
              <h3 className="font-bold text-blue-300 mb-3">🎓 Educational Insights</h3>
              <div className="text-blue-200 text-sm space-y-2">
                <p>• <strong>IP Tracking:</strong> Shows user's real location and ISP information</p>
                <p>• <strong>Browser Fingerprinting:</strong> Unique identifiers that persist across sessions</p>
                <p>• <strong>Behavioral Analysis:</strong> Message patterns can reveal personal information</p>
                <p>• <strong>Session Tracking:</strong> Links multiple interactions to the same user</p>
                <p>• <strong>Metadata Collection:</strong> Technical details users don't realize they're sharing</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SecurityDashboard;
