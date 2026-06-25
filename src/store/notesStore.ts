import { create } from 'zustand'
import type { Note, TrackKey } from '@/types'
import { getNotes, saveNote, deleteNote } from '@/lib/storage'

interface NotesStore {
  notes: Note[]
  loadNotes: () => void
  upsertNote: (topicId: string, track: TrackKey, content: string) => void
  removeNote: (noteId: string) => void
  getNoteForTopic: (topicId: string, track: TrackKey) => Note | undefined
}

/** Zustand store for user notes — persists to localStorage via storage utils. */
export const useNotesStore = create<NotesStore>()((set, get) => ({
  notes: getNotes(),

  /** Reload notes from localStorage. */
  loadNotes: () => set({ notes: getNotes() }),

  /** Create or update a note for a topic. */
  upsertNote: (topicId, track, content) => {
    const existing = get().getNoteForTopic(topicId, track)
    const now = new Date().toISOString()
    const note: Note = {
      id: existing?.id ?? crypto.randomUUID(),
      topicId,
      track,
      content,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    }
    saveNote(note)
    set({ notes: getNotes() })
  },

  /** Delete a note by id. */
  removeNote: (noteId) => {
    deleteNote(noteId)
    set({ notes: getNotes() })
  },

  /** Find note for a specific topic and track. */
  getNoteForTopic: (topicId, track) => {
    return get().notes.find(n => n.topicId === topicId && n.track === track)
  },
}))
