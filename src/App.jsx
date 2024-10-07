import React, { useState, useEffect, useMemo, Suspense, useRef, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sparkles, MeshReflectorMaterial, BakeShadows, Html, useProgress } from '@react-three/drei'
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing'
import { easing } from 'maath'
import { Instances, Computers } from './Computers'
import OG from './Creature'
import { Tripo, Moog, Speeder, VCS3 } from './Models.jsx'
import TextLore from './TextLore.jsx'
import RetroGraphiteMUIAudioPlayer from './AudioPlayer'
import { Tooltip } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import FullscreenButton from './FullscreenButton'
import InfoPanel from './InfoPanel.jsx'
import './styles.css'; 

// Import icons and logos
import cyberpunkIcon from '/src/assets/icons/cyberpunk.png?url'
import droneIcon from '/src/assets/icons/drone.png?url'
import gnsLogo from '/src/assets/images/GNScubelogo.png?url'
import astroIcon from '/src/assets/icons/astrophysics.png?url' // Import the astro icon

// Import font
import ExoSemiBold from '/src/assets/fonts/Exo-SemiBold.ttf?url'

const styles = {
  fontFamily: 'ExoSemiBold, sans-serif',
  // other styles...
};


const CameraRig = () => {
  useFrame((state, delta) => {
    easing.damp3(state.camera.position, [-1 + (state.pointer.x * state.viewport.width) / 3, (1 + state.pointer.y) / 2, 5.5], 0.5, delta)
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

const AnimatedIcon = motion.div

function LoadingScreen() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
        background: 'black',
        color: 'white',
        fontFamily: 'Exobold, sans-serif',
        fontSize: '36px',
        opacity: 0.75
      }}>
        <div style={{ marginBottom: '20px' }}>LOADING...</div>
        <div style={{ 
          width: '200px', 
          height: '20px', 
          background: '#111',
          border: '2px solid #00000',
          borderRadius: '10px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: 'white',
            transition: 'width 0.3s ease-out'
          }} />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'black',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            {progress.toFixed(0)}%
          </div>
        </div>
      </div>
    </Html>
  )
}

