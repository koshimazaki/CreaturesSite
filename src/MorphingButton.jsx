import React, { useState, useEffect } from 'react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { motion } from 'framer-motion';




const MorphingButton = () => {
  const [isPressed, setIsPressed] = useState(false);
  const stateOrder = [3, 0, 2, 1]; // Custom order of states
  const [currentStateIndex, setCurrentStateIndex] = useState(0); // Start at index 0 (state 3)

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

  // Set initial state to 3 when Rive loads
  useEffect(() => {
    if (menuRive) {
      const textInput = menuRive.stateMachineInputs('State Machine 1')
        .find(input => input.name === 'Text String');
      if (textInput) {
        textInput.value = 3; // Start with state 3
        console.log('Initial state set to:', 3);
      }
    }
  }, [menuRive]);

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
        const textInput = menuRive.stateMachineInputs('State Machine 1')
          .find(input => input.name === 'Text String');
        if (textInput) {
          // Move to next state in custom order
          const nextIndex = (currentStateIndex + 1) % stateOrder.length;
          const nextState = stateOrder[nextIndex];
          textInput.value = nextState;
          setCurrentStateIndex(nextIndex);
          console.log('Changed to state:', nextState);
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