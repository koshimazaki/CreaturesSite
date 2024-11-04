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

  assetsInclude: [
    '**/*.glb', 
    '**/*.png', 
    '**/*.jpg', 
    '**/*.svg', 
    '**/*.mp4', 
    '**/*.ttf', 
    '**/*.otf', 
    '**/*.woff', 
    '**/*.woff2', 
    '**/*.ico', 
    '**/audio/**/*.mp3', // This explicitly includes all mp3 files in audio and its subfolders
    '**/UIaudio/**/*.mp3' // This explicitly includes the UIaudio subfolder
  ],
  build: {
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'three'],
          'react-three': ['@react-three/fiber', '@react-three/drei'],
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const extType = info[info.length - 1]
          
          if (/mpwav|ogg/i.test(extType)) {
            // Preserve the full path structure for audio files
            return `assets/audio/[name].[hash][extname]`
          }
          
          return `assets/[name]-[hash][extname]`
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
