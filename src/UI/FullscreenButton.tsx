import React, { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'
import { Tooltip } from '@mui/material'
import { makeInteractive } from '../utils/styles.js';


const FullscreenButton: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }, [])

  // Handle key press for fullscreen
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === '/') {
      toggleFullscreen()
    } else if (event.key === 'Escape') {
      setIsFullscreen(false)
    }
  }, [toggleFullscreen])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  useEffect(() => {
    document.body.style.overflow = isFullscreen ? 'hidden' : ''
  }, [isFullscreen])

  const iconStyle = {
    fontSize: 'clamp(24px, 10vw, 56px)',
    color: 'white',
    opacity: 0.75,
    cursor: 'none',
  }

  return (
    <Tooltip title={`${isFullscreen ? "Exit" : "Enter"} Fullscreen (press '/')`} arrow placement="top">
      <motion.div
        className={makeInteractive.className}
        role={makeInteractive.role}
        whileTap={{ scale: 0.9 }}
        style={{
          position: 'absolute',
          bottom: '1vw',
          right: '1vw',
          zIndex: 1002,
          cursor: 'none',
        }}
        onClick={toggleFullscreen}
      >
        {isFullscreen ? (
          <FullscreenExitIcon style={iconStyle} className={makeInteractive.className} />
        ) : (
          <FullscreenIcon style={iconStyle} className={makeInteractive.className} />
        )}
      </motion.div>
    </Tooltip>
  )
}

export default FullscreenButton
