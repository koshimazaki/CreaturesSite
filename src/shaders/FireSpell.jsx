import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

const FireMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorStart: new THREE.Color('#ff2800'),
    uColorEnd: new THREE.Color('#ffeb00'),
    uIntensity: 1.0,
    uNoiseScale: 2.0,
    uNoiseOctaves: 3.0,
    uDisplacement: 0.3,
    uFrequency: 1.5,
    uVoronoi: 1.0,
    uTurbulence: 0.5,
    uFresnel: 0.3,
    uAlpha: 0.8,
    uSpeed: 0.5
  },
  /* glsl */`
    uniform float uTime;
    uniform float uDisplacement;
    uniform float uNoiseScale;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying float vDisplacement;

    //	Classic Perlin 3D Noise 
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
    vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

    float noise(vec3 P){
      vec3 Pi0 = floor(P);
      vec3 Pi1 = Pi0 + vec3(1.0);
      Pi0 = mod(Pi0, 289.0);
      Pi1 = mod(Pi1, 289.0);
      vec3 Pf0 = fract(P);
      vec3 Pf1 = Pf0 - vec3(1.0);
      vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
      vec4 iy = vec4(Pi0.yy, Pi1.yy);
      vec4 iz0 = Pi0.zzzz;
      vec4 iz1 = Pi1.zzzz;

      vec4 ixy = permute(permute(ix) + iy);
      vec4 ixy0 = permute(ixy + iz0);
      vec4 ixy1 = permute(ixy + iz1);

      vec4 gx0 = ixy0 / 7.0;
      vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
      gx0 = fract(gx0);
      vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
      vec4 sz0 = step(gz0, vec4(0.0));
      gx0 -= sz0 * (step(0.0, gx0) - 0.5);
      gy0 -= sz0 * (step(0.0, gy0) - 0.5);

      vec4 gx1 = ixy1 / 7.0;
      vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
      gx1 = fract(gx1);
      vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
      vec4 sz1 = step(gz1, vec4(0.0));
      gx1 -= sz1 * (step(0.0, gx1) - 0.5);
      gy1 -= sz1 * (step(0.0, gy1) - 0.5);

      vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
      vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
      vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
      vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
      vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
      vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
      vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
      vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

      vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
      g000 *= norm0.x;
      g010 *= norm0.y;
      g100 *= norm0.z;
      g110 *= norm0.w;
      vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
      g001 *= norm1.x;
      g011 *= norm1.y;
      g101 *= norm1.z;
      g111 *= norm1.w;

      float n000 = dot(g000, Pf0);
      float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
      float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
      float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
      float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
      float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
      float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
      float n111 = dot(g111, Pf1);

      vec3 fade_xyz = fade(Pf0);
      vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
      vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
      float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
      return 2.2 * n_xyz;
    }

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      
      // Calculate displacement
      float noiseValue = noise(position * uNoiseScale + uTime * 0.5);
      vec3 displaced = position + normal * (noiseValue * uDisplacement);
      
      vPosition = displaced;
      vDisplacement = noiseValue;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
    }
  `,
  /* glsl */`
    uniform float uTime;
    uniform vec3 uColorStart;
    uniform vec3 uColorEnd;
    uniform float uIntensity;
    uniform float uNoiseScale;
    uniform float uNoiseOctaves;
    uniform float uFrequency;
    uniform float uVoronoi;
    uniform float uTurbulence;
    uniform float uFresnel;
    uniform float uAlpha;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying float vDisplacement;

    //	Classic Perlin 3D Noise 
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
    vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

    float noise(vec3 P){
      vec3 Pi0 = floor(P);
      vec3 Pi1 = Pi0 + vec3(1.0);
      Pi0 = mod(Pi0, 289.0);
      Pi1 = mod(Pi1, 289.0);
      vec3 Pf0 = fract(P);
      vec3 Pf1 = Pf0 - vec3(1.0);
      vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
      vec4 iy = vec4(Pi0.yy, Pi1.yy);
      vec4 iz0 = Pi0.zzzz;
      vec4 iz1 = Pi1.zzzz;

      vec4 ixy = permute(permute(ix) + iy);
      vec4 ixy0 = permute(ixy + iz0);
      vec4 ixy1 = permute(ixy + iz1);

      vec4 gx0 = ixy0 / 7.0;
      vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
      gx0 = fract(gx0);
      vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
      vec4 sz0 = step(gz0, vec4(0.0));
      gx0 -= sz0 * (step(0.0, gx0) - 0.5);
      gy0 -= sz0 * (step(0.0, gy0) - 0.5);

      vec4 gx1 = ixy1 / 7.0;
      vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
      gx1 = fract(gx1);
      vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
      vec4 sz1 = step(gz1, vec4(0.0));
      gx1 -= sz1 * (step(0.0, gx1) - 0.5);
      gy1 -= sz1 * (step(0.0, gy1) - 0.5);

      vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
      vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
      vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
      vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
      vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
      vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
      vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
      vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

      vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
      g000 *= norm0.x;
      g010 *= norm0.y;
      g100 *= norm0.z;
      g110 *= norm0.w;
      vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
      g001 *= norm1.x;
      g011 *= norm1.y;
      g101 *= norm1.z;
      g111 *= norm1.w;

      float n000 = dot(g000, Pf0);
      float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
      float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
      float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
      float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
      float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
      float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
      float n111 = dot(g111, Pf1);

      vec3 fade_xyz = fade(Pf0);
      vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
      vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
      float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
      return 2.2 * n_xyz;
    }

    float fbm(vec3 x) {
      float v = 0.0;
      float a = 0.5;
      float f = uFrequency;
      
      float prevNoise = 0.0;
      
      for(float i = 0.0; i < 4.0; i++) {
        if(i >= uNoiseOctaves) break;
        
        float n = i == 0.0 ? noise(x * f) : noise(x * f + prevNoise * 0.5);
        v += a * n;
        prevNoise = n;
        
        f *= 2.0;
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec3 noisePos = vPosition * uNoiseScale;
      float timeOffset = uTime * 0.5;
      
      float baseNoise = fbm(noisePos - vec3(0.0, timeOffset, 0.0));
      float turbulence = fbm(noisePos * 2.0 + baseNoise * uTurbulence);
      float voronoi = fbm(noisePos * 4.0 + turbulence * uVoronoi);
      
      float fireIntensity = baseNoise * turbulence * voronoi * uIntensity;
      fireIntensity *= (1.0 - vPosition.y);
      
      vec3 color = mix(uColorEnd, uColorStart, fireIntensity);
      
      float fresnelFactor = pow(1.0 - dot(vNormal, vec3(0.0, 1.0, 0.0)), 2.0);
      color += fresnelFactor * uFresnel * uColorStart;
      
      float alpha = smoothstep(0.0, 0.01, fireIntensity) * uAlpha;
      alpha *= (1.0 + vDisplacement);
      
      gl_FragColor = vec4(color, alpha);
    }
  `
)

