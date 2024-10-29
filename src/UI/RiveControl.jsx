// RiveControl.jsx
import React from 'react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { motion } from 'framer-motion';

const RiveControl = ({ onStart, show }) => {
  const { rive: playRive, RiveComponent: PlayComponent } = useRive({
    src: '/buttons.riv',
    artboard: 'Play',
    stateMachines: 'State Machine 1',
    // animations: ['Arrows', 'Hologram'],
    preload: true,
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center
    })
  });

  const handleClick = () => {
    if (playRive) {
      playRive.play('Hologram');
    }
    onStart();
  };

  if (!show) return null;

  return (
    <motion.div
      onClick={handleClick}
      style={{
        position: 'fixed',
        bottom: 'clamp(13vw, 15vw, 17vw)',
        left: 'clamp(40%, 42%, 45%)',
        width: '240px',
        height: '240px',
        cursor: 'pointer',
        zIndex: 10000,
        opacity: 0.7,
        transition: 'opacity 0.3s ease'
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
      onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
    >
      <PlayComponent />
    </motion.div>
  );
};

export default RiveControl;
