import { useState } from 'react'
import { useNavigate, Navigate, useLocation } from 'react-router-dom'
import { Zap, User, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'

/**
 * LoginScreen — single-admin login gate for LearnKar. Login only (no signup).
 * On success, redirects to the page the user was trying to reach, or the hub.
 */
export default function LoginScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuthStore(s => s.login)
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  // Already signed in — skip the login screen.
  const from = (location.state as { from?: string } | null)?.from ?? '/'
  if (isAuthenticated) return <Navigate to={from} replace />

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const ok = login(username, password)
    if (ok) {
      navigate(from, { replace: true })
    } else {
      setError('Incorrect username or password.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center mb-3">
            <Zap className="w-7 h-7 text-gray-950" fill="currentColor" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">LearnKar</h1>
          <p className="text-sm text-gray-400 mt-1">Admin sign in</p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4"
        >
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-xs font-medium text-gray-400 mb-1.5">
              Email
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                id="username"
                type="email"
                autoComplete="email"
                autoCapitalize="none"
                value={username}
                onChange={e => { setUsername(e.target.value); setError('') }}
                placeholder="admin@example.com"
                className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/30 transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-xs font-medium text-gray-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                placeholder="••••••••"
                className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-9 pr-10 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/30 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className={cn(
              'w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5',
              'text-sm font-semibold text-gray-950 bg-yellow-400 hover:bg-yellow-300 transition-colors',
            )}
          >
            Sign In
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-gray-600 mt-4">
          Private admin access · login only
        </p>
      </div>
    </div>
  )
}
