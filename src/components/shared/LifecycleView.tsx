import { useState } from 'react'
import {
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  ArrowRight,
  AlertTriangle,
  Lightbulb,
  MessageSquare,
  Code2,
  CircleDot,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Lifecycle, LifecycleStage } from '@/types'

// ─── Types ─────────────────────────────────────────────────────────────────────

type Accent = 'blue' | 'purple' | 'cyan' | 'orange'

interface LifecycleViewProps {
  lifecycles: Lifecycle[]
  accentColor: Accent
}

// ─── Accent map ────────────────────────────────────────────────────────────────

const ACCENT: Record<Accent, {
  bg: string; border: string; text: string; badge: string
  node: string; line: string; ring: string
}> = {
  blue: {
    bg: 'bg-blue-500/10', border: 'border-blue-500/25', text: 'text-blue-400',
    badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    node: 'bg-blue-500', line: 'bg-blue-500/30', ring: 'ring-blue-500/40',
  },
  purple: {
    bg: 'bg-purple-500/10', border: 'border-purple-500/25', text: 'text-purple-400',
    badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    node: 'bg-purple-500', line: 'bg-purple-500/30', ring: 'ring-purple-500/40',
  },
  cyan: {
    bg: 'bg-cyan-500/10', border: 'border-cyan-500/25', text: 'text-cyan-400',
    badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    node: 'bg-cyan-500', line: 'bg-cyan-500/30', ring: 'ring-cyan-500/40',
  },
  orange: {
    bg: 'bg-orange-500/10', border: 'border-orange-500/25', text: 'text-orange-400',
    badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    node: 'bg-orange-500', line: 'bg-orange-500/30', ring: 'ring-orange-500/40',
  },
}

// ─── Stage node ────────────────────────────────────────────────────────────────

