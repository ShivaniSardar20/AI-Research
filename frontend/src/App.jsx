import { useEffect, useMemo, useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Toast from './components/Toast'
import UploadPage from './pages/UploadPage'
import SearchPage from './pages/SearchPage'
import ChatPage from './pages/ChatPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import SummarizerPage from './pages/SummarizerPage'
import InsightPage from './pages/InsightPage'
import WorkspaceSidebar from './components/WorkspaceSidebar'
import { AuthProvider, useAuth } from './contexts/AuthContext'

const landingFeatures = [
  { title: 'Easy Upload', description: 'Drag in a PDF, preview extracted text, and send it straight into your research library.' },
  { title: 'Smart Summaries', description: 'Generate structured summaries covering abstract, methodology, findings, and limitations.' },
  { title: 'Technical Insights', description: 'Extract objectives, concepts, and conclusions from each paper with one action.' },
  { title: 'Semantic Search', description: 'Search across titles, text, summaries, and insights using natural language.' },
  { title: 'Paper Chat', description: 'Ask follow-up questions against a selected paper with language-aware voice support.' },
  { title: 'Workspace Dashboard', description: 'Move from landing page into a dedicated app shell with sidebar navigation and quick stats.' },
]

const workflowSteps = [
  'Upload your paper',
  'Process text with AI',
  'Generate summaries and insights',
  'Search and chat with context',
]

const workspaceViews = {
  dashboard: 'Dashboard',
  upload: 'Upload Paper',
  summarizer: 'Summarizer',
  insights: 'Insights',
  search: 'Semantic Search',
  chat: 'Chat with AI',
}

function AppContent() {
  const { loading, logout, user } = useAuth()
  const [toasts, setToasts] = useState([])
  const [showAuth, setShowAuth] = useState(false)
  const [authType, setAuthType] = useState('login')
  const [currentView, setCurrentView] = useState('landing')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem('theme_mode') || 'dark')

  useEffect(() => {
    if (!user && currentView !== 'landing') {
      setCurrentView('landing')
    }
  }, [user, currentView])

  useEffect(() => {
    localStorage.setItem('theme_mode', themeMode)
  }, [themeMode])

  const addToast = (toast) => setToasts((prev) => [...prev, toast])
  const toggleTheme = () => setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'))

  const theme = useMemo(() => createTheme({
    palette: {
      mode: themeMode,
      background: themeMode === 'dark'
        ? { default: '#07111d', paper: '#0d1b2a' }
        : { default: '#f4f8fc', paper: '#ffffff' },
      primary: { main: '#2b7bbb' },
      secondary: { main: '#ffb703' },
      text: themeMode === 'dark'
        ? { primary: '#f1f5f9', secondary: '#94a3b8' }
        : { primary: '#102033', secondary: '#5b7288' },
    },
    typography: {
      fontFamily: "'Manrope', sans-serif",
    },
  }), [themeMode])

  const openLogin = () => {
    setAuthType('login')
    setShowAuth(true)
  }

  const openSignup = () => {
    setAuthType('signup')
    setShowAuth(true)
  }

  const openWorkspace = (view = 'dashboard') => {
    if (!user) {
      openLogin()
      return
    }
    setCurrentView(view)
  }

  const setAuthPage = (page) => {
    if (page === 'signup' || page === 'login') {
      setAuthType(page)
      return
    }
    setShowAuth(false)
    setCurrentView('dashboard')
  }

  const handleLogout = () => {
    logout()
    setCurrentView('landing')
    setSidebarOpen(false)
  }

  const currentTitle = useMemo(() => workspaceViews[currentView] || 'AI Research', [currentView])

  const AuthModal = () => {
    const Component = authType === 'signup' ? SignupPage : LoginPage

    return (
      <div className="auth-overlay">
        <div className="auth-shell">
          <button
            type="button"
            onClick={() => setShowAuth(false)}
            className="auth-close"
            aria-label="Close authentication dialog"
          >
            X
          </button>
          <Component setPage={setAuthPage} />
        </div>
      </div>
    )
  }

  if (loading) {
    return <div className="app-loading">Loading AI...</div>
  }

  const renderWorkspaceView = () => {
    if (currentView === 'dashboard') return <DashboardPage onNavigate={setCurrentView} addToast={addToast} />
    if (currentView === 'upload') {
      return (
        <UploadPage
          addToast={addToast}
          onUploadSuccess={() => setCurrentView('summarizer')}
        />
      )
    }
    if (currentView === 'summarizer') return <SummarizerPage addToast={addToast} />
    if (currentView === 'insights') return <InsightPage addToast={addToast} />
    if (currentView === 'search') return <SearchPage addToast={addToast} />
    if (currentView === 'chat') return <ChatPage addToast={addToast} />
    return <DashboardPage onNavigate={setCurrentView} addToast={addToast} />
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh' }} className={`app-theme theme-${themeMode}`}>
        {currentView === 'landing' ? (
          <div className="marketing-shell">
            <header className="marketing-nav">
              <div className="marketing-brand">
                <div className="brand-mark">IH</div>
                <span>InsightHub</span>
              </div>
              <nav className="marketing-links">
                <a href="#features">Features</a>
                <a href="#how-it-works">How It Works</a>
                <a href="#workspace-preview">Workspace</a>
              </nav>
              <div className="marketing-actions">
                <button type="button" className="ghost-chip theme-toggle" onClick={toggleTheme}>
                  {themeMode === 'dark' ? 'Light' : 'Dark'}
                </button>
                {user ? (
                  <>
                    <button type="button" className="ghost-chip" onClick={() => openWorkspace('dashboard')}>Open App</button>
                    <button type="button" onClick={handleLogout}>Logout</button>
                  </>
                ) : (
                  <>
                    <button type="button" onClick={openSignup}>Get Started</button>
                  </>
                )}
              </div>
            </header>

            <section className="marketing-hero">
              <div className="marketing-hero-inner">
                <div className="marketing-hero-copyblock">
                  <div className="marketing-hero-badge-wrap">
                    <p className="eyebrow marketing-eyebrow-pill">AI-Powered Research Assistant</p>
                  </div>
                  <h1 className="marketing-title">AI infrastructure for serious literature review and research analysis</h1>
                  <p className="marketing-copy">
                    Ingest academic PDFs, generate structured summaries, surface technical insights, and search or chat across your research corpus from one professional workspace.
                  </p>
                  <div className="marketing-cta">
                    <button type="button" onClick={() => openWorkspace('dashboard')}>Open Research Workspace</button>
                    <button type="button" className="button-secondary" onClick={() => document.getElementById('workspace-preview')?.scrollIntoView({ behavior: 'smooth' })}>
                      See Demo
                    </button>
                  </div>
                  <div className="marketing-trust">
                    <span>Drag and drop upload</span>
                    <span>Semantic search</span>
                    <span>AI summaries</span>
                  </div>
                </div>
              </div>
            </section>

            <section id="how-it-works" className="marketing-section marketing-section-alt">
              <div className="section-head">
                <h2>How It Works</h2>
                <p>Get started in minutes with the same four-step product story as the reference project.</p>
              </div>
              <div className="workflow-grid">
                {workflowSteps.map((step, index) => (
                  <div key={step} className="workflow-card">
                    <div className="workflow-badge">{`0${index + 1}`}</div>
                    <h3>{step}</h3>
                    <p>
                      {index === 0 && 'Upload a PDF and extract text client-side before it ever reaches the backend.'}
                      {index === 1 && 'Use the backend AI endpoints to generate reusable analysis artifacts.'}
                      {index === 2 && 'Store summaries and insights directly alongside each paper in your library.'}
                      {index === 3 && 'Retrieve and converse over the indexed document set from the workspace shell.'}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section id="features" className="marketing-section">
              <div className="section-head">
                <h2>Everything You Need for Research</h2>
                <p>Core capabilities from the reference app mapped onto your current Django and CRA stack.</p>
              </div>
              <div className="feature-cards-grid">
                {landingFeatures.map((feature) => (
                  <div key={feature.title} className="feature-marketing-card">
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="workspace-preview" className="marketing-section marketing-preview">
              <div className="section-head">
                <h2>Workspace Preview</h2>
                <p>The authenticated app opens into a dashboard-and-sidebar shell modeled on the main reference project.</p>
              </div>
              <div className="workspace-preview-card">
                <div className="preview-sidebar">
                  {Object.values(workspaceViews).map((label) => (
                    <div key={label} className="preview-nav-item">{label}</div>
                  ))}
                </div>
                <div className="preview-main">
                  <div className="preview-topbar">
                    <span>Dashboard</span>
                    <span>{user ? 'Authenticated session ready' : 'Login to unlock workspace'}</span>
                  </div>
                  <div className="preview-copy-panel">
                    <strong>Dedicated workspace after authentication</strong>
                    <p>Open a sidebar-based environment with upload, summarizer, insights, search, and chat views arranged as a focused research workflow.</p>
                    <div className="preview-pill-row">
                      <span>Dashboard</span>
                      <span>Summarizer</span>
                      <span>Insights</span>
                      <span>Search</span>
                      <span>Chat</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="marketing-section marketing-cta-band">
              <div className="cta-band-inner">
                <h2>Ready to transform your research workflow?</h2>
                <p>Start from the landing page, then move into the dedicated app workspace after authentication.</p>
                <div className="marketing-cta">
                  <button type="button" onClick={() => openWorkspace('dashboard')}>Start Free Trial</button>
                  <button type="button" className="button-secondary" onClick={openSignup}>Create Account</button>
                </div>
              </div>
            </section>

            <footer className="marketing-footer">
              <div>
                <div className="marketing-brand">
                  <div className="brand-mark">IH</div>
                  <span>InsightHub</span>
                </div>
                <p>AI-powered research paper analysis for academics and professionals.</p>
              </div>
              <div className="footer-links">
                <a href="#features">Features</a>
                <a href="#how-it-works">Workflow</a>
                <button type="button" className="footer-button-link" onClick={() => openWorkspace('dashboard')}>Workspace</button>
              </div>
            </footer>
          </div>
        ) : (
          <div className="workspace-shell">
            <WorkspaceSidebar
              currentView={currentView}
              onNavigate={(view) => {
                setCurrentView(view)
                setSidebarOpen(false)
              }}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />

            <main className="workspace-main">
              <header className="workspace-header">
                <div className="workspace-header-left">
                  <button type="button" className="icon-action workspace-menu" onClick={() => setSidebarOpen(true)}>Menu</button>
                  <div>
                    <p className="feature-eyebrow">Workspace</p>
                    <h2>{currentTitle}</h2>
                  </div>
                </div>
                <div className="workspace-header-right">
                  <button type="button" className="ghost-chip theme-toggle" onClick={toggleTheme}>
                    {themeMode === 'dark' ? 'Light' : 'Dark'}
                  </button>
                  <button type="button" className="ghost-chip" onClick={() => setCurrentView('landing')}>Landing</button>
                  <div className="workspace-user">
                    <span>{user?.username || 'Research User'}</span>
                    <button type="button" className="ghost-chip" onClick={handleLogout}>Logout</button>
                  </div>
                </div>
              </header>
              <div className="workspace-content">
                {renderWorkspaceView()}
              </div>
            </main>
          </div>
        )}

        <Toast toasts={toasts} setToasts={setToasts} />
        {showAuth && <AuthModal />}
      </Box>
    </ThemeProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
