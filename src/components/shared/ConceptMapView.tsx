import { useState } from 'react'
import { Network, ArrowRight, BookOpen, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ConceptMap, ConceptNode } from '@/types'

type Accent = 'blue' | 'purple' | 'cyan' | 'orange'

interface ConceptMapViewProps {
  conceptMap: ConceptMap
  accentColor: Accent
  onOpenTopic?: (topicId: string) => void
}

const ACCENT: Record<Accent, { text: string; bg: string; border: string; badge: string; dot: string }> = {
  blue:   { text: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/25',   badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30',     dot: 'bg-blue-500' },
  purple: { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/25', badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30', dot: 'bg-purple-500' },
  cyan:   { text: 'text-cyan-400',   bg: 'bg-cyan-500/10',   border: 'border-cyan-500/25',   badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',     dot: 'bg-cyan-500' },
  orange: { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/25', badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30', dot: 'bg-orange-500' },
}

/**
 * ConceptMapView — shows how the big ideas in a course connect. Clusters group
 * related concepts; each concept lists its relationships ("enables", "depends on")
 * so learners see the mental model, not just a flat topic list.
 */
export default function ConceptMapView({ conceptMap, accentColor, onOpenTopic }: ConceptMapViewProps) {
  const a = ACCENT[accentColor]
  const [active, setActive] = useState<ConceptNode | null>(null)

  // Flat lookup for resolving relationship labels
  const allNodes = conceptMap.clusters.flatMap(c => c.concepts)
  const labelOf = (id: string) => allNodes.find(n => n.id === id)?.label ?? id

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
          <Network className={cn('w-5 h-5', a.text)} /> {conceptMap.title}
        </h2>
        <p className="text-sm text-gray-400 max-w-2xl">{conceptMap.intro}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {conceptMap.clusters.map(cluster => (
          <div key={cluster.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className={cn('w-2 h-2 rounded-full', a.dot)} />
              <h3 className="text-sm font-semibold text-white">{cluster.name}</h3>
              <span className="text-[10px] text-gray-600 ml-auto">{cluster.concepts.length}</span>
            </div>
            <div className="space-y-1.5">
              {cluster.concepts.map(node => (
                <button
                  key={node.id}
                  onClick={() => setActive(node)}
                  className="w-full text-left px-3 py-2 rounded-lg bg-gray-950/50 border border-gray-800 hover:border-gray-700 hover:bg-gray-800/50 transition-colors group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-gray-200 font-medium">{node.label}</span>
                    {node.relatesTo && node.relatesTo.length > 0 && (
                      <span className={cn('text-[10px] shrink-0', a.text)}>{node.relatesTo.length} links</span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 leading-snug mt-0.5 line-clamp-1 group-hover:line-clamp-none">
                    {node.summary}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Concept detail drawer */}
      {active && (
        <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-4 bg-black/60" onClick={() => setActive(null)}>
          <div
            className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="text-base font-bold text-white">{active.label}</h3>
              <button onClick={() => setActive(null)} className="text-gray-500 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed mb-4">{active.summary}</p>

            {active.relatesTo && active.relatesTo.length > 0 && (
              <div className="mb-4">
                <p className={cn('text-[11px] font-semibold uppercase tracking-wide mb-2', a.text)}>Connects to</p>
                <div className="space-y-1.5">
                  {active.relatesTo.map((rel, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className="text-gray-500 italic min-w-[5.5rem]">{rel.relation}</span>
                      <ArrowRight className="w-3 h-3 text-gray-600 shrink-0" />
                      <button
                        onClick={() => {
                          const target = allNodes.find(n => n.id === rel.id)
                          if (target) setActive(target)
                        }}
                        className={cn('font-medium hover:underline', a.text)}
                      >
                        {labelOf(rel.id)}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {active.topicId && onOpenTopic && (
              <button
                onClick={() => { onOpenTopic(active.topicId!); setActive(null) }}
                className={cn('w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium border', a.bg, a.border, a.text)}
              >
                <BookOpen className="w-4 h-4" /> Open the lesson
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
