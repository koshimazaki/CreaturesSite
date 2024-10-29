import React, { useRef, useEffect, useMemo, useState } from 'react'
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
  const [isJumping, setIsJumping] = useState(false)

  useEffect(() => {
    // console.log('Available actions:', Object.keys(actions))
    const idleAction = actions['idle'] || actions['ninja_idle']
    const jumpAction = actions['twistflip'] || actions['twistflip']

    // console.log('Idle action:', idleAction)
    // console.log('Jump action:', jumpAction)

    if (idleAction && jumpAction) {
      idleAction.reset().fadeIn(0.5).play()

      const handleKeyDown = (event) => {
        // console.log('Key pressed:', event.code)
        if (event.code === '' && !isJumping) {
          // console.log('Triggering jump animation')
          setIsJumping(true)
          idleAction.fadeOut(0.2)
          jumpAction.reset().fadeIn(0.2).play()
          
          setTimeout(() => {
            // console.log('Jump animation complete, returning to idle')
            jumpAction.fadeOut(0.2)
            idleAction.reset().fadeIn(0.2).play()
            setIsJumping(false)
          }, jumpAction.getClip().duration * 1000)
        }
      }

      window.addEventListener('keydown', handleKeyDown)

      return () => {
        window.removeEventListener('keydown', handleKeyDown)
        // Add safety check for actions
        if (actions) {
          Object.values(actions).forEach(action => {
            if (action && typeof action.stop === 'function') {
              action.stop()
            }
          })
        }
      }
    } else {
      // console.error('Idle or Jump action not found')
    }
  }, [actions, isJumping])

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
