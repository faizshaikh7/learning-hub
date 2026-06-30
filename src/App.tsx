import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { useThemeStore } from '@/store/themeStore'

/** Root app component — applies theme class to <html> and wires up the router. */
export default function App() {
  const theme = useThemeStore(s => s.theme)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('light', theme === 'light')
    root.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return <RouterProvider router={router} />
}
