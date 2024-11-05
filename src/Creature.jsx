import React, { useRef, useEffect, useState } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

// Import model directly - adjust the path to match your project structure
import ogAnimModel from '/src/assets/models/OGanim.glb?url';

const OG = (props) => {
  const group = useRef();
  
  // Load model directly instead of through props
  const { scene, animations } = useGLTF(ogAnimModel);
  const { actions } = useAnimations(animations, group);
  
  // Track current animation state
  const [currentAnimation, setCurrentAnimation] = useState('idle');
  const fadeTime = 0.5;
  
  // Refs for cleanup
  const animationTimeoutRef = useRef(null);
  const currentActionRef = useRef(null);

  useEffect(() => {
    if (!scene || !animations) {
      // console.error('Failed to load model or animations');
      return;
    }

    // Debug available animations
   // console.log('Available animations:', animations.map(a => a.name));
    //console.log('Available actions:', Object.keys(actions));
  }, [animations, actions, scene]);

  const crossFadeAnimation = (fromAction, toAction, duration = fadeTime) => {
    if (!fromAction || !toAction) {
    //  console.warn('Invalid actions for crossfade');
      return null;
    }

    try {
      // Ensure the target animation is enabled and reset
      toAction.reset().setEffectiveTimeScale(1).setEffectiveWeight(1);
      
      // Crossfade to the new animation
      fromAction.crossFadeTo(toAction, duration, true);
      
      // Play the new animation
      toAction.play();
      
      return toAction;
    } catch (error) {
      console.error('Error during animation crossfade:', error);
      return null;
    }
  };

  const playAnimation = (animationName) => {
    // console.log('Playing animation:', animationName)
    
    // Clear any existing timeouts
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current)
    }

    // Fade out current animation if exists
    if (currentActionRef.current) {
      currentActionRef.current.fadeOut(0.3)
    }

    const action = actions[animationName]
    if (action) {
      // Configure animation based on type
      switch(animationName) {
        case 'fly':
        case 'ninja_idle':
          // These animations should loop
          action.loop = THREE.LoopRepeat
          action.clampWhenFinished = false
          break
        case 'fireball':
          // One-shot animation that returns to idle
          action.loop = THREE.LoopOnce
          action.clampWhenFinished = true
          break
        case 'idle':
          // Idle always loops
          action.loop = THREE.LoopRepeat
          action.clampWhenFinished = false
          break
      }

      action
        .reset()
        .setEffectiveTimeScale(1)
        .setEffectiveWeight(1)
        .fadeIn(0.3)
        .play()

      currentActionRef.current = action

      // Only set up return to idle for fireball animation
      if (animationName === 'fireball') {
        const duration = action.getClip().duration
        animationTimeoutRef.current = setTimeout(() => {
          playAnimation('idle')
        }, duration * 1000)
      }
    }
  }

  useEffect(() => {
    const handleAnimationChange = (event) => {
      const { type } = event.detail;
      // console.log('Animation event received:', type);

      // Map action types to animation names and durations
      const animationConfig = {
        'idle': { name: 'idle', duration: null },
        'action1': { name: 'fireball', duration: actions.fireball?.getClip().duration },
        'action2': { name: 'fly', duration: actions.fly?.getClip().duration },
        'boss': { name: 'ninja_idle', duration: null }
      };

      const config = animationConfig[type] || animationConfig.idle;
    //  console.log('Playing animation:', config.name, 'with duration:', config.duration);
      playAnimation(config.name);
    };

    // Set up event listener
    window.addEventListener('ecctrl-action', handleAnimationChange);
    
    // Play initial idle animation
    if (actions.idle) {
      playAnimation('idle');
    }

    // Cleanup
    return () => {
      window.removeEventListener('ecctrl-action', handleAnimationChange);
      
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      
      // Properly cleanup all animations
      Object.values(actions).forEach(action => {
        if (action?.isRunning()) {
          action.fadeOut(fadeTime);
          action.stop();
        }
      });
    };
  }, [actions]);

  // Debug current animation state
  useEffect(() => {
    // console.log('Current animation:', currentAnimation);
  }, [currentAnimation]);

  return (
    <group ref={group} {...props}>
      {scene && <primitive object={scene} />}
    </group>
  );
};

// Preload the model
useGLTF.preload(ogAnimModel);

export default OG;