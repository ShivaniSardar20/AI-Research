import { useState } from 'react'
import Navbar from './components/Navbar'
import Toast from './components/Toast'
import LibraryPage from './pages/LibraryPage'
import UploadPage from './pages/UploadPage'
import SearchPage from './pages/SearchPage'
import ChatPage from './pages/ChatPage'

export default function App() {
  const [page, setPage] = useState('library')
  const [toasts, setToasts] = useState([])

  const addToast = (t) => setToasts(prev => [...prev, t])

  const pages = {
    library: <LibraryPage addToast={addToast} />,
    upload:  <UploadPage  addToast={addToast} />,
    search:  <SearchPage  addToast={addToast} />,
    chat:    <ChatPage    addToast={addToast} />,
  }

  return (
    <div style={{ fontFamily: "'IBM Plex Mono', monospace", background: '#0a0a0f', minHeight: '100vh' }}>
      <Navbar activePage={page} setActivePage={setPage} />
      {pages[page]}
      <Toast toasts={toasts} setToasts={setToasts} />
    </div>
  )
}
