import { useState, useMemo } from 'react'
import { ArrowLeft, ChevronRight, GitCompare, Scale, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Comparison } from '@/types'

type Accent = 'blue' | 'purple' | 'cyan' | 'orange' | 'emerald' | 'amber'

interface ComparisonViewProps {
  comparisons: Comparison[]
  accentColor: Accent
}

const ACCENT: Record<Accent, { text: string; bg: string; border: string; badge: string; solid: string }> = {
  blue:   { text: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/25',   badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30',     solid: 'bg-blue-500' },
  purple: { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/25', badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30', solid: 'bg-purple-500' },
  cyan:   { text: 'text-cyan-400',   bg: 'bg-cyan-500/10',   border: 'border-cyan-500/25',   badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',     solid: 'bg-cyan-500' },
  orange: { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/25', badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30', solid: 'bg-orange-500' },
  emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', solid: 'bg-emerald-500' },
  amber: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/25', badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30', solid: 'bg-amber-500' },
}

/** Full comparison table + verdict. */
function ComparisonDetail({ c, accent, onBack }: { c: Comparison; accent: Accent; onBack: () => void }) {
  const a = ACCENT[accent]
  return (
    <div className="space-y-6 pb-12">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" /> All Comparisons
      </button>

      <div>
        <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full border', a.badge)}>{c.category}</span>
        <h1 className="text-xl sm:text-2xl font-bold text-white mt-2">{c.title}</h1>
        <p className="text-sm text-gray-400 mt-1">{c.subtitle}</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full border-collapse text-sm min-w-[560px]">
          <thead>
            <tr className="bg-gray-900">
              <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-800 sticky left-0 bg-gray-900">
                Dimension
              </th>
              {c.contenders.map(name => (
                <th key={name} className={cn('text-left p-3 text-sm font-bold border-b border-gray-800', a.text)}>
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {c.rows.map((row, i) => (
              <tr key={i} className={i % 2 ? 'bg-gray-900/40' : ''}>
                <td className="p-3 text-xs font-semibold text-gray-300 align-top border-b border-gray-800/60 sticky left-0 bg-inherit">
                  {row.dimension}
                </td>
                {row.values.map((v, j) => (
                  <td key={j} className="p-3 text-xs text-gray-400 align-top leading-relaxed border-b border-gray-800/60">
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* When to use */}
      <div>
        <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Scale className={cn('w-4 h-4', a.text)} /> When to use which
        </h2>
        <div className="space-y-2">
          {c.whenToUse.map((w, i) => (
            <div key={i} className="flex items-start gap-3 bg-gray-900 border border-gray-800 rounded-lg p-3">
              <span className={cn('text-xs font-bold px-2 py-0.5 rounded border shrink-0', a.badge)}>{w.choice}</span>
              <p className="text-sm text-gray-300 leading-relaxed">{w.when}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Verdict */}
      <div className={cn('rounded-xl p-5 border', a.bg, a.border)}>
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className={cn('w-4 h-4', a.text)} />
          <span className={cn('text-sm font-semibold', a.text)}>Bottom line</span>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">{c.verdict}</p>
      </div>
    </div>
  )
}

/**
 * ComparisonView — the "X vs Y" standard comparisons every engineer is expected
 * to reason about (REST vs GraphQL, SQL vs NoSQL, WebSockets vs SSE, …).
 */
export default function ComparisonView({ comparisons, accentColor }: ComparisonViewProps) {
  const [selected, setSelected] = useState<Comparison | null>(null)
  const a = ACCENT[accentColor]

  const grouped = useMemo(() => {
    const map = new Map<string, Comparison[]>()
    for (const c of comparisons) {
      if (!map.has(c.category)) map.set(c.category, [])
      map.get(c.category)!.push(c)
    }
    return [...map.entries()]
  }, [comparisons])

  if (selected) return <ComparisonDetail c={selected} accent={accentColor} onBack={() => setSelected(null)} />

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
          <GitCompare className={cn('w-5 h-5', a.text)} /> Comparisons
        </h2>
        <p className="text-sm text-gray-400 max-w-xl">
          Side-by-side breakdowns of the choices you&apos;ll defend in interviews and design reviews —
          with a clear &quot;when to use which&quot; verdict for each.
        </p>
      </div>

      {grouped.map(([category, items]) => (
        <div key={category}>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {items.map(c => (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className="text-left bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-4 transition-all hover:bg-gray-800/50 group"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-white">{c.title}</h4>
                  <ChevronRight className={cn('w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5', a.text)} />
                </div>
                <p className="text-xs text-gray-400 leading-relaxed mb-2">{c.subtitle}</p>
                <div className="flex flex-wrap gap-1">
                  {c.contenders.map(name => (
                    <span key={name} className={cn('text-[10px] px-1.5 py-0.5 rounded border', a.badge)}>{name}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
