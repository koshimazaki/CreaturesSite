import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRive, Layout, Fit, Alignment, EventType, useStateMachineInput } from '@rive-app/react-canvas';
import LoreText from './LoreText';
import useStore from './zustandStore';
import RiveControl from './UI/RiveControl';

const RiveLoadingScreen = ({ onStart, audioPlayerRef }) => {
  const [localProgress, setLocalProgress] = useState(0);
  const [showLoreText, setShowLoreText] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [currentMenuState, setCurrentMenuState] = useState(0);
  const [astralionStates, setAstralionStates] = useState({ input1: 0, input2: 0 });
  
  const isLoaded = useStore(state => state.isLoaded);
  const deviceType = useStore(state => state.deviceType);
  const progress = useStore(state => state.progress);

  // Menu artboard setup (background)
  const { rive: menuRive, RiveComponent: MenuComponent } = useRive({
    src: '/astralion_u_v2i.riv',
    artboard: 'Menu',
    stateMachines: ['Menu SM'],
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
    onLoad: () => {
      console.log('📋 Menu artboard loaded');
      if (menuRive) {
        console.log('Menu State Machines:', menuRive.stateMachineNames);
        const inputs = menuRive.stateMachineInputs('Menu SM');
        console.log('Menu SM inputs:', inputs);
        
        if (inputs && inputs.length > 0) {
          inputs.forEach(input => {
            console.log('Menu input:', {
              name: input.name,
              value: input.value,
              type: input.type
            });
          });
        }
      }
    },
  });

  // Creature artboard setup (foreground)
  const { rive: creatureRive, RiveComponent: CreatureComponent } = useRive({
    src: '/astralion_u_v2i.riv',
    artboard: 'Hero Animation 2',
    stateMachines: ['Astralion SM'],
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
    onLoad: () => {
      console.log('🎨 Astralion artboard loaded');
      if (creatureRive) {
        console.log('Astralion State Machines:', creatureRive.stateMachineNames);
        const inputs = creatureRive.stateMachineInputs('Astralion SM');
        console.log('Astralion SM inputs:', inputs);
        if (inputs && inputs.length === 2) {
          console.log('Astralion Input 1:', {
            name: inputs[0].name,
            value: inputs[0].value,
            type: inputs[0].type
          });
          console.log('Astralion Input 2:', {
            name: inputs[1].name,
            value: inputs[1].value,
            type: inputs[1].type
          });
        }
      }
    },
  });

  // Get state machine inputs
  const menuStateInput = useStateMachineInput(menuRive, 'Menu SM', 'Menu state');
  
  // Get both Astralion inputs
  const getAstralionInputs = useCallback(() => {
    if (!creatureRive) return [null, null];
    const inputs = creatureRive.stateMachineInputs('Astralion SM');
    if (!inputs || inputs.length < 2) return [null, null];
    return [inputs[0], inputs[1]];
  }, [creatureRive]);

  const [astralionInput1, astralionInput2] = getAstralionInputs();

  // Force menu state change
  const forceMenuState = useCallback((state) => {
    if (menuStateInput) {
      console.log(`Forcing menu state to: ${state}`);
      try {
        menuRive?.stopRendering();
        menuStateInput.value = state;
        setCurrentMenuState(state);
        setTimeout(() => {
          menuRive?.startRendering();
        }, 50);
      } catch (error) {
        console.error('Error setting menu state:', error);
        menuRive?.startRendering();
      }
    }
  }, [menuStateInput, menuRive]);

  // Handle Astralion state changes
  const setAstralionState = useCallback((inputIndex, value) => {
    if (!creatureRive) return;
    
    try {
      creatureRive.stopRendering();
      const inputs = creatureRive.stateMachineInputs('Astralion SM');
      if (inputs && inputs.length > inputIndex) {
        inputs[inputIndex].value = value;
        setAstralionStates(prev => ({
          ...prev,
          [`input${inputIndex + 1}`]: value
        }));
        console.log(`Set Astralion input ${inputIndex} to:`, value);
      }
      setTimeout(() => {
        creatureRive.startRendering();
      }, 50);
    } catch (error) {
      console.error(`Error setting Astralion input ${inputIndex}:`, error);
      creatureRive.startRendering();
    }
  }, [creatureRive]);

  // Debug state
  const debugRiveState = useCallback(() => {
    console.group('🔍 Rive Debug Information');
    
    if (menuRive) {
      console.log('Menu State Machines:', menuRive.stateMachineNames);
      const menuInputs = menuRive.stateMachineInputs('Menu SM');
      console.log('Menu SM inputs:', menuInputs);
      if (menuInputs) {
        menuInputs.forEach(input => {
          console.log(`Menu input: ${input.name} = ${input.value}`);
        });
      }
    }
    
    if (creatureRive) {
      console.log('Astralion State Machines:', creatureRive.stateMachineNames);
      const creatureInputs = creatureRive.stateMachineInputs('Astralion SM');
      console.log('Astralion SM inputs:', creatureInputs);
      if (creatureInputs) {
        creatureInputs.forEach((input, index) => {
          console.log(`Astralion input ${index + 1}: ${input.name} = ${input.value}`);
        });
      }
    }
    
    console.groupEnd();
  }, [menuRive, creatureRive]);

  // Monitor state changes
  useEffect(() => {
    const handleStateChange = (event) => {
      console.log('State Change:', event.data);
    };

    if (menuRive) {
      menuRive.on(EventType.StateChange, handleStateChange);
      menuRive.on(EventType.RiveEvent, (e) => console.log('Menu Event:', e));
    }
    
    if (creatureRive) {
      creatureRive.on(EventType.StateChange, handleStateChange);
      creatureRive.on(EventType.RiveEvent, (e) => console.log('Astralion Event:', e));
    }

    return () => {
      if (menuRive) {
        menuRive.off(EventType.StateChange, handleStateChange);
        menuRive.off(EventType.RiveEvent);
      }
      if (creatureRive) {
        creatureRive.off(EventType.StateChange, handleStateChange);
        creatureRive.off(EventType.RiveEvent);
      }
    };
  }, [menuRive, creatureRive]);

  // Handle progress
  useEffect(() => {
    setLocalProgress(progress);
    if (progress === 100) {
      setTimeout(() => setShowLoreText(true), 2000);
    }
  }, [progress]);

  return (
    <motion.div 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: '#14171A',
        color: '#14171A',
        zIndex: 9999,
        overflow: 'hidden',
      }}
      animate={{ opacity }}
      transition={{ duration: 0.5 }}
    >
      {/* Menu Layer (Background) */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%',
        zIndex: 1 
      }}>
        <MenuComponent />
      </div>
      
      {/* Creature Layer (Foreground) */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%',
        zIndex: 2
      }}>
        <CreatureComponent />
      </div>

      {/* Controls Layer */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%',
        zIndex: 3,
        pointerEvents: 'auto'
      }}>
        <RiveControl 
          onStart={onStart} 
          audioPlayerRef={audioPlayerRef}
          onMenuStateChange={forceMenuState}
          currentMenuState={currentMenuState}
        />
      </div>

      {/* Debug Panel */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'fixed',
          top: 10,
          right: 10,
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: 10,
          zIndex: 10000,
          borderRadius: 5,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          pointerEvents: 'auto'
        }}>
          <div>Menu State: {currentMenuState}</div>
          <div>Menu Input: {menuStateInput?.value ?? 'N/A'}</div>
          <div>Astralion Input 1: {astralionStates.input1}</div>
          <div>Astralion Input 2: {astralionStates.input2}</div>
          <button onClick={debugRiveState}>Debug State</button>
          <button onClick={() => forceMenuState(1)}>Force Menu State 1</button>
          <button onClick={() => forceMenuState(2)}>Force Menu State 2</button>
          <button onClick={() => setAstralionState(0, 1)}>Astralion Input 1 - State 1</button>
          <button onClick={() => setAstralionState(0, 2)}>Astralion Input 1 - State 2</button>
          <button onClick={() => setAstralionState(1, 1)}>Astralion Input 2 - State 1</button>
          <button onClick={() => setAstralionState(1, 2)}>Astralion Input 2 - State 2</button>
          <button onClick={() => {
            const astralionInputs = creatureRive?.stateMachineInputs('Astralion SM');
            if (astralionInputs) {
              astralionInputs.forEach((input, index) => {
                console.log(`Astralion Input ${index + 1}:`, {
                  name: input.name,
                  value: input.value,
                  type: input.type
                });
              });
            }
          }}>Log Astralion State</button>
        </div>
      )}

      {/* Progress Bar */}
      {!isLoaded && (
        <div style={{
          position: 'absolute',
          bottom: deviceType === 'mobile' ? '20%' : '50%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: deviceType === 'mobile' ? '200px' : '250px',
          height: '30px',
          background: 'transparent',
          border: '2px solid #14171A',
          borderRadius: '5px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#14171A',
          zIndex: 4,
          fontSize: deviceType === 'mobile' ? '12px' : '14px',
          fontFamily: 'Monorama, sans-serif',
          transition: 'opacity 0.8s ease-out',
          opacity: isLoaded ? 0 : 1,
          pointerEvents: 'none',
        }}>
          <div style={{
            width: `${localProgress}%`,
            height: '100%',
            opacity: 0.9,
            background: '#03d7fc',
            position: 'absolute',
            left: 0,
            top: 0,
            transition: 'width 0.3s ease-out',
          }} />
          <span style={{ 
            position: 'relative',
            zIndex: 1,
            fontSize: localProgress === 100 ? 
              (deviceType === 'mobile' ? '24px' : '28px') : 
              (deviceType === 'mobile' ? '20px' : '24px'),
            fontWeight: 'bold',
          }}>{`${Math.round(localProgress)}%`}</span>
        </div>
      )}

      {showLoreText && <LoreText isStarted={opacity === 0} />}
    </motion.div>
  );
};

export default RiveLoadingScreen;
