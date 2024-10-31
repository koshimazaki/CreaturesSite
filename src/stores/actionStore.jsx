import { create } from 'zustand';
import { ActionTypes } from '../SceneMods/types';

export const useActionStore = create((set) => ({
  currentAction: ActionTypes.START,
  
  setAction: (action) => {
    console.log('Setting action in store:', action);
    set({ currentAction: action });
  },

  resetScene: () => set({ 
    currentAction: ActionTypes.START
  })
}));

export default useActionStore;