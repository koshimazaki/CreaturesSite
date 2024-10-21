import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRive, useStateMachineInput, Layout, Fit, Alignment } from '@rive-app/react-canvas';

const HealthBarTriangles = ({ style }) => {
  const [riveError, setRiveError] = useState(null);

  const { RiveComponent, rive } = useRive({
    src: '/buttons.riv',
    stateMachines: 'State Machine 1',
    artboard: 'Healthbar',
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    autoplay: true,
    onLoad: () => {
      console.log('Triangles Rive loaded successfully');
    },
    onError: (err) => {
      console.error('Error loading Triangles file:', err);
      setRiveError(err);
    },
  });

  const walkInput = useStateMachineInput(rive, 'State Machine 1', 'Walk');
  const blingInput = useStateMachineInput(rive, 'State Machine 1', 'Bling');

  useEffect(() => {
    if (walkInput) {
      walkInput.fire();
    }
  }, [walkInput]);

  const handleClick = useCallback(() => {
    if (blingInput) {
      blingInput.fire();
    }
    console.log('Health Bar clicked');
  }, [blingInput]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        width: '200px',
        height: '50px',
        cursor: 'pointer',
        ...style,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
    >
      {riveError ? (
        <div>Error loading animation: {riveError.message}</div>
      ) : (
        <RiveComponent />
      )}
    </motion.div>
  );
};

export default HealthBarTriangles;
