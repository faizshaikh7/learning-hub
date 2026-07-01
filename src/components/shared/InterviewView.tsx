import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle2,
  Eye,
  RotateCcw,
  ChevronRight,
  Brain,
  Zap,
  BookOpen,
  Flame,
  TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type {
  InterviewBank,
  InterviewRole,
  InterviewLevel,
  InterviewQuestion,
  InterviewSession,
  CurriculumTopic,
  TrackProgress,
  TrackKey,
} from '@/types'
import {
  getInterviewSessions,
  saveInterviewSession,
  saveReviewItem,
} from '@/lib/storage'
import { createReviewItem } from '@/lib/spacedRepetition'

// ─── Config ────────────────────────────────────────────────────────────────────

type Accent = 'blue' | 'purple' | 'cyan' | 'orange'

interface InterviewViewProps {
  bank: InterviewBank
  curriculum: CurriculumTopic[]
  progress: TrackProgress
  track: TrackKey
  accentColor: Accent
  /** Optional: jump to a lesson tab for a topic id. */
  onOpenTopic?: (topicId: string) => void
}

const ROUNDS: { level: InterviewLevel; name: string; short: string; blurb: string; count: number; seconds: number }[] = [
  { level: 'screen',    name: 'Round 1 · Phone Screen',        short: 'Screen',    blurb: 'Fundamentals & breadth',        count: 5, seconds: 90 },
  { level: 'technical', name: 'Round 2 · Technical Deep Dive', short: 'Technical', blurb: 'Depth & problem-solving',        count: 5, seconds: 120 },
  { level: 'design',    name: 'Round 3 · System Design',       short: 'Design',    blurb: 'Architecture & senior judgment', count: 3, seconds: 180 },
]

const RATINGS = [
  { key: 'blank',   label: 'Blanked',  emoji: '😰', score: 0,   color: 'text-red-400 border-red-500/30 hover:bg-red-500/10' },
  { key: 'partial', label: 'Partial',  emoji: '😐', score: 45,  color: 'text-orange-400 border-orange-500/30 hover:bg-orange-500/10' },
  { key: 'solid',   label: 'Solid',    emoji: '🙂', score: 75,  color: 'text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/10' },
  { key: 'nailed',  label: 'Nailed it', emoji: '🔥', score: 100, color: 'text-green-400 border-green-500/30 hover:bg-green-500/10' },
] as const

