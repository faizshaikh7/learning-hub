// ─── Track ────────────────────────────────────────────────────────────────────

export type TrackKey = 'backend' | 'ai' | 'flutter' | 'react'

export interface Track {
  key: TrackKey
  label: string
  subtitle: string
  emoji: string
  prefix: string
  total: number
  colorClass: string       // Tailwind bg-* class for accent
  borderClass: string      // Tailwind border-* class
  textClass: string        // Tailwind text-* class
  route: string
}

// ─── Progress ─────────────────────────────────────────────────────────────────

export type TopicStatus = 'not-started' | 'in-progress' | 'completed'

export interface TrackProgress {
  [topicId: string]: TopicStatus
}

export interface StreakData {
  count: number
  lastDate: string  // YYYY-MM-DD
}

export interface StreakHistory {
  [date: string]: boolean  // YYYY-MM-DD → studied that day
}

export interface TrackStats {
  completed: number
  total: number
  pct: number
  streak: number
  recentDates: string[]  // last 7 days as YYYY-MM-DD strings
  currentPhase: string
}

// ─── Curriculum ───────────────────────────────────────────────────────────────

export interface EfficientApproach {
  name: string
  verdict: 'best' | 'ok' | 'weak'
  reason: string
}

export interface EfficientWay {
  title: string
  approaches: EfficientApproach[]
  recommendation: string
}

export interface CodeExample {
  lang: string
  label: string
  code: string
}

export interface CurriculumTopic {
  id: string
  phase: number
  phaseName: string
  orderIndex: number
  estimatedMins: number
  prerequisites: string[]
  title: string
  eli5: string
  analogy: string
  explanation: string
  technicalDeep: string
  whatBreaks: string
  efficientWay: EfficientWay
  commonMistakes: string[]
  seniorNotes: string
  interviewQuestions: string[]
  codeExamples: CodeExample[]
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────

export type QuizDifficulty = 'beginner' | 'mid' | 'senior'

export interface ConceptQuiz {
  id: string
  topic: string
  difficulty: QuizDifficulty
  q: string
  options: string[]
  answer: number
  explanation: string
}

export interface DebugQuiz {
  id: string
  topic: string
  difficulty: QuizDifficulty
  q: string
  options: string[]
  answer: number
  explanation: string
}

export interface ArchitectureQuiz {
  id: string
  topic: string
  difficulty: QuizDifficulty
  q: string
  expertAnswer: string
  keyPoints: string[]
}

export interface QuizData {
  concept: ConceptQuiz[]
  debug: DebugQuiz[]
  architecture: ArchitectureQuiz[]
}

// ─── Flashcard ────────────────────────────────────────────────────────────────

export interface Flashcard {
  id: string
  q: string
  a: string
}

export interface FlashcardData {
  [topicId: string]: Flashcard[]
}

// ─── Notes ────────────────────────────────────────────────────────────────────

export interface Note {
  id: string
  topicId: string
  track: TrackKey
  content: string
  createdAt: string  // ISO timestamp
  updatedAt: string  // ISO timestamp
}

// ─── XP ───────────────────────────────────────────────────────────────────────

export interface XPState {
  totalXP: number
  level: number
  dailyXP: number
  lastDate: string  // YYYY-MM-DD
  achievements: string[]  // achievement ids earned
}

export const XP_LEVELS = [
  { level: 1,  title: 'Beginner',      minXP: 0,    maxXP: 100   },
  { level: 2,  title: 'Learner',       minXP: 100,  maxXP: 300   },
  { level: 3,  title: 'Developer',     minXP: 300,  maxXP: 600   },
  { level: 4,  title: 'Engineer',      minXP: 600,  maxXP: 1000  },
  { level: 5,  title: 'Senior Dev',    minXP: 1000, maxXP: 1600  },
  { level: 6,  title: 'Tech Lead',     minXP: 1600, maxXP: 2500  },
  { level: 7,  title: 'Architect',     minXP: 2500, maxXP: 4000  },
  { level: 8,  title: 'Staff Eng',     minXP: 4000, maxXP: 6000  },
  { level: 9,  title: 'Principal',     minXP: 6000, maxXP: 9000  },
  { level: 10, title: 'Distinguished', minXP: 9000, maxXP: Infinity },
] as const

// ─── Phase labels ─────────────────────────────────────────────────────────────

export interface PhaseRange {
  min: number
  max: number
  label: string
}

// ─── Timer ────────────────────────────────────────────────────────────────────

export type TimerMode = 'focus' | 'short-break' | 'long-break'

export interface TimerState {
  mode: TimerMode
  secondsLeft: number
  isRunning: boolean
  sessionsCompleted: number
  totalFocusMinutes: number
}
