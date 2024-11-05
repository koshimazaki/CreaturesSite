import * as THREE from 'three';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as types from './types';
import { useModelStore } from '../stores/modelStore';
import { useActionStore } from '../stores/actionStore';
import { MODEL_PATHS } from './types';
// Import models
import pyramidModel from '/src/assets/models/pyramid2.glb?url'
import palmModel from '/src/assets/models/palm.glb?url'
import bossModel from '/src/assets/models/boss.glb?url'
import characterModel from '/src/assets/models/OGanim-transformed.glb?url'
import { SHADER_PRESETS } from '../shaders/FireSpell'
import { uiAudioManager } from '../audio/UIAudioManager';
import { ActionTypes } from './types';
import PastelCreatureModel from '/src/assets/models/PastelAnim-transformed.glb?url'
import { SkeletonUtils } from 'three-stdlib'
import { PastelCreature } from '../Models'; // Make sure to import the component
// import { LootDisplay } from '../components/LootDisplay'

// Update the dispatch function at the top of the file
const dispatchAnimationEvent = (type) => {
    window.dispatchEvent(new CustomEvent('ecctrl-action', {
        detail: { 
            type: type === 'idle' ? 'idle' :
            type === 'fireball' ? 'action1' : 
            type === 'fly' ? 'action2' : 
            type === 'ninja_idle' ? 'boss' : 'idle' 
        }
    }));
};


// Preload all models
export const preloadModels = () => {
    // console.log('Preloading models for SceneActions');
    useGLTF.preload(pyramidModel);
    useGLTF.preload(palmModel);
    useGLTF.preload(fireModel);
    useGLTF.preload(bossModel);
    useGLTF.preload(lootModel);
    useGLTF.preload(characterModel);
};

// Create a model loader that uses cached models
const loadModel = async (modelUrl) => {
    try {
        const { scene: modelScene, nodes, materials } = await useGLTF(modelUrl);
        return { scene: modelScene, nodes, materials };
    } catch (error) {
        console.error('Error loading model:', modelUrl, error);
        throw error;
    }
};

// Base Scene Action class with updated loadModel method
export class SceneAction {
    constructor(scene) {
        this.scene = scene;
        // Initialize audio manager if not already done
        if (!uiAudioManager.initialized) {
            uiAudioManager.init();
        }
    }

    cleanup() {
        // console.log('Cleaning up scene items');
        const itemsToRemove = this.scene.children.filter(child => child.userData.actionItem);
        
        itemsToRemove.forEach(item => {
            // Remove animations
            if (item.userData.animate) {
                item.userData.animate = null;
            }
            
            // Dispose of geometries and materials
            if (item.geometry) {
                item.geometry.dispose();
            }
            if (item.material) {
                if (Array.isArray(item.material)) {
                    item.material.forEach(mat => mat.dispose());
                } else {
                    item.material.dispose();
                }
            }
            
            this.scene.remove(item);
        });
        
        // console.log(`Cleaned up ${itemsToRemove.length} items`);
    }

    async loadModel(modelUrl) {
        return loadModel(modelUrl);
    }

    // Add method to play action sound
    playActionSound(actionType) {
        uiAudioManager.playActionSound(actionType);
    }
}

