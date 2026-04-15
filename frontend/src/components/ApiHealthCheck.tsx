import React, { useEffect, useState } from 'react';
import { env } from '../app/config/env';

/**
 * A simple diagnostic component to verify React can talk to Laravel.
 * Place <ApiHealthCheck /> anywhere in your app to test the connection.
 */
export const ApiHealthCheck: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'checking' | 'alive' | 'dead'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkConnection = async () => {
      setStatus('checking');
      try {
        // We ping the generic health endpoint if available, or just the root API
        // Laravel 11 automatically sets up /up for health checks.
        const response = await fetch(env.API_URL.replace('/api', '/up'), {
          headers: {
            'Accept': 'application/json',
          }
        });

        if (response.ok) {
          setStatus('alive');
          setMessage('✅ React is successfully talking to Laravel!');
        } else {
          setStatus('dead');
          setMessage(`❌ Laravel responded, but with an error: ${response.status}`);
        }
      } catch (error: any) {
        setStatus('dead');
        setMessage(`🚨 Network Error (likely CORS or server is down): ${error.message}`);
      }
    };

    checkConnection();
  }, []);

  return (
    <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', margin: '1rem 0', fontFamily: 'monospace' }}>
      <strong>API Health Check</strong>
      <div style={{ marginTop: '0.5rem' }}>
        {status === 'checking' && <span>🔄 Checking connection to {env.API_URL}...</span>}
        {status === 'alive' && <span style={{ color: 'green' }}>{message}</span>}
        {status === 'dead' && <span style={{ color: 'red' }}>{message}</span>}
      </div>
      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>
        Attempting to reach: {env.API_URL.replace('/api', '/up')}
      </div>
    </div>
  );
};
