import { useState } from 'react'
import { searchPapers } from '../utils/api'
import Spinner from '../components/Spinner'

export default function SearchPage({ addToast }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)  // null = untouched, [] = empty
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    try {
      const data = await searchPapers(query.trim())
      setResults(data)
    } catch {
      addToast({ type: 'error', message: 'Search failed. Is the backend running?' })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen px-4" style={{ paddingTop: '100px', background: '#0a0a0f' }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.6rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#c9a84c', marginBottom: '10px' }}>— Search</p>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '2rem', color: '#e8e4dc', fontWeight: 400 }}>Find across your <em style={{ color: '#c9a84c' }}>library</em></h1>
        </div>

        {/* Search Input */}
        <div className="flex gap-2">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="e.g. What are the findings on neural scaling?"
            className="flex-1 outline-none transition-border duration-200"
            style={{
              background: '#0e0e16', border: '1px solid rgba(201,168,76,0.22)',
              borderRadius: '6px', padding: '13px 18px', color: '#e8e4dc',
              fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.7rem',
            }}
          />
          <button onClick={handleSearch} disabled={loading || !query.trim()}
            className="transition-all duration-200"
            style={{
              background: loading ? 'rgba(201,168,76,0.35)' : '#c9a84c',
              color: '#0a0a0f', border: 'none', borderRadius: '6px',
              padding: '13px 26px', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.65rem',
              letterSpacing: '2px', textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
            {loading ? <Spinner size={14} /> : '🔍'} Search
          </button>
        </div>

        {/* Results */}
        <div className="mt-8">
          {results === null && (
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.68rem', color: '#7a756b', textAlign: 'center', paddingTop: '40px' }}>
              Type a question above to search your document library.
            </p>
          )}

          {results !== null && results.length === 0 && (
            <div className="rounded-lg py-14 text-center" style={{ border: '1px solid rgba(201,168,76,0.12)', background: '#0e0e16' }}>
              <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.68rem', color: '#7a756b' }}>No matching papers found.</p>
            </div>
          )}

          {results !== null && results.length > 0 && (
            <div className="flex flex-col gap-3">
              <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.6rem', color: '#7a756b', letterSpacing: '1px' }}>
                {results.length} result{results.length !== 1 ? 's' : ''} found
              </p>
              {results.map((r, i) => (
                <div key={i} className="rounded-lg overflow-hidden" style={{ border: '1px solid rgba(201,168,76,0.18)', background: '#12121a' }}>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.05rem', color: '#e8e4dc', fontWeight: 400 }}>{r.title || r.filename}</p>
                      {r.score !== undefined && (
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.58rem', color: '#c9a84c', background: 'rgba(201,168,76,0.12)', padding: '3px 8px', borderRadius: '50px' }}>
                          {Math.round(r.score * 100)}% match
                        </span>
                      )}
                    </div>
                    <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.67rem', color: '#7a756b', lineHeight: 1.8 }}>
                      {r.snippet || r.filename}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