/** One expandable stage in the vertical lifecycle flow. */
function StageNode({
  stage,
  index,
  total,
  accent,
  isCyclic,
}: {
  stage: LifecycleStage
  index: number
  total: number
  accent: Accent
  isCyclic: boolean
}) {
  const [open, setOpen] = useState(false)
  const a = ACCENT[accent]
  const isLast = index === total - 1
  const hasDetail =
    stage.details.length > 0 || !!stage.code || (stage.gotchas?.length ?? 0) > 0

  return (
    <div className="flex gap-4">
      {/* Rail: numbered node + connector line */}
      <div className="flex flex-col items-center shrink-0">
        <div
          className={cn(
            'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg',
            a.node,
          )}
        >
          {index + 1}
        </div>
        {!isLast && <div className={cn('w-0.5 flex-1 min-h-[1.5rem] my-1', a.line)} />}
        {isLast && isCyclic && (
          <div className="flex flex-col items-center mt-1">
            <div className={cn('w-0.5 h-4', a.line)} />
            <RefreshCw className={cn('w-4 h-4', a.text)} />
          </div>
        )}
      </div>

      {/* Card */}
      <div className="flex-1 min-w-0 pb-4">
        <button
          onClick={() => hasDetail && setOpen(o => !o)}
          className={cn(
            'w-full text-left rounded-xl border bg-gray-900 border-gray-800 transition-colors',
            hasDetail && 'hover:border-gray-700 hover:bg-gray-800/50 cursor-pointer',
            'p-4',
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="text-sm font-semibold text-white">{stage.name}</h3>
                {stage.durationHint && (
                  <span className={cn('text-[10px] font-mono px-1.5 py-0.5 rounded border', a.badge)}>
                    {stage.durationHint}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{stage.description}</p>
            </div>
            {hasDetail && (
              <ChevronDown
                className={cn('w-4 h-4 text-gray-500 shrink-0 transition-transform mt-0.5', open && 'rotate-180')}
              />
            )}
          </div>

          {open && hasDetail && (
            <div className="mt-4 space-y-4" onClick={e => e.stopPropagation()}>
              {/* Details */}
              {stage.details.length > 0 && (
                <ul className="space-y-1.5">
                  {stage.details.map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-300 leading-relaxed">
                      <CircleDot className={cn('w-3 h-3 shrink-0 mt-0.5', a.text)} />
                      {d}
                    </li>
                  ))}
                </ul>
              )}

              {/* Code */}
              {stage.code && (
                <div className="rounded-lg overflow-hidden border border-gray-800">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-950 border-b border-gray-800">
                    <Code2 className="w-3 h-3 text-gray-500" />
                    <span className="text-[10px] font-mono text-gray-400">{stage.code.label}</span>
                  </div>
                  <pre className="p-3 bg-gray-950 overflow-x-auto text-xs text-gray-300 font-mono leading-relaxed">
                    <code>{stage.code.code}</code>
                  </pre>
                </div>
              )}

              {/* Gotchas */}
              {stage.gotchas && stage.gotchas.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <AlertTriangle className="w-3 h-3 text-red-400" />
                    <span className="text-[11px] font-semibold text-red-400 uppercase tracking-wide">
                      Watch out
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {stage.gotchas.map((g, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-300 leading-relaxed">
                        <span className="mt-1 shrink-0 w-1 h-1 rounded-full bg-red-400" />
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </button>
      </div>
    </div>
  )
}

// ─── Lifecycle detail ──────────────────────────────────────────────────────────

/** Full detail view for one selected lifecycle. */
function LifecycleDetail({
  lifecycle,
  accent,
  onBack,
}: {
  lifecycle: Lifecycle
  accent: Accent
  onBack: () => void
}) {
  const a = ACCENT[accent]
  const isCyclic = lifecycle.flow === 'cyclic'

  return (
    <div className="space-y-6 pb-12">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        All Lifecycles
      </button>

      {/* Hero */}
      <div className={cn('rounded-2xl p-6 border', a.bg, a.border)}>
        <div className="flex items-start gap-4">
          <div className="text-4xl shrink-0">{lifecycle.icon}</div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1', a.badge)}>
                {isCyclic ? <RefreshCw className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                {isCyclic ? 'Cyclic flow' : 'Linear flow'}
              </span>
              <span className="text-xs text-gray-500">{lifecycle.stages.length} stages</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white leading-snug mb-2">{lifecycle.title}</h1>
            <p className="text-sm text-gray-300 leading-relaxed">{lifecycle.overview}</p>
          </div>
        </div>
      </div>

      {/* Flow */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-semibold text-white">The Flow</span>
          <span className="text-xs text-gray-500">tap any stage to expand</span>
        </div>
        <div>
          {lifecycle.stages.map((stage, i) => (
            <StageNode
              key={i}
              stage={stage}
              index={i}
              total={lifecycle.stages.length}
              accent={accent}
              isCyclic={isCyclic}
            />
          ))}
          {isCyclic && (
            <p className={cn('text-xs italic ml-13 pl-1', a.text)}>
              ↻ Loops back to stage 1 — this is a continuous cycle, not a one-time flow.
            </p>
          )}
        </div>
      </div>

      {/* Key takeaways */}
      {lifecycle.keyTakeaways.length > 0 && (
        <section className={cn('rounded-xl p-5 border', a.bg, a.border)}>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className={cn('w-4 h-4', a.text)} />
            <h2 className={cn('text-sm font-semibold', a.text)}>Key Takeaways</h2>
          </div>
          <ul className="space-y-2">
            {lifecycle.keyTakeaways.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300 leading-relaxed">
                <span className={cn('mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full', a.node)} />
                {t}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Interview notes */}
      {lifecycle.interviewNotes.length > 0 && (
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className={cn('w-4 h-4', a.text)} />
            <h2 className={cn('text-sm font-semibold', a.text)}>Interview Notes</h2>
          </div>
          <ul className="space-y-2">
            {lifecycle.interviewNotes.map((n, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300 leading-relaxed">
                <span className="shrink-0 text-gray-500 font-mono text-xs mt-0.5">Q.</span>
                {n}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

// ─── Lifecycle card ────────────────────────────────────────────────────────────

/** Card in the lifecycle list view. */
function LifecycleCard({
  lifecycle,
  accent,
  onClick,
}: {
  lifecycle: Lifecycle
  accent: Accent
  onClick: () => void
}) {
  const a = ACCENT[accent]
  const isCyclic = lifecycle.flow === 'cyclic'

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-2xl p-5 transition-all hover:bg-gray-800/50 group"
    >
      <div className="flex items-start gap-3 mb-3">
        <span className="text-3xl shrink-0">{lifecycle.icon}</span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-white leading-snug mb-0.5">{lifecycle.title}</h3>
          <p className="text-xs text-gray-500">{lifecycle.subtitle}</p>
        </div>
      </div>

      {/* Mini stage preview */}
      <div className="flex items-center gap-1 flex-wrap mb-3">
        {lifecycle.stages.slice(0, 5).map((s, i) => (
          <span key={i} className="flex items-center gap-1">
            <span className={cn('text-[10px] px-1.5 py-0.5 rounded border', a.badge)}>
              {s.shortLabel}
            </span>
            {i < Math.min(lifecycle.stages.length, 5) - 1 && (
              <ChevronRight className="w-3 h-3 text-gray-600" />
            )}
          </span>
        ))}
        {lifecycle.stages.length > 5 && (
          <span className="text-[10px] text-gray-500 ml-1">+{lifecycle.stages.length - 5} more</span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className={cn('flex items-center gap-1 text-[11px] font-medium', a.text)}>
          {isCyclic ? <RefreshCw className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
          {lifecycle.stages.length} stages · {isCyclic ? 'cyclic' : 'linear'}
        </span>
        <ChevronRight className={cn('w-4 h-4 transition-transform group-hover:translate-x-0.5', a.text)} />
      </div>
    </button>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

/**
 * LifecycleView — renders course-specific lifecycles (widget lifecycle,
 * request lifecycle, ML model lifecycle, etc.) as interactive visual flows.
 */
export default function LifecycleView({ lifecycles, accentColor }: LifecycleViewProps) {
  const [selected, setSelected] = useState<Lifecycle | null>(null)

  if (selected) {
    return (
      <LifecycleDetail
        lifecycle={selected}
        accent={accentColor}
        onBack={() => setSelected(null)}
      />
    )
  }

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-lg font-bold text-white mb-1">Lifecycles</h2>
        <p className="text-sm text-gray-400">
          The essential lifecycles every engineer must know cold — visualized stage by stage,
          with the gotchas that trip people up and the interview questions that test them.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lifecycles.map(lc => (
          <LifecycleCard
            key={lc.id}
            lifecycle={lc}
            accent={accentColor}
            onClick={() => setSelected(lc)}
          />
        ))}
      </div>
    </div>
  )
}
