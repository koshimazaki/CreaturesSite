import { useGLTF } from '@react-three/drei';

// Import all models
import pyramidModel from '/src/assets/models/pyramid2.glb?url'
import palmModel from '/src/assets/models/palm.glb?url'
import fireModel from '/src/assets/models/coconut.glb?url'
import bossModel from '/src/assets/models/boss.glb?url'
import lootModel from '/src/assets/models/coconut.glb?url'
import characterModel from '/src/assets/models/OGanim-transformed.glb?url'
// ... any other models

export const MODEL_PATHS = {
    pyramid: pyramidModel,
    palm: palmModel,
    fire: fireModel,
    boss: bossModel,
    loot: lootModel,
    character: characterModel,
    // ... other models
};

export const preloadAllModels = async () => {
    console.log('Preloading all models...');
    const loadPromises = Object.values(MODEL_PATHS).map(path => {
        return new Promise((resolve) => {
            useGLTF.preload(path);
            // Add a small delay between each load to prevent overwhelming
            setTimeout(resolve, 100);
        });
    });

    try {
        await Promise.all(loadPromises);
        console.log('All models preloaded successfully');
        return true;
    } catch (error) {
        console.error('Error preloading models:', error);
        return false;
    }
};

// Cache validation function
export const validateModelCache = () => {
    return Object.values(MODEL_PATHS).every(path => {
        try {
            const cached = useGLTF.cache.get(path);
            return cached !== undefined;
        } catch {
            return false;
        }
    });
}; 