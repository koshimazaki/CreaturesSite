import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ColorTransition = ({ isTransitioning, backgroundImage = '/1741-fs8.png' }) => {
  return (
    <div 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1000,
        pointerEvents: 'none',
      }}
    >
      <AnimatePresence>
        {isTransitioning && (
          <>
            {/* Base background image */}
            <motion.div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
            
            {/* Add subtle black overlay */}
            <motion.div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
            
            {/* Grain overlay - Method 1: CSS Pattern */}
            <motion.div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `
                  radial-gradient(black 1px, transparent 1px), 
                  radial-gradient(black 1px, transparent 1px)
                `,
                backgroundSize: '4px 4px',
                backgroundPosition: '0 0, 2px 2px',
                opacity: 0.05,
                mixBlendMode: 'multiply',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.05 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.75, delay: 0.1 }}
            />

            {/* Alternative Noise Method - SVG Filter */}
            <motion.div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%" height="100%" filter="url(%23noise)"/%3E%3C/svg%3E")',
                opacity: 0.08,
                mixBlendMode: 'overlay',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.08 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.75, delay: 0.1 }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ColorTransition;
