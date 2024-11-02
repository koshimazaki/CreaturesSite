import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import * as types from './types';
import { useModelStore } from '../stores/modelStore';
import { useActionStore } from '../stores/actionStore';
import { MODEL_PATHS } from './types';
// Import models
import pyramidModel from '/src/assets/models/pyramid2.glb?url'
import palmModel from '/src/assets/models/palm.glb?url'
import fireModel from '/src/assets/models/coconut.glb?url'
import bossModel from '/src/assets/models/boss.glb?url'
import lootModel from '/src/assets/models/coconut.glb?url'
import characterModel from '/src/assets/models/OGanim-transformed.glb?url'
import { FireSpell } from '../shaders/FireSpell'

// Preload all models
export const preloadModels = () => {
    console.log('Preloading models for SceneActions');
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
    }

    cleanup() {
        console.log('Cleaning up scene items');
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
        
        console.log(`Cleaned up ${itemsToRemove.length} items`);
    }

    async loadModel(modelUrl) {
        return loadModel(modelUrl);
    }
}

export class WorldsAction extends SceneAction {
    async execute() {
        console.log('Executing WorldsAction');
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

            console.log('Pyramid and palms added to scene');
            return true; // Indicate successful execution

        } catch (error) {
            console.error('Error in WorldsAction:', error);
            return false; // Indicate failed execution
        }
    }
}

export class SpellsAction extends SceneAction {
    async execute() {
        console.log('Executing SpellsAction');
        this.cleanup();
        
        try {
            // No need to load any models, just mark that spell should be active
            const spellContainer = new THREE.Group();
            spellContainer.userData.isFireSpell = true;
            spellContainer.userData.actionItem = true;
            
            // The actual FireSpell component is managed by ShaderManager
            // This just serves as a marker that the spell should be active
            this.scene.add(spellContainer);
            
            return true;
        } catch (error) {
            console.error('Error in SpellsAction:', error);
            return false;
        }
    }
}

export class LootAction extends SceneAction {
    async execute() {
        console.log('Executing LootAction');
        this.cleanup();
        
        try {
            const fireGLTF = await this.loadModel(fireModel);
            const model = new THREE.Group();
            
            if (fireGLTF.scene) {
                const fireMesh = fireGLTF.scene.clone();
                model.add(fireMesh);
                
                model.position.set(-1, -0.7, 1.5);
                model.scale.setScalar(0.3);
                
                model.userData.animate = (time) => {
                    model.rotation.y += 0.01;
                    const breathingScale = 0.5 + Math.sin(time * 0.8) * 0.05;
                    model.scale.setScalar(breathingScale);
                    model.position.y = Math.sin(time * 0.5) * 0.1;
                };
                
                model.userData.actionItem = true;
                this.scene.add(model);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error in SpellsAction:', error);
            return false;
        }
    }
}

export class BossAction extends SceneAction {
    async execute() {
        console.log('Executing BossAction');
        this.cleanup();
        
        try {
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

            // Add glow animation
            const animate = (time) => {
                const pulseT = (1 + Math.sin(time * 0.3)) / 2; // Slowed down the pulse
                const minOpacity = 0.3;
                const maxOpacity = 0.6;
                
                leftEye.material.opacity = minOpacity + (maxOpacity - minOpacity) * pulseT;
                rightEye.material.opacity = minOpacity + (maxOpacity - minOpacity) * pulseT;

                // Subtle scale breathing
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
        console.log('Executing PhysicsAction');
        this.cleanup();
        
        try {
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
        }
    }
}

// Add a new StartAction class
export class StartAction extends SceneAction {
    execute() {
        console.log('Executing StartAction - clearing scene');
        this.cleanup();
        return true;
    }
} 