import React from 'react';
import { motion } from 'framer-motion';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';

const PushButton = ({ onClick, style }) => {
  const { RiveComponent } = useRive({
    src: '/buttons.riv',
    artboard: 'Spin',
    animations: ['Menu rotation', 'Menu text rotation'],
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    autoplay: true,
    onLoad: () => {
      console.log('Push button Rive file loaded successfully');
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
      onClick={onClick}
    >
      <RiveComponent />
    </motion.div>
  );
};

export default PushButton;
