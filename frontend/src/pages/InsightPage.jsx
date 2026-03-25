import { useEffect, useState } from 'react'
import { extractInsights, listPapers } from '../utils/api'
import Spinner from '../components/Spinner'

export default function InsightPage({ addToast }) {
  const [papers, setPapers] = useState([])
  const [selectedPaperId, setSelectedPaperId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    listPapers()
      .then((data) => {
        setPapers(data)
        if (data.length > 0) setSelectedPaperId(data[0].id)
      })
      .catch(() => addToast({ type: 'error', message: 'Could not load papers for insights.' }))
      .finally(() => setPageLoading(false))
  }, [addToast])

  const selectedPaper = papers.find((paper) => paper.id === selectedPaperId) || null

  const handleExtract = async () => {
    if (!selectedPaper) return
    setLoading(true)
    try {
      const updated = await extractInsights(selectedPaper.id)
      setPapers((prev) => prev.map((paper) => (paper.id === selectedPaper.id ? { ...paper, ...updated } : paper)))
      addToast({ type: 'success', message: 'Insights generated.' })
    } catch {
      addToast({ type: 'error', message: 'Insight extraction failed.' })
    }
    setLoading(false)
  }

  if (pageLoading) {
    return (
      <div className="loading-shell">
        <Spinner size={36} />
      </div>
    )
  }

  return (
    <div className="analysis-layout">
      <aside className="analysis-sidebar">
        <div className="analysis-sidebar-head">
          <p className="feature-eyebrow">Insights</p>
          <h3>Papers</h3>
        </div>
        <div className="analysis-doc-list">
          {papers.length === 0 && (
            <div className="empty-state compact">
              <h3>No papers uploaded</h3>
              <p>Upload a paper first to extract deep insights.</p>
            </div>
          )}
          {papers.map((paper) => (
            <button
              key={paper.id}
              type="button"
              className={`analysis-doc-item ${selectedPaperId === paper.id ? 'active' : ''}`}
              onClick={() => setSelectedPaperId(paper.id)}
            >
              <strong>{paper.title || paper.filename}</strong>
              <span>{paper.insights ? 'Insights ready' : 'Pending AI'}</span>
            </button>
          ))}
        </div>
      </aside>

      <div className="analysis-main">
        {!selectedPaper ? (
          <div className="glass-panel empty-state">
            <h3>Select a paper</h3>
            <p>Choose a paper from the left to extract technical insights.</p>
          </div>
        ) : (
          <div className="analysis-stack">
            <div className="glass-panel analysis-hero-card">
              <div>
                <p className="feature-eyebrow">Technical Insights</p>
                <h2 className="feature-title">{selectedPaper.title || selectedPaper.filename}</h2>
                <p className="feature-copy">{selectedPaper.filename}</p>
              </div>
              <button type="button" onClick={handleExtract} disabled={loading}>
                {loading ? <><Spinner size={14} /> Mining data...</> : selectedPaper.insights ? 'Regenerate Insights' : 'Extract Deep Insights'}
              </button>
            </div>

            {!selectedPaper.insights && !loading && (
              <div className="glass-panel empty-state">
                <h3>No insights yet</h3>
                <p>Generate objectives, concepts, and conclusions from the selected paper.</p>
              </div>
            )}

            {loading && (
              <div className="glass-panel feature-panel">
                <div className="loading-shell">
                  <Spinner size={28} />
                </div>
              </div>
            )}

            {selectedPaper.insights && (
              <div className="analysis-grid">
                <section className="glass-panel feature-panel">
                  <p className="feature-panel-title">Objectives</p>
                  <div className="analysis-list">
                    {Array.isArray(selectedPaper.insights.objectives)
                      ? selectedPaper.insights.objectives.map((item, index) => (
                          <div key={index} className="analysis-list-item">
                            <span>{index + 1}</span>
                            <p>{item}</p>
                          </div>
                        ))
                      : <p className="analysis-body">{selectedPaper.insights.objectives}</p>}
                  </div>
                </section>

                <section className="glass-panel feature-panel">
                  <p className="feature-panel-title">Key Concepts</p>
                  <div className="concept-grid">
                    {(Array.isArray(selectedPaper.insights.concepts) ? selectedPaper.insights.concepts : [selectedPaper.insights.concepts]).map((concept, index) => (
                      <span key={index} className="status-chip blue ready">{concept}</span>
                    ))}
                  </div>
                </section>

                <section className="glass-panel feature-panel analysis-grid-span">
                  <p className="feature-panel-title">Conclusions</p>
                  <div className="analysis-list">
                    {(Array.isArray(selectedPaper.insights.conclusions) ? selectedPaper.insights.conclusions : [selectedPaper.insights.conclusions]).map((item, index) => (
                      <div key={index} className="analysis-list-item">
                        <span>{index + 1}</span>
                        <p>{item}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
