import { useNavigate } from 'react-router-dom'
import { Zap, Settings, LogOut } from 'lucide-react'
import { useTrackStore } from '@/store/trackStore'
import { usePathStore } from '@/store/pathStore'
import { useAuthStore } from '@/store/authStore'
import TrackCard, { TRACKS } from '@/components/hub/TrackCard'
import StatsBar from '@/components/hub/StatsBar'
import LearningPath from '@/components/hub/LearningPath'
import ActivityHeatmap from '@/components/hub/ActivityHeatmap'
import WeeklyDigest from '@/components/hub/WeeklyDigest'
import type { Track } from '@/types'

/**
 * HubScreen — main dashboard landing page for the Learning Hub application.
 * Displays aggregate stats, a personal learning-path planner, track cards with
 * live progress, a 365-day activity heatmap, and a weekly digest. Acts as the
 * central navigation hub to individual track tutor screens.
 */
export default function HubScreen() {
  const navigate = useNavigate()
  const stats = useTrackStore(s => s.stats)
  const path = usePathStore(s => s.path)
  const togglePath = usePathStore(s => s.toggle)
  const logout = useAuthStore(s => s.logout)

  const handleTrackClick = (track: Track) => {
    navigate(track.route)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-[90rem] mx-auto px-4 py-8 sm:px-6 lg:px-10">

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center shrink-0">
                  <Zap className="w-4.5 h-4.5 text-gray-950" fill="currentColor" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  LearnKar
                </h1>
              </div>
              <p className="text-sm text-gray-400 ml-10.5">
                Backend · AI · Flutter · React · AI/ML · Mobile
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigate('/settings')}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={() => { logout(); navigate('/login', { replace: true }) }}
                className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors"
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Stats bar */}
        <section className="mb-8" aria-label="Global statistics">
          <StatsBar />
        </section>

        {/* Main area: tracks + learning path side by side on wide screens */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8 items-start">
          {/* Track cards grid */}
          <section className="xl:col-span-2" aria-label="Learning tracks">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
              Your Tracks
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {TRACKS.map((track) => {
                const idx = path.indexOf(track.key)
                return (
                  <TrackCard
                    key={track.key}
                    track={track}
                    stats={stats[track.key]}
                    onClick={() => handleTrackClick(track)}
                    pathIndex={idx === -1 ? null : idx + 1}
                    onTogglePath={() => togglePath(track.key)}
                  />
                )
              })}
            </div>
          </section>

          {/* Learning path planner (sticky sidebar on wide screens) */}
          <section className="xl:col-span-1 xl:sticky xl:top-8" aria-label="Learning path">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
              Plan Your Journey
            </h2>
            <LearningPath />
          </section>
        </div>

        {/* Activity heatmap */}
        <section className="mb-8" aria-label="Study activity heatmap">
          <ActivityHeatmap />
        </section>

        {/* Weekly digest */}
        <section aria-label="Weekly learning digest">
          <WeeklyDigest />
        </section>

      </div>
    </div>
  )
}
