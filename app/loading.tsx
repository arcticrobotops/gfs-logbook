export default function Loading() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F0E8D0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            color: '#7A5A0B',
            fontSize: '14px',
            letterSpacing: '0.25em',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        >
          &#9670;
        </div>
        <p
          style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: '#1A2744',
            marginTop: '16px',
          }}
        >
          Loading station log...
        </p>
        <style dangerouslySetInnerHTML={{ __html: '@keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }' }} />
      </div>
    </div>
  );
}
