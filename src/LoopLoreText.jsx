import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from './stores/zustandStore';

const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#_____';

export function LoopLoreText() {
  const [displayTexts, setDisplayTexts] = useState(['', '', '']);
  const [isVisible, setIsVisible] = useState(true);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const textLoopLore = useStore(state => state.textLoopLore);

  const scramble = useCallback((text, progress) => {
    const chars = SCRAMBLE_CHARS;
    return text
      .split('')
      .map((char, index) => {
        if (index < progress) return char;
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join('');
  }, []);

  useEffect(() => {
    let frameId;
    let startTime = Date.now();
    const duration = 2400; // Duration per line
    const totalDuration = duration * textLoopLore.length;
    let isComplete = false;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      
      if (!isComplete) {
        const currentLine = Math.min(Math.floor(elapsed / duration), textLoopLore.length - 1);
        
        if (currentLine !== currentLineIndex) {
          setCurrentLineIndex(currentLine);
        }

        const lineProgress = Math.min((elapsed % duration) / duration, 1);
        const targetLength = textLoopLore[currentLine].length;
        const progress = Math.floor(lineProgress * targetLength);

        setDisplayTexts(prev => {
          const newTexts = [...prev];
          newTexts[currentLine] = scramble(textLoopLore[currentLine], progress);
          return newTexts;
        });

        // Check if all lines are complete
        if (elapsed >= totalDuration) {
          isComplete = true;
          // Keep visible for 3 more seconds after completion
          setTimeout(() => setIsVisible(false),6000);
        } else {
          frameId = requestAnimationFrame(animate);
        }
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [textLoopLore, scramble]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'absolute',
            bottom: 'clamp(0.5vw, 0.8vw, 1vw)',
            left: 'clamp(15%, 25%, 35%)',
            zIndex: 2002,
            fontFamily: 'Monorama, sans-serif',
            fontSize: 'clamp(12px, 1vw, 16px)',
            color: '#03d7fc',
            textShadow: '0 0 10px rgba(0,255,255,0.7)',
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5em',
          }}
        >
          {displayTexts.map((text, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: index <= currentLineIndex ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              style={{
                whiteSpace: 'nowrap',
              }}
            >
              {text}
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LoopLoreText;