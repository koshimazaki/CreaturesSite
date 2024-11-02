import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from './stores/zustandStore';

const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#_____';

export function LoopLoreText() {
  const [displayTexts, setDisplayTexts] = useState(['', '', '']);
  const [isVisible, setIsVisible] = useState(true);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const animationRef = useRef(null);
  const isCompleteRef = useRef(false);
  
  // Get text only once at mount
  const textLoopLore = useRef(
    useStore.getState().textLoopLore.map(text => 
      text.endsWith('') ? text : text + ''
    )
  ).current;

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
    const startTime = Date.now();
    const duration = 3000; // Duration per line
    const totalDuration = duration * textLoopLore.length;
    
    const animate = () => {
      if (isCompleteRef.current) return;
      
      const elapsed = Date.now() - startTime;
      const currentLine = Math.min(Math.floor(elapsed / duration), textLoopLore.length - 1);
      
      if (currentLine !== currentLineIndex) {
        setCurrentLineIndex(currentLine);
      }

      const lineProgress = Math.min((elapsed % duration) / duration, 1);
      const targetLength = textLoopLore[currentLine].length;
      const progress = Math.floor(lineProgress * targetLength);

      setDisplayTexts(prev => {
        const newTexts = [...prev];
        // Ensure previous lines stay complete
        for (let i = 0; i < currentLine; i++) {
          newTexts[i] = textLoopLore[i];
        }
        // Scramble current line
        newTexts[currentLine] = scramble(textLoopLore[currentLine], progress);
        return newTexts;
      });

      // Check if all lines are complete
      if (elapsed >= totalDuration && !isCompleteRef.current) {
        isCompleteRef.current = true;
        
        // Ensure last line is complete
        setDisplayTexts(prev => {
          const finalTexts = [...prev];
          finalTexts[textLoopLore.length - 1] = textLoopLore[textLoopLore.length - 1];
          return finalTexts;
        });
        
        // Add scramble effect before fade
        setTimeout(() => {
          let scrambleCount = 0;
          const scrambleInterval = setInterval(() => {
            scrambleCount++;
            setDisplayTexts(prev => 
              prev.map(text => scramble(text, 0))
            );
            
            if (scrambleCount >= 8) { // Limit scramble iterations
              clearInterval(scrambleInterval);
              setIsVisible(false);
            }
          }, 50);
        }, 5000);
      } else if (!isCompleteRef.current) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      isCompleteRef.current = true;
    };
  }, [textLoopLore, scramble]); // Reduced dependencies

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