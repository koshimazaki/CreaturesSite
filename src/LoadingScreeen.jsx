import React, { useState, useEffect } from 'react'
import { Html, useProgress } from '@react-three/drei'
import IOSStartButton from './IOSStartButton'

// Import font
import Micro from '/src/assets/fonts/Microgramma_D_Extended_Bold.otf?url'

const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

export function LoadingScreen({ onStart }) {
  const { progress } = useProgress()
  const [showStartButton, setShowStartButton] = useState(false)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const font = new FontFace('Micro', `url(${Micro})`)
    font.load().then(() => {
      document.fonts.add(font)
      setShowContent(true)
    }).catch(err => console.error('Font loading failed:', err))
  }, [])

  useEffect(() => {
    if (progress === 100) {
      if (isIOS()) {
        setShowStartButton(true)
      } else {
        onStart()
      }
    }
  }, [progress, onStart])

  return (
    <Html fullscreen>
      <style>
        {`
          @font-face {
            font-family: 'Micro';
            src: url(${Micro}) format('opentype');
            font-weight: bold;
            font-style: normal;
            font-display: swap;
          }
        `}
      </style>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        background: '#14171A',
        color: 'white',
        fontFamily: 'Micro, sans-serif',
        fontSize: '36px',
        opacity: 1,
        zIndex: 10000
      }}>
        {showContent && (
          <>
            <div style={{ marginBottom: '20px' }}>LOADING...</div>
            <div style={{ 
              width: '200px', 
              height: '20px', 
              background: '#111',
              border: '2px solid white',
              borderRadius: '10px',
              overflow: 'hidden',
              position: 'relative',
              marginBottom: '40px'  // Add some space below the loading bar
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
                fontSize: '15px',
                fontWeight: 'bold',
                fontFamily: 'Micro, sans-serif'
              }}>
                {progress.toFixed(0)}%
              </div>
            </div>
          </>
        )}
        {isIOS() && <IOSStartButton isVisible={showStartButton} onStart={onStart} />}
      </div>
    </Html>
  )
}

export default LoadingScreen;