import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
 
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
      },
    }),
  ],

  assetsInclude: ['**/*.glb', '**/*.png', '**/*.jpg', '**/*.svg', '**/*.mp4', '**/*.ttf', '**/*.otf', '**/*.woff', '**/*.woff2', '**/*.ico', '**/*.mp3'],
  build: {
    assetsInlineLimit: 0, // This ensures that GLB files are always emitted as separate files
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'three'],
          'react-three': ['@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
      '@assets': '/src/assets',
    },
  },
})
