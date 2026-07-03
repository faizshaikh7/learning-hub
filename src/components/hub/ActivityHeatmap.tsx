import { useMemo, useState } from 'react'
import { eachDayOfInterval, format, subDays, startOfWeek, getMonth } from 'date-fns'
import { getStreakHistory } from '@/lib/storage'
import { cn, today } from '@/lib/utils'
import type { TrackKey } from '@/types'

const TRACK_PREFIXES: Record<TrackKey, string> = {
  backend: 'bt',
  ai: 'at',
  flutter: 'ft',
  react: 'rt',
  aiml: 'ml',
}

const TRACK_KEYS: TrackKey[] = ['backend', 'ai', 'flutter', 'react', 'aiml']

/** Maps a study count to a Tailwind bg color class for the heatmap cell. */
function countToColor(count: number): string {
  if (count === 0) return 'bg-gray-800'
  if (count === 1) return 'bg-blue-900'
  if (count === 2) return 'bg-blue-700'
  if (count === 3) return 'bg-blue-500'
  return 'bg-blue-400'
}

interface TooltipState {
  date: string
  count: number
  x: number
  y: number
  visible: boolean
}

/**
 * ActivityHeatmap — GitHub-style contribution heatmap showing 365 days of
 * combined study activity across all four learning tracks. Darker blue cells
 * indicate more tracks studied on that day. Includes month labels and
 * hover tooltips.
 */
export default function ActivityHeatmap() {
  const [tooltip, setTooltip] = useState<TooltipState>({
    date: '',
    count: 0,
    x: 0,
    y: 0,
    visible: false,
  })

  /** Combined per-date study count across all tracks (0–4). */
  const combinedHistory = useMemo<Map<string, number>>(() => {
    const map = new Map<string, number>()
    for (const key of TRACK_KEYS) {
      const history = getStreakHistory(TRACK_PREFIXES[key])
      for (const [date, studied] of Object.entries(history)) {
        if (studied) {
          map.set(date, (map.get(date) ?? 0) + 1)
        }
      }
    }
    return map
  }, [])

  /** All days in the last 365 days, padded to start on Sunday. */
  const { weeks, monthLabels } = useMemo(() => {
    const end = new Date(today())
    const start = startOfWeek(subDays(end, 364), { weekStartsOn: 0 })
    const allDays = eachDayOfInterval({ start, end })

    // Group into weeks (columns of 7)
    const cols: Date[][] = []
    for (let i = 0; i < allDays.length; i += 7) {
      cols.push(allDays.slice(i, i + 7))
    }

    // Build month labels — place label at the first column that starts a new month
    const labels: { col: number; label: string }[] = []
    let lastMonth = -1
    cols.forEach((week, colIdx) => {
      const month = getMonth(week[0])
      if (month !== lastMonth) {
        labels.push({ col: colIdx, label: format(week[0], 'MMM') })
        lastMonth = month
      }
    })

    return { weeks: cols, monthLabels: labels }
  }, [])

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    date: string,
    count: number
  ) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const parentRect = e.currentTarget.closest('.heatmap-container')?.getBoundingClientRect()
    const x = parentRect ? rect.left - parentRect.left + rect.width / 2 : rect.left
    const y = parentRect ? rect.top - parentRect.top - 8 : rect.top
    setTooltip({ date, count, x, y, visible: true })
  }

  const handleMouseLeave = () => {
    setTooltip(t => ({ ...t, visible: false }))
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-white">Study Activity</h2>
          <p className="text-xs text-gray-400 mt-0.5">Last 365 days across all tracks</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map(n => (
            <div key={n} className={cn('w-3 h-3 rounded-sm', countToColor(n))} />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="heatmap-container relative overflow-x-auto">
        {/* Month labels row */}
        <div className="flex mb-1" style={{ gap: 3 }}>
          {weeks.map((_, colIdx) => {
            const label = monthLabels.find(m => m.col === colIdx)
            return (
              <div
                key={colIdx}
                className="text-xs text-gray-500 shrink-0"
                style={{ width: 12 }}
              >
                {label ? label.label : ''}
              </div>
            )
          })}
        </div>

        {/* Grid of cells */}
        <div className="flex" style={{ gap: 3 }}>
          {weeks.map((week, colIdx) => (
            <div key={colIdx} className="flex flex-col" style={{ gap: 3 }}>
              {week.map((day) => {
                const dateStr = format(day, 'yyyy-MM-dd')
                const count = combinedHistory.get(dateStr) ?? 0
                return (
                  <div
                    key={dateStr}
                    className={cn(
                      'w-3 h-3 rounded-sm cursor-pointer transition-opacity duration-100 hover:opacity-80 shrink-0',
                      countToColor(count)
                    )}
                    onMouseEnter={(e) => handleMouseEnter(e, dateStr, count)}
                    onMouseLeave={handleMouseLeave}
                  />
                )
              })}
            </div>
          ))}
        </div>

        {/* Tooltip */}
        {tooltip.visible && (
          <div
            className="pointer-events-none absolute z-10 bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-white shadow-lg -translate-x-1/2 -translate-y-full"
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            <p className="font-semibold">{tooltip.date}</p>
            <p className="text-gray-400">
              {tooltip.count === 0
                ? 'No study'
                : `${tooltip.count} track${tooltip.count > 1 ? 's' : ''} studied`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
