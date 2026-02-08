import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MenuIcon from '@mui/icons-material/Menu'

export default function Navbar({ activePage, setActivePage, logout }) {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const links = [
    { label: 'Library', key: 'library' },
    { label: 'Upload', key: 'upload' },
    { label: 'Search', key: 'search' },
    { label: 'Chat', key: 'chat' },
  ]

  const handleMenu = (e) => setAnchorEl(e.currentTarget)
  const handleClose = () => setAnchorEl(null)

  return (
    <AppBar position="fixed" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(201,168,76,0.12)' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', height: 64 }}>
        <Button onClick={() => setActivePage('library')} sx={{ textTransform: 'uppercase' }}>
          <div style={{ textAlign: 'left' }}>
            <Typography variant="h6" sx={{ color: 'primary.main', lineHeight: 1 }}>{'AI Research'}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', letterSpacing: 1.5 }}>{'Research Intelligence'}</Typography>
          </div>
        </Button>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div className="desktop-links" style={{ display: 'none' }}>
            {links.map(l => (
              <Button key={l.key} onClick={() => setActivePage(l.key)} sx={{ color: activePage === l.key ? 'primary.main' : 'text.secondary', textTransform: 'uppercase', fontSize: 12 }}>
                {l.label}
              </Button>
            ))}
          </div>

          <IconButton edge="end" color="inherit" onClick={handleMenu} aria-controls="nav-menu" aria-haspopup="true">
            <MenuIcon sx={{ color: 'primary.main' }} />
          </IconButton>
          <Menu id="nav-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            {links.map(l => (
              <MenuItem key={l.key} onClick={() => { setActivePage(l.key); handleClose() }}>{l.label}</MenuItem>
            ))}
            <MenuItem onClick={() => { logout(); handleClose() }}>Logout</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  )
}
