import { useState, useMemo } from 'react'
import { useControls, folder } from 'leva'
import { useRef, Suspense,useLayoutEffect } from 'react'
import { useFrame, useLoader, extend } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'



// Simplex noise function
const simplexNoise = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
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
`

class FireMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      defines: { ITERATIONS: '12', OCTIVES: '4' },
      uniforms: {
        fireTex: { type: 't', value: null },
        color: { type: 'c', value: null },
        time: { type: 'f', value: 0.0 },
        seed: { type: 'f', value: 0.0 },
        invModelMatrix: { type: 'm4', value: null },
        scale: { type: 'v3', value: null },
        noiseScale: { type: 'v4', value: new THREE.Vector4(1, 2, 1, 0.3) },
        magnitude: { type: 'f', value: 2.5 },
        lacunarity: { type: 'f', value: 3.0 },
        gain: { type: 'f', value: 0.6 }
      },
      vertexShader: `
        varying vec3 vWorldPos;
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
        }`,
      fragmentShader: `
        ${simplexNoise}

        uniform vec3 color;
        uniform float time;
        uniform float seed;
        uniform mat4 invModelMatrix;
        uniform vec3 scale;
        uniform vec4 noiseScale;
        uniform float magnitude;
        uniform float lacunarity;
        uniform float gain;
        uniform sampler2D fireTex;
        varying vec3 vWorldPos;

        float turbulence(vec3 p) {
          float sum = 0.0;
          float freq = 1.0;
          float amp = 1.0;
          for(int i = 0; i < OCTIVES; i++) {
            sum += abs(snoise(p * freq)) * amp;
            freq *= lacunarity;
            amp *= gain;
          }
          return sum;
        }

        vec4 samplerFire (vec3 p, vec4 scale) {
          vec2 st = vec2(sqrt(dot(p.xz, p.xz)), p.y);
          if(st.x <= 0.0 || st.x >= 1.0 || st.y <= 0.0 || st.y >= 1.0) return vec4(0.0);
          p.y -= (seed + time) * scale.w;
          p *= scale.xyz;
          st.y += sqrt(st.y) * magnitude * turbulence(p);
          if(st.y <= 0.0 || st.y >= 1.0) return vec4(0.0);
          return texture2D(fireTex, st);
        }

        vec3 localize(vec3 p) {
          return (invModelMatrix * vec4(p, 1.0)).xyz;
        }

        void main() {
          vec3 rayPos = vWorldPos;
          vec3 rayDir = normalize(rayPos - cameraPosition);
          float rayLen = 0.0288 * length(scale.xyz);
          vec4 col = vec4(0.0);
          for(int i = 0; i < ITERATIONS; i++) {
            rayPos += rayDir * rayLen;
            vec3 lp = localize(rayPos);
            lp.y += 0.5;
            lp.xz *= 2.0;
            col += samplerFire(lp, noiseScale);
          }
          col.a = col.r;
          gl_FragColor = col * vec4(color, 1.0);
        }`
    })
  }
}

extend({ FireMaterial })

function PurpleFire({ 
  scale = 7, 
  color = '#fc0398', 
  magnitude = 2.5, 
  gain = 0.6, 
  noiseScale = 2,
  heightFactor = 1.0,
  iterations = 8,
  octaves = 4,
  ...props 
}) {
  const ref = useRef()
  const texture = useMemo(() => {
    const tex = new THREE.TextureLoader().load('/fire.png')
    tex.magFilter = tex.minFilter = THREE.LinearFilter
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping
    return tex
  }, [])
  
  useFrame((state) => {
    const invModelMatrix = ref.current.material.uniforms.invModelMatrix.value
    ref.current.updateMatrixWorld()
    invModelMatrix.copy(ref.current.matrixWorld).invert()
    ref.current.material.uniforms.time.value = state.clock.elapsedTime
    ref.current.material.uniforms.invModelMatrix.value = invModelMatrix
    ref.current.material.uniforms.scale.value = ref.current.scale
  })

  useLayoutEffect(() => {
    texture.magFilter = texture.minFilter = THREE.LinearFilter
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping
    ref.current.material.uniforms.fireTex.value = texture
    ref.current.material.uniforms.color.value = new THREE.Color(color)
    ref.current.material.uniforms.magnitude.value = magnitude
    ref.current.material.uniforms.gain.value = gain
    ref.current.material.uniforms.invModelMatrix.value = new THREE.Matrix4()
    ref.current.material.uniforms.scale.value = new THREE.Vector3(1, 1, 1)
    ref.current.material.uniforms.seed.value = Math.random() * 19.19
    ref.current.material.uniforms.noiseScale.value = new THREE.Vector4(noiseScale, noiseScale * 2, noiseScale, 0.6)
    ref.current.material.defines.ITERATIONS = iterations.toString()
    ref.current.material.defines.OCTIVES = octaves.toString()
    ref.current.material.needsUpdate = true
  }, [color, magnitude, gain, noiseScale, heightFactor, iterations, octaves])

  return (
    <mesh ref={ref} scale={scale} {...props}>
      <boxGeometry />
      <fireMaterial transparent depthWrite={false} depthTest={false} />
    </mesh>
  )
}

export function FireSpell() {
  const { 
    fireColor,
    fireScale,
    fireIntensity,
    fireGain,
    noiseScale,
    fireHeight,
    fireIterations,
    fireOctaves
  } = useControls('Fire Settings', {
    fireColor: {
      value: '#fc0398',
      label: 'Fire Color'
    },
    fireScale: {
      value: 7,
      min: 1,
      max: 15,
      step: 0.5,
      label: 'Fire Scale'
    },
    fireIntensity: {
      value: 2.5,
      min: 0.5,
      max: 5,
      step: 0.1,
      label: 'Fire Intensity'
    },
    fireGain: {
      value: 0.6,
      min: 0.1,
      max: 1.0,
      step: 0.05,
      label: 'Fire Density'
    },
    noiseScale: {
      value: 2,
      min: 0.5,
      max: 5,
      step: 0.1,
      label: 'Noise Scale'
    },
    fireHeight: {
      value: 1.0,
      min: 0.1,
      max: 2.0,
      step: 0.1,
      label: 'Fire Height'
    },
    fireIterations: {
      value: 12,
      min: 4,
      max: 24,
      step: 1,
      label: 'Detail Level',
      hint: 'Higher values = more detailed fire but lower performance'
    },
    fireOctaves: {
      value: 4,
      min: 1,
      max: 8,
      step: 1,
      label: 'Noise Detail',
      hint: 'Higher values = more turbulent fire but lower performance'
    }
  })

  return (
    <PurpleFire 
      scale={fireScale}
      color={fireColor}
      magnitude={fireIntensity}
      gain={fireGain}
      noiseScale={noiseScale}
      heightFactor={fireHeight}
      iterations={fireIterations}
      octaves={fireOctaves}
      position={[0, 0, 0]}
    />
  )
}

export { PurpleFire } 