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

// Geometry Change  

const handleGeometryChange = () => {
  if (window.handleGeometryChange) {
    window.handleGeometryChange()
  }
}

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
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 2000,
    }}>
      {/* Fullscreen Button */}
      <div style={{ 
        position: 'absolute',
        bottom: '1vw',
        right: '1vw',
        zIndex: 2010,
        pointerEvents: 'auto', // Ensure this is set
      }}>
        <FullscreenButton />
      </div>

      {/* First Push Button (Healthbar) - Keep original larger size */}
      <Tooltip title="Push that Button! (or press '0')" arrow placement="left">
        <motion.div
          style={{
            position: 'absolute',
            top: '0.5vw',
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

      {/* Second Push Button - Natural size */}
      <Tooltip title="Push that Button! (or press '1')" arrow placement="left">
        <motion.div
          style={{
            position: 'absolute',
            top: '0.5vw',
            right: '2.3vw',
            zIndex: 2002,
            width: '100px', // Natural size for Push artboard
            height: '100px',
            pointerEvents: 'auto',
          }}
        >
          <PushButton 
            onClick={handleGeometryChange}
            artboard="Push"
            animations={['Push the button', 'Menu rotation', 'Menu text rotation']}
            keyBinding="1"
          />
        </motion.div>
      </Tooltip>

      {/* Website Link */}
      <Tooltip title="Visit our website" arrow placement="left">
        <motion.div
          style={{
            position: 'absolute',
            bottom: '1.2vw',
            right: '11vw',
            zIndex: 2000,
            cursor: 'pointer',
            pointerEvents: 'auto', // Ensure this is set
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <a 
            href="https://glitchnftstudio.xyz" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              padding: '0.5em 1em',
              cursor: 'pointer',
              textDecoration: 'none',
              pointerEvents: 'auto', // Ensure this is set
            }}
          >
            <motion.div 
              style={{ 
                fontSize: 'clamp(8px, 1.2vw, 12px)', 
                opacity: 0.6, 
                color: 'white', 
                fontFamily: 'Exo',
                whiteSpace: 'nowrap',
              }}
              whileHover={{ opacity: 1 }}
            >
              Made by Glitch NFT Studio
            </motion.div>
          </a>
        </motion.div>
      </Tooltip>

      {/* X/Twitter Icon */}
      <Tooltip title="Glitch Candies on X" arrow placement="top">
        <AnimatedIcon
          whileTap={{ scale: 0.9 }}
          style={{ 
            position: 'absolute', 
            bottom: '1vw', 
            left: '2vw', 
            zIndex: 2002, 
            opacity: 1,
            cursor: 'pointer',
            pointerEvents: 'auto', // Ensure this is set
          }}
        >
          <a 
            href="https://x.com/glitchcandies" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              pointerEvents: 'auto', // Ensure this is set
            }}
          >
            <img 
              src={cyberpunkIcon}
              alt="Glitch Candies X"
              style={{
                width: 'clamp(24px, 4vw, 56px)',
                height: 'clamp(24px, 4vw, 56px)',
                opacity: 0.75,
                cursor: 'pointer',
              }}
            />
          </a>
        </AnimatedIcon>
      </Tooltip>

      <div style={{
        position: 'absolute',
        bottom: '2vw',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1002,
        pointerEvents: 'auto',
      }}>
       
       {/* <RetroGraphiteMUIAudioPlayer
        // ref={audioPlayerRef}
        width="clamp(125px, 13vw, 190px)"
        position={{ top: 'calc(1vw + clamp(10px, 1.5vw, 80px))', left: '2vw' }}
        // isVisible={!showInfoPanel}
        // isStarted={isStarted}
      /> */}


      </div>
    </div>
  );
}
