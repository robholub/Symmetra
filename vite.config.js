import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      // We set manifest to false because you already made a custom one in the public folder!
      manifest: false, 
      workbox: {
        // This tells the service worker to securely cache all your code, styles, and images for offline use
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
})
