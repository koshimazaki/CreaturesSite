import React, { useCallback, useState, useEffect } from 'react';
import { useRive, Layout, Fit, Alignment, EventType } from '@rive-app/react-canvas';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../zustandStore';
import RiveDebugComponent from './RiveDebug';

const RiveControl = ({ onStart, audioPlayerRef, onMenuStateChange, currentMenuState }) => {
  const setIsStarted = useStore(state => state.setIsStarted);
  const [showPlayButton, setShowPlayButton] = useState(true);

  // Play button setup
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

  // Spin button setup
  const { rive: spinRive, RiveComponent: SpinComponent } = useRive({
    src: '/buttons.riv',
    artboard: 'Spin',
    animations: ['Menu text rotation', 'Menu rotation'],
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    onLoad: () => {
      console.log('🎯 Spin button loaded');
    }
  });

  // Handle button events
  useEffect(() => {
    const handlePlayEvent = (event) => {
      console.log('▶️ Play button event:', event);
      if (event.data?.name === 'Open Menu') {
        console.log('🎮 Play button triggered menu open');
        setShowPlayButton(false);
        setTimeout(() => {
          setIsStarted(true);
          onStart && onStart();
        }, 500);
      }
    };

    const handleSpinEvent = (event) => {
      console.log('🎯 Spin button event:', event);
      // Toggle menu state when spin is clicked
      const newState = currentMenuState === 1 ? 2 : 1;
      onMenuStateChange(newState);
    };

    if (playRive) playRive.on(EventType.RiveEvent, handlePlayEvent);
    if (spinRive) spinRive.on(EventType.RiveEvent, handleSpinEvent);

    return () => {
      if (playRive) playRive.off(EventType.RiveEvent, handlePlayEvent);
      if (spinRive) spinRive.off(EventType.RiveEvent, handleSpinEvent);
    };
  }, [playRive, spinRive, setIsStarted, onStart, onMenuStateChange, currentMenuState]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
    }}>
      <AnimatePresence>
        {showPlayButton && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'absolute',
              bottom: '4vw',
              left: '10vw',
              width: '200px',
              height: '200px',
              cursor: 'pointer',
              pointerEvents: 'auto',
            }}
          >
            <PlayComponent />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        style={{
          position: 'absolute',
          top: '2.5vw',
          right: '14vw',
          width: '200px',
          height: '200px',
          cursor: 'pointer',
          pointerEvents: 'auto',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <SpinComponent />
      </motion.div>
    </div>
  );
};

export default RiveControl;