import { create } from 'zustand';
import { ActionTypes } from '../SceneMods/types';
import { useModelStore } from './modelStore';
import { uiAudioManager } from '../audio/UIAudioManager';

// Initialize UI audio manager
uiAudioManager.init();

const TRANSITION_DELAY = 500;
const TRANSITION_COMPLETE_DELAY = 1000;

export const useActionStore = create((set, get) => ({
  currentAction: ActionTypes.START,
  previousAction: null,
  activeModel: null,
  isTransitioning: false,
  transitionProgress: 0,
  lastTransitionTime: 0,
  
  setAction: async (action) => {
    const state = get();
    const modelStore = useModelStore.getState();
    
    // Prevent rapid transitions
    const now = Date.now();
    if (state.isTransitioning || (now - state.lastTransitionTime < TRANSITION_DELAY)) {
      console.debug('Transition blocked: too soon or already transitioning');
      return;
    }
    
    try {
      // Play UI sound for the action immediately
      if (action?.id) {
        uiAudioManager.playActionSound(action.id);
      }

      set({ 
        isTransitioning: true,
        previousAction: state.currentAction,
        transitionProgress: 0
      });

      // Validate and reload model cache if needed
      if (!modelStore.validateCache()) {
        console.debug('Reloading model cache...');
        await modelStore.preloadModels();
      }

      // Initial transition delay
      await new Promise(resolve => setTimeout(resolve, TRANSITION_DELAY));

      // Update action state
      set(state => ({
        currentAction: action,
        activeModel: action?.modelId || null,
        transitionProgress: 0.5
      }));

      // Allow time for transition animation
      await new Promise(resolve => setTimeout(resolve, TRANSITION_COMPLETE_DELAY));

      set({ transitionProgress: 1 });

    } catch (error) {
      console.error('Action transition failed:', error);
      // Revert to previous state on error
      set(state => ({
        currentAction: state.previousAction,
        activeModel: state.previousAction?.modelId || null,
        transitionProgress: 0
      }));
    } finally {
      set({ isTransitioning: false });
    }
  },

  resetScene: () => {
    console.debug('Resetting scene to initial state');
    set({ 
      currentAction: ActionTypes.START,
      previousAction: null,
      activeModel: null,
      isTransitioning: false,
      transitionProgress: 0,
      lastTransitionTime: Date.now()
    });
  },

  // Add getter for current state
  getTransitionState: () => ({
    isTransitioning: get().isTransitioning,
    progress: get().transitionProgress,
    currentAction: get().currentAction,
    previousAction: get().previousAction
  })
}));

export default useActionStore;