import { create } from 'zustand';
import { ActionTypes } from '../SceneMods/types';
import { useModelStore } from './modelStore';


export const useActionStore = create((set, get) => ({
  currentAction: ActionTypes.START,
  previousAction: null,
  activeModel: null,
  isTransitioning: false,
  transitionProgress: 0,
  
  setAction: async (action) => {
    const modelStore = useModelStore.getState();
    
    // Prevent actions during transitions
    if (get().isTransitioning) return;
    
    set({ 
      isTransitioning: true,
      previousAction: get().currentAction,
      transitionProgress: 0
    });
    
    console.log('Starting transition to:', action);

    try {
      // Validate model cache before transition
      if (!modelStore.validateCache()) {
        console.warn('Model cache invalid, reloading...');
        await modelStore.preloadModels();
      }

      // Delay the actual state change
      await new Promise(resolve => setTimeout(resolve, 500));

      // Set new action
      set({ 
        currentAction: action,
        activeModel: action.modelId
      });

      // Allow time for transition to complete
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error('Error in action transition:', error);
    } finally {
      set({ 
        isTransitioning: false,
        transitionProgress: 1
      });
    }
  },

  resetScene: () => set({ 
    currentAction: ActionTypes.START,
    previousAction: null,
    activeModel: null,
    transitionProgress: 0
  })
}));

export default useActionStore;