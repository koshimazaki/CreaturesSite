import React, { useCallback, useEffect } from 'react';
import { useRive, Layout, Fit, Alignment, EventType } from '@rive-app/react-canvas';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../zustandStore';

const RiveControl = ({ onStart, show }) => {
  const setIsStarted = useStore(state => state.setIsStarted);
  const incrementOpacity = useStore(state => state.incrementOpacity);

  // Play button setup with improved animation handling
  const { rive: playRive, RiveComponent: PlayComponent } = useRive({
    src: '/buttons.riv',
    artboard: 'Play',
    animations: ['Arrows', 'Hologram'],
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    onLoad: () => {
      console.log('🎮 Play button loaded');
    }
  });

  // Handle click/tap event
  const handleClick = useCallback(() => {
    console.log('Play button clicked');

    // Start fade sequence
    const fadeInterval = setInterval(() => {
      incrementOpacity();
    }, 50);

    // Trigger Rive animation and state changes
    if (playRive) {
      playRive.play('Hologram');
      
      // Allow animation to complete before state change
      setTimeout(() => {
        playRive.stop();
        setIsStarted(true);
        onStart?.();
        clearInterval(fadeInterval);
      }, 300);
    } else {
      setIsStarted(true);
      onStart?.();
      clearInterval(fadeInterval);
    }
  }, [playRive, setIsStarted, onStart, incrementOpacity]);

  if (!show) return null;

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10000,
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20 
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            position: 'absolute',
            bottom: '10vw',
            left: '7vw',
            width: '200px',
            height: '200px',
            cursor: 'pointer',
            pointerEvents: 'auto',
            userSelect: 'none',
            WebkitTapHighlightColor: 'transparent',
          }}
          onClick={handleClick}
        >
          <PlayComponent />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RiveControl;