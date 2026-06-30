import { useState, useEffect, useRef, useCallback } from 'react'

export type ReadAloudStatus = 'idle' | 'playing' | 'paused'

interface UseReadAloudReturn {
  status: ReadAloudStatus
  play: (text: string) => void
  pause: () => void
  resume: () => void
  stop: () => void
  supported: boolean
}

/**
 * useReadAloud — wraps the Web Speech API's SpeechSynthesis for
 * play / pause / resume / stop control of text-to-speech.
 */
export function useReadAloud(): UseReadAloudReturn {
  const [status, setStatus] = useState<ReadAloudStatus>('idle')
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

  // Stop and clean up when the component unmounts
  useEffect(() => {
    return () => {
      if (supported) window.speechSynthesis.cancel()
    }
  }, [supported])

  const play = useCallback((text: string) => {
    if (!supported) return
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.92
    utterance.pitch = 1.0
    utterance.volume = 1.0

    utterance.onstart = () => setStatus('playing')
    utterance.onpause = () => setStatus('paused')
    utterance.onresume = () => setStatus('playing')
    utterance.onend = () => setStatus('idle')
    utterance.onerror = () => setStatus('idle')

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
    setStatus('playing')
  }, [supported])

  const pause = useCallback(() => {
    if (!supported) return
    window.speechSynthesis.pause()
    setStatus('paused')
  }, [supported])

  const resume = useCallback(() => {
    if (!supported) return
    window.speechSynthesis.resume()
    setStatus('playing')
  }, [supported])

  const stop = useCallback(() => {
    if (!supported) return
    window.speechSynthesis.cancel()
    utteranceRef.current = null
    setStatus('idle')
  }, [supported])

  return { status, play, pause, resume, stop, supported }
}
