import { useState, useEffect, useRef } from 'react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { useActionStore } from '../stores/actionStore';
import { stateOrder, STATE_TO_ACTION } from './types';

export const MorphingButton = () => {
    const [currentStateIndex, setCurrentStateIndex] = useState(0);
    const { setAction } = useActionStore();
    const isTransitioning = useRef(false);
    const lastActionTime = useRef(Date.now());

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

    const handleClick = () => {
        // Prevent rapid clicks and double transitions
        const now = Date.now();
        if (!menuRive || isTransitioning.current || (now - lastActionTime.current) < 500) return;

        isTransitioning.current = true;
        lastActionTime.current = now;
        
        // Calculate next state index
        const nextIndex = (currentStateIndex + 1) % stateOrder.length;
        console.log('Transitioning from state', currentStateIndex, 'to', nextIndex);
        
        // Get Rive inputs
        const inputs = menuRive.stateMachineInputs('State Machine 1');
        const textInput = inputs?.find(input => input.name === 'Text String');
        
        if (textInput) {
            // Update Rive state
            textInput.value = nextIndex;
            
            // Update local state
            setCurrentStateIndex(nextIndex);
            
            // Update scene action
            const action = STATE_TO_ACTION[nextIndex];
            if (action) {
                setAction({
                    id: action.id,
                    function: `${action.id}Action`,
                    type: 'model'
                });
            }
        }

        // Reset transition lock after animation completes
        setTimeout(() => {
            isTransitioning.current = false;
        }, 500);
    };

    // Initial state setup - with cleanup prevention
    useEffect(() => {
        if (menuRive && !isTransitioning.current) {
            const inputs = menuRive.stateMachineInputs('State Machine 1');
            const textInput = inputs?.find(input => input.name === 'Text String');
            if (textInput) {
                textInput.value = 0;
                const action = STATE_TO_ACTION[0];
                if (action) {
                    setAction({
                        id: action.id,
                        function: `${action.id}Action`,
                        type: 'model'
                    });
                }
            }
        }
    }, [menuRive]); // Only depend on menuRive

    return (
        <div 
            onClick={handleClick}
            style={{
                position: 'absolute',
                bottom: '5rem',
                right: '5rem',
                width: '150px',
                height: '150px',
                cursor: isTransitioning.current ? 'wait' : 'pointer',
                zIndex: 1000,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <MenuComponent />
        </div>
    );
};

export default MorphingButton;