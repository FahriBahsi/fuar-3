export default function Loading() {
  return (
    <div className="loading-container" style={{ padding: '40px', textAlign: 'center' }}>
      <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
      <p style={{ marginTop: '20px', color: 'var(--text-muted)' }}>Loading...</p>
    </div>
  );
}

