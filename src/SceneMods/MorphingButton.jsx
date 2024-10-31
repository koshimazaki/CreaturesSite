import React, { useState, useEffect } from 'react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { motion } from 'framer-motion';
import { useActionStore } from '../stores/actionStore';
import { ActionTypes } from './types';

// Fix the STATE_TO_ACTION mapping to match ActionTypes
const STATE_TO_ACTION = {
  0: ActionTypes.START,
  1: ActionTypes.EXPLORE_WORLDS,
  2: ActionTypes.CAST_SPELLS,
  3: ActionTypes.LOOT,
  4: ActionTypes.FIGHT_BOSSES,
  5: ActionTypes.PHYSICS
};

const stateOrder = [0, 1, 2, 3, 4, 5]; // START -> EXPLORE -> CAST -> LOOT -> FIGHT -> PHYSICS

const MorphingButton = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [currentStateIndex, setCurrentStateIndex] = useState(0);
  const { setAction } = useActionStore();

  const { rive: menuRive, RiveComponent: MenuComponent } = useRive({
    src: '/Creature_uiV3.riv',
    artboard: 'Menu-Item',
    stateMachines: 'State Machine 1',
    preload: true,
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center
    })
  });

  const handleStateChange = (nextState) => {
    const action = STATE_TO_ACTION[nextState];
    if (action) {
      setAction({
        id: action.id,
        function: `${action.id}Action`,
        type: 'model'
      });
      console.log('Changed to state:', nextState, 'Action:', action);
    }
  };

  // Safe way to get Rive inputs
  const getRiveInput = (inputName) => {
    if (!menuRive) return null;
    const inputs = menuRive.stateMachineInputs('State Machine 1');
    if (!inputs) return null;
    return inputs.find(input => input.name === inputName);
  };

  // Initial state effect
  useEffect(() => {
    if (menuRive) {
      const initialState = stateOrder[0];
      const textInput = getRiveInput('Text String');
      if (textInput) {
        textInput.value = initialState;
        console.log('Initial Rive state set to:', initialState);
      }
    }
  }, [menuRive]);

  const handleClick = () => {
    if (!menuRive) return;

    // Calculate next state index, wrapping around to 0 after last state
    const nextIndex = (currentStateIndex + 1) % stateOrder.length;
    const nextState = stateOrder[nextIndex];
    const textInput = getRiveInput('Text String');
    
    if (textInput) {
        // Set new state
        textInput.value = nextState;
        setCurrentStateIndex(nextIndex);
        handleStateChange(nextState);
        
        console.log('Moving from state', currentStateIndex, 'to', nextIndex);
    }
  };

  const handleMouseDown = () => {
    const hoverInput = getRiveInput('isHovered');
    if (hoverInput) {
      hoverInput.value = true;
      setIsPressed(true);
    }
  };

  // Initial state setup
  useEffect(() => {
    if (menuRive) {
      const textInput = menuRive.stateMachineInputs('State Machine 1')
        ?.find(input => input.name === 'Text String');
      
      if (textInput) {
        textInput.value = stateOrder[0];
        const initialAction = STATE_TO_ACTION[stateOrder[0]];
        if (initialAction) {
          setAction(initialAction);
        }
      }
      setIsPressed(false);
    }
  }, [menuRive, setAction]);

  return (
    <motion.div
      onClick={handleClick}
      style={{
        width: '240px',
        height: '240px',
        cursor: 'pointer'
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <MenuComponent />
    </motion.div>
  );
};

export default MorphingButton;