import React from 'react'
import { useVideoTexture } from '@react-three/drei'

function VideoScreen1({ videoSrc }) {
  const videoTexture = useVideoTexture(videoSrc)

  return (
    <mesh position= {[0.1,5,1]} scale={[3.9, 3.5, 1]}>
      <planeGeometry />
      <meshBasicMaterial map={videoTexture} toneMapped={false} />
    </mesh>
  )
}

function VideoScreen2({ videoSrc }) {
    const videoTexture = useVideoTexture(videoSrc)
  
    return (
      <mesh position={[-0.1, 1, 1]} scale={[2.9, 2.9, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={videoTexture} toneMapped={false} />
      </mesh>
    )
  }


  function VideoScreen3({ videoSrc }) {
    const videoTexture = useVideoTexture(videoSrc)
  
    return (
      <mesh position={[-5.5, 6.29, -2.64]} scale={[3.5, 2.9, 1]}rotation={[0, 0.04, 0]}>
        <planeGeometry />
        <meshBasicMaterial map={videoTexture} toneMapped={false} />
      </mesh>
    )
  }

  
  export { VideoScreen1, VideoScreen2, VideoScreen3 }
  
    