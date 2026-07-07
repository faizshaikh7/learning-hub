import { ExternalLink, PlayCircle, BookOpen, FileText, GraduationCap, FolderGit2, Wrench, Library } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CurriculumTopic, TopicResource } from '@/types'

type Accent = 'blue' | 'purple' | 'cyan' | 'orange' | 'emerald' | 'rose'

interface LessonResourcesProps {
  topic: CurriculumTopic
  accentColor: Accent
}

const ACCENT: Record<Accent, { text: string; badge: string }> = {
  blue:    { text: 'text-blue-400',    badge: 'hover:border-blue-500/40' },
  purple:  { text: 'text-purple-400',  badge: 'hover:border-purple-500/40' },
  cyan:    { text: 'text-cyan-400',    badge: 'hover:border-cyan-500/40' },
  orange:  { text: 'text-orange-400',  badge: 'hover:border-orange-500/40' },
  emerald: { text: 'text-emerald-400', badge: 'hover:border-emerald-500/40' },
  rose:    { text: 'text-rose-400',    badge: 'hover:border-rose-500/40' },
}

const KIND_META: Record<TopicResource['kind'], { icon: typeof PlayCircle; label: string; color: string }> = {
  video:    { icon: PlayCircle,    label: 'Video',    color: 'text-red-400' },
  course:   { icon: GraduationCap, label: 'Course',   color: 'text-yellow-400' },
  book:     { icon: BookOpen,      label: 'Book',     color: 'text-green-400' },
  article:  { icon: FileText,      label: 'Article',  color: 'text-blue-300' },
  docs:     { icon: Library,       label: 'Docs',     color: 'text-gray-300' },
  repo:     { icon: FolderGit2,    label: 'Repo',     color: 'text-purple-300' },
  practice: { icon: Wrench,        label: 'Practice', color: 'text-cyan-300' },
}

/**
 * LessonResources — "Learn it deeper" reference links for a topic: curated
 * videos, books, docs, and repos that open in a new tab. Rendered only when
 * the topic ships a `resources` list.
 */
export default function LessonResources({ topic, accentColor }: LessonResourcesProps) {
  const a = ACCENT[accentColor]
  const resources = topic.resources ?? []
  if (resources.length === 0) return null

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-1">
        <ExternalLink className={cn('w-4 h-4', a.text)} />
        <span className={cn('text-sm font-semibold', a.text)}>Learn It Deeper — References</span>
      </div>
      <p className="text-xs text-gray-500 mb-3">
        Hand-picked videos, books, and docs for this topic. Open in a new tab.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {resources.map((r, i) => {
          const meta = KIND_META[r.kind] ?? KIND_META.article
          const Icon = meta.icon
          return (
            <a
              key={i}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-950/60 border border-gray-800 transition-colors group',
                a.badge,
              )}
            >
              <Icon className={cn('w-4 h-4 shrink-0', meta.color)} />
              <span className="min-w-0 flex-1">
                <span className="block text-sm text-gray-200 truncate group-hover:text-white">{r.label}</span>
                <span className="block text-[10px] text-gray-600 uppercase tracking-wide">{meta.label}</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-600 shrink-0 group-hover:text-gray-400" />
            </a>
          )
        })}
      </div>
    </div>
  )
}
