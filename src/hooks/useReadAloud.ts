import { useState, useEffect, useRef, useCallback } from 'react'

export type ReadAloudStatus = 'idle' | 'playing' | 'paused'

// Estimated chars/second at speechSynthesis rate=1.0 (~130 wpm × 5 chars/word ÷ 60)
const CHARS_PER_SEC_BASE = 10.8
const SKIP_SECONDS = 5

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Split narration into sentences for sentence-level seeking. */
function splitSentences(text: string): string[] {
  return text
    .replace(/\n+/g, ' ')
    .split(/([^.!?]+[.!?]+)/)
    .map(s => s.trim())
    .filter(s => s.length > 2)
}

/** Find the sentence index whose range contains the given char offset. */
function sentenceIdxAt(sentences: string[], charOffset: number): number {
  let cumulative = 0
  for (let i = 0; i < sentences.length; i++) {
    const end = cumulative + sentences[i].length
    if (charOffset <= end) return i
    cumulative = end + 1
  }
  return Math.max(0, sentences.length - 1)
}

/** Char offset at the start of the sentence at the given index. */
function charOffsetOfSentence(sentences: string[], idx: number): number {
  return sentences.slice(0, idx).reduce((acc, s) => acc + s.length + 1, 0)
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseReadAloudReturn {
  status: ReadAloudStatus
  voices: SpeechSynthesisVoice[]
  selectedVoice: SpeechSynthesisVoice | null
  rate: number
  setVoice: (v: SpeechSynthesisVoice) => void
  setRate: (r: number) => void
  play: (text: string) => void
  pause: () => void
  resume: () => void
  stop: () => void
  skipForward: () => void
  skipBackward: () => void
  supported: boolean
}

/**
 * useReadAloud — full-featured TTS hook.
 * Supports voice selection, rate control, and sentence-level ±5s seeking.
 * All mutable playback state lives in refs to avoid stale-closure bugs.
 */
export function useReadAloud(): UseReadAloudReturn {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

  // ── UI state (triggers re-renders) ──────────────────────────────────────────
  const [status, setStatus] = useState<ReadAloudStatus>('idle')
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoiceState] = useState<SpeechSynthesisVoice | null>(null)
  const [rate, setRateState] = useState(1.0)

  // ── Refs (read by callbacks without re-render) ───────────────────────────────
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)
  const rateRef = useRef(1.0)
  const textRef = useRef('')
  const charIdxRef = useRef(0) // absolute char position in textRef.current
  const statusRef = useRef<ReadAloudStatus>('idle')

  const syncStatus = (s: ReadAloudStatus) => {
    statusRef.current = s
    setStatus(s)
  }

  // ── Load voices ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!supported) return

    const load = () => {
      const available = window.speechSynthesis.getVoices()
      if (!available.length) return

      // Sort: English first, prefer Google / Premium voices
      const sorted = [...available].sort((a, b) => {
        const aEn = a.lang.startsWith('en') ? 0 : 1
        const bEn = b.lang.startsWith('en') ? 0 : 1
        if (aEn !== bEn) return aEn - bEn
        const aPrem = /google|premium|enhanced|natural/i.test(a.name) ? 0 : 1
        const bPrem = /google|premium|enhanced|natural/i.test(b.name) ? 0 : 1
        return aPrem - bPrem
      })

      setVoices(sorted)

      if (!voiceRef.current) {
        const pick =
          sorted.find(v => v.lang === 'en-US' && /google/i.test(v.name)) ||
          sorted.find(v => v.lang === 'en-US') ||
          sorted.find(v => v.lang.startsWith('en')) ||
          sorted[0]
        if (pick) {
          voiceRef.current = pick
          setSelectedVoiceState(pick)
        }
      }
    }

    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load)
  }, [supported])

  // ── Cleanup on unmount ───────────────────────────────────────────────────────
  useEffect(() => {
    return () => { if (supported) window.speechSynthesis.cancel() }
  }, [supported])

  // ── Core: start speech from an absolute char position ───────────────────────
  const speakFrom = useCallback((charOffset: number) => {
    if (!supported || !textRef.current) return
    window.speechSynthesis.cancel()

    const sentences = splitSentences(textRef.current)
    const startIdx = sentenceIdxAt(sentences, charOffset)
    const absoluteStart = charOffsetOfSentence(sentences, startIdx)
    const remaining = sentences.slice(startIdx).join(' ')

    if (!remaining.trim()) { syncStatus('idle'); charIdxRef.current = 0; return }

    const utt = new SpeechSynthesisUtterance(remaining)
    utt.rate = rateRef.current
    utt.pitch = 1.0
    utt.volume = 1.0
    if (voiceRef.current) utt.voice = voiceRef.current

    utt.onstart = () => syncStatus('playing')
    utt.onpause = () => syncStatus('paused')
    utt.onresume = () => syncStatus('playing')
    utt.onend = () => { syncStatus('idle'); charIdxRef.current = 0 }
    utt.onerror = () => { syncStatus('idle'); charIdxRef.current = 0 }
    utt.onboundary = (e) => {
      // Track absolute position in the full text
      charIdxRef.current = absoluteStart + e.charIndex
    }

    charIdxRef.current = absoluteStart
    window.speechSynthesis.speak(utt)
    syncStatus('playing')
  }, [supported])

  // ── Public API ───────────────────────────────────────────────────────────────

  const play = useCallback((text: string) => {
    textRef.current = text
    charIdxRef.current = 0
    speakFrom(0)
  }, [speakFrom])

  const pause = useCallback(() => {
    if (!supported) return
    window.speechSynthesis.pause()
    syncStatus('paused')
  }, [supported])

  const resume = useCallback(() => {
    if (!supported) return
    window.speechSynthesis.resume()
    syncStatus('playing')
  }, [supported])

  const stop = useCallback(() => {
    if (!supported) return
    window.speechSynthesis.cancel()
    charIdxRef.current = 0
    textRef.current = ''
    syncStatus('idle')
  }, [supported])

  const skipForward = useCallback(() => {
    const skip = Math.floor(SKIP_SECONDS * CHARS_PER_SEC_BASE * rateRef.current)
    speakFrom(charIdxRef.current + skip)
  }, [speakFrom])

  const skipBackward = useCallback(() => {
    const skip = Math.floor(SKIP_SECONDS * CHARS_PER_SEC_BASE * rateRef.current)
    speakFrom(Math.max(0, charIdxRef.current - skip))
  }, [speakFrom])

  const setVoice = useCallback((v: SpeechSynthesisVoice) => {
    voiceRef.current = v
    setSelectedVoiceState(v)
    if (statusRef.current !== 'idle') speakFrom(charIdxRef.current)
  }, [speakFrom])

  const setRate = useCallback((r: number) => {
    rateRef.current = r
    setRateState(r)
    if (statusRef.current !== 'idle') speakFrom(charIdxRef.current)
  }, [speakFrom])

  return {
    status, voices, selectedVoice, rate,
    setVoice, setRate,
    play, pause, resume, stop, skipForward, skipBackward,
    supported,
  }
}
