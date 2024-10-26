import React, { useState, useEffect, useMemo, Suspense, useRef, useCallback } from 'react'
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration, DepthOfField } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Glitch } from '@react-three/postprocessing'
import { GlitchMode } from 'postprocessing'
import { easing } from 'maath'
import { useProgress } from '@react-three/drei';
import RiveLoadingScreen from './RiveLoadingScreen';
import LandscapeEnforcer from './LandscapeEnforcer';
import useStore from './zustandStore';
import useAudioStore from './Audio/audioStore';
import Experience from './Experience';
import './styles.css';
import HologramOG from './HologramOG';
import UIOverlay from './UI/UIOverlay';
import EmbedFix from './EmbedFix';

export default function App() {
  const { progress } = useProgress();

  // Main store state
  const {
    isLoaded,
    isStarted,
    setIsLoaded,
    setProgress,
    setDeviceType
  } = useStore();

  // Audio store state and methods
  const {
    initializeAudio,
    playAudio,
    isInitialized
  } = useAudioStore();

  // Initialize audio when app loads
  useEffect(() => {
    const setupAudio = async () => {
      if (!isInitialized) {
        await initializeAudio();
      }
    };
    setupAudio();
  }, [initializeAudio, isInitialized]);

  // Track loading progress
  useEffect(() => {
    setProgress(progress);
    if (progress === 100) {
      setIsLoaded(true);
    }
  }, [progress, setProgress, setIsLoaded]);

  // Handle device type changes
  useEffect(() => {
    const handleResize = () => {
      setDeviceType(window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [setDeviceType]);

  const handleStart = async () => {
    try {
      if (!isInitialized) {
        await initializeAudio();
      }
      await playAudio();
      console.log('Audio playing from App');
    } catch (error) {
      console.error('Error starting audio:', error);
    }
  };

  return (
    <LandscapeEnforcer>
      <RiveLoadingScreen onStart={handleStart} />
      {isStarted && (
        <div style={{ 
          width: '100vw', 
          height: '100vh', 
          position: 'absolute',
          top: 0,
          left: 0,
          transition: 'opacity 0.5s ease-in-out',
          zIndex: 1000,
        }}>
          <Canvas 
            gl={{ antialias: true, samples: 4 }}
            shadows 
            dpr={[1, 1.5]} 
            camera={{ position: [-1.5, 1, 5.5], fov: 45, near: 1, far: 20 }} 
            eventSource={document.getElementById('root')} 
            eventPrefix="client"
            style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
          >
            <Experience />
          </Canvas>

          <Canvas
            style={{
              position: 'absolute',
              top: 'calc(0.1vw + clamp(100px, 8.5vw, 120px))',
              left: '2.3vw',
              width: 'clamp(120px, 12vw, 180px)',
              height: 'calc(6vw + clamp(120px, 9vw, 160px))',
              zIndex: 1,
              background: 'black',
              backgroundOpacity: '0.2',
              opacity: 0.75,
              outline: '1px solid #373837',
              outlineOffset: '0px',
              outlineWidth: '1px',
              outlineOpacity: '0.01'
            }}
            camera={{ position: [0, 0, 5], fov: 45 }}
            className="hologram-canvas"
          >
            <Suspense fallback={null}>
              <HologramOG scale={0.38} position={[0, -1.2, 0]} rotation={[0, -Math.PI * 0.1, 0]} />
              <ambientLight intensity={0.8} />
              <pointLight position={[1, 10, 10]} />
            </Suspense>

            <EffectComposer>
              <ChromaticAberration
                offset={[0.012, 0.002]}
                blendFunction={BlendFunction.NORMAL}
              />
              <Glitch
                delay={[1.5, 3.5]}
                duration={[0.6, 1.0]}
                strength={[0.3, 1.0]}
                mode={GlitchMode.SPORADIC}
                active
                ratio={0.8}
              />
            </EffectComposer>
          </Canvas>

          <UIOverlay />    
          <EmbedFix />
        </div>
      )}
    </LandscapeEnforcer>
  );
}
