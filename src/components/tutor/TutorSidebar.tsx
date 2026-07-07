import { useState, useMemo, useCallback } from 'react'
import { CheckCircle2, Circle, Minus, ChevronDown, ChevronRight, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import type { CurriculumTopic, TrackKey, TopicStatus } from '@/types'

interface TutorSidebarProps {
  topics: CurriculumTopic[]
  activeTopic: CurriculumTopic | null
  onSelect: (topic: CurriculumTopic) => void
  track: TrackKey
  progress: Record<string, string>
}

const TRACK_ACCENT: Record<TrackKey, string> = {
  backend: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  ai:      'text-purple-400 bg-purple-500/10 border-purple-500/30',
  flutter: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
  react:   'text-orange-400 bg-orange-500/10 border-orange-500/30',
  aiml:    'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  mobile:  'text-rose-400 bg-rose-500/10 border-rose-500/30',
}

const TRACK_ACTIVE: Record<TrackKey, string> = {
  backend: 'bg-blue-500/15 border-l-2 border-blue-400',
  ai:      'bg-purple-500/15 border-l-2 border-purple-400',
  flutter: 'bg-cyan-500/15 border-l-2 border-cyan-400',
  react:   'bg-orange-500/15 border-l-2 border-orange-400',
  aiml:    'bg-emerald-500/15 border-l-2 border-emerald-400',
  mobile:  'bg-rose-500/15 border-l-2 border-rose-400',
}

/** Renders a status icon for a topic based on its completion status. */
const StatusIcon = ({ status }: { status: TopicStatus }) => {
  if (status === 'completed')
    return <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
  if (status === 'in-progress')
    return <Circle className="h-4 w-4 text-yellow-400 shrink-0" />
  return <Minus className="h-4 w-4 text-gray-600 shrink-0" />
}

/**
 * TutorSidebar — collapsible topic navigation sidebar grouped by phase.
 * Supports live search/filter and highlights the currently active topic.
 */
export default function TutorSidebar({
  topics,
  activeTopic,
  onSelect,
  track,
  progress,
}: TutorSidebarProps) {
  const [query, setQuery] = useState('')
  const [collapsedPhases, setCollapsedPhases] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return topics
    return topics.filter(t => t.title.toLowerCase().includes(q) || t.phaseName.toLowerCase().includes(q))
  }, [topics, query])

  const grouped = useMemo(() => {
    const map = new Map<string, CurriculumTopic[]>()
    for (const t of filtered) {
      const existing = map.get(t.phaseName) ?? []
      existing.push(t)
      map.set(t.phaseName, existing)
    }
    return map
  }, [filtered])

  const togglePhase = useCallback((phaseName: string) => {
    setCollapsedPhases(prev => {
      const next = new Set(prev)
      if (next.has(phaseName)) next.delete(phaseName)
      else next.add(phaseName)
      return next
    })
  }, [])

  const accentClass = TRACK_ACCENT[track]

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Search */}
      <div className="p-3 border-b border-gray-800">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search topics…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="pl-8 bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 h-9 text-sm"
          />
        </div>
      </div>

      {/* Topic List */}
      <ScrollArea className="flex-1">
        <div className="py-2">
          {grouped.size === 0 && (
            <p className="px-4 py-8 text-center text-sm text-gray-500">No topics found.</p>
          )}
          {Array.from(grouped.entries()).map(([phaseName, phaseTopics]) => {
            const isCollapsed = collapsedPhases.has(phaseName)
            const completedCount = phaseTopics.filter(
              t => (progress[t.id] as TopicStatus) === 'completed'
            ).length

            return (
              <div key={phaseName}>
                {/* Phase header */}
                <button
                  onClick={() => togglePhase(phaseName)}
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-800/50 transition-colors group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {isCollapsed
                      ? <ChevronRight className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                      : <ChevronDown className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                    }
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider truncate">
                      {phaseName}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn('text-xs shrink-0 ml-2', accentClass)}
                  >
                    {completedCount}/{phaseTopics.length}
                  </Badge>
                </button>

                {/* Topics */}
                {!isCollapsed && phaseTopics.map(topic => {
                  const status = (progress[topic.id] as TopicStatus) ?? 'not-started'
                  const isActive = activeTopic?.id === topic.id

                  return (
                    <button
                      key={topic.id}
                      onClick={() => onSelect(topic)}
                      className={cn(
                        'w-full flex items-center gap-2.5 px-4 py-2.5 text-left hover:bg-gray-800/60 transition-colors',
                        isActive ? TRACK_ACTIVE[track] : ''
                      )}
                    >
                      <StatusIcon status={status} />
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          'text-sm leading-snug truncate',
                          isActive ? 'text-white font-medium' : 'text-gray-300'
                        )}>
                          {topic.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{topic.estimatedMins} min</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
