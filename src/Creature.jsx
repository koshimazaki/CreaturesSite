import React, { useRef, useEffect, useMemo } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js'
import { useGraph } from '@react-three/fiber'

// Import the model using a relative path with ?url
import ogAnimModel from '/src/assets/models/OGanim-transformed.glb?url'

function OG(props) {
  const group = useRef()
  const { scene, animations } = useGLTF(ogAnimModel)
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    const idleAction = actions['idle']
    if (idleAction) {
      idleAction.reset().fadeIn(0.5).play()
    }

    return () => {
      Object.values(actions).forEach(action => action.stop())
    }
  }, [actions])

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature004" rotation={[Math.PI / 2, 0, 0]} scale={0.01} userData={{ name: 'Armature.004' }}>
          <primitive object={nodes.mixamorigHips} />
        </group>
        <skinnedMesh 
          name="GlitchCandyCreature_Body001" 
          geometry={nodes.GlitchCandyCreature_Body001.geometry} 
          material={materials.Body} 
          skeleton={nodes.GlitchCandyCreature_Body001.skeleton} 
          userData={{ name: 'GlitchCandyCreature_Body.001' }} 
        />
        <skinnedMesh 
          name="GlitchCandyCreature_Head001" 
          geometry={nodes.GlitchCandyCreature_Head001.geometry} 
          material={materials.Head} 
          skeleton={nodes.GlitchCandyCreature_Head001.skeleton} 
          userData={{ name: 'GlitchCandyCreature_Head.001' }} 
        />
      </group>
    </group>
  )
}

export default OG

// Preload the model
useGLTF.preload(ogAnimModel)
