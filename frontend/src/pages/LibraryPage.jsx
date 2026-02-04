import { useState, useEffect } from 'react'
import { listPapers, summarize, extractInsights, deletePaper } from '../utils/api'
import Spinner from '../components/Spinner'

export default function LibraryPage({ addToast }) {
  const [papers, setPapers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)   // paper object with full data
  const [processing, setProcessing] = useState({}) // { [id]: 'summarize'|'insights'|null }

  const fetchPapers = async () => {
    try {
      const data = await listPapers()
      setPapers(data)
    } catch {
      addToast({ type: 'error', message: 'Could not fetch papers. Is the backend running?' })
    }
    setLoading(false)
  }

  useEffect(() => { fetchPapers() }, [])

  const triggerAction = async (id, action) => {
    setProcessing(p => ({ ...p, [id]: action }))
    try {
      const fn = action === 'summarize' ? summarize : extractInsights
      const result = await fn(id)
      // Merge result into selected if modal is open for this paper
      setPapers(prev => prev.map(p => p.id === id ? { ...p, ...result } : p))
      if (selected?.id === id) setSelected(s => ({ ...s, ...result }))
      addToast({ type: 'success', message: `${action === 'summarize' ? 'Summary' : 'Insights'} generated.` })
    } catch {
      addToast({ type: 'error', message: `Failed to generate ${action}.` })
    }
    setProcessing(p => ({ ...p, [id]: null }))
  }

  const handleDelete = async (id) => {
    try {
      await deletePaper(id)
      setPapers(prev => prev.filter(p => p.id !== id))
      if (selected?.id === id) setSelected(null)
      addToast({ type: 'success', message: 'Paper removed.' })
    } catch {
      addToast({ type: 'error', message: 'Delete failed.' })
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0f' }}>
      <Spinner size={36} />
    </div>
  )

  return (
    <div className="min-h-screen px-4" style={{ paddingTop: '100px', background: '#0a0a0f' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.6rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#c9a84c', marginBottom: '10px' }}>— Library</p>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '2rem', color: '#e8e4dc', fontWeight: 400 }}>Your <em style={{ color: '#c9a84c' }}>research</em> collection</h1>
        </div>

        {papers.length === 0 ? (
          <div className="rounded-lg flex flex-col items-center justify-center py-24" style={{ border: '1px solid rgba(201,168,76,0.15)', background: '#0e0e16' }}>
            <div style={{ fontSize: '2.4rem', opacity: 0.3, marginBottom: '14px' }}>📚</div>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.7rem', color: '#7a756b' }}>No papers yet. Upload one to get started.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {papers.map(paper => (
              <div key={paper.id} className="rounded-lg overflow-hidden transition-all duration-200 cursor-pointer"
                style={{ border: '1px solid rgba(201,168,76,0.15)', background: '#12121a' }}
                onClick={() => setSelected(paper)}>
                <div className="flex items-start justify-between p-4 gap-4">
                  <div className="flex-1 min-w-0">
                    <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.05rem', color: '#e8e4dc', fontWeight: 400, marginBottom: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {paper.title || paper.filename}
                    </p>
                    <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.6rem', color: '#7a756b' }}>
                      Uploaded {new Date(paper.created_at).toLocaleDateString()} · {paper.filename}
                    </p>
                  </div>
                  {/* Action buttons */}
                  <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                    {['summarize', 'insights'].map(action => (
                      <button key={action} onClick={() => triggerAction(paper.id, action)}
                        disabled={!!processing[paper.id]}
                        className="transition-all duration-200"
                        style={{
                          background: 'transparent',
                          border: '1px solid rgba(201,168,76,0.3)',
                          color: '#c9a84c',
                          padding: '6px 12px',
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: '0.58rem', letterSpacing: '1.5px', textTransform: 'uppercase',
                          cursor: processing[paper.id] ? 'not-allowed' : 'pointer', borderRadius: '3px',
                          opacity: processing[paper.id] ? 0.5 : 1
                        }}>
                        {processing[paper.id] === action ? <Spinner size={10} /> : action === 'summarize' ? '✦ Summary' : '◈ Insights'}
                      </button>
                    ))}
                    <button onClick={() => handleDelete(paper.id)}
                      className="transition-colors duration-200"
                      style={{ background: 'none', border: 'none', color: '#7a756b', cursor: 'pointer', fontSize: '0.85rem', padding: '4px 6px' }}
                    >✕</button>
                  </div>
                </div>

                {/* Quick badges */}
                <div className="flex flex-wrap gap-2 px-4 pb-3">
                  {paper.summary && <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.55rem', letterSpacing: '1px', color: '#2ecc71', background: 'rgba(46,204,113,0.1)', padding: '3px 8px', borderRadius: '50px', textTransform: 'uppercase' }}>Summary ready</span>}
                  {paper.insights && <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.55rem', letterSpacing: '1px', color: '#5dade2', background: 'rgba(93,173,226,0.1)', padding: '3px 8px', borderRadius: '50px', textTransform: 'uppercase' }}>Insights ready</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-40 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setSelected(null)}>
          <div className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-lg" style={{ background: '#12121a', border: '1px solid rgba(201,168,76,0.25)' }} onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-start justify-between p-5" style={{ borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
              <div>
                <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.2rem', color: '#e8e4dc', fontWeight: 400 }}>{selected.title || selected.filename}</p>
                <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.6rem', color: '#7a756b', marginTop: '4px' }}>{selected.filename}</p>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#7a756b', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
            </div>

            <div className="p-5 flex flex-col gap-6">
              {/* Summary Section */}
              {selected.summary && (
                <div>
                  <SectionTitle icon="✦" label="Summary" />
                  {['abstract', 'methodology', 'findings', 'limitations'].map(key => (
                    selected.summary[key] && (
                      <div key={key} className="mb-3">
                        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.58rem', letterSpacing: '2px', textTransform: 'uppercase', color: '#c9a84c', marginBottom: '5px' }}>{key}</p>
                        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.68rem', color: '#7a756b', lineHeight: 1.85 }}>{selected.summary[key]}</p>
                      </div>
                    )
                  ))}
                </div>
              )}

              {/* Insights Section */}
              {selected.insights && (
                <div>
                  <SectionTitle icon="◈" label="Technical Insights" />
                  {['objectives', 'concepts', 'conclusions'].map(key => (
                    selected.insights[key] && (
                      <div key={key} className="mb-3">
                        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.58rem', letterSpacing: '2px', textTransform: 'uppercase', color: '#5dade2', marginBottom: '5px' }}>{key}</p>
                        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.68rem', color: '#7a756b', lineHeight: 1.85 }}>{selected.insights[key]}</p>
                      </div>
                    )
                  ))}
                </div>
              )}

              {!selected.summary && !selected.insights && (
                <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.68rem', color: '#7a756b', textAlign: 'center', padding: '20px 0' }}>
                  Use the <span style={{ color: '#c9a84c' }}>Summary</span> or <span style={{ color: '#5dade2' }}>Insights</span> buttons to generate analysis.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SectionTitle({ icon, label }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span style={{ color: '#c9a84c', fontSize: '0.75rem' }}>{icon}</span>
      <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '0.95rem', color: '#e8e4dc', fontWeight: 400 }}>{label}</p>
      <div style={{ flex: 1, height: '1px', background: 'rgba(201,168,76,0.15)', marginLeft: '8px' }} />
    </div>
  )
}
