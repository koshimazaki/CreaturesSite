// RiveLoadingScreen.jsx
import React, { useCallback, useState, useEffect } from 'react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from './stores/zustandStore';
import useAudioStore from './Audio/audioStore';
import RiveControl from './UI/RiveControl';
import TextLore from './TextLore';
import ExoSemiBold from '/src/assets/fonts/Exo-SemiBold.ttf?url'
// Import the full runtime
import { Runtime } from '@rive-app/canvas';




const RiveLoadingScreen = ({ onStart }) => {
  const shouldAllowEntry = useStore(state => state.shouldAllowEntry);
  const isStarted = useStore(state => state.isStarted);
  const setIsStarted = useStore(state => state.setIsStarted);
  const textIndex = useStore(state => state.textIndex);
  const setTextIndex = useStore(state => state.setTextIndex);
  const incrementOpacity = useStore(state => state.incrementOpacity);
  const getTextContent = useStore(state => state.getTextContent);
  const deviceType = useStore(state => state.deviceType);

  // Move console.log inside the component
  console.log('deviceType:', deviceType, 'fontSize:', deviceType === 'desktop' ? '24px' : '14px');

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
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);

  const { initializeAudio, playAudio, audioPlayerRef } = useAudioStore();


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
      console.log('Supernatural Creatures are assembling... content loaded');
      // Let's add some debug logs
      setTimeout(() => {
        // console.log('Setting showTextLore to true');
        setShowTextLore(true);
      }, 2000);
      setTimeout(() => setShowPlayButton(true), 6500);
    },
  });

  const handleTextComplete = useCallback(() => {
    setTextIndex((prevIndex) => (prevIndex + 1) % textLoreContent.length);
  }, [textLoreContent.length, setTextIndex]);

  // Add initialization effect
  useEffect(() => {
    if (textIndex === undefined) {
      setTextIndex(0);
    }
  }, [textIndex, setTextIndex]);

  useEffect(() => {
    if (isStarted) {
      creatureRive?.stop();
    }
  }, [isStarted, creatureRive]);

  const handleStart = useCallback(async () => {
    if (isStarted) return;
    
    // console.log('Starting sequence...');
    
    try {
      await onStart(); // This will handle audio initialization and play
      setShowAudioPlayer(true);
      setIsStarted(true);
      
      const fadeInterval = setInterval(incrementOpacity, 50);

      setTimeout(() => {
        setShowPlayButton(false);
        clearInterval(fadeInterval);
      }, 500);

    } catch (error) {
      console.error('Error in start sequence:', error);
      setIsStarted(false);
    }
  }, [isStarted, setIsStarted, onStart, incrementOpacity]);



  // useEffect(() => {
  //   console.log('showTextLore:', showTextLore);
  //   console.log('textIndex:', textIndex);
  //   console.log('textLoreContent:', textLoreContent);
  // }, [showTextLore, textIndex]);

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
            zIndex: 9999,
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
              bottom: '2vw',
              left: deviceType === 'desktop' ? '50%' : '1.8vw',
              transform: deviceType === 'desktop' ? 'translateX(-50%)' : 'none',
              zIndex: 10000,
              fontSize: deviceType === 'desktop' ? '25px' : '8px',
              textAlign: deviceType === 'desktop' ? 'center' : 'left',
              width: '90%',
              lineHeight: '1.2', // Added for better line spacing

            }}
          />
        </>
      )}
      {!shouldAllowEntry && (
        <div style={{
          position: 'absolute',
          top: '72%',
          left: '2vw',
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
        <RiveControl onStart={handleStart} show={showPlayButton} />
      )}
    </motion.div>
  );
};

export default RiveLoadingScreen;
