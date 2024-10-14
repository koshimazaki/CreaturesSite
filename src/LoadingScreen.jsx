import React from 'react'
import StartButton from './StartButton'
import { motion } from 'framer-motion'

import './styles.css'

import Micro from '/src/assets/fonts/Microgramma_D_Extended_Bold.otf?url'
import Monorama from '/src/assets/fonts/Monorama-Regular.woff2?url'

const LoadingScreen = ({ isLoaded, progress, onStart, audioPlayerRef }) => {
  return (
    <div className="micro-font" style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#14171A',
      color: 'white',
      // fontFamily: `${Micro}, sans-serif`,
      fontSize: '40px',
      zIndex: 9999,
    }}>
      <style>
        {`
          @font-face {
            font-family: 'Monorama';
            src: url(${Monorama}) format('woff2');
            font-weight: normal;
            font-style: normal;
          }
        `}
      </style>
      <div style={{ marginBottom: '20px' }}>LOADING...</div>
      <div style={{ 
        width: '250px', 
        height: '30px', 
        background: '#111',
        border: '2px solid white',
        borderRadius: '10px',
        overflow: 'hidden',
        position: 'relative',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'black',
        // fontFamily: `${Micro}, sans-serif`,
        fontSize: '14px',
        fontFamily: 'Monorama, sans-serif',
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: 'white',
          transition: 'width 0.3s ease-out',
          position: 'absolute',
          left: 0,
          top: 0,
        }} />
        <span style={{ 
          position: 'relative', 
          zIndex: 1,
          fontSize: progress === 100 ? '28px' : '24px',
          fontWeight: 'bold',
        }}>{`${Math.round(progress)}%`}</span>
      </div>
      <div style={{
        marginBottom: '20px',
        fontSize: '28px',
        fontFamily: 'Monorama, sans-serif',
        fontWeight: 'bold',
      }}>
        {isLoaded ? 'LETS GO!' : ''}
      </div>
      <StartButton 
        isVisible={isLoaded} 
        onStart={onStart} 
        audioPlayerRef={audioPlayerRef}
      />
    </div>
  )
}

export default LoadingScreen
