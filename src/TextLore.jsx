import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import Exo from './assets/fonts/Exo-SemiBold.ttf?url'



const TextLore = ({ texts, currentIndex, customFont, onTextComplete, style, isStarted }) => {
  const [visibleText, setVisibleText] = useState([]);
  const [cursor, setCursor] = useState('_');
  const [showCursor, setShowCursor] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const scrambleChars = useMemo(() => 'Creatures!#$^&*()_+-=[]{}|;:,./<>?', []);
  const getRandomChar = () => scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
  const cursorChars = useMemo(() => ['_', '..', ''], []);
  const getRandomCursor = () => cursorChars[Math.floor(Math.random() * cursorChars.length)];
  useEffect(() => {
    if (!isStarted || !texts || texts.length === 0) return;

    const currentText = texts[currentIndex];
    if (!currentText) return;

    console.log('Starting animation for text:', currentText); // Debug log

    const totalDuration = 4000 + currentText.length * 50;
    const typingDuration = totalDuration - 500;
    const startTime = Date.now();
    let animationCompleted = false;

    const animationInterval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      
      if (elapsedTime < typingDuration) {
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
      } else if (!animationCompleted) {
        setVisibleText(currentText.split(''));
        setShowCursor(false);
        animationCompleted = true;
        clearInterval(animationInterval);
        setTimeout(() => {
          setIsFading(true);
          onTextComplete();
        }, 1000);
      }
    }, 33);

    return () => {
      console.log('Clearing interval for text:', currentText); // Debug log
      clearInterval(animationInterval);
    };
  }, [currentIndex, texts, onTextComplete, isStarted]);

  if (!isStarted) return null;

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
          ...style, // This will override any duplicate properties from above
        }}
      >
        <p style={{
          margin: 0,
          padding: '8px',
          lineHeight: '1.5',
          cursor: 'default',
        }}>
          {visibleText.join('')}
          {showCursor && (
            <span style={{
              animation: cursor === '_' ? 'caret 1s steps(1) infinite' : 'none',
            }}>{cursor}</span>
          )}
        </p>
        <style>{`
          @font-face {
            font-family: 'Exo';
            src: url(${customFont}) format('truetype');
            font-weight: 600;
            font-style: normal;
          }
          @keyframes caret {
            50% { opacity: 0; }
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
};
export default TextLore;



