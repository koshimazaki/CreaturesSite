import { create } from 'zustand';
import { isMobile, isTablet } from "react-device-detect";

const useStore = create((set, get) => ({
  deviceType: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
  isLoaded: false,
  isStarted: false,
  opacity: 0,
  progress: 0,
  scenePreloaded: false,
  
  // Only keep these basic text states if needed
  textIndex: 0,
  showTextLore: false,
  
  // Basic actions
  setTextIndex: (value) => {
    if (typeof value === 'function') {
      set((state) => ({ textIndex: value(state.textIndex) }));
    } else {
      set({ textIndex: value });
    }
  },
  
  setShowTextLore: (value) => set({ showTextLore: value }),

  // Other existing actions
  setIsLoaded: (value) => set({ isLoaded: value }),
  setIsStarted: (value) => set({ isStarted: value }),
  setProgress: (value) => set({ progress: value }),
  incrementOpacity: () => set((state) => ({ opacity: Math.min(state.opacity + 0.1, 1) })),
  setScenePreloaded: (value) => set({ scenePreloaded: value }),
  setDeviceType: (type) => set({ deviceType: type }),
}));

export default useStore;
