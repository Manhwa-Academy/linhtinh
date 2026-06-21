import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  build: {
    target: 'es2015', // Support older browsers like iPhone 6 (iOS 9-12)
    cssTarget: 'chrome61', // Support older CSS features
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Keep console for debugging
      },
    },
  },
  // Optimize for older devices
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2015'
    }
  }
})
