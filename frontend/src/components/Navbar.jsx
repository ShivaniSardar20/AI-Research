import { useState } from 'react'

export default function Navbar({ activePage, setActivePage }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const links = [
    { label: 'Library', key: 'library' },
    { label: 'Upload', key: 'upload' },
    { label: 'Search', key: 'search' },
    { label: 'Chat', key: 'chat' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(201,168,76,0.18)' }}>
      <div className="max-w-6xl mx-auto px-5 flex items-center justify-between" style={{ height: '64px' }}>
        {/* Logo */}
        <button onClick={() => setActivePage('library')} className="flex flex-col cursor-pointer" style={{ background: 'none', border: 'none', padding: 0 }}>
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.25rem', color: '#c9a84c', letterSpacing: '2px', textTransform: 'uppercase', lineHeight: 1.2 }}>AI Research</span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.58rem', color: '#7a756b', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Research Intelligence</span>
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <button
              key={l.key}
              onClick={() => setActivePage(l.key)}
              className="transition-colors duration-200"
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0',
                fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.62rem',
                letterSpacing: '2px', textTransform: 'uppercase',
                color: activePage === l.key ? '#c9a84c' : '#7a756b',
                borderBottom: activePage === l.key ? '1px solid #c9a84c' : '1px solid transparent',
              }}
            >{l.label}</button>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex flex-col gap-1.5 cursor-pointer" style={{ background: 'none', border: 'none', padding: '4px' }}>
          {[0,1,2].map(i => (
            <span key={i} className="block transition-all duration-300" style={{
              width: '22px', height: '1.5px', background: '#c9a84c',
              transform: menuOpen ? (i === 1 ? 'scaleX(0)' : (i === 0 ? 'translateY(5px) rotate(45deg)' : 'translateY(-5px) rotate(-45deg)')) : 'none'
            }} />
          ))}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t flex flex-col" style={{ borderColor: 'rgba(201,168,76,0.18)', background: 'rgba(10,10,15,0.95)' }}>
          {links.map(l => (
            <button key={l.key} onClick={() => { setActivePage(l.key); setMenuOpen(false) }}
              className="text-left px-5 py-3 transition-colors"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.68rem',
                letterSpacing: '2px', textTransform: 'uppercase',
                color: activePage === l.key ? '#c9a84c' : '#7a756b'
              }}
            >{l.label}</button>
          ))}
        </div>
      )}
    </nav>
  )
}
