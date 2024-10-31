// RiveLoadingScreen.jsx
import React, { useCallback, useState, useEffect } from 'react';
import { useRive, useStateMachineInput, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from './stores/zustandStore';
import useAudioStore from './Audio/audioStore';
import RiveControl from './UI/RiveControl';
import TextLore from './TextLore';
import ExoSemiBold from '/src/assets/fonts/Exo-SemiBold.ttf?url'
import { Tooltip } from '@mui/material'
import Info from './UI/InfoPanel';
import GCLogo from './assets/images/GC_Creatures_Logo.svg';
import ColorTransition from './ColorTransition';
// Import the full runtime
import { Runtime } from '@rive-app/canvas';
import { preloadAllModels, validateModelCache } from './utils/modelPreloader';


const RiveLoadingScreen = ({ onStart }) => {
  const {
    shouldAllowEntry,
    isStarted,
    setIsStarted,
    textIndex,
    setTextIndex,
    incrementOpacity,
    getTextContent,
    deviceType,
    isInfoVisible,
    setInfoVisible
  } = useStore();

  // Move console.log inside the component
  // console.log('deviceType:', deviceType, 'fontSize:', deviceType === 'desktop' ? '24px' : '14px');

  // Get the appropriate text content from the store
  const textLoreContent = getTextContent();

  useEffect(() => {
    // Store original console methods
    const originalWarn = console.warn;
    const originalError = console.error;

    // Create a filter function
    const isRiveMessage = (msg) => {
      if (typeof msg !== 'string') return false;
      return msg.includes('StateMachine exceeded') || 
             msg.includes('rive.wasm') ||
             msg.includes('exceeded max iterations');
    };

    // Override both warn and error
    console.warn = (...args) => {
      if (!args[0] || !isRiveMessage(args[0])) {
        originalWarn.apply(console, args);
      }
    };

    console.error = (...args) => {
      if (!args[0] || !isRiveMessage(args[0])) {
        originalError.apply(console, args);
      }
    };

    // Add window error handler, stackoverflows from RIVE
    const originalOnError = window.onerror;
    window.onerror = function(msg, url, lineNo, columnNo, error) {
      if (!isRiveMessage(msg)) {
        return originalOnError ? originalOnError(msg, url, lineNo, columnNo, error) : false;
      }
      return true; // Suppress Rive errors
    };

    // Cleanup
    return () => {
      console.warn = originalWarn;
      console.error = originalError;
      window.onerror = originalOnError;
    };
  }, []);

  // Move the log level setting inside the component
  useEffect(() => {
    try {
      if (Runtime && typeof Runtime.setLogLevel === 'function') {
        Runtime.setLogLevel(0); // Disable all logs
      }
    } catch (e) {
      console.log('Unable to set Rive log level');
    }
  }, []);

  const [showPlayButton, setShowPlayButton] = useState(false);
  const [showTextLore, setShowTextLore] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [showAboutButton, setShowAboutButton] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  const { initializeAudio, playAudio } = useAudioStore();


  // Creature setup
  const { rive: creatureRive, RiveComponent: CreatureComponent } = useRive({
    src: '/Creature_uiV3.riv',
    artboard: 'Creature',
    stateMachines: ['Creature_SM'],
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
    onLoad: () => {
      // console.log('Creature loaded');
      if (isInitialLoad) {
        // Initial load - delayed appearance
        setTimeout(() => setShowTextLore(true), 2000);
        setTimeout(() => {
          setShowPlayButton(true);
          setShowLogo(true);
          setShowAboutButton(true);
        }, 7000);
      } else {
        // Quick fade-in when returning from scene
        setShowTextLore(true);
        setShowPlayButton(true);
        setShowLogo(true);
        setShowAboutButton(true);
      }
    },
    // Add cleanup
    onStop: () => {
      // console.log('Creature stopping');
    }
  });

  // Use the state machine input hook with nested path
  const menuStateInput = useStateMachineInput(
    creatureRive,
    "Creature_SM",
    "Menu state",
    { stateMachinePath: "Creature/Menu" } // Add nested path configuration
  );

  // Effect to handle state changes
  useEffect(() => {
    if (menuStateInput && !isStarted) {
      try {
        console.log("Setting menu state input to 2");
        menuStateInput.value = 2;
      } catch (error) {
        console.error("Error setting menu state:", error);
      }
    }
  }, [menuStateInput, isStarted]);

  // Debug logging
  useEffect(() => {
    if (menuStateInput) {
      console.log("Menu state input:", menuStateInput);
      console.log("Current value:", menuStateInput.value);
    }
  }, [menuStateInput]);

  // Play animations when component mounts or becomes visible
  useEffect(() => {
    if (creatureRive && !isStarted) {
      // Play all animations
      creatureRive.play('Loop-corners');
      creatureRive.play('Loop-arrows');
      creatureRive.play('Loop-progress bar 1');
      creatureRive.play('Loop circles');
      creatureRive.play('Loop-Cross group');
      creatureRive.play('Loop-Triangles');
      creatureRive.play('Loop-focus lines');
    }
  }, [creatureRive, isStarted]);

  // Stop animations when started
  useEffect(() => {
    if (isStarted && creatureRive) {
      creatureRive.stop();
    }
  }, [isStarted, creatureRive]);

  const handleTextComplete = useCallback(() => {
    setTextIndex((prevIndex) => (prevIndex + 1) % textLoreContent.length);
  }, [textLoreContent.length, setTextIndex]);

  // Add initialization effect
  useEffect(() => {
    if (textIndex === undefined) {
      setTextIndex(0);
    }
  }, [textIndex, setTextIndex]);

  // Add model preloading to initial load sequence
  useEffect(() => {
    if (isInitialLoad) {
      const loadSequence = async () => {
        try {
          // Start preloading models immediately
          const modelLoadPromise = preloadAllModels();

          // Show text after 2s
          setTimeout(() => setShowTextLore(true), 2000);

          // Wait for models to load
          await modelLoadPromise;
          setModelsLoaded(true);
          console.log('Models loaded successfully');

          // Show UI elements after models are loaded
          setTimeout(() => {
            setShowPlayButton(true);
            setShowLogo(true);
            setShowAboutButton(true);
          }, 7000);

        } catch (error) {
          console.error('Error in load sequence:', error);
          // Still show UI even if model loading fails
          setShowPlayButton(true);
          setShowLogo(true);
          setShowAboutButton(true);
        }
      };

      loadSequence();
    }
  }, [isInitialLoad]);

  // Validate model cache before allowing start
  const handleStart = useCallback(async () => {
    if (isStarted || !modelsLoaded) return;

    // Double-check cache before proceeding
    if (!validateModelCache()) {
      console.warn('Model cache validation failed, reloading models...');
      await preloadAllModels();
    }

    try {
      await initializeAudio();
      await playAudio();
      setIsStarted(true);
      
      const fadeInterval = setInterval(incrementOpacity, 50);

      setTimeout(() => {
        setShowPlayButton(false);
        setShowLogo(false);
        setShowAboutButton(false);
        setShowTextLore(false);
        clearInterval(fadeInterval);
      }, 200);

      // Set isInitialLoad to false after first start
      setIsInitialLoad(false);

    } catch (error) {
      console.error('Error in start sequence:', error);
      setIsStarted(false);
    }
  }, [isStarted, modelsLoaded, setIsStarted, initializeAudio, playAudio]);




  // useEffect(() => {
  //   console.log('showTextLore:', showTextLore);
  //   console.log('textIndex:', textIndex);
  //   console.log('textLoreContent:', textLoreContent);
  // }, [showTextLore, textIndex]);

  // Debug logging
  useEffect(() => {
    // console.log('showPlayButton state:', showPlayButton);
  }, [showPlayButton]);

  // Effect to handle showing elements when returning
  useEffect(() => {
    if (!isStarted && !isInitialLoad) {
      // Quick fade-in when returning
      setTimeout(() => {
        setShowPlayButton(true);
        setShowTextLore(true);
        setShowLogo(true);
        setShowAboutButton(true);
      }, 100);
    }
  }, [isStarted, isInitialLoad]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      setShowPlayButton(false);
      setShowTextLore(false);
      if (creatureRive) {
        try {
          creatureRive.cleanup();
        } catch (error) {
          console.log('Cleanup error:', error);
        }
      }
    };
  }, [creatureRive]);

  return (
    <motion.div 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: '#14171A',
        zIndex: 9999,
        overflow: 'hidden',
      }}
      initial={{ opacity: 1 }}
      animate={{ opacity: isStarted ? 0 : 1 }}
      transition={{ duration: 0.15 }}
    >
      <motion.div 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%',
        }}
        animate={{ opacity: isStarted ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      >
        <CreatureComponent />
      </motion.div>

      {showTextLore && textIndex !== undefined && (
        <>
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: deviceType === 'desktop' ? '10vh' : '15vh',
            background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 100%)',
            zIndex: 1, // Lowered from 9999 to sit behind other elements
            pointerEvents: 'none',
          }} />
          
          <TextLore 
            texts={textLoreContent}
            currentIndex={textIndex}
            customFont={ExoSemiBold}
            onTextComplete={handleTextComplete}
            isStarted={true}
            style={{
              position: 'absolute',
              bottom: deviceType === 'desktop' ? '2vw' : '60%',
              left: deviceType === 'desktop' ? '50%' : '72%',
              transform: deviceType === 'desktop' ? 'translateX(-50%)' : 'none',
              zIndex: 10000,
              fontSize: deviceType === 'desktop' ? '25px' : '10px',
              textAlign: deviceType === 'desktop' ? 'center' : 'left',
              width: '90%',
              lineHeight: '1.2',
            }}
          />
        </>
      )}
      {!shouldAllowEntry && (
        <div style={{
          position: 'absolute',
          top: '5.2vw',
          left: '1vw',
          transform: 'translateY(-50%)',
          color: '#fc0398',
          textAlign: 'left',
          fontFamily: 'Monorama, sans-serif',
          padding: '5px',
          zIndex: 10000,
          fontSize: '14px',
          textShadow: '0 0 10px rgba(252, 3, 152, 0.7), 0 0 20px rgba(252, 3, 152, 0.5)',
          lineHeight: '1.2', // Added for better line spacing
        }}>
          <p style={{
            margin: 0,
            letterSpacing: '0.05em',
          }}>
            Load on Desktop<br />
            for full experience
          </p>
        </div>
      )}
      {shouldAllowEntry && (
        <RiveControl 
          onStart={handleStart} 
          show={showPlayButton} 
          style={{
            position: 'absolute',
            top: 'clamp(40%, 50vh, 45%)',  // Clamps between 40% and 60% vertically
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'clamp(140px, 15vw, 220px)',  // Clamps the width between 120px and 200px
            height: 'auto',
            zIndex: 2001
          }}
        />
      )}

      {/* GC Logo */}
      {showLogo && (
        <motion.div
          style={{
            position: 'absolute',
            top: '-.5vw',
            right: '2vw',
            zIndex: 2002,
            width: '6.8vw',
            height: '6.8vw',
            pointerEvents: 'auto',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <img 
            src={GCLogo} 
            alt="Glitch Candies Creatures"
            style={{
              width: '100%',
              height: '100%',
              filter: 'drop-shadow(0 0 5px rgba(252, 3, 152, 0.7)) drop-shadow(0 0 10px rgba(252, 3, 152, 0.5))',
              animation: 'glow 2s ease-in-out infinite alternate',
              cursor: 'pointer',
              display: 'block',
            }}
          />
        </motion.div>
      )}

{/* 
<Tooltip title="Back to Start" arrow placement="bottom">
                  <motion.div
                    style={{
                      position: 'absolute',
                      bottom: '1vw',
                      left: '11vw',
                      zIndex: 2002,
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
                      style={{
                        background: 'transparent',
                        border: '1px solid #03d7fc',
                    
                        color: 'grey',
                        padding: '0.5vw 1vw',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: 'clamp(12px, 1vw, 16px)',
                        fontFamily: 'Monorama',
                        filter: 'drop-shadow(0 0 5px rgba(3, 215, 252, 0.2)) drop-shadow(0 0 10px rgba(3, 215, 252, 0.2))',
                        transition: 'all 0.3s ease',
                        width: 'auto',
                        height: 'auto',
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
                </Tooltip> */}




      {/* About Game Button */}
      {showAboutButton && (
        <Tooltip title="Learn More" arrow placement="top">
          <motion.div
            style={{
              position: 'absolute',
              bottom: deviceType === 'desktop' ? '1vw' : '1vw',
              left: deviceType === 'desktop' ? '2.3vw' : 'clamp(40%, 42%, 45%)',
              zIndex: 2020,
              pointerEvents: 'auto',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              borderRadius: '4px',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={() => setInfoVisible(true)}
              style={{
                background: 'transparent',
                border: '1px solid #03d7fc',
                color: '#03d7fc',
                padding: '0.5vw 1.5vw',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: 'clamp(12px, 1vw, 16px)',
                fontFamily: 'Monorama',
                filter: 'drop-shadow(0 0 5px rgba(3, 215, 252, 0.7)) drop-shadow(0 0 10px rgba(3, 215, 252, 0.5))',
                transition: 'all 0.3s ease',
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
      )}

      <ColorTransition isTransitioning={true} />
    </motion.div>





  );
};

export default RiveLoadingScreen;
