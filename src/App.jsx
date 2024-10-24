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
import { Palm, Gamepad, Dragon, Tripo, Moog, Speeder, VCS3, Pyramid } from './Models.jsx'
import RetroGraphiteMUIAudioPlayer from './AudioPlayer'
import { Tooltip } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import UIOverlay from './UI/UIOverlay.jsx'
import { Loader } from '@react-three/drei'
import { BannerPlane } from './BannerPlane'
import RiveLoadingScreen from './RiveLoadingScreen'
import LandscapeEnforcer from './LandscapeEnforcer'
import useStore from './zustandStore'
import RiveControl from './UI/RiveControl'
import Orb from './Orb'
import EmbedFix from './EmbedFix'

import './styles.css'


const CameraRig = () => {
  useFrame((state, delta) => {
    easing.damp3(state.camera.position, [-1 + (state.pointer.x * state.viewport.width) / 3, (1 + state.pointer.y) / 2, 5.5], 0.5, delta)
    state.camera.lookAt(0, 0, 0)
  })
  return null
}


function Scene({ audioPlayerRef }) {
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
        
        {/* Add AudioPlayer to the scene */}
        <Html
          transform
          position={[1.95, 1.3, 1.2]}          
          rotation={[0, Math.PI / 25, 0]} // Set the fixed rotation around Y-axis
          scale={0.14}
          style={{
            width: '50%',
            height: '50%',
            pointerEvents: 'auto'
          }}
        >
          <div
            style={{ 
              transformStyle: "preserve-3d", // Ensure 3D transformations are preserved
              perspective: 1000, // Add perspective for 3D effect
            }}
          >
            <RetroGraphiteMUIAudioPlayer
              ref={audioPlayerRef}
              width="15rem"
              position={{ top: "0px", left: "0px" }}
            />
          </div>
        </Html>
        
        <Tripo position={[-1.98, -0.35, 1.99]} scale={[1.5, 1.5, 1.5]} rotation={[0, 80, 0]} />
        
        <Palm position={[-2.4, -1.35, 1.3]} scale={[0.2, 0.2,0.2]} rotation={[0, 0, 0]} />
        <Pyramid position={[-2.1, -1.25, 0.5]} scale={[0.04, 0.04,0.04]} rotation={[0, 2.6, 0]} />

        <VCS3 position={[-1.7, 0.4, -.35]} scale={[1, 1, 1]} rotation={[0, 9, 0]} />
        
        <Gamepad position={[-0.5, -1, 0.1]} scale={[0.2, 0.2, 0.2]} rotation={[0, 0.8, 0]} />

        <Dragon position={[1.1, 0.4, -1.4]} scale={[1.7, 1.7, 1.7]} rotation={[0, 10.2, 0]} />
        <Speeder position={[1.98, -.8, 2.5]} scale={[0.8, 0.8, 0.8]} rotation={[0, 9.2, 0]} />
        <Moog position={[1.5,-1.2, 1]} scale={[0.1, 0.3, 0.1]} rotation={[0, 5.2, 0]} />
        <Sparkles count={80} scale={[2,2.5,2]} size={1} speed={0.2} color="pink" position={[0, 0, 0.1]} opacity={0.75} />
        <Sparkles count={50} scale={[2,2.5,2]} size={3} speed={0.2} color="pink" position={[-5.5, 0, 0.5]} />
        <Sparkles count={50} scale={[1,2.5,2]} size={5} speed={0.2} color="lightblue" position={[4.5, 0, 1.4]} />        
        

        <Orb 
        position={[1.6, -0.6, -.2]} 
        scale={[0.2, 0.2, 0.2]}
        colorA="#fe00fe"
        colorB="#0080ff"
        timeOffset={2}
        yRange={{ min: -0.2, max: 0.1 }}
        />

        {/* Second orb */}
        {/* <Orb 
          position={[2.1, -0.4, -.4]} 
          scale={[0.1, 0.1, 0.1]}
          colorA="#fc0398"
          colorB="#03d7fc"
          timeOffset={1.5}  // Offset animation phase
          yRange={{ min: 0.15, max: 0.35 }}  // Different range
        /> */}

        <Orb 
          position={[0.9, -0.6, -.95]} 
          scale={[0.08, 0.08, 0.08]}
          colorA="#ff1493"
          colorB="#4169e1"
          timeOffset={4.2}  // Different offset
          yRange={{ min: -0.4, max: -0.2 }}  // Different range
        />

        <Orb 
          position={[-2.1, -0.6, 0.6]} 
          scale={[0.07, 0.07, 0.07]}
          colorA="#fc0398"
          colorB="#fc0398"
          timeOffset={.1}  // Different offset
          yRange={{ min: 0.12, max: 0.28 }}  // Different range
        />

        <EffectComposer disableNormalPass multisampling={16}>
          <Bloom luminanceThreshold={0.25} mipmapBlur luminanceSmoothing={0.2} intensity={5} />
          <DepthOfField target={[0, 0, 13]} focalLength={0.28} bokehScale={10} height={800} />
        </EffectComposer>
        
        <CameraRig />
        <BakeShadows />

        <BannerPlane sampling={4} position={[-1, 2.2, -3]} rotation={[0.2, 0, 0]} />
      </Suspense>
    </>
  )
}

