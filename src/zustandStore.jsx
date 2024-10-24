import { create } from 'zustand'
import { isMobile, isTablet, isDesktop } from "react-device-detect"

const useStore = create((set, get) => ({
  deviceType: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
  isLoaded: false,
  isStarted: false,
  audioInitialized: false,
  opacity: 0,
  progress: 0,
  menuState: 1, // Add this if you want to track menu state

  setIsLoaded: (value) => set({ isLoaded: value }),
  setIsStarted: (value) => set({ isStarted: value }),
  setAudioInitialized: (value) => set({ audioInitialized: value }),
  setOpacity: (value) => set({ opacity: value }),
  setProgress: (value) => set({ progress: value }),
  setMenuState: (value) => set({ menuState: value }), // Add this for menu control

  handleStart: () => {
    const state = get()
    if (!state.isStarted) {
      set({ isStarted: true })
      // Start the opacity fade
      const fadeInterval = setInterval(() => {
        const currentOpacity = get().opacity
        if (currentOpacity >= 1) {
          clearInterval(fadeInterval)
        } else {
          set({ opacity: currentOpacity + 0.1 })
        }
      }, 50)
    }
  },

  incrementOpacity: () => set((state) => ({
    opacity: Math.min(state.opacity + 0.1, 1)
  })),

  // Add a function to handle complete reset if needed
  resetState: () => set({
    isStarted: false,
    opacity: 0,
    menuState: 1
  })
}))

export default useStore