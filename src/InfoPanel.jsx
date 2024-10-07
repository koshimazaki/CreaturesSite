import React, { forwardRef } from 'react'
import { Paper, Typography, Box, IconButton } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import { styled } from '@mui/system'
import CloseIcon from '@mui/icons-material/Close'

// Import the font using a relative path with ?url
import Exo2Light from '/src/assets/fonts/Exo2-Light.ttf?url'

const MotionPaper = motion.create(Paper)

const FullscreenOverlay = styled(motion.div)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'rgba(0, 0, 0, 0.5)',
  zIndex: 10000, // Increased z-index
})

const StyledPaper = styled(MotionPaper)(({ theme }) => ({
  background: 'rgba(0, 0, 0, 0.8)',
  color: '#f0f7f9',
  padding: '40px',
  borderRadius: '20px',
  zIndex: 10001, // Ensure this is above the overlay
  fontSize: 15,
  opacity: 0.7,
  lineHeight: 2,
  width: '90%',
  maxWidth: '800px',
  maxHeight: '90vh',
  overflowY: 'auto',
  position: 'relative',
  '@media (max-width: 600px)': {
    padding: '20px',
    fontSize: 14,
    cursor: 'default',
    userSelect: 'none', // Prevent text selection
    WebkitUserSelect: 'none', // For Safari
    MozUserSelect: 'none', // For Firefox
    msUserSelect: 'none', // For IE/Edge

  },
}))

const InfoPanel = forwardRef(({ isInfoVisible, onClose }, ref) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isInfoVisible && (
        <FullscreenOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleOverlayClick} // Ensure this is set to the overlay
        >
          <StyledPaper
            ref={ref}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            elevation={24}
          >
            <IconButton
              onClick={onClose}
              sx={{
                position: 'absolute',
                right: 16,
                top: 16,
                color: '#f0f7f9',
              }}
            >
              <CloseIcon />
            </IconButton>
            <Box sx={{ opacity: 0.82, fontSize: 15, fontFamily: 'Exo2-Light, sans-serif' }}>
              <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '1.9505rem' } }}>
                GlitchCandies: Creatures
              </Typography>
              <Typography variant="body1" paragraph>
                GlitchCandies: Creatures is a unique blend of a game and audiovisual art, built using the immersive framework of Three.js and React Three Fiber.
              </Typography>
              <Typography variant="body1" paragraph>
                Set in a 3D world, it offers an experience that combines the charm of classic platformers with the unpredictability of generative art, 
                reminiscent of Kirby's playful exploration and Risk of Rain's engaging, replayable mechanics.
              </Typography>
              <Typography variant="h6" gutterBottom>
                Key Features:
              </Typography>
              <ul>
                <li>Creatures made from elemental forces that evolve as you progress</li>
                <li>Interactive environments with glitch-inspired shaders and reactive particle systems</li>
                <li>Spell collection, coop monster hunting, and epic boss encounters                </li>
                <li>Aesthetics and pipelines shaped by cutting-edge generative AI
                </li>
                <li>Art based on the Glitch Candies and Supernatural Creatures NFT collections
                </li>
              </ul>
              <Typography variant="body1" paragraph>
                We're actively developing both single-player and multiplayer modes, with a demo launching soon.
              </Typography>
            </Box>
            <style>{`
              @font-face {
                font-family: 'Exo2-Light';
                src: url(${Exo2Light}) format('truetype');
                font-weight: 300;
                font-style: normal;
              }
            `}</style>
          </StyledPaper>
        </FullscreenOverlay>
      )}
    </AnimatePresence>
  );
});

export default InfoPanel