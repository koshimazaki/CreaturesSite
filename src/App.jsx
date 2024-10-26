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
import useStore from './stores/zustandStore';
import useAudioStore from './Audio/audioStore';
import Experience from './Experience';
import './styles.css';
import HologramOG from './HologramOG';
import UIOverlay from './UI/UIOverlay';
import EmbedFix from './EmbedFix';
import { Html } from '@react-three/drei'
import { motion } from 'framer-motion'
import { Tooltip } from '@mui/material'
import cyberpunkIcon from '/src/assets/icons/X31.png?url'
import FullscreenButton from './UI/FullscreenButton'
import PushButton from './UI/PushButton'


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
      // console.log('Audio playing from App');
    } catch (error) {
      console.error('Error starting audio:', error);
    }
  };

  const handleGeometryChange = () => {
    if (window.handleGeometryChange) {
      window.handleGeometryChange()
    }
  }


  return (
    <LandscapeEnforcer>
      <RiveLoadingScreen onStart={handleStart} />
      {isStarted && (
        <>
        
          {/* Main Scene Canvas */}
          <Canvas 
            gl={{ antialias: true, samples: 4 }}
            shadows 
            dpr={[1, 1.5]} 
            camera={{ position: [-1.5, 1, 5.5], fov: 45, near: 1, far: 20 }} 
            eventSource={document.getElementById('root')} 
            eventPrefix="client"
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 1,
            }}
          >
            <Suspense fallback={null}>
              <Experience />
              
              <Html fullscreen style={{ pointerEvents: 'none', zIndex: 1000 }}>
                <div style={{
                  opacity: isLoaded ? 1 : 0,
                  transition: 'opacity 2s ease-in-out',
                }}>
                  {isLoaded && (
                    <>
                
                      {/* Second Push Button - Natural size */}
                      <Tooltip title="Push that Button! or hit 0" arrow placement="left">
                        <motion.div
                          style={{
                            position: 'absolute',
                            top: '0.5vw',
                            right: '2.3vw',
                            zIndex: 2002,
                            width: '100px', // Natural size for Push artboard
                            height: '100px',
                            pointerEvents: 'auto',
                          }}
                           >
                          <PushButton 
                            onClick={handleGeometryChange}
                            artboard="Push"
                            animations={['Push the button', 'Menu rotation', 'Menu text rotation']}
                            keyBinding="1"
                          />
                        </motion.div>
                      </Tooltip>

                    
                      {/* X/Twitter Icon */}
                      <Tooltip title="Glitch Candies on X" arrow placement="top">
                        <motion.div
                          style={{ 
                            position: 'absolute', 
                            bottom: '1vw', 
                            left: '2vw', 
                            zIndex: 1002,
                            pointerEvents: 'auto',
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <a 
                            href="https://x.com/glitchcandies" 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <img 
                              src={cyberpunkIcon}
                              alt="Glitch Candies X"
                              style={{
                                width: 'clamp(24px, 4vw, 56px)',
                                height: 'clamp(24px, 4vw, 56px)',
                                opacity: 0.75,
                                cursor: 'pointer',
                              }}
                            />
                          </a>
                        </motion.div>
                      </Tooltip>

                      {/* Made by text */}
                      <Tooltip title="Visit our website" arrow placement="left">
                        <motion.div
                          style={{
                            position: 'absolute',
                            bottom: '1.9vw',
                            right: '11vw',
                            zIndex: 1002,
                            pointerEvents: 'auto',
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <a 
                            href="https://glitchnftstudio.xyz" 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <div style={{ 
                              fontSize: 'clamp(8px, 1.2vw, 12px)', 
                              opacity: 0.6, 
                              color: 'white', 
                              fontFamily: 'Exo',
                              whiteSpace: 'nowrap',
                              cursor: 'pointer',
                            }}>
                              Made by Glitch NFT Studio
                            </div>
                          </a>
                        </motion.div>
                      </Tooltip>

                      {/* Fullscreen button */}
                      <div style={{ 
                        position: 'absolute',
                        bottom: '0vw',
                        right: '1vw',
                        zIndex: 1010,
                        pointerEvents: 'auto',
                      }}>
                        <FullscreenButton />
                      </div>
                    </>
                  )}
                </div>
              </Html>
            </Suspense>
          </Canvas>

          {/* Hologram Canvas */}
          <Canvas
            style={{
              position: 'absolute',
              top: 'calc(0.1vw + clamp(100px, 8.5vw, 120px))',
              left: '2.3vw',
              width: 'clamp(110px, 12vw, 160px)',
              height: 'calc(6vw + clamp(120px, 9vw, 160px))',
              zIndex: 2,
              background: 'black',
              opacity: 0.75,
              outline: '1px solid #373837',
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

          {/* UI Layer */}
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            zIndex: 1000,
          }}>
            <UIOverlay />
            <EmbedFix />
          </div>
        </>
      )}
    </LandscapeEnforcer>
  );
}
