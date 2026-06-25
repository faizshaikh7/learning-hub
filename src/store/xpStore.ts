import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { XPState } from '@/types'
import { XP_LEVELS } from '@/types'
import { getXP, setXP } from '@/lib/storage'

interface XPStore {
  xp: XPState
  addXP: (amount: number) => void
  resetDailyXP: () => void
  getLevelInfo: () => { level: number; title: string; progress: number; nextLevelXP: number }
}

/** Zustand store for XP and leveling — persists to localStorage via storage utils. */
export const useXPStore = create<XPStore>()(
  subscribeWithSelector((set, get) => ({
    xp: getXP(),

    /** Award XP for completing a topic. Resets daily XP if it's a new day. */
    addXP: (amount) => {
      const todayStr = new Date().toISOString().split('T')[0]
      const current = getXP()
      const isNewDay = current.lastDate !== todayStr
      const newDailyXP = isNewDay ? amount : current.dailyXP + amount
      const newTotalXP = current.totalXP + amount
      const newLevel = XP_LEVELS.findIndex(l => newTotalXP < l.maxXP)
      const resolvedLevel = newLevel === -1 ? XP_LEVELS.length : newLevel + 1
      const updated: XPState = {
        totalXP: newTotalXP,
        level: resolvedLevel,
        dailyXP: newDailyXP,
        lastDate: todayStr,
        achievements: current.achievements,
      }
      setXP(updated)
      set({ xp: updated })
    },

    /** Reset daily XP counter (called at midnight or on first access of new day). */
    resetDailyXP: () => {
      const todayStr = new Date().toISOString().split('T')[0]
      const current = getXP()
      if (current.lastDate === todayStr) return
      const updated = { ...current, dailyXP: 0, lastDate: todayStr }
      setXP(updated)
      set({ xp: updated })
    },

    /** Get current level info with progress percentage to next level. */
    getLevelInfo: () => {
      const { totalXP, level } = get().xp
      const levelData = XP_LEVELS[level - 1] ?? XP_LEVELS[XP_LEVELS.length - 1]
      const nextLevelData = XP_LEVELS[level] ?? levelData
      const progress = Math.round(
        ((totalXP - levelData.minXP) / (nextLevelData.minXP - levelData.minXP)) * 100
      )
      return {
        level,
        title: levelData.title,
        progress: Math.min(progress, 100),
        nextLevelXP: nextLevelData.minXP,
      }
    },
  }))
)
