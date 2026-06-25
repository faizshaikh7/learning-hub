import { useEffect, useRef, useCallback } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn, formatTime } from '@/lib/utils'
import { useTimerStore } from '@/store/timerStore'
import type { TimerMode } from '@/types'

const MODE_CONFIG: Record<TimerMode, { label: string; totalSeconds: number; color: string; ring: string }> = {
  'focus':       { label: 'Focus',       totalSeconds: 25 * 60, color: 'text-red-400',   ring: '#ef4444' },
  'short-break': { label: 'Short Break', totalSeconds:  5 * 60, color: 'text-green-400', ring: '#22c55e' },
  'long-break':  { label: 'Long Break',  totalSeconds: 15 * 60, color: 'text-blue-400',  ring: '#3b82f6' },
}

const RING_RADIUS = 90
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

/**
 * PomodoroTimer — circular SVG ring countdown timer implementing the Pomodoro
 * technique with Focus (25 min), Short Break (5 min), and Long Break (15 min) modes.
 * Tracks completed sessions with tomato icons and requests browser notifications.
 */
export default function PomodoroTimer() {
  const { mode, secondsLeft, isRunning, sessionsCompleted, totalFocusMinutes, setMode, start, pause, reset, tick } =
    useTimerStore()

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Request notification permission on mount
  useEffect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => { /* ignore */ })
    }
  }, [])

  // Interval ticker
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => tick(), 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, tick])

  const config = MODE_CONFIG[mode]
  const totalSeconds = config.totalSeconds
  const progress = secondsLeft / totalSeconds
  const strokeDashoffset = RING_CIRCUMFERENCE * progress

  const handleModeChange = useCallback((m: TimerMode) => {
    setMode(m)
  }, [setMode])

  const handleToggle = useCallback(() => {
    isRunning ? pause() : start()
  }, [isRunning, pause, start])

  const sessionTomatoes = Array.from({ length: Math.max(sessionsCompleted, 0) }, (_, i) => i)

  return (
    <div className="flex flex-col items-center gap-6 py-8 px-4">
      {/* Mode selector */}
      <div className="flex gap-2 bg-gray-900 p-1 rounded-lg border border-gray-800">
        {(Object.keys(MODE_CONFIG) as TimerMode[]).map(m => (
          <button
            key={m}
            onClick={() => handleModeChange(m)}
            className={cn(
              'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              mode === m
                ? 'bg-gray-700 text-white'
                : 'text-gray-500 hover:text-gray-300'
            )}
          >
            {MODE_CONFIG[m].label}
          </button>
        ))}
      </div>

      {/* SVG Ring Timer */}
      <div className="relative flex items-center justify-center" style={{ width: 220, height: 220 }}>
        <svg width="220" height="220" className="-rotate-90">
          {/* Background track */}
          <circle
            cx="110"
            cy="110"
            r={RING_RADIUS}
            fill="none"
            stroke="#1f2937"
            strokeWidth="10"
          />
          {/* Progress ring */}
          <circle
            cx="110"
            cy="110"
            r={RING_RADIUS}
            fill="none"
            stroke={config.ring}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={RING_CIRCUMFERENCE - strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.8s linear' }}
          />
        </svg>

        {/* Time display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('text-4xl font-mono font-bold tracking-tight', config.color)}>
            {formatTime(secondsLeft)}
          </span>
          <span className="text-xs text-gray-500 mt-1">{config.label}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={reset}
          className="h-10 w-10 text-gray-500 hover:text-white hover:bg-gray-800"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        <Button
          onClick={handleToggle}
          className={cn(
            'h-14 w-14 rounded-full text-white shadow-lg transition-all',
            isRunning
              ? 'bg-gray-700 hover:bg-gray-600'
              : 'bg-red-600 hover:bg-red-500 shadow-red-900/30'
          )}
        >
          {isRunning ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
        </Button>

        {/* Spacer to center the play button */}
        <div className="h-10 w-10" />
      </div>

      {/* Session tomatoes */}
      {sessionsCompleted > 0 && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs text-gray-500">Completed sessions</p>
          <div className="flex flex-wrap justify-center gap-1.5 max-w-[200px]">
            {sessionTomatoes.map(i => (
              <span key={i} className="text-xl" title={`Session ${i + 1}`}>
                🍅
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Total focus time */}
      <div className="text-center space-y-0.5">
        <p className="text-2xl font-bold text-white">{totalFocusMinutes}</p>
        <p className="text-xs text-gray-500">focus minutes today</p>
      </div>
    </div>
  )
}
