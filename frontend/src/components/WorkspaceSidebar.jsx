const navItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'upload', label: 'Upload Paper' },
  { id: 'summarizer', label: 'Summarizer' },
  { id: 'insights', label: 'Insights' },
  { id: 'search', label: 'Semantic Search' },
  { id: 'chat', label: 'Chat with AI' },
]

export default function WorkspaceSidebar({ currentView, onNavigate, isOpen, onClose }) {
  return (
    <>
      {isOpen && <div className="workspace-overlay" onClick={onClose} />}
      <aside className={`workspace-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="workspace-sidebar-brand">
          <div className="brand-mark">IH</div>
          <div>
            <strong>InsightHub</strong>
            <span>Research Workspace</span>
          </div>
        </div>
        <nav className="workspace-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`workspace-nav-item ${currentView === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  )
}
