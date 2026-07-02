import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    // Bind all interfaces so the dev server is reachable from Windows
    // (WSL2 mirrored networking) at http://127.0.0.1:5173 without passing --host.
    host: true,
  },
})
