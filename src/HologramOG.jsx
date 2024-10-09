import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import ogModel from '/src/assets/models/OGanim-transformed.glb?url'

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  uniform float uTime;

  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    
    vec3 p = position;
    p.y += sin(p.x * 5.0 + uTime) * 0.05;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;

  void main() {
    vec2 uv = vUv;
    float distort = sin(uv.y * 50.0 + uTime * 2.0) * 0.1;
    uv.x += distort;

    vec3 color = uColor;
    float scanline = sin(uv.y * 400.0 + uTime * 5.0) * 0.05;
    color += scanline;

    // Simple fresnel effect
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.0);
    color = mix(color, vec3(1.0), fresnel * 0.5);

    // Wireframe effect
    float thickness = 0.02;
    float wireframe = 1.0 - step(thickness, mod(vUv.x, 0.1)) * step(thickness, mod(vUv.y, 0.1));
    color = mix(color, uColor * 0.5, wireframe * 0.2);

    float alpha = 0.8;

    gl_FragColor = vec4(color, alpha);
  }
`

function FrequencyBandOverlay() {
  // ... (keep this function as is)
}

function HologramOG({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }) {
  const groupRef = useRef()
  const { scene } = useGLTF(ogModel)

  const hologramMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#03d7fc') }
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: true,
    })
  }, [])

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5
    }
    if (hologramMaterial) {
      hologramMaterial.uniforms.uTime.value += delta
    }
  })

  // Extract meshes and sort them
  const sortedMeshes = useMemo(() => {
    const meshes = []
    scene.traverse((node) => {
      if (node.isMesh) {
        meshes.push(node.clone())
      }
    })
    
    // Sort meshes based on their bounding sphere's max Y value
    meshes.sort((a, b) => {
      a.geometry.computeBoundingSphere()
      b.geometry.computeBoundingSphere()
      return (
        b.geometry.boundingSphere.center.y + b.geometry.boundingSphere.radius -
        (a.geometry.boundingSphere.center.y + a.geometry.boundingSphere.radius)
      )
    })

    return meshes
  }, [scene])

  return (
    <>
      <group ref={groupRef} position={position} scale={scale} rotation={rotation}>
        {sortedMeshes.map((mesh, index) => (
          <mesh
            key={index}
            geometry={mesh.geometry}
            material={hologramMaterial}
            position={mesh.position}
            rotation={mesh.rotation}
            scale={mesh.scale}
            renderOrder={sortedMeshes.length - index}
          />
        ))}
      </group>
      <FrequencyBandOverlay />
    </>
  )
}

export default HologramOG

useGLTF.preload(ogModel)
