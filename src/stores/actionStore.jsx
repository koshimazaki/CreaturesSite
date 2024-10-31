import { create } from 'zustand';
import { ActionTypes } from '../SceneMods/types';
import { useModelStore } from './modelStore';

export const useActionStore = create((set, get) => ({
  currentAction: ActionTypes.START,
  activeModel: null,
  isTransitioning: false,
  
  setAction: async (action) => {
    const modelStore = useModelStore.getState();
    
    // Prevent actions during transitions
    if (get().isTransitioning) return;
    
    set({ isTransitioning: true });
    console.log('Setting action:', action);

    try {
      // Validate model cache before transition
      if (!modelStore.validateCache()) {
        console.warn('Model cache invalid, reloading...');
        await modelStore.preloadModels();
      }

      // Set new action
      set({ 
        currentAction: action,
        activeModel: action.modelId // If you have this mapping
      });

    } catch (error) {
      console.error('Error in action transition:', error);
    } finally {
      set({ isTransitioning: false });
    }
  },

  resetScene: () => set({ 
    currentAction: ActionTypes.START,
    activeModel: null
  })
}));

export default useActionStore;