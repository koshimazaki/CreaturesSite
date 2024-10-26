// zustandStore.js
import { create } from 'zustand';
import { isMobile, isTablet, isDesktop } from "react-device-detect";

const useStore = create((set) => ({
  deviceType: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
  isLoaded: false,
  isStarted: false,
  opacity: 0,
  progress: 0,
  scenePreloaded: false,

  setIsLoaded: (value) => set({ isLoaded: value }),
  setIsStarted: (value) => set({ isStarted: value }),
  setProgress: (value) => set({ progress: value }),
  incrementOpacity: () => set((state) => ({ opacity: Math.min(state.opacity + 0.1, 1) })),
  setScenePreloaded: (value) => set({ scenePreloaded: value }),
  setDeviceType: (type) => set({ deviceType: type }),
}));

export default useStore;