export class WorldsAction extends SceneAction {
    async execute() {
        // console.debug('WorldsAction - Starting execution');
        this.cleanup();
        
        try {
            // Load models asynchronously
            const pyramidGLTF = await useGLTF(pyramidModel);
            const palmGLTF = await useGLTF(palmModel);

            if (!pyramidGLTF.nodes || !palmGLTF.nodes) {
                console.error('Models not loaded properly');
                return false;
            }

            // Create pyramid
            const pyramidGroup = new THREE.Group();
            const pyramidMesh = pyramidGLTF.nodes.Cube002.clone();
            pyramidMesh.material = pyramidGLTF.materials['Gradient.001'].clone();
            
            pyramidMesh.position.set(1.755, 10.672, -0.455);
            pyramidMesh.rotation.set(-Math.PI, 1.559, -Math.PI);
            pyramidMesh.scale.set(26.784, 10.911, 28.843);
            
            pyramidGroup.add(pyramidMesh);
            pyramidGroup.position.set(10, -2, -10);
            pyramidGroup.scale.setScalar(0.2);

            // Create palms
            const leftPalmGroup = new THREE.Group();
            const rightPalmGroup = new THREE.Group();

            const palmMesh = palmGLTF.nodes.Palm_01;
            if (palmMesh) {
                // Left palm
                const leftPalm = palmMesh.clone();
                leftPalmGroup.add(leftPalm);
                leftPalmGroup.position.set(-2, -1, -1);
                leftPalmGroup.scale.setScalar(0.2);
                leftPalmGroup.rotation.set(0, Math.PI * 0.3, 0);
            
                // Right palm
                const rightPalm = palmMesh.clone();
                rightPalmGroup.add(rightPalm);
                rightPalmGroup.position.set(2, -1, -1);
                rightPalmGroup.scale.setScalar(0.25);
                rightPalmGroup.rotation.set(0, -Math.PI * 0.5, 0);
            }

            // Add animations
            pyramidGroup.userData.animate = (time) => {
                pyramidGroup.rotation.y = Math.sin(time * 0.1) * 0.02;
                pyramidGroup.rotation.x = Math.sin(time * 0.08) * 0.005;
                pyramidGroup.rotation.z = Math.cos(time * 0.08) * 0.005;
                
                const pyramidBreathing = 0.05 + Math.sin(time * 0.2) * 0.002;
                pyramidGroup.scale.setScalar(pyramidBreathing);
                
                const hoverY = Math.sin(time * 0.5) * 0.05;
                pyramidGroup.position.y = hoverY;
            };

            leftPalmGroup.userData.animate = (time) => {
                leftPalmGroup.rotation.y = Math.PI * 0.2 + Math.sin(time * 0.5) * 0.1;
                leftPalmGroup.rotation.x = Math.sin(time * 0.3) * 0.05;
                leftPalmGroup.rotation.z = Math.cos(time * 0.4) * 0.05;
                
                const leftPalmBreathing = 0.5 + Math.sin(time * 0.8) * 0.2;
                leftPalmGroup.scale.setScalar(leftPalmBreathing);
            };

            rightPalmGroup.userData.animate = (time) => {
                rightPalmGroup.rotation.y = -Math.PI * 0.2 + Math.sin(time * 0.5) * 0.1;
                rightPalmGroup.rotation.x = Math.sin(time * 0.3) * 0.05;
                rightPalmGroup.rotation.z = Math.cos(time * 0.4) * 0.05;
                
                const rightPalmBreathing = 0.5 + Math.sin(time * 0.8) * 0.02;
                rightPalmGroup.scale.setScalar(rightPalmBreathing);
            };

            // Mark all objects as action items
            pyramidGroup.userData.actionItem = true;
            leftPalmGroup.userData.actionItem = true;
            rightPalmGroup.userData.actionItem = true;

            // Add to scene
            this.scene.add(pyramidGroup);
            this.scene.add(leftPalmGroup);
            this.scene.add(rightPalmGroup);

            // console.log('Pyramid and palms added to scene');
            return true; // Indicate successful execution

        } catch (error) {
            console.error('Error in WorldsAction:', error);
            return false; // Indicate failed execution
        }
    }
}


export class SpellsAction extends SceneAction {
    async execute() {
        // console.log('Executing SpellsAction');
        this.cleanup();
        
        try {
            // Dispatch the fireball animation
            dispatchAnimationEvent('fireball');
            
            // Create a container for the spell
            const spellContainer = new THREE.Group();
            spellContainer.userData.isFireSpell = true;
            spellContainer.userData.actionItem = true;
            
            // Add the container to the scene
            // The actual FireSpell component will be rendered by ShaderManager
            this.scene.add(spellContainer);

            return true;
        } catch (error) {
            // console.error('Error in SpellsAction:', error);
            return false;
        }
    }
}

export class LootAction extends SceneAction {
    async execute() {
        this.cleanup();
        
        try {
            // Find and show the PastelCreature
            const pastelCreature = this.scene.children.find(child => 
                child.userData && child.userData.isLoot
            );
            
            if (pastelCreature) {
                pastelCreature.visible = true;
                
                pastelCreature.userData.animate = (time) => {
                    // Gentle floating animation
                    const hoverOffset = Math.sin(time * 0.5) * 0.1;
                    pastelCreature.position.y = -0.7 + hoverOffset;
                    
                    // Subtle rotation
                    pastelCreature.rotation.y = Math.sin(time * 0.3) * 0.1;
                };
            }
            
            return true;
            
        } catch (error) {
            console.error('Error in LootAction:', error);
            return false;
        }
    }

    cleanup() {
        // Hide the PastelCreature
        const pastelCreature = this.scene.children.find(child => 
            child.userData && child.userData.isLoot === true
        );
        
        if (pastelCreature) {
            pastelCreature.visible = false;
        }

        // Regular cleanup for other items
        super.cleanup();
    }
}

export class BossAction extends SceneAction {
    async execute() {
        // console.log('Executing BossAction');
        this.cleanup();
        
        try {
            
            // Hide any visible PastelCreature first
            const pastelCreature = this.scene.children.find(child => 
                child.userData && child.userData.isLoot === true
            );
            
            if (pastelCreature) {
                pastelCreature.visible = false;
            }
            
            // Only dispatch the ninja_idle animation
            dispatchAnimationEvent('ninja_idle');
            
            const { nodes, materials } = useGLTF(MODEL_PATHS.boss);
            
            if (!nodes || !materials) {
                console.error('Boss model resources not found');
                return false;
            }

            const model = new THREE.Group();
            
            // Main mesh
            const mesh = new THREE.Mesh(
                nodes['tripo_node_c7370c76-670d-447e-ad20-d9fa550c239b'].geometry,
                materials['tripo_material_c7370c76-670d-447e-ad20-d9fa550c239b']
            );

            // Apply transformations
            mesh.scale.set(5.5, 5.8, 5.5);
            mesh.position.set(-4.6, 1.72, -2.6);
            mesh.rotation.set(0, Math.PI * 3.9, 0);
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            // Create skewed eye geometry
            const eyeGeometry = new THREE.SphereGeometry(0.05, 32, 16);
            // Flatten and stretch the sphere to make it more eye-like
            eyeGeometry.scale(1.8, 0.7, 0.5);

            const eyeMaterial = new THREE.MeshBasicMaterial({
                color: new THREE.Color('#ff1f5a'),
                transparent: true,
                opacity: 0.2, // Start dim
                blending: THREE.AdditiveBlending, // Add glow effect
            });

            // Create eyes with initial transforms
            const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial.clone());
            const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial.clone());

