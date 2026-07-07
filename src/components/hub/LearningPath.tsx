import { useNavigate } from 'react-router-dom'
import { Route, ArrowUp, ArrowDown, X, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react'
import { usePathStore } from '@/store/pathStore'
import { useTrackStore } from '@/store/trackStore'
import { TRACKS } from '@/components/hub/TrackCard'
import { cn } from '@/lib/utils'

/**
 * LearningPath — a personal, reorderable sequence of courses. Lets the user
 * decide the order they want to learn tracks in (e.g. Mobile → AI). Purely a
 * hub-side planning tool; it never touches curriculum or lesson content.
 */
export default function LearningPath() {
  const navigate = useNavigate()
  const path = usePathStore(s => s.path)
  const moveUp = usePathStore(s => s.moveUp)
  const moveDown = usePathStore(s => s.moveDown)
  const remove = usePathStore(s => s.remove)
  const stats = useTrackStore(s => s.stats)

  // Resolve path keys to track configs, dropping any that no longer exist.
  const items = path
    .map(key => TRACKS.find(t => t.key === key))
    .filter((t): t is (typeof TRACKS)[number] => Boolean(t))

  // "Up next" = the first course in the path that isn't finished yet.
  const upNextKey = items.find(t => stats[t.key].pct < 100)?.key ?? null

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-yellow-400/15 border border-yellow-400/30 flex items-center justify-center shrink-0">
            <Route className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-white leading-tight">Your Learning Path</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Order the courses however you like — learn your way.
            </p>
          </div>
        </div>
        {items.length > 0 && (
          <span className="shrink-0 text-xs font-semibold text-gray-400 bg-gray-800 border border-gray-700 rounded-full px-2.5 py-1">
            {items.length} {items.length === 1 ? 'course' : 'courses'}
          </span>
        )}
      </div>

      {/* Empty state */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center text-center py-8 px-4">
          <div className="w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center mb-3">
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </div>
          <p className="text-sm font-medium text-gray-200">Build your own learning journey</p>
          <p className="text-xs text-gray-500 mt-1 max-w-sm leading-relaxed">
            Tap <span className="text-gray-300 font-medium">“Add to path”</span> on any track below to line the
            courses up in the exact order you want to learn them.
          </p>
        </div>
      ) : (
        <ol className="space-y-2">
          {items.map((track, i) => {
            const s = stats[track.key]
            const isDone = s.pct >= 100
            const isUpNext = track.key === upNextKey

            return (
              <li
                key={track.key}
                className={cn(
                  'group flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors',
                  isUpNext
                    ? 'bg-gray-800/60 border-gray-700'
                    : 'bg-gray-950/40 border-gray-800 hover:border-gray-700',
                )}
              >
                {/* Step number */}
                <div
                  className={cn(
                    'shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white',
                    track.colorClass,
                  )}
                >
                  {i + 1}
                </div>

                {/* Emoji + label + progress */}
                <button
                  onClick={() => navigate(track.route)}
                  className="flex items-center gap-2.5 min-w-0 flex-1 text-left"
                >
                  <span className="text-lg shrink-0">{track.emoji}</span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white truncate">{track.label}</span>
                      {isDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                      ) : isUpNext ? (
                        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 rounded px-1.5 py-0.5">
                          Up next
                        </span>
                      ) : null}
                    </span>
                    <span className={cn('text-xs', track.textClass)}>{s.pct}% · {s.completed}/{s.total} topics</span>
                  </span>
                </button>

                {/* Controls */}
                <div className="flex items-center gap-0.5 shrink-0">
                  <button
                    onClick={() => moveUp(track.key)}
                    disabled={i === 0}
                    aria-label={`Move ${track.label} up`}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition-colors"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveDown(track.key)}
                    disabled={i === items.length - 1}
                    aria-label={`Move ${track.label} down`}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition-colors"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => remove(track.key)}
                    aria-label={`Remove ${track.label} from path`}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </li>
            )
          })}

          {/* Up-next call to action */}
          {upNextKey && (
            <li className="pt-1">
              {(() => {
                const t = TRACKS.find(x => x.key === upNextKey)!
                return (
                  <button
                    onClick={() => navigate(t.route)}
                    className={cn(
                      'w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90',
                      t.colorClass,
                    )}
                  >
                    Continue your path — {t.label}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )
              })()}
            </li>
          )}
        </ol>
      )}
    </div>
  )
}
