import { useGLTF } from '@react-three/drei';
import { SCENE_MODELS, TRANSITION_MODELS } from '../SceneMods/types';

// Combine all models for preloading
const ALL_MODELS = { ...SCENE_MODELS, ...TRANSITION_MODELS };

export const preloadAllModels = async () => {
    console.log('Preloading all models...');
    const loadPromises = Object.values(ALL_MODELS).map(path => {
        return new Promise((resolve) => {
            useGLTF.preload(path);
            // Add a small delay between each load to prevent overwhelming
            setTimeout(resolve, 100);
        });
    });

    try {
        await Promise.all(loadPromises);
        console.log('All candies preloaded successfully LFG!');
        return true;
    } catch (error) {
        console.error('Error preloading models:', error);
        return false;
    }
};

// Cache validation function
export const validateModelCache = () => {
    return Object.values(ALL_MODELS).every(path => {
        try {
            const cached = useGLTF.cache.get(path);
            return cached !== undefined;
        } catch {
            return false;
        }
    });
};

// Optional: Add function to preload specific models
export const preloadModelsForAction = async (modelPaths) => {
    // console.log('Preloading models for action:', modelPaths);
    const loadPromises = modelPaths.map(path => {
        return new Promise((resolve) => {
            useGLTF.preload(path);
            setTimeout(resolve, 100);
        });
    });

    try {
        await Promise.all(loadPromises);
        return true;
    } catch (error) {
        console.error('Error preloading models for action:', error);
        return false;
    }
}; 