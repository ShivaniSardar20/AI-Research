import { useState, useEffect } from 'react'
import { listPapers, summarize, extractInsights, deletePaper } from '../utils/api'
import Spinner from '../components/Spinner'

const viewConfig = {
  library: {
    eyebrow: 'Library',
    title: 'Manage the papers already indexed in your workspace',
    copy: 'Generate structured summaries and technical insight bundles directly from stored extracted text.',
    empty: 'Upload one in the previous section to start generating analysis.',
    summaryVisible: true,
    insightsVisible: true,
  },
  summarizer: {
    eyebrow: 'Summarizer',
    title: 'Generate and review structured paper summaries',
    copy: 'Focus this view on abstracts, methodology, findings, and limitations for each uploaded paper.',
    empty: 'Upload papers first, then generate summaries from this workspace view.',
    summaryVisible: true,
    insightsVisible: false,
  },
  insights: {
    eyebrow: 'Insights',
    title: 'Extract technical objectives, concepts, and conclusions',
    copy: 'Focus this view on technical insight generation and inspection for each paper.',
    empty: 'Upload papers first, then generate insights from this workspace view.',
    summaryVisible: false,
    insightsVisible: true,
  },
}

export default function LibraryPage({ addToast, mode = 'library' }) {
  const [papers, setPapers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [processing, setProcessing] = useState({})
  const config = viewConfig[mode] || viewConfig.library

  const fetchPapers = async () => {
    try {
      const data = await listPapers()
      setPapers(data)
    } catch {
      addToast({ type: 'error', message: 'Could not fetch papers. Is the backend running?' })
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchPapers()
  }, [])

  const triggerAction = async (id, action) => {
    setProcessing((prev) => ({ ...prev, [id]: action }))
    try {
      const fn = action === 'summarize' ? summarize : extractInsights
      const result = await fn(id)
      setPapers((prev) => prev.map((paper) => (paper.id === id ? { ...paper, ...result } : paper)))
      if (selected?.id === id) {
        setSelected((prev) => ({ ...prev, ...result }))
      }
      addToast({ type: 'success', message: `${action === 'summarize' ? 'Summary' : 'Insights'} generated.` })
    } catch {
      addToast({ type: 'error', message: `Failed to generate ${action}.` })
    }
    setProcessing((prev) => ({ ...prev, [id]: null }))
  }

  const handleDelete = async (id) => {
    try {
      await deletePaper(id)
      setPapers((prev) => prev.filter((paper) => paper.id !== id))
      if (selected?.id === id) {
        setSelected(null)
      }
      addToast({ type: 'success', message: 'Paper removed.' })
    } catch {
      addToast({ type: 'error', message: 'Delete failed.' })
    }
  }

  if (loading) {
    return (
      <div className="loading-shell">
        <Spinner size={36} />
      </div>
    )
  }

  const papersWithSummary = papers.filter((paper) => paper.summary).length
  const papersWithInsights = papers.filter((paper) => paper.insights).length

  return (
    <div className="feature-shell">
      <div className="feature-header">
        <div>
          <p className="feature-eyebrow">{config.eyebrow}</p>
          <h2 className="feature-title">{config.title}</h2>
          <p className="feature-copy">{config.copy}</p>
        </div>
        <div className="stat-strip compact">
          <div><strong>{papers.length}</strong><span>Total Papers</span></div>
          <div><strong>{papersWithSummary}</strong><span>Summaries</span></div>
          <div><strong>{papersWithInsights}</strong><span>Insights</span></div>
        </div>
      </div>

      {papers.length === 0 ? (
        <div className="glass-panel empty-state">
          <h3>No papers yet</h3>
          <p>{config.empty}</p>
        </div>
      ) : (
        <div className="library-list">
          {papers.map((paper) => (
            <div key={paper.id} className="glass-panel library-card" onClick={() => setSelected(paper)}>
              <div className="library-card-top">
                <div>
                  <h3>{paper.title || paper.filename}</h3>
                  <p>Uploaded {new Date(paper.created_at).toLocaleDateString()} · {paper.filename}</p>
                </div>
                <div className="library-actions" onClick={(e) => e.stopPropagation()}>
                  {config.summaryVisible && (
                    <button
                      type="button"
                      className="pill-button"
                      onClick={() => triggerAction(paper.id, 'summarize')}
                      disabled={!!processing[paper.id]}
                    >
                      {processing[paper.id] === 'summarize' ? <Spinner size={10} /> : 'Summary'}
                    </button>
                  )}
                  {config.insightsVisible && (
                    <button
                      type="button"
                      className="pill-button"
                      onClick={() => triggerAction(paper.id, 'insights')}
                      disabled={!!processing[paper.id]}
                    >
                      {processing[paper.id] === 'insights' ? <Spinner size={10} /> : 'Insights'}
                    </button>
                  )}
                  {!config.summaryVisible && (
                    <button
                      type="button"
                      className="pill-button"
                      onClick={() => triggerAction(paper.id, 'summarize')}
                      disabled={!!processing[paper.id]}
                    >
                      {processing[paper.id] === 'summarize' ? <Spinner size={10} /> : 'Summary'}
                    </button>
                  )}
                  {!config.insightsVisible && (
                    <button
                      type="button"
                      className="pill-button"
                      onClick={() => triggerAction(paper.id, 'insights')}
                      disabled={!!processing[paper.id]}
                    >
                      {processing[paper.id] === 'insights' ? <Spinner size={10} /> : 'Insights'}
                    </button>
                  )}
                  <button type="button" className="icon-action" onClick={() => handleDelete(paper.id)}>X</button>
                </div>
              </div>
              <div className="badge-row">
                <span className={`status-chip ${paper.summary ? 'ready' : ''}`}>{paper.summary ? 'Summary ready' : 'Summary pending'}</span>
                <span className={`status-chip blue ${paper.insights ? 'ready' : ''}`}>{paper.insights ? 'Insights ready' : 'Insights pending'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="detail-overlay" onClick={() => setSelected(null)}>
          <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="detail-header">
              <div>
                <p className="feature-eyebrow">Paper Detail</p>
                <h3>{selected.title || selected.filename}</h3>
                <p>{selected.filename}</p>
              </div>
              <button type="button" className="icon-action" onClick={() => setSelected(null)}>X</button>
            </div>

            <div className="detail-sections">
              {selected.summary && config.summaryVisible && (
                <div className="glass-panel feature-panel">
                  <p className="feature-panel-title">Summary</p>
                  {['abstract', 'methodology', 'findings', 'limitations'].map((key) => (
                    selected.summary[key] ? (
                      <div key={key} className="content-block">
                        <span>{key}</span>
                        <p>{selected.summary[key]}</p>
                      </div>
                    ) : null
                  ))}
                </div>
              )}

              {selected.insights && config.insightsVisible && (
                <div className="glass-panel feature-panel">
                  <p className="feature-panel-title">Technical Insights</p>
                  {['objectives', 'concepts', 'conclusions'].map((key) => (
                    selected.insights[key] ? (
                      <div key={key} className="content-block">
                        <span>{key}</span>
                        <p>{selected.insights[key]}</p>
                      </div>
                    ) : null
                  ))}
                </div>
              )}

              {!selected.summary && !selected.insights && (
                <div className="glass-panel empty-state">
                  <h3>No analysis yet</h3>
                  <p>Use the action buttons on the card to generate summary or insight content for this paper.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
