import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

/**
 * NOTE: This is a lightweight client-side gate, not real security. The
 * credentials below ship inside the JS bundle and are visible to anyone who
 * inspects it — it only keeps the casual visitor out. For genuine protection
 * (private data, multiple users) this must move to a backend / auth provider.
 */
const AUTH_KEY = 'hub_auth'
const ADMIN_USERNAME = 'admin@test.com'
const ADMIN_PASSWORD = 'Test@1234'

/** Read persisted auth flag from localStorage. */
function readAuth(): boolean {
  try {
    return localStorage.getItem(AUTH_KEY) === 'true'
  } catch {
    return false
  }
}

interface AuthStore {
  isAuthenticated: boolean
  /** Validate the static admin credentials; persists + flips state on success. Returns whether it succeeded. */
  login: (username: string, password: string) => boolean
  /** Clear the session. */
  logout: () => void
}

/** Zustand store for the single-admin login gate — persists to localStorage. */
export const useAuthStore = create<AuthStore>()(
  subscribeWithSelector((set) => ({
    isAuthenticated: readAuth(),

    login: (username, password) => {
      const ok =
        username.trim().toLowerCase() === ADMIN_USERNAME &&
        password === ADMIN_PASSWORD
      if (ok) {
        try { localStorage.setItem(AUTH_KEY, 'true') } catch { /* ignore */ }
        set({ isAuthenticated: true })
      }
      return ok
    },

    logout: () => {
      try { localStorage.removeItem(AUTH_KEY) } catch { /* ignore */ }
      set({ isAuthenticated: false })
    },
  }))
)
