// import React, { useRef, useEffect } from 'react'
// import { useFrame } from '@react-three/fiber'
// import { useRive } from '@rive-app/react-canvas'
// import * as THREE from 'three'

// function RiveScreen({ riveSrc, stateMachine, position, scale }) {
//   const canvasRef = useRef()
//   const textureRef = useRef()

//   const { RiveComponent } = useRive({
//     src: riveSrc,
//     stateMachines: [stateMachine],
//     autoplay: true,
//   })

//   useEffect(() => {
//     if (canvasRef.current) {
//       textureRef.current = new THREE.CanvasTexture(canvasRef.current)
//     }
//   }, [])

//   useFrame(() => {
//     if (textureRef.current) {
//       textureRef.current.needsUpdate = true
//     }
//   })

//   return (
//     <>
//       <mesh position={position} scale={scale}>
//         <planeGeometry />
//         <meshBasicMaterial>
//           {textureRef.current && <canvasTexture attach="map" args={[canvasRef.current]} />}
//         </meshBasicMaterial>
//       </mesh>
//       <RiveComponent
//         style={{
//           position: 'absolute',
//           width: '512px',
//           height: '512px',
//           pointerEvents: 'none',
//           opacity: 0,
//         }}
//         onCanvasLoad={(canvas) => {
//           canvasRef.current = canvas
//         }}
//       />
//     </>
//   )
// }

// export { RiveScreen }