export default function App() {
  const audioPlayerRef = useRef(null)
  const { progress } = useProgress()
  const [isRotated, setIsRotated] = useState(false)
  
  const isLoaded = useStore(state => state.isLoaded)
  const isStarted = useStore(state => state.isStarted)
  const setIsLoaded = useStore(state => state.setIsLoaded)
  const setIsStarted = useStore(state => state.setIsStarted)
  const setProgress = useStore(state => state.setProgress)
  const opacity = useStore(state => state.opacity)
  const incrementOpacity = useStore(state => state.incrementOpacity)
  const audioInitialized = useStore(state => state.audioInitialized)
  const setAudioInitialized = useStore(state => state.setAudioInitialized)

  useEffect(() => {
    setProgress(progress)
    if (progress === 100) {
      setIsLoaded(true)
    }
  }, [progress, setProgress, setIsLoaded])

  useEffect(() => {
    console.log('audioPlayerRef:', audioPlayerRef);
  }, []);

  // Initialize audio player when the component mounts
  useEffect(() => {
    const initAudioPlayer = async () => {
      if (audioPlayerRef.current) {
        try {
          await audioPlayerRef.current.initializeAudio();
          setAudioInitialized(true);
          console.log('Audio player initialized in App useEffect');
        } catch (error) {
          console.error('Error initializing audio:', error);
        }
      } else {
        console.log('audioPlayerRef.current is null in App useEffect');
      }
    };
    initAudioPlayer();
  }, [audioPlayerRef.current, setAudioInitialized]);

  const [showMainContent, setShowMainContent] = useState(false);

  const handleStart = useCallback(() => {
    console.log('Start button clicked in App component');
    setIsStarted(true);
    
    // Remove audio initialization from here since we'll handle it in the main scene
    setShowMainContent(true);
    const fadeInterval = setInterval(() => {
      incrementOpacity();
      if (opacity >= 1) {
        clearInterval(fadeInterval);
      }
    }, 50);
  }, [incrementOpacity, opacity, setIsStarted]);

  const handlePanelClick = () => {
    setIsRotated(true)
    setTimeout(() => setIsRotated(false), 3000) // Revert back after 3 seconds
  }

  return (
    <LandscapeEnforcer>
      <RiveLoadingScreen 
        onStart={handleStart}
      />
      <RiveControl />
      {showMainContent && (
        <div style={{ 
          width: '100vw', 
          height: '100vh', 
          position: 'absolute',
          top: 0,
          left: 0,
          opacity: opacity,
          transition: 'opacity 0.5s ease-in-out',
          zIndex: 1000,
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
            <Scene 
              audioPlayerRef={audioPlayerRef} 
            />
          </Canvas>

          <Canvas
            style={{
              position: 'absolute',
              top: 'calc(0.1vw + clamp(100px, 8.5vw, 120px))',
              left: '2.3vw',
              width: 'clamp(120px, 12vw, 180px)',
              height: 'calc(6vw + clamp(120px, 9vw, 160px))',
              zIndex: 1,
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
        
            <UIOverlay />    
            <EmbedFix />
        </div>
      )}
    </LandscapeEnforcer>
  )
}
