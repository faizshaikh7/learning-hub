import { useRef, useEffect, useState } from 'react'
import {
  Volume2,
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useReadAloud } from '@/hooks/useReadAloud'
import type { CurriculumTopic } from '@/types'

// ─── Text compiler ─────────────────────────────────────────────────────────────

/**
 * Compiles all readable fields from a CurriculumTopic into a narration
 * script. Code blocks are intentionally excluded — they sound terrible aloud.
 */
export function buildTopicNarration(topic: CurriculumTopic): string {
  const parts: string[] = []
  parts.push(`${topic.title}.`)
  parts.push(`Explain Like I'm 5. ${topic.eli5}`)
  parts.push(`Analogy. ${topic.analogy}`)
  parts.push(`Explanation. ${topic.explanation}`)
  parts.push(`Technical Deep Dive. ${topic.technicalDeep}`)
  parts.push(`What Can Break. ${topic.whatBreaks}`)
  if (topic.commonMistakes.length)
    parts.push(`Common Mistakes. ${topic.commonMistakes.join('. ')}`)
  if (topic.seniorNotes)
    parts.push(`Senior Notes. ${topic.seniorNotes}`)
  if (topic.interviewQuestions.length)
    parts.push(
      `Interview Questions. ${topic.interviewQuestions.map((q, i) => `Question ${i + 1}: ${q}`).join('. ')}`,
    )
  if (topic.interviewAnswers?.length)
    parts.push(`Interview Answers. ${topic.interviewAnswers.join('. ')}`)
  return parts.join(' ')
}

// ─── Speed presets ─────────────────────────────────────────────────────────────

const SPEED_PRESETS = [
  { label: '0.5×', value: 0.5 },
  { label: '0.75×', value: 0.75 },
  { label: '1×', value: 1.0 },
  { label: '1.25×', value: 1.25 },
  { label: '1.5×', value: 1.5 },
  { label: '2×', value: 2.0 },
]

// ─── Accent map ────────────────────────────────────────────────────────────────

const ACCENT = {
  blue: {
    ring: 'ring-blue-500/40',
    activeBg: 'bg-blue-500/10 border-blue-500/25',
    text: 'text-blue-400',
    playBtn: 'bg-blue-500 hover:bg-blue-600',
    speedActive: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
    dot: 'bg-blue-400',
  },
  purple: {
    ring: 'ring-purple-500/40',
    activeBg: 'bg-purple-500/10 border-purple-500/25',
    text: 'text-purple-400',
    playBtn: 'bg-purple-500 hover:bg-purple-600',
    speedActive: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
    dot: 'bg-purple-400',
  },
  cyan: {
    ring: 'ring-cyan-500/40',
    activeBg: 'bg-cyan-500/10 border-cyan-500/25',
    text: 'text-cyan-400',
    playBtn: 'bg-cyan-500 hover:bg-cyan-600',
    speedActive: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
    dot: 'bg-cyan-400',
  },
  orange: {
    ring: 'ring-orange-500/40',
    activeBg: 'bg-orange-500/10 border-orange-500/25',
    text: 'text-orange-400',
    playBtn: 'bg-orange-500 hover:bg-orange-600',
    speedActive: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
    dot: 'bg-orange-400',
  },
}

// ─── Voice selector ────────────────────────────────────────────────────────────

interface VoiceSelectorProps {
  voices: SpeechSynthesisVoice[]
  selected: SpeechSynthesisVoice | null
  onChange: (v: SpeechSynthesisVoice) => void
  accentText: string
}

/** Native <select> styled for dark theme with voice grouped by language. */
function VoiceSelector({ voices, selected, onChange, accentText }: VoiceSelectorProps) {
  if (!voices.length) return null

  // Group by language prefix
  const enVoices = voices.filter(v => v.lang.startsWith('en'))
  const otherVoices = voices.filter(v => !v.lang.startsWith('en'))

  return (
    <div className="relative flex items-center gap-1.5">
      <span className="text-xs text-gray-500 shrink-0 hidden sm:inline">Voice</span>
      <div className="relative">
        <select
          value={selected?.name ?? ''}
          onChange={e => {
            const v = voices.find(x => x.name === e.target.value)
            if (v) onChange(v)
          }}
          className={cn(
            'appearance-none text-xs rounded-lg px-3 py-1.5 pr-7',
            'bg-gray-800 border border-gray-700 text-gray-200',
            'hover:border-gray-600 focus:outline-none focus:ring-1',
            accentText,
            'cursor-pointer max-w-[180px] truncate',
          )}
        >
          {enVoices.length > 0 && (
            <optgroup label="English">
              {enVoices.map(v => (
                <option key={v.name} value={v.name}>
                  {v.name.replace(/\s*\(.*?\)\s*/g, '')} ({v.lang})
                </option>
              ))}
            </optgroup>
          )}
          {otherVoices.length > 0 && (
            <optgroup label="Other Languages">
              {otherVoices.map(v => (
                <option key={v.name} value={v.name}>
                  {v.name.replace(/\s*\(.*?\)\s*/g, '')} ({v.lang})
                </option>
              ))}
            </optgroup>
          )}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
      </div>
    </div>
  )
}

