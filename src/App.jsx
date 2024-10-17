import React, { useState, useEffect, useMemo, Suspense, useRef, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sparkles, MeshReflectorMaterial, BakeShadows, Html, useProgress } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, DepthOfField } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Glitch } from '@react-three/postprocessing'
import { GlitchMode } from 'postprocessing'
import { easing } from 'maath'
import { Instances, Computers } from './Computers'
import OG from './Creature'
import HologramOG from './HologramOG'
import { Dragon, Tripo, Moog, Speeder, VCS3 } from './Models.jsx'
// import TextLore from './TextLore.jsx'
import RetroGraphiteMUIAudioPlayer from './AudioPlayer'
import { Tooltip } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import FullscreenButton from './FullscreenButton'
import InfoPanel from './InfoPanel.jsx'
// import { Loader } from '@react-three/drei'
// import { BannerPlane } from './BannerPlane'
// import LoadingScreen from './LoadingScreen'
// import StartButton from './StartButton'
import RiveLoadingScreen from './RiveLoadingScreen'

import './styles.css'

import cyberpunkIcon from '/src/assets/icons/X31.png?url'
// import AboutGame from '/src/assets/images/AboutGame.svg?url'

import ExoSemiBold from '/src/assets/fonts/Exo-SemiBold.ttf?url'
import Micro from '/src/assets/fonts/Microgramma_D_Extended_Bold.otf?url'
import MinRound from '/src/assets/fonts/MinRoundRegular.otf?url'