extend({ FireMaterial })

// Add preset configurations
export const SHADER_PRESETS = {
  FIREBALL: {
    position: [0, 0, 0],
    scale: 0.3,
    speed: 0.1,
    colorStart: '#931c7a',
    colorEnd: '#ff0000',
    intensity: 1.7,
    noiseScale: 0.3,
    noiseOctaves: 4.0,
    displacement: 0.3,
    frequency: 3,
    voronoi: 1.5,
    turbulence: 1.1,
    rotationSpeed: 0.05,
    fresnel: 0.8,
    alpha: 0.8,
    movementSpeed: 0.2,
    zRange: { min: 0, max: 0.5 },
    colorStartInstance: new THREE.Color('#c2196b'),
    colorEndInstance: new THREE.Color('#ff8600'),
  },
  FORCEFIELD: {
    position: [0, 1, 0],
    scale: 2.5,
    speed: 0.05,
    colorStart: '#a409cb',
    colorEnd: '#008cff',
    intensity: 0.3,
    noiseScale: 1.1,
    noiseOctaves: 4.0,
    displacement: 0.5,
    frequency: 1.7,
    voronoi: 1.5,
    turbulence: 0.5,
    rotationSpeed: 0.001,
    fresnel: 1.7,
    alpha: 0.8,
    movementSpeed: 0.2,
    zRange: { min: -0.2, max: 0.4 },
    colorStartInstance: new THREE.Color('#a409cb'),
    colorEndInstance: new THREE.Color('#1f4eff'),
  }
}

