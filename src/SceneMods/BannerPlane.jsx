import React, { useRef, useMemo, useEffect } from 'react'
import { useTexture, useProgress } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import defaultBanner from '/src/assets/images/Logobaner.png'
import { useActionStore } from '../stores/actionStore'
import { BANNER_ACTION_MAP, BANNER_IMAGES } from './BannerActions'
import { ActionTypes } from './types'

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vViewPosition;
  void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vViewPosition = -mvPosition.xyz;
  }
`

const fragmentShader = `
  uniform sampler2D bannerTexture;
  uniform float time;
  uniform vec2 resolution;
  uniform float heightScale;
  varying vec2 vUv;
  varying vec3 vViewPosition;

  float smoothEdge(float v) {
    return smoothstep(0.0, 1.0 / resolution.x, v) * smoothstep(0.0, 1.0 / resolution.y, v);
  }

  vec2 parallaxMapping(vec2 uv, vec3 viewDir) {
    float height = texture2D(bannerTexture, uv).r;
    vec2 p = viewDir.xy / viewDir.z * (height * heightScale);
    return uv - p;
  }

  void main() {
    vec3 viewDir = normalize(vViewPosition);
    vec2 uv = parallaxMapping(vUv, viewDir);
    
    if(uv.x > 1.0 || uv.y > 1.0 || uv.x < 0.0 || uv.y < 0.0) discard;
    
    vec4 bannerColor = texture2D(bannerTexture, uv);
    
    vec2 center = uv - 0.5;
    float dist = length(center);
    float pattern = sin(dist * 50.0 - time * 1.0) * 0.15 + 0.55;
    
    float fadeX = smoothstep(0.0, 0.1, uv.x) * smoothstep(1.0, 0.9, uv.x);
    float fadeY = smoothstep(0.0, 0.1, uv.y) * smoothstep(1.0, 0.9, uv.y);
    float fade = fadeX * fadeY;
    
    vec4 finalColor = bannerColor;
    finalColor.rgb *= pattern;
    finalColor.rgb = pow(finalColor.rgb, vec3(0.85));
    
    // Add black overlay with 0.2 opacity
    finalColor.rgb = mix(finalColor.rgb, vec3(0.0), 0.15);
    
    finalColor.a *= fade;
    float edgeAlpha = smoothEdge(finalColor.a);
    finalColor.a *= edgeAlpha;

    gl_FragColor = finalColor;
  }
`

// Preload all banner images
const allTexturePaths = Object.values(BANNER_IMAGES);

export function BannerPlane({ onClick, position = [0, 0, 0], rotation = [.2, 0, 0] }) {
  const meshRef = useRef()
  const { currentAction } = useActionStore()
  const { size } = useThree()

  // Preload all textures
  const textures = useTexture(allTexturePaths);
  const textureMap = useMemo(() => {
    return Object.keys(BANNER_IMAGES).reduce((acc, key, index) => {
      acc[key] = textures[index];
      return acc;
    }, {});
  }, [textures]);

  // Get current texture
  const currentTexture = useMemo(() => {
    if (!currentAction || !currentAction.id) return textureMap.START;
    return textureMap[currentAction.id] || textureMap.START;
  }, [currentAction, textureMap]);

  // Create uniforms with current texture
  const uniforms = useMemo(() => ({
    bannerTexture: { value: currentTexture },
    time: { value: 0 },
    resolution: { value: new THREE.Vector2(size.width, size.height) },
    heightScale: { value: 0.03 }
  }), [currentTexture, size])

  // Update texture when it changes
  useEffect(() => {
    if (meshRef.current && currentTexture) {
      meshRef.current.material.uniforms.bannerTexture.value = currentTexture;
    }
  }, [currentTexture]);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
    })
  }, [uniforms])

  const scale = useMemo(() => {
    const baseScale = Math.min(size.width, size.height) * 0.0009
    return [baseScale * 3, baseScale, 1]
  }, [size])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.time.value = state.clock.getElapsedTime()
    }
  })

  return (
    <mesh 
      ref={meshRef} 
      onClick={onClick} 
      position={position} 
      rotation={rotation}
      scale={scale}
    >
      <planeGeometry args={[1, 1.01]} />
      <primitive object={shaderMaterial} attach="material" />
    </mesh>
  )
}
