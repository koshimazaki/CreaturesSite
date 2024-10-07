import React, { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'
import { Tooltip } from '@mui/material'

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

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFullscreen(false)
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = isFullscreen ? 'hidden' : ''
  }, [isFullscreen])

  const iconStyle = {
    fontSize: 'clamp(24px, 10vw, 56px)',
    color: 'white',
    opacity: 0.75,
  }

  return (
    <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"} arrow placement="left">
      <motion.div
        whileTap={{ scale: 0.9 }}
        style={{
          position: 'absolute',
          bottom: '1vw',
          right: '1vw',
          zIndex: 1002,
          cursor: 'pointer',
        }}
        onClick={toggleFullscreen}
      >
        {isFullscreen ? (
          <FullscreenExitIcon style={iconStyle} />
        ) : (
          <FullscreenIcon style={iconStyle} />
        )}
      </motion.div>
    </Tooltip>
  )
}

export default FullscreenButton