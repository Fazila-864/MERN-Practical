import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Project lives on a mapped network drive (Z: -> \\server3\...).
    // Keep serving scoped to the project root and listen on localhost only.
    fs: {
      strict: true,
    },
  },
})