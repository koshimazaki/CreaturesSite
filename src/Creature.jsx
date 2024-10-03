import React, { useRef, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import OGAnimModel from './models/OGanim.glb'

function OG(props) {
  const group = useRef()
  const { scene, animations } = useGLTF(OGAnimModel)
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    // Start the Idle animation by default
    const idleAction = actions['idle']
    if (idleAction) {
      idleAction.reset().fadeIn(0.5).play()
    }

    return () => {
      // Clean up animations on unmount
      Object.values(actions).forEach(action => action.stop())
    }
  }, [actions])

  return (
    <group ref={group} {...props}>
      <primitive object={scene} />
    </group>
  )
}

export default OG

useGLTF.preload(OGAnimModel)
