import { create } from 'zustand';
import { isMobile, isTablet, isIOS, isAndroid } from "react-device-detect";

const useStore = create((set, get) => ({
  // Update device detection logic
  deviceType: isMobile || isTablet ? 'mobile' : 'desktop',  // Simplified to just mobile vs desktop
  isIOS: isIOS,
  isAndroid: isAndroid,
  
  // Text content for different devices
  textLoreContent: {
    desktop: [
      "___",
      "Welcome to Glitch Candies: Creatures",
      "We are stuck between galaxies...",
      "Initialising Glitch Protocol...",
      "Magic worlds are assembling...",
      "Creatures morph and glitch into new forms...",
      "Tech and spells are generating...",
      "Epic bosses are spawning...",
      "Clues are scattered across...",
      "Intergalactic travel will continue soon...",
      "The journey is starting soon...",
    ],
    mobile: [
      "___",
      "Glitch Candies: Creatures",
      "Stuck between galaxies..",
      "Initialising Glitches...",
      "Creatures morphing...",
      "Tech generating...",
      "Bosses are spawning...",
      "Clues are scattered...",
      "Travel will continue...",
      "Journey is starting...",
    ]
  },
  
  // Helper function to get correct text content
  getTextContent: () => {
    const state = get()
    return state.deviceType === 'desktop' ? 
      state.textLoreContent.desktop : 
      state.textLoreContent.mobile
  },

  // Feature flags
  shouldShowEffects: !isAndroid,
  shouldShowFullscreen: !(isMobile || isTablet),
  shouldAllowEntry: !isIOS,
  
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
