import { create } from 'zustand'
import type { TimerMode, TimerState } from '@/types'

const DURATIONS: Record<TimerMode, number> = {
  'focus':       25 * 60,
  'short-break':  5 * 60,
  'long-break':  15 * 60,
}

interface TimerStore extends TimerState {
  setMode: (mode: TimerMode) => void
  tick: () => void
  start: () => void
  pause: () => void
  reset: () => void
}

/** Zustand store for Pomodoro timer — manages mode, countdown, and session tracking. */
export const useTimerStore = create<TimerStore>()((set, get) => ({
  mode: 'focus',
  secondsLeft: DURATIONS['focus'],
  isRunning: false,
  sessionsCompleted: 0,
  totalFocusMinutes: 0,

  /** Switch timer mode and reset to that mode's duration. */
  setMode: (mode) => set({ mode, secondsLeft: DURATIONS[mode], isRunning: false }),

  /** Decrement timer by 1 second. Call this from a setInterval. */
  tick: () => {
    const { secondsLeft, mode, sessionsCompleted, totalFocusMinutes } = get()
    if (secondsLeft <= 0) {
      const nextSessions = mode === 'focus' ? sessionsCompleted + 1 : sessionsCompleted
      const nextFocusMin = mode === 'focus' ? totalFocusMinutes + 25 : totalFocusMinutes
      const nextMode: TimerMode = mode === 'focus'
        ? (nextSessions % 4 === 0 ? 'long-break' : 'short-break')
        : 'focus'
      set({
        mode: nextMode,
        secondsLeft: DURATIONS[nextMode],
        isRunning: false,
        sessionsCompleted: nextSessions,
        totalFocusMinutes: nextFocusMin,
      })
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        new Notification(mode === 'focus' ? '🍅 Focus session done!' : '⏱ Break over — back to work!')
      }
      return
    }
    set({ secondsLeft: secondsLeft - 1 })
  },

  /** Start the timer. */
  start: () => set({ isRunning: true }),

  /** Pause the timer. */
  pause: () => set({ isRunning: false }),

  /** Reset timer to current mode's full duration. */
  reset: () => set({ secondsLeft: DURATIONS[get().mode], isRunning: false }),
}))
