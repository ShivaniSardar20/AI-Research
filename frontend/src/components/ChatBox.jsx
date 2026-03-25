import React, { useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import SendIcon from '@mui/icons-material/Send'
import MicIcon from '@mui/icons-material/Mic'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import CircularProgress from '@mui/material/CircularProgress'
import { chatQuery } from '../utils/api'
import { speak, listen, isSpeechSupported } from '../utils/speech'

const voiceOptions = {
  breeze: 'female_adult',
  juniper: 'female_adult',
  orbit: 'male_adult',
  alloy: 'male_adult',
  nova: 'child',
  elder: 'elder',
}

export default function ChatBox({ selectedPaper, addToast, lang, selectedVoice, voiceMap }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const scrollRef = useRef(null)
  const speech = isSpeechSupported()

  useEffect(() => {
    setMessages([])
  }, [selectedPaper])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async (text) => {
    if (!text.trim() || !selectedPaper || sending) return
    const userMsg = { role: 'user', text: text.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setSending(true)
    try {
      const data = await chatQuery(selectedPaper.id, text.trim(), lang)
      const assistantMsg = { role: 'assistant', text: data.answer || data.response || 'No answer.' }
      setMessages((prev) => [...prev, assistantMsg])
      if (speech.tts) {
        setSpeaking(true)
        try {
          await speak(assistantMsg.text, voiceMap[lang] || 'en-US', voiceOptions[selectedVoice] || 'female_adult')
        } catch {}
        setSpeaking(false)
      }
    } catch {
      addToast({ type: 'error', message: 'Chat request failed.' })
    }
    setSending(false)
  }

  const startListening = async () => {
    if (!speech.stt) {
      addToast({ type: 'error', message: 'Speech recognition not supported.' })
      return
    }
    setListening(true)
    try {
      const transcript = await listen(voiceMap[lang] || 'en-US')
      setInput(transcript)
    } catch {
      addToast({ type: 'error', message: 'Listening failed.' })
    }
    setListening(false)
  }

  return (
    <div className="glass-panel feature-panel">
      <div className="panel-row">
        <p className="feature-panel-title">Conversation</p>
        <button type="button" className="ghost-chip" onClick={() => setMessages([])} disabled={messages.length === 0}>
          Clear chat
        </button>
      </div>

      <Box
        ref={scrollRef}
        component={Paper}
        elevation={0}
        sx={{
          p: 2,
          bgcolor: 'transparent',
          minHeight: 320,
          maxHeight: '52vh',
          overflow: 'auto',
          border: '1px solid rgba(148, 163, 184, 0.12)',
          borderRadius: '20px',
          mb: 2,
        }}
      >
        {messages.length === 0 ? (
          <Box className="empty-state compact">
            <h3>{selectedPaper ? 'Start the conversation' : 'Select a paper first'}</h3>
            <p>{selectedPaper ? 'Ask about methods, findings, limitations, or definitions.' : 'The chat endpoint requires one selected paper.'}</p>
          </Box>
        ) : (
          <div className="chat-thread">
            {messages.map((message, index) => (
              <div key={index} className={`chat-bubble ${message.role}`}>
                {message.text}
              </div>
            ))}
            {sending && (
              <div className="chat-spinner">
                <CircularProgress size={18} />
              </div>
            )}
          </div>
        )}
      </Box>

      <div className="search-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
          placeholder="Ask a focused question about the selected paper"
          disabled={!selectedPaper || sending}
        />
        {speech.stt && (
          <IconButton color={listening ? 'error' : 'primary'} onClick={startListening} disabled={!selectedPaper || sending}>
            <MicIcon />
          </IconButton>
        )}
        <IconButton color="primary" onClick={() => sendMessage(input)} disabled={!input.trim() || !selectedPaper || sending}>
          <SendIcon />
        </IconButton>
      </div>

      {speaking && (
        <Box sx={{ mt: 1, color: 'info.main', display: 'flex', alignItems: 'center', gap: 1 }}>
          <VolumeUpIcon fontSize="small" /> Speaking...
        </Box>
      )}
    </div>
  )
}
