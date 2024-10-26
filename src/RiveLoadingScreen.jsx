// RiveLoadingScreen.jsx
import React, { useCallback, useState, useEffect } from 'react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from './stores/zustandStore';
import useAudioStore from './Audio/audioStore';
import RiveControl from './UI/RiveControl';
import TextLore from './TextLore';
import ExoSemiBold from '/src/assets/fonts/Exo-SemiBold.ttf?url'

const RiveLoadingScreen = ({ onStart }) => {
  const isStarted = useStore(state => state.isStarted);
  const setIsStarted = useStore(state => state.setIsStarted);
  const textIndex = useStore(state => state.textIndex);
  const setTextIndex = useStore(state => state.setTextIndex);
  const incrementOpacity = useStore(state => state.incrementOpacity);

  const [showPlayButton, setShowPlayButton] = useState(false);
  const [showTextLore, setShowTextLore] = useState(false);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);

  const { initializeAudio, playAudio, audioPlayerRef } = useAudioStore();

  // Loading text content
  const textLoreContent = [
    "___",
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
      // Let's add some debug logs
      setTimeout(() => {
        console.log('Setting showTextLore to true');
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
    
    console.log('Starting sequence...');
    
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

  useEffect(() => {
    console.log('showTextLore:', showTextLore);
    console.log('textIndex:', textIndex);
    console.log('textLoreContent:', textLoreContent);
  }, [showTextLore, textIndex]);

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
        <TextLore 
          texts={textLoreContent}
          currentIndex={textIndex}
          customFont={ExoSemiBold}
          onTextComplete={handleTextComplete}
          isStarted={true}  // Add this prop
          style={{
            position: 'absolute',
            bottom: '2.5vw',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10000,
          }}
        />
      )}

      <RiveControl onStart={handleStart} show={showPlayButton} />
    </motion.div>
  );
};

export default RiveLoadingScreen;
