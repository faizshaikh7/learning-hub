import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter, Link } from 'react-router-dom'
import HubScreen from '@/screens/HubScreen'

// Each course screen (and its large curriculum data) loads on demand,
// so the Hub renders instantly instead of shipping all 5 courses upfront.
const BackendTutorScreen = lazy(() => import('@/screens/BackendTutorScreen'))
const AiTutorScreen      = lazy(() => import('@/screens/AiTutorScreen'))
const FlutterTutorScreen = lazy(() => import('@/screens/FlutterTutorScreen'))
const ReactTutorScreen   = lazy(() => import('@/screens/ReactTutorScreen'))
const AimlTutorScreen    = lazy(() => import('@/screens/AimlTutorScreen'))
const MobileTutorScreen  = lazy(() => import('@/screens/MobileTutorScreen'))
const SettingsScreen     = lazy(() => import('@/screens/SettingsScreen'))

/** Full-screen spinner shown while a lazy course chunk downloads. */
function ScreenLoader() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 rounded-full border-2 border-gray-700 border-t-blue-500 animate-spin" />
      <p className="text-sm text-gray-500">Loading course…</p>
    </div>
  )
}

/** Wraps a lazy screen in Suspense. */
const load = (el: ReactNode) => <Suspense fallback={<ScreenLoader />}>{el}</Suspense>

/** Friendly 404 / route-error page. */
function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4 text-center px-6">
      <p className="text-6xl">🧭</p>
      <h1 className="text-2xl font-bold text-white">Page not found</h1>
      <p className="text-sm text-gray-400">That route doesn&apos;t exist — but your learning does.</p>
      <Link
        to="/"
        className="mt-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition-colors"
      >
        Back to the Hub
      </Link>
    </div>
  )
}

/** Application router — one route per screen; course screens are lazy-loaded. */
export const router = createBrowserRouter([
  { path: '/',         element: <HubScreen />, errorElement: <NotFound /> },
  { path: '/backend',  element: load(<BackendTutorScreen />) },
  { path: '/ai',       element: load(<AiTutorScreen />) },
  { path: '/flutter',  element: load(<FlutterTutorScreen />) },
  { path: '/react',    element: load(<ReactTutorScreen />) },
  { path: '/aiml',     element: load(<AimlTutorScreen />) },
  { path: '/mobile',   element: load(<MobileTutorScreen />) },
  { path: '/settings', element: load(<SettingsScreen />) },
  { path: '*',         element: <NotFound /> },
])
