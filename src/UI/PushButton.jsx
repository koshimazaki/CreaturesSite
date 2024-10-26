import React from 'react';
import { motion } from 'framer-motion';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';

const PushButton = ({ 
  onClick, 
  style, 
  artboard = 'Push',
  animations = ['Push the button', 'Menu rotation', 'Menu text rotation'],
  tooltipText = "Push that Button!",
  tooltipPlacement = "left",
  keyBinding = '0'
}) => {
  const { RiveComponent, rive } = useRive({
    src: '/buttons.riv',
    artboard: artboard,
    animations: animations,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    autoplay: true,
    onLoad: () => {
      // console.log('Push button Rive file loaded successfully');
      if (rive) {
        animations.forEach(animation => {
          if (animation.includes('Menu')) {
            rive.play(animation);
          }
        });
      }
    },
    onError: (err) => {
      console.error('Error loading push button Rive file:', err);
    },
  });

  return (
    <motion.div
      style={{
        width: '100px',
        height: '100px',
        cursor: 'pointer',
        ...style,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        if (rive) {
          rive.play('Push the button');
        }
        onClick?.();
      }}
    >
      <RiveComponent />
    </motion.div>
  );
};

export default PushButton;
