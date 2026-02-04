/**
 * Text-to-Speech: speaks the given text aloud.
 * @param {string} text
 * @param {string} [lang='en-US']
 * @returns {Promise<void>}
 */
export function speak(text, lang = 'en-US', voiceOption = 'female_adult') {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      reject(new Error('Speech synthesis not supported in this browser.'))
      return
    }

    // Utility to pick a voice based on language prefix and a voice option
    function pickVoice(voices, langPrefix, option) {
      const lower = (s) => (s || '').toLowerCase()
      const matchesLang = (v) => lower(v.lang).startsWith(lower(langPrefix.split('-')[0])) || lower(v.lang).startsWith(lower(langPrefix))

      // heuristics for option matching in voice.name or voice.lang
      const optionKeywords = {
        female_adult: ['female', 'woman', 'frau', 'femme', 'girl', 'amelia', 'samantha', 'victoria', 'karen', 'moira', 'victoria', 'aria', 'zira', 'susan'],
        male_adult: ['male', 'man', 'mario', 'robert', 'david', 'george', 'mark', 'paul', 'simon'],
        child: ['child', 'kid', 'boy', 'girl', 'young'],
        elder: ['old', 'elder', 'senior', 'grand']
      }

      const candidates = voices.filter(v => matchesLang(v))
      const kw = optionKeywords[option] || []
      
      // For female voices: try exact matches first
      if (option === 'female_adult') {
        // First pass: explicit female keywords
        for (const v of candidates) {
          const name = lower(v.name)
          for (const k of kw) if (name.includes(k)) return v
        }
        // Second pass: use voice.name heuristics (common female voice names)
        const femaleNames = ['victoria', 'samantha', 'karen', 'moira', 'aria', 'zira', 'susan', 'alice', 'fiona', 'bella', 'rachel', 'anna', 'amy', 'hannah']
        for (const v of candidates) {
          const name = lower(v.name)
          if (femaleNames.some(fn => name.includes(fn))) return v
        }
        // Third pass: filter out clearly male voices, take first female-sounding
        const notMale = candidates.filter(v => !lower(v.name).includes('male') && !lower(v.name).includes('man'))
        if (notMale.length > 0) return notMale[0]
      }
      
      // For male voices
      if (option === 'male_adult') {
        for (const v of candidates) {
          const name = lower(v.name)
          for (const k of kw) if (name.includes(k)) return v
        }
      }

      // last resort: return first candidate or first available voice
      return candidates[0] || voices[0] || null
    }

    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = lang

    // configure voices (async availability)
    const voices = window.speechSynthesis.getVoices()
    let chosen = pickVoice(voices, lang, voiceOption)

    if (!chosen) {
      // getVoices may be empty initially; attempt to wait briefly
      window.speechSynthesis.onvoiceschanged = () => {
        const v2 = window.speechSynthesis.getVoices()
        chosen = pickVoice(v2, lang, voiceOption)
        if (chosen) utter.voice = chosen
        window.speechSynthesis.speak(utter)
      }
    } else {
      utter.voice = chosen
    }

    // Adjust pitch/rate based on age/gender option
    switch (voiceOption) {
      case 'child':
        utter.pitch = 1.6
        utter.rate = 1.05
        break
      case 'elder':
        utter.pitch = 0.8
        utter.rate = 0.9
        break
      case 'male_adult':
        utter.pitch = 0.9
        utter.rate = 0.95
        break
      default: // female_adult
        utter.pitch = 1.3
        utter.rate = 0.95
    }

    utter.onend = () => resolve()
    utter.onerror = (e) => reject(e)

    // Speak now (if voice chosen synchronously)
    if (utter.voice) window.speechSynthesis.speak(utter)
  })
}

/**
 * Speech-to-Text: listens and returns recognised text.
 * @param {string} [lang='en-US']
 * @returns {Promise<string>}
 */
export function listen(lang = 'en-US') {
  return new Promise((resolve, reject) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      reject(new Error('Speech recognition not supported in this browser.'))
      return
    }
    const rec = new SpeechRecognition()
    rec.lang = lang
    rec.interimResults = false
    rec.maxAlternatives = 1
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript
      resolve(transcript)
    }
    rec.onerror = (e) => reject(new Error(e.error))
    rec.start()
  })
}

/**
 * Returns true if browser supports TTS + STT
 */
export function isSpeechSupported() {
  const hasTTS = !!window.speechSynthesis
  const hasSTT = !!(window.SpeechRecognition || window.webkitSpeechRecognition)
  return { tts: hasTTS, stt: hasSTT }
}
