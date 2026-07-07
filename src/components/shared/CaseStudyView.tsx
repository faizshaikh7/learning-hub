import { useState } from 'react'
import {
  ArrowLeft,
  Clock,
  Users,
  ChevronRight,
  CheckCircle2,
  Lightbulb,
  AlertTriangle,
  Trophy,
  Code2,
  BookOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CaseStudy, CaseStudyDecision } from '@/types'

// ─── Types ─────────────────────────────────────────────────────────────────────

interface CaseStudyViewProps {
  caseStudies: CaseStudy[]
  accentColor: 'blue' | 'purple' | 'cyan' | 'orange' | 'emerald' | 'rose'
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ACCENT = {
  blue:   { bg: 'bg-blue-500/15',   border: 'border-blue-500/30',   text: 'text-blue-400',   badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  purple: { bg: 'bg-purple-500/15', border: 'border-purple-500/30', text: 'text-purple-400', badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  cyan:   { bg: 'bg-cyan-500/15',   border: 'border-cyan-500/30',   text: 'text-cyan-400',   badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  orange: { bg: 'bg-orange-500/15', border: 'border-orange-500/30', text: 'text-orange-400', badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  emerald: { bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', text: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  rose: { bg: 'bg-rose-500/15', border: 'border-rose-500/30', text: 'text-rose-400', badge: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
}

// ─── Decision accordion item ───────────────────────────────────────────────────

/** Expandable key-decision card. */
function DecisionCard({ decision }: { decision: CaseStudyDecision }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start gap-3 px-4 py-3.5 text-left hover:bg-gray-800/50 transition-colors"
      >
        <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
          <ChevronRight
            className={cn('w-3 h-3 text-blue-400 transition-transform', open && 'rotate-90')}
          />
        </span>
        <p className="text-sm font-medium text-white leading-relaxed flex-1">{decision.decision}</p>
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-800">
          <div className="pt-3">
            <p className="text-xs font-semibold text-green-400 uppercase tracking-wide mb-1.5">Why</p>
            <p className="text-sm text-gray-300 leading-relaxed">{decision.why}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-yellow-400 uppercase tracking-wide mb-1.5">Trade-offs</p>
            <p className="text-sm text-gray-300 leading-relaxed">{decision.tradeoffs}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Case Study Detail ─────────────────────────────────────────────────────────

/** Full detail view for a single case study. */
function CaseStudyDetail({
  study,
  accent,
  onBack,
}: {
  study: CaseStudy
  accent: keyof typeof ACCENT
  onBack: () => void
}) {
  const a = ACCENT[accent]

  return (
    <div className="space-y-6 pb-12">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        All Case Studies
      </button>

      {/* Hero */}
      <div className={cn('rounded-2xl p-6 border', a.bg, a.border)}>
        <div className="flex items-start gap-4">
          <div className="text-4xl shrink-0">{study.logo}</div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full border', a.badge)}>
                {study.company}
              </span>
              <span className="text-xs text-gray-500">{study.industry}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white leading-snug mb-3">{study.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {study.scale}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {study.estimatedMins} min read
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Problem */}
      <section className="bg-red-500/10 border border-red-500/20 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <h2 className="text-sm font-semibold text-red-400">The Problem</h2>
        </div>
        <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{study.problem}</div>
      </section>

      {/* Solution */}
      <section className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-yellow-400" />
          <h2 className="text-sm font-semibold text-yellow-400">The Solution</h2>
        </div>
        <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{study.solution}</div>
      </section>

      {/* Architecture */}
      {study.architecture && (
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-cyan-400">Architecture Deep Dive</h2>
          </div>
          <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{study.architecture}</div>
        </section>
      )}

      {/* Tech Stack */}
      <section className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Code2 className="w-4 h-4 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-400">Tech Stack</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {study.techStack.map(tech => (
            <span
              key={tech}
              className="px-2.5 py-1 rounded-lg bg-gray-800 border border-gray-700 text-xs text-gray-300 font-mono"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Key Decisions */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-semibold text-white">Key Engineering Decisions</span>
          <span className="text-xs text-gray-500">({study.keyDecisions.length} decisions)</span>
        </div>
        <div className="space-y-2">
          {study.keyDecisions.map((d, i) => (
            <DecisionCard key={i} decision={d} />
          ))}
        </div>
      </section>

      {/* Results */}
      <section className="bg-green-500/10 border border-green-500/20 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="w-4 h-4 text-green-400" />
          <h2 className="text-sm font-semibold text-green-400">Results &amp; Impact</h2>
        </div>
        <ul className="space-y-2">
          {study.results.map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
              <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
              {r}
            </li>
          ))}
        </ul>
      </section>

      {/* Lessons Learned */}
      <section className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-yellow-400" />
          <h2 className="text-sm font-semibold text-yellow-400">Key Lessons for Engineers</h2>
        </div>
        <ul className="space-y-2.5">
          {study.lessonsLearned.map((l, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-300 leading-relaxed">
              <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-yellow-400" />
              {l}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

// ─── Case Study Card ────────────────────────────────────────────────────────────

/** Card in the list view. */
function CaseStudyCard({
  study,
  accent,
  onClick,
}: {
  study: CaseStudy
  accent: keyof typeof ACCENT
  onClick: () => void
}) {
  const a = ACCENT[accent]
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-2xl p-5 transition-all hover:bg-gray-800/50 group"
    >
      <div className="flex items-start gap-3 mb-3">
        <span className="text-3xl shrink-0">{study.logo}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <span className={cn('text-[11px] font-semibold px-1.5 py-0.5 rounded border', a.badge)}>
              {study.company}
            </span>
            <span className="text-[11px] text-gray-500">{study.industry}</span>
          </div>
          <h3 className="text-sm font-semibold text-white leading-snug group-hover:text-white">
            {study.title}
          </h3>
        </div>
      </div>
      <p className="text-xs text-gray-400 leading-relaxed mb-3 line-clamp-2">
        {study.problem.split('\n\n')[0]}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Users className="w-3 h-3" />
          <span className="truncate max-w-[180px]">{study.scale.split(' · ')[0]}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            {study.estimatedMins}m
          </span>
          <ChevronRight className={cn('w-4 h-4 transition-transform group-hover:translate-x-0.5', a.text)} />
        </div>
      </div>
    </button>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────

/**
 * CaseStudyView — renders a filterable list of real-world case studies
 * and a full detail view for each. Used across all 4 tutor screens.
 */
export default function CaseStudyView({ caseStudies, accentColor }: CaseStudyViewProps) {
  const [selected, setSelected] = useState<CaseStudy | null>(null)

  if (selected) {
    return (
      <CaseStudyDetail
        study={selected}
        accent={accentColor}
        onBack={() => setSelected(null)}
      />
    )
  }

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-lg font-bold text-white mb-1">Real-World Case Studies</h2>
        <p className="text-sm text-gray-400">
          Learn how top tech companies solve engineering challenges at scale. Each case study covers the problem, solution, architecture decisions, and lessons learned.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {caseStudies.map(study => (
          <CaseStudyCard
            key={study.id}
            study={study}
            accent={accentColor}
            onClick={() => setSelected(study)}
          />
        ))}
      </div>
    </div>
  )
}
