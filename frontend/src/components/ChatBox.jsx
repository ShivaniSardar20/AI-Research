import React, { useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import SendIcon from '@mui/icons-material/Send'
import MicIcon from '@mui/icons-material/Mic'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import CircularProgress from '@mui/material/CircularProgress'
import { chatQuery } from '../utils/api'
import { speak, listen, isSpeechSupported } from '../utils/speech'

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
]

export default function ChatBox({ selectedPaper, addToast }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [lang, setLang] = useState('en')
  const [sending, setSending] = useState(false)
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const scrollRef = useRef(null)
  const speech = isSpeechSupported()

  useEffect(() => { setMessages([]) }, [selectedPaper])
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight }, [messages])

  const sendMessage = async (text) => {
    if (!text.trim() || !selectedPaper || sending) return
    const userMsg = { role: 'user', text: text.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setSending(true)
    try {
      const data = await chatQuery(selectedPaper.id, text.trim(), lang)
      const assistantMsg = { role: 'assistant', text: data.answer || data.response || 'No answer.' }
      setMessages(prev => [...prev, assistantMsg])
      if (speech.tts) {
        setSpeaking(true)
        try { await speak(assistantMsg.text, 'en-US', 'female_adult') } catch {} 
        setSpeaking(false)
      }
    } catch (e) {
      addToast({ type: 'error', message: 'Chat request failed.' })
    }
    setSending(false)
  }

  const startListening = async () => {
    if (!speech.stt) { addToast({ type: 'error', message: 'Speech recognition not supported.' }); return }
    setListening(true)
    try {
      const transcript = await listen('en-US')
      setInput(transcript)
    } catch (e) { addToast({ type: 'error', message: 'Listening failed.' }) }
    setListening(false)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper ref={scrollRef} elevation={0} sx={{ p: 2, bgcolor: 'background.paper', minHeight: 300, maxHeight: '52vh', overflow: 'auto', border: '1px solid rgba(201,168,76,0.12)' }}>
        {messages.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>Select a paper to start the conversation.</Box>
        ) : (
          <List>
            {messages.map((m, i) => (
              <ListItem key={i} sx={{ justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <ListItemText primary={m.text} primaryTypographyProps={{ sx: { whiteSpace: 'pre-wrap' } }} sx={{ bgcolor: m.role === 'user' ? 'rgba(201,168,76,0.12)' : 'rgba(18,18,26,0.7)', p: 1.5, borderRadius: 1, maxWidth: '85%' }} />
              </ListItem>
            ))}
            {sending && (
              <ListItem>
                <CircularProgress size={18} />
              </ListItem>
            )}
          </List>
        )}
      </Paper>

      <Box sx={{ display: 'flex', gap: 1, mt: 2, alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel>Lang</InputLabel>
          <Select value={lang} label="Lang" onChange={e => setLang(e.target.value)}>
            {LANGUAGES.map(l => <MenuItem key={l.code} value={l.code}>{l.label}</MenuItem>)}
          </Select>
        </FormControl>

        <TextField fullWidth size="small" placeholder="Ask a question…" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage(input)} disabled={!selectedPaper || sending} />

        {speech.stt && (
          <IconButton color={listening ? 'error' : 'primary'} onClick={startListening} disabled={!selectedPaper || sending}>
            <MicIcon />
          </IconButton>
        )}

        <IconButton color="primary" onClick={() => sendMessage(input)} disabled={!input.trim() || !selectedPaper || sending}>
          <SendIcon />
        </IconButton>
      </Box>

      <Box sx={{ mt: 1 }}>
        {speaking && <Box sx={{ color: 'info.main' }}><VolumeUpIcon /> Speaking…</Box>}
      </Box>
    </Box>
  )
}
