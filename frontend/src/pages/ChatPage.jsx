import { useState, useEffect, useRef } from 'react'
import { listPapers, chatQuery } from '../utils/api'
import { speak, listen, isSpeechSupported } from '../utils/speech'
import Spinner from '../components/Spinner'
import React from 'react'
const ChatBox = React.lazy(() => import('../components/ChatBox'))

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'ja', label: 'Japanese' },
  { code: 'zh', label: 'Chinese' },
]

const VOICES = [
  { id: 'breeze', name: '🌬️ Breeze', desc: 'Calm, friendly female', option: 'female_adult' },
  { id: 'cinnamon', name: '🤎 Cinnamon', desc: 'Warm, mature female', option: 'female_adult' },
  { id: 'ember', name: '🔥 Ember', desc: 'Energetic, expressive female', option: 'female_adult' },
  { id: 'juniper', name: '🌿 Juniper', desc: 'Smooth, professional female', option: 'female_adult' },
  { id: 'sage', name: '✨ Sage', desc: 'Wise, gentle female', option: 'female_adult' },
  { id: 'orbit', name: '🌍 Orbit', desc: 'Deep, confident male', option: 'male_adult' },
  { id: 'alloy', name: '🤖 Alloy', desc: 'Clear, neutral male', option: 'male_adult' },
  { id: 'echo', name: '📢 Echo', desc: 'Bright, young-sounding male', option: 'male_adult' },
  { id: 'fable', name: '📖 Fable', desc: 'Storyteller male voice', option: 'male_adult' },
  { id: 'onyx', name: '⚫ Onyx', desc: 'Deep, resonant male', option: 'male_adult' },
  { id: 'nova', name: '⭐ Nova', desc: 'Youthful, energetic', option: 'child' },
  { id: 'elder', name: '🧙 Elder', desc: 'Aged, wise voice', option: 'elder' },
]

