import { useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { SCENE_MODELS, TRANSITION_MODELS } from '../SceneMods/types';

const ALL_MODELS = { ...SCENE_MODELS, ...TRANSITION_MODELS };

export const useModelPreloader = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const preloadModels = async () => {
            console.log('Starting model preload...');
            setIsLoading(true);

            try {
                // Initialize cache if needed
                if (!useGLTF.cache) {
                    useGLTF.cache = new Map();
                }

                // Preload all models sequentially to avoid overwhelming
                for (const [id, path] of Object.entries(ALL_MODELS)) {
                    try {
                        console.log(`Preloading model: ${id}`);
                        await new Promise((resolve) => {
                            useGLTF.preload(path);
                            setTimeout(resolve, 100); // Small delay between loads
                        });
                    } catch (error) {
                        console.error(`Error loading model ${id}:`, error);
                    }
                }

                setIsLoaded(true);
                console.log('All models preloaded successfully LFG!');
            } catch (error) {
                console.error('Error in preload sequence:', error);
            } finally {
                setIsLoading(false);
            }
        };

        preloadModels();

        // Cleanup
        return () => {
            // Optional: Clear cache on unmount
            // useGLTF.cache?.clear();
        };
    }, []);

    return { isLoading, isLoaded };
}; 