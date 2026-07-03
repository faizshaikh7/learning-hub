// ─── Track ────────────────────────────────────────────────────────────────────

export type TrackKey = 'backend' | 'ai' | 'flutter' | 'react' | 'aiml'

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

/** An external learning resource linked from a topic (video, book, docs…). */
export interface TopicResource {
  label: string
  url: string
  kind: 'video' | 'course' | 'book' | 'article' | 'docs' | 'repo' | 'practice'
}

/** A named concept within a topic — each gets 2-4 paragraphs of explanation. */
export interface TopicConcept {
  title: string
  body: string
  code?: CodeExample
}

/** A hands-on exercise to complete after reading the lesson. */
export interface PracticalExercise {
  title: string
  objective: string
  steps: string[]
  hints: string[]
  expectedOutput: string
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
  interviewAnswers?: string[]       // model answers paired with interviewQuestions
  codeExamples: CodeExample[]
  concepts?: TopicConcept[]          // 4-8 named concept deep-dives
  practicalExercise?: PracticalExercise
  resources?: TopicResource[]        // external videos/books/docs to go deeper
}

// ─── Case Studies ─────────────────────────────────────────────────────────────

export interface CaseStudyDecision {
  decision: string
  why: string
  tradeoffs: string
}

export interface CaseStudy {
  id: string
  company: string
  logo: string             // emoji stand-in
  title: string
  industry: string
  scale: string            // e.g. "2B users · 100B messages/day"
  problem: string          // the engineering challenge they faced
  solution: string         // how they solved it (2-4 paragraphs)
  techStack: string[]
  architecture: string     // architectural insight (2-3 paragraphs)
  keyDecisions: CaseStudyDecision[]
  results: string[]        // measurable outcomes
  lessonsLearned: string[]
  relevantTopics: string[] // topic IDs this relates to
  estimatedMins: number
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────

/** A single stage/phase within a lifecycle flow. */
export interface LifecycleStage {
  name: string
  shortLabel: string          // compact label for the flow diagram node
  description: string         // 1-3 sentences: what happens in this stage
  details: string[]           // key things that occur / you must know
  code?: CodeExample          // optional code illustrating this stage
  gotchas?: string[]          // pitfalls / what breaks at this stage
  durationHint?: string       // e.g. "~50ms", "once", "every render"
}

/** A named lifecycle (e.g. "React Component Lifecycle", "ML Model Lifecycle"). */
export interface Lifecycle {
  id: string
  title: string
  subtitle: string
  icon: string                // emoji stand-in shown on the card
  flow: 'linear' | 'cyclic'   // linear = start→end, cyclic = loops back
  overview: string            // 2-4 sentence intro to the lifecycle
  stages: LifecycleStage[]
  keyTakeaways: string[]
  interviewNotes: string[]
  relatedTopics: string[]     // curriculum topic ids this maps to
}

// ─── Interview ────────────────────────────────────────────────────────────────

/** A job role a learner can target with a given course. */
export interface InterviewRole {
  id: string
  title: string            // e.g. "Backend Engineer"
  seniority: string        // e.g. "Junior → Mid" / "Mid → Senior"
  icon: string             // emoji stand-in
  description: string      // what the role actually does day to day
  focus: string[]          // core skill areas this role is judged on
  demandNote: string       // market demand / comp signal
}

/** The three real-world interview rounds. */
export type InterviewLevel = 'screen' | 'technical' | 'design'

export type InterviewCategory = 'concept' | 'debugging' | 'design' | 'behavioral' | 'tradeoff'

/** A single interview question with a model answer and rubric. */
export interface InterviewQuestion {
  id: string
  level: InterviewLevel
  difficulty: QuizDifficulty      // beginner | mid | senior
  roleIds?: string[]              // if omitted, applies to every role in the course
  category: InterviewCategory
  question: string
  modelAnswer: string             // what a strong answer sounds like
  keyPoints: string[]             // signals an interviewer listens for
  followUp?: string               // a likely follow-up probe
  redFlags?: string[]             // answers that sink the candidate
  topicId?: string                // related curriculum topic id
}

/** A per-course bank of roles and questions. */
export interface InterviewBank {
  roles: InterviewRole[]
  questions: InterviewQuestion[]
}

/** Persisted result of one completed interview session. */
export interface InterviewSession {
  id: string
  track: TrackKey
  roleId: string
  date: string                    // ISO date
  roundScores: Record<InterviewLevel, number>  // 0-100 per round
  overall: number                 // 0-100
  verdict: 'strong-hire' | 'hire' | 'lean-hire' | 'no-hire'
  weakTopicIds: string[]
}

// ─── Review (spaced repetition) ─────────────────────────────────────────────────

/**
 * A card in the spaced-repetition memory bank. Scheduling uses an SM-2-style
 * algorithm: correct recalls grow the interval, lapses reset it.
 */
export interface ReviewItem {
  id: string                 // stable id, e.g. `${track}:${topicId}`
  track: TrackKey
  topicId: string
  topicTitle: string
  front: string              // prompt / question shown first
  back: string               // answer revealed
  ease: number               // SM-2 ease factor (starts 2.5)
  intervalDays: number       // current interval in days
  repetitions: number        // consecutive successful recalls
  dueDate: string            // ISO date when next due
  lastReviewed: string       // ISO date of last review ('' if never)
  createdAt: string          // ISO date added
}

/** Recall grade for a review (maps to SM-2 quality). */
export type ReviewGrade = 'again' | 'hard' | 'good' | 'easy'

// ─── Comparisons ────────────────────────────────────────────────────────────────

/** One row (dimension) in a comparison table. `values` aligns with `contenders`. */
export interface ComparisonRow {
  dimension: string
  values: string[]
}

/** A standard "X vs Y vs Z" comparison. */
export interface Comparison {
  id: string
  title: string              // e.g. "REST vs GraphQL vs gRPC"
  subtitle: string
  category: string           // grouping, e.g. "APIs", "Databases"
  contenders: string[]       // column headers
  rows: ComparisonRow[]
  verdict: string            // the bottom line
  whenToUse: { choice: string; when: string }[]
}

// ─── Cheat Sheets ───────────────────────────────────────────────────────────────

export interface CheatEntry {
  label: string              // e.g. "200 OK" / "git rebase -i"
  value: string              // description or snippet
  code?: boolean             // render value as monospace
}

export interface CheatSection {
  heading: string
  entries: CheatEntry[]
}

export interface Cheatsheet {
  id: string
  title: string
  subtitle: string
  icon: string
  sections: CheatSection[]
}

// ─── Concept Map ────────────────────────────────────────────────────────────────

/** A node in the concept map, optionally linked to related nodes. */
export interface ConceptNode {
  id: string
  label: string
  summary: string
  topicId?: string
  relatesTo?: { id: string; relation: string }[]  // e.g. { id, relation: "enables" }
}

/** A themed cluster of related concepts. */
export interface ConceptCluster {
  id: string
  name: string
  concepts: ConceptNode[]
}

export interface ConceptMap {
  title: string
  intro: string
  clusters: ConceptCluster[]
}

// ─── Projects & Daily Challenges ─────────────────────────────────────────────────

export interface ProjectMilestone {
  title: string
  tasks: string[]
}

export interface Project {
  id: string
  title: string
  tagline: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string          // e.g. "8-12 hrs"
  description: string
  whatYouLearn: string[]
  techStack: string[]            // with versions where relevant
  features: string[]             // MVP feature list
  milestones: ProjectMilestone[]
  stretchGoals: string[]
  relevantTopics: string[]
}

export interface DailyChallenge {
  id: string
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  prompt: string
  hint: string
  focus: string                  // topic area label
  topicId?: string
}

export interface ProjectsBank {
  projects: Project[]
  dailyChallenges: DailyChallenge[]
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
  /** Optional mnemonic hint shown on the answer side */
  hint?: string
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
