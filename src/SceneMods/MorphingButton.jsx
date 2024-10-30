import React, { useState, useEffect } from 'react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { motion } from 'framer-motion';
import { useActionStore } from '../stores/actionStore';
import { ActionTypes } from './types';

// Fix the STATE_TO_ACTION mapping to have unique keys
const STATE_TO_ACTION = {
  3: {
    ...ActionTypes.START,
    function: 'StartAction'
  },
  0: {
    ...ActionTypes.EXPLORE_WORLDS,
    function: 'WorldsAction'
  },
  1: {
    ...ActionTypes.CAST_SPELLS,
    function: 'SpellsAction'
  },
  2: {
    ...ActionTypes.FIGHT_BOSSES,
    function: 'BossAction'
  }
};

// Update the state order to match your intended flow
const stateOrder = [3, 0, 1, 2]; // START -> EXPLORE -> CAST -> FIGHT

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
      // Pass both the action ID and the function name
      setAction({
        id: action.id,
        function: action.function,
        type: action.type,
        model: action.model
      });
      console.log('Changed to state:', nextState, 'Action:', action);
    }
  };

  // Initial state effect - now just sets up Rive without triggering action
  useEffect(() => {
    if (menuRive) {
      const initialState = stateOrder[0]; // State 3 (EXPLORE_WORLDS)
      const textInput = menuRive.stateMachineInputs('State Machine 1')
        .find(input => input.name === 'Text String');
      if (textInput) {
        textInput.value = initialState;
        console.log('Initial Rive state set to:', initialState);
      }
    }
  }, [menuRive]);

  const handleClick = () => {
    if (menuRive) {
      const nextIndex = (currentStateIndex + 1) % stateOrder.length;
      const nextState = stateOrder[nextIndex];
      
      const textInput = menuRive.stateMachineInputs('State Machine 1')
        .find(input => input.name === 'Text String');
      
      if (textInput) {
        textInput.value = nextState;
        setCurrentStateIndex(nextIndex);
        handleStateChange(nextState);
      }
    }
  };

  const handleMouseDown = () => {
    if (menuRive) {
      const hoverInput = menuRive.stateMachineInputs('State Machine 1')
        .find(input => input.name === 'isHovered');
      if (hoverInput) hoverInput.value = true;
      setIsPressed(true);
    }
  };

  const handleMouseUp = () => {
    if (menuRive) {
      const hoverInput = menuRive.stateMachineInputs('State Machine 1')
        .find(input => input.name === 'isHovered');
      if (hoverInput) hoverInput.value = false;
      
      if (isPressed) {
        const nextIndex = (currentStateIndex + 1) % stateOrder.length;
        const nextState = stateOrder[nextIndex];
        const action = STATE_TO_ACTION[nextState];

        // Update Rive state
        const textInput = menuRive.stateMachineInputs('State Machine 1')
          .find(input => input.name === 'Text String');
        if (textInput) {
          textInput.value = nextState;
        }

        // Update our state and trigger action
        setCurrentStateIndex(nextIndex);
        if (action) {
          setAction({
            id: action.id,
            function: action.function,
            type: action.type,
            model: action.model
          });
          console.log('Triggering action:', action);
        }
      }
      setIsPressed(false);
    }
  };

  const handleMouseLeave = () => {
    if (menuRive && isPressed) {
      const hoverInput = menuRive.stateMachineInputs('State Machine 1')
        .find(input => input.name === 'isHovered');
      if (hoverInput) hoverInput.value = false;
      setIsPressed(false);
    }
  };

  return (
    <div style={{
      position: 'relative',
      width: '240px',
      height: '240px',
      background: 'rgba(0, 0, 0, 0.02)',
      borderRadius: '12px',
      overflow: 'hidden',
    }}>
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transformOrigin: 'center',
        }}
        animate={{
          scale: isPressed ? 0.95 : 1,
          background: isPressed ? 'rgba(0, 0, 0, 0.02)' : 'rgba(0, 0, 0, 0.01)'
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <MenuComponent />
      </motion.div>
    </div>
  );
};

export default MorphingButton;