import { useGLTF } from '@react-three/drei'
import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

// Import models using relative paths with ?url
import cyberpunkSpeederModel from '/src/assets/models/cyberpunk_speeder-transformed.glb?url'
import vcs3Model from '/src/assets/models/vcs3-transformed.glb?url'
import moogModel from '/src/assets/models/moog-transformed.glb?url'
import tripoModel from '/src/assets/models/tripo3-transformed.glb?url'
import DragonModel from '/src/assets/models/Dragon-transformed.glb?url'
import GamepadModel from '/src/assets/models/gamepad-transformed.glb?url'

function Gamepad({ position, scale, rotation }) {
    const { nodes, materials } = useGLTF(GamepadModel)
    return (
        <group position={position} scale={scale} rotation={rotation} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.manette_Material007_0.geometry} material={materials.PaletteMaterial001} rotation={[-Math.PI / 2, 0, -Math.PI / 2]} />
      </group>
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
    return (
        <group position={position} scale={scale} rotation={rotation} dispose={null}>
        <mesh castShadow receiveShadow geometry={nodes['tripo_node_8daeafd4-b61b-4a05-af54-1987b972f516'].geometry} material={materials['tripo_material_8daeafd4-b61b-4a05-af54-1987b972f516']} />
      </group>
    )
}

export { Gamepad, Dragon, Moog, Speeder, Tripo, VCS3 }

// Preload models using the same paths
useGLTF.preload(GamepadModel)
useGLTF.preload(DragonModel)
useGLTF.preload(cyberpunkSpeederModel)
useGLTF.preload(vcs3Model)
useGLTF.preload(moogModel)
useGLTF.preload(tripoModel)

