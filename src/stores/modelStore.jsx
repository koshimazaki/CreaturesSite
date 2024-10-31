import { create } from 'zustand';
import { useGLTF } from '@react-three/drei';
import { MODEL_PATHS } from '../utils/modelPreloader';

export const useModelStore = create((set, get) => ({
    // Loading states
    isLoading: false,
    loadedModels: {},
    loadingErrors: {},
    
    // Model cache status
    modelCache: {},
    
    // Loading management
    startLoading: () => set({ isLoading: true }),
    finishLoading: () => set({ isLoading: false }),
    
    // Track loaded models
    setModelLoaded: (modelId, success = true) => set(state => ({
        loadedModels: {
            ...state.loadedModels,
            [modelId]: success
        }
    })),

    // Track loading errors
    setModelError: (modelId, error) => set(state => ({
        loadingErrors: {
            ...state.loadingErrors,
            [modelId]: error
        }
    })),

    // Preload all models
    preloadModels: async () => {
        const state = get();
        if (state.isLoading) return;

        set({ isLoading: true });

        try {
            const loadPromises = Object.entries(MODEL_PATHS).map(([id, path]) => {
                return new Promise((resolve, reject) => {
                    try {
                        useGLTF.preload(path);
                        setTimeout(() => {
                            get().setModelLoaded(id);
                            resolve();
                        }, 100);
                    } catch (error) {
                        get().setModelError(id, error);
                        reject(error);
                    }
                });
            });

            await Promise.all(loadPromises);
            console.log('All models preloaded successfully');
        } catch (error) {
            console.error('Error preloading models:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    // Validate model cache
    validateCache: () => {
        const validations = Object.entries(MODEL_PATHS).map(([id, path]) => {
            try {
                const cached = useGLTF.cache.get(path);
                return [id, cached !== undefined];
            } catch {
                return [id, false];
            }
        });

        set({ modelCache: Object.fromEntries(validations) });
        return validations.every(([, isValid]) => isValid);
    },

    // Get a loaded model
    getModel: (modelId) => {
        try {
            return useGLTF(MODEL_PATHS[modelId]);
        } catch (error) {
            console.error(`Error getting model ${modelId}:`, error);
            return null;
        }
    }
})); 