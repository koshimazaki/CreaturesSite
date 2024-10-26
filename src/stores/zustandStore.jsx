import { create } from 'zustand';
import { isMobile, isTablet } from "react-device-detect";

const useStore = create((set, get) => ({
  deviceType: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
  isLoaded: false,
  isStarted: false,
  opacity: 0,
  progress: 0,
  scenePreloaded: false,
  
  // Text Lore States
  textIndex: 0,
  showTextLore: false,
  textLoreContent: [
    "_",
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

  // Text Lore Actions
  setTextIndex: (value) => {
    if (typeof value === 'function') {
      set((state) => ({ textIndex: value(state.textIndex) }));
    } else {
      set({ textIndex: value });
    }
  },

  incrementTextIndex: () => {
    const state = get();
    const nextIndex = (state.textIndex + 1) % state.textLoreContent.length;
    set({ textIndex: nextIndex });
  },
  
  setShowTextLore: (value) => set({ showTextLore: value }),

  // Add these new states
  isTypingStarted: false,
  shouldShowText: false,

  // Add these new actions
  setIsTypingStarted: (value) => set({ isTypingStarted: value }),
  setShouldShowText: (value) => set({ shouldShowText: value }),

  // Modify completeFirstRun to handle typing state
  completeFirstRun: () => {
    set((state) => ({
      isFirstRun: false,
      isTextVisible: true,
      shouldShowText: true,
      textIndex: (state.textIndex + 1) % state.textLoreContent.length
    }));
  },

  // Other existing actions
  setIsLoaded: (value) => set({ isLoaded: value }),
  setIsStarted: (value) => set({ isStarted: value }),
  setProgress: (value) => set({ progress: value }),
  incrementOpacity: () => set((state) => ({ opacity: Math.min(state.opacity + 0.1, 1) })),
  setScenePreloaded: (value) => set({ scenePreloaded: value }),
  setDeviceType: (type) => set({ deviceType: type }),
}));

export default useStore;
