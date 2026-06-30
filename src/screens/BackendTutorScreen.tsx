import { type ReactNode, useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  Brain,
  Layers,
  FileText,
  Timer,
  Map as MapIcon,
  ChevronRight,
  ChevronDown,
  Code2,
  Lightbulb,
  AlertTriangle,
  Star,
  Trophy,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Coffee,
  Zap,
  Check,
  X,
  RotateCw,
  MessageSquare,
  Menu,
} from 'lucide-react'
import { cn, formatTime } from '@/lib/utils'
import { getProgress } from '@/lib/storage'
import { useTrackStore } from '@/store/trackStore'
import { useXPStore } from '@/store/xpStore'
import { useNotesStore } from '@/store/notesStore'
import { useTimerStore } from '@/store/timerStore'
import type { CurriculumTopic, TopicStatus, TimerMode } from '@/types'
import { BACKEND_CURRICULUM } from '@/data/backend/curriculum'
import { BACKEND_QUIZZES } from '@/data/backend/quizzes'
import { BACKEND_FLASHCARDS } from '@/data/backend/flashcards'

// ─── Types ────────────────────────────────────────────────────────────────────

type TabKey = 'lesson' | 'quiz' | 'cards' | 'notes' | 'roadmap' | 'timer'

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Groups topics by their phaseName. */
function groupByPhase(topics: CurriculumTopic[]): Map<string, CurriculumTopic[]> {
  const map = new Map<string, CurriculumTopic[]>()
  for (const t of topics) {
    const arr = map.get(t.phaseName) ?? []
    arr.push(t)
    map.set(t.phaseName, arr)
  }
  return map
}

/** Returns a Tailwind color class for code language labels. */
function langColor(lang: string): string {
  const map: Record<string, string> = {
    javascript: 'text-yellow-400',
    typescript: 'text-blue-400',
    bash: 'text-green-400',
    sql: 'text-orange-400',
    nginx: 'text-teal-400',
    python: 'text-blue-300',
  }
  return map[lang.toLowerCase()] ?? 'text-gray-400'
}

/** Returns the verdict badge color. */
function verdictColor(verdict: 'best' | 'ok' | 'weak'): string {
  if (verdict === 'best') return 'bg-green-500/20 text-green-400 border-green-500/30'
  if (verdict === 'ok') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
  return 'bg-red-500/20 text-red-400 border-red-500/30'
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Sidebar topic item — shows status icon, title, and estimated time. */
function TopicItem({
  topic,
  status,
  isActive,
  onSelect,
}: {
  topic: CurriculumTopic
  status: TopicStatus
  isActive: boolean
  onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full text-left px-3 py-2 rounded-lg flex items-start gap-2 transition-colors group',
        isActive
          ? 'bg-blue-500/20 border border-blue-500/40'
          : 'hover:bg-gray-800/60 border border-transparent',
      )}
    >
      <span className="mt-0.5 shrink-0">
        {status === 'completed' ? (
          <CheckCircle2 className="w-4 h-4 text-blue-400" />
        ) : status === 'in-progress' ? (
          <Circle className="w-4 h-4 text-yellow-400" />
        ) : (
          <Circle className="w-4 h-4 text-gray-600 group-hover:text-gray-400" />
        )}
      </span>
      <span className="flex-1 min-w-0">
        <span className={cn('text-sm block truncate', isActive ? 'text-white' : 'text-gray-300')}>
          {topic.title}
        </span>
        <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
          <Clock className="w-3 h-3" />
          {topic.estimatedMins}m
        </span>
      </span>
    </button>
  )
}