export function FireSpell({ preset = 'FIREBALL', customSettings = {} }) {
  const materialRef = useRef()
  const meshRef = useRef()
  const spawnTimeRef = useRef(null)
  const hasSpawnedRef = useRef(false)
  const startTimeRef = useRef(Date.now())
  
  // Merge preset with any custom settings
  const settings = useMemo(() => ({
    ...SHADER_PRESETS[preset],
    ...customSettings
  }), [preset, customSettings])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    const initialDelay = 2000 // 500ms delay before spawn
    const spawnDuration = 500 // 200ms spawn animation
    const currentTime = Date.now()
    const delayElapsed = currentTime - startTimeRef.current

    if (meshRef.current) {
      if (preset === 'FIREBALL') {
        // Wait for initial delay before starting spawn sequence
        if (delayElapsed < initialDelay) {
          // Keep mesh invisible during delay
          meshRef.current.scale.setScalar(0)
          return
        }

        // Initialize spawnTimeRef after delay
        if (!spawnTimeRef.current && delayElapsed >= initialDelay) {
          spawnTimeRef.current = currentTime
        }

        // Only proceed with spawn animation after delay
        if (spawnTimeRef.current) {
          const spawnElapsed = currentTime - spawnTimeRef.current

          if (spawnElapsed < spawnDuration && !hasSpawnedRef.current) {
            // Spawn animation
            const progress = spawnElapsed / spawnDuration
            const currentScale = THREE.MathUtils.lerp(0, settings.scale, progress)
            
            meshRef.current.position.set(0, 0.4, 0)
            meshRef.current.scale.setScalar(currentScale)
            
            if (materialRef.current) {
              materialRef.current.uVoronoi = THREE.MathUtils.lerp(0, settings.voronoi, progress)
            }
            
            if (progress >= 1) {
              hasSpawnedRef.current = true
            }
          } else if (hasSpawnedRef.current) {
            // Normal movement after spawn
            const zMovement = THREE.MathUtils.mapLinear(
              Math.sin(time * settings.movementSpeed),
              -1,
              1,
              settings.zRange.min,
              settings.zRange.max
            )
            
            meshRef.current.position.set(
              settings.position[0] + Math.sin(time * 0.3) * 0.5,
              settings.position[1] + Math.cos(time * 0.2) * 0.3,
              zMovement
            )
            meshRef.current.rotation.y += settings.rotationSpeed
          }
        }
      } else if (preset === 'FORCEFIELD') {
        // Forcefield starts at full scale immediately
        if (!hasSpawnedRef.current) {
          meshRef.current.scale.setScalar(settings.scale)
          meshRef.current.position.set(
            settings.position[0],
            settings.position[1],
            settings.position[2]
          )
          hasSpawnedRef.current = true
        }
        
        // Forcefield movement
        meshRef.current.position.set(
          settings.position[0],
          settings.position[1] + Math.sin(time * 0.5) * 0.1,
          settings.position[2] + Math.sin(time * settings.movementSpeed) * 0.2
        )
        meshRef.current.rotation.y += settings.rotationSpeed
      }
    }

    if (materialRef.current) {
      materialRef.current.uTime = time
      materialRef.current.uColorStart = settings.colorStartInstance
      materialRef.current.uColorEnd = settings.colorEndInstance
      materialRef.current.uIntensity = settings.intensity
      materialRef.current.uNoiseScale = settings.noiseScale
      materialRef.current.uNoiseOctaves = settings.noiseOctaves
      materialRef.current.uDisplacement = settings.displacement
      materialRef.current.uFrequency = settings.frequency
      materialRef.current.uVoronoi = hasSpawnedRef.current ? settings.voronoi : 0
      materialRef.current.uTurbulence = settings.turbulence
      materialRef.current.uFresnel = settings.fresnel
      materialRef.current.uAlpha = settings.alpha
    }
  })

  return (
    <mesh 
      ref={meshRef} 
      position={[0, 0.5, 0]} 
      scale={0}
    >
      <sphereGeometry args={[1, 32, 32]} />
      <fireMaterial 
        ref={materialRef} 
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
        key={FireMaterial.key}
      />
    </mesh>
  )
}

export default FireSpell;