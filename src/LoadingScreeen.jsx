import React from 'react'
import { Html, useProgress } from '@react-three/drei'

export default function LoadingScreen() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
        background: 'black',
        color: 'white',
        fontFamily: 'Exobold, sans-serif',
        fontSize: '36px',
        opacity: 0.75
      }}>
        <div style={{ marginBottom: '20px' }}>LOADING...</div>
        <div style={{ 
          width: '200px', 
          height: '20px', 
          background: '#111',
          border: '2px solid #00000',
          borderRadius: '10px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: 'white',
            transition: 'width 0.3s ease-out'
          }} />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'black',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            {progress.toFixed(0)}%
          </div>
        </div>
      </div>
    </Html>
  )
}