import React, { useRef, useEffect } from 'react'
import { useVideoTexture } from '@react-three/drei'

function VideoScreen({ videoSrc }) {
  const videoTexture = useVideoTexture(videoSrc)

  return (
    <mesh>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={videoTexture} toneMapped={false} />
    </mesh>
  )
}