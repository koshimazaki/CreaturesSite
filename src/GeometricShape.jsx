import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useCursor } from '@react-three/drei'

export function GeometricShape({ scale = 1, onGeometryChange, ...props }) {
  const ref = useRef()
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  const [geometryState, setGeometryState] = useState(0)
  useCursor(hovered)

  useFrame((state, delta) => {
    ref.current.rotation.x = ref.current.rotation.y += delta
  })

  const handleClick = (event) => {
    event.stopPropagation()
    click(!clicked)
  }

  const handleGeometryChange = () => {
    setGeometryState((prevState) => (prevState + 1) % 4)
    if (onGeometryChange) {
      onGeometryChange()
    }
  }

  useEffect(() => {
    window.handleGeometryChange = handleGeometryChange
  }, [])

  const renderGeometry = () => {
    switch (geometryState) {
      case 0:
        return <boxGeometry />
      case 1:
        return <tetrahedronGeometry />
      case 2:
        return (
          <group>
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.5, 32, 32]} />
              <meshStandardMaterial color={hovered ? '#4daee1' : 'hotpink'} />
            </mesh>
            <mesh position={[1, 0, 0]}>
              <sphereGeometry args={[0.3, 32, 32]} />
              <meshStandardMaterial color={hovered ? '#4daee1' : 'lime'} />
            </mesh>
            <mesh position={[-1, 0, 0]}>
              <sphereGeometry args={[0.2, 32, 32]} />
              <meshStandardMaterial color={hovered ? '#4daee1' : 'orange'} />
            </mesh>
          </group>
        )
        case 3:
        return (
        <group> 
            <mesh position={[0, 0, 0]}>
              <octahedronGeometry args={[0.8, 1, 1]} />
              <meshStandardMaterial color={hovered ? '#4daee1' : 'orange'} />
            </mesh>
        </group>)

      default:
        return <boxGeometry />
    }
  }

  return (
    <group
      {...props}
      ref={ref}
      onClick={handleClick}
      onPointerOver={(e) => (e.stopPropagation(), hover(true))}
      onPointerOut={(e) => hover(false)}
    >
      <mesh scale={clicked ? scale * 1.4 : scale * 1.2}>
        {renderGeometry()}
        <meshStandardMaterial color={hovered ? '#4daee1' : 'hotpink'} />
      </mesh>
    </group>
  )
}
