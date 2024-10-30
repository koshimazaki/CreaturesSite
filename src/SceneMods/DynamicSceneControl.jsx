import { useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { useActionStore } from '../stores/actionStore';
import { 
    StartAction,
    WorldsAction, 
    SpellsAction, 
    BossAction, 
    PhysicsAction 
} from './SceneActions';

const DynamicSceneControl = () => {
    const { activeAction } = useActionStore();
    const { scene } = useThree();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!activeAction || !activeAction.function) return;

        const executeAction = async () => {
            setIsLoading(true);
            try {
                let action;
                
                // Add StartAction to switch case
                switch (activeAction.function) {
                    case 'StartAction':
                        action = new StartAction(scene);
                        break;
                    case 'WorldsAction':
                        action = new WorldsAction(scene);
                        break;
                    case 'SpellsAction':
                        action = new SpellsAction(scene);
                        break;
                    case 'BossAction':
                        action = new BossAction(scene);
                        break;
                    case 'PhysicsAction':
                        action = new PhysicsAction(scene);
                        break;
                }

                if (action) {
                    const success = await action.execute();
                    if (!success) {
                        console.warn(`Action ${activeAction.function} did not complete successfully`);
                    }
                }
            } catch (error) {
                console.error('Error executing action:', error);
            } finally {
                setIsLoading(false);
            }
        };

        executeAction();
    }, [scene, activeAction]);

    // Initialize with StartAction
    useEffect(() => {
        const startAction = new StartAction(scene);
        startAction.execute();
    }, [scene]);

    return null;
};

export default DynamicSceneControl;
