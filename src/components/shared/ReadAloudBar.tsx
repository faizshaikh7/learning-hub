import { Volume2, VolumeX, Pause, Play, Square } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useReadAloud } from '@/hooks/useReadAloud'
import type { CurriculumTopic } from '@/types'

// ─── Text compiler ─────────────────────────────────────────────────────────────

/**
 * Compiles all readable text from a CurriculumTopic into a single
 * narration script. Skips code blocks (they sound terrible aloud).
 */
export function buildTopicNarration(topic: CurriculumTopic): string {
  const parts: string[] = []

  parts.push(`${topic.title}.`)
  parts.push(`Explain Like I'm 5: ${topic.eli5}`)
  parts.push(`Analogy: ${topic.analogy}`)
  parts.push(`Explanation: ${topic.explanation}`)
  parts.push(`Technical Deep Dive: ${topic.technicalDeep}`)
  parts.push(`What Breaks: ${topic.whatBreaks}`)

  if (topic.commonMistakes.length > 0) {
    parts.push(`Common Mistakes: ${topic.commonMistakes.join('. ')}`)
  }

  if (topic.seniorNotes) {
    parts.push(`Senior Notes: ${topic.seniorNotes}`)
  }

  if (topic.interviewQuestions.length > 0) {
    parts.push(
      `Interview Questions: ${topic.interviewQuestions.map((q, i) => `Question ${i + 1}: ${q}`).join('. ')}`,
    )
  }

  if (topic.interviewAnswers && topic.interviewAnswers.length > 0) {
    parts.push(`Interview Answers: ${topic.interviewAnswers.join('. ')}`)
  }

  return parts.join('\n\n')
}

// ─── Component ─────────────────────────────────────────────────────────────────

interface ReadAloudBarProps {
  topic: CurriculumTopic
  accentColor?: 'blue' | 'purple' | 'cyan' | 'orange'
}

const ACCENT_CLASSES = {
  blue:   { bg: 'bg-blue-500/10 border-blue-500/20',   text: 'text-blue-400',   btn: 'bg-blue-500 hover:bg-blue-600' },
  purple: { bg: 'bg-purple-500/10 border-purple-500/20', text: 'text-purple-400', btn: 'bg-purple-500 hover:bg-purple-600' },
  cyan:   { bg: 'bg-cyan-500/10 border-cyan-500/20',   text: 'text-cyan-400',   btn: 'bg-cyan-500 hover:bg-cyan-600' },
  orange: { bg: 'bg-orange-500/10 border-orange-500/20', text: 'text-orange-400', btn: 'bg-orange-500 hover:bg-orange-600' },
}

/**
 * ReadAloudBar — a compact audio control strip that reads the entire
 * lesson aloud using the Web Speech API. Placed at the top of LessonView.
 */
export default function ReadAloudBar({ topic, accentColor = 'blue' }: ReadAloudBarProps) {
  const { status, play, pause, resume, stop, supported } = useReadAloud()
  const a = ACCENT_CLASSES[accentColor]

  if (!supported) return null

  const narration = buildTopicNarration(topic)
  const isPlaying = status === 'playing'
  const isPaused = status === 'paused'
  const isActive = isPlaying || isPaused

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all',
        isActive ? a.bg : 'bg-gray-900/60 border-gray-800',
      )}
    >
      <Volume2
        className={cn('w-4 h-4 shrink-0', isActive ? a.text : 'text-gray-500')}
      />

      <span className={cn('text-xs font-medium flex-1', isActive ? a.text : 'text-gray-400')}>
        {isPlaying ? 'Reading aloud…' : isPaused ? 'Paused' : 'Read Aloud'}
      </span>

      {/* Animated dots when playing */}
      {isPlaying && (
        <span className="flex items-center gap-0.5 mr-1">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className={cn('w-1 h-1 rounded-full', a.text.replace('text-', 'bg-'))}
              style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}
        </span>
      )}

      <div className="flex items-center gap-1.5 shrink-0">
        {/* Play / Pause / Resume */}
        {!isActive ? (
          <button
            onClick={() => play(narration)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium text-white transition-colors',
              a.btn,
            )}
            aria-label="Start reading aloud"
          >
            <Play className="w-3 h-3" />
            Play
          </button>
        ) : isPlaying ? (
          <button
            onClick={pause}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-gray-700 hover:bg-gray-600 text-white transition-colors"
            aria-label="Pause reading"
          >
            <Pause className="w-3 h-3" />
            Pause
          </button>
        ) : (
          <button
            onClick={resume}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium text-white transition-colors',
              a.btn,
            )}
            aria-label="Resume reading"
          >
            <Play className="w-3 h-3" />
            Resume
          </button>
        )}

        {/* Stop (only when active) */}
        {isActive && (
          <button
            onClick={stop}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/20 transition-colors"
            aria-label="Stop reading"
          >
            <Square className="w-3 h-3" />
            Stop
          </button>
        )}
      </div>
    </div>
  )
}
