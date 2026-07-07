import { useMemo } from 'react'
import { CheckCircle2, Circle, Minus, Trophy } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import type { CurriculumTopic, TrackKey, TopicStatus } from '@/types'

interface RoadmapViewProps {
  topics: CurriculumTopic[]
  progress: Record<string, string>
  track: TrackKey
}

interface PhaseGroup {
  name: string
  phase: number
  topics: CurriculumTopic[]
  completed: number
  total: number
  pct: number
}

const TRACK_ACCENT: Record<TrackKey, { ring: string; bar: string; header: string; dot: string }> = {
  backend: {
    ring:   'ring-blue-500/40',
    bar:    'bg-blue-500',
    header: 'bg-blue-500/10 border-blue-500/30',
    dot:    'bg-blue-500',
  },
  ai: {
    ring:   'ring-purple-500/40',
    bar:    'bg-purple-500',
    header: 'bg-purple-500/10 border-purple-500/30',
    dot:    'bg-purple-500',
  },
  flutter: {
    ring:   'ring-cyan-500/40',
    bar:    'bg-cyan-500',
    header: 'bg-cyan-500/10 border-cyan-500/30',
    dot:    'bg-cyan-500',
  },
  react: {
    ring:   'ring-orange-500/40',
    bar:    'bg-orange-500',
    header: 'bg-orange-500/10 border-orange-500/30',
    dot:    'bg-orange-500',
  },
  aiml: {
    ring:   'ring-emerald-500/40',
    bar:    'bg-emerald-500',
    header: 'bg-emerald-500/10 border-emerald-500/30',
    dot:    'bg-emerald-500',
  },
  mobile: {
    ring:   'ring-amber-500/40',
    bar:    'bg-amber-500',
    header: 'bg-amber-500/10 border-amber-500/30',
    dot:    'bg-amber-500',
  },
}

/** Returns the status icon element for a topic. */
const TopicStatusIcon = ({ status }: { status: TopicStatus }) => {
  if (status === 'completed')
    return <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
  if (status === 'in-progress')
    return <Circle className="h-4 w-4 text-yellow-400 shrink-0" />
  return <Minus className="h-4 w-4 text-gray-700 shrink-0" />
}

/**
 * RoadmapView — vertical timeline of all phases showing per-phase progress bars
 * and individual topic statuses. Highlights the current active phase and
 * displays overall completion at the top.
 */
export default function RoadmapView({ topics, progress, track }: RoadmapViewProps) {
  const accent = TRACK_ACCENT[track]

  const phases = useMemo<PhaseGroup[]>(() => {
    const map = new Map<string, PhaseGroup>()
    for (const t of topics) {
      if (!map.has(t.phaseName)) {
        map.set(t.phaseName, {
          name: t.phaseName,
          phase: t.phase,
          topics: [],
          completed: 0,
          total: 0,
          pct: 0,
        })
      }
      const group = map.get(t.phaseName)!
      group.topics.push(t)
      group.total += 1
      const status = (progress[t.id] as TopicStatus) ?? 'not-started'
      if (status === 'completed') group.completed += 1
    }

    return Array.from(map.values()).map(g => ({
      ...g,
      pct: g.total > 0 ? Math.round((g.completed / g.total) * 100) : 0,
    }))
  }, [topics, progress])

  const overall = useMemo(() => {
    const total = topics.length
    const completed = topics.filter(t => (progress[t.id] as TopicStatus) === 'completed').length
    return { total, completed, pct: total > 0 ? Math.round((completed / total) * 100) : 0 }
  }, [topics, progress])

  // Active phase = first phase with incomplete topics
  const activePhaseIndex = useMemo(() => {
    const idx = phases.findIndex(p => p.pct < 100)
    return idx === -1 ? phases.length - 1 : idx
  }, [phases])

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Overall progress */}
      <div className={cn('rounded-xl border p-5 space-y-3', accent.header)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-400" />
            <span className="font-semibold text-white text-sm">Overall Progress</span>
          </div>
          <Badge className="bg-gray-900/60 text-white border-gray-700 text-sm font-bold">
            {overall.pct}%
          </Badge>
        </div>
        <Progress value={overall.pct} className="h-2.5 bg-gray-800" />
        <p className="text-xs text-gray-400">
          {overall.completed} of {overall.total} topics completed
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-800" />

        <div className="space-y-6">
          {phases.map((phase, i) => {
            const isActive = i === activePhaseIndex
            const isDone = phase.pct === 100

            return (
              <div key={phase.name} className="relative pl-10">
                {/* Phase dot */}
                <div
                  className={cn(
                    'absolute left-0 top-4 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all',
                    isDone
                      ? 'bg-green-600 border-green-500 text-white'
                      : isActive
                        ? cn('border-2 ring-2', accent.ring, 'bg-gray-900 border-gray-600')
                        : 'bg-gray-900 border-gray-700'
                  )}
                >
                  {isDone ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <span className={cn(
                      'text-xs font-bold',
                      isActive ? 'text-white' : 'text-gray-600'
                    )}>
                      {phase.phase}
                    </span>
                  )}
                </div>

                {/* Phase card */}
                <div
                  className={cn(
                    'rounded-xl border p-4 space-y-3 transition-all',
                    isActive
                      ? cn('border-2 ring-1', accent.ring, 'border-gray-700 bg-gray-900/80')
                      : 'border-gray-800 bg-gray-900/40'
                  )}
                >
                  {/* Phase header */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className={cn(
                        'font-semibold text-sm truncate',
                        isActive ? 'text-white' : 'text-gray-300'
                      )}>
                        {phase.name}
                      </p>
                      {isActive && (
                        <Badge variant="outline" className="mt-1 text-xs bg-transparent border-gray-700 text-gray-400">
                          Current Phase
                        </Badge>
                      )}
                    </div>
                    <span className={cn(
                      'text-xs shrink-0 font-medium',
                      isDone ? 'text-green-400' : isActive ? 'text-white' : 'text-gray-500'
                    )}>
                      {phase.completed}/{phase.total}
                    </span>
                  </div>

                  {/* Phase progress bar */}
                  <Progress value={phase.pct} className="h-1.5 bg-gray-800" />

                  {/* Topics list */}
                  <ul className="space-y-1.5">
                    {phase.topics.map(topic => {
                      const status = (progress[topic.id] as TopicStatus) ?? 'not-started'
                      return (
                        <li key={topic.id} className="flex items-center gap-2.5">
                          <TopicStatusIcon status={status} />
                          <span className={cn(
                            'text-xs leading-snug',
                            status === 'completed'
                              ? 'text-gray-500 line-through'
                              : status === 'in-progress'
                                ? 'text-yellow-300'
                                : 'text-gray-400'
                          )}>
                            {topic.title}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
