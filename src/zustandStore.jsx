import { create } from 'zustand'
import { isMobile, isTablet, isDesktop } from "react-device-detect"

const useStore = create((set) => ({
  deviceType: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
  isLoaded: false,
  isStarted: false,
  audioInitialized: false,
  opacity: 0,
  progress: 0,

  setIsLoaded: (value) => set({ isLoaded: value }),
  setIsStarted: (value) => set({ isStarted: value }),
  setAudioInitialized: (value) => set({ audioInitialized: value }),
  setOpacity: (value) => set({ opacity: value }),
  setProgress: (value) => set({ progress: value }),

  handleStart: () => set((state) => {
    console.log('Start button clicked');
    return { isStarted: true };
  }),

  incrementOpacity: () => set((state) => ({
    opacity: state.opacity >= 1 ? 1 : state.opacity + 0.1
  })),
}))

export default useStore
