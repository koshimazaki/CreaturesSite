import { create } from 'zustand';
import { ActionTypes } from '../SceneMods/types';

export const useActionStore = create((set) => ({
  activeAction: {
    id: ActionTypes.EXPLORE_WORLDS.id,
    function: 'WorldsAction',
    type: 'model',
    model: 'pyramid'
  },
  
  setAction: (action) => {
    console.log('Setting action:', action);
    set({ activeAction: action });
  },

  resetScene: () => set({ 
    activeAction: {
      id: ActionTypes.START.id,
      function: 'reset',
      type: 'reset'
    }
  })
}));

export default useActionStore;