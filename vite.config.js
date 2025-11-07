import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Enable HTTPS and allow local network access
export default defineConfig({
  plugins: [react()],
  server: {
    https: false,   // enables HTTPS for camera/mic access
    host: true,    // allows phone to connect
    port: 5174     // same port you’ve been using
  }
})
