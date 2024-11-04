import { useState, useEffect, useRef } from 'react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { useActionStore } from '../stores/actionStore';
import { stateOrder, STATE_TO_ACTION } from './types';

export const MorphingButton = () => {
    const [currentStateIndex, setCurrentStateIndex] = useState(0);
    const { setAction } = useActionStore();
    const isTransitioning = useRef(false);
    const lastActionTime = useRef(Date.now());
    const actionQueue = useRef([]);

    const { rive: menuRive, RiveComponent: MenuComponent } = useRive({
        src: '/Creature_uiV3.riv',
        artboard: 'Menu-Item',
        stateMachines: 'State Machine 1',
        preload: true,
        autoplay: true,
        layout: new Layout({
            fit: Fit.Cover,
            alignment: Alignment.Center
        }),
        onLoadError: (error) => {
            console.error('Rive loading error:', error);
        }
    });

    // Process queued actions
    const processActionQueue = () => {
        if (actionQueue.current.length > 0 && !isTransitioning.current) {
            const nextAction = actionQueue.current.shift();
            executeAction(nextAction);
        }
    };

    // Execute a single action
    const executeAction = (nextIndex) => {
        if (!menuRive) return;

        isTransitioning.current = true;
        const inputs = menuRive.stateMachineInputs('State Machine 1');
        const textInput = inputs?.find(input => input.name === 'Text String');

        if (textInput) {
            textInput.value = nextIndex;
            setCurrentStateIndex(nextIndex);

            const action = STATE_TO_ACTION[nextIndex];
            if (action) {
                try {
                    setAction({
                        id: action.id,
                        function: `${action.id}Action`,
                        type: 'model'
                    });
                } catch (error) {
                    console.error('Error setting action:', error);
                }
            }
        }

        // Reset transition lock after animation
        setTimeout(() => {
            isTransitioning.current = false;
            processActionQueue(); // Process next action if any
        }, 500);
    };

    const handleClick = () => {
        // Prevent rapid clicks and double transitions
        const now = Date.now();
        if (!menuRive || isTransitioning.current || (now - lastActionTime.current) < 500) return;

        lastActionTime.current = now;
        
        // Calculate next state index
        const nextIndex = (currentStateIndex + 1) % stateOrder.length;
        
        // Execute the action directly
        executeAction(nextIndex);
    };

    // Initialize state
    useEffect(() => {
        if (menuRive && !isTransitioning.current) {
            const inputs = menuRive.stateMachineInputs('State Machine 1');
            const textInput = inputs?.find(input => input.name === 'Text String');
            if (textInput) {
                textInput.value = 0;
                const action = STATE_TO_ACTION[0];
                if (action) {
                    try {
                        setAction({
                            id: action.id,
                            function: `${action.id}Action`,
                            type: 'model'
                        });
                    } catch (error) {
                        console.error('Error setting initial action:', error);
                    }
                }
            }
        }
    }, [menuRive]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            actionQueue.current = [];
            isTransitioning.current = false;
        };
    }, []);

    return (
        <div 
            onClick={handleClick}
            style={{
                position: 'absolute',
                bottom: '5rem',
                right: 'clamp(42%,43%,45%)',
                width: '240px',
                height: '240px',
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