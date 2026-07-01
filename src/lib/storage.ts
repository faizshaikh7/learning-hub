import type { TrackProgress, StreakData, StreakHistory, Note, XPState, InterviewSession, ReviewItem } from '@/types'

const STORAGE_KEYS = {
  progress: (prefix: string) => `${prefix}_progress`,
  streak: (prefix: string) => `${prefix}_streak`,
  streakHistory: (prefix: string) => `${prefix}_streak_history`,
  notes: 'hub_notes',
  xp: 'hub_xp',
  timer: 'hub_timer',
  interview: 'hub_interview_sessions',
  review: 'hub_review_items',
} as const

/** Safely parse JSON from localStorage, returning fallback on error. */
function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

/** Safely write JSON to localStorage. */
function safeSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    console.error('localStorage write failed for key:', key)
  }
}

/** Read all topic progress for a track. */
export function getProgress(prefix: string): TrackProgress {
  return safeGet<TrackProgress>(STORAGE_KEYS.progress(prefix), {})
}

/** Write topic progress for a track. */
export function setProgress(prefix: string, progress: TrackProgress): void {
  safeSet(STORAGE_KEYS.progress(prefix), progress)
}

/** Mark a single topic status. */
export function setTopicStatus(prefix: string, topicId: string, status: TrackProgress[string]): void {
  const progress = getProgress(prefix)
  progress[topicId] = status
  setProgress(prefix, progress)
}

/** Read streak data for a track. */
export function getStreak(prefix: string): StreakData {
  return safeGet<StreakData>(STORAGE_KEYS.streak(prefix), { count: 0, lastDate: '' })
}

/** Write streak data for a track. */
export function setStreak(prefix: string, streak: StreakData): void {
  safeSet(STORAGE_KEYS.streak(prefix), streak)
}

/** Read streak history (date → studied) for a track. */
export function getStreakHistory(prefix: string): StreakHistory {
  return safeGet<StreakHistory>(STORAGE_KEYS.streakHistory(prefix), {})
}

/** Mark today as studied for a track, updating streak. */
export function recordStudyDay(prefix: string): void {
  const today = new Date().toISOString().split('T')[0]
  const history = getStreakHistory(prefix)
  history[today] = true
  safeSet(STORAGE_KEYS.streakHistory(prefix), history)

  const streak = getStreak(prefix)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  if (streak.lastDate === today) return
  const newCount = streak.lastDate === yesterdayStr ? streak.count + 1 : 1
  setStreak(prefix, { count: newCount, lastDate: today })
}

/** Read all notes across all tracks. */
export function getNotes(): Note[] {
  return safeGet<Note[]>(STORAGE_KEYS.notes, [])
}

/** Write a note (create or update by id). */
export function saveNote(note: Note): void {
  const notes = getNotes().filter(n => n.id !== note.id)
  safeSet(STORAGE_KEYS.notes, [...notes, note])
}

/** Delete a note by id. */
export function deleteNote(noteId: string): void {
  const notes = getNotes().filter(n => n.id !== noteId)
  safeSet(STORAGE_KEYS.notes, notes)
}

/** Read XP state. */
export function getXP(): XPState {
  return safeGet<XPState>(STORAGE_KEYS.xp, {
    totalXP: 0, level: 1, dailyXP: 0, lastDate: '', achievements: [],
  })
}

/** Write XP state. */
export function setXP(xp: XPState): void {
  safeSet(STORAGE_KEYS.xp, xp)
}

// ─── Interview sessions ─────────────────────────────────────────────────────

/** Read all completed interview sessions across tracks. */
export function getInterviewSessions(): InterviewSession[] {
  return safeGet<InterviewSession[]>(STORAGE_KEYS.interview, [])
}

/** Append a completed interview session. */
export function saveInterviewSession(session: InterviewSession): void {
  const sessions = getInterviewSessions()
  safeSet(STORAGE_KEYS.interview, [...sessions, session])
}

/** Clear interview history (all tracks). */
export function clearInterviewSessions(): void {
  safeSet(STORAGE_KEYS.interview, [])
}

// ─── Spaced-repetition review ───────────────────────────────────────────────

/** Read all review items (spaced-repetition memory bank). */
export function getReviewItems(): ReviewItem[] {
  return safeGet<ReviewItem[]>(STORAGE_KEYS.review, [])
}

/** Create or update a review item by id. */
export function saveReviewItem(item: ReviewItem): void {
  const items = getReviewItems().filter(i => i.id !== item.id)
  safeSet(STORAGE_KEYS.review, [...items, item])
}

/** Delete a review item by id. */
export function deleteReviewItem(id: string): void {
  safeSet(STORAGE_KEYS.review, getReviewItems().filter(i => i.id !== id))
}
