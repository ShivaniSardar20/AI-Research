export default function Spinner({ size = 28 }) {
  return (
    <div className="flex items-center justify-center">
      <svg width={size} height={size} viewBox="0 0 28 28" style={{ animation: 'spin 0.8s linear infinite' }}>
        <circle cx="14" cy="14" r="11" fill="none" stroke="rgba(201,168,76,0.15)" strokeWidth="2.5" />
        <circle cx="14" cy="14" r="11" fill="none" stroke="#c9a84c" strokeWidth="2.5"
          strokeDasharray="38 31" strokeLinecap="round" strokeDashoffset="0" />
      </svg>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
