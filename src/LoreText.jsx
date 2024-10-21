import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoreText = ({ isStarted }) => {
  const [visibleText, setVisibleText] = useState([]);
  const [cursor, setCursor] = useState('_');
  const [showCursor, setShowCursor] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(false);

  const loreTexts = useMemo(() => [
    "Welcome to Glitch Candies: Creatures",
    "We are stuck between galaxies...",
    "Magic worlds are assembling...",
    "Creatures morph and glitch into new forms...",
    "Tech and spells are generating...",
    "Epic bosses are spawning...",
    "Clues are scattered across...",
    "Intergalactic travel will continue soon...",
    "The journey is starting soon...",
  ], []);

  const scrambleChars = useMemo(() => 'Creatures!#$^&*()_+-=[]{}|;:,./<>?', []);
  const getRandomChar = useCallback(() => scrambleChars[Math.floor(Math.random() * scrambleChars.length)], [scrambleChars]);
  const cursorChars = useMemo(() => ['_', '..', ''], []);
  const getRandomCursor = useCallback(() => cursorChars[Math.floor(Math.random() * cursorChars.length)], [cursorChars]);

  const onTextComplete = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % loreTexts.length);
  }, [loreTexts.length]);

  useEffect(() => {
    if (!isStarted) return;

    const currentText = loreTexts[currentIndex];
    const totalDuration = 4000 + currentText.length * 50;
    const typingDuration = totalDuration - 500;
    const startTime = Date.now();

    const animationInterval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      
      if (elapsedTime < typingDuration) {
        // Show cursor when typing starts
        if (!cursorVisible) setCursorVisible(true);

        const progress = elapsedTime / typingDuration;
        const revealedChars = Math.floor(progress * currentText.length);
        const newVisibleText = currentText.split('').map((char, index) => {
          if (index < revealedChars) {
            const charProgress = (elapsedTime - (index * (typingDuration / currentText.length))) / (typingDuration / currentText.length);
            if (charProgress < 0.5) {
              return Math.random() > 0.7 ? getRandomChar() : char;
            }
            return char;
          } else if (index === revealedChars) {
            return Math.random() > 0.5 ? getRandomChar() : char;
          } else {
            return '';
          }
        });
        setVisibleText(newVisibleText);
        if (elapsedTime % 250 < 16) {
          setCursor(getRandomCursor());
        }
        setShowCursor(true);
        setIsFading(false);
      } else {
        setVisibleText(currentText.split(''));
        setShowCursor(false);
        if (elapsedTime >= totalDuration) {
          clearInterval(animationInterval);
          setTimeout(() => {
            setIsFading(true);
            onTextComplete();
            // Hide cursor when text is complete
            setCursorVisible(false);
          }, 1000);
        }
      }
    }, 33);

    return () => clearInterval(animationInterval);
  }, [currentIndex, loreTexts, getRandomChar, getRandomCursor, onTextComplete, isStarted, cursorVisible]);

  return (
    <AnimatePresence>
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: isFading ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: isFading ? 0.5 : 0.1 }}
        style={{
          position: 'absolute',
          bottom: '2.5vw',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          maxWidth: '600px',
          textAlign: 'center',
          fontFamily: 'Monorama, sans-serif',
          fontSize: '24px',
          color: '#03d7fc',
          opacity: 0.85,
          textShadow: '0 0 10px rgba(0,255,255,0.7)',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <p style={{
          margin: 0,
          padding: '8px',
          lineHeight: '1.5',
          cursor: 'default',
        }}>
          {visibleText.join('')}
          {showCursor && cursorVisible && (
            <span style={{
              animation: cursor === '_' ? 'caret 1s steps(1) infinite' : 'none',
            }}>{cursor}</span>
          )}
        </p>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoreText;