export default function ChatPage({ addToast }) {
  const [papers, setPapers] = useState([])
  const [selectedPaper, setSelectedPaper] = useState(null)
  const [messages, setMessages] = useState([])  // { role:'user'|'assistant', text }
  const [input, setInput] = useState('')
  const [lang, setLang] = useState('en')
  const [selectedVoice, setSelectedVoice] = useState('breeze')
  const [sending, setSending] = useState(false)
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [testing, setTesting] = useState(false)
  const scrollRef = useRef()
  const speech = isSpeechSupported()

  useEffect(() => {
    listPapers().then(setPapers).catch(() => {})
  }, [])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  // Reset chat when paper changes
  useEffect(() => { setMessages([]) }, [selectedPaper])

  const sendMessage = async (text) => {
    if (!text.trim() || !selectedPaper || sending) return
    const userMsg = { role: 'user', text: text.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setSending(true)
    try {
      const data = await chatQuery(selectedPaper.id, text.trim(), lang)
      const assistantMsg = { role: 'assistant', text: data.answer || data.response || 'No answer returned.' }
      setMessages(prev => [...prev, assistantMsg])
      // Auto-speak if TTS is supported
      if (speech.tts) {
        setSpeaking(true)
        try {
          const langMap = { en:'en-US', hi:'hi-IN', es:'es-ES', fr:'fr-FR', de:'de-DE', ja:'ja-JP', zh:'zh-CN' }
          const voiceObj = VOICES.find(v => v.id === selectedVoice)
          const voiceOption = voiceObj ? voiceObj.option : 'female_adult'
          await speak(assistantMsg.text, langMap[lang] || 'en-US', voiceOption)
        } catch {}
        setSpeaking(false)
      }
    } catch {
      addToast({ type: 'error', message: 'Chat request failed.' })
    }
    setSending(false)
  }

  const startListening = async () => {
    if (!speech.stt) { addToast({ type: 'error', message: 'Speech recognition not supported.' }); return }
    setListening(true)
    try {
      const langMap = { en:'en-US', hi:'hi-IN', es:'es-ES', fr:'fr-FR', de:'de-DE', ja:'ja-JP', zh:'zh-CN' }
      const transcript = await listen(langMap[lang] || 'en-US')
      setInput(transcript)
    } catch (e) {
      addToast({ type: 'error', message: 'Listening failed: ' + e.message })
    }
    setListening(false)
  }

  const testVoice = async () => {
    const voiceObj = VOICES.find(v => v.id === selectedVoice)
    if (!voiceObj) return
    setTesting(true)
    try {
      const langMap = { en:'en-US', hi:'hi-IN', es:'es-ES', fr:'fr-FR', de:'de-DE', ja:'ja-JP', zh:'zh-CN' }
      await speak(`Testing ${voiceObj.name}. This is how I sound.`, langMap[lang] || 'en-US', voiceObj.option)
    } catch (e) {
      addToast({ type: 'error', message: 'Voice test failed.' })
    }
    setTesting(false)
  }

  return (
    <div className="min-h-screen flex flex-col px-4" style={{ paddingTop: '80px', background: '#0a0a0f' }}>
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.6rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#c9a84c', marginBottom: '10px' }}>— Chat</p>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '2rem', color: '#e8e4dc', fontWeight: 400 }}>Talk to your <em style={{ color: '#c9a84c' }}>paper</em></h1>
        </div>

        {/* Paper Selector + Language + Voice */}
        <div className="flex flex-wrap gap-3 mb-5 items-center">
          <select value={selectedPaper?.id || ''} onChange={e => setSelectedPaper(papers.find(p => String(p.id) === e.target.value) || null)}
            className="flex-1 outline-none"
            style={{
              background: '#0e0e16', border: '1px solid rgba(201,168,76,0.22)', borderRadius: '6px',
              padding: '10px 14px', color: '#e8e4dc', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.68rem',
              minWidth: '180px'
            }}>
            <option value="" style={{ background: '#0e0e16' }}>Select a paper…</option>
            {papers.map(p => <option key={p.id} value={p.id} style={{ background: '#0e0e16' }}>{p.title || p.filename}</option>)}
          </select>
          <select value={lang} onChange={e => setLang(e.target.value)}
            className="outline-none"
            style={{
              background: '#0e0e16', border: '1px solid rgba(201,168,76,0.22)', borderRadius: '6px',
              padding: '10px 14px', color: '#7a756b', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.64rem',
              minWidth: '100px'
            }}>
            {LANGUAGES.map(l => <option key={l.code} value={l.code} style={{ background: '#0e0e16' }}>{l.label}</option>)}
          </select>
          <select value={selectedVoice} onChange={e => setSelectedVoice(e.target.value)}
            className="outline-none"
            style={{
              background: '#0e0e16', border: '1px solid rgba(201,168,76,0.22)', borderRadius: '6px',
              padding: '10px 14px', color: '#c9a84c', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.68rem',
              minWidth: '140px', fontWeight: 'bold'
            }}>
            {VOICES.map(v => <option key={v.id} value={v.id} style={{ background: '#0e0e16' }}>{v.name}</option>)}
          </select>
          <button onClick={testVoice} disabled={testing || !speech.tts}
            className="transition-all duration-200"
            style={{
              background: testing ? 'rgba(201,168,76,0.3)' : 'rgba(201,168,76,0.15)',
              border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: '6px', padding: '10px 12px', cursor: 'pointer', color: '#c9a84c',
              fontSize: '0.65rem', fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.5px'
            }}>
            {testing ? '🔊' : '🎧'} Test
          </button>
        </div>

        {/* Chat Box (extracted) */}
        <div style={{ width: '100%' }}>
          {/* Lazy-load ChatBox to keep concern separated */}
          {selectedPaper ? (
            <React.Suspense fallback={<div style={{ padding: 20 }}>Loading chat…</div>}>
              <ChatBox selectedPaper={selectedPaper} addToast={addToast} />
            </React.Suspense>
          ) : (
            <div style={{ padding: 20, color: '#7a756b' }}>Select a paper to enable chat.</div>
          )}
        </div>
      </div>
    </div>
  )
}
