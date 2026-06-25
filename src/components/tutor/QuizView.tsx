import { useState, useMemo, useCallback } from 'react'
import { CheckCircle2, XCircle, ChevronRight, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import type { QuizData, ConceptQuiz, DebugQuiz, ArchitectureQuiz, QuizDifficulty } from '@/types'

interface QuizViewProps {
  quizData: QuizData
  currentTopicId: string
}

const DIFFICULTY_STYLES: Record<QuizDifficulty, string> = {
  beginner: 'bg-green-500/15 text-green-300 border-green-500/30',
  mid:      'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
  senior:   'bg-red-500/15 text-red-300 border-red-500/30',
}

/** Shuffles an array using Fisher-Yates algorithm (returns new array). */
function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/** Multiple choice question panel used for both Concept and Debug tabs. */
const MultiChoicePanel = ({
  questions,
}: {
  questions: (ConceptQuiz | DebugQuiz)[]
}) => {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [shuffled] = useState(() => shuffleArray(questions))

  const question = shuffled[index]

  const handleAnswer = useCallback((optIdx: number) => {
    if (selected !== null || !question) return
    setSelected(optIdx)
    setScore(s => ({
      correct: s.correct + (optIdx === question.answer ? 1 : 0),
      total: s.total + 1,
    }))
  }, [selected, question])

  const handleNext = useCallback(() => {
    setSelected(null)
    setIndex(i => (i + 1) % shuffled.length)
  }, [shuffled.length])

  const handleReset = useCallback(() => {
    setSelected(null)
    setIndex(0)
    setScore({ correct: 0, total: 0 })
  }, [])

  if (!question) {
    return (
      <div className="text-center py-12 text-gray-500">
        No questions available for this topic.
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Score + Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn('text-xs', DIFFICULTY_STYLES[question.difficulty])}>
            {question.difficulty}
          </Badge>
          <span className="text-sm text-gray-400">
            Q {index + 1} / {shuffled.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-300">
            Score: <span className="text-white font-medium">{score.correct}/{score.total}</span>
          </span>
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-gray-400 hover:text-white h-8">
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Question */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="pt-5">
          <p className="text-white text-base leading-relaxed whitespace-pre-wrap">{question.q}</p>
        </CardContent>
      </Card>

      {/* Options */}
      <div className="space-y-2.5">
        {question.options.map((opt, i) => {
          const isCorrect = i === question.answer
          const isSelected = selected === i

          let style = 'border-gray-700 text-gray-300 hover:bg-gray-800/60 hover:border-gray-600'
          if (selected !== null) {
            if (isCorrect) style = 'border-green-500/60 bg-green-500/10 text-green-300'
            else if (isSelected) style = 'border-red-500/60 bg-red-500/10 text-red-300'
            else style = 'border-gray-800 text-gray-500 opacity-60'
          }

          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={selected !== null}
              className={cn(
                'w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors flex items-center gap-3',
                style
              )}
            >
              <span className="shrink-0 w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs font-bold">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{opt}</span>
              {selected !== null && isCorrect && <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />}
              {selected !== null && isSelected && !isCorrect && <XCircle className="h-4 w-4 text-red-400 shrink-0" />}
            </button>
          )
        })}
      </div>

      {/* Explanation */}
      {selected !== null && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2 pt-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Explanation</p>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-gray-200 text-sm leading-relaxed">{question.explanation}</p>
          </CardContent>
        </Card>
      )}

      {/* Next */}
      {selected !== null && (
        <div className="flex justify-end">
          <Button onClick={handleNext} size="sm" className="bg-gray-700 hover:bg-gray-600 text-white">
            Next Question
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  )
}

/** Architecture open-ended question panel with reveal toggle. */
const ArchitecturePanel = ({ questions }: { questions: ArchitectureQuiz[] }) => {
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [shuffled] = useState(() => shuffleArray(questions))

  const question = shuffled[index]

  const handleNext = useCallback(() => {
    setRevealed(false)
    setIndex(i => (i + 1) % shuffled.length)
  }, [shuffled.length])

  if (!question) {
    return (
      <div className="text-center py-12 text-gray-500">
        No architecture questions available.
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Badge variant="outline" className={cn('text-xs', DIFFICULTY_STYLES[question.difficulty])}>
          {question.difficulty}
        </Badge>
        <span className="text-sm text-gray-400">Q {index + 1} / {shuffled.length}</span>
      </div>

      {/* Question */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="pt-5">
          <p className="text-white text-base leading-relaxed">{question.q}</p>
        </CardContent>
      </Card>

      {/* Reveal button */}
      {!revealed && (
        <Button
          onClick={() => setRevealed(true)}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white"
        >
          Reveal Expert Answer
        </Button>
      )}

      {/* Answer */}
      {revealed && (
        <>
          <Card className="bg-indigo-950/20 border-indigo-900/30">
            <CardHeader className="pb-2 pt-4">
              <p className="text-xs font-semibold text-indigo-300/70 uppercase tracking-wider">Expert Answer</p>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-indigo-100 text-sm leading-relaxed">{question.expertAnswer}</p>
            </CardContent>
          </Card>

          {question.keyPoints.length > 0 && (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2 pt-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Key Points</p>
              </CardHeader>
              <CardContent className="pb-4">
                <ul className="space-y-2">
                  {question.keyPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-400 shrink-0 mt-0.5" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end">
            <Button onClick={handleNext} size="sm" className="bg-gray-700 hover:bg-gray-600 text-white">
              Next Question
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

/**
 * QuizView — three-tab quiz interface with Concept (multiple choice),
 * Debug (multiple choice), and Architecture (open-ended reveal) modes.
 * Filters questions to the current topic, falling back to all questions
 * when no topic-specific questions exist.
 */
export default function QuizView({ quizData, currentTopicId }: QuizViewProps) {
  const conceptQ = useMemo(() => {
    const filtered = quizData.concept.filter(q => q.topic === currentTopicId)
    return filtered.length > 0 ? filtered : quizData.concept
  }, [quizData.concept, currentTopicId])

  const debugQ = useMemo(() => {
    const filtered = quizData.debug.filter(q => q.topic === currentTopicId)
    return filtered.length > 0 ? filtered : quizData.debug
  }, [quizData.debug, currentTopicId])

  const archQ = useMemo(() => {
    const filtered = quizData.architecture.filter(q => q.topic === currentTopicId)
    return filtered.length > 0 ? filtered : quizData.architecture
  }, [quizData.architecture, currentTopicId])

  const hasAny = quizData.concept.length > 0 || quizData.debug.length > 0 || quizData.architecture.length > 0

  if (!hasAny) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-gray-500 text-sm">No quiz questions available yet.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Tabs defaultValue="concept">
        <TabsList className="w-full bg-gray-900 border border-gray-800 mb-6">
          <TabsTrigger value="concept" className="flex-1 data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400">
            Concept ({conceptQ.length})
          </TabsTrigger>
          <TabsTrigger value="debug" className="flex-1 data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400">
            Debug ({debugQ.length})
          </TabsTrigger>
          <TabsTrigger value="architecture" className="flex-1 data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400">
            Architecture ({archQ.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="concept">
          {conceptQ.length === 0
            ? <p className="text-center py-8 text-gray-500 text-sm">No concept questions yet.</p>
            : <MultiChoicePanel key={`concept-${currentTopicId}`} questions={conceptQ} />
          }
        </TabsContent>

        <TabsContent value="debug">
          {debugQ.length === 0
            ? <p className="text-center py-8 text-gray-500 text-sm">No debug questions yet.</p>
            : <MultiChoicePanel key={`debug-${currentTopicId}`} questions={debugQ} />
          }
        </TabsContent>

        <TabsContent value="architecture">
          {archQ.length === 0
            ? <p className="text-center py-8 text-gray-500 text-sm">No architecture questions yet.</p>
            : <ArchitecturePanel key={`arch-${currentTopicId}`} questions={archQ} />
          }
        </TabsContent>
      </Tabs>
    </div>
  )
}
