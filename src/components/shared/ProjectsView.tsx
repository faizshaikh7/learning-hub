import { useState, useMemo, useCallback } from 'react'
import {
  ArrowLeft,
  ChevronRight,
  Hammer,
  CalendarDays,
  Clock,
  CheckCircle2,
  Circle,
  Lightbulb,
  Target,
  Rocket,
  ListChecks,
  BookOpen,
  Flame,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Project, DailyChallenge, ProjectsBank } from '@/types'
import { getDoneChallenges, toggleDoneChallenge } from '@/lib/storage'

type Accent = 'blue' | 'purple' | 'cyan' | 'orange'

interface ProjectsViewProps {
  bank: ProjectsBank
  accentColor: Accent
  onOpenTopic?: (topicId: string) => void
}

const ACCENT: Record<Accent, { text: string; bg: string; border: string; badge: string; solid: string }> = {
  blue:   { text: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/25',   badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30',     solid: 'bg-blue-500 hover:bg-blue-600' },
  purple: { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/25', badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30', solid: 'bg-purple-500 hover:bg-purple-600' },
  cyan:   { text: 'text-cyan-400',   bg: 'bg-cyan-500/10',   border: 'border-cyan-500/25',   badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',     solid: 'bg-cyan-500 hover:bg-cyan-600' },
  orange: { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/25', badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30', solid: 'bg-orange-500 hover:bg-orange-600' },
}

const DIFF_COLOR: Record<string, string> = {
  beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
  intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  advanced: 'bg-red-500/20 text-red-400 border-red-500/30',
  easy: 'bg-green-500/20 text-green-400 border-green-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  hard: 'bg-red-500/20 text-red-400 border-red-500/30',
}

/** Day-of-year index so the "today" challenge is stable for the whole day. */
function dayOfYear(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  return Math.floor((now.getTime() - start.getTime()) / 86400000)
}

// ─── Project detail ─────────────────────────────────────────────────────────────

function ProjectDetail({ project, accent, onBack, onOpenTopic }: {
  project: Project; accent: Accent; onBack: () => void; onOpenTopic?: (id: string) => void
}) {
  const a = ACCENT[accent]
  return (
    <div className="space-y-6 pb-12">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" /> All Projects
      </button>

      <div className={cn('rounded-2xl p-6 border', a.bg, a.border)}>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full border capitalize', DIFF_COLOR[project.difficulty])}>
            {project.difficulty}
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {project.estimatedTime}</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">{project.title}</h1>
        <p className={cn('text-sm mt-1', a.text)}>{project.tagline}</p>
        <p className="text-sm text-gray-300 leading-relaxed mt-3">{project.description}</p>
      </div>

      {/* Tech stack */}
      <div>
        <h2 className="text-sm font-semibold text-white mb-2">Tech stack</h2>
        <div className="flex flex-wrap gap-2">
          {project.techStack.map(t => (
            <span key={t} className="px-2.5 py-1 rounded-lg bg-gray-800 border border-gray-700 text-xs text-gray-300 font-mono">{t}</span>
          ))}
        </div>
      </div>

      {/* What you learn */}
      <div className={cn('rounded-xl p-5 border', a.bg, a.border)}>
        <h2 className={cn('text-sm font-semibold mb-2 flex items-center gap-2', a.text)}><Target className="w-4 h-4" /> What you\'ll learn</h2>
        <ul className="space-y-1.5">
          {project.whatYouLearn.map((w, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-300"><CheckCircle2 className={cn('w-4 h-4 shrink-0 mt-0.5', a.text)} /> {w}</li>
          ))}
        </ul>
      </div>

      {/* Core features */}
      <div>
        <h2 className="text-sm font-semibold text-white mb-2 flex items-center gap-2"><ListChecks className={cn('w-4 h-4', a.text)} /> Core features (MVP)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {project.features.map((f, i) => (
            <div key={i} className="flex items-start gap-2 bg-gray-900 border border-gray-800 rounded-lg p-2.5 text-sm text-gray-300">
              <Circle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gray-600" /> {f}
            </div>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div>
        <h2 className="text-sm font-semibold text-white mb-3">Build roadmap</h2>
        <div className="space-y-3">
          {project.milestones.map((m, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center shrink-0">
                <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white', a.solid.split(' ')[0])}>{i + 1}</div>
                {i < project.milestones.length - 1 && <div className="w-0.5 flex-1 bg-gray-800 my-1" />}
              </div>
              <div className="flex-1 pb-2">
                <h3 className="text-sm font-semibold text-white mb-1.5">{m.title}</h3>
                <ul className="space-y-1">
                  {m.tasks.map((t, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-gray-400"><span className="mt-1.5 w-1 h-1 rounded-full bg-gray-600 shrink-0" /> {t}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stretch goals */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-white mb-2 flex items-center gap-2"><Rocket className={cn('w-4 h-4', a.text)} /> Stretch goals</h2>
        <ul className="space-y-1.5">
          {project.stretchGoals.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-400"><span className={cn('mt-1.5 w-1.5 h-1.5 rounded-full shrink-0', a.solid.split(' ')[0])} /> {s}</li>
          ))}
        </ul>
      </div>

      {project.relevantTopics.length > 0 && onOpenTopic && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-gray-500 self-center">Related lessons:</span>
          {project.relevantTopics.map(tid => (
            <button key={tid} onClick={() => onOpenTopic(tid)} className="text-xs px-2.5 py-1 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> {tid}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Daily challenge card ────────────────────────────────────────────────────────

function ChallengeCard({ challenge, accent, done, onToggle, onOpenTopic, featured }: {
  challenge: DailyChallenge; accent: Accent; done: boolean
  onToggle: () => void; onOpenTopic?: (id: string) => void; featured?: boolean
}) {
  const a = ACCENT[accent]
  const [showHint, setShowHint] = useState(false)
  return (
    <div className={cn('rounded-xl border p-4', featured ? cn(a.bg, a.border) : 'bg-gray-900 border-gray-800')}>
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        {featured && <span className={cn('text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded border', a.badge)}>Today</span>}
        <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded border capitalize', DIFF_COLOR[challenge.difficulty])}>{challenge.difficulty}</span>
        <span className="text-[11px] text-gray-500">{challenge.focus}</span>
      </div>
      <h3 className="text-sm font-semibold text-white mb-1">{challenge.title}</h3>
      <p className="text-sm text-gray-300 leading-relaxed mb-3">{challenge.prompt}</p>

      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={() => setShowHint(h => !h)} className="text-xs px-2.5 py-1 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 flex items-center gap-1">
          <Lightbulb className="w-3 h-3" /> {showHint ? 'Hide hint' : 'Hint'}
        </button>
        {challenge.topicId && onOpenTopic && (
          <button onClick={() => onOpenTopic(challenge.topicId!)} className="text-xs px-2.5 py-1 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 flex items-center gap-1">
            <BookOpen className="w-3 h-3" /> Lesson
          </button>
        )}
        <button
          onClick={onToggle}
          className={cn('ml-auto text-xs px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-colors',
            done ? 'border-green-500/30 text-green-400 bg-green-500/10' : cn('text-white border-transparent', a.solid))}
        >
          {done ? <><CheckCircle2 className="w-3.5 h-3.5" /> Done</> : <><Circle className="w-3.5 h-3.5" /> Mark done</>}
        </button>
      </div>
      {showHint && (
        <div className="mt-3 pt-3 border-t border-gray-800 text-xs text-gray-400 leading-relaxed">
          <span className={cn('font-semibold', a.text)}>Hint: </span>{challenge.hint}
        </div>
      )}
    </div>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────────

type SubTab = 'projects' | 'daily'

/**
 * ProjectsView — real-world build projects plus a Daily Challenges subtab that
 * surfaces a fresh bite-size problem each day for active recall.
 */
export default function ProjectsView({ bank, accentColor, onOpenTopic }: ProjectsViewProps) {
  const a = ACCENT[accentColor]
  const [sub, setSub] = useState<SubTab>('projects')
  const [selected, setSelected] = useState<Project | null>(null)
  const [done, setDone] = useState<string[]>(() => getDoneChallenges())

  const toggle = useCallback((id: string) => setDone(toggleDoneChallenge(id)), [])

  const todaysChallenge = useMemo(() => {
    if (!bank.dailyChallenges.length) return null
    return bank.dailyChallenges[dayOfYear() % bank.dailyChallenges.length]
  }, [bank.dailyChallenges])

  const doneCount = bank.dailyChallenges.filter(c => done.includes(c.id)).length

  if (selected) return <ProjectDetail project={selected} accent={accentColor} onBack={() => setSelected(null)} onOpenTopic={onOpenTopic} />

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
          <Hammer className={cn('w-5 h-5', a.text)} /> Build & Practice
        </h2>
        <p className="text-sm text-gray-400 max-w-xl">
          Real-world projects to build for your portfolio, plus a fresh daily challenge to keep the concepts sharp.
        </p>
      </div>

      {/* Subtabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setSub('projects')}
          className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
            sub === 'projects' ? a.badge : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60')}
        >
          <Hammer className="w-4 h-4" /> Projects ({bank.projects.length})
        </button>
        <button
          onClick={() => setSub('daily')}
          className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
            sub === 'daily' ? a.badge : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60')}
        >
          <CalendarDays className="w-4 h-4" /> Daily Challenges
        </button>
      </div>

      {/* Projects subtab */}
      {sub === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bank.projects.map(p => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className="text-left bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-2xl p-5 transition-all hover:bg-gray-800/50 group flex flex-col"
            >
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded border capitalize', DIFF_COLOR[p.difficulty])}>{p.difficulty}</span>
                <span className="text-[11px] text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {p.estimatedTime}</span>
              </div>
              <h4 className="text-sm font-semibold text-white mb-1">{p.title}</h4>
              <p className="text-xs text-gray-400 leading-relaxed mb-3 flex-1">{p.tagline}</p>
              <div className="flex flex-wrap gap-1 mb-2">
                {p.techStack.slice(0, 4).map(t => (
                  <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 border border-gray-700 text-gray-400 font-mono">{t}</span>
                ))}
                {p.techStack.length > 4 && <span className="text-[10px] text-gray-600">+{p.techStack.length - 4}</span>}
              </div>
              <span className={cn('text-xs font-medium flex items-center gap-1 mt-auto', a.text)}>
                View build plan <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Daily challenges subtab */}
      {sub === 'daily' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">A new challenge surfaces each day. Do it without notes — that\'s the point.</p>
            <span className="text-xs text-gray-500 flex items-center gap-1 shrink-0"><Flame className="w-3.5 h-3.5 text-orange-400" /> {doneCount} done</span>
          </div>

          {todaysChallenge && (
            <ChallengeCard
              challenge={todaysChallenge}
              accent={accentColor}
              done={done.includes(todaysChallenge.id)}
              onToggle={() => toggle(todaysChallenge.id)}
              onOpenTopic={onOpenTopic}
              featured
            />
          )}

          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">All challenges ({bank.dailyChallenges.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {bank.dailyChallenges.filter(c => c.id !== todaysChallenge?.id).map(c => (
                <ChallengeCard
                  key={c.id}
                  challenge={c}
                  accent={accentColor}
                  done={done.includes(c.id)}
                  onToggle={() => toggle(c.id)}
                  onOpenTopic={onOpenTopic}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
