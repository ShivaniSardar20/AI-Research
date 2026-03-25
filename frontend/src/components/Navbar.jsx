import React, { useState, useEffect } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import MenuIcon from '@mui/icons-material/Menu'
import LoginIcon from '@mui/icons-material/Login'
import { useAuth } from '../contexts/AuthContext'
import { listPapers } from '../utils/api'

export default function Navbar({ scrollToSection, setShowLogin, setShowSignup }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const [papers, setPapers] = useState([])
  const [libraryOpen, setLibraryOpen] = useState(false)
  const { user, logout } = useAuth()
  const open = Boolean(anchorEl)

  useEffect(() => {
    if (user) {
      listPapers().then(setPapers).catch(() => setPapers([]))
    } else {
      setPapers([])
    }
  }, [user])

  const handleMenu = (e) => setAnchorEl(e.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const toggleLibrary = () => {
    setLibraryOpen((prev) => !prev)
    handleClose()
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        backdropFilter: 'blur(18px)',
        background: 'rgba(7, 17, 29, 0.82)',
        borderBottom: '1px solid rgba(142, 202, 230, 0.2)',
        boxShadow: 'none',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', height: 64 }}>
        <Button onClick={() => scrollToSection('ai-start')} sx={{ color: '#f8fafc !important', fontWeight: 'bold', textTransform: 'none', p: 0 }}>
          <Typography variant="h5" sx={{ fontFamily: 'Orbitron, monospace', letterSpacing: '2px' }}>AI Research</Typography>
        </Button>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
          {[
            ['upload', 'Upload'],
            ['library', 'Library'],
            ['search', 'Search'],
            ['chat', 'Chat'],
          ].map(([id, label]) => (
            <Button
              key={id}
              onClick={() => scrollToSection(id)}
              sx={{ color: '#94a3b8', textTransform: 'none', '&:hover': { color: '#f8fafc' } }}
            >
              {label}
            </Button>
          ))}
        </Box>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {user ? (
            <>
              <IconButton onClick={logout} title="Logout">
                <LoginIcon sx={{ color: '#ffb703' }} />
              </IconButton>
              <IconButton onClick={handleMenu}>
                <MenuIcon sx={{ color: '#8ecae6' }} />
              </IconButton>
            </>
          ) : (
            <>
              <Button onClick={() => setShowLogin(true)} sx={{ color: '#8ecae6', textTransform: 'none' }}>Login</Button>
              <Button onClick={() => setShowSignup(true)} variant="contained" sx={{ background: 'linear-gradient(135deg, #ffb703, #fb8500)', color: '#081018', textTransform: 'none' }}>Sign Up</Button>
            </>
          )}
        </div>

        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem onClick={() => { scrollToSection('ai-start'); handleClose() }}>AI Home</MenuItem>
          <MenuItem onClick={() => { scrollToSection('upload'); handleClose() }}>Upload</MenuItem>
          <MenuItem onClick={toggleLibrary}>Library ({papers.length})</MenuItem>
          <MenuItem onClick={() => { scrollToSection('search'); handleClose() }}>Search</MenuItem>
          <MenuItem onClick={() => { scrollToSection('chat'); handleClose() }}>AI Chat</MenuItem>
        </Menu>

        {libraryOpen && (
          <div style={{ position: 'fixed', top: 80, right: 20, background: 'rgba(8, 17, 29, 0.96)', border: '1px solid rgba(142, 202, 230, 0.25)', borderRadius: '16px', maxWidth: '400px', maxHeight: '400px', overflow: 'auto', zIndex: 1200, backdropFilter: 'blur(16px)' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid rgba(142, 202, 230, 0.2)' }}>
              <h3 style={{ margin: 0, color: '#f8fafc' }}>Library</h3>
            </div>
            <div style={{ padding: '20px' }}>
              {papers.length === 0 ? (
                <p style={{ color: '#94a3b8', margin: 0 }}>No papers uploaded</p>
              ) : (
                papers.map((paper) => (
                  <div
                    key={paper.id}
                    style={{ padding: '12px', borderBottom: '1px solid rgba(148, 163, 184, 0.12)', cursor: 'pointer' }}
                    onClick={() => {
                      scrollToSection('library')
                      setLibraryOpen(false)
                    }}
                  >
                    <div style={{ fontWeight: 'bold', color: '#f8fafc' }}>{paper.title || paper.filename}</div>
                    <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{new Date(paper.created_at).toLocaleDateString()}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </Toolbar>
    </AppBar>
  )
}
