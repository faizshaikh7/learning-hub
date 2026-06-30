import { createBrowserRouter } from 'react-router-dom'
import HubScreen from '@/screens/HubScreen'
import BackendTutorScreen from '@/screens/BackendTutorScreen'
import AiTutorScreen from '@/screens/AiTutorScreen'
import FlutterTutorScreen from '@/screens/FlutterTutorScreen'
import ReactTutorScreen from '@/screens/ReactTutorScreen'
import SettingsScreen from '@/screens/SettingsScreen'

/** Application router — one route per screen. */
export const router = createBrowserRouter([
  { path: '/',         element: <HubScreen /> },
  { path: '/backend',  element: <BackendTutorScreen /> },
  { path: '/ai',       element: <AiTutorScreen /> },
  { path: '/flutter',  element: <FlutterTutorScreen /> },
  { path: '/react',    element: <ReactTutorScreen /> },
  { path: '/settings', element: <SettingsScreen /> },
])
