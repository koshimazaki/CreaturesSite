import { useGLTF } from '@react-three/drei'
import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

// Import models using relative paths with ?url
import cyberpunkSpeederModel from '/src/assets/models/cyberpunk_speeder-transformed.glb?url'
import vcs3Model from '/src/assets/models/vcs3-transformed.glb?url'
import moogModel from '/src/assets/models/moog-transformed.glb?url'
import tripoModel from '/src/assets/models/tripo3EM3-transformed.glb?url'
import DragonModel from '/src/assets/models/Dragon-transformed.glb?url'
import GamepadModel from '/src/assets/models/gamepad-transformed.glb?url'
import PalmModel from '/src/assets/models/palm.glb?url'
import PyramidModel from '/src/assets/models/pyramid.glb?url'
import PlantModel from '/src/assets/models/plant1-transformed.glb?url'


function Palm({ position, scale, rotation }) {
    const { nodes, materials } = useGLTF(PalmModel)
    const groupRef = useRef()
    
    // Add animation using useFrame
    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        
        // Gentle swaying rotation
        if (groupRef.current) {
            // Sway around Y axis
            groupRef.current.rotation.y = rotation[1] + Math.sin(time * 0.5) * 0.1
            
            // Slight tilt in X and Z
            groupRef.current.rotation.x = Math.sin(time * 0.3) * 0.05
            groupRef.current.rotation.z = Math.cos(time * 0.4) * 0.05
            
            // Subtle "breathing" scale
            const breathingScale = 1 + Math.sin(time * 0.8) * 0.03
            groupRef.current.scale.set(
                scale[0] * breathingScale,
                scale[1] * breathingScale,
                scale[2] * breathingScale
            )
        }
    })

    return (
        <group 
            ref={groupRef} 
            position={position} 
            scale={scale} 
            rotation={rotation}
        >
            {/* Scene node rendering */}
            {nodes.Scene && nodes.Scene.children && nodes.Scene.children.map((child, index) => (
                <primitive key={index} object={child} />
            ))}
            
            {/* Direct mesh rendering */}
            {nodes.Palm_01 && (
                <primitive object={nodes.Palm_01} />
            )}
        </group>
    )
}

function Gamepad({ position, scale, rotation }) {
    const { nodes, materials } = useGLTF(GamepadModel)
    return (
        <group position={position} scale={scale} rotation={rotation} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.manette_Material007_0.geometry} material={materials.PaletteMaterial001} rotation={[-Math.PI / 2, 0, -Math.PI / 2]} />
      </group>
    )
}


function Plant({ position, scale, rotation }) {
    const { nodes, materials } = useGLTF(PlantModel)
    return (
        <mesh castShadow receiveShadow geometry={nodes.w_pl17003.geometry} material={materials.Gradient} 
        position={[-5.8065, -0.992, -5.03]} 
        rotation={[-1.812, 1.396, 1.846]} 
        scale={[2.312, 2.359, 2.343]} />
    )
}


function Speeder({ position, scale, rotation }) {
    const groupRef = useRef()
    const { nodes, materials } = useGLTF(cyberpunkSpeederModel)
    
    useFrame((state) => {
      const time = state.clock.getElapsedTime()
      const hoverAmplitude = 0.03
      const hoverFrequency = 1.5
      const newY = position[1] + Math.sin(time * hoverFrequency) * hoverAmplitude
      groupRef.current.position.setY(newY)
    })
    
    return (
      <group ref={groupRef} position={position} scale={scale} rotation={rotation} dispose={null}>
        <mesh castShadow receiveShadow geometry={nodes.defaultMaterial.geometry} material={materials.material} />
        <mesh castShadow receiveShadow geometry={nodes.defaultMaterial_1.geometry} material={materials.engines} />
        <mesh castShadow receiveShadow geometry={nodes.defaultMaterial_2.geometry} material={materials.glass} />
        <mesh castShadow receiveShadow geometry={nodes.defaultMaterial_3.geometry} material={materials.low_back} />
      </group>
    )
}

function VCS3({ position, scale, rotation }) {
    const { nodes, materials } = useGLTF(vcs3Model)
    return (
        <group position={position} scale={scale} rotation={rotation} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes['tripo_node_b577391c-e939-4bdf-aac1-9d8b14b08420'].geometry} material={materials['tripo_material_b577391c-e939-4bdf-aac1-9d8b14b08420']} />
    </group>
  )
}

