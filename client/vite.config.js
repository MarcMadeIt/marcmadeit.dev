import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.VITE_API_BASE_URL': process.env.NODE_ENV === 'production'
      ? 'https://marcmadeit.vercel.app/api'
      : 'http://127.0.0.1:8000/api'
  },
})
