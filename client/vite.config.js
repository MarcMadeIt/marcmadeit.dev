import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'VITE_API_BASE_URL': '"http://X.X.X.X:8000/api"',

  },
})
