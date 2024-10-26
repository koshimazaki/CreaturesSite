import { create } from 'zustand';
import { isMobile, isTablet, isIOS, isAndroid } from "react-device-detect";

const useStore = create((set, get) => ({
  // Enhanced device detection
  deviceType: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
  isIOS: isIOS,
  isAndroid: isAndroid,
  
  // Device-specific feature flags
  shouldShowEffects: !isAndroid, // Disable effects for Android
  shouldShowFullscreen: !(isMobile || isTablet), // Only show on desktop
  shouldAllowEntry: !isIOS, // Disable entry for iOS
  
  // Existing state
  isLoaded: false,
  isStarted: false,
  opacity: 0,
  progress: 0,
  scenePreloaded: false,
  textIndex: 0,
  showTextLore: false,
  
  // Existing actions
  setTextIndex: (value) => {
    if (typeof value === 'function') {
      set((state) => ({ textIndex: value(state.textIndex) }));
    } else {
      set({ textIndex: value });
    }
  },
  
  setShowTextLore: (value) => set({ showTextLore: value }),
  setIsLoaded: (value) => set({ isLoaded: value }),
  setIsStarted: (value) => set({ isStarted: value }),
  setProgress: (value) => set({ progress: value }),
  incrementOpacity: () => set((state) => ({ opacity: Math.min(state.opacity + 0.1, 1) })),
  setScenePreloaded: (value) => set({ scenePreloaded: value }),
  setDeviceType: (type) => set({ deviceType: type }),
}));

export default useStore;