/** Collapsible phase section in the sidebar. */
function PhaseSection({
  phaseName,
  topics,
  progress,
  activeTopic,
  onSelect,
}: {
  phaseName: string
  topics: CurriculumTopic[]
  progress: Record<string, TopicStatus>
  activeTopic: CurriculumTopic
  onSelect: (t: CurriculumTopic) => void
}) {
  const completed = topics.filter(t => progress[t.id] === 'completed').length
  const isCurrentPhase = topics.some(t => t.id === activeTopic.id)
  const [open, setOpen] = useState(isCurrentPhase)

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-200 transition-colors"
      >
        {open ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        <span className="flex-1 text-left">{phaseName}</span>
        <span className="text-gray-600 font-normal normal-case">
          {completed}/{topics.length}
        </span>
      </button>
      {open && (
        <div className="pl-1 space-y-0.5">
          {topics.map(t => (
            <TopicItem
              key={t.id}
              topic={t}
              status={progress[t.id] ?? 'not-started'}
              isActive={t.id === activeTopic.id}
              onSelect={() => onSelect(t)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/** Full lesson view for a single curriculum topic. */
function LessonView({
  topic,
  status,
  onMarkComplete,
}: {
  topic: CurriculumTopic
  status: TopicStatus
  onMarkComplete: () => void
}) {
  const [expandedCode, setExpandedCode] = useState<number | null>(null)

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {topic.phaseName}
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {topic.estimatedMins} min
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">{topic.title}</h1>
        </div>
        <button
          onClick={onMarkComplete}
          disabled={status === 'completed'}
          className={cn(
            'shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all',
            status === 'completed'
              ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default'
              : 'bg-blue-500 hover:bg-blue-600 text-white',
          )}
        >
          {status === 'completed' ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Completed
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Mark Complete (+10 XP)
            </>
          )}
        </button>
      </div>

      {/* ELI5 */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-semibold text-yellow-400">ELI5 — Explain Like I'm 5</span>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed">{topic.eli5}</p>
      </div>

      {/* Analogy */}
      <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-semibold text-purple-400">Analogy</span>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed">{topic.analogy}</p>
      </div>

      {/* Explanation */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-semibold text-blue-400">Explanation</span>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{topic.explanation}</p>
      </div>

      {/* Technical Deep Dive */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-semibold text-cyan-400">Technical Deep Dive</span>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{topic.technicalDeep}</p>
      </div>

      {/* Efficient Way */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-green-400" />
          <span className="text-sm font-semibold text-green-400">Efficient Way — {topic.efficientWay.title}</span>
        </div>
        <div className="space-y-2 mb-4">
          {topic.efficientWay.approaches.map((a, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50">
              <span
                className={cn(
                  'shrink-0 text-xs font-semibold px-1.5 py-0.5 rounded border',
                  verdictColor(a.verdict),
                )}
              >
                {a.verdict.toUpperCase()}
              </span>
              <div>
                <p className="text-sm text-gray-200">{a.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{a.reason}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <p className="text-sm text-blue-200">{topic.efficientWay.recommendation}</p>
        </div>
      </div>

      {/* What Breaks */}
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <span className="text-sm font-semibold text-red-400">What Breaks</span>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{topic.whatBreaks}</p>
      </div>

      {/* Common Mistakes */}
      <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-orange-400" />
          <span className="text-sm font-semibold text-orange-400">Common Mistakes</span>
        </div>
        <ul className="space-y-2">
          {topic.commonMistakes.map((m, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
              <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-orange-400" />
              {m}
            </li>
          ))}
        </ul>
      </div>

      {/* Senior Notes */}
      {topic.seniorNotes && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-semibold text-yellow-400">Senior Notes</span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{topic.seniorNotes}</p>
        </div>
      )}

      {/* Interview Questions */}
      {topic.interviewQuestions.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold text-blue-400">Interview Questions</span>
          </div>
          <ul className="space-y-2">
            {topic.interviewQuestions.map((q, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="shrink-0 text-blue-500 font-mono text-xs mt-1">Q{i + 1}.</span>
                {q}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Code Examples */}
      {topic.codeExamples.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-semibold text-gray-400">Code Examples</span>
          </div>
          {topic.codeExamples.map((ex, i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-gray-800">
              <button
                onClick={() => setExpandedCode(expandedCode === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-900 hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className={cn('text-xs font-mono font-semibold', langColor(ex.lang))}>
                    {ex.lang}
                  </span>
                  <span className="text-sm text-gray-300">{ex.label}</span>
                </div>
                {expandedCode === i ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </button>
              {expandedCode === i && (
                <pre className="p-4 bg-gray-950 overflow-x-auto text-sm text-gray-300 font-mono leading-relaxed">
                  <code>{ex.code}</code>
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/** Interactive quiz view with concept, debug, and architecture question types. */
function QuizView({ topic }: { topic: CurriculumTopic }) {
  const topicQuizzes = useMemo(() => ({
    concept: BACKEND_QUIZZES.concept.filter(q => q.topic === topic.id),
    debug: BACKEND_QUIZZES.debug.filter(q => q.topic === topic.id),
    architecture: BACKEND_QUIZZES.architecture.filter(q => q.topic === topic.id),
  }), [topic.id])

  const allMCQ = useMemo(
    () => [...topicQuizzes.concept, ...topicQuizzes.debug],
    [topicQuizzes],
  )
  const archQuizzes = topicQuizzes.architecture

  const [qIdx, setQIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [showArch, setShowArch] = useState(false)
  const [archIdx, setArchIdx] = useState(0)

  // Reset when topic changes
  useEffect(() => {
    setQIdx(0)
    setSelected(null)
    setShowExplanation(false)
    setShowArch(false)
    setArchIdx(0)
  }, [topic.id])

  const current = allMCQ[qIdx]
  const currentArch = archQuizzes[archIdx]

  const handleAnswer = useCallback((idx: number) => {
    if (selected !== null) return
    setSelected(idx)
    setShowExplanation(true)
  }, [selected])

  const nextQuestion = useCallback(() => {
    setSelected(null)
    setShowExplanation(false)
    setQIdx(i => (i + 1) % Math.max(allMCQ.length, 1))
  }, [allMCQ.length])

  if (allMCQ.length === 0 && archQuizzes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Brain className="w-12 h-12 text-gray-600 mb-3" />
        <p className="text-gray-400 text-sm">No quiz questions for this topic yet.</p>
        <p className="text-gray-600 text-xs mt-1">Check back as the quiz bank grows!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => setShowArch(false)}
          className={cn(
            'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
            !showArch ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-gray-400 hover:text-gray-200',
          )}
        >
          Concept & Debug ({allMCQ.length})
        </button>
        {archQuizzes.length > 0 && (
          <button
            onClick={() => setShowArch(true)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              showArch ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:text-gray-200',
            )}
          >
            Architecture ({archQuizzes.length})
          </button>
        )}
      </div>

      {!showArch && allMCQ.length > 0 && current && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-gray-500">
              Question {qIdx + 1} of {allMCQ.length}
            </span>
            <span
              className={cn(
                'text-xs font-medium px-2 py-0.5 rounded border',
                current.difficulty === 'senior'
                  ? 'bg-red-500/20 text-red-400 border-red-500/30'
                  : current.difficulty === 'mid'
                    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    : 'bg-green-500/20 text-green-400 border-green-500/30',
              )}
            >
              {current.difficulty}
            </span>
          </div>

          <p className="text-white font-medium mb-6 leading-relaxed whitespace-pre-line">{current.q}</p>

          <div className="space-y-3">
            {current.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className={cn(
                  'w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors',
                  selected === null
                    ? 'border-gray-700 text-gray-300 hover:border-blue-500/50 hover:bg-blue-500/5'
                    : i === current.answer
                      ? 'border-green-500/50 bg-green-500/10 text-green-300'
                      : selected === i
                        ? 'border-red-500/50 bg-red-500/10 text-red-300'
                        : 'border-gray-800 text-gray-500',
                )}
              >
                <span className="font-mono text-xs mr-2 text-gray-500">{String.fromCharCode(65 + i)}.</span>
                {opt}
                {selected !== null && i === current.answer && (
                  <Check className="inline w-4 h-4 ml-2 text-green-400" />
                )}
                {selected === i && i !== current.answer && (
                  <X className="inline w-4 h-4 ml-2 text-red-400" />
                )}
              </button>
            ))}
          </div>

          {showExplanation && (
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-sm text-blue-200 leading-relaxed">{current.explanation}</p>
            </div>
          )}

          {selected !== null && (
            <button
              onClick={nextQuestion}
              className="mt-4 w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <SkipForward className="w-4 h-4" />
              Next Question
            </button>
          )}
        </div>
      )}

      {showArch && currentArch && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-gray-500">
              Architecture {archIdx + 1} of {archQuizzes.length}
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded border bg-red-500/20 text-red-400 border-red-500/30">
              {currentArch.difficulty}
            </span>
          </div>

          <p className="text-white font-medium mb-6 leading-relaxed">{currentArch.q}</p>

          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 mb-4">
            <p className="text-xs font-semibold text-purple-400 mb-2">Expert Answer</p>
            <p className="text-sm text-gray-300 leading-relaxed">{currentArch.expertAnswer}</p>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-gray-400 mb-2">Key Points</p>
            {currentArch.keyPoints.map((kp, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-purple-400" />
                {kp}
              </div>
            ))}
          </div>

          {archQuizzes.length > 1 && (
            <button
              onClick={() => setArchIdx(i => (i + 1) % archQuizzes.length)}
              className="mt-4 w-full py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <SkipForward className="w-4 h-4" />
              Next Architecture Question
            </button>
          )}
        </div>
      )}
    </div>
  )
}

/** Flashcard view with flip animation for spaced repetition. */
function FlashcardView({ topic }: { topic: CurriculumTopic }) {
  const cards = useMemo(() => BACKEND_FLASHCARDS[topic.id] ?? [], [topic.id])
  const [cardIdx, setCardIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    setCardIdx(0)
    setFlipped(false)
  }, [topic.id])

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Brain className="w-12 h-12 text-gray-600 mb-3" />
        <p className="text-gray-400 text-sm">No flashcards for this topic yet.</p>
      </div>
    )
  }

  const card = cards[cardIdx]

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">
          Card {cardIdx + 1} of {cards.length}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => { setCardIdx(i => Math.max(0, i - 1)); setFlipped(false) }}
            disabled={cardIdx === 0}
            className="px-3 py-1.5 text-sm text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
          >
            Prev
          </button>
          <button
            onClick={() => { setCardIdx(i => Math.min(cards.length - 1, i + 1)); setFlipped(false) }}
            disabled={cardIdx === cards.length - 1}
            className="px-3 py-1.5 text-sm text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-800 rounded-full">
        <div
          className="h-1 bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${((cardIdx + 1) / cards.length) * 100}%` }}
        />
      </div>

      {/* Card */}
      <button
        onClick={() => setFlipped(f => !f)}
        className="w-full min-h-48 bg-gray-900 border border-gray-800 rounded-xl p-6 text-left hover:border-blue-500/40 transition-colors"
      >
        <div className="flex items-center gap-2 mb-4">
          {flipped ? (
            <span className="text-xs font-semibold text-green-400 px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded">
              ANSWER
            </span>
          ) : (
            <span className="text-xs font-semibold text-blue-400 px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded">
              QUESTION
            </span>
          )}
          <span className="text-xs text-gray-500 ml-auto">Tap to flip</span>
        </div>
        <p className={cn('text-lg leading-relaxed', flipped ? 'text-green-100' : 'text-white')}>
          {flipped ? card.a : card.q}
        </p>
      </button>

      <div className="flex gap-3">
        <button
          onClick={() => setFlipped(f => !f)}
          className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <RotateCw className="w-4 h-4" />
          Flip Card
        </button>
        <button
          onClick={() => { setCardIdx(0); setFlipped(false) }}
          className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Restart Deck
        </button>
      </div>
    </div>
  )
}

/** Notes view — per-topic notes with auto-save. */
function NotesView({ topic }: { topic: CurriculumTopic }) {
  const { getNoteForTopic, upsertNote } = useNotesStore()
  const existing = getNoteForTopic(topic.id, 'backend')
  const [content, setContent] = useState(existing?.content ?? '')
  const [saved, setSaved] = useState(true)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Sync note content when topic changes
  useEffect(() => {
    const note = getNoteForTopic(topic.id, 'backend')
    setContent(note?.content ?? '')
    setSaved(true)
  }, [topic.id, getNoteForTopic])

  const handleChange = useCallback((val: string) => {
    setContent(val)
    setSaved(false)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      upsertNote(topic.id, 'backend', val)
      setSaved(true)
    }, 800)
  }, [topic.id, upsertNote])

  return (
    <div className="space-y-4 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-300">Notes — {topic.title}</h2>
        </div>
        <span className={cn('text-xs transition-colors', saved ? 'text-green-500' : 'text-yellow-400')}>
          {saved ? 'Saved' : 'Saving…'}
        </span>
      </div>
      <textarea
        value={content}
        onChange={e => handleChange(e.target.value)}
        placeholder={`Write your notes for "${topic.title}"...\n\n• Key concepts\n• Things to remember\n• Your own analogies\n• Questions to revisit`}
        className="w-full min-h-[400px] bg-gray-900 border border-gray-800 rounded-xl p-4 text-gray-300 text-sm leading-relaxed resize-y focus:outline-none focus:border-blue-500/50 placeholder:text-gray-600 font-mono"
      />
      <p className="text-xs text-gray-600">Notes are saved automatically and stored locally in your browser.</p>
    </div>
  )
}

/** Roadmap view — visual overview of all topics by phase with progress. */
function RoadmapView({
  progress,
  activeTopic,
  onSelect,
}: {
  progress: Record<string, TopicStatus>
  activeTopic: CurriculumTopic
  onSelect: (t: CurriculumTopic) => void
}) {
  const phases = useMemo(() => groupByPhase(BACKEND_CURRICULUM), [])
  const completed = Object.values(progress).filter(s => s === 'completed').length
  const total = BACKEND_CURRICULUM.length
  const pct = Math.round((completed / total) * 100)

  return (
    <div className="space-y-6 pb-12">
      {/* Overall progress */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-white">Backend Engineering Progress</p>
            <p className="text-xs text-gray-400 mt-0.5">{completed} of {total} topics completed</p>
          </div>
          <Trophy className="w-6 h-6 text-yellow-400" />
        </div>
        <div className="h-2 bg-gray-800 rounded-full">
          <div
            className="h-2 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-right text-xs text-gray-500 mt-1">{pct}%</p>
      </div>

      {/* Phases */}
      {Array.from(phases.entries()).map(([phaseName, topics]) => {
        const phaseCompleted = topics.filter(t => progress[t.id] === 'completed').length
        return (
          <div key={phaseName} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800">
              <span className="text-sm font-semibold text-white">{phaseName}</span>
              <span className="text-xs text-gray-400">
                {phaseCompleted}/{topics.length}
              </span>
            </div>
            <div className="p-3 grid grid-cols-1 gap-1">
              {topics.map(t => {
                const s = progress[t.id] ?? 'not-started'
                return (
                  <button
                    key={t.id}
                    onClick={() => onSelect(t)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
                      t.id === activeTopic.id
                        ? 'bg-blue-500/20 border border-blue-500/30'
                        : 'hover:bg-gray-800',
                    )}
                  >
                    {s === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    ) : s === 'in-progress' ? (
                      <Circle className="w-4 h-4 text-yellow-400 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-600 shrink-0" />
                    )}
                    <span className="text-sm text-gray-300 flex-1 truncate">{t.title}</span>
                    <span className="text-xs text-gray-600">{t.estimatedMins}m</span>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/** Pomodoro timer view with focus/break modes and session tracking. */
function TimerView() {
  const { mode, secondsLeft, isRunning, sessionsCompleted, totalFocusMinutes, setMode, tick, start, pause, reset } =
    useTimerStore()

  // Drive the interval
  useEffect(() => {
    if (!isRunning) return
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [isRunning, tick])

  const modes: { key: TimerMode; label: string; icon: ReactNode }[] = [
    { key: 'focus', label: 'Focus', icon: <Zap className="w-4 h-4" /> },
    { key: 'short-break', label: 'Short Break', icon: <Coffee className="w-4 h-4" /> },
    { key: 'long-break', label: 'Long Break', icon: <Coffee className="w-4 h-4" /> },
  ]

  const modeColor = mode === 'focus' ? 'text-blue-400' : mode === 'short-break' ? 'text-green-400' : 'text-teal-400'
  const ringColor = mode === 'focus' ? 'stroke-blue-500' : mode === 'short-break' ? 'stroke-green-500' : 'stroke-teal-500'

  const totalSecs = mode === 'focus' ? 25 * 60 : mode === 'short-break' ? 5 * 60 : 15 * 60
  const pct = ((totalSecs - secondsLeft) / totalSecs) * 100

  // SVG ring
  const r = 80
  const circ = 2 * Math.PI * r
  const dashOffset = circ * (1 - pct / 100)

  return (
    <div className="flex flex-col items-center pb-12 space-y-8">
      {/* Mode tabs */}
      <div className="flex gap-2">
        {modes.map(m => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              mode === m.key
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'text-gray-400 hover:text-gray-200 border border-transparent',
            )}
          >
            {m.icon}
            {m.label}
          </button>
        ))}
      </div>

      {/* Ring timer */}
      <div className="relative w-56 h-56 flex items-center justify-center">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r={r} fill="none" stroke="#1f2937" strokeWidth="10" />
          <circle
            cx="100"
            cy="100"
            r={r}
            fill="none"
            className={ringColor}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="text-center">
          <p className={cn('text-5xl font-mono font-bold', modeColor)}>{formatTime(secondsLeft)}</p>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">{mode}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        <button
          onClick={isRunning ? pause : start}
          className="px-8 py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg transition-colors flex items-center gap-2"
        >
          {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          {isRunning ? 'Pause' : 'Start'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-white">{sessionsCompleted}</p>
          <p className="text-xs text-gray-400 mt-1">Sessions Done</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-white">{totalFocusMinutes}m</p>
          <p className="text-xs text-gray-400 mt-1">Focus Time</p>
        </div>
      </div>

      <p className="text-xs text-gray-600 text-center">
        Complete 4 focus sessions to earn a long break.
      </p>
    </div>
  )
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

/**
 * BackendTutorScreen — full learning experience for the Backend Engineering track.
 * Features: lesson viewer, quiz, flashcards, notes, roadmap, and Pomodoro timer.
 */
export default function BackendTutorScreen() {
  const navigate = useNavigate()
  const { markTopic } = useTrackStore()
  const { addXP } = useXPStore()

  // Read progress from localStorage via store
  const rawProgress = useMemo(
    () => getProgress('bt') as Record<string, TopicStatus>,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const [progress, setProgress] = useState<Record<string, TopicStatus>>(rawProgress)

  // Determine initial topic: first incomplete or first topic
  const initialTopic = useMemo(() => {
    return (
      BACKEND_CURRICULUM.find(t => (rawProgress[t.id] ?? 'not-started') !== 'completed') ??
      BACKEND_CURRICULUM[0]
    )
  }, [rawProgress])

  const [activeTopic, setActiveTopic] = useState<CurriculumTopic>(initialTopic)
  const [activeTab, setActiveTab] = useState<TabKey>('lesson')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const phaseGroups = useMemo(() => groupByPhase(BACKEND_CURRICULUM), [])

  /** Select a topic and switch to the lesson tab. */
  const handleSelectTopic = useCallback((t: CurriculumTopic) => {
    setActiveTopic(t)
    setActiveTab('lesson')
    // Mark as in-progress if not started
    if ((progress[t.id] ?? 'not-started') === 'not-started') {
      markTopic('backend', t.id, 'in-progress')
      setProgress(p => ({ ...p, [t.id]: 'in-progress' }))
    }
  }, [progress, markTopic])

  /** Mark the active topic as completed, award XP, advance to next topic. */
  const handleMarkComplete = useCallback(() => {
    if (progress[activeTopic.id] === 'completed') return

    markTopic('backend', activeTopic.id, 'completed')
    addXP(10)
    setProgress(p => ({ ...p, [activeTopic.id]: 'completed' }))

    // Auto-advance to next incomplete topic
    const currentIdx = BACKEND_CURRICULUM.findIndex(t => t.id === activeTopic.id)
    const nextTopic = BACKEND_CURRICULUM.slice(currentIdx + 1).find(
      t => (progress[t.id] ?? 'not-started') !== 'completed',
    )
    if (nextTopic) {
      setTimeout(() => {
        setActiveTopic(nextTopic)
        setActiveTab('lesson')
      }, 600)
    }
  }, [activeTopic, progress, markTopic, addXP])

  const tabs: { key: TabKey; label: string; icon: ReactNode }[] = [
    { key: 'lesson', label: 'Lesson', icon: <BookOpen className="w-4 h-4" /> },
    { key: 'quiz', label: 'Quiz', icon: <Brain className="w-4 h-4" /> },
    { key: 'cards', label: 'Flashcards', icon: <Layers className="w-4 h-4" /> },
    { key: 'notes', label: 'Notes', icon: <FileText className="w-4 h-4" /> },
    { key: 'roadmap', label: 'Roadmap', icon: <MapIcon className="w-4 h-4" /> },
    { key: 'timer', label: 'Timer', icon: <Timer className="w-4 h-4" /> },
  ]

  const completedCount = Object.values(progress).filter(s => s === 'completed').length
  const totalCount = BACKEND_CURRICULUM.length
  const pct = Math.round((completedCount / totalCount) * 100)

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      {/* Sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20" onClick={() => setSidebarOpen(false)} />
      )}
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full flex flex-col bg-gray-900 border-r border-gray-800 transition-transform duration-300 z-30',
          sidebarOpen ? 'translate-x-0 w-72 shadow-2xl' : '-translate-x-full w-72',
        )}
      >
        {/* Sidebar header */}
        <div className="px-4 py-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Hub
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Backend Engineering</p>
              <p className="text-xs text-gray-400">{completedCount}/{totalCount} completed</p>
            </div>
          </div>
          {/* Track progress bar */}
          <div className="h-1 bg-gray-800 rounded-full">
            <div
              className="h-1 bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Topic list */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
          {Array.from(phaseGroups.entries()).map(([phaseName, topics]) => (
            <PhaseSection
              key={phaseName}
              phaseName={phaseName}
              topics={topics}
              progress={progress}
              activeTopic={activeTopic}
              onSelect={handleSelectTopic}
            />
          ))}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center gap-3 px-4 py-3 border-b border-gray-800 bg-gray-950/80 backdrop-blur shrink-0">
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors text-sm font-medium shrink-0"
            aria-label="Toggle topics"
          >
            <Menu className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">Topics</span>
          </button>

          {/* Tabs */}
          <nav className="flex gap-1 overflow-x-auto scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                  activeTab === tab.key
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60',
                )}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto px-6 md:px-10 py-6">
          {activeTab === 'lesson' && (
            <LessonView
              topic={activeTopic}
              status={progress[activeTopic.id] ?? 'not-started'}
              onMarkComplete={handleMarkComplete}
            />
          )}
          {activeTab === 'quiz' && <QuizView topic={activeTopic} />}
          {activeTab === 'cards' && <FlashcardView topic={activeTopic} />}
          {activeTab === 'notes' && <NotesView topic={activeTopic} />}
          {activeTab === 'roadmap' && (
            <RoadmapView
              progress={progress}
              activeTopic={activeTopic}
              onSelect={(t) => { handleSelectTopic(t); setActiveTab('lesson') }}
            />
          )}
          {activeTab === 'timer' && <TimerView />}
        </main>
      </div>
    </div>
  )
}
