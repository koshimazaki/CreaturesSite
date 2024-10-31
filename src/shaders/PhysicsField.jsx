import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function PhysicsField({ visible = false, position = [0, 0, 0], scale = [1, 1, 1] }) {
    const meshRef = useRef()

    const uniforms = useMemo(() => ({
        time: { value: 0 }
    }), [])

    const vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `

    const fragmentShader = `
        uniform float time;
        varying vec2 vUv;
        
        void main() {
            // Simple blue energy field
            vec3 color = vec3(0.3, 0.7, 1.0);
            gl_FragColor = vec4(color, 0.5);
        }
    `

    useFrame((state) => {
        if (meshRef.current) {
            uniforms.time.value = state.clock.elapsedTime;
        }
    })

    return (
        <mesh 
            ref={meshRef}
            position={position}
            scale={scale}
        >
            <sphereGeometry args={[1, 32, 32]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent={true}
                side={THREE.DoubleSide}
            />
        </mesh>
    )
} 