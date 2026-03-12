'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('[GFS Logbook] Error boundary caught:', error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F0E8D0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '28rem' }}>
        <div style={{ color: '#7A5A0B', fontSize: '14px', letterSpacing: '0.25em', marginBottom: '12px' }}>&#9670;</div>
        <h1
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: '1.5rem',
            marginBottom: '16px',
            color: '#1A2744',
          }}
        >
          Something went wrong
        </h1>
        <p
          style={{
            fontFamily: '"DM Sans", system-ui, sans-serif',
            fontSize: '0.875rem',
            color: '#666666',
            marginBottom: '32px',
            lineHeight: '1.6',
          }}
        >
          We hit a snag loading the station log. This usually resolves on retry.
        </p>
        <button
          onClick={() => reset()}
          style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            padding: '12px 24px',
            border: '1.5px solid #1A2744',
            backgroundColor: 'transparent',
            color: '#1A2744',
            cursor: 'pointer',
          }}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
