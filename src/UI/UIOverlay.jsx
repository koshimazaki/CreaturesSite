import React, { useEffect, useCallback, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { Tooltip } from '@mui/material'
import FullscreenButton from './FullscreenButton'
import InfoPanel from './InfoPanel'
import RetroGraphiteMUIAudioPlayer from '../Audio/AudioPlayer'
import PushButton from './PushButton'
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas'
import { Html } from '@react-three/drei'

const AnimatedIcon = motion.div
import cyberpunkIcon from '/src/assets/icons/X31.png?url'


// TRIANGLES and RIVE FUNCTIONS  - UI OVERLAY in t

export default function UIOverlay() {
  const controls = useAnimation();
  const [isKeyPressed, setIsKeyPressed] = useState(false);

  // Updated Rive component setup with proper cleanup
  const { rive, RiveComponent } = useRive({
    src: '/buttons.riv',
    stateMachines: ['State Machine 1'], // Add your state machine name if you have one
    animations: ['Bling'],
    artboard: 'Healthbar',
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    onLoad: () => {
      // console.log('Push button Rive file loaded successfully');
    },
    onError: (err) => {
      console.error('Error loading push button Rive file:', err);
    },
  });

  // Combined action handler
  const handleButtonAction = useCallback(() => {
    if (rive) {
      try {
        const animation = rive.animationByName('Push the button');
        if (animation) {
          animation.reset();
          animation.play();
        }
      } catch (error) {
        console.error('Error playing Rive animation:', error);
      }
    }
    handleGeometryChange();
  }, [rive]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (rive) {
        try {
          rive.cleanup();
        } catch (error) {
          console.error('Error cleaning up Rive:', error);
        }
      }
    };
  }, [rive]);

  // Key handlers
  const handleKeyDown = useCallback((event) => {
    if (event.key === '0' && !isKeyPressed) {
      setIsKeyPressed(true);
      controls.set({ scale: 0.95 });
      handleButtonAction();
    }
  }, [handleButtonAction, isKeyPressed, controls]);

  const handleKeyUp = useCallback((event) => {
    if (event.key === '0') {
      setIsKeyPressed(false);
      controls.set({ scale: 1 });
    }
  }, [controls]);

  // Auto-play menu animations
  useEffect(() => {
    if (rive) {
      rive.play('Menu rotation');
      rive.play('Menu text rotation');
    }
  }, [rive]);

  // Key event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return (
    <>

      {/* First Push Button (Healthbar) - Keep original larger size */}
      <Tooltip title="Push that Button! (or press '0')" arrow placement="left">
        <motion.div
          style={{
            position: 'absolute',
            top: '0vw',
            left: '2.3vw',
            zIndex: 2002,
            width: 'clamp(120px, 12vw, 180px)', // Original larger size
            height: '100px',
            pointerEvents: 'auto',
          }}
        >
          <PushButton 
            onClick={handleButtonAction}
            artboard="Healthbar"
            animations={['Bling']}
            style={{
              width: 'clamp(120px, 12vw, 180px)', // Match container size
              height: '100px'
            }}
          />
        </motion.div>
      </Tooltip>

    </>
  );
}
