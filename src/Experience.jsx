import React, { useState, useEffect, useMemo, Suspense, useRef, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles, MeshReflectorMaterial, BakeShadows, Html, useProgress } from '@react-three/drei';
import { Glitch, EffectComposer, Bloom, ChromaticAberration, DepthOfField } from '@react-three/postprocessing'
import { GlitchMode } from 'postprocessing' 
import { BlendFunction } from 'postprocessing'
import { easing } from 'maath';
import { motion } from 'framer-motion';
import { Instances, Computers } from './Computers';
import OG from './Creature';
import { Palm, Gamepad, Dragon, Tripo, Moog, Speeder, VCS3, Pyramid } from './Models';
import HologramOG from './HologramOG'

import useStore from './stores/zustandStore';
import Orb from './Orb';
import { BannerPlane } from './BannerPlane';
import AudioPlayer from './Audio/AudioPlayer';
import useAudioStore from './Audio/audioStore';
import './styles.css';
import { Science } from '@mui/icons-material';



const CameraRig = () => {
  useFrame((state, delta) => {
    easing.damp3(
      state.camera.position, 
      [-1 + (state.pointer.x * state.viewport.width) / 3, (1 + state.pointer.y) / 2, 5.5], 
      0.5, 
      delta
    );
    state.camera.lookAt(0, 0, 0);
  });
  return null;
};

function Experience({ audioPlayerRef }) {
    const shouldShowEffects = useStore(state => state.shouldShowEffects);
    
    return (
      <>
        <CameraRig />
        <color attach="background" args={['black']} />
        <hemisphereLight intensity={0.15} groundColor="black" />
        <spotLight
          decay={0}
          position={[10, 20, 10]}
          angle={0.12}
          penumbra={1}
          intensity={1}
          castShadow
          shadow-mapSize={1024}
        />
        
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
  
          {/* Models */}
          <Tripo position={[-1.98, -0.35, 1.99]} scale={[1.5, 1.5, 1.5]} rotation={[0, 80, 0]} />
          <Palm position={[-2.4, -1.35, 1.3]} scale={[0.2, 0.2, 0.2]} rotation={[0, 0, 0]} />
          <Pyramid position={[-2.1, -1.25, 0.5]} scale={[0.04, 0.04, 0.04]} rotation={[0, 2.6, 0]} />
          <VCS3 position={[-1.7, 0.4, -.35]} scale={[1, 1, 1]} rotation={[0, 9, 0]} />
          <Gamepad position={[-0.5, -1, 0.1]} scale={[0.2, 0.2, 0.2]} rotation={[0, 0.8, 0]} />
          <Dragon position={[1.1, 0.4, -1.4]} scale={[1.7, 1.7, 1.7]} rotation={[0, 10.2, 0]} />
          <Speeder position={[1.98, -.8, 2.5]} scale={[0.8, 0.8, 0.8]} rotation={[0, 9.2, 0]} />
          <Moog position={[1.5, -1.2, 1]} scale={[0.1, 0.3, 0.1]} rotation={[0, 5.2, 0]} />
  
          {/* Sparkles */}
          <Sparkles 
            count={80} 
            scale={[2, 2.5, 2]} 
            size={1} 
            speed={0.2} 
            color="pink" 
            position={[0, 0, 0.1]} 
            opacity={0.75} 
          />
          <Sparkles 
            count={50} 
            scale={[2, 2.5, 2]} 
            size={3} 
            speed={0.2} 
            color="pink" 
            position={[-5.5, 0, 0.5]} 
          />
          <Sparkles 
            count={50} 
            scale={[1, 2.5, 2]} 
            size={5} 
            speed={0.2} 
            color="lightblue" 
            position={[4.5, 0, 1.4]} 
          />
  
          {/* Orbs */}
          <Orb 
            position={[1.6, -0.6, -.2]} 
            scale={[0.2, 0.2, 0.2]}
            colorA="#fe00fe"
            colorB="#0080ff"
            timeOffset={2}
            yRange={{ min: -0.2, max: 0.1 }}
          />
          <Orb 
            position={[0.9, -0.6, -.95]} 
            scale={[0.08, 0.08, 0.08]}
            colorA="#ff1493"
            colorB="#4169e1"
            timeOffset={4.2}
            yRange={{ min: -0.4, max: -0.2 }}
          />
          <Orb 
            position={[-2.1, -0.6, 0.6]} 
            scale={[0.07, 0.07, 0.07]}
            colorA="#fc0398"
            colorB="#fc0398"
            timeOffset={.1}
            yRange={{ min: 0.12, max: 0.28 }}
          />
  
    

          Audio player HTML
          <Html
            transform
            position={[1.95, 1.3, 1.2]}
            rotation={[0, Math.PI / 25, 0]}
            scale={0.14}
            style={{
              width: '50%',
              height: '50%',
              pointerEvents: 'auto'
            }}
          >
            <div style={{ 
              transformStyle: "preserve-3d",
              perspective: 1000
            }}>
              <AudioPlayer
                ref={audioPlayerRef}
                width="15rem"
                position={{ top: "0px", left: "0px" }}
              />
            </div>
          </Html>
  
          <BannerPlane sampling={4} position={[-1, 2.2, -3]} rotation={[0.2, 0, 0]} />
          
          {/* Only show effects on non-Android devices */}
          {shouldShowEffects && (
            <EffectComposer disableNormalPass multisampling={16}>
              <Bloom luminanceThreshold={0.25} mipmapBlur luminanceSmoothing={0.2} intensity={5} />
              <DepthOfField target={[0, 0, 13]} focalLength={0.28} bokehScale={10} height={800} />
            </EffectComposer>
          )}
          <BakeShadows />
        </Suspense>
      </>
    )
  }
  
  export default Experience;
