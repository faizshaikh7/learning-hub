import { useState, useEffect, useCallback } from 'react'
import { Save, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { useNotesStore } from '@/store/notesStore'
import type { TrackKey } from '@/types'

interface NotesViewProps {
  topicId: string
  track: TrackKey
}

const MAX_CHARS = 5000

/**
 * NotesView — per-topic notes editor that persists to localStorage.
 * Displays character count, last-saved timestamp, and loads existing notes on mount.
 */
export default function NotesView({ topicId, track }: NotesViewProps) {
  const { getNoteForTopic, upsertNote } = useNotesStore()
  const existing = getNoteForTopic(topicId, track)

  const [content, setContent] = useState(existing?.content ?? '')
  const [lastSaved, setLastSaved] = useState<string | null>(existing?.updatedAt ?? null)
  const [isDirty, setIsDirty] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Sync content when topic changes
  useEffect(() => {
    const note = getNoteForTopic(topicId, track)
    setContent(note?.content ?? '')
    setLastSaved(note?.updatedAt ?? null)
    setIsDirty(false)
  }, [topicId, track, getNoteForTopic])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    if (val.length > MAX_CHARS) return
    setContent(val)
    setIsDirty(true)
  }, [])

  const handleSave = useCallback(() => {
    setIsSaving(true)
    upsertNote(topicId, track, content)
    const now = new Date().toISOString()
    setLastSaved(now)
    setIsDirty(false)
    // Short visual feedback
    setTimeout(() => setIsSaving(false), 600)
  }, [topicId, track, content, upsertNote])

  // Auto-save on Ctrl+S / Cmd+S
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleSave])

  const formatTimestamp = (iso: string) => {
    try {
      const d = new Date(iso)
      return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
        + ', '
        + d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    } catch {
      return iso
    }
  }

  const charCount = content.length
  const pct = (charCount / MAX_CHARS) * 100

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-300">Topic Notes</h3>
        </div>
        <Button
          onClick={handleSave}
          disabled={!isDirty || isSaving}
          size="sm"
          className={cn(
            'gap-1.5 transition-colors',
            isDirty
              ? 'bg-blue-600 hover:bg-blue-500 text-white'
              : 'bg-gray-800 text-gray-500 cursor-default'
          )}
        >
          <Save className="h-3.5 w-3.5" />
          {isSaving ? 'Saving…' : 'Save'}
        </Button>
      </div>

      {/* Hint text */}
      <p className="text-xs text-gray-600">
        Supports Markdown-style formatting. Press <kbd className="px-1 py-0.5 rounded bg-gray-800 text-gray-400 text-[10px]">Ctrl+S</kbd> to save.
      </p>

      {/* Textarea */}
      <Textarea
        value={content}
        onChange={handleChange}
        placeholder={`Write your notes about this topic…\n\n# Key insights\n- \n\n## Questions to revisit\n- `}
        className="min-h-[320px] bg-gray-900 border-gray-700 text-gray-100 placeholder:text-gray-600 focus:border-gray-600 resize-y font-mono text-sm leading-relaxed"
      />

      {/* Footer: char count + last saved */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-1 w-20 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-200',
                pct > 90 ? 'bg-red-500' : pct > 70 ? 'bg-yellow-500' : 'bg-gray-600'
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className={cn(
            'text-xs',
            pct > 90 ? 'text-red-400' : 'text-gray-500'
          )}>
            {charCount}/{MAX_CHARS}
          </span>
        </div>
        {lastSaved && !isDirty && (
          <span className="text-xs text-gray-600">
            Saved {formatTimestamp(lastSaved)}
          </span>
        )}
        {isDirty && (
          <span className="text-xs text-yellow-500/80">Unsaved changes</span>
        )}
      </div>
    </div>
  )
}