const CameraRig = () => {
  useFrame((state, delta) => {
    easing.damp3(state.camera.position, [-1 + (state.pointer.x * state.viewport.width) / 3, (1 + state.pointer.y) / 2, 5.5], 0.5, delta)
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

const AnimatedIcon = motion.div

function Scene() {
  return (
    <>
      <color attach="background" args={['black']} />
      <hemisphereLight intensity={0.15} groundColor="black" />
      <spotLight decay={0} position={[10, 20, 10]} angle={0.12} penumbra={1} intensity={1} castShadow shadow-mapSize={1024} />
      
      <Suspense fallback={null}>
        <group position={[-0, -1, 0]}>
          <Instances>
            <Computers scale={0.5} />
          </Instances>
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[50, 50]} />
            <MeshReflectorMaterial
              blur={[300, 30]}
              resolution={2048}
              mixBlur={1}
              mixStrength={180}
              roughness={1}
              depthScale={1.2}
              minDepthThreshold={0.4}
              maxDepthThreshold={1.4}
              color="#202020"
              metalness={0.8}
            />
          </mesh>
          <OG scale={0.2} position={[0, 0, 0.8]} rotation={[0, -Math.PI * 0.9, 0]} />
          <pointLight distance={1.5} intensity={1} position={[-0.15, 1, 0]} color="hotpink" />
        </group>
        <Tripo position={[-1.78, -0.35, 1.84]} scale={[1.5, 1.5, 1.5]} rotation={[0, 80, 0]} />
        <VCS3 position={[-1.7, 0.4, -.35]} scale={[1, 1, 1]} rotation={[0, 9, 0]} />
        <Dragon position={[1.1, 0.4, -1.4]} scale={[1.7, 1.7, 1.7]} rotation={[0, 10.2, 0]} />
        <Speeder position={[1.98, -.8, 2.5]} scale={[0.8, 0.8, 0.8]} rotation={[0, 9.2, 0]} />
        <Moog position={[1.5,-1.2, 1]} scale={[0.1, 0.3, 0.1]} rotation={[0, 5.2, 0]} />
        <Sparkles count={80} scale={[2,2.5,2]} size={1} speed={0.2} color="pink" position={[0, 0, 0.1]} opacity={0.75} />
        <Sparkles count={50} scale={[2,2.5,2]} size={3} speed={0.2} color="pink" position={[-5.5, 0, 0.5]} />
        <Sparkles count={50} scale={[1,2.5,2]} size={5} speed={0.2} color="lightblue" position={[4.5, 0, 1.4]} />        
        
        <EffectComposer disableNormalPass multisampling={16}>
          <Bloom luminanceThreshold={0.25} mipmapBlur luminanceSmoothing={0.2} intensity={5} />
          <DepthOfField target={[0, 0, 13]} focalLength={0.28} bokehScale={10} height={800} />
        </EffectComposer>
        
        <CameraRig />
        <BakeShadows />

        {/* <BannerPlane position={[-1, 2.2, -3]} rotation={[0.2, 0, 0]} /> */}
      </Suspense>
    </>
  )
}

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isStarted, setIsStarted] = useState(false)
  // const [showInfoPanel, setShowInfoPanel] = useState(false)
  // const [isInfoVisible, setIsInfoVisible] = useState(false)
  // const [textIndex, setTextIndex] = useState(0)
  const infoRef = useRef(null)
  const infoButtonRef = useRef(null)
  // const audioPlayerRef = useRef(null)
  const { progress } = useProgress()
  // const [showTextLore, setShowTextLore] = useState(true)
  // const [audioInitialized, setAudioInitialized] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);


  // useEffect(() => {
  //   console.log('audioPlayerRef:', audioPlayerRef);
  // }, []);

  // const textLoreContent = useMemo(() => [
  //   "Welcome to Glitch Candies: Creatures",
  //   "We are stuck between galaxies...",
  //   "Magic worlds are assembling...",
  //   "Creatures morph and glitch into new forms...",
  //   "Tech and spells are generating...",
  //   "Epic bosses are spawning...",
  //   "Clues are scattered across...",
  //   "Intergalactic travel will continue soon...",
  //   "The journey is starting soon...",
  // ], []);
  // const handleGlobalClick = useCallback((event) => {
  //   // Don't process global clicks if the scene hasn't started yet
  //   if (!isStarted) return;

  //   // Close InfoPanel if it's open and the click is outside the panel and info button
  //   if (isInfoVisible && 
  //       !infoRef.current?.contains(event.target) && 
  //       !infoButtonRef.current?.contains(event.target)) {
  //     setIsInfoVisible(false);
  //     return;
  //   }
  //   // Prevent advancing text lore if clicking on interactive elements
  //   if (
  //     event.target.closest('.MuiSlider-root') || 
  //     event.target.closest('.MuiIconButton-root') ||
  //     event.target.closest('.MuiButtonBase-root') || 
  //     event.target.closest('button') || 
  //     event.target.closest('a') ||
  //     event.target.tagName === 'INPUT' ||
  //     event.target.closest('.info-panel') ||
  //     event.target.closest('.audio-player')
  //   ) {
  //     return;
  //   }
  //   // Advance text lore
  //   setTextIndex((prevIndex) => (prevIndex + 1) % textLoreContent.length);
  // }, [isStarted, isInfoVisible, textLoreContent]);
  // useEffect(() => {
  //   document.addEventListener('click', handleGlobalClick);
  //   return () => {
  //     document.removeEventListener('click', handleGlobalClick);
  //   };
  // }, [handleGlobalClick]);
  // const handleTextComplete = useCallback(() => {
  //   // This function will be called when each text animation completes
  // }, []);


// Audio Player 




  // // Initialize audio player when the component mounts
  // useEffect(() => {
  //   const initAudioPlayer = async () => {
  //     if (audioPlayerRef.current) {
  //       try {
  //         await audioPlayerRef.current.initializeAudio();
  //         setAudioInitialized(true);
  //         console.log('Audio player initialized in App useEffect');
  //       } catch (error) {
  //         console.error('Error initializing audio:', error);
  //       }
  //     } else {
  //       console.log('audioPlayerRef.current is null in App useEffect');
  //     }
  //   };
  //   initAudioPlayer();
  // }, []);



  const handleStart = useCallback(() => {
    console.log('Start button clicked in App component');
    setIsStarted(true);
    
    // if (audioInitialized && audioPlayerRef.current) {
    //   audioPlayerRef.current.playAudio();
    // }

    // Start fading in the scene
    let fadeInterval = setInterval(() => {
      setOpacity(prevOpacity => {
        if (prevOpacity >= 1) {
          clearInterval(fadeInterval);
          return 1;
        }
        return prevOpacity + 0.1;
      });
    }, 50);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setIsLoaded(true);
    }
  }, [progress]);

  const handleGeometryChange = () => {
    if (window.handleGeometryChange) {
      window.handleGeometryChange()
    }
  }
  
  if (!isStarted) {
    return (
      <RiveLoadingScreen 
        isLoaded={isLoaded} 
        progress={progress}
        onStart={handleStart}
        // audioPlayerRef={audioPlayerRef}
      />
    )
  }


 

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      position: 'relative',
      opacity: opacity,
      transition: 'opacity 0.5s ease-in-out'
    }}>
      <Canvas 
        gl={{ antialias: true, samples: 4 }}
        shadows 
        dpr={[1, 1.5]} 
        camera={{ position: [-1.5, 1, 5.5], fov: 45, near: 1, far: 20 }} 
        eventSource={document.getElementById('root')} 
        eventPrefix="client"
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
      >
        <Scene />
      </Canvas>

      <Canvas
        style={{
          position: 'absolute',
          top: 'calc(2vw + clamp(160px, 10.5vw, 180px))',
          left: '2.3vw',
          width: 'clamp(120px, 12vw, 180px)',
          height: 'calc(10vw + clamp(120px, 9vw, 160px))',
          zIndex: 2,
          background: 'black',
          backgroundOpacity: '0.2',
          opacity: 0.75,
          outline: '1px solid #373837',
          outlineOffset: '0px',
          outlineWidth: '1px',
          outlineOpacity: '0.01'
        }}
        camera={{ position: [0, 0, 5], fov: 45 }}
        className="hologram-canvas"
      >
        <Suspense fallback={null}>
          <HologramOG scale={0.38} position={[0, -1.2, 0]} rotation={[0, -Math.PI * 0.1, 0]} />
          <ambientLight intensity={0.8} />
          <pointLight position={[1, 10, 10]} />
        </Suspense>
   
        <EffectComposer>
          <ChromaticAberration
            offset={[0.012, 0.002]}
            blendFunction={BlendFunction.NORMAL}
          />
          <Glitch
            delay={[1.5, 3.5]}
            duration={[0.6, 1.0]}
            strength={[0.3, 1.0]}
            mode={GlitchMode.SPORADIC}
            active
            ratio={0.8}
          />
        </EffectComposer>
      </Canvas>

      {/* <Loader /> */}
      
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

