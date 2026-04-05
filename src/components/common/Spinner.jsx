export default function Spinner({ size = 32, color = '#4f46e5' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{
        width: size, height: size,
        border: `3px solid #e0e7ff`,
        borderTop: `3px solid ${color}`,
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}