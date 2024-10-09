import React, { forwardRef, useEffect } from 'react'
import { Paper, Typography, Box, IconButton } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import { styled } from '@mui/system'
import CloseIcon from '@mui/icons-material/Close'

// Import the font using a relative path with ?url
import Exo2Light from '/src/assets/fonts/Exo2-Light.ttf?url'

// Preload the font
const preloadFont = () => {
  const font = new FontFace('Exo2-Light', `url(${Exo2Light})`);
  font.load().then((loadedFont) => {
    document.fonts.add(loadedFont);
  }).catch((error) => {
    console.error('Error loading font:', error);
  });
};

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

const sharedTypographyStyle = {
  fontFamily: '"Exo2-Light", "Exo", sans-serif',
  fontWeight: 300,
  fontStyle: 'normal',
  transition: 'all 0.3s ease-in-out', // Add this line
};

const InfoPanel = forwardRef(({ isInfoVisible, onClose }, ref) => {
  useEffect(() => {
    preloadFont();
  }, []);

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
          onClick={handleOverlayClick}
        >
          <StyledPaper
            ref={ref}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
            <Box sx={{ 
              opacity: 0.95, 
              fontSize: 15, 
              fontFamily: 'Exo2, Exo', 
              fontStyle: 'regular',
              width: '100%', // Ensure full width
              height: '100%', // Ensure full height
              display: 'flex',
              flexDirection: 'column',
            }}>
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  ...sharedTypographyStyle,
                  fontFamily: '"Exo", "Exo", sans-serif',
                  fontSize: { xs: '1.5rem', sm: '1.9505rem' }, 
                  opacity: 0.85 
                }}
              >
                GlitchCandies: Creatures
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontSize: { xs: '0.8rem', sm: '0.95rem' }, 
                  opacity: 0.95, 
                  fontWeight: 300,
                  fontStyle: 'normal', 
                  fontFamily: '"Exo2-Light", "Exo", sans-serif',
                  mb: 2 // margin bottom
                }}
              >
                GlitchCandies: Creatures is a unique blend of a game and audiovisual art, built using the immersive framework of Three.js and React Three Fiber.
              </Typography>
              <Typography 
                variant="body1"  
                sx={{ 
                  fontSize: { xs: '0.8rem', sm: '0.95rem' }, 
                  opacity: 0.95, 
                  fontWeight: 300,
                  fontStyle: 'normal', 
                  fontFamily: '"Exo2-Light", "Exo", sans-serif',
                  mb: 2
                }}
              >
                Set in a 3D world, it offers an experience that combines the charm of classic platformers with the unpredictability of generative art, 
                reminiscent of Kirby's playful exploration and Risk of Rain's engaging, replayable mechanics.
              </Typography>
              <Typography 
                variant="h6"  
                sx={{ 
                  fontSize: { xs: '1rem', sm: '1.25rem' }, 
                  opacity: 0.95, 
                  fontWeight: 300,
                  fontStyle: 'normal', 
                  fontFamily: '"Exo2-Light", "Exo", sans-serif',
                  mb: 1
                }}
              >
                Key Features:
              </Typography>
              <Box sx={{ opacity: 0.95, mb: 2 }}>
                <ul style={{ 
                  margin: 0, 
                  paddingLeft: '1.5rem',
                  fontSize: { xs: '0.8rem', sm: '0.95rem' },
                  fontFamily: '"Exo2-Light", "Exo", sans-serif',
                  fontWeight: 300,
                  lineHeight: 1.6
                }}>
                  <li>Creatures made from elemental forces that evolve as you progress</li>
                  <li>Interactive environments with glitch-inspired shaders and reactive particle systems</li>
                  <li>Spell collection, coop monster hunting, and epic boss encounters                </li>
                  <li>Aesthetics and pipelines shaped by cutting-edge generative AI
                  </li>
                  <li>Art based on the Glitch Candies and Supernatural Creatures NFT collections
                  </li>
                </ul>
              </Box>
              <Typography 
                variant="body1"  
                sx={{ 
                  fontSize: { xs: '0.8rem', sm: '0.95rem' }, 
                  opacity: 0.95, 
                  fontWeight: 300,
                  fontStyle: 'normal', 
                  fontFamily: '"Exo2-Light", "Exo", sans-serif',
                  mb: 2
                }}>
                We're actively developing both single-player and multiplayer modes, with a demo launching soon.
              </Typography>
            </Box>
            <style>{`
              @font-face {
                font-family: 'Exo2-Light';
                src: url(${Exo2Light}) format('truetype');
                font-weight: 300;
                font-style: normal;
                font-display: swap;
              }
            `}</style>
          </StyledPaper>
        </FullscreenOverlay>
      )}
    </AnimatePresence>
  );
});

export default InfoPanel