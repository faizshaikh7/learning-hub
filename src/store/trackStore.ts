import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { TrackKey, TrackStats, TrackProgress } from '@/types'
import {
  getProgress, setTopicStatus, getStreak, getStreakHistory,
  recordStudyDay,
} from '@/lib/storage'

const TRACK_CONFIG = {
  backend: { prefix: 'bt', total: 95 },
  ai:      { prefix: 'at', total: 79 },
  flutter: { prefix: 'ft', total: 65 },
  react:   { prefix: 'rt', total: 81 },
  aiml:    { prefix: 'ml', total: 58 },
  mobile:  { prefix: 'mb', total: 88 },
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
    { min: 0,  max: 12, label: 'Phase 0 — AI & LLM Foundations' },
    { min: 13, max: 20, label: 'Phase 1 — Prompt & Context Engineering' },
    { min: 21, max: 31, label: 'Phase 2 — AI APIs & Platforms' },
    { min: 32, max: 39, label: 'Phase 3 — Embeddings & Vector Databases' },
    { min: 40, max: 49, label: 'Phase 4 — RAG Systems' },
    { min: 50, max: 59, label: 'Phase 5 — AI Agents & MCP' },
    { min: 60, max: 68, label: 'Phase 6 — AI Safety & Evaluation' },
    { min: 69, max: 78, label: 'Phase 7 — Production AI & Observability' },
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
  ml: [
    { min: 0,  max: 5,  label: 'Phase 0 — Python & Data Toolkit' },
    { min: 6,  max: 16, label: 'Phase 1 — Statistics & Probability' },
    { min: 17, max: 22, label: 'Phase 2 — Linear Algebra' },
    { min: 23, max: 26, label: 'Phase 3 — Calculus & Optimization' },
    { min: 27, max: 36, label: 'Phase 4 — Core Machine Learning' },
    { min: 37, max: 43, label: 'Phase 5 — Ensembles & Unsupervised' },
    { min: 44, max: 51, label: 'Phase 6 — Deep Learning' },
    { min: 52, max: 58, label: 'Phase 7 — Production ML & Career' },
  ],
  mb: [
    { min: 0,  max: 9,  label: 'Phase 0 — Mobile Foundations' },
    { min: 10, max: 16, label: 'Phase 1 — App Lifecycle & Process Model' },
    { min: 17, max: 20, label: 'Phase 2 — App Architecture & Structure' },
    { min: 21, max: 28, label: 'Phase 3 — UI Rendering & the Frame Pipeline' },
    { min: 29, max: 36, label: 'Phase 4 — Adaptive UI, Navigation & Accessibility' },
    { min: 37, max: 44, label: 'Phase 5 — State, Data & Local Storage' },
    { min: 45, max: 51, label: 'Phase 6 — Networking on Mobile' },
    { min: 52, max: 59, label: 'Phase 7 — Concurrency & Background Execution' },
    { min: 60, max: 66, label: 'Phase 8 — Device Capabilities & Native Integration' },
    { min: 67, max: 73, label: 'Phase 9 — Security & Privacy' },
    { min: 74, max: 80, label: 'Phase 10 — Performance, Testing & Observability' },
    { min: 81, max: 87, label: 'Phase 11 — Build, Release & Distribution' },
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
      aiml:    computeStats('aiml'),
      mobile:  computeStats('mobile'),
    },

    /** Re-read all stats from localStorage. Call after any progress mutation. */
    refreshStats: () => {
      set({
        stats: {
          backend: computeStats('backend'),
          ai:      computeStats('ai'),
          flutter: computeStats('flutter'),
          react:   computeStats('react'),
          aiml:    computeStats('aiml'),
          mobile:  computeStats('mobile'),
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
