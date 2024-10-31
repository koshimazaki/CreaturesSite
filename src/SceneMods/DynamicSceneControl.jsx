import React, { useEffect, useRef } from 'react';
import { useActionStore } from '../stores/actionStore';
import { BANNER_ACTION_MAP } from './BannerActions';
import * as SceneActions from './SceneActions';

export function DynamicSceneControl({ scene }) {
  const { currentAction } = useActionStore();
  const lastAction = useRef(null);

  const executeAction = async (action) => {
    console.log('Executing action:', action); // Debug log

    // Get the correct scene action class
    const ActionClass = SceneActions[`${action.function}`];
    if (!ActionClass) {
      console.error('No action class found for:', action.function);
      return;
    }

    // Execute scene action
    const sceneAction = new ActionClass(scene);
    await sceneAction.execute();

    // Execute banner action
    const BannerActionClass = BANNER_ACTION_MAP[action.id];
    if (BannerActionClass) {
      const bannerAction = new BannerActionClass();
      bannerAction.execute();
    }
  };

  useEffect(() => {
    if (currentAction && currentAction !== lastAction.current) {
      console.log('Action changed to:', currentAction); // Debug log
      executeAction(currentAction);
      lastAction.current = currentAction;
    }
  }, [currentAction, scene]);

  return null;
}
export default DynamicSceneControl;