import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Download,
  Upload,
  Trash2,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Database,
  Shield,
  Info,
  Sun,
  Moon,
  Palette,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useThemeStore } from '@/store/themeStore'

// ─── Constants ────────────────────────────────────────────────────────────────

const TRACKS = [
  { key: 'bt', label: 'Backend Engineering', accent: 'blue' },
  { key: 'at', label: 'AI Engineering',      accent: 'purple' },
  { key: 'ft', label: 'Flutter',             accent: 'cyan' },
  { key: 'rt', label: 'React + Next.js',     accent: 'orange' },
  { key: 'ml', label: 'AI/ML In-Depth',      accent: 'emerald' },
  { key: 'mb', label: 'Mobile Development',   accent: 'rose' },
] as const

/** Every localStorage key owned by this app. */
const ALL_KEYS = [
  ...['bt', 'at', 'ft', 'rt', 'ml', 'mb'].flatMap(p => [
    `${p}_progress`,
    `${p}_streak`,
    `${p}_streak_history`,
  ]),
  'hub_notes',
  'hub_xp',
  'hub_timer',
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Safely parse a localStorage value. */
function lsGet(key: string): unknown {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : undefined
  } catch {
    return undefined
  }
}

/** Safely write a value to localStorage. */
function lsSet(key: string, value: unknown): void {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* silent */ }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface RowAction {
  id: string
  pending: string | null
  setPending: (v: string | null) => void
  onConfirm: () => void
  confirmLabel?: string
  buttonLabel: string
  buttonIcon: React.ReactNode
  dangerous?: boolean
}

/** Reusable confirm-on-click row action button. */
function ConfirmAction({
  id, pending, setPending, onConfirm,
  confirmLabel = 'Confirm', buttonLabel, buttonIcon, dangerous,
}: RowAction) {
  if (pending === id) {
    return (
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => setPending(null)}
          className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => { onConfirm(); setPending(null) }}
          className={cn(
            'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
            dangerous
              ? 'bg-red-500/30 hover:bg-red-500/40 border border-red-500/50 text-red-300'
              : 'bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/40 text-yellow-300',
          )}
        >
          {confirmLabel}
        </button>
      </div>
    )
  }
  return (
    <button
      onClick={() => setPending(id)}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium shrink-0 transition-colors',
        dangerous
          ? 'bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400'
          : 'bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-400',
      )}
    >
      {buttonIcon}
      {buttonLabel}
    </button>
  )
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

/**
 * SettingsScreen — manage backups, reset individual tracks, wipe all data.
 * All data lives in localStorage; nothing is sent to a server.
 */
