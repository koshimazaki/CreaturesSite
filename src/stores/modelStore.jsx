import { create } from 'zustand';
import { useGLTF } from '@react-three/drei';
import { MODEL_PATHS } from '../SceneMods/types';

export const useModelStore = create((set, get) => ({
    isLoading: false,
    loadedModels: {},
    loadingErrors: {},
    modelCache: {},
    
    // Simplified preload that maintains performance
    preloadModels: async () => {
        const state = get();
        if (state.isLoading) return;

        set({ isLoading: true });

        try {
            const loadPromises = Object.entries(MODEL_PATHS).map(([id, path]) => {
                return new Promise((resolve, reject) => {
                    try {
                        useGLTF.preload(path);
                        // Small delay to prevent GPU bottleneck
                        setTimeout(() => {
                            get().setModelLoaded(id);
                            resolve();
                        }, 50);
                    } catch (error) {
                        get().setModelError(id, error);
                        reject(error);
                    }
                });
            });

            await Promise.all(loadPromises);
        } catch (error) {
            console.error('Error preloading models:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    // Simple model loading status tracking
    setModelLoaded: (modelId, success = true) => set(state => ({
        loadedModels: {
            ...state.loadedModels,
            [modelId]: success
        }
    })),

    setModelError: (modelId, error) => set(state => ({
        loadingErrors: {
            ...state.loadingErrors,
            [modelId]: error
        }
    })),

    // Basic cache validation with safety checks
    validateCache: () => {
        if (!useGLTF.cache) {
            console.warn('GLTF cache not initialized');
            return false;
        }

        const validations = Object.entries(MODEL_PATHS).map(([id, path]) => {
            try {
                // Safely check cache
                const cached = useGLTF.cache.get?.(path);
                const isValid = Boolean(cached);
                return [id, isValid];
            } catch (error) {
                console.warn(`Cache validation failed for ${id}:`, error);
                return [id, false];
            }
        });

        const cacheStatus = Object.fromEntries(validations);
        set({ modelCache: cacheStatus });
        return validations.every(([, isValid]) => isValid);
    },

    // Simple model getter
    getModel: (modelId) => {
        try {
            return useGLTF(MODEL_PATHS[modelId]);
        } catch (error) {
            console.error(`Error getting model ${modelId}:`, error);
            return null;
        }
    },

    // Safe cache clearing
    clearCache: () => {
        if (!useGLTF.cache) {
            console.warn('GLTF cache not initialized');
            return;
        }

        try {
            Object.values(MODEL_PATHS).forEach(path => {
                const cached = useGLTF.cache.get?.(path);
                if (cached && useGLTF.cache.delete) {
                    useGLTF.cache.delete(path);
                }
            });
            
            set({ 
                loadedModels: {},
                loadingErrors: {},
                modelCache: {}
            });
        } catch (error) {
            console.error('Error clearing cache:', error);
        }
    }
}));

// Safer cache validation on window focus
let lastValidationTime = 0;
const VALIDATION_COOLDOWN = 5000; // 5 seconds cooldown

window.addEventListener('focus', () => {
    const now = Date.now();
    if (now - lastValidationTime < VALIDATION_COOLDOWN) {
        return; // Skip if we validated recently
    }
    
    lastValidationTime = now;
    setTimeout(() => {
        const isValid = useModelStore.getState().validateCache();
        if (!isValid) {
            console.log('Cache invalid, reloading...');
            useModelStore.getState().clearCache();
        }
    }, 100);
}); 