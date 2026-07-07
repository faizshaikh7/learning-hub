import { useMemo } from 'react'
import type { ReactNode } from 'react'
import { format, subDays } from 'date-fns'
import { CalendarDays, CheckCircle2, Flame, Zap, TrendingUp } from 'lucide-react'
import { getStreakHistory, getProgress } from '@/lib/storage'
import { cn, today } from '@/lib/utils'
import type { TrackKey } from '@/types'

const TRACK_PREFIXES: Record<TrackKey, string> = {
  backend: 'bt',
  ai: 'at',
  flutter: 'ft',
  react: 'rt',
  aiml: 'ml',
  mobile: 'mb',
}

const TRACK_KEYS: TrackKey[] = ['backend', 'ai', 'flutter', 'react', 'aiml', 'mobile']

/** XP awarded per completed topic (mirrors store convention). */
const XP_PER_TOPIC = 10

interface WeekStats {
  studyDays: number
  topicsCompleted: number
  bestStreak: number
  xpEarned: number
}

/**
 * Compute an estimated count of topics completed this week.
 * Since per-day completion timestamps are not stored, we approximate using
 * the ratio of study days this week to the total 7 days, multiplied by
 * each track's total completed count.
 */
function computeWeeklyTopicsCompleted(weekDatesSet: Set<string>): number {
  let total = 0
  for (const key of TRACK_KEYS) {
    const prefix = TRACK_PREFIXES[key]
    const history = getStreakHistory(prefix)
    const studiedThisWeek = Object.entries(history).filter(
      ([entryDate, studied]) => studied && weekDatesSet.has(entryDate)
    ).length
    if (studiedThisWeek > 0) {
      const progress = getProgress(prefix)
      const completed = Object.values(progress).filter(v => v === 'completed').length
      total += Math.round((completed / 7) * studiedThisWeek)
    }
  }
  return total
}

/** Returns a motivational message scaled to the user's weekly performance. */
function getMotivation(studyDays: number, topicsCompleted: number): string {
  if (studyDays === 7) return 'Perfect week! You studied every single day. Unstoppable!'
  if (studyDays >= 5) return 'Excellent consistency! You are building a solid habit.'
  if (studyDays >= 3) return 'Good progress! Keep pushing — aim for 5+ days next week.'
  if (studyDays >= 1) {
    return `You started — ${topicsCompleted} topic${topicsCompleted !== 1 ? 's' : ''} done. Every day counts!`
  }
  return 'New week, fresh start. Open any track and begin your journey.'
}

interface DigestStatProps {
  icon: ReactNode
  label: string
  value: number | string
  colorClass: string
}

/** A single stat cell inside the WeeklyDigest card. */
const DigestStat = ({ icon, label, value, colorClass }: DigestStatProps) => (
  <div className="flex flex-col items-center gap-1.5 p-3 bg-gray-950 rounded-xl border border-gray-800">
    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', colorClass)}>
      {icon}
    </div>
    <p className="text-lg font-bold text-white leading-none">{value}</p>
    <p className="text-xs text-gray-400 text-center leading-tight">{label}</p>
  </div>
)

/**
 * WeeklyDigest — card summarising the past 7 days of learning: study days,
 * topics completed, best streak, and XP earned. Includes a motivational
 * message scaled to the user's weekly performance.
 */
export default function WeeklyDigest() {
  const weekStats = useMemo<WeekStats>(() => {
    const todayStr = today()
    const weekDates: string[] = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(todayStr)
      d.setDate(d.getDate() - i)
      weekDates.push(d.toISOString().split('T')[0])
    }
    const weekDatesSet = new Set(weekDates)

    // Collect all dates within this week where any track was studied
    const studiedOnDay = new Set<string>()
    for (const key of TRACK_KEYS) {
      const history = getStreakHistory(TRACK_PREFIXES[key])
      for (const date of weekDates) {
        if (history[date]) studiedOnDay.add(date)
      }
    }

    const studyDays = studiedOnDay.size

    // Compute best consecutive streak within the 7-day window
    let bestStreak = 0
    let currentRun = 0
    for (const date of [...weekDates].reverse()) {
      if (studiedOnDay.has(date)) {
        currentRun++
        if (currentRun > bestStreak) bestStreak = currentRun
      } else {
        currentRun = 0
      }
    }

    const topicsCompleted = computeWeeklyTopicsCompleted(weekDatesSet)
    const xpEarned = topicsCompleted * XP_PER_TOPIC

    return { studyDays, topicsCompleted, bestStreak, xpEarned }
  }, [])

  const weekRange = useMemo(() => {
    const end = new Date(today())
    const start = subDays(end, 6)
    return `${format(start, 'MMM d')} – ${format(end, 'MMM d')}`
  }, [])

  const motivation = getMotivation(weekStats.studyDays, weekStats.topicsCompleted)

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            Weekly Digest
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">{weekRange}</p>
        </div>
        <CalendarDays className="w-5 h-5 text-gray-600" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <DigestStat
          icon={<CalendarDays className="w-4 h-4 text-white" />}
          label="Study Days"
          value={weekStats.studyDays}
          colorClass="bg-blue-500/20 border border-blue-500/30"
        />
        <DigestStat
          icon={<CheckCircle2 className="w-4 h-4 text-white" />}
          label="Topics Done"
          value={weekStats.topicsCompleted}
          colorClass="bg-green-500/20 border border-green-500/30"
        />
        <DigestStat
          icon={<Flame className="w-4 h-4 text-white" />}
          label="Best Streak"
          value={`${weekStats.bestStreak}d`}
          colorClass="bg-orange-500/20 border border-orange-500/30"
        />
        <DigestStat
          icon={<Zap className="w-4 h-4 text-white" />}
          label="XP Earned"
          value={weekStats.xpEarned}
          colorClass="bg-yellow-500/20 border border-yellow-500/30"
        />
      </div>

      <div className="bg-gray-950 border border-gray-800 rounded-xl px-4 py-3">
        <p className="text-sm text-gray-300 leading-relaxed">{motivation}</p>
      </div>
    </div>
  )
}