function Dragon({ position, scale, rotation }) {
    const { nodes, materials } = useGLTF(DragonModel)
    return (
        <group position={position} scale={scale} rotation={rotation} dispose={null}>
        <mesh castShadow receiveShadow geometry={nodes['tripo_node_52f2a499-e337-4ec8-b1a6-e4d7ca6d594c'].geometry} material={materials['tripo_material_52f2a499-e337-4ec8-b1a6-e4d7ca6d594c']} />
      </group>
    )
}



function Moog({ position, scale, rotation }) {
    const { nodes, materials } = useGLTF(moogModel)
    return (
      <group position={position} scale={scale} rotation={rotation} dispose={null}>
        <mesh castShadow receiveShadow geometry={nodes.accessory_PlugKeys_0.geometry} material={materials.PlugKeys} rotation={[-Math.PI / 2, 0, -Math.PI]} />
        <mesh castShadow receiveShadow geometry={nodes.boxbacks_low_Main_0.geometry} material={materials.Main} rotation={[-Math.PI / 2, 0, -Math.PI]} />
        <mesh castShadow receiveShadow geometry={nodes.plug1247_wires_0.geometry} material={materials.wires} rotation={[-Math.PI / 2, 0, -Math.PI]} />
      </group>
    )
}

function Tripo({ position, scale, rotation }) {
    const { nodes, materials } = useGLTF(tripoModel)
    const groupRef = useRef()
    
    // // Add gentle animation using useFrame
    // useFrame((state) => {
    //     const time = state.clock.getElapsedTime()
        
    //     if (groupRef.current) {
    //         // Very subtle rotation around Y axis
    //         groupRef.current.rotation.y = rotation[1] + Math.sin(time * 0.2) * 0.1
            
    //         // Extremely gentle tilt
    //         groupRef.current.rotation.x = Math.sin(time * 0.15) * 0.08
    //         groupRef.current.rotation.z = Math.cos(time * 0.15) * 0.08
            
    //         // Very subtle breathing effect
    //         const breathingScale = 1 + Math.sin(time * 0.3) * 0.008
    //         groupRef.current.scale.set(
    //             scale[0] * breathingScale,
    //             scale[1] * breathingScale,
    //             scale[2] * breathingScale
    //         )
    //     }
    // })

    return (
        <group 
            ref={groupRef} 
            position={position} 
            scale={scale} 
            rotation={rotation} 
            dispose={null}
        >
            <mesh 
                castShadow 
                receiveShadow 
                geometry={nodes['tripo_node_8daeafd4-b61b-4a05-af54-1987b972f516'].geometry} 
                material={materials['tripo_material_8daeafd4-b61b-4a05-af54-1987b972f516']} 
            />
        </group>
    )
}

function Pyramid({ position, scale, rotation }) {
    const { nodes, materials } = useGLTF(PyramidModel)
    const groupRef = useRef()
    
    // Add very subtle animation
    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        
        if (groupRef.current) {
            // Very subtle rotation
            groupRef.current.rotation.y = rotation[1] + Math.sin(time * 0.1) * 0.02
            
            // Minimal tilt
            groupRef.current.rotation.x = Math.sin(time * 0.08) * 0.005
            groupRef.current.rotation.z = Math.cos(time * 0.08) * 0.005
            
            // Subtle breathing scale
            const breathingScale = 1 + Math.sin(time * 0.2) * 0.004
            groupRef.current.scale.set(
                scale[0] * breathingScale,
                scale[1] * breathingScale,
                scale[2] * breathingScale
            )
            
            // Gentle up and down movement
            const hoverY = Math.sin(time * 0.5) * 0.05  // Adjust 0.05 for hover height
            groupRef.current.position.y = position[1] + hoverY
        }
    })

    return (
        <group 
            ref={groupRef} 
            position={position} 
            scale={scale} 
            rotation={rotation}
        >
            <mesh 
                castShadow 
                receiveShadow 
                geometry={nodes.Cube002.geometry} 
                material={materials['Gradient.001']} 
                position={[1.755, 10.672, -0.455]} 
                rotation={[-Math.PI, 1.559, -Math.PI]} 
                scale={[26.784, 10.911, 28.843]} 
            />
        </group>
    )
}

export { Palm, Plant,Gamepad, Dragon, Moog, Speeder, Tripo, VCS3, Pyramid }

// Preload models using the same paths
useGLTF.preload(PalmModel)
useGLTF.preload(GamepadModel)
useGLTF.preload(DragonModel)
useGLTF.preload(cyberpunkSpeederModel)
useGLTF.preload(vcs3Model)
useGLTF.preload(moogModel)
useGLTF.preload(tripoModel)
useGLTF.preload(PyramidModel)
useGLTF.preload(PlantModel)
// Update the preload
useGLTF.preload('/palm.glb')
