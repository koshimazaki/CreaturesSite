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
import { useActionStore } from './stores/actionStore';

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
import { isMobile, isTablet } from 'react-device-detect';
import GCLogo from './assets/images/GC_Creatures_Logo.svg';
import Info from './UI/InfoPanel';
import MorphingButton from './SceneMods/MorphingButton';
import CustomCursor from './UI/CustomCursor';
import { makeInteractive } from './utils/styles';
import LoopLoreText from './LoopLoreText';
import { Leva } from 'leva'
import { TooltipProvider } from '@radix-ui/react-tooltip'


export default function App() {
  const { progress } = useProgress();

  // Main store state
  const {
    isLoaded,
    isStarted,
    setIsLoaded,
    setProgress,
    setDeviceType,
    shouldShowEffects,
    shouldShowFullscreen,
    shouldAllowEntry,
    isAndroid,
    isIOS,
    isInfoVisible,
    setInfoVisible,
    showLoadingScreen,
    setShowLoadingScreen,
    returnToRive,
    setIsStarted

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
      // Use the same logic as the store
      setDeviceType(isMobile || isTablet ? 'mobile' : 'desktop');
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

  const handleGlobalClick = useCallback((event) => {
    // Close InfoPanel if it's open and the click is outside the panel and info button
    if (isInfoVisible && 
        !infoRef.current?.contains(event.target) && 
        !infoButtonRef.current?.contains(event.target)) {
      setIsInfoVisible(false);
      return;
    }
  }, [isInfoVisible]);



  const handleGeometryChange = () => {
    if (window.handleGeometryChange) {
      window.handleGeometryChange()
    }
  }

  // Update the return handler to trigger next track instead of stopping
  const handleReturnToRive = () => {
    const { playNextTrack } = useAudioStore.getState();
    
    // First trigger the next track
    if (playNextTrack) {
      playNextTrack();
    }
    
    // Set loading screen first, then after a short delay reset isStarted
    setShowLoadingScreen(true);
    setTimeout(() => {
      setIsStarted(false);
    }, 100);
  };



  // // Add this to help debug the SVG dimensions
  // useEffect(() => {
  //   const img = new Image();
  //   img.onload = () => {
  //     console.log('SVG natural dimensions:', {
  //       width: img.naturalWidth,
  //       height: img.naturalHeight
  //     });
  //   };
  //   img.src = GCLogo;
  // }, []);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isInfoVisible && 
          !infoRef.current?.contains(event.target) && 
          !infoButtonRef.current?.contains(event.target)) {
        setInfoVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isInfoVisible, setInfoVisible]);

  // Add refs
  const infoRef = useRef(null);
  const infoButtonRef = useRef(null);

  return (
    <>
    <TooltipProvider>
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        right: 0, 
        zIndex: 20999,
        pointerEvents: 'auto'
      }}>
        <Leva 
          collapsed={false} 
          oneLineLabels={false}
          flat={true}
          theme={{
            sizes: {
              rootWidth: '320px',
              controlWidth: '170px'
            }
          }}
        />
      </div>
      <CustomCursor />
      
      <style>
        {`
          body {
            cursor: none;
          }
          a, button, [role="button"] {
            cursor: none;
          }
          // Add this to ensure Leva panel is always on top
          .leva-container {
            z-index: 9999 !important;
            position: relative;
            pointer-events: auto !important;
          }
        `}
      </style>

    <LandscapeEnforcer>
      {showLoadingScreen && <RiveLoadingScreen onStart={handleStart} />}
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
                
                <Tooltip title="Back to Start" arrow placement="bottom">
                  <motion.div
                    {...makeInteractive}
                    style={{
                      position: 'absolute',
                      bottom: '1vw',
                      left: '11vw',
                      zIndex: 102,
                      // padding: '0.1vw 0.1vw',

                      pointerEvents: 'auto',
                      backdropFilter: 'blur(4px)',
                      WebkitBackdropFilter: 'blur(4px)',
                      backgroundColor: 'rgba(0, 0, 0, 0.4)',
                      borderRadius: '4px',
                      // border: '1px solid rgba(3, 215, 252, 0.2)',

                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      {...makeInteractive}
                      onClick={handleReturnToRive}
                      style={{
                        background: 'transparent',
                        border: '1px solid #03d7fc',
                        color: '#03d7fc',
                        padding: '0.5vw 1vw',
                        borderRadius: '4px',
                        // cursor: 'pointer',
                        fontSize: 'clamp(12px, 1vw, 16px)',
                        fontFamily: 'Monorama',
                        filter: 'drop-shadow(0 0 5px rgba(3, 215, 252, 0.7)) drop-shadow(0 0 10px rgba(3, 215, 252, 0.5))',
                        transition: 'all 0.3s ease',
                        width: 'auto',
                        height: 'auto',
                        cursor: 'none',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#03d7fc20';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                      }}
                    >
                      Start
                    </button>
                  </motion.div>
                </Tooltip>


                <Tooltip title="Learn More" arrow placement="top">
                  <motion.div
                    {...makeInteractive}
                    style={{
                      position: 'absolute',
                      bottom: '1vw',
                      left: '2.3vw',
                      zIndex: 2002,
                      pointerEvents: 'auto',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      backgroundColor: 'rgba(0, 0, 0, 0.4)',
                      borderRadius: '4px',
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      {...makeInteractive}
                      ref={infoButtonRef}
                      onClick={() => setInfoVisible(!isInfoVisible)}
                      style={{
                        background: 'transparent',
                        border: '1px solid #03d7fc',
                        color: '#03d7fc',
                        padding: '0.5vw 1.5vw',
                        borderRadius: '4px',
                        fontSize: 'clamp(12px, 1vw, 16px)',
                        fontFamily: 'Monorama',
                        filter: 'drop-shadow(0 0 5px rgba(3, 215, 252, 0.7)) drop-shadow(0 0 10px rgba(3, 215, 252, 0.5))',
                        transition: 'all 0.3s ease',
                        cursor: 'none',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#03d7fc20';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                      }}
                    >
                      About Game
                    </button>
                  </motion.div>
                </Tooltip>


                      {/* Second Push Button - Natural size */}
                      <Tooltip title="Push that button!" arrow placement="right">
                        <motion.div
                          {...makeInteractive}
                          style={{
                            position: 'absolute',
                            top: '-.5vw',
                            right: '2vw',
                            zIndex: 2002,
                            width: '6.8vw',
                            height: '6.8vw',
                            pointerEvents: 'auto',
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div {...makeInteractive} style={{ width: '100%', height: '100%' }}>
                            <img 
                              src={GCLogo} 
                              alt="Glitch Candies Creatures"
                              {...makeInteractive}
                              style={{
                                width: '100%',
                                height: '100%',
                                filter: 'drop-shadow(0 0 5px rgba(252, 3, 152, 0.7)) drop-shadow(0 0 10px rgba(252, 3, 152, 0.5))',
                                animation: 'glow 2s ease-in-out infinite alternate',
                                display: 'block',
                              }}
                              onClick={handleGeometryChange}
                            />
                          </div>
                        </motion.div>
                      </Tooltip>

                      <div {...makeInteractive} style={{ width: '100%', height: '100%' }}>

                      {/* X/Twitter Icon */}
                      <Tooltip title="Glitch Candies on X" arrow placement="top">
                        <motion.div
                          style={{ 
                            position: 'absolute', 
                            bottom: '1vw', 
                            right: '6vw', 
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
                            {...makeInteractive}
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
                      </div>

                      {/* Made by text */}
                      <Tooltip title="Visit our website" arrow placement="top">
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
                            <div {...makeInteractive} style={{ 
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

                        {/* Fullscreen button - Only on desktop */}
                        {shouldShowFullscreen && (
                      <div {...makeInteractive} style={{ 
                        position: 'absolute',
                        bottom: '0vw',
                        right: '1vw',
                        zIndex: 1010,
                        pointerEvents: 'auto',
                      }}>
                        <FullscreenButton />
                      </div>
                    )}

                    {/* Add MorphingButton here */}
                    <motion.div
                      {...makeInteractive}
                      style={{
                        
                        position: 'absolute',
                        bottom: 'clamp(0.5vw, 0.8vw, 1vw)',
                        left: 'clamp(43%,55%, 60%)',
                        transform: 'translateX(-50%)',
                        zIndex: 2002,
                        pointerEvents: 'auto',
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <MorphingButton />
                    </motion.div>

                  

                    {/* Add this as a separate element, near but independent from MorphingButton
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      style={{
                        position: 'absolute',
                        bottom: 'clamp(0.5vw, 0.8vw, 1vw)',
                        left: 'clamp(25%, 35%, 45%)', // Adjust position as needed
                        zIndex: 2002,
                        fontFamily: 'Monorama, sans-serif',
                        fontSize: 'clamp(12px, 1vw, 16px)',
                        color: '#03d7fc',
                        textShadow: '0 0 10px rgba(0,255,255,0.7)',
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none',
                        userSelect: 'none',
                      }}
                    >
                      {useStore.getState().textLoopLore[0]}
                    </motion.div> */}
                    <LoopLoreText />
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
              top: 'calc(0.1vw + clamp(90px, 8.5vw, 90px))',
              left: '2.5vw',
              width: 'clamp(110px, 12vw, 170px)',
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
          {/* Only show effects on non-Android devices */}
          {shouldShowEffects && (
              // <ChromaticAberration
              //   offset={[0.012, 0.002]}
              //   blendFunction={BlendFunction.NORMAL}
              // />
              //   )}
              <Glitch
                delay={[1.5, 3.5]}
                duration={[0.6, 1.0]}
                strength={[0.3, 1.0]}
                mode={GlitchMode.SPORADIC}
                active
                ratio={0.8}
              />
          )}
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
      
      {/* Info Panel rendered at root level */}
      <Info 
        ref={infoRef}
        isInfoVisible={isInfoVisible} 
        onClose={() => setInfoVisible(false)} 
      />



    </LandscapeEnforcer>
    </TooltipProvider>
  </>
    
  );
}
