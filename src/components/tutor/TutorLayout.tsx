import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import TutorSidebar from '@/components/tutor/TutorSidebar'
import { useTrackStore } from '@/store/trackStore'
import { getProgress } from '@/lib/storage'
import type { CurriculumTopic, TrackKey } from '@/types'

interface TutorLayoutProps {
  track: TrackKey
  topics: CurriculumTopic[]
  activeTopic: CurriculumTopic | null
  onTopicSelect: (topic: CurriculumTopic) => void
  children: React.ReactNode
}

const TRACK_LABEL: Record<TrackKey, { label: string; emoji: string; accent: string; prefix: string }> = {
  backend: { label: 'Backend Engineering', emoji: '⚙️', accent: 'text-blue-400',   prefix: 'bt' },
  ai:      { label: 'AI Engineering',      emoji: '🧠', accent: 'text-purple-400', prefix: 'at' },
  flutter: { label: 'Flutter Dev',          emoji: '📱', accent: 'text-cyan-400',   prefix: 'ft' },
  react:   { label: 'React Dev',            emoji: '⚛️', accent: 'text-orange-400', prefix: 'rt' },
}

/**
 * TutorLayout — shared app shell for all 4 tutor screens.
 * Renders a fixed 320px sidebar on desktop, a Sheet drawer on mobile,
 * and a scrollable main content area.
 */
export default function TutorLayout({
  track,
  topics,
  activeTopic,
  onTopicSelect,
  children,
}: TutorLayoutProps) {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { stats } = useTrackStore()

  const trackInfo = TRACK_LABEL[track]
  const trackStats = stats[track]
  const progress = getProgress(trackInfo.prefix)

  const handleTopicSelect = (topic: CurriculumTopic) => {
    onTopicSelect(topic)
    setMobileOpen(false)
  }

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-80 shrink-0 border-r border-gray-800">
        {/* Sidebar header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span>{trackInfo.emoji}</span>
              <span className={cn('font-semibold text-sm truncate', trackInfo.accent)}>
                {trackInfo.label}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Progress
                value={trackStats.pct}
                className="h-1.5 flex-1 bg-gray-800"
              />
              <span className="text-xs text-gray-400 shrink-0">{trackStats.pct}%</span>
            </div>
          </div>
        </div>

        {/* Phase badge */}
        <div className="px-4 py-2 border-b border-gray-800">
          <Badge
            variant="outline"
            className="text-xs text-gray-400 border-gray-700 bg-gray-800/50"
          >
            {trackStats.currentPhase}
          </Badge>
        </div>

        <TutorSidebar
          topics={topics}
          activeTopic={activeTopic}
          onSelect={handleTopicSelect}
          track={track}
          progress={progress}
        />
      </aside>

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-gray-800 bg-gray-900 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span>{trackInfo.emoji}</span>
              <span className={cn('font-semibold text-sm truncate', trackInfo.accent)}>
                {trackInfo.label}
              </span>
            </div>
          </div>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="p-0 w-80 bg-gray-900 border-gray-800"
            >
              <div className="px-4 py-3 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <span>{trackInfo.emoji}</span>
                  <span className={cn('font-semibold text-sm', trackInfo.accent)}>
                    {trackInfo.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Progress
                    value={trackStats.pct}
                    className="h-1.5 flex-1 bg-gray-800"
                  />
                  <span className="text-xs text-gray-400">{trackStats.pct}%</span>
                </div>
              </div>
              <TutorSidebar
                topics={topics}
                activeTopic={activeTopic}
                onSelect={handleTopicSelect}
                track={track}
                progress={progress}
              />
            </SheetContent>
          </Sheet>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
