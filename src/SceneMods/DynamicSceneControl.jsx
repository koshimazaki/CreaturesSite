import React, { useEffect, useRef } from 'react';
import { useActionStore } from '../stores/actionStore';
import { useThree } from '@react-three/fiber';
import { 
  StartAction, 
  WorldsAction, 
  SpellsAction, 
  LootAction, 
  BossAction, 
  PhysicsAction 
} from './SceneActions';

export function DynamicSceneControl() {
  const { currentAction } = useActionStore();
  const lastAction = useRef(null);
  const { scene } = useThree();

  // Direct mapping of action IDs to action classes
  const ACTION_CLASS_MAP = {
    'START': StartAction,
    'EXPLORE_WORLDS': WorldsAction,
    'CAST_SPELLS': SpellsAction,
    'LOOT': LootAction,
    'FIGHT_BOSSES': BossAction,
    'PHYSICS': PhysicsAction
  };

  const executeAction = async (action) => {
    console.log('Executing action:', action);

    try {
      // Get the action class using the action ID
      const ActionClass = ACTION_CLASS_MAP[action.id];
      
      if (!ActionClass) {
        console.error('No action class found for:', action.id);
        console.log('Available actions:', Object.keys(ACTION_CLASS_MAP));
        return;
      }

      console.log('Creating new instance of:', ActionClass.name);
      const sceneAction = new ActionClass(scene);
      const result = await sceneAction.execute();
      console.log('Action execution result:', result);
    } catch (error) {
      console.error('Error executing action:', error);
    }
  };

  useEffect(() => {
    if (currentAction && currentAction !== lastAction.current && scene) {
      console.log('Action changed:', currentAction);
      executeAction(currentAction);
      lastAction.current = currentAction;
    }
  }, [currentAction, scene]);

  return null;
}

export default DynamicSceneControl;