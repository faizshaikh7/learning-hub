import { useMemo } from 'react'
import { ArrowRight, Flame } from 'lucide-react'
import { cn, today } from '@/lib/utils'
import type { Track, TrackStats } from '@/types'

/** Configuration for all four learning tracks. */
export const TRACKS: Track[] = [
  {
    key: 'backend',
    label: 'Backend',
    subtitle: 'Engineering',
    emoji: '⚙️',
    prefix: 'bt',
    total: 91,
    colorClass: 'bg-blue-500',
    borderClass: 'border-blue-500/30',
    textClass: 'text-blue-400',
    route: '/backend',
  },
  {
    key: 'ai',
    label: 'AI Engineer',
    subtitle: 'Machine Learning',
    emoji: '🤖',
    prefix: 'at',
    total: 70,
    colorClass: 'bg-purple-500',
    borderClass: 'border-purple-500/30',
    textClass: 'text-purple-400',
    route: '/ai',
  },
  {
    key: 'flutter',
    label: 'Flutter',
    subtitle: 'Mobile & Web',
    emoji: '🦋',
    prefix: 'ft',
    total: 62,
    colorClass: 'bg-cyan-500',
    borderClass: 'border-cyan-500/30',
    textClass: 'text-cyan-400',
    route: '/flutter',
  },
  {
    key: 'react',
    label: 'React',
    subtitle: 'Next.js & Web',
    emoji: '⚛️',
    prefix: 'rt',
    total: 78,
    colorClass: 'bg-orange-500',
    borderClass: 'border-orange-500/30',
    textClass: 'text-orange-400',
    route: '/react',
  },
]

interface CircularProgressProps {
  pct: number
  colorClass: string
  size?: number
  strokeWidth?: number
}

/**
 * SVG-based circular progress ring for displaying track completion percentage.
 */
const CircularProgress = ({ pct, colorClass, size = 96, strokeWidth = 7 }: CircularProgressProps) => {
  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (pct / 100) * circumference

  // Map colorClass (bg-*) to a stroke color value
  const strokeColorMap: Record<string, string> = {
    'bg-blue-500': '#3b82f6',
    'bg-purple-500': '#a855f7',
    'bg-cyan-500': '#06b6d4',
    'bg-orange-500': '#f97316',
  }
  const strokeColor = strokeColorMap[colorClass] ?? '#3b82f6'

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1f2937"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-base font-bold text-white">{pct}%</span>
      </div>
    </div>
  )
}

interface ActivityDotsProps {
  recentDates: string[]
}

/** Seven activity dots showing the past 7 days of study activity. */
const ActivityDots = ({ recentDates }: ActivityDotsProps) => {
  const recentSet = useMemo(() => new Set(recentDates), [recentDates])

  const days = useMemo(() => {
    const result: string[] = []
    const todayStr = today()
    for (let i = 6; i >= 0; i--) {
      const d = new Date(todayStr)
      d.setDate(d.getDate() - i)
      result.push(d.toISOString().split('T')[0])
    }
    return result
  }, [])

  return (
    <div className="flex gap-1 items-center">
      {days.map((day) => (
        <div
          key={day}
          title={day}
          className={cn(
            'w-2 h-2 rounded-full',
            recentSet.has(day) ? 'bg-current opacity-80' : 'bg-gray-700'
          )}
        />
      ))}
    </div>
  )
}

interface TrackCardProps {
  track: Track
  stats: TrackStats
  onClick: () => void
}

/**
 * TrackCard — displays a single learning track with a circular progress ring,
 * streak info, phase label, 7-day activity dots, and a "Continue Learning" CTA.
 * Accepts the track config, live stats, and an onClick navigation handler.
 */
export default function TrackCard({ track, stats, onClick }: TrackCardProps) {
  const glowColorMap: Record<string, string> = {
    'bg-blue-500': 'hover:shadow-blue-500/20',
    'bg-purple-500': 'hover:shadow-purple-500/20',
    'bg-cyan-500': 'hover:shadow-cyan-500/20',
    'bg-orange-500': 'hover:shadow-orange-500/20',
  }
  const glowClass = glowColorMap[track.colorClass] ?? 'hover:shadow-blue-500/20'

  const buttonColorMap: Record<string, string> = {
    'bg-blue-500': 'bg-blue-500 hover:bg-blue-400',
    'bg-purple-500': 'bg-purple-500 hover:bg-purple-400',
    'bg-cyan-500': 'bg-cyan-500 hover:bg-cyan-400',
    'bg-orange-500': 'bg-orange-500 hover:bg-orange-400',
  }
  const buttonClass = buttonColorMap[track.colorClass] ?? 'bg-blue-500 hover:bg-blue-400'

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group w-full text-left bg-gray-900 border rounded-2xl p-5 flex flex-col gap-4',
        'transition-all duration-300 cursor-pointer',
        'hover:shadow-xl hover:-translate-y-0.5',
        track.borderClass,
        glowClass
      )}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl shrink-0">{track.emoji}</span>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-white leading-tight">{track.label}</h3>
            <p className={cn('text-xs font-medium', track.textClass)}>{track.subtitle}</p>
          </div>
        </div>
        <CircularProgress pct={stats.pct} colorClass={track.colorClass} size={80} strokeWidth={6} />
      </div>

      {/* Phase label */}
      <p className="text-xs text-gray-400 leading-snug line-clamp-1">{stats.currentPhase}</p>

      {/* Topic count + streak */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-semibold text-white">{stats.completed}</span>
          <span className="text-xs text-gray-400"> / {stats.total} topics</span>
        </div>
        {stats.streak > 0 && (
          <div className="flex items-center gap-1">
            <Flame className={cn('w-3.5 h-3.5', track.textClass)} />
            <span className={cn('text-xs font-semibold', track.textClass)}>
              {stats.streak}d streak
            </span>
          </div>
        )}
      </div>

      {/* Activity dots */}
      <div className={cn('flex items-center gap-2', track.textClass)}>
        <span className="text-xs text-gray-500">7d</span>
        <ActivityDots recentDates={stats.recentDates} />
      </div>

      {/* CTA button */}
      <div
        className={cn(
          'flex items-center justify-center gap-2 rounded-xl px-4 py-2.5',
          'text-sm font-semibold text-white transition-colors duration-200',
          buttonClass
        )}
      >
        Continue Learning
        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      </div>
    </button>
  )
}