{/*         
        <Tooltip title="About the Game" arrow placement="top">
          <AnimatedIcon
            ref={infoButtonRef}
            whileTap={{ scale: 0.9 }}
            style={{ pointerEvents: 'auto' }}
            onClick={() => setShowInfoPanel(!showInfoPanel)}
          >
            <img 
              src={AboutGame} 
              alt="Toggle Info" 
              style={{
                opacity: 0.8,
                width: 'clamp(32px, 14vw, 180px)',
                height: 'auto',
                filter: 'invert(0)',
              }} 
            />
          </AnimatedIcon>
        </Tooltip>
*/}
      </div> 

      {/* <RetroGraphiteMUIAudioPlayer
        ref={audioPlayerRef}
        width="clamp(125px, 13vw, 190px)"
        position={{ top: 'calc(1vw + clamp(10px, 1.5vw, 80px))', left: '2vw' }}
        isVisible={!showInfoPanel}
        isStarted={isStarted}
      /> */}

      <FullscreenButton style={{ pointerEvents: 'auto', zIndex: 2010 }} />

        {/* <TextLore 
        texts={textLoreContent} 
        currentIndex={textIndex} 
        customFont={ExoSemiBold}
        onTextComplete={handleTextComplete}
        style={{ 
          pointerEvents: 'auto',
          zIndex: 900,
          bottom: 'clamp(4vh, 5vh, 8vh)',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          maxWidth: '800px',
        }}
        isStarted={isStarted}
      /> */}



      {/* <InfoPanel 
        isInfoVisible={showInfoPanel} 
        onClose={() => setShowInfoPanel(false)}
        ref={infoRef}
      /> */}

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

      <Tooltip title="Push that Button!" arrow placement="left">
        <motion.div
          style={{
            position: 'absolute',
            top: '2vw',
            right: '2vw',
            zIndex: 1002,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGeometryChange}
        >
          <div style={{
            fontFamily: 'Min, sans-serif',
            fontSize: 'clamp(24px, 2vw, 40px)',
            color: 'white',
            textShadow: '0 0 10px rgba(255,255,255,0.5)',
          }}>
            GlitchCandies
          </div>
          <div style={{
            fontFamily: 'Micro, sans-serif',
            fontSize: 'clamp(13px, 1.51vw, 1px)',
            color: '#00FFFF',
            textShadow: '0 0 10px rgba(0,255,255,0.5)',
            marginLeft: '-10px',
          }}>
            Creatures
          </div>
        </motion.div>
      </Tooltip>
    </div>
  )
}