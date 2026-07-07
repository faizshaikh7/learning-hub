import { useState, useEffect } from 'react'
import { MessageSquare, Eye, ChevronRight, RotateCcw, CheckCircle2, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CurriculumTopic } from '@/types'

type Accent = 'blue' | 'purple' | 'cyan' | 'orange' | 'emerald' | 'amber'

interface LessonInterviewProps {
  topic: CurriculumTopic
  accentColor: Accent
}

/** Seconds to think before the model answer auto-reveals. */
const THINK_SECONDS = 60

const ACCENT: Record<Accent, { text: string; bg: string; border: string; solid: string; badge: string; bar: string }> = {
  blue:   { text: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   solid: 'bg-blue-500 hover:bg-blue-600',     badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30',     bar: 'bg-blue-500' },
  purple: { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', solid: 'bg-purple-500 hover:bg-purple-600', badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30', bar: 'bg-purple-500' },
  cyan:   { text: 'text-cyan-400',   bg: 'bg-cyan-500/10',   border: 'border-cyan-500/20',   solid: 'bg-cyan-500 hover:bg-cyan-600',     badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',     bar: 'bg-cyan-500' },
  orange: { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', solid: 'bg-orange-500 hover:bg-orange-600', badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30', bar: 'bg-orange-500' },
  emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', solid: 'bg-emerald-500 hover:bg-emerald-600', badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', bar: 'bg-emerald-500' },
  amber: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', solid: 'bg-amber-500 hover:bg-amber-600', badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30', bar: 'bg-amber-500' },
}

/**
 * LessonInterview — an in-lesson interview drill. Shows the topic's interview
 * questions one at a time with a ~60s "think" timer; when it runs out (or you
 * hit Reveal) the model answer appears. Falls back to the lesson's own core
 * explanation for questions that don't ship a hand-written answer.
 */
export default function LessonInterview({ topic, accentColor }: LessonInterviewProps) {
  const a = ACCENT[accentColor]
  const questions = topic.interviewQuestions ?? []

  const [qIdx, setQIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(THINK_SECONDS)
  const [paused, setPaused] = useState(false)

  // Reset the drill whenever the lesson changes
  useEffect(() => {
    setQIdx(0)
    setRevealed(false)
    setSecondsLeft(THINK_SECONDS)
    setPaused(false)
  }, [topic.id])

  // Countdown: one tick per second, auto-reveal at zero
  useEffect(() => {
    if (revealed || paused) return
    if (secondsLeft <= 0) { setRevealed(true); return }
    const t = setTimeout(() => setSecondsLeft(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [revealed, paused, secondsLeft])

  if (questions.length === 0) return null

  const hasWritten = !!topic.interviewAnswers?.[qIdx]
  const answer = hasWritten
    ? topic.interviewAnswers![qIdx]
    : `${topic.eli5}\n\n${topic.explanation}`

  const goNext = () => {
    if (qIdx + 1 < questions.length) {
      setQIdx(qIdx + 1)
      setRevealed(false)
      setSecondsLeft(THINK_SECONDS)
      setPaused(false)
    }
  }
  const restart = () => {
    setQIdx(0)
    setRevealed(false)
    setSecondsLeft(THINK_SECONDS)
    setPaused(false)
  }

  const pct = (secondsLeft / THINK_SECONDS) * 100
  const low = secondsLeft <= 10
  const mm = Math.floor(secondsLeft / 60)
  const ss = String(Math.max(0, secondsLeft) % 60).padStart(2, '0')
  const isLast = qIdx === questions.length - 1

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className={cn('w-4 h-4', a.text)} />
          <span className={cn('text-sm font-semibold', a.text)}>Interview Questions</span>
        </div>
        <span className="text-xs text-gray-500">Question {qIdx + 1} / {questions.length}</span>
      </div>

      {/* Question */}
      <p className="text-sm font-medium text-white leading-relaxed mb-4">
        <span className={cn('font-mono text-xs mr-2', a.text)}>Q{qIdx + 1}.</span>
        {questions[qIdx]}
      </p>

      {!revealed ? (
        <>
          {/* Timer */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Think it through — answer reveals when the timer ends
              </span>
              <span className={cn('font-mono text-sm font-bold tabular-nums', low ? 'text-red-400 animate-pulse' : a.text)}>
                {mm}:{ss}
              </span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all duration-1000 ease-linear', low ? 'bg-red-500' : a.bar)}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Optional jot area */}
          <textarea
            rows={3}
            placeholder="Optional: jot or say your answer out loud, then reveal…"
            className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-sm text-gray-200 resize-y focus:outline-none focus:border-gray-700 mb-3"
          />

          <div className="flex items-center gap-2">
            <button
              onClick={() => setRevealed(true)}
              className={cn('flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-white transition-colors', a.solid)}
            >
              <Eye className="w-4 h-4" /> Reveal answer
            </button>
            <button
              onClick={() => setPaused(p => !p)}
              className="px-3 py-2 rounded-lg text-xs font-medium bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
            >
              {paused ? 'Resume timer' : 'Pause timer'}
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Model answer */}
          <div className={cn('rounded-lg p-4 border', a.bg, a.border)}>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className={cn('w-4 h-4', a.text)} />
              <span className={cn('text-xs font-semibold uppercase tracking-wide', a.text)}>
                {hasWritten ? 'Model Answer' : 'Answer — anchored in this lesson'}
              </span>
            </div>
            <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-line">{answer}</p>
          </div>

          {/* Nav */}
          <div className="flex items-center gap-2 mt-4">
            {!isLast ? (
              <button
                onClick={goNext}
                className={cn('flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-white transition-colors', a.solid)}
              >
                Next question <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <span className="text-xs text-gray-500">That's the last one — nice work.</span>
            )}
            <button
              onClick={restart}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors ml-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restart
            </button>
          </div>
        </>
      )}
    </div>
  )
}
