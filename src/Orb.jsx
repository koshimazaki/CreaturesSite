import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { extend } from '@react-three/fiber'

// Shader material for the orb
const OrbMaterial = shaderMaterial(
  {
    uTime: 1,
    uColor1: new THREE.Color('#fe00fe'),
    uColor2: new THREE.Color('#0080ff'),
  },
  // Vertex shader
  /*glsl*/ `
    uniform float uTime;
    varying vec2 vUv;
    varying float vNoise;
    
    // Improved noise for more fluid movement
    vec3 mod289(vec3 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec4 mod289(vec4 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec4 permute(vec4 x) {
      return mod289(((x * 34.0) + 1.0) * x);
    }
    
    vec4 taylorInvSqrt(vec4 r) {
      return 1.79284291400159 - 0.85373472095314 * r;
    }
    
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      
      i = mod289(i);
      vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                + i.x + vec4(0.0, i1.x, i2.x, 1.0));
                
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    void main() {
      vUv = uv;
      
      vec3 pos = position;
      float slowTime = uTime * 0.5;
      
      // Base shape modification
      float baseShape = sin(pos.x * 2.0) * 0.1 + cos(pos.y * 3.0) * 0.1;
      
      // Layered noise for morphing
      float noise1 = snoise(vec3(pos.x * 0.3 + slowTime * 0.2, pos.y * 0.3, pos.z * 0.3)) * 0.5;
      float noise2 = snoise(vec3(pos.x * 0.2 - slowTime * 0.1, pos.y * 0.2, pos.z * 0.2)) * 0.3;
      
      float finalNoise = noise1 + noise2 + baseShape;
      vNoise = finalNoise;
      
      // Increased deformation amount slightly
      vec3 newPosition = pos + normal * (finalNoise * 0.45);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  // Fragment shader
  /*glsl*/ `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    varying vec2 vUv;
    varying float vNoise;

    void main() {
      // Smooth color blending
      float mixFactor = smoothstep(-0.5, 0.5, vNoise);
      vec3 color = mix(uColor1, uColor2, mixFactor);
      
      // Very subtle pulse
      float pulse = sin(uTime * 0.1) * 0.5 + 0.95;
      color *= pulse;

      gl_FragColor = vec4(color, 1.0);
    }
  `
)

extend({ OrbMaterial })

function Orb({ 
  position, 
  scale, 
  colorA = '#fe00fe', 
  colorB = '#0080ff', 
  timeOffset = 0,
  yRange = { min: 0.1, max: 0.3 }
}) {
  const meshRef = useRef()
  const materialRef = useRef()
  
  const color1 = useMemo(() => new THREE.Color(colorA), [colorA])
  const color2 = useMemo(() => new THREE.Color(colorB), [colorB])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    const offsetTime = time + timeOffset
    
    if (meshRef.current) {
      // Increased speed multiplier from 0.1 to 0.4
      const yMovement = THREE.MathUtils.mapLinear(
        Math.sin(offsetTime * 0.4), // Faster movement
        -1, 
        1, 
        yRange.min, 
        yRange.max
      )
      
      meshRef.current.position.y = position[1] + yMovement
      meshRef.current.rotation.y = offsetTime * 0.01 // Kept rotation slow
    }

    if (materialRef.current) {
      // Increased morphing speed slightly
      materialRef.current.uTime = offsetTime * 1.2 // Faster morphing
      materialRef.current.uColor1 = color1
      materialRef.current.uColor2 = color2
    }
  })

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 4]} />
      <orbMaterial ref={materialRef} transparent />
    </mesh>
  )
}

export default Orb
