import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Proxy API calls to the Express server so the browser sees one origin in
    // dev — session cookies are sent without any CORS/cookie-domain juggling.
    proxy: {
      "/api": "http://localhost:4000",
    },
  },
})
