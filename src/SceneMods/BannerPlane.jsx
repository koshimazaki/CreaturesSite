import React, { useRef, useMemo, useEffect, useCallback } from 'react'
import { useTexture } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useActionStore } from '../stores/actionStore'
import { BANNER_IMAGES } from './BannerActions'

// Optimized shaders with precision qualifiers
const vertexShader = `
  precision highp float;
  varying vec2 vUv;
  varying vec3 vViewPosition;
  varying float vDepth;
  
  void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vViewPosition = -mvPosition.xyz;
    // Calculate depth for transition effect
    vDepth = -(modelViewMatrix * vec4(position, 1.0)).z;
  }
`

const fragmentShader = `
  precision highp float;
  uniform sampler2D bannerTexture;
  uniform sampler2D prevTexture;
  uniform float time;
  uniform float transition;
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
    
    // Sample both textures
    vec4 currentColor = texture2D(bannerTexture, uv);
    vec4 previousColor = texture2D(prevTexture, uv);
    
    // Simple crossfade between textures
    vec4 baseColor = mix(previousColor, currentColor, transition);
    
    vec2 center = uv - 0.5;
    float dist = length(center);
    float pattern = sin(dist * 50.0 - time * 1.0) * 0.15 + 0.55;
    
    // Apply all effects to the mixed color
    vec4 finalColor = baseColor;
    finalColor.rgb *= pattern;
    finalColor.rgb = pow(finalColor.rgb, vec3(0.85));
    
    // Add black overlay with 0.15 opacity
    finalColor.rgb = mix(finalColor.rgb, vec3(0.0), 0.15);
    
    float fadeX = smoothstep(0.0, 0.1, uv.x) * smoothstep(1.0, 0.9, uv.x);
    float fadeY = smoothstep(0.0, 0.1, uv.y) * smoothstep(1.0, 0.9, uv.y);
    float fade = fadeX * fadeY;
    
    finalColor.a *= fade;
    float edgeAlpha = smoothEdge(finalColor.a);
    finalColor.a *= edgeAlpha;

    gl_FragColor = finalColor;
  }
`

// Texture optimization utility
const optimizeTexture = (texture) => {
  texture.minFilter = THREE.LinearFilter
  texture.generateMipmaps = false
  texture.needsUpdate = true
  return texture
}

export function BannerPlane({ onClick, position = [0, 0, 0], rotation = [.2, 0, 0] }) {
  const meshRef = useRef()
  const prevTextureRef = useRef()
  const transitionRef = useRef(0)
  const textureMapRef = useRef({})
  const { currentAction, isTransitioning } = useActionStore()
  
  // Preload all textures and store them
  const textures = useTexture(Object.values(BANNER_IMAGES))
  
  // Increase the base scale for a larger banner
  const scale = useMemo(() => {
    const baseScale = 768 * 0.0013 // Doubled from 0.0009
    return [baseScale * 3, baseScale, 1]
  }, [])

  // Optimize textures function
  const optimizeTexture = (texture) => {
    texture.minFilter = THREE.LinearFilter
    texture.generateMipmaps = false
    texture.needsUpdate = true
    return texture
  }

  // Update texture map creation with proper optimization
  useEffect(() => {
    textureMapRef.current = Object.keys(BANNER_IMAGES).reduce((acc, key, index) => {
      const texture = textures[index]
      acc[key] = optimizeTexture(texture)
      return acc
    }, {})
    
    if (meshRef.current && currentAction?.id) {
      const material = meshRef.current.material
      material.uniforms.bannerTexture.value = textureMapRef.current[currentAction.id]
      material.uniforms.prevTexture.value = textureMapRef.current[currentAction.id]
    }
  }, [textures])

  // Create uniforms
  const uniforms = useMemo(() => ({
    bannerTexture: { value: null },
    prevTexture: { value: null },
    time: { value: 0 },
    transition: { value: 0 },
    resolution: { value: new THREE.Vector2(768, 432) },
    heightScale: { value: 0.05 }
  }), []) // Remove size dependency

  // Handle texture transitions
  useEffect(() => {
    if (!meshRef.current || !currentAction?.id || !textureMapRef.current[currentAction.id]) return
    
    const material = meshRef.current.material
    const currentTexture = textureMapRef.current[currentAction.id]
    
    if (isTransitioning) {
      // Store current texture as previous
      prevTextureRef.current = material.uniforms.bannerTexture.value
      
      // Update uniforms
      material.uniforms.prevTexture.value = prevTextureRef.current
      material.uniforms.bannerTexture.value = currentTexture
      material.uniforms.transition.value = 0
      transitionRef.current = 0
      
      console.log('Starting transition', {
        from: prevTextureRef.current,
        to: currentTexture,
      })
    }
  }, [currentAction, isTransitioning])

  // Animation frame
  useFrame((state, delta) => {
    if (!meshRef.current) return

    const material = meshRef.current.material
    material.uniforms.time.value = state.clock.getElapsedTime()

    if (isTransitioning) {
      transitionRef.current = Math.min(1, transitionRef.current + delta * 1.0)
      material.uniforms.transition.value = transitionRef.current
    }
  })

  // Cleanup
  useEffect(() => {
    return () => {
      // Don't dispose textures as they're managed by textureLoader
      if (meshRef.current) {
        meshRef.current.material.dispose()
      }
    }
  }, [])

  // Create shader material
  const shaderMaterial = useMemo(() => {
    try {
      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        transparent: true,
      })
      return material
    } catch (error) {
      console.error('Error creating shader material:', error)
      return null
    }
  }, [uniforms])

  if (!shaderMaterial) return null

  return (
    <mesh 
      ref={meshRef} 
      onClick={onClick} 
      position={position} 
      rotation={rotation}
      scale={scale}
    >
      <planeGeometry args={[1, 1.01]} /> {/* Restore original aspect ratio */}
      <primitive object={shaderMaterial} attach="material" />
    </mesh>
  )
}
