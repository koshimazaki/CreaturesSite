import React, { useEffect, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import useStore from './zustandStore';
import RiveControl from './UI/RiveControl';
import TextLore from './TextLore';
import ExoSemiBold from '/src/assets/fonts/Exo-SemiBold.ttf?url'

const RiveLoadingScreen = ({ onStart }) => {
  const isStarted = useStore(state => state.isStarted);
  const textIndex = useStore(state => state.textIndex); // Get textIndex from the store
  const setTextIndex = useStore(state => state.setTextIndex); // Get the setter function

  const [showPlayButton, setShowPlayButton] = useState(false);
  const [showTextLore, setShowTextLore] = useState(false);

  // Loading text content
  const textLoreContent = [
    
    "Welcome to Glitch Candies: Creatures",
    "We are stuck between galaxies...",
    "Initialising Glitch Protocol...",
    "Magic worlds are assembling...",
    "Creatures morph and glitch into new forms...",
    "Tech and spells are generating...",
    "Epic bosses are spawning...",
    "Clues are scattered across...",
    "Intergalactic travel will continue soon...",
    "The journey is starting soon...",

  ];

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
      console.log('Creature loaded');
      // Start timer after Creature loads
      setTimeout(() => {
        setShowTextLore(true); // Show TextLore after 4 seconds
      }, 4000);
      
      setTimeout(() => {
        setShowPlayButton(true); // Show play button after 6.5 seconds
      }, 6500);
    },
  });

  // Handle text completion
  const handleTextComplete = useCallback(() => {
    setTextIndex(prevIndex => {
      // Move to the next line, loop back to the start if at the end
      return (prevIndex + 1) % textLoreContent.length;
    });
  }, [setTextIndex, textLoreContent.length]);

  // Stop animations when started
  useEffect(() => {
    if (isStarted) {
      creatureRive?.stop();
    }
  }, [isStarted, creatureRive]);

  const handleStart = useCallback(() => {
    onStart?.();
  }, [onStart]);

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

     

      <TextLore 
        texts={textLoreContent}
        currentIndex={textIndex}
        customFont={ExoSemiBold}
        onTextComplete={handleTextComplete}
        style={{
          position: 'absolute',
          bottom: '2.5vw',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          maxWidth: '600px',
          textAlign: 'center',
          fontFamily: 'Monorama, sans-serif',
          fontSize: '24px',
          color: '#03d7fc',
          opacity: 0.85,
          textShadow: '0 0 10px rgba(0,255,255,0.7)',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        isStarted={showTextLore}
        
      />

      <RiveControl onStart={handleStart} show={showPlayButton} />
    </motion.div>
  );
};

export default RiveLoadingScreen;
