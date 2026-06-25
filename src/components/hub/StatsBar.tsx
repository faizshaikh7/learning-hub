import { useMemo } from 'react'
import type { ReactNode } from 'react'
import { Flame, Trophy, BookOpen, CheckCircle2, Zap } from 'lucide-react'
import { useTrackStore } from '@/store/trackStore'
import { useXPStore } from '@/store/xpStore'
import { cn } from '@/lib/utils'
import type { TrackKey } from '@/types'

const TRACK_KEYS: TrackKey[] = ['backend', 'ai', 'flutter', 'react']
const TOTAL_TOPICS = 301

interface StatPillProps {
  icon: ReactNode
  label: string
  value: string | number
  sub?: string
  colorClass: string
}

/** A single stat pill used in the StatsBar. */
const StatPill = ({ icon, label, value, sub, colorClass }: StatPillProps) => (
  <div className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex-1 min-w-0">
    <div className={cn('shrink-0 w-9 h-9 rounded-lg flex items-center justify-center', colorClass)}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs text-gray-400 font-medium truncate">{label}</p>
      <p className="text-lg font-bold text-white leading-tight">
        {value}
        {sub && <span className="text-xs text-gray-400 font-normal ml-1">{sub}</span>}
      </p>
    </div>
  </div>
)

/**
 * StatsBar — horizontal bar displaying aggregate learning statistics across all
 * four tracks: total topics completed, global streak, total XP, and level.
 */
export default function StatsBar() {
  const stats = useTrackStore(s => s.stats)
  const xp = useXPStore(s => s.xp)
  const getLevelInfo = useXPStore(s => s.getLevelInfo)

  const aggregated = useMemo(() => {
    let totalCompleted = 0
    let maxStreak = 0

    for (const key of TRACK_KEYS) {
      const s = stats[key]
      totalCompleted += s.completed
      if (s.streak > maxStreak) maxStreak = s.streak
    }

    return { totalCompleted, maxStreak }
  }, [stats])

  const levelInfo = useMemo(() => getLevelInfo(), [getLevelInfo, xp.totalXP])

  return (
    <div className="flex flex-wrap gap-3">
      <StatPill
        icon={<BookOpen className="w-4 h-4 text-white" />}
        label="Topics Completed"
        value={`${aggregated.totalCompleted} / ${TOTAL_TOPICS}`}
        colorClass="bg-blue-500/20 border border-blue-500/30"
      />
      <StatPill
        icon={<CheckCircle2 className="w-4 h-4 text-white" />}
        label="Completion"
        value={`${Math.round((aggregated.totalCompleted / TOTAL_TOPICS) * 100)}%`}
        colorClass="bg-green-500/20 border border-green-500/30"
      />
      <StatPill
        icon={<Flame className="w-4 h-4 text-white" />}
        label="Top Streak"
        value={aggregated.maxStreak}
        sub="days"
        colorClass="bg-orange-500/20 border border-orange-500/30"
      />
      <StatPill
        icon={<Zap className="w-4 h-4 text-white" />}
        label="Total XP"
        value={xp.totalXP.toLocaleString()}
        colorClass="bg-yellow-500/20 border border-yellow-500/30"
      />
      <StatPill
        icon={<Trophy className="w-4 h-4 text-white" />}
        label="Level"
        value={`Lv ${levelInfo.level}`}
        sub={levelInfo.title}
        colorClass="bg-purple-500/20 border border-purple-500/30"
      />
    </div>
  )
}
