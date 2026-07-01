import type { ReviewItem, ReviewGrade, TrackKey } from '@/types'

/** ISO date (YYYY-MM-DD) N days from today. */
function isoInDays(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

/** Today's ISO date (YYYY-MM-DD). */
export function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}

/** Create a fresh review card, due immediately. */
export function createReviewItem(params: {
  track: TrackKey
  topicId: string
  topicTitle: string
  front: string
  back: string
}): ReviewItem {
  return {
    id: `${params.track}:${params.topicId}:${Date.now()}`,
    track: params.track,
    topicId: params.topicId,
    topicTitle: params.topicTitle,
    front: params.front,
    back: params.back,
    ease: 2.5,
    intervalDays: 0,
    repetitions: 0,
    dueDate: todayISO(),
    lastReviewed: '',
    createdAt: todayISO(),
  }
}

/**
 * Apply an SM-2-style update to a review item given a recall grade.
 * Returns a new item with an updated interval, ease, and due date.
 */
export function scheduleReview(item: ReviewItem, grade: ReviewGrade): ReviewItem {
  let { ease, intervalDays, repetitions } = item

  switch (grade) {
    case 'again':
      repetitions = 0
      intervalDays = 0            // due again today
      ease = Math.max(1.3, ease - 0.2)
      break
    case 'hard':
      repetitions += 1
      intervalDays = Math.max(1, Math.round(intervalDays * 1.2))
      ease = Math.max(1.3, ease - 0.15)
      break
    case 'good':
      repetitions += 1
      if (repetitions === 1) intervalDays = 1
      else if (repetitions === 2) intervalDays = 3
      else intervalDays = Math.round(intervalDays * ease)
      break
    case 'easy':
      repetitions += 1
      if (repetitions === 1) intervalDays = 2
      else if (repetitions === 2) intervalDays = 5
      else intervalDays = Math.round(intervalDays * ease * 1.3)
      ease = Math.min(3.0, ease + 0.15)
      break
  }

  return {
    ...item,
    ease,
    intervalDays,
    repetitions,
    dueDate: isoInDays(intervalDays),
    lastReviewed: todayISO(),
  }
}

/** True if the card is due for review today or earlier. */
export function isDue(item: ReviewItem): boolean {
  return item.dueDate <= todayISO()
}

/** A human-readable "next due" label. */
export function dueLabel(item: ReviewItem): string {
  if (isDue(item)) return 'Due now'
  const today = new Date(todayISO())
  const due = new Date(item.dueDate)
  const days = Math.round((due.getTime() - today.getTime()) / 86400000)
  if (days === 1) return 'Due tomorrow'
  if (days < 7) return `Due in ${days} days`
  if (days < 30) return `Due in ${Math.round(days / 7)} wk`
  return `Due in ${Math.round(days / 30)} mo`
}
