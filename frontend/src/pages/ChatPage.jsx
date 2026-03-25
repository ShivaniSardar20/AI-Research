import { useState, useEffect } from 'react'
import { listPapers } from '../utils/api'
import { speak, isSpeechSupported } from '../utils/speech'
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
  { id: 'breeze', name: 'Breeze', option: 'female_adult' },
  { id: 'juniper', name: 'Juniper', option: 'female_adult' },
  { id: 'orbit', name: 'Orbit', option: 'male_adult' },
  { id: 'alloy', name: 'Alloy', option: 'male_adult' },
  { id: 'nova', name: 'Nova', option: 'child' },
  { id: 'elder', name: 'Elder', option: 'elder' },
]

const languageVoices = {
  en: 'en-US',
  hi: 'hi-IN',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  ja: 'ja-JP',
  zh: 'zh-CN',
}

export default function ChatPage({ addToast }) {
  const [papers, setPapers] = useState([])
  const [selectedPaper, setSelectedPaper] = useState(null)
  const [lang, setLang] = useState('en')
  const [selectedVoice, setSelectedVoice] = useState('breeze')
  const [testing, setTesting] = useState(false)
  const speech = isSpeechSupported()

  useEffect(() => {
    listPapers().then(setPapers).catch(() => setPapers([]))
  }, [])

  const testVoice = async () => {
    const voiceObj = VOICES.find((voice) => voice.id === selectedVoice)
    if (!voiceObj || !speech.tts) return
    setTesting(true)
    try {
      await speak('Voice test for your research assistant.', languageVoices[lang] || 'en-US', voiceObj.option)
    } catch {
      addToast({ type: 'error', message: 'Voice test failed.' })
    }
    setTesting(false)
  }

  return (
    <div className="feature-shell">
      <div className="feature-header">
        <div>
          <p className="feature-eyebrow">Chat</p>
          <h2 className="feature-title">Ask targeted questions against a selected paper</h2>
          <p className="feature-copy">
            Language and voice controls now feed the same chat component so spoken responses and recognition stay aligned.
          </p>
        </div>
      </div>

      <div className="feature-grid-2">
        <div className="glass-panel feature-panel">
          <p className="feature-panel-title">Session Setup</p>
          <div className="control-grid">
            <label className="auth-field">
              <span>Paper</span>
              <select value={selectedPaper?.id || ''} onChange={(e) => setSelectedPaper(papers.find((paper) => String(paper.id) === e.target.value) || null)}>
                <option value="">Select a paper</option>
                {papers.map((paper) => (
                  <option key={paper.id} value={paper.id}>{paper.title || paper.filename}</option>
                ))}
              </select>
            </label>
            <label className="auth-field">
              <span>Language</span>
              <select value={lang} onChange={(e) => setLang(e.target.value)}>
                {LANGUAGES.map((language) => (
                  <option key={language.code} value={language.code}>{language.label}</option>
                ))}
              </select>
            </label>
            <label className="auth-field">
              <span>Voice</span>
              <select value={selectedVoice} onChange={(e) => setSelectedVoice(e.target.value)}>
                {VOICES.map((voice) => (
                  <option key={voice.id} value={voice.id}>{voice.name}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="prompt-row">
            <button type="button" className="ghost-chip" onClick={testVoice} disabled={!speech.tts || testing}>
              {testing ? 'Testing voice...' : 'Test voice'}
            </button>
            <span className="support-note">{speech.tts ? 'Speech output supported' : 'Speech output not supported in this browser'}</span>
          </div>
        </div>

        <div className="glass-panel feature-panel">
          <p className="feature-panel-title">Selected Paper</p>
          {selectedPaper ? (
            <div className="content-block">
              <span>{selectedPaper.title || selectedPaper.filename}</span>
              <p>{selectedPaper.filename}</p>
            </div>
          ) : (
            <div className="empty-state compact">
              <h3>No paper selected</h3>
              <p>Choose one paper to start a context-aware conversation.</p>
            </div>
          )}
        </div>
      </div>

      <React.Suspense fallback={<div className="glass-panel feature-panel">Loading chat...</div>}>
        <ChatBox
          selectedPaper={selectedPaper}
          addToast={addToast}
          lang={lang}
          selectedVoice={selectedVoice}
          voiceMap={languageVoices}
        />
      </React.Suspense>
    </div>
  )
}
