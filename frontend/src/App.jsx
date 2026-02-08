import { useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Navbar from './components/Navbar'
import Toast from './components/Toast'
import LibraryPage from './pages/LibraryPage'
import UploadPage from './pages/UploadPage'
import SearchPage from './pages/SearchPage'
import ChatPage from './pages/ChatPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import { AuthProvider, useAuth } from './contexts/AuthContext'

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#0a0a0f', paper: '#0f0f14' },
    primary: { main: '#c9a84c' },
    text: { primary: '#f6f5f3' }
  },
  typography: {
    fontFamily: "'IBM Plex Mono', monospace",
    h6: { fontFamily: "'Playfair Display', serif" }
  }
})

function AppContent() {
  const { user, loading, logout } = useAuth()
  const [page, setPage] = useState('library')
  const [toasts, setToasts] = useState([])

  const addToast = (t) => setToasts(prev => [...prev, t])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
          <Container maxWidth="lg" sx={{ pt: 10, pb: 6 }}>
            {page === 'login' ? (
              <LoginPage setPage={setPage} />
            ) : (
              <SignupPage setPage={setPage} />
            )}
          </Container>
        </Box>
      </ThemeProvider>
    )
  }

  const pages = {
    library: <LibraryPage addToast={addToast} />,
    upload:  <UploadPage  addToast={addToast} />,
    search:  <SearchPage  addToast={addToast} />,
    chat:    <ChatPage    addToast={addToast} />,
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navbar activePage={page} setActivePage={setPage} logout={logout} />
        <Container maxWidth="lg" sx={{ pt: 10, pb: 6 }}>
          {pages[page]}
        </Container>
        <Toast toasts={toasts} setToasts={setToasts} />
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
