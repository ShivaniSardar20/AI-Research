import { useEffect } from 'react'

export default function Toast({ toasts, setToasts }) {
  useEffect(() => {
    if (toasts.length === 0) return
    const timer = setTimeout(() => {
      setToasts(prev => prev.slice(1))
    }, 3200)
    return () => clearTimeout(timer)
  }, [toasts, setToasts])

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2" style={{ minWidth: '260px' }}>
      {toasts.map((t, i) => (
        <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg transition-all duration-300"
          style={{
            background: '#12121a',
            border: `1px solid ${t.type === 'error' ? 'rgba(231,76,60,0.35)' : 'rgba(201,168,76,0.3)'}`,
            animation: 'slideUp 0.28s ease'
          }}>
          <span style={{ fontSize: '1rem', marginTop: '1px' }}>{t.type === 'error' ? '✕' : '✓'}</span>
          <div>
            <p style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.68rem',
              color: t.type === 'error' ? '#e74c3c' : '#c9a84c', letterSpacing: '0.5px'
            }}>{t.message}</p>
          </div>
          <button onClick={() => setToasts(prev => prev.filter((_, idx) => idx !== i))}
            className="ml-auto cursor-pointer"
            style={{ background: 'none', border: 'none', color: '#7a756b', fontSize: '0.75rem' }}>✕</button>
        </div>
      ))}
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  )
}