export default function App() {
  const [showTextLore, setShowTextLore] = useState(true)
  const [isInfoVisible, setIsInfoVisible] = useState(false)
  const [textIndex, setTextIndex] = useState(0)
  const infoRef = useRef(null)
  const infoButtonRef = useRef(null)
  const audioPlayerRef = useRef(null)

  const textLoreContent = useMemo(() => [
    "Welcome to Glitch Candies: Creatures",
    "We are stuck between galaxies...",
    "Magic worlds are assembling...",
    "Creatures morph and glitch into new forms...",
    "Tech and spells are generating...",
    "Epic bosses are spawning...",
    "Clues are scattered across...",
    "Intergalactic travel will continue soon...",
    "The journey is starting soon...",

  ], []);

  const handleGlobalClick = useCallback((event) => {
    // Close InfoPanel if it's open and the click is outside the panel and info button
    if (isInfoVisible && 
        !infoRef.current?.contains(event.target) && 
        !infoButtonRef.current?.contains(event.target)) {
      setIsInfoVisible(false);
      return;
    }

    // Prevent advancing text lore if clicking on interactive elements
    if (
      event.target.closest('.MuiSlider-root') || 
      event.target.closest('.MuiIconButton-root') ||
      event.target.closest('.MuiButtonBase-root') || // Ensure all MUI buttons are excluded
      event.target.closest('button') || 
      event.target.closest('a') ||
      event.target.tagName === 'INPUT' ||
      event.target.closest('.info-panel') ||
      event.target.closest('.audio-player') // Add this line to exclude audio player clicks
    ) {
      return;
    }

    // Advance text lore
    setTextIndex((prevIndex) => (prevIndex + 1) % textLoreContent.length);
  }, [isInfoVisible, textLoreContent]);

  useEffect(() => {
    document.addEventListener('click', handleGlobalClick);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [handleGlobalClick]);

  const handleTextComplete = useCallback(() => {
    // This function will be called when each text animation completes
  }, []);

  
  const handleToggleInfo = (event) => {
    event.stopPropagation();
    setIsInfoVisible(!isInfoVisible);
  };

  const handleGeometryChange = () => {
    if (window.handleGeometryChange) {
      window.handleGeometryChange()
    }
    console.log("Geometry change triggered")
  }

  const iconStyle = {
    width: 'clamp(24px, 4vw, 56px)',
    height: 'clamp(24px, 4vw, 56px)',
    opacity: 0.75,
    cursor: 'pointer',
    marginRight: '0.3vw', // Add this line
  };

  const logoStyle = {
    width: 'clamp(60px, 8vw, 90px)',
    height: 'auto',
    opacity: 1,
    marginLeft: '-1vw',
    pointerEvents: 'none'
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas 
        shadows 
        dpr={[1, 1.5]} 
        camera={{ position: [-1.5, 1, 5.5], fov: 45, near: 1, far: 20 }} 
        eventSource={document.getElementById('root')} 
        eventPrefix="client"
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
      >
        <color attach="background" args={['black']} />
        <hemisphereLight intensity={0.15} groundColor="black" />
        <spotLight decay={0} position={[10, 20, 10]} angle={0.12} penumbra={1} intensity={1} castShadow shadow-mapSize={1024} />
        
        <Suspense fallback={<LoadingScreen />}>
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
            <OG scale={0.2} position={[0, 0, 0.4]} rotation={[0, -Math.PI * 0.9, 0]} />
            <pointLight distance={1.5} intensity={1} position={[-0.15, 1, 0]} color="hotpink" />
          </group>

          <Tripo 
            position={[-1.78, -0.35, 1.84]}
            scale={[1.5, 1.5, 1.5]}
            rotation={[0, 80, 0]}
          />
          <VCS3 
            position={[-1.7, 0.4, -.35]}
            scale={[1, 1, 1]}
            rotation={[0, 9, 0]}
          />
          <Speeder 
            position={[1.98, -.8, 2.5]}
            scale={[0.8, 0.8, 0.8]}
            rotation={[0, 9.2, 0]}
          />
          <Moog 
            position={[1.5,-1.2, 1]}
            scale={[0.1, 0.3, 0.1]}
            rotation={[0, 5.2, 0]}
          />
          <Sparkles 
            count={80} 
            scale={[2,2.5,2]} 
            size={1} 
            speed={0.2} 
            color="pink"
            position={[0, 0, 0.1]}
          />
          <Sparkles 
            count={50} 
            scale={[2,2.5,2]} 
            size={3} 
            speed={0.2} 
            color="pink"
            position={[-5.5, 0, 0.5]}
          />
          <Sparkles 
            count={50} 
            scale={[1,2.5,2]} 
            size={5} 
            speed={0.2} 
            color="lightblue"
            position={[4.5, 0, 1.4]}
          />        
          
          <EffectComposer disableNormalPass>
            <Bloom luminanceThreshold={0} mipmapBlur luminanceSmoothing={0.0} intensity={5} />
            <DepthOfField target={[0, 0, 13]} focalLength={0.28} bokehScale={10} height={800} />
          </EffectComposer>
          
          <CameraRig />
          <BakeShadows />
        </Suspense>

        {showTextLore && (
          <Html fullscreen style={{ pointerEvents: 'none', zIndex: 1000 }}>
           
            <Tooltip title="Glitch Candies on X" arrow placement="top">
              <AnimatedIcon
                whileTap={{ scale: 0.9 }}
                style={{ 
                  position: 'absolute', 
                  top: '3vw', 
                  left: '2vw', 
                  zIndex: 1002, 
                  pointerEvents: 'auto' // Add this
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
                    style={iconStyle}
                  />
                </a>
              </AnimatedIcon>
            </Tooltip>
           
            <Tooltip title="About" arrow placement="top">
              <AnimatedIcon
                ref={infoButtonRef}
                whileTap={{ scale: 0.9 }}
                style={{ position: 'absolute', top: 'calc(3vw + clamp(40px, 6vw, 90px))', left: '2vw', zIndex: 1002, pointerEvents: 'auto' }}
                onClick={handleToggleInfo}
              >
                <img 
                  src={droneIcon}
                  alt="Toggle Info"
                  style={iconStyle}
                />
              </AnimatedIcon>
            </Tooltip>

            <Tooltip title="Glitch NFT Studio Site" arrow placement="right">
              <AnimatedIcon
                whileTap={{ scale: 0.9 }}
                style={{ position: 'absolute', bottom: '2vw', left: '2vw', zIndex: 2000, pointerEvents: 'auto' }}
              >
                <a 
                  href="https://glitchnftstudio.xyz" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <img 
                    src={gnsLogo}
                    alt="GNS"
                    style={logoStyle}
                  />
                  <div style={{ 
                    marginLeft: '0vw', 
                    fontSize: 'clamp(8px, 1.2vw, 13px)', 
                    opacity: '0.75', 
                    color: 'white', 
                    fontFamily: 'ExoSemiBold, sans-serif' 
                  }}>
                    Glitch NFT<br />Studio
                  </div>
                </a>
              </AnimatedIcon>
            </Tooltip>

            <Tooltip title="Push that Button!" arrow placement="left">
              <AnimatedIcon
                whileTap={{ scale: 0.9 }}
                style={{ position: 'absolute', top: '3vw', right: '1.2vw', zIndex: 1002, pointerEvents: 'auto' }}
              >
                <button
                  onClick={handleGeometryChange}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'white',
                    fontSize: 'clamp(8px, 1.2vw, 12px)',
                    opacity: '0.9',
                    fontFamily: 'ExoSemiBold, sans-serif'
                  }}
                >
                  <img 
                    src={astroIcon} 
                    alt="Push that Button!" 
                    style={iconStyle}
                  />
                  <div>
                    GlitchCandies:<br />
                    Creatures
                  </div>
                </button>
              </AnimatedIcon>
            </Tooltip>
          </Html>
        )}
      </Canvas>

      <RetroGraphiteMUIAudioPlayer
        width="clamp(110px, 11vw, 130px)"
        position={{ bottom: 'calc(2vw + clamp(60px, 8vw, 90px))', left: '2vw' }}
        isVisible={!isInfoVisible}
      />

        <FullscreenButton style={{ pointerEvents: 'auto', zIndex: 2010 }} />


        <TextLore 
        texts={textLoreContent} 
        currentIndex={textIndex} 
        customFont={ExoSemiBold}
        onTextComplete={handleTextComplete}
        style={{ 
                pointerEvents: 'auto',
                zIndex: 900,
                bottom: '3vw', // Adjust this value to move it lower
              }}
            />


      <InfoPanel 
        isInfoVisible={isInfoVisible} 
        onClose={() => setIsInfoVisible(false)}
        ref={infoRef}
      />
    </div>
  )
}