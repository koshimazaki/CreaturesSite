import { create } from 'zustand';
import { isMobile, isTablet, isIOS, isAndroid } from "react-device-detect";

const useStore = create((set, get) => ({
  // Update device detection logic
  deviceType: isMobile || isTablet ? 'mobile' : 'desktop',  // Simplified to just mobile vs desktop
  isIOS: isIOS,
  isAndroid: isAndroid,
  
textLoopLore: [
  "Press to uncover the core loop that fuels the realms, where spells, creatures, and art collide.", 
  "Dive into the assembly of shifting worlds and decode the journey ahead...",
  "Is the Creature strong enough to survive the loop?",
],

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
  
  // Info panel state
  isInfoVisible: false,
  setInfoVisible: (value) => {
    // console.log('Setting info visible:', value); // Add debug log
    set({ isInfoVisible: value });
  },
  infoRef: null,
  setInfoRef: (ref) => set({ infoRef: ref }),
  
  // Rive loading screen state
  showLoadingScreen: true,
  setShowLoadingScreen: (value) => set({ showLoadingScreen: value }),
  
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
  
  // Add info panel actions
  toggleInfo: () => set((state) => ({ isInfoVisible: !state.isInfoVisible })),
  
  // Update returnToRive to handle transition sequencing
  isTransitioning: false, // Add new state for transition handling
  returnToRive: () => {
    const state = get();
    if (state.isTransitioning) return; // Prevent multiple transitions

    // Start transition
    set({ isTransitioning: true });

    // First fade out the scene
    set({ opacity: 0 });

    // Show loading screen after fade
    setTimeout(() => {
      set({ showLoadingScreen: true });
      
      // Then reset other states
      setTimeout(() => {
        set({ 
          isStarted: false,
          textIndex: 0,
          isTransitioning: false // Reset transition flag
        });
      }, 200);
    }, 300);
  },

  // New Scene Control State
  activeModel: null,
  modelStates: {
    pyramid: { visible: false, position: [0, 0, 0], rotation: [0, 0, 0] },
    fire: { visible: false, position: [0, 1, 0], rotation: [0, 0, 0] },
    boss: { visible: false, position: [0, 0.5, 0], rotation: [0, 0, 0] },
    mainCharacter: { visible: false, position: [0, 0, 0], rotation: [0, 0, 0] }
  },

  // New Scene Control Actions
  setActiveModel: (modelName) => set((state) => {
    // Reset all models first
    const resetModels = Object.keys(state.modelStates).reduce((acc, key) => ({
      ...acc,
      [key]: { ...state.modelStates[key], visible: false }
    }), {});

    // Then set the active model
    return {
      activeModel: modelName,
      modelStates: modelName ? {
        ...resetModels,
        [modelName]: { ...resetModels[modelName], visible: true }
      } : resetModels
    };
  }),

  updateModelState: (modelName, updates) => set((state) => ({
    modelStates: {
      ...state.modelStates,
      [modelName]: {
        ...state.modelStates[modelName],
        ...updates
      }
    }
  })),

  resetSceneState: () => set((state) => ({
    activeModel: null,
    modelStates: Object.keys(state.modelStates).reduce((acc, key) => ({
      ...acc,
      [key]: { ...state.modelStates[key], visible: false }
    }), {})
  })),
}));

export default useStore;
