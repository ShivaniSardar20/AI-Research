import { useEffect, useState } from 'react'
import { listPapers } from '../utils/api'

export default function DashboardPage({ onNavigate, addToast }) {
  const [papers, setPapers] = useState([])

  useEffect(() => {
    listPapers().then(setPapers).catch(() => {
      setPapers([])
      addToast({ type: 'error', message: 'Could not load dashboard data.' })
    })
  }, [addToast])

  const summaryCount = papers.filter((paper) => paper.summary).length
  const insightsCount = papers.filter((paper) => paper.insights).length

  return (
    <div className="feature-shell">
      <div className="feature-header">
        <div>
          <p className="feature-eyebrow">Dashboard</p>
          <h2 className="feature-title">Research operations in one place</h2>
          <p className="feature-copy">
            This dashboard mirrors the main reference app pattern: stats on top, quick actions in the middle, and your current document state underneath.
          </p>
        </div>
        <div className="stat-strip compact">
          <div><strong>{papers.length}</strong><span>Papers</span></div>
          <div><strong>{summaryCount}</strong><span>Summaries</span></div>
          <div><strong>{insightsCount}</strong><span>Insights</span></div>
        </div>
      </div>

      <div className="feature-cards-grid dashboard-actions">
        <button type="button" className="feature-marketing-card app-card-button" onClick={() => onNavigate('upload')}>
          <h3>Upload New Paper</h3>
          <p>Start a new ingestion flow and extract PDF text before analysis.</p>
        </button>
        <button type="button" className="feature-marketing-card app-card-button" onClick={() => onNavigate('summarizer')}>
          <h3>Open Summarizer</h3>
          <p>Generate structured summaries for already uploaded papers.</p>
        </button>
        <button type="button" className="feature-marketing-card app-card-button" onClick={() => onNavigate('insights')}>
          <h3>Open Insights</h3>
          <p>Extract technical concepts, objectives, and conclusions from the library.</p>
        </button>
        <button type="button" className="feature-marketing-card app-card-button" onClick={() => onNavigate('search')}>
          <h3>Run Semantic Search</h3>
          <p>Search across all indexed content using natural language.</p>
        </button>
      </div>

      <div className="glass-panel feature-panel">
        <p className="feature-panel-title">Recent Papers</p>
        {papers.length === 0 ? (
          <div className="empty-state compact">
            <h3>No papers yet</h3>
            <p>Upload your first paper to populate the workspace.</p>
          </div>
        ) : (
          <div className="dashboard-list">
            {papers.slice(0, 5).map((paper) => (
              <div key={paper.id} className="dashboard-list-item">
                <div>
                  <strong>{paper.title || paper.filename}</strong>
                  <p>{new Date(paper.created_at).toLocaleDateString()}</p>
                </div>
                <div className="badge-row">
                  {paper.summary && <span className="status-chip ready">Summary</span>}
                  {paper.insights && <span className="status-chip blue ready">Insights</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="glass-panel workspace-image-panel">
        <div>
          <p className="feature-panel-title">Workspace Snapshot</p>
          <h3 className="workspace-image-title">One environment for ingestion, analysis, retrieval, and chat</h3>
          <p className="feature-copy">The dashboard now carries a built-in visual panel so the workspace feels like a complete product, not a text-only shell.</p>
        </div>
        <div className="dashboard-icon-cluster">
          <div className="dashboard-icon-card">
            <i className="fa-solid fa-cloud-arrow-up"></i>
            <span>Upload</span>
          </div>
          <div className="dashboard-icon-card">
            <i className="fa-solid fa-file-lines"></i>
            <span>Summarize</span>
          </div>
          <div className="dashboard-icon-card">
            <i className="fa-solid fa-lightbulb"></i>
            <span>Insights</span>
          </div>
          <div className="dashboard-icon-card">
            <i className="fa-solid fa-magnifying-glass"></i>
            <span>Search</span>
          </div>
          <div className="dashboard-icon-card">
            <i className="fa-solid fa-comments"></i>
            <span>Chat</span>
          </div>
          <div className="dashboard-icon-card">
            <i className="fa-solid fa-table-columns"></i>
            <span>Manage</span>
          </div>
        </div>
      </div>
    </div>
  )
}
