import React, { useEffect, useCallback } from 'react';
import { useRive, useStateMachineInput, Layout, Fit, Alignment, EventType } from '@rive-app/react-canvas';

const RiveDebug = ({ onStateChange, onInputChange }) => {
  const { rive, RiveComponent } = useRive({
    src: '/Creature_uiV3.riv',
    artboard: 'Creature',
    stateMachines: ['Creature_SM', 'Menu_SM'],
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center
    }),
    onLoad: () => {
      if (rive) {
        // Log detailed information about all inputs
        rive.stateMachineNames.forEach(smName => {
          const inputs = rive.stateMachineInputs(smName);
          console.log(`${smName} inputs:`, inputs);
          if (inputs && inputs.length > 0) {
            inputs.forEach(input => {
              console.log(`Input details for ${smName}:`, {
                name: input.name,
                type: input.type,
                value: input.value,
                properties: Object.getOwnPropertyNames(input)
              });
            });
          }
        });
      }
    }
  });

  const menuInput = useStateMachineInput(rive, 'Menu_SM', 'Menu state');
  const creatureInput = useStateMachineInput(rive, 'Creature_SM', 'State');

  const testInputs = useCallback(() => {
    if (menuInput) {
      console.log('Current menu input value:', menuInput.value);
      try {
        const newValue = menuInput.value === 1 ? 2 : 1;
        menuInput.value = newValue;
        console.log('Changed menu input to:', menuInput.value);
      } catch (e) {
        console.error('Error changing menu input:', e);
      }
    } else {
      console.log('Menu input not found');
    }
  }, [menuInput]);

  const setMenuState = useCallback((state) => {
    if (menuInput) {
      try {
        menuInput.value = state;
        console.log('Menu state set to:', state);
      } catch (e) {
        console.error('Error setting menu state:', e);
      }
    } else {
      console.warn('Menu input not available');
    }
  }, [menuInput]);

  useEffect(() => {
    if (!rive) return;

    const logStateDetails = () => {
      rive.stateMachineNames.forEach(name => {
        const inputs = rive.stateMachineInputs(name);
        console.log(`State details for ${name}:`, {
          inputs: inputs?.map(i => ({
            name: i.name,
            value: i.value,
            type: i.type
          }))
        });
      });
    };

    // Log state details every few seconds
    const interval = setInterval(logStateDetails, 2000);

    // Make debugging functions available globally
    window.riveDebug = {
      rive,
      testInputs,
      menuInput,
      creatureInput,
      logState: logStateDetails,
      setMenuState
    };

    return () => {
      clearInterval(interval);
      delete window.riveDebug;
    };
  }, [rive, testInputs, menuInput, creatureInput, setMenuState]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'absolute',
          top: 10,
          left: 10,
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: 10,
          borderRadius: 5,
          zIndex: 1000
        }}>
          <button onClick={testInputs}>Test Input Changes</button>
          <button onClick={() => setMenuState(1)}>Menu State 1</button>
          <button onClick={() => setMenuState(2)}>Menu State 2</button>
          <div>
            Menu Input: {menuInput ? menuInput.value : 'N/A'}
          </div>
          <div>
            Creature Input: {creatureInput ? creatureInput.value : 'N/A'}
          </div>
          <button onClick={() => {
            const allInputs = rive?.stateMachineInputs('Menu_SM');
            console.log('All Menu Inputs:', allInputs);
          }}>Log Menu Inputs</button>
        </div>
      )}
    </div>
  );
};

export default RiveDebug;