// ─── Animated waveform ─────────────────────────────────────────────────────────

/** Three bouncing dots shown when speech is active. */
function PlayingDots({ dotClass }: { dotClass: string }) {
  return (
    <span className="flex items-end gap-0.5 h-4">
      {[0, 1, 2, 3].map(i => (
        <span
          key={i}
          className={cn('w-0.5 rounded-full', dotClass)}
          style={{
            height: `${[10, 16, 6, 14][i]}px`,
            animation: `readAloudWave 1s ease-in-out ${i * 0.15}s infinite alternate`,
          }}
        />
      ))}
    </span>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

interface ReadAloudBarProps {
  topic: CurriculumTopic
  accentColor?: keyof typeof ACCENT
}

/**
 * ReadAloudBar — a full-featured TTS player embedded in every LessonView.
 * Features: voice picker, speed presets, ±5s skip, pause/resume/stop.
 */
export default function ReadAloudBar({ topic, accentColor = 'blue' }: ReadAloudBarProps) {
  const {
    status, voices, selectedVoice, rate,
    setVoice, setRate,
    play, pause, resume, stop, skipForward, skipBackward,
    supported,
  } = useReadAloud()

  const narrationRef = useRef('')
  const a = ACCENT[accentColor]
  const isPlaying = status === 'playing'
  const isPaused = status === 'paused'
  const isActive = isPlaying || isPaused

  // Build narration once per topic change
  useEffect(() => {
    narrationRef.current = buildTopicNarration(topic)
    // Stop playback when topic changes
    stop()
  }, [topic.id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!supported) return null

  return (
    <div
      className={cn(
        'rounded-2xl border transition-all duration-200',
        isActive
          ? cn('shadow-lg', a.activeBg)
          : 'bg-gray-900/70 border-gray-800',
      )}
    >
      {/* ── Top row ── */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Icon + label */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {isPlaying ? (
            <PlayingDots dotClass={a.dot} />
          ) : (
            <Volume2 className={cn('w-4 h-4 shrink-0', isActive ? a.text : 'text-gray-500')} />
          )}
          <span className={cn('text-xs font-semibold truncate', isActive ? a.text : 'text-gray-400')}>
            {isPlaying ? 'Reading aloud…' : isPaused ? 'Paused' : 'Read Aloud'}
          </span>
        </div>

        {/* Controls when idle */}
        {!isActive && (
          <div className="flex items-center gap-2 shrink-0">
            <VoiceSelector
              voices={voices}
              selected={selectedVoice}
              onChange={setVoice}
              accentText={a.text}
            />
            <button
              onClick={() => play(narrationRef.current)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors shrink-0',
                a.playBtn,
              )}
              aria-label="Start reading aloud"
            >
              <Play className="w-3.5 h-3.5" />
              Play
            </button>
          </div>
        )}

        {/* Stop when active */}
        {isActive && (
          <button
            onClick={stop}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/25 transition-colors shrink-0"
            aria-label="Stop"
          >
            <Square className="w-3 h-3" />
            Stop
          </button>
        )}
      </div>

      {/* ── Controls row (only when active) ── */}
      {isActive && (
        <div className="px-4 pb-3 flex flex-wrap items-center gap-3 border-t border-gray-800/60 pt-3">
          {/* Seek + play/pause controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={skipBackward}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium transition-colors"
              aria-label="Skip back 5 seconds"
            >
              <SkipBack className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">-5s</span>
            </button>

            {isPlaying ? (
              <button
                onClick={pause}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold transition-colors"
                aria-label="Pause"
              >
                <Pause className="w-3.5 h-3.5" />
                Pause
              </button>
            ) : (
              <button
                onClick={resume}
                className={cn(
                  'flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-white text-xs font-semibold transition-colors',
                  a.playBtn,
                )}
                aria-label="Resume"
              >
                <Play className="w-3.5 h-3.5" />
                Resume
              </button>
            )}

            <button
              onClick={skipForward}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium transition-colors"
              aria-label="Skip forward 5 seconds"
            >
              <span className="hidden sm:inline">+5s</span>
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Divider */}
          <span className="hidden sm:block w-px h-5 bg-gray-700 shrink-0" />

          {/* Speed presets */}
          <div className="flex items-center gap-1">
            {SPEED_PRESETS.map(preset => (
              <button
                key={preset.value}
                onClick={() => setRate(preset.value)}
                className={cn(
                  'px-2 py-1 rounded-md text-[11px] font-semibold border transition-colors',
                  Math.abs(rate - preset.value) < 0.01
                    ? a.speedActive
                    : 'text-gray-500 border-transparent hover:text-gray-300 hover:bg-gray-800',
                )}
                aria-label={`Set speed to ${preset.label}`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <span className="hidden sm:block w-px h-5 bg-gray-700 shrink-0" />

          {/* Voice selector */}
          <VoiceSelector
            voices={voices}
            selected={selectedVoice}
            onChange={setVoice}
            accentText={a.text}
          />
        </div>
      )}
    </div>
  )
}