const ACCENT: Record<Accent, { text: string; bg: string; border: string; solid: string; badge: string; ring: string }> = {
  blue:   { text: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/25',   solid: 'bg-blue-500 hover:bg-blue-600',     badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30',     ring: 'ring-blue-500/40' },
  purple: { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/25', solid: 'bg-purple-500 hover:bg-purple-600', badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30', ring: 'ring-purple-500/40' },
  cyan:   { text: 'text-cyan-400',   bg: 'bg-cyan-500/10',   border: 'border-cyan-500/25',   solid: 'bg-cyan-500 hover:bg-cyan-600',     badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',     ring: 'ring-cyan-500/40' },
  orange: { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/25', solid: 'bg-orange-500 hover:bg-orange-600', badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30', ring: 'ring-orange-500/40' },
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

type Verdict = InterviewSession['verdict']

function verdictFor(score: number): { verdict: Verdict; label: string; emoji: string; color: string } {
  if (score >= 85) return { verdict: 'strong-hire', label: 'Strong Hire', emoji: '🏆', color: 'text-green-400' }
  if (score >= 70) return { verdict: 'hire',        label: 'Hire',        emoji: '✅', color: 'text-green-400' }
  if (score >= 55) return { verdict: 'lean-hire',   label: 'Lean Hire',   emoji: '🤔', color: 'text-yellow-400' }
  return { verdict: 'no-hire', label: 'No Hire — Keep Practicing', emoji: '📚', color: 'text-red-400' }
}

// ─── Sub-views ───────────────────────────────────────────────────────────────

/** Difficulty pill. */
function DiffBadge({ difficulty }: { difficulty: InterviewQuestion['difficulty'] }) {
  const map = {
    beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
    mid: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    senior: 'bg-red-500/20 text-red-400 border-red-500/30',
  }
  return (
    <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded border capitalize', map[difficulty])}>
      {difficulty}
    </span>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

type Phase = 'lobby' | 'running' | 'roundEnd' | 'final'

/**
 * InterviewView — a 3-round, role-based mock interview that adapts to the
 * learner's tracked progress. Round 1 phone screen, Round 2 technical, Round 3
 * system design. Self-scored against model answers with a hire/no-hire verdict.
 */
export default function InterviewView({
  bank,
  curriculum,
  progress,
  track,
  accentColor,
  onOpenTopic,
}: InterviewViewProps) {
  const a = ACCENT[accentColor]

  // Progress signals
  const { studiedIds, completedCount, readiness } = useMemo(() => {
    const studied = new Set<string>()
    let done = 0
    for (const t of curriculum) {
      const s = progress[t.id]
      if (s === 'completed') { studied.add(t.id); done++ }
      else if (s === 'in-progress') studied.add(t.id)
    }
    return {
      studiedIds: studied,
      completedCount: done,
      readiness: curriculum.length ? Math.round((done / curriculum.length) * 100) : 0,
    }
  }, [curriculum, progress])

  const topicTitle = useCallback(
    (id?: string) => curriculum.find(t => t.id === id)?.title ?? '',
    [curriculum],
  )

  // State machine
  const [phase, setPhase] = useState<Phase>('lobby')
  const [role, setRole] = useState<InterviewRole | null>(null)
  const [timed, setTimed] = useState(true)
  const [rounds, setRounds] = useState<InterviewQuestion[][]>([])
  const [roundIdx, setRoundIdx] = useState(0)
  const [qIdx, setQIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  // scores[roundIdx][qIdx] = number
  const [scores, setScores] = useState<number[][]>([])
  const [addedReview, setAddedReview] = useState<Set<string>>(new Set())
  const [sessions, setSessions] = useState<InterviewSession[]>(() => getInterviewSessions())

  // Timer
  const [secondsLeft, setSecondsLeft] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const roundCfg = ROUNDS[roundIdx]
  const roundQuestions = rounds[roundIdx] ?? []
  const question = roundQuestions[qIdx]

  // Build a session for a role, prioritizing studied topics
  const startInterview = useCallback((selected: InterviewRole) => {
    const built = ROUNDS.map(r => {
      const pool = bank.questions.filter(
        q => q.level === r.level && (!q.roleIds || q.roleIds.includes(selected.id)),
      )
      const studied = shuffle(pool.filter(q => q.topicId && studiedIds.has(q.topicId)))
      const rest = shuffle(pool.filter(q => !q.topicId || !studiedIds.has(q.topicId)))
      return [...studied, ...rest].slice(0, r.count)
    })
    setRole(selected)
    setRounds(built)
    setScores(built.map(r => r.map(() => -1)))
    setRoundIdx(0)
    setQIdx(0)
    setRevealed(false)
    setAddedReview(new Set())
    setPhase('running')
  }, [bank.questions, studiedIds])

  // Timer lifecycle: reset per question when running & not revealed
  useEffect(() => {
    if (phase !== 'running' || !timed || revealed || !question) {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
      return
    }
    setSecondsLeft(roundCfg.seconds)
    timerRef.current = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
          setRevealed(true)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null } }
  }, [phase, timed, revealed, roundIdx, qIdx, question, roundCfg.seconds])

  const rate = useCallback((score: number) => {
    setScores(prev => {
      const next = prev.map(r => [...r])
      next[roundIdx][qIdx] = score
      return next
    })
    // advance
    if (qIdx + 1 < roundQuestions.length) {
      setQIdx(qIdx + 1)
      setRevealed(false)
    } else {
      setPhase('roundEnd')
    }
  }, [roundIdx, qIdx, roundQuestions.length])

  const addToReview = useCallback((q: InterviewQuestion) => {
    const item = createReviewItem({
      track,
      topicId: q.topicId ?? q.id,
      topicTitle: topicTitle(q.topicId) || 'Interview question',
      front: q.question,
      back: q.modelAnswer + (q.keyPoints.length ? '\n\nKey points:\n• ' + q.keyPoints.join('\n• ') : ''),
    })
    saveReviewItem(item)
    setAddedReview(prev => new Set(prev).add(q.id))
  }, [track, topicTitle])

  const roundScore = useCallback((ri: number): number => {
    const arr = (scores[ri] ?? []).filter(s => s >= 0)
    if (!arr.length) return 0
    return Math.round(arr.reduce((s, v) => s + v, 0) / arr.length)
  }, [scores])

  const nextRound = useCallback(() => {
    if (roundIdx + 1 < ROUNDS.length) {
      setRoundIdx(roundIdx + 1)
      setQIdx(0)
      setRevealed(false)
      setPhase('running')
    } else {
      // finalize
      const overall = Math.round(
        ROUNDS.reduce((s, _, i) => s + roundScore(i), 0) / ROUNDS.length,
      )
      const weak = new Set<string>()
      rounds.forEach((rq, ri) =>
        rq.forEach((q, qi) => {
          if ((scores[ri]?.[qi] ?? 100) <= 45 && q.topicId) weak.add(q.topicId)
        }),
      )
      const session: InterviewSession = {
        id: `iv-${Date.now()}`,
        track,
        roleId: role!.id,
        date: new Date().toISOString().split('T')[0],
        roundScores: {
          screen: roundScore(0),
          technical: roundScore(1),
          design: roundScore(2),
        },
        overall,
        verdict: verdictFor(overall).verdict,
        weakTopicIds: [...weak],
      }
      saveInterviewSession(session)
      setSessions(getInterviewSessions())
      setPhase('final')
    }
  }, [roundIdx, roundScore, rounds, scores, track, role])

  const reset = useCallback(() => {
    setPhase('lobby')
    setRole(null)
    setRounds([])
    setScores([])
    setRoundIdx(0)
    setQIdx(0)
    setRevealed(false)
  }, [])

  // ─── Render: LOBBY ──────────────────────────────────────────────────────────
  if (phase === 'lobby') {
    const trackSessions = sessions.filter(s => s.track === track)
    const avg = trackSessions.length
      ? Math.round(trackSessions.reduce((s, x) => s + x.overall, 0) / trackSessions.length)
      : null

    return (
      <div className="space-y-6 pb-12">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Briefcase className={cn('w-5 h-5', a.text)} />
              Mock Interview
            </h2>
            <p className="text-sm text-gray-400 max-w-xl">
              A realistic 3-round loop — phone screen, technical deep dive, and system design —
              tailored to the role you\'re targeting and the topics you\'ve studied.
            </p>
          </div>
          {avg !== null && (
            <div className="text-right shrink-0">
              <div className={cn('text-2xl font-bold', a.text)}>{avg}%</div>
              <div className="text-xs text-gray-500">avg · {trackSessions.length} interviews</div>
            </div>
          )}
        </div>

        {/* Readiness */}
        <div className={cn('rounded-xl p-4 border flex items-center gap-4', a.bg, a.border)}>
          <div className="relative w-14 h-14 shrink-0">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="3" className="text-gray-800" />
              <circle
                cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                className={a.text}
                strokeDasharray={`${(readiness / 100) * 97.4} 97.4`}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
              {readiness}%
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white">
              {readiness >= 70 ? 'You\'re interview-ready' : readiness >= 30 ? 'Building readiness' : 'Early days — keep studying'}
            </p>
            <p className="text-xs text-gray-400">
              {completedCount}/{curriculum.length} topics completed. Questions on topics you\'ve studied are prioritized.
            </p>
          </div>
          <label className="ml-auto flex items-center gap-2 text-xs text-gray-400 cursor-pointer shrink-0">
            <Clock className="w-3.5 h-3.5" />
            Timed
            <button
              onClick={() => setTimed(t => !t)}
              className={cn('relative w-9 h-5 rounded-full transition-colors', timed ? a.solid : 'bg-gray-700')}
              role="switch"
              aria-checked={timed}
            >
              <span className={cn('absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all', timed ? 'left-4.5' : 'left-0.5')}
                style={{ left: timed ? '18px' : '2px' }} />
            </button>
          </label>
        </div>

        {/* Role selection */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-1">Choose your target role</h3>
          <p className="text-xs text-gray-500 mb-3">The interview\'s questions and system-design scenarios adapt to the role.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bank.roles.map(r => (
              <div key={r.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col">
                <div className="flex items-start gap-3 mb-2">
                  <span className="text-3xl shrink-0">{r.icon}</span>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-white">{r.title}</h4>
                    <p className={cn('text-xs font-medium', a.text)}>{r.seniority}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed mb-3">{r.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {r.focus.map(f => (
                    <span key={f} className="text-[10px] px-1.5 py-0.5 rounded border border-gray-700 bg-gray-800 text-gray-300">
                      {f}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-gray-500 italic mb-4 flex items-start gap-1">
                  <TrendingUp className="w-3 h-3 mt-0.5 shrink-0" />
                  {r.demandNote}
                </p>
                <button
                  onClick={() => startInterview(r)}
                  className={cn('mt-auto w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors', a.solid)}
                >
                  Start Interview <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent sessions */}
        {trackSessions.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Recent interviews</h3>
            <div className="space-y-2">
              {trackSessions.slice(-5).reverse().map(s => {
                const v = verdictFor(s.overall)
                const roleTitle = bank.roles.find(r => r.id === s.roleId)?.title ?? s.roleId
                return (
                  <div key={s.id} className="flex items-center justify-between gap-3 text-sm py-1.5 border-b border-gray-800/60 last:border-0">
                    <div className="min-w-0">
                      <span className="text-gray-200">{roleTitle}</span>
                      <span className="text-gray-600 text-xs ml-2">{s.date}</span>
                    </div>
                    <span className={cn('font-semibold shrink-0', v.color)}>{v.emoji} {s.overall}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  // ─── Render: RUNNING ────────────────────────────────────────────────────────
  if (phase === 'running' && question) {
    const roundPct = Math.round((qIdx / roundQuestions.length) * 100)
    const studied = question.topicId && studiedIds.has(question.topicId)
    const lowTime = timed && !revealed && secondsLeft <= 10

    return (
      <div className="space-y-5 pb-12 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <button onClick={reset} className="text-gray-500 hover:text-gray-300 text-xs flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Exit
          </button>
          <div className="flex items-center gap-3">
            {timed && !revealed && (
              <span className={cn('font-mono text-sm font-bold tabular-nums', lowTime ? 'text-red-400 animate-pulse' : a.text)}>
                {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}
              </span>
            )}
            <span className="text-xs text-gray-500">{qIdx + 1} / {roundQuestions.length}</span>
          </div>
        </div>

        {/* Round indicator */}
        <div className="flex items-center gap-2">
          {ROUNDS.map((r, i) => (
            <div key={r.level} className="flex items-center gap-2 flex-1">
              <div className={cn(
                'flex-1 h-1 rounded-full',
                i < roundIdx ? a.solid.split(' ')[0] : i === roundIdx ? a.solid.split(' ')[0] : 'bg-gray-800',
              )} style={i === roundIdx ? { opacity: 1 } : i < roundIdx ? { opacity: 1 } : {}} />
            </div>
          ))}
        </div>
        <div>
          <p className={cn('text-xs font-semibold uppercase tracking-wide', a.text)}>{roundCfg.name}</p>
          <p className="text-xs text-gray-500">{roundCfg.blurb}</p>
        </div>

        {/* Progress bar within round */}
        <div className="h-1 bg-gray-800 rounded-full">
          <div className={cn('h-1 rounded-full transition-all', a.solid.split(' ')[0])} style={{ width: `${roundPct}%` }} />
        </div>

        {/* Question card */}
        <div className={cn('rounded-2xl p-6 border', a.bg, a.border)}>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className={cn('text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded border', a.badge)}>
              {question.category}
            </span>
            <DiffBadge difficulty={question.difficulty} />
            {question.topicId && (
              <span className={cn(
                'text-[10px] px-1.5 py-0.5 rounded border',
                studied ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-gray-700 text-gray-500',
              )}>
                {studied ? '✓ You studied this' : 'Stretch topic'}
              </span>
            )}
          </div>
          <p className="text-lg font-semibold text-white leading-relaxed">{question.question}</p>
        </div>

        {!revealed ? (
          <>
            <p className="text-sm text-gray-500">Answer out loud or jot notes — then reveal the model answer and score yourself honestly.</p>
            <textarea
              rows={3}
              placeholder="Optional: type your answer to compare…"
              className="w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-sm text-gray-200 resize-y focus:outline-none focus:ring-1 focus:border-gray-700"
            />
            <button
              onClick={() => setRevealed(true)}
              className={cn('w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold text-white transition-colors', a.solid)}
            >
              <Eye className="w-4 h-4" /> Reveal Model Answer
            </button>
          </>
        ) : (
          <div className="space-y-4">
            {/* Model answer */}
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="text-xs font-semibold text-green-400 uppercase tracking-wide">Model Answer</span>
              </div>
              <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-line">{question.modelAnswer}</p>
            </div>

            {/* Key points */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Target className={cn('w-4 h-4', a.text)} />
                <span className={cn('text-xs font-semibold uppercase tracking-wide', a.text)}>What interviewers listen for</span>
              </div>
              <ul className="space-y-1.5">
                {question.keyPoints.map((k, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className={cn('mt-1.5 w-1.5 h-1.5 rounded-full shrink-0', a.solid.split(' ')[0])} />
                    {k}
                  </li>
                ))}
              </ul>
              {question.followUp && (
                <p className="mt-3 pt-3 border-t border-gray-800 text-xs text-gray-400">
                  <span className={cn('font-semibold', a.text)}>Likely follow-up: </span>{question.followUp}
                </p>
              )}
              {question.redFlags && question.redFlags.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-800">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <AlertTriangle className="w-3 h-3 text-red-400" />
                    <span className="text-[11px] font-semibold text-red-400 uppercase tracking-wide">Red flags</span>
                  </div>
                  <ul className="space-y-1">
                    {question.redFlags.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                        <span className="mt-1 w-1 h-1 rounded-full bg-red-400 shrink-0" />{r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Actions */}
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => addToReview(question)}
                  disabled={addedReview.has(question.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                    addedReview.has(question.id)
                      ? 'border-green-500/30 text-green-400 bg-green-500/10 cursor-default'
                      : 'border-gray-700 text-gray-300 hover:bg-gray-800',
                  )}
                >
                  {addedReview.has(question.id) ? <><CheckCircle2 className="w-3.5 h-3.5" /> Added to Review</> : <><Brain className="w-3.5 h-3.5" /> Add to Review</>}
                </button>
                {question.topicId && onOpenTopic && (
                  <button
                    onClick={() => onOpenTopic(question.topicId!)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" /> Open lesson
                  </button>
                )}
              </div>
            </div>

            {/* Self-rating */}
            <div>
              <p className="text-sm font-semibold text-gray-200 mb-2">How did you do?</p>
              <div className="grid grid-cols-4 gap-2">
                {RATINGS.map(r => (
                  <button
                    key={r.key}
                    onClick={() => rate(r.score)}
                    className={cn('flex flex-col items-center gap-1 py-3 rounded-lg border bg-gray-900 transition-colors', r.color)}
                  >
                    <span className="text-xl">{r.emoji}</span>
                    <span className="text-[11px] font-medium">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ─── Render: ROUND END ──────────────────────────────────────────────────────
  if (phase === 'roundEnd') {
    const rs = roundScore(roundIdx)
    const advanced = rs >= 50
    const isLast = roundIdx === ROUNDS.length - 1
    return (
      <div className="max-w-lg mx-auto text-center py-8 space-y-5">
        <div className="text-5xl">{advanced ? '🎉' : '😬'}</div>
        <div>
          <h2 className="text-xl font-bold text-white">{roundCfg.name} complete</h2>
          <p className={cn('text-4xl font-bold mt-3', advanced ? 'text-green-400' : 'text-yellow-400')}>{rs}%</p>
        </div>
        <div className={cn('rounded-xl p-4 border text-sm', advanced ? 'bg-green-500/10 border-green-500/20 text-green-300' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300')}>
          {advanced
            ? isLast ? 'Great work — you cleared the final round. Let\'s see the verdict.' : `You advanced to ${ROUNDS[roundIdx + 1].name}. Keep the momentum.`
            : 'In a real loop this round would be the end — but this is practice, so push on and learn the gaps.'}
        </div>
        <button
          onClick={nextRound}
          className={cn('w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold text-white transition-colors', a.solid)}
        >
          {isLast ? 'See Final Verdict' : `Continue to ${ROUNDS[roundIdx + 1].short} Round`} <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    )
  }

  // ─── Render: FINAL ──────────────────────────────────────────────────────────
  if (phase === 'final') {
    const overall = Math.round(ROUNDS.reduce((s, _, i) => s + roundScore(i), 0) / ROUNDS.length)
    const v = verdictFor(overall)
    const weakTopics = [...new Set(
      rounds.flatMap((rq, ri) => rq.filter((q, qi) => (scores[ri]?.[qi] ?? 100) <= 45 && q.topicId).map(q => q.topicId!)),
    )]

    return (
      <div className="max-w-xl mx-auto py-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="text-6xl">{v.emoji}</div>
          <h2 className={cn('text-2xl font-bold', v.color)}>{v.label}</h2>
          <p className="text-gray-400 text-sm">{role?.title} · {track} interview</p>
          <div className={cn('text-5xl font-bold mt-2', a.text)}>{overall}%</div>
        </div>

        {/* Round breakdown */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-white">Round breakdown</h3>
          {ROUNDS.map((r, i) => {
            const s = roundScore(i)
            return (
              <div key={r.level} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 w-28 shrink-0">{r.short}</span>
                <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className={cn('h-2 rounded-full', s >= 70 ? 'bg-green-500' : s >= 50 ? 'bg-yellow-500' : 'bg-red-500')} style={{ width: `${s}%` }} />
                </div>
                <span className="text-xs font-semibold text-gray-300 w-10 text-right">{s}%</span>
              </div>
            )
          })}
        </div>

        {/* Focus areas */}
        {weakTopics.length > 0 ? (
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-4 h-4 text-orange-400" />
              <h3 className="text-sm font-semibold text-orange-400">Focus areas to review</h3>
            </div>
            <div className="space-y-2">
              {weakTopics.map(tid => (
                <div key={tid} className="flex items-center justify-between gap-2">
                  <span className="text-sm text-gray-300">{topicTitle(tid) || tid}</span>
                  {onOpenTopic && (
                    <button
                      onClick={() => onOpenTopic(tid)}
                      className="text-xs px-2.5 py-1 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors flex items-center gap-1 shrink-0"
                    >
                      <BookOpen className="w-3 h-3" /> Review
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-5 flex items-center gap-3">
            <Zap className="w-5 h-5 text-green-400 shrink-0" />
            <p className="text-sm text-green-300">No weak spots flagged — strong, consistent answers across all three rounds.</p>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={reset} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Roles
          </button>
          <button onClick={() => role && startInterview(role)} className={cn('flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold text-white transition-colors', a.solid)}>
            <RotateCcw className="w-4 h-4" /> Retry
          </button>
        </div>
      </div>
    )
  }

  return null
}
