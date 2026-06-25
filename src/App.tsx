import { RouterProvider } from 'react-router-dom'
import { router } from './router'

/** Root app component — wires up the router. */
export default function App() {
  return <RouterProvider router={router} />
}
