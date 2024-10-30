import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';

// Import models using relative paths with ?url
import pyramidModel from '/src/assets/models/pyramid2.glb?url'
import palmModel from '/src/assets/models/palm.glb?url'
import fireModel from '/src/assets/models/coconut.glb?url'
import bossModel from '/src/assets/models/boss.glb?url'
import characterModel from '/src/assets/models/OGanim-transformed.glb?url'

// Base Scene Action class
export class SceneAction {
    constructor(scene) {
        this.scene = scene;
    }

    cleanup() {
        this.scene.children
            .filter(child => child.userData.actionItem)
            .forEach(item => this.scene.remove(item));
    }

    loadModel(modelUrl) {
        return useGLTF(modelUrl);
    }
}

export class WorldsAction extends SceneAction {
    execute() {
        console.log('Starting WorldsAction execution');
        this.cleanup();
        
        try {
            // Load models synchronously since useGLTF caches the results
            const pyramidGLTF = useGLTF(pyramidModel);
            const palmGLTF = useGLTF(palmModel);

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
    execute() {
        console.log('Executing SpellsAction');
        this.cleanup();
        
        try {
            const fireGLTF = this.loadModel(fireModel);
            const model = new THREE.Group();
            
            // Clone the fire mesh and its materials
            if (fireGLTF.scene) {
                const fireMesh = fireGLTF.scene.clone();
                model.add(fireMesh);
                
                // Position and scale the fire
                model.position.set(0, 0, 0);
                model.scale.setScalar(0.5);
                
                model.userData.animate = (time) => {
                    model.rotation.y += 0.01;
                    const breathingScale = 0.5 + Math.sin(time * 0.8) * 0.05;
                    model.scale.setScalar(breathingScale);
                    
                    // Add hovering effect
                    model.position.y = Math.sin(time * 0.5) * 0.1;
                };
                
                model.userData.actionItem = true;
                this.scene.add(model);
                return true;
            }
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
            const { nodes, materials } = await this.loadModel(bossModel);
            const model = new THREE.Group();
            
            // Add your boss model setup here
            // Similar to WorldsAction but with boss-specific transforms and animations
            
            model.userData.animate = (time) => {
                model.rotation.y = Math.sin(time * 0.2) * 0.1;
                const breathingScale = 1 + Math.sin(time * 0.5) * 0.05;
                model.scale.setScalar(breathingScale);
            };
            
            model.userData.actionItem = true;
            this.scene.add(model);
        } catch (error) {
            console.error('Error in BossAction:', error);
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