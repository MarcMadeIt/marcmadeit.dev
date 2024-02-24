import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'VITE_API_BASE_URL': '"https:/marcmadeit.vercel.app/api"',

  },
})
