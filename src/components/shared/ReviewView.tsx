import { useState, useMemo, useCallback } from 'react'
import {
  Brain,
  CalendarClock,
  CheckCircle2,
  Plus,
  Trash2,
  Sparkles,
  Layers,
  ChevronRight,
  GraduationCap,
  Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type {
  ReviewItem,
  ReviewGrade,
  CurriculumTopic,
  FlashcardData,
  TrackKey,
} from '@/types'
import { getReviewItems, saveReviewItem, deleteReviewItem } from '@/lib/storage'
import { createReviewItem, scheduleReview, isDue, dueLabel } from '@/lib/spacedRepetition'

// ─── Config ────────────────────────────────────────────────────────────────────

type Accent = 'blue' | 'purple' | 'cyan' | 'orange'

interface ReviewViewProps {
  track: TrackKey
  curriculum: CurriculumTopic[]
  flashcards: FlashcardData
  accentColor: Accent
}

const ACCENT: Record<Accent, { text: string; bg: string; border: string; solid: string; badge: string }> = {
  blue:   { text: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/25',   solid: 'bg-blue-500 hover:bg-blue-600',     badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  purple: { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/25', solid: 'bg-purple-500 hover:bg-purple-600', badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  cyan:   { text: 'text-cyan-400',   bg: 'bg-cyan-500/10',   border: 'border-cyan-500/25',   solid: 'bg-cyan-500 hover:bg-cyan-600',     badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  orange: { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/25', solid: 'bg-orange-500 hover:bg-orange-600', badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
}

const GRADES: { key: ReviewGrade; label: string; sub: string; className: string }[] = [
  { key: 'again', label: 'Again', sub: 'Forgot',     className: 'border-red-500/30 text-red-400 hover:bg-red-500/10' },
  { key: 'hard',  label: 'Hard',  sub: 'Struggled',  className: 'border-orange-500/30 text-orange-400 hover:bg-orange-500/10' },
  { key: 'good',  label: 'Good',  sub: 'Recalled',   className: 'border-green-500/30 text-green-400 hover:bg-green-500/10' },
  { key: 'easy',  label: 'Easy',  sub: 'Instant',    className: 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10' },
]

// ─── Component ─────────────────────────────────────────────────────────────────

type Mode = 'overview' | 'studying'

/**
 * ReviewView — a spaced-repetition memory bank. Cards come from the Interview
 * "Add to Review" action and from seeding a topic's flashcards. Due cards are
 * studied with an Again/Hard/Good/Easy grade that reschedules them (SM-2 style).
 */
export default function ReviewView({ track, curriculum, flashcards, accentColor }: ReviewViewProps) {
  const a = ACCENT[accentColor]

  const [items, setItems] = useState<ReviewItem[]>(() =>
    getReviewItems().filter(i => i.track === track),
  )
  const [mode, setMode] = useState<Mode>('overview')
  const [queue, setQueue] = useState<ReviewItem[]>([])
  const [qIdx, setQIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [addOpen, setAddOpen] = useState(false)

  const refresh = useCallback(() => {
    setItems(getReviewItems().filter(i => i.track === track))
  }, [track])

  const dueItems = useMemo(() => items.filter(isDue), [items])
  const mastered = useMemo(() => items.filter(i => i.repetitions >= 3).length, [items])

  // Topics that have flashcards available to seed
  const seedableTopics = useMemo(
    () => curriculum.filter(t => (flashcards[t.id]?.length ?? 0) > 0),
    [curriculum, flashcards],
  )

  const existingKeys = useMemo(
    () => new Set(items.map(i => `${i.topicId}::${i.front}`)),
    [items],
  )

  // ── Actions ────────────────────────────────────────────────────────────────

  const startStudy = useCallback(() => {
    if (!dueItems.length) return
    setQueue(dueItems)
    setQIdx(0)
    setRevealed(false)
    setMode('studying')
  }, [dueItems])

  const grade = useCallback((g: ReviewGrade) => {
    const current = queue[qIdx]
    if (!current) return
    const updated = scheduleReview(current, g)
    saveReviewItem(updated)
    if (qIdx + 1 < queue.length) {
      setQIdx(qIdx + 1)
      setRevealed(false)
    } else {
      refresh()
      setMode('overview')
    }
  }, [queue, qIdx, refresh])

  const seedTopic = useCallback((topic: CurriculumTopic) => {
    const cards = flashcards[topic.id] ?? []
    let added = 0
    for (const c of cards) {
      const key = `${topic.id}::${c.q}`
      if (existingKeys.has(key)) continue
      saveReviewItem(createReviewItem({
        track,
        topicId: topic.id,
        topicTitle: topic.title,
        front: c.q,
        back: c.a + (c.hint ? `\n\nHint: ${c.hint}` : ''),
      }))
      added++
    }
    if (added > 0) refresh()
  }, [flashcards, existingKeys, track, refresh])

  const removeItem = useCallback((id: string) => {
    deleteReviewItem(id)
    refresh()
  }, [refresh])

  // ── Render: STUDYING ────────────────────────────────────────────────────────
  if (mode === 'studying') {
    const card = queue[qIdx]
    if (!card) { setMode('overview'); return null }
    const pct = Math.round((qIdx / queue.length) * 100)

    return (
      <div className="max-w-2xl mx-auto space-y-5 pb-12">
        <div className="flex items-center justify-between">
          <button onClick={() => { refresh(); setMode('overview') }} className="text-gray-500 hover:text-gray-300 text-xs">
            ✕ End session
          </button>
          <span className="text-xs text-gray-500">{qIdx + 1} / {queue.length}</span>
        </div>
        <div className="h-1 bg-gray-800 rounded-full">
          <div className={cn('h-1 rounded-full transition-all', a.solid.split(' ')[0])} style={{ width: `${pct}%` }} />
        </div>

        <div className="text-center">
          <span className={cn('text-[11px] font-medium px-2 py-0.5 rounded border', a.badge)}>{card.topicTitle}</span>
        </div>

        {/* Front */}
        <div className={cn('rounded-2xl p-6 border min-h-[8rem] flex items-center justify-center text-center', a.bg, a.border)}>
          <p className="text-lg font-semibold text-white leading-relaxed whitespace-pre-line">{card.front}</p>
        </div>

        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className={cn('w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold text-white transition-colors', a.solid)}
          >
            <Eye className="w-4 h-4" /> Show Answer
          </button>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-line">{card.back}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 text-center mb-2">How well did you recall it?</p>
              <div className="grid grid-cols-4 gap-2">
                {GRADES.map(g => (
                  <button
                    key={g.key}
                    onClick={() => grade(g.key)}
                    className={cn('flex flex-col items-center gap-0.5 py-3 rounded-lg border bg-gray-900 transition-colors', g.className)}
                  >
                    <span className="text-sm font-semibold">{g.label}</span>
                    <span className="text-[10px] text-gray-500">{g.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── Render: OVERVIEW ────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
          <Brain className={cn('w-5 h-5', a.text)} />
          Memory Bank
        </h2>
        <p className="text-sm text-gray-400 max-w-xl">
          Spaced repetition beats cramming. Cards resurface right before you&apos;d forget them — grade
          your recall and the schedule adapts. Add cards from any interview question or seed a topic&apos;s flashcards.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className={cn('rounded-xl p-4 border text-center', a.bg, a.border)}>
          <div className={cn('text-2xl font-bold', a.text)}>{dueItems.length}</div>
          <div className="text-xs text-gray-400 flex items-center justify-center gap-1"><CalendarClock className="w-3 h-3" /> Due now</div>
        </div>
        <div className="rounded-xl p-4 border border-gray-800 bg-gray-900 text-center">
          <div className="text-2xl font-bold text-white">{items.length}</div>
          <div className="text-xs text-gray-400 flex items-center justify-center gap-1"><Layers className="w-3 h-3" /> Total cards</div>
        </div>
        <div className="rounded-xl p-4 border border-gray-800 bg-gray-900 text-center">
          <div className="text-2xl font-bold text-green-400">{mastered}</div>
          <div className="text-xs text-gray-400 flex items-center justify-center gap-1"><GraduationCap className="w-3 h-3" /> Mastered</div>
        </div>
      </div>

      {/* Study CTA */}
      {dueItems.length > 0 ? (
        <button
          onClick={startStudy}
          className={cn('w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white transition-colors', a.solid)}
        >
          <Sparkles className="w-4 h-4" /> Study {dueItems.length} due card{dueItems.length !== 1 ? 's' : ''}
        </button>
      ) : items.length > 0 ? (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
          <p className="text-sm text-green-300">All caught up — no cards due right now. Come back later or add more.</p>
        </div>
      ) : null}

      {/* Add cards from flashcards */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <button
          onClick={() => setAddOpen(o => !o)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-800/50 transition-colors"
        >
          <span className="flex items-center gap-2 text-sm font-medium text-white">
            <Plus className={cn('w-4 h-4', a.text)} /> Add cards from a topic&apos;s flashcards
          </span>
          <ChevronRight className={cn('w-4 h-4 text-gray-500 transition-transform', addOpen && 'rotate-90')} />
        </button>
        {addOpen && (
          <div className="px-4 pb-4 max-h-72 overflow-y-auto space-y-1">
            {seedableTopics.length === 0 && (
              <p className="text-xs text-gray-500 py-2">No flashcards available for this course yet.</p>
            )}
            {seedableTopics.map(t => {
              const total = flashcards[t.id]?.length ?? 0
              const already = flashcards[t.id]?.every(c => existingKeys.has(`${t.id}::${c.q}`)) ?? false
              return (
                <div key={t.id} className="flex items-center justify-between gap-2 py-1.5 border-b border-gray-800/50 last:border-0">
                  <span className="text-sm text-gray-300 truncate">{t.title}</span>
                  <button
                    onClick={() => seedTopic(t)}
                    disabled={already}
                    className={cn(
                      'text-xs px-2.5 py-1 rounded-lg border shrink-0 transition-colors flex items-center gap-1',
                      already
                        ? 'border-green-500/30 text-green-400 bg-green-500/10 cursor-default'
                        : 'border-gray-700 text-gray-300 hover:bg-gray-800',
                    )}
                  >
                    {already ? <><CheckCircle2 className="w-3 h-3" /> Added</> : <><Plus className="w-3 h-3" /> {total}</>}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Card list */}
      {items.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-white mb-2">All cards ({items.length})</h3>
          <div className="space-y-2">
            {[...items]
              .sort((x, y) => x.dueDate.localeCompare(y.dueDate))
              .map(item => (
                <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-lg p-3 flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-200 leading-snug line-clamp-2">{item.front}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-gray-500">{item.topicTitle}</span>
                      <span className={cn(
                        'text-[10px] px-1.5 py-0.5 rounded border',
                        isDue(item) ? a.badge : 'border-gray-700 text-gray-500',
                      )}>
                        {dueLabel(item)}
                      </span>
                      {item.repetitions >= 3 && (
                        <span className="text-[10px] text-green-400 flex items-center gap-0.5"><GraduationCap className="w-3 h-3" /> mastered</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-600 hover:text-red-400 transition-colors shrink-0 p-1"
                    aria-label="Delete card"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {items.length === 0 && (
        <div className="text-center py-10 border border-dashed border-gray-800 rounded-xl">
          <Brain className="w-10 h-10 text-gray-700 mx-auto mb-3" />
          <p className="text-sm text-gray-400 mb-1">Your memory bank is empty</p>
          <p className="text-xs text-gray-600 max-w-sm mx-auto">
            Add cards by seeding a topic&apos;s flashcards above, or hit “Add to Review” on any question in the Interview tab.
          </p>
        </div>
      )}
    </div>
  )
}