            // Start with fully transparent eyes
            leftEye.material.opacity = 0;
            rightEye.material.opacity = 0;

            // Position eyes (adjust these values to match your model)
            leftEye.position.set(1.29, 2.75, -3.26);
            leftEye.scale.setScalar(0.09);
            rightEye.position.set(2.1, 2.72,-3.07);
            rightEye.scale.setScalar(0.08);


 // Adjusted rotations for more dynamic look
            // Left eye: rotate up and slightly to the left
            leftEye.rotation.set(
                THREE.MathUtils.degToRad(35), // X rotation (up/down)
                THREE.MathUtils.degToRad(-25), // Y rotation (left/right)
                THREE.MathUtils.degToRad(-15)  // Z rotation (tilt)
            );

            // Right eye: rotate up and slightly to the right
            rightEye.rotation.set(
                THREE.MathUtils.degToRad(20),  // X rotation (up/down)
                THREE.MathUtils.degToRad(15),  // Y rotation (left/right)
                THREE.MathUtils.degToRad(20)   // Z rotation (tilt)
            );


            // Add animation data to the eyes
            leftEye.userData.initialOpacity = 0.1;
            rightEye.userData.initialOpacity = 0.05;

            // Add glow animation with fade-in
            const startTime = performance.now();
            const fadeInDelay = 400; // Delay before starting fade
            const fadeInDuration = 200; // Duration of fade animation

            const animate = (time) => {
                const elapsed = performance.now() - startTime;
                
                // Handle fade-in
                if (elapsed > fadeInDelay && elapsed <= fadeInDelay + fadeInDuration) {
                    // Calculate fade progress (0 to 1)
                    const fadeProgress = (elapsed - fadeInDelay) / fadeInDuration;
                    const minOpacity = 0.3;
                    leftEye.material.opacity = minOpacity * fadeProgress;
                    rightEye.material.opacity = minOpacity * fadeProgress;
                } else if (elapsed > fadeInDelay + fadeInDuration) {
                    // Normal pulsing animation after fade-in
                    const pulseT = (1 + Math.sin(time * 0.3)) / 2;
                    const minOpacity = 0.3;
                    const maxOpacity = 0.6;
                    
                    leftEye.material.opacity = minOpacity + (maxOpacity - minOpacity) * pulseT;
                    rightEye.material.opacity = minOpacity + (maxOpacity - minOpacity) * pulseT;
                }

                // Existing breathing animation
                const breathingScale = 1 + Math.sin(time * 0.2) * 0.05;
                leftEye.scale.set(
                    1.8 * breathingScale, 
                    0.7 * breathingScale, 
                    0.5 * breathingScale
                );
                rightEye.scale.set(
                    1.8 * breathingScale, 
                    0.7 * breathingScale, 
                    0.5 * breathingScale
                );

                requestAnimationFrame(() => animate(time + 0.016));
            };

            // Start animation
            animate(0);

            // Add everything to the model group
            model.add(mesh);
            model.add(leftEye);
            model.add(rightEye);
            model.userData.actionItem = true;
            
            this.scene.add(model);
            return true;

        } catch (error) {
            console.error('Error in BossAction:', error);
            return false;
        }
    }
}

export class PhysicsAction extends SceneAction {
    async execute() {
        // console.log('Executing PhysicsAction');
        this.cleanup();
        
        try {
            // Only dispatch the fly animation
            dispatchAnimationEvent('fly');
            
            const { nodes, materials } = await this.loadModel(characterModel);
            const model = new THREE.Group();
            
            // Add PhysicsField shader
            model.userData.shaderComponent = 'PhysicsField';
            model.userData.shaderVisible = true;
            
            // Add your character model setup here
            // Similar to WorldsAction but with character-specific transforms and animations
            
            model.userData.animate = (time) => {
                model.rotation.y += 0.005;
                const breathingScale = 1 + Math.sin(time * 0.3) * 0.03;
                model.scale.setScalar(breathingScale);
            };
            
            model.userData.actionItem = true;
            this.scene.add(model);
        } catch (error) {
            console.error('Error in PhysicsAction:', error);
            return false;
        }
    }
}

// Add a new StartAction class
export class StartAction extends SceneAction {
    execute() {
        // console.log('Executing StartAction - clearing scene');
        this.cleanup();
        
        // Only dispatch idle if this is the initial state
        dispatchAnimationEvent('idle');
        
        return true;
    }
} 