export default function SettingsScreen() {
  const navigate = useNavigate()
  const { theme, setTheme } = useThemeStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pending, setPending] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  /** Display a brief toast, auto-dismiss after 3 s. */
  function showToast(msg: string, ok = true) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  /** Export all app data as a downloadable JSON file. */
  function handleExport() {
    const snapshot: Record<string, unknown> = {}
    for (const key of ALL_KEYS) {
      const val = lsGet(key)
      if (val !== undefined) snapshot[key] = val
    }
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `learning-hub-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Backup exported — check your Downloads folder')
  }

  /** Import data from a JSON backup file and restore into localStorage. */
  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = evt => {
      try {
        const data = JSON.parse(evt.target?.result as string) as Record<string, unknown>
        let count = 0
        for (const [key, val] of Object.entries(data)) {
          if (ALL_KEYS.includes(key)) { lsSet(key, val); count++ }
        }
        showToast(`Restored ${count} data keys — reload to apply`)
      } catch {
        showToast('Invalid backup file', false)
      }
    }
    reader.readAsText(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  /** Remove all localStorage keys for a single track. */
  function resetTrack(prefix: string, label: string) {
    [`${prefix}_progress`, `${prefix}_streak`, `${prefix}_streak_history`].forEach(
      k => localStorage.removeItem(k),
    )
    showToast(`${label} progress cleared`)
  }

  /** Remove all track keys. */
  function resetAllProgress() {
    ['bt', 'at', 'ft', 'rt', 'ml', 'mb'].forEach(p =>
      [`${p}_progress`, `${p}_streak`, `${p}_streak_history`].forEach(
        k => localStorage.removeItem(k),
      ),
    )
    showToast('All track progress cleared')
  }

  /** Wipe the XP / level record. */
  function resetXP() {
    localStorage.removeItem('hub_xp')
    showToast('XP and level reset to zero')
  }

  /** Delete every saved note. */
  function resetNotes() {
    localStorage.removeItem('hub_notes')
    showToast('All notes deleted')
  }

  /** Remove every key owned by this app. */
  function wipeAll() {
    ALL_KEYS.forEach(k => localStorage.removeItem(k))
    showToast('Everything wiped — reload to start fresh')
  }

  // Approximate storage footprint (2 bytes per char for UTF-16 in browser)
  const storageBytes = ALL_KEYS.reduce((total, key) => {
    return total + (localStorage.getItem(key)?.length ?? 0) * 2
  }, 0)
  const storageKB = (storageBytes / 1024).toFixed(1)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:px-6">

        {/* Header */}
        <header className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            aria-label="Back to hub"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-sm text-gray-400 mt-0.5">Data, backups &amp; resets</p>
          </div>
        </header>

        {/* Toast notification */}
        {toast && (
          <div
            className={cn(
              'fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-2xl border',
              toast.ok
                ? 'bg-green-500/15 border-green-500/30 text-green-400'
                : 'bg-red-500/15 border-red-500/30 text-red-400',
            )}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {toast.msg}
          </div>
        )}

        {/* ── Section: Appearance ── */}
        <section className="mb-6">
          <SectionHeading icon={<Palette className="w-3.5 h-3.5" />} label="Appearance" />
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <p className="text-sm font-medium text-white mb-3">Theme</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTheme('dark')}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                  theme === 'dark'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-700 hover:border-gray-600',
                )}
              >
                <div className="w-10 h-10 rounded-lg bg-gray-950 flex items-center justify-center border border-gray-800">
                  <Moon className="w-5 h-5 text-blue-400" />
                </div>
                <span className={cn('text-sm font-medium', theme === 'dark' ? 'text-white' : 'text-gray-400')}>
                  Dark
                </span>
                {theme === 'dark' && (
                  <span className="text-[11px] text-blue-400 font-medium">Active</span>
                )}
              </button>
              <button
                onClick={() => setTheme('light')}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                  theme === 'light'
                    ? 'border-amber-400 bg-amber-400/10'
                    : 'border-gray-700 hover:border-gray-600',
                )}
              >
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                  <Sun className="w-5 h-5 text-amber-500" />
                </div>
                <span className={cn('text-sm font-medium', theme === 'light' ? 'text-white' : 'text-gray-400')}>
                  Light
                </span>
                {theme === 'light' && (
                  <span className="text-[11px] text-amber-400 font-medium">Active</span>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* ── Section: Data Backup ── */}
        <section className="mb-6">
          <SectionHeading icon={<Database className="w-3.5 h-3.5" />} label="Data Backup" />
          <div className="bg-gray-900 border border-gray-800 rounded-2xl divide-y divide-gray-800">
            <SettingsRow
              title="Export Backup"
              description="Download all progress, notes, XP and streaks as a JSON file"
            >
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-400 text-sm font-medium transition-colors shrink-0"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </SettingsRow>

            <SettingsRow
              title="Import Backup"
              description="Restore data from a previously exported JSON file"
            >
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-sm font-medium transition-colors shrink-0"
              >
                <Upload className="w-4 h-4" />
                Import
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImport}
              />
            </SettingsRow>
          </div>
        </section>

        {/* ── Section: Reset Per-Track ── */}
        <section className="mb-6">
          <SectionHeading icon={<RotateCcw className="w-3.5 h-3.5" />} label="Reset Track Progress" />
          <div className="bg-gray-900 border border-gray-800 rounded-2xl divide-y divide-gray-800">
            {TRACKS.map(({ key, label }) => (
              <SettingsRow
                key={key}
                title={label}
                description="Clear topic progress, streak, and study history for this track"
              >
                <ConfirmAction
                  id={`track-${key}`}
                  pending={pending}
                  setPending={setPending}
                  onConfirm={() => resetTrack(key, label)}
                  confirmLabel="Reset"
                  buttonLabel="Reset"
                  buttonIcon={<RotateCcw className="w-3.5 h-3.5" />}
                />
              </SettingsRow>
            ))}
          </div>
        </section>

        {/* ── Section: Other Resets ── */}
        <section className="mb-6">
          <SectionHeading icon={<Shield className="w-3.5 h-3.5" />} label="Other Data" />
          <div className="bg-gray-900 border border-gray-800 rounded-2xl divide-y divide-gray-800">
            <SettingsRow
              title="Reset XP &amp; Level"
              description="Set your XP back to 0 and drop to level 1"
            >
              <ConfirmAction
                id="xp"
                pending={pending}
                setPending={setPending}
                onConfirm={resetXP}
                confirmLabel="Reset"
                buttonLabel="Reset"
                buttonIcon={<RotateCcw className="w-3.5 h-3.5" />}
              />
            </SettingsRow>
            <SettingsRow
              title="Delete All Notes"
              description="Permanently remove every note across all tracks"
            >
              <ConfirmAction
                id="notes"
                pending={pending}
                setPending={setPending}
                onConfirm={resetNotes}
                confirmLabel="Delete"
                buttonLabel="Delete"
                buttonIcon={<Trash2 className="w-3.5 h-3.5" />}
              />
            </SettingsRow>
          </div>
        </section>

        {/* ── Section: Danger Zone ── */}
        <section className="mb-6">
          <SectionHeading
            icon={<AlertTriangle className="w-3.5 h-3.5" />}
            label="Danger Zone"
            danger
          />
          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl divide-y divide-red-500/10">
            <SettingsRow
              title="Reset All Progress"
              description="Clear progress, streaks, and history for every track at once"
            >
              <ConfirmAction
                id="all-progress"
                pending={pending}
                setPending={setPending}
                onConfirm={resetAllProgress}
                confirmLabel="Reset All"
                buttonLabel="Reset All"
                buttonIcon={<RotateCcw className="w-3.5 h-3.5" />}
                dangerous
              />
            </SettingsRow>
            <SettingsRow
              title="Wipe Everything"
              description="Delete all data — progress, notes, XP, streaks. Cannot be undone."
            >
              <ConfirmAction
                id="wipe"
                pending={pending}
                setPending={setPending}
                onConfirm={wipeAll}
                confirmLabel="Yes, Wipe All"
                buttonLabel="Wipe All"
                buttonIcon={<Trash2 className="w-3.5 h-3.5" />}
                dangerous
              />
            </SettingsRow>
          </div>
        </section>

        {/* ── Section: About ── */}
        <section>
          <SectionHeading icon={<Info className="w-3.5 h-3.5" />} label="About" />
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-2.5">
            <InfoRow label="Storage used" value={`${storageKB} KB`} />
            <InfoRow label="Storage type" value="localStorage (browser only)" />
            <InfoRow label="Version" value="1.0.0" />
            <div className="pt-1">
              <p className="text-xs text-gray-500 leading-relaxed">
                All data is stored locally in your browser — nothing is sent to a server.
                Export a backup regularly to prevent data loss when clearing browser storage.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}

// ─── Layout helpers ───────────────────────────────────────────────────────────

function SectionHeading({
  icon,
  label,
  danger,
}: {
  icon: React.ReactNode
  label: string
  danger?: boolean
}) {
  return (
    <h2
      className={cn(
        'flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest mb-3',
        danger ? 'text-red-400' : 'text-gray-400',
      )}
    >
      {icon}
      {label}
    </h2>
  )
}

function SettingsRow({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3.5">
      <div className="min-w-0">
        <p className="text-sm font-medium text-white" dangerouslySetInnerHTML={{ __html: title }} />
        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{description}</p>
      </div>
      {children}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  )
}
