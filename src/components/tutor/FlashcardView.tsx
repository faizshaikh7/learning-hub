import { useState, useMemo, useCallback } from 'react'
import { Shuffle, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Flashcard } from '@/types'

interface FlashcardViewProps {
  flashcards: Flashcard[]
  currentTopicId: string
}

/** Fisher-Yates shuffle returning a new array. */
function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/**
 * FlashcardView — CSS 3D flip-card interface for spaced-repetition review.
 * Shows cards for the current topic or all cards if none exist for the topic.
 * Tracks "Know it" vs "Review again" per session and supports shuffle.
 */
export default function FlashcardView({ flashcards, currentTopicId }: FlashcardViewProps) {
  const baseCards = useMemo(() => {
    const filtered = flashcards.filter(c => c.id.startsWith(currentTopicId))
    return filtered.length > 0 ? filtered : flashcards
  }, [flashcards, currentTopicId])

  const [deck, setDeck] = useState<Flashcard[]>(() => [...baseCards])
  const [index, setIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [known, setKnown] = useState(0)
  const [reviewed, setReviewed] = useState(0)

  const card = deck[index]

  const handleFlip = useCallback(() => {
    setIsFlipped(f => !f)
  }, [])

  const handleKnow = useCallback(() => {
    setKnown(k => k + 1)
    setIsFlipped(false)
    setIndex(i => (i + 1) % deck.length)
  }, [deck.length])

  const handleReview = useCallback(() => {
    setReviewed(r => r + 1)
    setIsFlipped(false)
    setIndex(i => (i + 1) % deck.length)
  }, [deck.length])

  const handleShuffle = useCallback(() => {
    setDeck(shuffleArray(baseCards))
    setIndex(0)
    setIsFlipped(false)
    setKnown(0)
    setReviewed(0)
  }, [baseCards])

  if (deck.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-gray-500 text-sm">No flashcards available yet.</p>
      </div>
    )
  }

  if (!card) return null

  const total = deck.length
  const attempted = known + reviewed

  return (
    <div className="max-w-xl mx-auto px-4 py-6 flex flex-col items-center gap-6">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">
            Card <span className="text-white font-medium">{index + 1}</span> of {total}
          </span>
          {attempted > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-500/10 text-green-300 border-green-500/30 text-xs">
                {known} known
              </Badge>
              <Badge variant="outline" className="bg-red-500/10 text-red-300 border-red-500/30 text-xs">
                {reviewed} review
              </Badge>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShuffle}
          className="text-gray-400 hover:text-white h-8 gap-1.5"
        >
          <Shuffle className="h-3.5 w-3.5" />
          Shuffle
        </Button>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gray-500 rounded-full transition-all duration-300"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      {/* Flashcard — CSS 3D flip */}
      <div
        className="w-full cursor-pointer"
        style={{ perspective: '1000px' }}
        onClick={handleFlip}
        role="button"
        aria-label={isFlipped ? 'Show question' : 'Reveal answer'}
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' || e.key === ' ' ? handleFlip() : undefined}
      >
        <div
          className="relative w-full transition-transform duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            minHeight: '220px',
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 flex flex-col rounded-2xl border border-gray-700 bg-gray-900 shadow-xl shadow-black/40 p-6"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Question</span>
            <p className="text-white text-lg leading-relaxed flex-1 flex items-center">
              {card.q}
            </p>
            <p className="text-xs text-gray-600 text-center mt-4">Click to reveal answer</p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 flex flex-col rounded-2xl border border-gray-700 bg-slate-900 shadow-xl shadow-black/40 p-6"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Answer</span>
            <p className="text-gray-100 text-base leading-relaxed flex-1 flex items-center">
              {card.a}
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons — shown after flip */}
      <div className={cn(
        'w-full flex gap-3 transition-opacity duration-200',
        isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}>
        <Button
          onClick={handleReview}
          variant="outline"
          className="flex-1 border-red-500/40 text-red-300 hover:bg-red-500/10 hover:border-red-500/60 bg-transparent"
        >
          <XCircle className="h-4 w-4 mr-2" />
          Review Again
        </Button>
        <Button
          onClick={handleKnow}
          className="flex-1 bg-green-600 hover:bg-green-500 text-white"
        >
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Know it
        </Button>
      </div>

      {/* Hint when not flipped */}
      {!isFlipped && (
        <p className="text-xs text-gray-600">Tap the card or press Enter to flip</p>
      )}
    </div>
  )
}
