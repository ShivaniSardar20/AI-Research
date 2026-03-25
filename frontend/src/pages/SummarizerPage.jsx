import { useEffect, useState } from 'react'
import { listPapers, summarize } from '../utils/api'
import Spinner from '../components/Spinner'

export default function SummarizerPage({ addToast }) {
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
      .catch(() => addToast({ type: 'error', message: 'Could not load papers for summarization.' }))
      .finally(() => setPageLoading(false))
  }, [addToast])

  const selectedPaper = papers.find((paper) => paper.id === selectedPaperId) || null

  const handleGenerate = async () => {
    if (!selectedPaper) return
    setLoading(true)
    try {
      const updated = await summarize(selectedPaper.id)
      setPapers((prev) => prev.map((paper) => (paper.id === selectedPaper.id ? { ...paper, ...updated } : paper)))
      addToast({ type: 'success', message: 'Summary generated.' })
    } catch {
      addToast({ type: 'error', message: 'Summary generation failed.' })
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
          <p className="feature-eyebrow">Summarizer</p>
          <h3>Select Paper</h3>
        </div>
        <div className="analysis-doc-list">
          {papers.length === 0 && (
            <div className="empty-state compact">
              <h3>No papers uploaded</h3>
              <p>Upload a paper first to generate AI summaries.</p>
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
              <span>{paper.summary ? 'Summary ready' : 'Pending AI'}</span>
            </button>
          ))}
        </div>
      </aside>

      <div className="analysis-main">
        {!selectedPaper ? (
          <div className="glass-panel empty-state">
            <h3>Select a paper</h3>
            <p>Choose a paper from the left to generate or review its summary.</p>
          </div>
        ) : (
          <div className="analysis-stack">
            <div className="glass-panel analysis-hero-card">
              <div>
                <p className="feature-eyebrow">Research Paper Summary</p>
                <h2 className="feature-title">{selectedPaper.title || selectedPaper.filename}</h2>
                <p className="feature-copy">{selectedPaper.filename}</p>
              </div>
              <button type="button" onClick={handleGenerate} disabled={loading}>
                {loading ? <><Spinner size={14} /> Analyzing...</> : selectedPaper.summary ? 'Regenerate Summary' : 'Generate AI Summary'}
              </button>
            </div>

            {!selectedPaper.summary && !loading && (
              <div className="glass-panel empty-state">
                <h3>No summary yet</h3>
                <p>Generate a summary to extract abstract, methodology, findings, and limitations.</p>
              </div>
            )}

            {loading && (
              <div className="glass-panel feature-panel">
                <div className="loading-shell">
                  <Spinner size={28} />
                </div>
              </div>
            )}

            {selectedPaper.summary && (
              <div className="analysis-stack">
                <section className="glass-panel feature-panel">
                  <p className="feature-panel-title">Abstract</p>
                  <p className="analysis-body">{selectedPaper.summary.abstract}</p>
                </section>

                <section className="glass-panel feature-panel">
                  <p className="feature-panel-title">Key Findings</p>
                  <div className="analysis-list">
                    {Array.isArray(selectedPaper.summary.findings)
                      ? selectedPaper.summary.findings.map((finding, index) => (
                          <div key={index} className="analysis-list-item">
                            <span>{index + 1}</span>
                            <p>{finding}</p>
                          </div>
                        ))
                      : <p className="analysis-body">{selectedPaper.summary.findings}</p>}
                  </div>
                </section>

                <div className="feature-grid-2">
                  <section className="glass-panel feature-panel">
                    <p className="feature-panel-title">Methodology</p>
                    <p className="analysis-body">{selectedPaper.summary.methodology}</p>
                  </section>
                  <section className="glass-panel feature-panel">
                    <p className="feature-panel-title">Limitations</p>
                    <p className="analysis-body">{selectedPaper.summary.limitations}</p>
                  </section>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
