import { type ReactNode, useState, useRef, useEffect, useMemo } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TabItem {
  key: string
  label: string
  icon: ReactNode
}

type Accent = 'blue' | 'purple' | 'cyan' | 'orange' | 'emerald'

interface TabBarProps {
  tabs: TabItem[]
  activeTab: string
  onSelect: (key: string) => void
  accentColor: Accent
  /** Keys shown inline; the rest fold into the "More" menu. */
  primaryKeys?: string[]
}

const ACTIVE: Record<Accent, string> = {
  blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
}

const DEFAULT_PRIMARY = ['lesson', 'quiz', 'cards', 'review', 'notes', 'roadmap', 'timer']

/**
 * TabBar — renders the primary learning tabs inline and folds the rest
 * (advanced tools & reference) into a "More ▾" dropdown so the bar stays tidy.
 */
export default function TabBar({
  tabs,
  activeTab,
  onSelect,
  accentColor,
  primaryKeys = DEFAULT_PRIMARY,
}: TabBarProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const activeCls = ACTIVE[accentColor]

  const { primary, overflow } = useMemo(() => {
    const primarySet = new Set(primaryKeys)
    return {
      primary: tabs.filter(t => primarySet.has(t.key)),
      overflow: tabs.filter(t => !primarySet.has(t.key)),
    }
  }, [tabs, primaryKeys])

  const activeOverflow = overflow.find(t => t.key === activeTab)

  // Close the menu on outside click or Escape
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const tabButton = (tab: TabItem) => (
    <button
      key={tab.key}
      onClick={() => onSelect(tab.key)}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors border border-transparent',
        activeTab === tab.key ? activeCls : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60',
      )}
    >
      {tab.icon}
      <span className="hidden sm:inline">{tab.label}</span>
    </button>
  )

  return (
    <nav className="flex items-center gap-1 min-w-0 flex-1">
      {/* Primary tabs (scroll if cramped) */}
      <div className="flex gap-1 overflow-x-auto scrollbar-hide">
        {primary.map(tabButton)}
      </div>

      {/* More dropdown */}
      {overflow.length > 0 && (
        <div ref={menuRef} className="relative shrink-0">
          <button
            onClick={() => setOpen(o => !o)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors border',
              activeOverflow
                ? activeCls
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60 border-transparent',
            )}
            aria-haspopup="menu"
            aria-expanded={open}
          >
            {activeOverflow ? (
              <>
                {activeOverflow.icon}
                <span className="hidden sm:inline">{activeOverflow.label}</span>
              </>
            ) : (
              <span>More</span>
            )}
            <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', open && 'rotate-180')} />
          </button>

          {open && (
            <div
              className="absolute right-0 mt-1.5 z-40 w-52 rounded-xl border border-gray-800 bg-gray-900 shadow-2xl p-1.5"
              role="menu"
            >
              {overflow.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => { onSelect(tab.key); setOpen(false) }}
                  role="menuitem"
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left',
                    activeTab === tab.key ? activeCls : 'text-gray-300 hover:bg-gray-800',
                  )}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
