import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { TrackKey } from '@/types'
import { getPath, setPath } from '@/lib/storage'

interface PathStore {
  /** Ordered list of track keys the user wants to learn, in sequence. */
  path: TrackKey[]
  /** Append a track to the end of the path (no-op if already present). */
  add: (track: TrackKey) => void
  /** Remove a track from the path. */
  remove: (track: TrackKey) => void
  /** Add if absent, remove if present. */
  toggle: (track: TrackKey) => void
  /** Move a track one step earlier in the sequence. */
  moveUp: (track: TrackKey) => void
  /** Move a track one step later in the sequence. */
  moveDown: (track: TrackKey) => void
  /** Empty the whole path. */
  clear: () => void
}

/** Zustand store for the user's personal course learning-path order — persists to localStorage. */
export const usePathStore = create<PathStore>()(
  subscribeWithSelector((set, get) => ({
    path: getPath(),

    add: (track) => {
      const path = get().path
      if (path.includes(track)) return
      const next = [...path, track]
      setPath(next)
      set({ path: next })
    },

    remove: (track) => {
      const next = get().path.filter(t => t !== track)
      setPath(next)
      set({ path: next })
    },

    toggle: (track) => {
      get().path.includes(track) ? get().remove(track) : get().add(track)
    },

    moveUp: (track) => {
      const path = [...get().path]
      const i = path.indexOf(track)
      if (i <= 0) return
      ;[path[i - 1], path[i]] = [path[i], path[i - 1]]
      setPath(path)
      set({ path })
    },

    moveDown: (track) => {
      const path = [...get().path]
      const i = path.indexOf(track)
      if (i === -1 || i >= path.length - 1) return
      ;[path[i + 1], path[i]] = [path[i], path[i + 1]]
      setPath(path)
      set({ path })
    },

    clear: () => {
      setPath([])
      set({ path: [] })
    },
  }))
)
