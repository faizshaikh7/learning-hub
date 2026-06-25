import { Clock, CheckCircle2, AlertTriangle, Briefcase, Code2, Lightbulb, BookOpen, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { CurriculumTopic, TrackKey, EfficientApproach } from '@/types'

interface LessonViewProps {
  topic: CurriculumTopic
  track: TrackKey
  onMarkComplete: () => void
  isCompleted: boolean
}

const TRACK_ACCENT: Record<TrackKey, { btn: string; badge: string }> = {
  backend: { btn: 'bg-blue-600 hover:bg-blue-500 text-white',    badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
  ai:      { btn: 'bg-purple-600 hover:bg-purple-500 text-white', badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30' },
  flutter: { btn: 'bg-cyan-600 hover:bg-cyan-500 text-white',     badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' },
  react:   { btn: 'bg-orange-600 hover:bg-orange-500 text-white', badge: 'bg-orange-500/15 text-orange-300 border-orange-500/30' },
}

const VERDICT_STYLES: Record<EfficientApproach['verdict'], string> = {
  best:   'bg-green-500/15 text-green-300 border-green-500/30',
  ok:     'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
  weak:   'bg-red-500/15 text-red-300 border-red-500/30',
}

/** A single labelled section of lesson content with an icon. */
const Section = ({
  icon: Icon,
  title,
  className,
  children,
}: {
  icon: React.ElementType
  title: string
  className?: string
  children: React.ReactNode
}) => (
  <div className={cn('space-y-3', className)}>
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-gray-400 shrink-0" />
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">{title}</h3>
    </div>
    {children}
  </div>
)

/**
 * LessonView — renders all lesson content for a single curriculum topic
 * in structured sections: ELI5, analogy, explanation, technical deep-dive,
 * edge cases, efficient approaches, common mistakes, senior notes,
 * interview questions, and code examples.
 */
export default function LessonView({ topic, track, onMarkComplete, isCompleted }: LessonViewProps) {
  const accent = TRACK_ACCENT[track]

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-white leading-tight">{topic.title}</h1>
          <Badge variant="outline" className="shrink-0 flex items-center gap-1 text-gray-400 border-gray-700">
            <Clock className="h-3 w-3" />
            {topic.estimatedMins} min
          </Badge>
        </div>
        <Badge variant="outline" className={cn('text-xs', accent.badge)}>
          {topic.phaseName}
        </Badge>
      </div>

      <Separator className="bg-gray-800" />

      {/* ELI5 */}
      <Section icon={BookOpen} title="Simple Explanation (ELI5)">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="pt-4">
            <p className="text-gray-200 leading-relaxed">{topic.eli5}</p>
          </CardContent>
        </Card>
      </Section>

      {/* Analogy */}
      <Section icon={Lightbulb} title="Analogy">
        <Card className="bg-amber-950/20 border-amber-900/30">
          <CardContent className="pt-4">
            <p className="text-amber-200/90 leading-relaxed italic">{topic.analogy}</p>
          </CardContent>
        </Card>
      </Section>

      {/* Explanation */}
      <Section icon={BookOpen} title="Explanation">
        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{topic.explanation}</p>
      </Section>

      {/* Technical Deep Dive */}
      <Section icon={Code2} title="Technical Deep Dive">
        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{topic.technicalDeep}</p>
      </Section>

      {/* What breaks */}
      <Section icon={AlertTriangle} title="What Breaks / Edge Cases">
        <Card className="bg-red-950/20 border-red-900/30">
          <CardContent className="pt-4">
            <p className="text-red-200/90 leading-relaxed">{topic.whatBreaks}</p>
          </CardContent>
        </Card>
      </Section>

      {/* Efficient Way */}
      <Section icon={CheckCircle2} title={topic.efficientWay.title}>
        <div className="space-y-3">
          {topic.efficientWay.approaches.map((approach, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-900 border border-gray-800">
              <Badge variant="outline" className={cn('shrink-0 mt-0.5 capitalize', VERDICT_STYLES[approach.verdict])}>
                {approach.verdict}
              </Badge>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white">{approach.name}</p>
                <p className="text-sm text-gray-400 mt-0.5">{approach.reason}</p>
              </div>
            </div>
          ))}
          <Card className="bg-green-950/20 border-green-900/30">
            <CardContent className="pt-3 pb-3">
              <p className="text-green-200/90 text-sm leading-relaxed">
                <span className="font-semibold">Recommendation: </span>
                {topic.efficientWay.recommendation}
              </p>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Common Mistakes */}
      {topic.commonMistakes.length > 0 && (
        <Section icon={AlertTriangle} title="Common Mistakes">
          <ul className="space-y-2">
            {topic.commonMistakes.map((mistake, i) => (
              <li key={i} className="flex items-start gap-2.5 text-gray-300 text-sm">
                <span className="text-yellow-400 shrink-0 mt-0.5">⚠️</span>
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Senior Notes */}
      {topic.seniorNotes && (
        <Section icon={Briefcase} title="Senior Engineer Notes">
          <Card className="bg-indigo-950/20 border-indigo-900/30">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">💼</span>
                <p className="text-indigo-200/90 leading-relaxed">{topic.seniorNotes}</p>
              </div>
            </CardContent>
          </Card>
        </Section>
      )}

      {/* Interview Questions */}
      {topic.interviewQuestions.length > 0 && (
        <Section icon={HelpCircle} title="Interview Questions">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="pt-4">
              <ol className="space-y-3 list-decimal list-inside">
                {topic.interviewQuestions.map((q, i) => (
                  <li key={i} className="text-gray-300 text-sm leading-relaxed pl-1">
                    {q}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </Section>
      )}

      {/* Code Examples */}
      {topic.codeExamples.length > 0 && (
        <Section icon={Code2} title="Code Examples">
          <div className="space-y-4">
            {topic.codeExamples.map((example, i) => (
              <div key={i} className="rounded-lg overflow-hidden border border-gray-800">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-800/80">
                  <span className="text-sm font-medium text-gray-300">{example.label}</span>
                  <Badge variant="outline" className="text-xs text-gray-500 border-gray-700 bg-transparent">
                    {example.lang}
                  </Badge>
                </div>
                <pre className="p-4 bg-gray-950 overflow-x-auto">
                  <code className="text-sm text-gray-200 font-mono leading-relaxed whitespace-pre">
                    {example.code}
                  </code>
                </pre>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Separator className="bg-gray-800" />

      {/* Mark Complete */}
      <div className="flex justify-center pb-4">
        {isCompleted ? (
          <div className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-500/10 border border-green-500/30">
            <CheckCircle2 className="h-5 w-5 text-green-400" />
            <span className="text-green-300 font-medium">Topic Completed!</span>
          </div>
        ) : (
          <Button
            onClick={onMarkComplete}
            className={cn('px-8 py-2.5 font-semibold', accent.btn)}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Mark Complete
          </Button>
        )}
      </div>
    </div>
  )
}
