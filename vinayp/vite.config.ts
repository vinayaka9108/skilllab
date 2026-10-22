import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // The three.js chunk is lazy-loaded (only after first paint), so a larger chunk is expected.
    chunkSizeWarningLimit: 1400,
  },
})
