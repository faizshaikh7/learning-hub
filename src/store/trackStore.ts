import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { TrackKey, TrackStats, TrackProgress } from '@/types'
import {
  getProgress, setTopicStatus, getStreak, getStreakHistory,
  recordStudyDay,
} from '@/lib/storage'

const TRACK_CONFIG = {
  backend: { prefix: 'bt', total: 94 },
  ai:      { prefix: 'at', total: 72 },
  flutter: { prefix: 'ft', total: 65 },
  react:   { prefix: 'rt', total: 81 },
} as const

const PHASE_LABELS: Record<string, { min: number; max: number; label: string }[]> = {
  bt: [
    { min: 0,  max: 12, label: 'Phase 0 — Network Foundations' },
    { min: 13, max: 33, label: 'Phase 1 — Backend Foundations' },
    { min: 34, max: 42, label: 'Phase 2 — Data & Storage' },
    { min: 43, max: 58, label: 'Phase 3 — Scale & Performance' },
    { min: 59, max: 67, label: 'Phase 4 — Security Deep Dive' },
    { min: 68, max: 81, label: 'Phase 5 — Architecture Patterns' },
    { min: 82, max: 91, label: 'Phase 6 — Production Engineering' },
  ],
  at: [
    { min: 0,  max: 9,  label: 'Phase 0 — AI & LLM Foundations' },
    { min: 10, max: 17, label: 'Phase 1 — Prompt Engineering' },
    { min: 18, max: 27, label: 'Phase 2 — APIs, Coding & Creative' },
    { min: 28, max: 35, label: 'Phase 3 — Embeddings & Vector DBs' },
    { min: 36, max: 44, label: 'Phase 4 — RAG Systems' },
    { min: 45, max: 54, label: 'Phase 5 — Agents, MCP & Automation' },
    { min: 55, max: 62, label: 'Phase 6 — Safety & Evaluation' },
    { min: 63, max: 70, label: 'Phase 7 — Production & Operator Path' },
  ],
  ft: [
    { min: 0,  max: 8,  label: 'Phase 0 — Dart Fundamentals' },
    { min: 9,  max: 16, label: 'Phase 1 — Flutter Foundations' },
    { min: 17, max: 24, label: 'Phase 2 — UI & Navigation' },
    { min: 25, max: 32, label: 'Phase 3 — State Management' },
    { min: 33, max: 41, label: 'Phase 4 — Data, APIs & Firebase' },
    { min: 42, max: 47, label: 'Phase 5 — Animations & Internals' },
    { min: 48, max: 53, label: 'Phase 6 — Testing & Quality' },
    { min: 54, max: 62, label: 'Phase 7 — Release & Production' },
  ],
  rt: [
    { min: 0,  max: 9,  label: 'Phase 0 — JS & TS Essentials' },
    { min: 10, max: 19, label: 'Phase 1 — React Foundations' },
    { min: 20, max: 31, label: 'Phase 2 — React Hooks' },
    { min: 32, max: 45, label: 'Phase 3 — React Architecture' },
    { min: 46, max: 51, label: 'Phase 4 — TypeScript with React' },
    { min: 52, max: 56, label: 'Phase 5 — React Ecosystem' },
    { min: 57, max: 63, label: 'Phase 6 — Next.js Foundations' },
    { min: 64, max: 70, label: 'Phase 7 — Next.js & Production' },
  ],
}

/** Derive current phase label from completed count. */
function getCurrentPhase(prefix: string, completed: number): string {
  const phases = PHASE_LABELS[prefix] ?? []
  const phase = phases.find(p => completed >= p.min && completed <= p.max)
  return phase?.label ?? 'Complete!'
}

/** Compute full stats for a track from localStorage. */
function computeStats(key: TrackKey): TrackStats {
  const { prefix, total } = TRACK_CONFIG[key]
  const progress = getProgress(prefix)
  const completed = Object.values(progress).filter(v => v === 'completed').length
  const streak = getStreak(prefix)
  const history = getStreakHistory(prefix)
  const recentDates = Object.keys(history)
    .filter(d => history[d])
    .sort()
    .slice(-7)
  return {
    completed,
    total,
    pct: total > 0 ? Math.round((completed / total) * 100) : 0,
    streak: streak.count,
    recentDates,
    currentPhase: getCurrentPhase(prefix, completed),
  }
}

interface TrackStore {
  stats: Record<TrackKey, TrackStats>
  refreshStats: () => void
  markTopic: (track: TrackKey, topicId: string, status: TrackProgress[string]) => void
}

/** Zustand store for track progress stats — reads from and writes to localStorage. */
export const useTrackStore = create<TrackStore>()(
  subscribeWithSelector((set) => ({
    stats: {
      backend: computeStats('backend'),
      ai:      computeStats('ai'),
      flutter: computeStats('flutter'),
      react:   computeStats('react'),
    },

    /** Re-read all stats from localStorage. Call after any progress mutation. */
    refreshStats: () => {
      set({
        stats: {
          backend: computeStats('backend'),
          ai:      computeStats('ai'),
          flutter: computeStats('flutter'),
          react:   computeStats('react'),
        },
      })
    },

    /** Mark a topic status and record today as a study day, then refresh. */
    markTopic: (track, topicId, status) => {
      const { prefix } = TRACK_CONFIG[track]
      setTopicStatus(prefix, topicId, status)
      if (status === 'completed') recordStudyDay(prefix)
      set((state) => ({
        stats: {
          ...state.stats,
          [track]: computeStats(track),
        },
      }))
    },
  }))
)
