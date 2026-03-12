'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          minHeight: '100vh',
          backgroundColor: '#F5F0E8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          margin: 0,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '28rem' }}>
          <div style={{ color: '#7A5A0B', fontSize: '14px', letterSpacing: '0.25em', marginBottom: '16px' }}>&#9670;</div>
          <h2
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: '1.5rem',
              marginBottom: '16px',
              color: '#1A2744',
            }}
          >
            Something went wrong
          </h2>
          <p
            style={{
              fontSize: '0.875rem',
              color: '#666666',
              marginBottom: '32px',
              lineHeight: '1.6',
            }}
          >
            The station log hit an unexpected error. This usually resolves on retry.
          </p>
          <button
            onClick={() => reset()}
            style={{
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              padding: '12px 24px',
              border: '1px solid #1A2744',
              backgroundColor: 'transparent',
              color: '#1A2744',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
