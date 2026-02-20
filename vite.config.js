import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Simple config without rollup native dependencies
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    // Use esbuild instead of rollup for Windows compatibility
    rollupOptions: {
      external: [], // No external deps
      output: {
        manualChunks: undefined // Disable code splitting for simplicity
      }
    },
    minify: 'esbuild', // Use esbuild minifier
    target: 'es2020'
  },
  server: {
    port: 3000,
    strictPort: true
  },
  // Force esbuild for everything
  esbuild: {
    target: 'es2020'
  }
})