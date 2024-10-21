import React, { useEffect, useCallback, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { Tooltip } from '@mui/material'
import FullscreenButton from './FullscreenButton'
import InfoPanel from './InfoPanel'
import RetroGraphiteMUIAudioPlayer from '../AudioPlayer'
import PushButton from '../components/PushButton'
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas'
import HealthBarTriangles from './HealthBarTriangles'

const AnimatedIcon = motion.div
import cyberpunkIcon from '/src/assets/icons/X31.png?url'
// import AboutGame from '/src/assets/images/AboutGame.svg?url'

import ExoSemiBold from '/src/assets/fonts/Exo-SemiBold.ttf?url'
import Micro from '/src/assets/fonts/Microgramma_D_Extended_Bold.otf?url'
import MinRound from '/src/assets/fonts/MinRoundRegular.otf?url'

export default function UIOverlay() {
  const controls = useAnimation();
  const [isKeyPressed, setIsKeyPressed] = useState(false);

  const handleGeometryChange = useCallback(() => {
    // Your geometry change logic here
    console.log('Geometry change triggered');
    // Add your actual geometry change logic here
  }, []);

  const { RiveComponent, rive } = useRive({
    src: '/buttons.riv',
    artboard: 'Push',
    animations: ['Menu rotation', 'Menu text rotation', 'Push the button'],
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

  const handleKeyDown = useCallback((event) => {
    if (event.key === '0' && !isKeyPressed) {
      setIsKeyPressed(true);
      controls.set({ scale: 0.95 });
      handleGeometryChange();
    }
  }, [handleGeometryChange, isKeyPressed, controls]);

  const handleKeyUp = useCallback((event) => {
    if (event.key === '0') {
      setIsKeyPressed(false);
      controls.set({ scale: 1 });
    }
  }, [controls]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const handleHealthBarClick = useCallback(() => {
    console.log('Health Bar clicked');
    // Add any specific logic for when the health bar is clicked
  }, []);

  return (
    <>
      <FullscreenButton style={{ pointerEvents: 'auto', zIndex: 2010 }} />

      {/* <RetroGraphiteMUIAudioPlayer /> */}
      {/* Add other UI components here */}
   

// panel 

        <HealthBarTriangles
          style={{
            top: '2vw',
            left: '2vw',
            width: '200px',
            height: '50px',
          }}
        />

        <motion.div
          style={{
            position: 'absolute',
            top: '2vw',
            right: '2vw',
            zIndex: 1002,
            width: '100px',
            height: '100px',
            cursor: 'pointer',
          }}
          animate={controls}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGeometryChange}
        >
          <RiveComponent />
        </motion.div>

    {/* Add HealthBarTriangles here */}
    <HealthBarTriangles
        style={{
          top: '2vw',
          right: '20vw',
          width: '200px',  // Adjust size as needed
          height: '50px',  // Adjust size as needed
        }}
      />


// Made by GNS 

        <Tooltip title="Visit our website" arrow placement="left">
        <motion.div
          style={{
            position: 'absolute',
            bottom: '1.2vw',
            right: '11vw',
            zIndex: 900,
            pointerEvents: 'auto',
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

   Candies on X 

  <Tooltip title="Glitch Candies on X" arrow placement="top">
        <AnimatedIcon
          whileTap={{ scale: 0.9 }}
          style={{ 
            position: 'absolute', 
            bottom: '1vw', 
            left: '2vw', 
            zIndex: 1002, 
            opacity: 1,
            pointerEvents: 'auto'
          }}
        >
          <a 
            href="https://x.com/glitchcandies" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <img 
              src={cyberpunkIcon}
              alt="Glitch Candies X"
              style={{
                width: 'clamp(24px, 4vw, 56px)',
                height: 'clamp(24px, 4vw, 56px)',
                opacity: 0.75,
                cursor: 'pointer',
                marginRight: '0.3vw',
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
      }}>

{/* // Audio Player  */}

    {/* <RetroGraphiteMUIAudioPlayer
        // ref={audioPlayerRef}
        width="clamp(125px, 13vw, 190px)"
        position={{ top: 'calc(1vw + clamp(10px, 1.5vw, 80px))', left: '2vw' }}
        isVisible={!showInfoPanel}
        isStarted={isStarted}
      /> */}


    </div> 
   




    </>
  )
}
