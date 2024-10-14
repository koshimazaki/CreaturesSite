import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import Exo from './assets/fonts/Exo-SemiBold.ttf?url'
const TextLore = ({ texts, currentIndex, customFont, onTextComplete, style }) => {
  const [visibleText, setVisibleText] = useState([]);
  const [cursor, setCursor] = useState('_');
  const [showCursor, setShowCursor] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const scrambleChars = useMemo(() => 'Creatures!#$^&*()_+-=[]{}|;:,./<>?', []);
  const getRandomChar = () => scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
  const cursorChars = useMemo(() => ['_', '..', ''], []);
  const getRandomCursor = () => cursorChars[Math.floor(Math.random() * cursorChars.length)];
  useEffect(() => {
    const currentText = texts[currentIndex];
    const totalDuration = 4000 + currentText.length * 50;
    const typingDuration = totalDuration - 500;
    const startTime = Date.now();
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
      } else {
        setVisibleText(currentText.split(''));
        setShowCursor(false);
        if (elapsedTime >= totalDuration) {
          clearInterval(animationInterval);
          setTimeout(() => {
            setIsFading(true);
            onTextComplete();
          }, 1000);
        }
      }
    }, 33);
    return () => clearInterval(animationInterval);
  }, [currentIndex, texts, scrambleChars, cursorChars, onTextComplete]);
  return (
    <AnimatePresence>
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: isFading ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: isFading ? 0.5 : 0.1 }}
        className="text-lore"
        style={{
          position: 'absolute',
          bottom: 'clamp(4vh, 5vh, 8vh)',
          right: '7vw',
          width: '50%',
          maxWidth: '800px',
          pointerEvents: 'none',
          userSelect: 'none', // Prevent text selection
          WebkitUserSelect: 'none', // For Safari
          MozUserSelect: 'none', // For Firefox
          msUserSelect: 'none', // For IE/Edge
          zIndex: 900,
          // Merge the passed style prop here
          ...style,
        }}
      >
        <p style={{
          fontSize: 'clamp(16px, 2.5vw, 32px)', // Increased font size
          color: 'white',
          opacity: '0.7',
          textTransform: 'uppercase',
          fontFamily: "'Exo', sans-serif",
          margin: 0,
          padding: '8px',
          textAlign: 'left',
          wordWrap: 'break-word',
          lineHeight: '1.5',
          cursor: 'default', // Change cursor to default
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
          /* Hide Google Translate icon */
          .goog-te-gadget {
            display: none !important;
          }
          .goog-te-banner-frame {
            display: none !important;
          }
          body {
            top: 0 !important;
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
};
export default TextLore;
