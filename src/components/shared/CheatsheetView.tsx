import { useState } from 'react'
import { ArrowLeft, ChevronRight, ScrollText, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Cheatsheet } from '@/types'

type Accent = 'blue' | 'purple' | 'cyan' | 'orange'

interface CheatsheetViewProps {
  cheatsheets: Cheatsheet[]
  accentColor: Accent
}

const ACCENT: Record<Accent, { text: string; bg: string; border: string; badge: string }> = {
  blue:   { text: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/25',   badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  purple: { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/25', badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  cyan:   { text: 'text-cyan-400',   bg: 'bg-cyan-500/10',   border: 'border-cyan-500/25',   badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  orange: { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/25', badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
}

/** A single cheat sheet with searchable sections. */
function CheatsheetDetail({ sheet, accent, onBack }: { sheet: Cheatsheet; accent: Accent; onBack: () => void }) {
  const a = ACCENT[accent]
  const [q, setQ] = useState('')
  const query = q.trim().toLowerCase()

  const sections = query
    ? sheet.sections
        .map(s => ({
          ...s,
          entries: s.entries.filter(
            e => e.label.toLowerCase().includes(query) || e.value.toLowerCase().includes(query),
          ),
        }))
        .filter(s => s.entries.length > 0)
    : sheet.sections

  return (
    <div className="space-y-5 pb-12">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" /> All Cheat Sheets
      </button>

      <div className="flex items-start gap-3">
        <span className="text-3xl">{sheet.icon}</span>
        <div>
          <h1 className="text-xl font-bold text-white">{sheet.title}</h1>
          <p className="text-sm text-gray-400">{sheet.subtitle}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Filter this cheat sheet…"
          className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-gray-700"
        />
      </div>

      {sections.length === 0 && <p className="text-sm text-gray-500">No entries match “{q}”.</p>}

      <div className="space-y-5">
        {sections.map((section, i) => (
          <div key={i}>
            <h2 className={cn('text-xs font-semibold uppercase tracking-wide mb-2', a.text)}>{section.heading}</h2>
            <div className="rounded-xl border border-gray-800 overflow-hidden divide-y divide-gray-800/70">
              {section.entries.map((e, j) => (
                <div key={j} className="flex items-start gap-3 px-3 py-2 hover:bg-gray-900/60">
                  <span className={cn(
                    'text-xs font-semibold shrink-0 min-w-[7rem] max-w-[11rem]',
                    'font-mono', a.text,
                  )}>
                    {e.label}
                  </span>
                  {e.code ? (
                    <code className="text-xs text-gray-300 font-mono bg-gray-950 px-1.5 py-0.5 rounded break-all">{e.value}</code>
                  ) : (
                    <span className="text-xs text-gray-400 leading-relaxed">{e.value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * CheatsheetView — quick-reference sheets (status codes, CLI commands, syntax)
 * with in-sheet search. The thing you keep open in a second tab during an interview.
 */
export default function CheatsheetView({ cheatsheets, accentColor }: CheatsheetViewProps) {
  const [selected, setSelected] = useState<Cheatsheet | null>(null)
  const a = ACCENT[accentColor]

  if (selected) return <CheatsheetDetail sheet={selected} accent={accentColor} onBack={() => setSelected(null)} />

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
          <ScrollText className={cn('w-5 h-5', a.text)} /> Cheat Sheets
        </h2>
        <p className="text-sm text-gray-400 max-w-xl">
          Dense, searchable quick-reference for the commands, syntax, and rules you look up constantly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {cheatsheets.map(sheet => (
          <button
            key={sheet.id}
            onClick={() => setSelected(sheet)}
            className="text-left bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-4 transition-all hover:bg-gray-800/50 group flex items-center gap-3"
          >
            <span className="text-2xl shrink-0">{sheet.icon}</span>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold text-white">{sheet.title}</h4>
              <p className="text-xs text-gray-400 truncate">{sheet.subtitle}</p>
              <span className="text-[10px] text-gray-600">{sheet.sections.length} sections</span>
            </div>
            <ChevronRight className={cn('w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5', a.text)} />
          </button>
        ))}
      </div>
    </div>
  )
}
